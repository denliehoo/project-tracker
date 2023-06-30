// // This is a public sample test API key.
// // Don’t submit any personally identifiable information in reqs made with this key.
// // Sign in to see your own test API key embedded in code samples.
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
// switch (event.type) {
//   case "customer.subscription.trial_will_end":
//     subscription = event.data.object;
//     status = subscription.status;
//     console.log(`Subscription status is ${status}.`);
//     // Then define and call a method to handle the subscription trial ending.
//     // handleSubscriptionTrialEnding(subscription);
//     break;
//   case "customer.subscription.deleted":
//     subscription = event.data.object;
//     status = subscription.status;
//     console.log(`Subscription status is ${status}.`);
//     // Then define and call a method to handle the subscription deleted.
//     // handleSubscriptionDeleted(subscriptionDeleted);
//     break;
//   case "customer.subscription.created":
//     subscription = event.data.object;
//     status = subscription.status;
//     console.log(`Subscription status is ${status}.`);
//     // Then define and call a method to handle the subscription created.
//     // handleSubscriptionCreated(subscription);
//     break;
//   case "customer.subscription.updated":
//     subscription = event.data.object;
//     status = subscription.status;
//     console.log(`Subscription status is ${status}.`);
//     // Then define and call a method to handle the subscription update.
//     // handleSubscriptionUpdated(subscription);
//     break;
//   default:
//     // Unexpected event type
//     console.log(`Unhandled event type ${event.type}.`);
// }
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
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
import models from '../../models'
const { User } = models

const productToPriceMap = {
  monthly: 'price_1NOMekEiIAzhG1HpOZme9Ow1',
  annual: 'price_1NOMeyEiIAzhG1HpmdYApJtV',
}
const priceToProductMap = {
  price_1NOMekEiIAzhG1HpOZme9Ow1: 'monthly',
  price_1NOMeyEiIAzhG1HpmdYApJtV: 'annual',
}

const findUserByEmail = async (email) => {
  try {
    const user = await User.find({ email: email })
    return user[0]
  } catch {
    return null
  }
}

const findUserByStripeId = async (id) => {
  try {
    const user = await User.find({ stripeId: id })
    return user[0]
  } catch {
    return null
  }
}

