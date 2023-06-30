// // This is a public sample test API key.
// // Don’t submit any personally identifiable information in reqs made with this key.
// // Sign in to see your own test API key embedded in code samples.
// // const stripe = require("stripe")(
// //   "sk_test_51NKzsbCwDHaI7XNrv4PMB7yVu1rZv01RqBcjRN39lPo5ZSemq3OWJRvuOfZT0pYGFQXsnicZ8ubrRV3NEFc0oNxy00sHqnPPWU"
// // );
// const stripe = require("stripe")("sk_test_Ou1w6LVt3zmVipDVJsvMeQsc");

// const handleStripeWebhook = async (req, res) => {
//   return res.send("stripey");
// };

// const YOUR_DOMAIN = "http://localhost:3001";

// // app.post('/create-checkout-session',
// const createCheckoutSession = async (req, res) => {
//   // return res.send("testing"); // delete ltr
//   const prices = await stripe.prices.list({
//     lookup_keys: [req.body.lookup_key],
//     expand: ["data.product"],
//   });
//   const session = await stripe.checkout.sessions.create({
//     billing_address_collection: "auto",
//     line_items: [
//       {
//         price: prices.data[0].id,
//         // For metered billing, do not pass quantity
//         quantity: 1,
//       },
//     ],
//     mode: "subscription",
//     success_url: `${YOUR_DOMAIN}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
//     cancel_url: `${YOUR_DOMAIN}?canceled=true`,
//   });

//   res.redirect(303, session.url);
// };
// const storeItems = new Map([
//   // in cents
//   [1, { priceInCents: 200, name: "Project Tracker Premium" }],
//   // [2, { priceInCents: 15000, name: "Learn CSS Today" }],
// ]); // router.post("/stripe/webhook", handleStripeWebhook);

// const createCheckoutSession = async (req, res) => {
//   try {
//     const clientUrl = "http://localhost:3000/settings";
//     // Create a checkout session with Stripe
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       // For each item use the id to get it's information
//       // Take that information and convert it to Stripe's format
//       line_items: req.body.items.map(({ id, quantity }) => {
//         const storeItem = storeItems.get(id);
//         return {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: storeItem.name,
//             },
//             unit_amount: storeItem.priceInCents,
//           },
//           quantity: quantity,
//         };
//       }),
//       mode: "payment", // can change to recurring?
//       // Set a success and cancel URL we will send customers to
//       // These must be full URLs
//       // In the next section we will setup CLIENT_URL

//       success_url: `${clientUrl}/settings`,
//       cancel_url: `${clientUrl}/dashboard`,
//     });

//     res.json({ url: session.url });
//   } catch (e) {
//     // If there is an error send it to the client
//     res.status(500).json({ error: e.message });
//   }
// };

// // app.post('/create-portal-session',
// const createPortalSession = async (req, res) => {
//   // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
//   // Typically this is stored alongside the authenticated user in your database.
//   const { session_id } = req.body; //*** need session_id in body */
//   const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

//   // This is the url to which the customer will be redirected when they are done
//   // managing their billing with the portal.
//   const returnUrl = YOUR_DOMAIN;

//   const portalSession = await stripe.billingPortal.sessions.create({
//     customer: checkoutSession.customer,
//     return_url: returnUrl,
//   });

//   res.redirect(303, portalSession.url);
// };

