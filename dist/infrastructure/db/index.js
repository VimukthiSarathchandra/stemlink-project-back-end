"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const MONGODB_URL = process.env.MONGODB_URL;
        if (!MONGODB_URL) {
            throw new Error("MongoDB connection string is not defined");
        }
        await mongoose_1.default.connect(MONGODB_URL);
        console.log("Connected to the Database");
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("MongoDB connection failed:", error.message);
            process.exit(1);
        }
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=index.js.map