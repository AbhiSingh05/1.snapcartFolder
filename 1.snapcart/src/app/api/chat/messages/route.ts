import connectDb from "@/app/lib/db";
import Message from "@/app/models/message.model";
import Order from "@/app/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb();

        const { roomID } = await req.json();

        const room = await Order.findById(roomID);

        if (!room) {
            return NextResponse.json(
                { message: "Room not found" },
                { status: 400 }
            );
        }

        // FIXED: roomId instead of roomID
        const messages = await Message.find({
            roomId: room._id
        }).sort({ createdAt: 1 });

        return NextResponse.json(messages, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { message: `Get messages error ${error}` },
            { status: 500 }
        );
    }
}