// // express raw is themiddleware
// // app.post('/webhook',express.raw({ type: 'application/json' }),
// const stripeWebhook = (req, res) => {
//   let event = req.body;
//   // Replace this endpoint secret with your endpoint's unique secret
//   // If you are testing with the CLI, find the secret by running 'stripe listen'
//   // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
//   // at https://dashboard.stripe.com/webhooks
//   const endpointSecret =
//     "whsec_d3a92af39b92e6c69cced204b41122e20e801de8418728b36c05252477fa12e2";
//   // Only verify the event if you have an endpoint secret defined.
//   // Otherwise use the basic event deserialized with JSON.parse
//   if (endpointSecret) {
//     // Get the signature sent by Stripe
//     const signature = req.headers["stripe-signature"];
//     try {
//       event = stripe.webhooks.constructEvent(
//         req.body,
//         signature,
//         endpointSecret
//       );
//     } catch (err) {
//       console.log(`⚠️  Webhook signature verification failed.`, err.message);
//       return res.sendStatus(400);
//     }
//   }
//   let subscription;
//   let status;
//   // Handle the event
//   switch (event.type) {
//     case "customer.subscription.trial_will_end":
//       subscription = event.data.object;
//       status = subscription.status;
//       console.log(`Subscription status is ${status}.`);
//       // Then define and call a method to handle the subscription trial ending.
//       // handleSubscriptionTrialEnding(subscription);
//       break;
//     case "customer.subscription.deleted":
//       subscription = event.data.object;
//       status = subscription.status;
//       console.log(`Subscription status is ${status}.`);
//       // Then define and call a method to handle the subscription deleted.
//       // handleSubscriptionDeleted(subscriptionDeleted);
//       break;
//     case "customer.subscription.created":
//       subscription = event.data.object;
//       status = subscription.status;
//       console.log(`Subscription status is ${status}.`);
//       // Then define and call a method to handle the subscription created.
//       // handleSubscriptionCreated(subscription);
//       break;
//     case "customer.subscription.updated":
//       subscription = event.data.object;
//       status = subscription.status;
//       console.log(`Subscription status is ${status}.`);
//       // Then define and call a method to handle the subscription update.
//       // handleSubscriptionUpdated(subscription);
//       break;
//     default:
//       // Unexpected event type
//       console.log(`Unhandled event type ${event.type}.`);
//   }
//   // Return a 200 res to acknowledge receipt of the event
//   res.send();
// };

// //

// export {
//   handleStripeWebhook,
//   createCheckoutSession,
//   createPortalSession,
//   stripeWebhook,
// };

// refactor in the future
const stripe = require("stripe")(
  "sk_test_51NOMawEiIAzhG1HpONjt6r2PTLVwN2k3T2iO1AaLeCq61BpV7OucZt3hbuHBPPwRcn1z59mX7HYxcHjM8MQceNzH00Pxq5YZOC"
);
import models from "../../models";
const { User } = models;

const productToPriceMap = {
  monthly: "price_1NOMekEiIAzhG1HpOZme9Ow1",
  annual: "price_1NOMeyEiIAzhG1HpmdYApJtV",
};

const findUserByEmail = async (email) => {
  try {
    const user = await User.find({ email: email });
    return user[0];
  } catch {
    return null;
  }
};

const createCheckoutSession = async (req, res) => {
  const YOUR_DOMAIN = "http://localhost:3000";
  // how do i get customerID in here?
  console.log(req.email);
  const user = await findUserByEmail(req.email);
  console.log(user);
  const session = await stripe.checkout.sessions.create({
    customer: user.stripeId,
    billing_address_collection: "auto",
    line_items: [
      {
        price: productToPriceMap.annual,
        // For metered billing, do not pass quantity
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${YOUR_DOMAIN}/settings`,
    cancel_url: `${YOUR_DOMAIN}/dashboard`,
  });

  return res.json({ url: session.url });
};

const createPortalSession = async (req, res) => {};

const stripeWebhook = (request, response) => {
  console.log("stripe calling");
  console.log(request.body);
  const sig = request.headers["stripe-signature"];
  const endpointSecret =
    "whsec_83e6050341b6a3b6a784d1c741259f2be7a07e196e67a2158bdabfb408d560ce";

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    console.log("*****STRIPE CALLED THE WEBHOOK*****");
    console.log(event);
  } catch (err) {
    console.log("an error...");
    console.log(err);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
};
export { createCheckoutSession, createPortalSession, stripeWebhook };
