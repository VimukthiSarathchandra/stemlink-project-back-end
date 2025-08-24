import mongoose from "mongoose";
declare const Product: mongoose.Model<{
    categoryId: mongoose.Types.ObjectId;
    name: string;
    colorIds: mongoose.Types.ObjectId[];
    description: string;
    price: number;
    stripePriceId: string;
    image: string;
    stock: number;
    reviews: mongoose.Types.ObjectId[];
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    categoryId: mongoose.Types.ObjectId;
    name: string;
    colorIds: mongoose.Types.ObjectId[];
    description: string;
    price: number;
    stripePriceId: string;
    image: string;
    stock: number;
    reviews: mongoose.Types.ObjectId[];
}, {}> & {
    categoryId: mongoose.Types.ObjectId;
    name: string;
    colorIds: mongoose.Types.ObjectId[];
    description: string;
    price: number;
    stripePriceId: string;
    image: string;
    stock: number;
    reviews: mongoose.Types.ObjectId[];
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    categoryId: mongoose.Types.ObjectId;
    name: string;
    colorIds: mongoose.Types.ObjectId[];
    description: string;
    price: number;
    stripePriceId: string;
    image: string;
    stock: number;
    reviews: mongoose.Types.ObjectId[];
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    categoryId: mongoose.Types.ObjectId;
    name: string;
    colorIds: mongoose.Types.ObjectId[];
    description: string;
    price: number;
    stripePriceId: string;
    image: string;
    stock: number;
    reviews: mongoose.Types.ObjectId[];
}>, {}> & mongoose.FlatRecord<{
    categoryId: mongoose.Types.ObjectId;
    name: string;
    colorIds: mongoose.Types.ObjectId[];
    description: string;
    price: number;
    stripePriceId: string;
    image: string;
    stock: number;
    reviews: mongoose.Types.ObjectId[];
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Product;
