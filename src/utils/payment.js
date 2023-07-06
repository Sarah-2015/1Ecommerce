import Stripe from "stripe";

async function payment ({
    stripe = new Stripe(process.env.STRIPE_KEY),
    payment_method_types=['card'],
    mode= 'payment',
    customer_email,
    metadata=[],
    discounts=[],
    success_url= process.env.success_url,
    cancel_url=`${req.protocol}://${req.headers.host}/order/payment/cancel`,
    line_items=[],
  }= {})
  {
    
    const session= await stripe.checkout.sessions.create({

        payment_method_types,
        mode,
        customer_email,
        metadata,
        discounts,
        success_url,
        cancel_url,
        line_items,
      })
    }

    export default payment