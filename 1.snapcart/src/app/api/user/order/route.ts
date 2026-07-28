import connectDb from "@/app/lib/db";
import emitEventHandler from "@/app/lib/emitEventHandler";
import Order from "@/app/models/order.model";
import User from "@/app/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const { userId, items, paymentMethod, totalAmount, address } = await req.json()
        if (!items || !userId || !paymentMethod || !totalAmount || !address) {
            return NextResponse.json(
                { message: "Please send all credentials" },
                { status: 404 }
            )
        }
        const user = await User.findById(userId)
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            )
        }

        const newOrder = await Order.create({
            user: userId,
            items,
            paymentMethod,
            totalAmount,
            address
        })

        
        await emitEventHandler("new-order",newOrder)

        return NextResponse.json(
            newOrder,
            { status: 201 }
        )

    } catch (error) {
        return NextResponse.json(
            { message: `place order error ${error}` },
            { status: 500 }
        )
    }
}