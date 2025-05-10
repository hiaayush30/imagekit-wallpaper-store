import connectDb from "@/lib/db";
import Product from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,props:{params:Promise<{id:string}>}) {
    try {
        const {id} = await props.params;
        await connectDb();
        const product = await Product.findById(id);
        if(!product){
            return NextResponse.json({
                error:"Product not found"
            },{status:400})
        }
        return NextResponse.json({
            product
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            error: "Could not fetch product!"
        }, { status: 500 })
    }
} 