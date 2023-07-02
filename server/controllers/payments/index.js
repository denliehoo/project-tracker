require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
import models from '../../models'
import { findUserByEmail, findUserByStripeId } from '../../utility/findFromDb'

const productToPriceMap = {
  monthly: 'price_1NOMekEiIAzhG1HpOZme9Ow1',
  annual: 'price_1NOMeyEiIAzhG1HpmdYApJtV',
}
const priceToProductMap = {
  price_1NOMekEiIAzhG1HpOZme9Ow1: 'monthly',
  price_1NOMeyEiIAzhG1HpmdYApJtV: 'annual',
}

const createCheckoutSession = async (req, res) => {
  const YOUR_DOMAIN = 'http://localhost:3000'
  // how do i get customerID in here?
  const user = await findUserByEmail(req.email)
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

// allows user to manage their billing
const createPortalSession = async (req, res) => {
  // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
  // Typically this is stored alongside the authenticated user in your database.
  let user = await findUserByEmail(req.email)
  //might not be stripeId. maybe it is the literal session when created during create subscription?
  // const checkoutSession = await stripe.checkout.sessions.retrieve(user.stripeId)
  // this is the actual checkout session. Think this was created in an event? Think means need to add this to user entity too??
  // maybe liten to checkoutsession completed event in webhook? TBC not sure howit works
  const checkoutSession = await stripe.checkout.sessions.retrieve(
    // 'cs_test_a1Kcu6wvE4UhzJEBzCoN4cAMqAdag2ZandpMf4ngnZqmvyBmbyrH5O09DB',
    user.stripeCheckoutSession,
  )

  // This is the url to which the customer will be redirected when they are done
  // managing their billing with the portal.
  const returnUrl = 'http://localhost:3000/settings'

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer,
    return_url: returnUrl,
  })

  return res.json({ url: portalSession.url })
  // res.redirect(303, portalSession.url)
}

const stripeWebhook = (request, response) => {
  const sig = request.headers['stripe-signature']
  const endpointSecret =
    'whsec_83e6050341b6a3b6a784d1c741259f2be7a07e196e67a2158bdabfb408d560ce'

  let event
  let subscription
  let status

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret)
  } catch (err) {
    console.log(err)
    response.status(400).send(`Webhook Error: ${err.message}`)
    return
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.trial_will_end':
      subscription = event.data.object
      status = subscription.status
      // Then define and call a method to handle the subscription trial ending.
      // handleSubscriptionTrialEnding(subscription);
      break
    case 'customer.subscription.deleted':
      subscription = event.data.object
      status = subscription.status

      // Then define and call a method to handle the subscription deleted.
      // handleSubscriptionDeleted(subscriptionDeleted);
      break
    // create can still have a status of inactive since its just a create
    // over here, dont really need to do anything
    case 'customer.subscription.created':
      subscription = event.data.object
      status = subscription.status

      // Then define and call a method to handle the subscription created.
      // handleSubscriptionCreated(subscription);
      break
    // update here could mean that the user paid, or, paid again for the next subscription
    // over here, need to change status to premium
    case 'customer.subscription.updated':
      subscription = event.data.object
      status = subscription.status

      handleSubscriptionUpdated(subscription)
      break
    case 'checkout.session.completed':
      handleCheckoutSessionComplete(event.data.object)
      break
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`)
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send()
}

// pass event.data.object here
const handleCheckoutSessionComplete = async (d) => {
  let user = await findUserByStripeId(d.customer)
  user.stripeCheckoutSession = d.id
  await user.save()
}
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
