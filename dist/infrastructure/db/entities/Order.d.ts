import mongoose from "mongoose";
declare const Order: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: string;
    items: mongoose.Types.DocumentArray<{
        productId: mongoose.Types.ObjectId;
        quantity: number;
        selectedColor?: {
            _id?: mongoose.Types.ObjectId | null | undefined;
            name?: string | null | undefined;
            hexCode?: string | null | undefined;
        } | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        selectedColor?: {
            _id?: mongoose.Types.ObjectId | null | undefined;
            name?: string | null | undefined;
            hexCode?: string | null | undefined;
        } | null | undefined;
    }> & {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        selectedColor?: {
            _id?: mongoose.Types.ObjectId | null | undefined;
            name?: string | null | undefined;
            hexCode?: string | null | undefined;
        } | null | undefined;
    }>;
    addressId: mongoose.Types.ObjectId;
    orderStatus: "PENDING" | "CONFIRMED" | "SHIPPED" | "FULFILLED" | "CANCELLED";
    paymentMethod: "COD" | "CREDIT_CARD";
    paymentStatus: "PENDING" | "PAID" | "REFUNDED";
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: string;
    items: mongoose.Types.DocumentArray<{
        productId: mongoose.Types.ObjectId;
        quantity: number;
        selectedColor?: {
            _id?: mongoose.Types.ObjectId | null | undefined;
            name?: string | null | undefined;
            hexCode?: string | null | undefined;
        } | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        selectedColor?: {
            _id?: mongoose.Types.ObjectId | null | undefined;
            name?: string | null | undefined;
            hexCode?: string | null | undefined;
        } | null | undefined;
    }> & {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        selectedColor?: {
            _id?: mongoose.Types.ObjectId | null | undefined;
            name?: string | null | undefined;
            hexCode?: string | null | undefined;
        } | null | undefined;
    }>;
    addressId: mongoose.Types.ObjectId;
    orderStatus: "PENDING" | "CONFIRMED" | "SHIPPED" | "FULFILLED" | "CANCELLED";
    paymentMethod: "COD" | "CREDIT_CARD";
    paymentStatus: "PENDING" | "PAID" | "REFUNDED";
}, {}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: string;
    items: mongoose.Types.DocumentArray<{
        productId: mongoose.Types.ObjectId;
        quantity: number;
        selectedColor?: {
            _id?: mongoose.Types.ObjectId | null | undefined;
            name?: string | null | undefined;
            hexCode?: string | null | undefined;
        } | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        selectedColor?: {
            _id?: mongoose.Types.ObjectId | null | undefined;
            name?: string | null | undefined;
            hexCode?: string | null | undefined;
        } | null | undefined;
    }> & {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        selectedColor?: {
            _id?: mongoose.Types.ObjectId | null | undefined;
            name?: string | null | undefined;
            hexCode?: string | null | undefined;
        } | null | undefined;
    }>;
    addressId: mongoose.Types.ObjectId;
    orderStatus: "PENDING" | "CONFIRMED" | "SHIPPED" | "FULFILLED" | "CANCELLED";
    paymentMethod: "COD" | "CREDIT_CARD";
    paymentStatus: "PENDING" | "PAID" | "REFUNDED";
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: string;
    items: mongoose.Types.DocumentArray<{
        productId: mongoose.Types.ObjectId;
        quantity: number;
        selectedColor?: {
            _id?: mongoose.Types.ObjectId | null | undefined;
            name?: string | null | undefined;
            hexCode?: string | null | undefined;
        } | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        selectedColor?: {
            _id?: mongoose.Types.ObjectId | null | undefined;
            name?: string | null | undefined;
            hexCode?: string | null | undefined;
        } | null | undefined;
    }> & {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        selectedColor?: {
            _id?: mongoose.Types.ObjectId | null | undefined;
            name?: string | null | undefined;
            hexCode?: string | null | undefined;
        } | null | undefined;
    }>;
    addressId: mongoose.Types.ObjectId;
    orderStatus: "PENDING" | "CONFIRMED" | "SHIPPED" | "FULFILLED" | "CANCELLED";
    paymentMethod: "COD" | "CREDIT_CARD";
    paymentStatus: "PENDING" | "PAID" | "REFUNDED";
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: string;
    items: mongoose.Types.DocumentArray<{
        productId: mongoose.Types.ObjectId;
        quantity: number;
        selectedColor?: {
            _id?: mongoose.Types.ObjectId | null | undefined;
            name?: string | null | undefined;
            hexCode?: string | null | undefined;
        } | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        selectedColor?: {
            _id?: mongoose.Types.ObjectId | null | undefined;
            name?: string | null | undefined;
            hexCode?: string | null | undefined;
        } | null | undefined;
    }> & {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        selectedColor?: {
            _id?: mongoose.Types.ObjectId | null | undefined;
            name?: string | null | undefined;
            hexCode?: string | null | undefined;
        } | null | undefined;
    }>;
    addressId: mongoose.Types.ObjectId;
    orderStatus: "PENDING" | "CONFIRMED" | "SHIPPED" | "FULFILLED" | "CANCELLED";
    paymentMethod: "COD" | "CREDIT_CARD";
    paymentStatus: "PENDING" | "PAID" | "REFUNDED";
}>, {}> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: string;
    items: mongoose.Types.DocumentArray<{
        productId: mongoose.Types.ObjectId;
        quantity: number;
        selectedColor?: {
            _id?: mongoose.Types.ObjectId | null | undefined;
            name?: string | null | undefined;
            hexCode?: string | null | undefined;
        } | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        selectedColor?: {
            _id?: mongoose.Types.ObjectId | null | undefined;
            name?: string | null | undefined;
            hexCode?: string | null | undefined;
        } | null | undefined;
    }> & {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        selectedColor?: {
            _id?: mongoose.Types.ObjectId | null | undefined;
            name?: string | null | undefined;
            hexCode?: string | null | undefined;
        } | null | undefined;
    }>;
    addressId: mongoose.Types.ObjectId;
    orderStatus: "PENDING" | "CONFIRMED" | "SHIPPED" | "FULFILLED" | "CANCELLED";
    paymentMethod: "COD" | "CREDIT_CARD";
    paymentStatus: "PENDING" | "PAID" | "REFUNDED";
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Order;
