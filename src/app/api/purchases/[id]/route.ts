import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  // TODO: Configure Prisma and uncomment the following code
  // try {
  //   const id = parseInt(params.id);
  //   const body = await request.json();

  //   // Ensure time is in 24-hour format before saving
  //   const updated = await prisma.purchase.update({
  //     where: { no_urut: id },
  //     data: {
  //       itemName: body.itemName,
  //       quantity: body.quantity,
  //       time: body.time, // Should already be in 24-hour format
  //       created_at: body.created_at,
  //     },
  //   });

  //   return NextResponse.json(updated);
  // } catch (error) {
  //   console.error("Error updating purchase:", error);
  //   return NextResponse.json(
  //     { error: "Failed to update purchase" },
  //     { status: 500 }
  //   );
  // }

  return NextResponse.json({message: "Purchase update endpoint. Prisma needs to be configured."})
}
