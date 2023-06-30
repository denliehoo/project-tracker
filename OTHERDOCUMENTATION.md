
# Stripe
- Stripe for recurring payments of premium tier [https://stripe.com/docs/billing/quickstart] 
- Useful guide for reference (doesn't work 100% though)
    - https://saasbase.dev/blog/subscription-payments-1-adding-basic-and-pro-subscription-plans-using-stripe 
    - https://saasbase.dev/blog/subscription-payments-2-keeping-track-of-customer-billing-information-using-mongo-and-stripe-webhooks 
    - https://saasbase.dev/blog/subscription-payments-3-update-and-cancel-plans-via-a-manage-billing-screen-using-stripe
    - https://saasbase.dev/blog/subscription-payments-4-access-premium-content-based-on-a-subscription-plan
    - https://saasbase.dev/blog/subscription-payments-5-deploy-stripe-application-to-production-using-heroku
    - https://github.com/bdcorps/stripe-subscriptions-nodejs
- Note, for testing local with stripe, need to install stripe cli from stripe website. 
- For windows, after downloading, need add path variable in git bash:
    - notepad ~/.bashrc
    - copy paste the path to the downloaded and extracted stripe; put this in notepad and save:
    - export PATH="/drive/path/to/folder/with/stripe:$PATH" e.g. for me, it is in downloads/stripe folder. Hence, i used below
    - export PATH="/d/Users/Denli/Downloads/stripe:$PATH"
    - save and close the notepad then restart terminal
- Note: For mac, start here and go to terminal and just do:
    - brew install stripe/stripe-cli/stripe
- From there, can use stripe in gitbash terminal
    - stripe login  (if havent already logged in)
    - cancel, then do this to listen to the webhook; put whatever endpoint and localhost pot being used
    - stripe listen --forward-to localhost:3001/payments/stripe/webhook
    - now, when we do stuff, we with stripe, it will send a event to that endpoint. Note:this is for local testing only. 
    - we also have to do stripe listen ..... whenver we want to do local testing
    - Note: this is only for LOCAL testing, if in production, get just specify the webhook link to stripe in the dashboard
- testing credit card number: 4242424242424242

# Problem with placing env variables in imports/requires
- not sure why, but i'll get an error when i put (e.g. const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY) ) at the top of my file for controllers. Basically I get undefined value for the env variable. This is despite the fact that i placed: require('dotenv').config() in the entry file. 
- however, if for example, i console.log() it in a function call which is trigerred by an API request (for controllers), it gets logged out correctly
- It seems that the controller file gets executed first before the app.js (entry file) and thats why its undefined. 
- not to sure the cause, but a work around it is to put require('dotenv').config() at the top of the file e.g.
``` Javascript
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
```
- Note: this is considered bad practise but is a good workaround at least for now