import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { OrderModel } from "@/lib/models/OrderModel";
import { redirect } from "next/navigation";

export async function GET(req) {
  let trxn_id = req.nextUrl.searchParams.get("trxn_id");
  try {
    await dbConnect();
    await OrderModel.findOneAndDelete({
      "payment.trxn_id": trxn_id,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ message: await getErrorMessage(error) });
  }
  redirect(`/products/payment/fail?paymentID=${trxn_id}`);
}
