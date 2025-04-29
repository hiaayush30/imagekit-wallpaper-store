import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    email: string;
    password: string;
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
    }
}, { timestamps: true })

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        const encrypted = bcrypt.hashSync(this.password, 5);
        this.password = encrypted;
    }
    next();
})

const User = mongoose.models['User'] ? mongoose.models['User'] : mongoose.model<IUser>('User', userSchema);

export default User;