import mongoose, { Document, Model } from "mongoose";
import { ImageVariant } from "./product.model";

interface PopulatedUser {
    _id: mongoose.Types.ObjectId;
    email: string;
}

interface PopulatedProduct {
    _id: mongoose.Types.ObjectId;
    name: string;
    imageUrl: string;
}

export interface IOrder extends Document {
    userId: mongoose.Types.ObjectId | PopulatedUser;
    productId: mongoose.Types.ObjectId | PopulatedProduct;
    variant: ImageVariant;

    razorpayOrderId: string;
    razorpayPaymentId?: string;
    amount: number;
    status: "pending" | "completed" | "failed";
    downloadUrl?: string;
    previewUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const orderSchema = new mongoose.Schema<IOrder>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    variant: {
        type: {
            type: String,
            required: true,
            enum: ["SQUARE", "WIDE", "POTRAIT"]
        },
        price: {
            type: Number,
            required: true,
            min: 0

        },
        lisence: {
            type: String,
            enum: ["personal", "commercial"]
        }
    },
    razorpayOrderId: {
        type: String,
        required: true
    },
    razorpayPaymentId: {
        type: String,
        required: false
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "completed", "failed"],
        default: "pending"
    },
    downloadUrl: {
        type: String
    },
    previewUrl: String
}, { timestamps: true })

const Order: Model<IOrder> = mongoose.models['Order'] ? mongoose.models['Order'] : mongoose.model<IOrder>('Order', orderSchema);

export default Order;