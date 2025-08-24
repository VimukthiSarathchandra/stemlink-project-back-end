"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveImageWithCORS = exports.putImage = exports.uploadProductImage = exports.getProductsForSearchQuery = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.deleteProductById = exports.createProduct = void 0;
const Product_1 = __importDefault(require("../infrastructure/db/entities/Product"));
const validation_error_1 = __importDefault(require("../domain/errors/validation-error"));
const not_found_error_1 = __importDefault(require("../domain/errors/not-found-error"));
const product_1 = require("../domain/dto/product");
const crypto_1 = require("crypto");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_1 = __importDefault(require("../infrastructure/s3"));
const stripe_1 = __importDefault(require("../infrastructure/stripe"));
const getAllProducts = async (req, res, next) => {
    try {
        const { categoryId, colorId, sortBy = 'name', sortOrder = 'asc', page = 1, limit = 20 } = req.query;
        // Build filter object
        const filter = {};
        if (categoryId) {
            filter.categoryId = categoryId;
        }
        if (colorId) {
            // Filter products that have the specified color in their colorIds array
            filter.colorIds = { $in: [colorId] };
        }
        // Build sort object
        const sort = {};
        if (sortBy === 'price') {
            sort.price = sortOrder === 'desc' ? -1 : 1;
        }
        else {
            sort.name = sortOrder === 'desc' ? -1 : 1;
        }
        // Calculate pagination
        const skip = (Number(page) - 1) * Number(limit);
        // Execute query with population
        const products = await Product_1.default.find(filter)
            .populate('categoryId', 'name')
            .populate('colorIds', 'name hexCode')
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));
        // Get total count for pagination
        const total = await Product_1.default.countDocuments(filter);
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
    }
    catch (error) {
        next(error);
    }
};
exports.getAllProducts = getAllProducts;
const getProductsForSearchQuery = async (req, res, next) => {
    try {
        const { search } = req.query;
        console.log('Search query received:', search);
        console.log('Search query type:', typeof search);
        console.log('All query params:', req.query);
        if (!search || typeof search !== 'string' || search.trim().length === 0) {
            console.log('No valid search query provided, returning empty array');
            res.json([]);
            return;
        }
        const searchTerm = search.trim();
        console.log('Searching for:', searchTerm);
        // First, let's check if we have any products at all
        const totalProducts = await Product_1.default.countDocuments();
        console.log(`Total products in database: ${totalProducts}`);
        if (totalProducts === 0) {
            console.log('No products found in database');
            res.json([]);
            return;
        }
        // Get a sample of products to see what we have
        const sampleProducts = await Product_1.default.find().limit(5);
        console.log('Sample products:', sampleProducts.map(p => ({ name: p.name, id: p._id })));
        // Use simple text search instead of Atlas Search for now
        const results = await Product_1.default.find({
            name: { $regex: searchTerm, $options: 'i' } // Case-insensitive regex search
        })
            .populate('categoryId', 'name')
            .populate('colorIds', 'name hexCode')
            .limit(10); // Limit results to 10 items
        console.log(`Search for "${searchTerm}" returned ${results.length} results`);
        console.log('Results:', results.map(p => p.name));
        res.json(results);
    }
    catch (error) {
        console.error('Search error:', error);
        // Return empty array instead of throwing error
        res.json([]);
    }
};
exports.getProductsForSearchQuery = getProductsForSearchQuery;
const createProduct = async (req, res, next) => {
    try {
        const result = product_1.CreateProductDTO.safeParse(req.body);
        if (!result.success) {
            throw new validation_error_1.default(result.error.message);
        }
        const stripeProduct = await stripe_1.default.products.create({
            name: result.data.name,
            description: result.data.description,
            default_price_data: {
                currency: "usd",
                unit_amount: result.data.price * 100,
            },
        });
        await Product_1.default.create({ ...result.data, stripePriceId: stripeProduct.default_price });
        res.status(201).send();
    }
    catch (error) {
        next(error);
    }
};
exports.createProduct = createProduct;
const getProductById = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await Product_1.default.findById(productId)
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
            throw new not_found_error_1.default("Product not found");
        }
        res.status(200).json(product);
    }
    catch (error) {
        next(error);
    }
};
exports.getProductById = getProductById;
const updateProduct = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { price, stock, colorIds } = req.body;
        console.log('Update product request:', { productId, price, stock, colorIds });
        // Find the product first
        const existingProduct = await Product_1.default.findById(productId);
        if (!existingProduct) {
            throw new not_found_error_1.default('Product not found');
        }
        // Build update object with only provided fields
        const updateData = {};
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
        const updatedProduct = await Product_1.default.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true }).populate('categoryId', 'name')
            .populate('colorIds', 'name hexCode');
        if (!updatedProduct) {
            throw new not_found_error_1.default('Product not found');
        }
        console.log('Product updated successfully:', updatedProduct.name);
        res.json(updatedProduct);
    }
    catch (error) {
        next(error);
    }
};
exports.updateProduct = updateProduct;
const deleteProductById = async (req, res, next) => {
    try {
        const product = await Product_1.default.findByIdAndDelete(req.params.id);
        if (!product) {
            throw new not_found_error_1.default("Product not found");
        }
        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProductById = deleteProductById;
const uploadProductImage = async (req, res, next) => {
    try {
        const body = req.body;
        const { fileType } = body;
        const id = (0, crypto_1.randomUUID)();
        const url = await (0, s3_request_presigner_1.getSignedUrl)(s3_1.default, new client_s3_1.PutObjectCommand({
            Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
            Key: id,
            ContentType: fileType,
        }), {
            expiresIn: 60,
        });
        res.status(200).json({
            url,
            publicURL: `${process.env.CLOUDFLARE_PUBLIC_DOMAIN}/${id}`,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.uploadProductImage = uploadProductImage;
// Alias for uploadProductImage to match frontend expectations
const putImage = uploadProductImage;
exports.putImage = putImage;
const serveImageWithCORS = async (req, res, next) => {
    try {
        const { imageId } = req.params;
        console.log('Serving image with ID:', imageId);
        if (!imageId) {
            res.status(400).json({ error: "Image ID is required" });
            return;
        }
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            res.status(200).end();
            return;
        }
        // Get the image from R2
        const command = new client_s3_1.GetObjectCommand({
            Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
            Key: imageId,
        });
        console.log('Fetching image from R2 with key:', imageId);
        const { Body, ContentType } = await s3_1.default.send(command);
        if (!Body) {
            console.log('Image not found in R2');
            throw new not_found_error_1.default("Image not found");
        }
        console.log('Image found, content type:', ContentType);
        // Set content type
        res.setHeader('Content-Type', ContentType || 'image/jpeg');
        // Stream the image using Node.js streams
        if (Body && typeof Body.pipe === 'function') {
            // If Body is a readable stream
            Body.pipe(res);
        }
        else if (Body && typeof Body.transformToWebStream === 'function') {
            // If Body is a web stream, convert to Node.js stream
            const nodeStream = require('stream').Readable.fromWeb(Body);
            nodeStream.pipe(res);
        }
        else {
            // Fallback: collect chunks and send as buffer
            const chunks = [];
            for await (const chunk of Body) {
                chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);
            res.send(buffer);
        }
    }
    catch (error) {
        console.error('Error serving image:', error);
        next(error);
    }
};
exports.serveImageWithCORS = serveImageWithCORS;
//# sourceMappingURL=product.js.map