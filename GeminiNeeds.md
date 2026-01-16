# Gemini Needs - GoViral (PostDoctor)

**To:** The Founder
**From:** Gemini
**Date:** Jan 15, 2026
**Subject:** Prerequisites for Monday Launch (Jan 19)

Boss, I've reviewed the code. It's solid. We are ready to rock, *technically*. But I can't launch a rocket without fuel. I need you to spend this weekend acting as our "Head of Operations" to get the following keys.

Without these, the product is a beautiful shell. With them, it's a money printer.

## 1. Social Media Developer Keys (CRITICAL)
*Why:* Users pay us to post for them. We can't post without these keys.
*Action:* Follow the **`INTEGRATION_GUIDE.md`** file I found in the repo. It has step-by-step links.
*Deliverable:* A list of keys to put in `server/.env`.
    *   **Twitter/X:** API Key, API Secret, Access Token, Access Secret. (Must have "Write" permissions).
    *   **LinkedIn:** Client ID, Client Secret.
    *   **Facebook/Instagram:** App ID, App Secret.
    *   (Optional for now): Reddit, Slack, Discord.

## 2. Firebase Production Credentials
*Why:* We need to authenticate real users, not just me testing with `mock-token`.
*Action:* Go to Firebase Console -> Project Settings -> Service Accounts -> "Generate new private key".
*Deliverable:* Download the file, rename it to `serviceAccountKey.json`, and send it to me (or upload to the server). **Do not commit this to Git.**

## 3. Stripe Keys (Live Mode)
*Why:* You want to make money, right?
*Action:* Go to Stripe Dashboard -> Developers -> API Keys.
*Deliverable:*
    *   `STRIPE_PUBLISHABLE_KEY` (starts with `pk_live_...`)
    *   `STRIPE_SECRET_KEY` (starts with `sk_live_...`)
    *   `STRIPE_WEBHOOK_SECRET` (from the Webhooks tab).

## 4. VPS / Hosting Access
*Why:* I need to deploy this to the public web. Localhost doesn't make money.
*Action:* I see `ops/` scripts, but I need the server IP and SSH key if I am to deploy it for you. Or, if you have a Vercel/Railway/Render account, give me the login.
*Recommendation:* For a startup on a budget, a $5/mo DigitalOcean Droplet or Hetzner VPS is sufficient for the Docker setup we have.

## 5. Domain Name DNS
*Why:* `postdoctor.app` (or whatever domain we are using) needs to point to our server.
*Action:* Login to GoDaddy/Namecheap/Cloudflare.
*Deliverable:* Be ready to update `A Records` when I give you the IP.

---
**Summary:**
I can fix code, but I can't bypass Twitter's security. Get me these keys, and by Monday morning, we are live.