const createCheckoutSession = async (req, res) => {
  console.log(process.env.STRIPE_SECRET_KEY)
  const YOUR_DOMAIN = 'http://localhost:3000'
  // how do i get customerID in here?
  console.log(req.email)
  const user = await findUserByEmail(req.email)
  console.log(user)
  const session = await stripe.checkout.sessions.create({
    customer: user.stripeId,
    billing_address_collection: 'auto',
    line_items: [
      {
        price: productToPriceMap.annual,
        // For metered billing, do not pass quantity
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${YOUR_DOMAIN}/settings`,
    cancel_url: `${YOUR_DOMAIN}/dashboard`,
  })

  return res.json({ url: session.url })
}

const createPortalSession = async (req, res) => {}

const stripeWebhook = (request, response) => {
  const sig = request.headers['stripe-signature']
  const endpointSecret =
    'whsec_83e6050341b6a3b6a784d1c741259f2be7a07e196e67a2158bdabfb408d560ce'

  let event
  let subscription
  let status

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret)
    // console.log(event)
  } catch (err) {
    console.log('an error...')
    console.log(err)
    response.status(400).send(`Webhook Error: ${err.message}`)
    return
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.trial_will_end':
      subscription = event.data.object
      status = subscription.status
      console.log(`Subscription status is ${status}.`)
      // Then define and call a method to handle the subscription trial ending.
      // handleSubscriptionTrialEnding(subscription);
      break
    case 'customer.subscription.deleted':
      subscription = event.data.object
      status = subscription.status
      console.log(`Subscription status is ${status}.`)
      // Then define and call a method to handle the subscription deleted.
      // handleSubscriptionDeleted(subscriptionDeleted);
      break
    // create can still have a status of inactive since its just a create
    // over here, dont really need to do anything
    case 'customer.subscription.created':
      subscription = event.data.object
      status = subscription.status
      console.log(`Subscription status is ${status}.`)
      // Then define and call a method to handle the subscription created.
      // handleSubscriptionCreated(subscription);
      break
    // update here could mean that the user paid, or, paid again for the next subscription
    // over here, need to change status to premium
    case 'customer.subscription.updated':
      subscription = event.data.object
      status = subscription.status
      console.log(`Subscription status is ${status}.`)
      console.log('***** LOOOK HERE*****')
      console.log(event)
      console.log('***** LOOOK HERE*****')
      console.log(event.data.object.plan)
      // Then define and call a method to handle the subscription update.
      handleSubscriptionUpdated(subscription)
      break
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`)
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send()
}

// pass event.data.object here
const handleSubscriptionUpdated = async (d) => {
  let user = await findUserByStripeId(d.customer)
  if (!user.isPremium) {
    user.isPremium = true
    for (let p of user.ownProjects) {
      p.locked = false
    }
  }
  user.plan = priceToProductMap[d.plan.id]
  // need to *1000 to make it accurate; not sure why... but ok
  user.endDate = new Date(d.current_period_end * 1000)
  await user.save()
  console.log('User updgraded to premium')
}
export { createCheckoutSession, createPortalSession, stripeWebhook }

// for the variable event
// const sampleEventDataFromSubscriptionUpdated = {
//   id: 'evt_1NOd4DEiIAzhG1Hpg8B7as2d',
//   object: 'event',
//   api_version: '2022-11-15',
//   created: 1688115156,
//   data: {
//     object: {
//       id: 'sub_1NOd4AEiIAzhG1HpWHdDxq20',
//       object: 'subscription',
//       application: null,
//       application_fee_percent: null,
//       automatic_tax: [Object],
//       billing_cycle_anchor: 1688115154,
//       billing_thresholds: null,
//       cancel_at: null,
//       cancel_at_period_end: false,
//       canceled_at: null,
//       cancellation_details: [Object],
//       collection_method: 'charge_automatically',
//       created: 1688115154,
//       currency: 'sgd',
//       current_period_end: 1719737554,
//       current_period_start: 1688115154,
//       customer: 'cus_OAsz0Tk5M6ZbTG',
//       days_until_due: null,
//       default_payment_method: 'pm_1NOXOOEiIAzhG1HpiPovRA4B',
//       default_source: null,
//       default_tax_rates: [],
//       description: null,
//       discount: null,
//       ended_at: null,
//       items: [Object],
//       latest_invoice: 'in_1NOd4AEiIAzhG1HpT8uY1tPQ',
//       livemode: false,
//       metadata: {},
//       next_pending_invoice_item_invoice: null,
//       on_behalf_of: null,
//       pause_collection: null,
//       payment_settings: [Object],
//       pending_invoice_item_interval: null,
//       pending_setup_intent: null,
//       pending_update: null,
//       plan: {
//         id: 'price_1NOMeyEiIAzhG1HpmdYApJtV',
//         object: 'plan',
//         active: true,
//         aggregate_usage: null,
//         amount: 2000,
//         amount_decimal: '2000',
//         billing_scheme: 'per_unit',
//         created: 1688052088,
//         currency: 'sgd',
//         interval: 'year',
//         interval_count: 1,
//         livemode: false,
//         metadata: {},
//         nickname: null,
//         product: 'prod_OAi5wtyVwUOW2b',
//         tiers_mode: null,
//         transform_usage: null,
//         trial_period_days: null,
//         usage_type: 'licensed',
//       },
//       quantity: 1,
//       schedule: null,
//       start_date: 1688115154,
//       status: 'active',
//       test_clock: null,
//       transfer_data: null,
//       trial_end: null,
//       trial_settings: [Object],
//       trial_start: null,
//     },
//     previous_attributes: { default_payment_method: null, status: 'incomplete' },
//   },
//   livemode: false,
//   pending_webhooks: 2,
//   request: {
//     id: 'req_6xmBpKb2QwWsNv',
//     idempotency_key: '289cbf11-0400-4d47-af03-11f96be4d2d6',
//   },
//   type: 'customer.subscription.updated',
// }
