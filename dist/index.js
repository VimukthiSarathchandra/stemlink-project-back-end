"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const order_1 = require("./api/order");
const color_1 = __importDefault(require("./api/color"));
const payment_1 = require("./api/payment");
const sales_1 = require("./api/sales");
const review_1 = __importDefault(require("./api/review"));
const global_error_handling_middleware_1 = __importDefault(require("./api/middleware/global-error-handling-middleware"));
const db_1 = require("./infrastructure/db");
const Category_1 = __importDefault(require("./infrastructure/db/entities/Category"));
const Color_1 = __importDefault(require("./infrastructure/db/entities/Color"));
const app = (0, express_1.default)();
// Function to ensure basic data exists
const ensureBasicData = async () => {
    try {
        // Check if we have any categories
        const categoryCount = await Category_1.default.countDocuments();
        if (categoryCount === 0) {
            console.log("No categories found, creating basic categories...");
            await Category_1.default.insertMany([
                { name: "Electronics", isActive: true },
                { name: "Clothing", isActive: true },
                { name: "Home & Garden", isActive: true }
            ]);
            console.log("Basic categories created");
        }
        // Check if we have any colors
        const colorCount = await Color_1.default.countDocuments();
        if (colorCount === 0) {
            console.log("No colors found, creating basic colors...");
            await Color_1.default.insertMany([
                { name: "Red", hexCode: "#FF0000", isActive: true },
                { name: "Blue", hexCode: "#0000FF", isActive: true },
                { name: "Green", hexCode: "#00FF00", isActive: true },
                { name: "Black", hexCode: "#000000", isActive: true },
                { name: "White", hexCode: "#FFFFFF", isActive: true }
            ]);
            console.log("Basic colors created");
        }
    }
    catch (error) {
        console.error("Error ensuring basic data:", error);
    }
};
// Connect to database (like local setup)
console.log("Attempting to connect to database...");
(0, db_1.connectDB)().then(async () => {
    console.log("Database connection successful");
    await ensureBasicData();
}).catch((error) => {
    console.error("Database connection failed:", error);
    console.log("Continuing without database connection...");
});
console.log("Backend server starting...");
// CORS configuration - allow all origins for now (like local setup)
const allowedOrigins = [
    "https://fed-2-front-end.vercel.app",
    "https://fed-2-front-end-thilanvimukthi123-2502s-projects.vercel.app",
    "https://fed-2-front-7cseeookm-thilanvimukthi123-2502s-projects.vercel.app",
    "https://fed-2-back-qcjcchni5-thilanvimukthi123-2502s-projects.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8000",
    "*" // Allow all origins like local development
];
// Add FRONTEND_URL from environment if it exists
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}
const corsOptions = {
    origin: true, // Allow all origins like local development
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept']
};
// Basic middleware
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// Clerk middleware setup (commented out for now to fix CORS first)
// app.use(clerkExpressWithAuth());
// Root route
app.get("/", (req, res) => {
    console.log("Root route accessed");
    res.json({
        message: "Stemlink Backend API",
        version: "1.0.0",
        status: "running",
        timestamp: new Date().toISOString(),
        cors: {
            origin: corsOptions.origin,
            enabled: true
        }
    });
});
// Health check
app.get("/api/health", (req, res) => {
    console.log("Health check accessed");
    res.json({
        status: "OK",
        message: "Server is running",
        timestamp: new Date().toISOString()
    });
});
// Test endpoint
app.get("/api/test", (req, res) => {
    console.log("Test endpoint accessed");
    res.json({
        message: "Test endpoint working",
        timestamp: new Date().toISOString(),
        cors: {
            allowedOrigins: allowedOrigins,
            frontendUrl: process.env.FRONTEND_URL
        },
        database: {
            mongodbUrl: process.env.MONGODB_URL ? "Configured" : "Not configured"
        }
    });
});
// Simple products test endpoint (bypass database)
app.get("/api/products/simple", (req, res) => {
    console.log("Simple products endpoint accessed");
    res.json({
        products: [
            {
                _id: "1",
                name: "Test Product 1",
                price: 99.99,
                description: "Simple test product",
                categoryId: "1",
                colorIds: ["1"],
                stock: 10,
                images: []
            }
        ],
        pagination: {
            page: 1,
            limit: 10,
            total: 1,
            pages: 1
        }
    });
});
// Simple categories test endpoint (bypass database)
app.get("/api/categories/simple", (req, res) => {
    console.log("Simple categories endpoint accessed");
    res.json([
        {
            _id: "1",
            name: "Test Category",
            isActive: true
        }
    ]);
});
// Simple categories test endpoint
app.get("/api/categories/test", (req, res) => {
    console.log("Categories test endpoint accessed");
    res.json([
        {
            _id: "1",
            name: "Test Category",
            isActive: true
        }
    ]);
});
// Manual test data for products
app.get("/api/products/test", (req, res) => {
    console.log("Products test endpoint accessed");
    res.json({
        products: [
            {
                _id: "1",
                name: "Test Product 1",
                price: 99.99,
                description: "This is a test product from the backend",
                categoryId: "1",
                colorIds: ["1"],
                stock: 10,
                images: ["https://via.placeholder.com/300x300?text=Product+1"],
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                _id: "2",
                name: "Test Product 2",
                price: 149.99,
                description: "Another test product with more details",
                categoryId: "1",
                colorIds: ["2"],
                stock: 5,
                images: ["https://via.placeholder.com/300x300?text=Product+2"],
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                _id: "3",
                name: "Premium Product",
                price: 299.99,
                description: "A premium test product with high quality",
                categoryId: "2",
                colorIds: ["1", "3"],
                stock: 15,
                images: ["https://via.placeholder.com/300x300?text=Premium+Product"],
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ],
        pagination: {
            page: 1,
            limit: 10,
            total: 3,
            pages: 1
        }
    });
});
// Manual test data for categories
app.get("/api/categories/manual", (req, res) => {
    console.log("Manual categories endpoint accessed");
    res.json([
        {
            _id: "1",
            name: "Electronics",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            _id: "2",
            name: "Clothing",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            _id: "3",
            name: "Home & Garden",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ]);
});
// Use the actual API routers
console.log("Setting up API routes...");
// Override the main routes with public endpoints for now
app.get("/api/products", async (req, res) => {
    console.log("Public products endpoint accessed");
    try {
        // Try to use the actual product router
        const { getAllProducts } = require("./application/product");
        await getAllProducts(req, res, () => { });
    }
    catch (error) {
        console.error("Error in products endpoint:", error);
        // Fallback to simple data
        res.json({
            products: [
                {
                    _id: "1",
                    name: "Test Product 1",
                    price: 99.99,
                    description: "Public test product",
                    categoryId: "1",
                    colorIds: ["1"],
                    stock: 10,
                    images: []
                }
            ],
            pagination: {
                page: 1,
                limit: 10,
                total: 1,
                pages: 1
            }
        });
    }
});
app.get("/api/categories", async (req, res) => {
    console.log("Public categories endpoint accessed");
    try {
        // Try to use the actual category router
        const { getAllCategories } = require("./application/category");
        await getAllCategories(req, res, () => { });
    }
    catch (error) {
        console.error("Error in categories endpoint:", error);
        // Fallback to simple data
        res.json([
            {
                _id: "1",
                name: "Test Category",
                isActive: true
            }
        ]);
    }
});
// Comment out the actual routers for now
// app.use("/api/products", productRouter);
// console.log("Products route registered (using database)");
// app.use("/api/categories", categoryRouter);
// console.log("Categories route registered (using database)");
// Add error handling for database routes
app.use((err, req, res, next) => {
    console.error("Database route error:", err);
    res.status(500).json({
        error: "Database error",
        message: err.message,
        timestamp: new Date().toISOString()
    });
});
app.use("/api/colors", color_1.default);
console.log("Colors route registered");
app.use("/api/orders", order_1.orderRouter);
console.log("Orders route registered");
app.use("/api/payments", payment_1.paymentsRouter);
console.log("Payments route registered");
app.use("/api/sales", sales_1.salesRouter);
console.log("Sales route registered");
app.use("/api/reviews", review_1.default);
console.log("Reviews route registered");
// 404 handler
app.use("*", (req, res) => {
    console.log("404 - Route not found:", req.method, req.originalUrl);
    res.status(404).json({
        error: "Route not found",
        message: `Cannot ${req.method} ${req.originalUrl}`,
        availableEndpoints: [
            "/",
            "/api/health",
            "/api/test",
            "/api/products",
            "/api/categories",
            "/api/colors",
            "/api/orders",
            "/api/payments",
            "/api/sales",
            "/api/reviews"
        ]
    });
});
// Global error handling middleware (must be last)
app.use(global_error_handling_middleware_1.default);
console.log("Backend server configured successfully");
exports.default = app;
//# sourceMappingURL=index.js.map