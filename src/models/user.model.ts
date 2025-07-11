import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    email: string;
    password: string;
    role: "user" | "admin"
    createdAt: Date
    updatedAt: Date
}


const userSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, { timestamps: true })

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        const encrypted = bcrypt.hashSync(this.password, 5);
        this.password = encrypted;
    }
    next();
})

const User: Model<IUser> = mongoose.models['User'] ? mongoose.models['User'] : mongoose.model<IUser>('User', userSchema);

export default User;