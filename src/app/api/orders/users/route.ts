import { authOptions } from "@/lib/auth"
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                error: "Unauthenticated"
            }, { status: 401 })
        }
        await connectDb();
        const orders = await Order.find({
            userId: session.user.id
        })
            .populate({
                path: "productId",
                select: "name imageUrl",
                options: {
                    strictPopulate: false    //will return null if no product was found and not throw an error
                }
            })
            .sort({ createdAt: -1 })
            .lean()
        if (!orders) {
            return NextResponse.json({
                error: "No orders found!"
            })
        }
        return NextResponse.json({
            orders
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            error: "Could not fetch orders!"
        }, { status: 500 })
    }
}