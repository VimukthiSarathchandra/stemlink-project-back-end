import mongoose from "mongoose";
declare const Category: mongoose.Model<{
    name: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    name: string;
}, {}> & {
    name: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    name: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
}>, {}> & mongoose.FlatRecord<{
    name: string;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Category;
