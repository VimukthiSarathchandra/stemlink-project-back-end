import mongoose from "mongoose";
declare const Review: mongoose.Model<{
    review: string;
    rating: number;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    review: string;
    rating: number;
}, {}> & {
    review: string;
    rating: number;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    review: string;
    rating: number;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    review: string;
    rating: number;
}>, {}> & mongoose.FlatRecord<{
    review: string;
    rating: number;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Review;
