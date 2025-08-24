"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const index_1 = require("./index");
const Category_1 = __importDefault(require("./entities/Category"));
const Color_1 = __importDefault(require("./entities/Color"));
const Product_1 = __importDefault(require("./entities/Product"));
const stripe_1 = __importDefault(require("../stripe"));
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
function getRandomName(categoryName) {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    return `${adj} ${categoryName} ${noun}`;
}
const createProductsForCategory = async (categoryId, categoryName, colors) => {
    const products = [];
    for (let i = 0; i < 10; i++) {
        const name = getRandomName(categoryName);
        const description = `This is a ${categoryName} that is ${name}. Made with high-quality materials for comfort and style.`;
        const price = Math.floor(Math.random() * 100) + 10;
        // Randomly assign colors (or no colors)
        const randomColors = Math.random() > 0.3 ?
            [colors[Math.floor(Math.random() * colors.length)]._id] :
            [];
        const stripeProduct = await stripe_1.default.products.create({
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
    await Product_1.default.insertMany(products);
};
const seed = async () => {
    await (0, index_1.connectDB)();
    await Category_1.default.deleteMany({});
    await Color_1.default.deleteMany({});
    await Product_1.default.deleteMany({});
    // Create colors
    const createdColors = await Color_1.default.insertMany(COLORS);
    console.log(`Created ${createdColors.length} colors`);
    // Create categories only (no products)
    for (const name of CATEGORY_NAMES) {
        const category = await Category_1.default.create({ name });
        console.log(`Seeded category: ${name}`);
    }
    console.log("Seeding complete - Categories and Colors only. No products created.");
    process.exit(0);
};
seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map