import Product from "../infrastructure/db/entities/Product";
import ValidationError from "../domain/errors/validation-error";
import NotFoundError from "../domain/errors/not-found-error";

import { Request, Response, NextFunction } from "express";
import { CreateProductDTO } from "../domain/dto/product";
import { randomUUID } from "crypto";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import S3 from "../infrastructure/s3";
import stripe from "../infrastructure/stripe";

const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { 
      categoryId, 
      colorId, 
      sortBy = 'name', 
      sortOrder = 'asc',
      page = 1,
      limit = 20
    } = req.query;

    // Build filter object
    const filter: any = {};
    
    if (categoryId) {
      filter.categoryId = categoryId;
    }
    
    if (colorId) {
      // Filter products that have the specified color in their colorIds array
      filter.colorIds = { $in: [colorId] };
    }

    // Build sort object
    const sort: any = {};
    if (sortBy === 'price') {
      sort.price = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.name = sortOrder === 'desc' ? -1 : 1;
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query with population
    const products = await Product.find(filter)
      .populate('categoryId', 'name')
      .populate('colorIds', 'name hexCode')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    console.log(`Found ${products.length} products with filters:`, {
      categoryId,
      colorId,
      sortBy,
      sortOrder,
      total
    });

    res.json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

const getProductsForSearchQuery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search } = req.query;
    
    console.log('Search query received:', search);
    console.log('Search query type:', typeof search);
    console.log('All query params:', req.query);
    
    if (!search || typeof search !== 'string' || search.trim().length === 0) {
      console.log('No valid search query provided, returning empty array');
      return res.json([]);
    }

    const searchTerm = search.trim();
    console.log('Searching for:', searchTerm);

    // First, let's check if we have any products at all
    const totalProducts = await Product.countDocuments();
    console.log(`Total products in database: ${totalProducts}`);

    if (totalProducts === 0) {
      console.log('No products found in database');
      return res.json([]);
    }

    // Get a sample of products to see what we have
    const sampleProducts = await Product.find().limit(5);
    console.log('Sample products:', sampleProducts.map(p => ({ name: p.name, id: p._id })));

    // Use simple text search instead of Atlas Search for now
    const results = await Product.find({
      name: { $regex: searchTerm, $options: 'i' } // Case-insensitive regex search
    })
    .populate('categoryId', 'name')
    .populate('colorIds', 'name hexCode')
    .limit(10); // Limit results to 10 items

    console.log(`Search for "${searchTerm}" returned ${results.length} results`);
    console.log('Results:', results.map(p => p.name));
    
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    // Return empty array instead of throwing error
    res.json([]);
  }
};

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = CreateProductDTO.safeParse(req.body);
    if (!result.success) {
      throw new ValidationError(result.error.message);
    }

    const stripeProduct = await stripe.products.create({
      name: result.data.name,
      description: result.data.description,
      default_price_data: {
        currency: "usd",
        unit_amount: result.data.price * 100,
      },
    });

    await Product.create({ ...result.data, stripePriceId: stripeProduct.default_price });
    res.status(201).send();
  } catch (error) {
    next(error);
  }
};

const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId)
      .populate('categoryId', 'name')
      .populate('colorIds', 'name hexCode')
      .populate({
        path: 'reviews',
        populate: {
          path: 'userId',
          select: 'firstName lastName'
        }
      });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const { price, stock, colorIds } = req.body;

    console.log('Update product request:', { productId, price, stock, colorIds });

    // Find the product first
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      throw new NotFoundError('Product not found');
    }

    // Build update object with only provided fields
    const updateData: any = {};
    
    if (price !== undefined) {
      updateData.price = Number(price);
    }
    
    if (stock !== undefined) {
      updateData.stock = Number(stock);
    }
    
    if (colorIds !== undefined) {
      updateData.colorIds = colorIds;
    }

    console.log('Updating product with data:', updateData);

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    ).populate('categoryId', 'name')
     .populate('colorIds', 'name hexCode');

    if (!updatedProduct) {
      throw new NotFoundError('Product not found');
    }

    console.log('Product updated successfully:', updatedProduct.name);

    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

const deleteProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const uploadProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body;
    const { fileType } = body;

    const id = randomUUID();

    const url = await getSignedUrl(
      S3,
      new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
        Key: id,
        ContentType: fileType,
      }),
      {
        expiresIn: 60,
      }
    );

    res.status(200).json({
      url,
      publicURL: `${process.env.CLOUDFLARE_PUBLIC_DOMAIN}/${id}`,
    });
  } catch (error) {
    next(error);
  }
};

// Alias for uploadProductImage to match frontend expectations
const putImage = uploadProductImage;

const serveImageWithCORS = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { imageId } = req.params;
    
    console.log('Serving image with ID:', imageId);
    
    if (!imageId) {
      return res.status(400).json({ error: "Image ID is required" });
    }

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Get the image from R2
    const command = new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
      Key: imageId,
    });

    console.log('Fetching image from R2 with key:', imageId);

    const { Body, ContentType } = await S3.send(command);
    
    if (!Body) {
      console.log('Image not found in R2');
      throw new NotFoundError("Image not found");
    }

    console.log('Image found, content type:', ContentType);

    // Set content type
    res.setHeader('Content-Type', ContentType || 'image/jpeg');
    
    // Stream the image using Node.js streams
    if (Body && typeof (Body as any).pipe === 'function') {
      // If Body is a readable stream
      (Body as any).pipe(res);
    } else if (Body && typeof (Body as any).transformToWebStream === 'function') {
      // If Body is a web stream, convert to Node.js stream
      const nodeStream = require('stream').Readable.fromWeb(Body as any);
      nodeStream.pipe(res);
    } else {
      // Fallback: collect chunks and send as buffer
      const chunks: Buffer[] = [];
      for await (const chunk of Body as any) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      res.send(buffer);
    }
  } catch (error) {
    console.error('Error serving image:', error);
    next(error);
  }
};

export {
  createProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProduct,
  getProductsForSearchQuery,
  uploadProductImage,
  putImage,
  serveImageWithCORS,
};
