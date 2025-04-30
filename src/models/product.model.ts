import mongoose, { Document } from "mongoose";

export const IMAGE_VARIANTS = {
    SQUARE: {
        type: "SQUARE",
        dimensions: { width: 1200, height: 1200 },
        label: "Square (1:1)",
        aspectRatio: "1:1"
    },
    WIDE: {
        type: "WIDE",
        dimensions: { width: 1920, height: 1080 },
        label: "Widescreen (16:9)",
        aspectRatio: "16:9"
    },
    POTRAIT: {
        type: "POTRAIT",
        dimensions: { width: 1080, height: 1440 },
        label: "Potrait (3:4)",
        aspectRatio: "3:4"
    }
}

export type imageVariantType = keyof typeof IMAGE_VARIANTS;

export interface ImageVariant {
    type:imageVariantType;
    price:number;
    lisence:"personal"|"commercial"
}

export interface IProduct extends Document{
    name:string;
    description:string;
    imageUrl:string;
    variants:ImageVariant[]
}

const imageVariantSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["SQUARE", "WIDE", "POTRAIT"],
        required: true
    },
    price: {
        type: Number,
        min: 0
    },
    lisence: {
        type: String,
        enum: ["personal", "commercial"]
    }
}, { timestamps: true })

const productSchema = new mongoose.Schema<IProduct>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    variants: [imageVariantSchema]
}, { timestamps: true })

const Product = mongoose.models['Product'] ? mongoose.models['Product'] : mongoose.model<IProduct>('Product', productSchema);

export default Product;