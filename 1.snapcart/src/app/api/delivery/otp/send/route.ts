import connectDb from "@/app/lib/db";
import { sendMail } from "@/app/lib/mailer";
import Order from "@/app/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const { orderId } = await req.json()
        const order = await Order.findById(orderId).populate("user")
        if (!order) {
            return NextResponse.json(
                { message: "Order not found" },
                { status: 404 }
            )
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        order.deliveryOtp = otp
        await order.save()

        await sendMail(
            order.user.email,
            "Your delivery OTP",
            `<h2>Your delivery OTP is <strong>${otp}</strong></h2>`
        )
         return NextResponse.json(
                { message: "OTP sent successfully" },
                { status: 200 }
            )

    } catch (error) {
         return NextResponse.json(
                { message: `send otp error ${error}` },
                { status: 500 }
            )
    }
}