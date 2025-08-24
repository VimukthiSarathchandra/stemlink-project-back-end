import "dotenv/config";
import { connectDB } from "./index";
import Category from "./entities/Category";
import Color from "./entities/Color";
import Product from "./entities/Product";
import stripe from "../stripe";

const CATEGORY_NAMES = ["Socks", "Pants", "T-shirts", "Shoes", "Shorts"];

const COLORS = [
  { name: "Black", hexCode: "#000000" },
  { name: "White", hexCode: "#FFFFFF" },
  { name: "Red", hexCode: "#FF0000" },
  { name: "Blue", hexCode: "#0000FF" },
  { name: "Green", hexCode: "#008000" },
  { name: "Yellow", hexCode: "#FFFF00" },
  { name: "Purple", hexCode: "#800080" },
  { name: "Orange", hexCode: "#FFA500" },
  { name: "Pink", hexCode: "#FFC0CB" },
  { name: "Brown", hexCode: "#A52A2A" },
  { name: "Gray", hexCode: "#808080" },
  { name: "Navy", hexCode: "#000080" },
];

const ADJECTIVES = [
  "Classic", "Sporty", "Elegant", "Comfy", "Trendy", "Cool", "Premium", "Casual", "Bold", "Vivid",
  "Soft", "Durable", "Lightweight", "Cozy", "Modern", "Vintage", "Chic", "Sleek", "Eco", "Urban"
];
const NOUNS = [
  "Runner", "Style", "Fit", "Wear", "Edition", "Line", "Collection", "Piece", "Design", "Model",
  "Comfort", "Edge", "Wave", "Touch", "Look", "Trend", "Vibe", "Aura", "Motion", "Essence"
];

function getRandomName(categoryName: string) {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj} ${categoryName} ${noun}`;
}

const createProductsForCategory = async (categoryId: any, categoryName: string, colors: any[]) => {
  const products = [];
  for (let i = 0; i < 10; i++) {

    const name = getRandomName(categoryName);
    const description = `This is a ${categoryName} that is ${name}. Made with high-quality materials for comfort and style.`;
    const price = Math.floor(Math.random() * 100) + 10;
    
    // Randomly assign colors (or no colors)
    const randomColors = Math.random() > 0.3 ? 
      [colors[Math.floor(Math.random() * colors.length)]._id] : 
      [];

    const stripeProduct = await stripe.products.create({
      name: name,
      description: description,
      default_price_data: {
        currency: "usd",
        unit_amount: price * 100,
      },
    });

    products.push({
      categoryId,
      colorIds: randomColors,
      name: name,
      price: price,
      description: description,
      image: `https://via.placeholder.com/150?text=${encodeURIComponent(categoryName)}`,
      stock: Math.floor(Math.random() * 50) + 1,
      reviews: [],
      stripePriceId: stripeProduct.default_price
    });
  }
  await Product.insertMany(products);
};

const seed = async () => {
  await connectDB();
  await Category.deleteMany({});
  await Color.deleteMany({});
  await Product.deleteMany({});

  // Create colors
  const createdColors = await Color.insertMany(COLORS);
  console.log(`Created ${createdColors.length} colors`);

  // Create categories and products
  for (const name of CATEGORY_NAMES) {
    const category = await Category.create({ name });
    console.log(`Seeded category: ${name}`);
    
    // Create products for this category
    await createProductsForCategory(category._id, name, createdColors);
    console.log(`Created 10 products for category: ${name}`);
  }

  console.log("Seeding complete - Categories, Colors, and Products created.");
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
}); 