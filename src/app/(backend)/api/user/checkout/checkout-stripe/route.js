import dbConnect from "@/lib/helpers/dbConnect";
import { getCookieValue } from "@/lib/helpers/getCookieValue";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { getTokenData } from "@/lib/helpers/getTokenData";
import { OrderModel } from "@/lib/models/OrderModel";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  let frontData = await req.json();
  const { cart, total } = frontData;
  let userInfo = await getTokenData(await getCookieValue("token"));
  let baseurl = process.env.BASE_URL;
  let trxn_id = Date.now();
  try {
    let lineItems = await cart.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item?.name,
          images: [item?.picture[0]?.secure_url],
        },
        unit_amount: (item?.price - (item?.price * item?.offer) / 100) * 100,
      },
      quantity: item?.amount,
    }));
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseurl}/api/user/checkout/stripe-success?trxn_id=${trxn_id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseurl}/api/user/checkout/stripe-fail?trxn_id=${trxn_id}`,

      client_reference_id: userInfo?.name,
      customer_email: userInfo?.email,

      // billing_address_collection: "required",

      // shipping_address_collection: {
      //   allowed_countries: ["US", "BR", "BD"],
      // },

      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 500,
              currency: "usd",
            },
            display_name: "Free shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 15,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "usd",
            },
            display_name: "Next day air",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 1,
              },
            },
          },
        },
      ],

      // shipping_options: [
      //   {
      //     shipping_rate: "shr_1QDffEHPFVNGKjCSlQaFjuHK", // shipping rate id in stripe acc
      //     shipping_rate: "shr_1QDejYHPFVNGKjCSYDjrIGqa", // shipping rate id in stripe acc
      //   },
      // ],
    });
    let order = {
      products: cart,
      total,
      payment: {
        trxn_id,
      },
      user: userInfo?._id,
    };
    await dbConnect();
    await OrderModel.create(order);
    return Response.json({ session, success: true });
  } catch (error) {
    console.log(error);
    return Response.json({ message: await getErrorMessage(error) });
  }
}
