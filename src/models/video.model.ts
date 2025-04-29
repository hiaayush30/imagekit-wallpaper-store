import mongoose, { Document } from "mongoose";

export const VIDEO_DIMENSIONS = {
    width: 1080,
    height: 1920
}

export interface IVideo extends Document {
    title: string;
    description: string;
    viddeo_url: string;
    thumbnail_url: string;
    controls: boolean;
    transformation?: {
        height: number,
        width: number,
        quality?: number
    },
    createdAt: Date
    updatedAt: Date
}

const videoSchema = new mongoose.Schema<IVideo>({
    title: String,
    description: String,
    viddeo_url: String,
    thumbnail_url: String,
    controls: {
        type: Boolean,
        default: true
    },
    transformation: {
        height: {
            type: Number,
            default: VIDEO_DIMENSIONS.height
        },
        width: {
            type: Number,
            default: VIDEO_DIMENSIONS.width
        },
        quality: {
            type: Number,
            min: 1,
            max: 100
        }
    }
}, { timestamps: true })

const Video = mongoose.models['Video'] ? mongoose.models['Video'] : mongoose.model<IVideo>('Video', videoSchema);

export default Video;