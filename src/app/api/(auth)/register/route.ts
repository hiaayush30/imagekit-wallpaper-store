import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

//if you want various custom info from the user create a register endpoint or the login endpoint will do

export const POST = async (req: NextRequest) => {
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json({
                error: "invalid request,email and password required"
            }, { status: 403 })
        }
        await connectDb();
        const existingUser = await User.findOne({
            email
        });
        if (existingUser) {
            return NextResponse.json({
                error: "User already exists"
            }, { status: 403 })
        }
        await User.create({
            email,
            password,
            role: "user"
        })
        return NextResponse.json({
            message: "User registered successfully"
        }, { status: 201 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            error: "Something went wrong!"
        }, { status: 500 })
    }
} 