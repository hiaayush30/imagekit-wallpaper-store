import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto"
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import nodemailer from "nodemailer";


export const POST = async (req: NextRequest) => {
    try {
        const body = await req.text();
        const signature = req.headers.get("x-razorpay-signature");

        const expectedSignature = crypto
            .createHmac("sha256", process.env.razorpay_secret as string)
            .update(body)
            .digest('hex');

        if (signature !== expectedSignature) {
            return NextResponse.json({
                error: "Invalid signature"
            }, { status: 400 })
        }
        //all this above done to check that this is a valid request done by the legit razorpay

        const event = JSON.parse(body);
        await connectDb();

        //handling 1 event
        if (event.event === "payment.captured") {
            const payment = event.payload.payment.entity
            const order = await Order.findOneAndUpdate({
                razorpayOrderId: payment.order_id
            }, {
                razorpayPaymentId: payment.id,
                status: "completed"
            }).populate([
                { path: "productId", select: "name" },
                { path: "userId", select: "email" }
            ])

            if (order) {
                const transporter = nodemailer.createTransport({
                    service: "sandbox.smtp.mailtrap.io",
                    port: 2525,
                    auth: {
                        user: process.env.mailtrap_username,
                        pass: process.env.mailtrap_password
                    }
                })

                await transporter.sendMail({
                    from: "hiaayush30@gmail.com",
                    to: (order.userId as {email:string}).email,
                    subject: "Order completed",
                    text: `Your order ${(order.productId as {name:string}).name} has been successfully placed`
                })

                return NextResponse.json({
                    message: "success"
                })
            }
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            error: "Something went wrong"
        }, { status: 500 })
    }
}