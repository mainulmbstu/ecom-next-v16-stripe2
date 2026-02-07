import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { OrderModel } from "@/lib/models/OrderModel";
import { ProductModel } from "@/lib/models/productModel";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  let trxn_id = req.nextUrl.searchParams.get("trxn_id");
  let session_id = req.nextUrl.searchParams.get("session_id");
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["payment_intent.payment_method"],
    });
    await dbConnect();
    let updated = await OrderModel.findOneAndUpdate(
      { "payment.trxn_id": trxn_id },
      {
        "payment.status": true,
        "payment.payment_id": session?.payment_intent?.id,
        "payment.payment_method": session?.payment_intent?.payment_method,
      },
      { new: true },
    );
    if (updated.isModified) {
      for (let v of updated.products) {
        let product = await ProductModel.findById(v._id);
        product.quantity = product.quantity - v.amount;
        product.save();
      }
    }
    revalidateTag("order-list", "max");
    revalidateTag("product-list", "max");
  } catch (error) {
    console.log(error);
    return Response.json({ message: await getErrorMessage(error) });
  }
  redirect(`/products/payment/success?paymentID=${trxn_id}`);
}
