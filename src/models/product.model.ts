import mongoose from "mongoose";

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
    lisences: {
        type: String,
        enum: ["personal", "commercial"]
    }
}, { timestamps: true })

const productSchema = new mongoose.Schema({
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

const Product = mongoose.models['Product'] ? mongoose.models['Product'] : mongoose.model('Product', productSchema);

export default Product;