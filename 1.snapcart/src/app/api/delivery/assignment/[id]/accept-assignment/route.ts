import connectDb from "@/app/lib/db";
import emitEventHandler from "@/app/lib/emitEventHandler";
import DeliveryAssignment from "@/app/models/deliveryAssignment.model";
import Order from "@/app/models/order.model";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,context:{params: Promise<{id:string; }>; }){
    try {
        await connectDb()
            const {id}=await context.params
            const session=await auth()
            const deliveryBoyId=session?.user?.id
            if(!deliveryBoyId){
                return NextResponse.json({message:"Unauthorized"},{status:400})
            }

            const assignmemt=await DeliveryAssignment.findById(id)
            if(!assignmemt){
                return NextResponse.json({message:"Assignment not found"},{status:400})
            }
            if(assignmemt.status!=="brodcasted"){
                return NextResponse.json({message:"Assignment expired"},{status:400})
            }

            const alreadyAssigned=await DeliveryAssignment.findOne({
                assignedTo:deliveryBoyId,
                status:{$nin:["brodcasted","completed"]}
            })

            if(alreadyAssigned){
                return NextResponse.json({message:"Already assigned to other order"},{status:400})
            }


            assignmemt.assignedTo=deliveryBoyId
            assignmemt.status="assigned"
            assignmemt.acceptedAt=new Date()
            await assignmemt.save()

            const order=await Order.findById(assignmemt.order)
            if(!order){
                return NextResponse.json({message:"Order not found"},{status:400})
            }
            order.assignedDeliveryBoy=deliveryBoyId
            await order.save()

            await order.populate("assignedDeliveryBoy")

            await emitEventHandler("order-assigned",{orderId:order._id, assignedDeliveryBoy:order.assignedDeliveryBoy})


            await DeliveryAssignment.updateMany(
                {_id:{$ne:assignmemt._id},
                brodcastedTo:deliveryBoyId,
                status:"brodcasted"
                },
                {
                    $pull:{brodcastedTo:deliveryBoyId}
                }
            )



            return NextResponse.json({message:"Order accepted successfully"},{status:200})

    } catch (error) {
        
    }
}