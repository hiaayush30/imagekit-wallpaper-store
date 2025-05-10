import { authOptions } from "@/lib/auth"
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";
import Razorpay from "razorpay"

const razorpay = new Razorpay({
    key_id:process.env.razorpay_id,
    key_secret:process.env.razorpay_secret
})


export async function POST(req:Request){
    const session = await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({
            error:"Unauthorized"
        },{status:401})
    }

    const {productId,variant} = await req.json();
    await connectDb();
    const order = await razorpay.orders.create({
        amount:Math.round(variant.price * 100),
        currency:"INR",
        receipt:`receipt-${Date.now()}`,
        notes:{
            productId:productId.toString()
        }
    })

    const newOrder = await Order.create({
        userId:session.user.id,
        productId,
        variant,
        razorpayOrderId:order.id,
        amount:Math.round(variant.price * 100),
        status:"pending"
    })

    return NextResponse.json({
        orderId:order.id,
        amount:order.amount,
        currency:order.currency,
        dbOrderId:newOrder._id
    })
}