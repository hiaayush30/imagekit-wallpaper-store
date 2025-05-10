import { authOptions } from "@/lib/auth";
import connectDb from "@/lib/db";
import Product, { IProduct } from "@/models/product.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        connectDb();
        const products = await Product.find({}).lean();

        if (!products || products.length == 0) {
            return NextResponse.json({
                error: "No products found"
            }, { status: 500 })
        }
        return NextResponse.json({
            products
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            error: "Could not fetch products!"
        }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({
                error: "Unauthorized"
            }, { status: 401 })
        }
        await connectDb();
        const body: IProduct = await req.json();
        if (!body.name || !body.description || !body.imageUrl || body.variants.length == 0) {
            return NextResponse.json({
                error: "all fields are required"
            }, { status: 400 })
        }
        const newProdcut = await Product.create(body);
        return NextResponse.json({
            newProdcut
        }, { status: 201 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            error: "Could not add product!"
        }, { status: 500 })
    }
}