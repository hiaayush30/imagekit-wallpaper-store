import mongoose, { Model } from "mongoose";

// In MongoDB, and therefore in Mongoose, you have the flexibility to embed related data directly within a document instead of
// always relying on separate collections and joins (like in traditional relational databases). Nested schemas allow you to define
// the structure of these embedded documents.



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
// The keyof operator in TypeScript takes a type and produces a union type of its property names (keys).
// imageVariantType is a type that can only be one of the string literals: "SQUARE" | "WIDE" | "POTRAIT".

export interface ImageVariant {
    type: imageVariantType;
    price: number;
    lisence: "personal" | "commercial"
}

export interface IProduct {
    _id?: mongoose.Types.ObjectId;
    name: string;
    description: string;
    imageUrl: string;
    variants: ImageVariant[]
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

const Product: Model<IProduct> = mongoose.models['Product'] ? mongoose.models['Product'] : mongoose.model<IProduct>('Product', productSchema);

export default Product;