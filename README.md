# Kanchwala Storefront Demo

Static jewellery storefront concept for `Kanchwala`, designed as a warm beige-and-gold luxury UI with Arabic-first presentation, English switching, and a future Shopify implementation path.

## Repository

- GitHub: [abizertc-arch/Kanchwala](https://github.com/abizertc-arch/Kanchwala)
- Live demo: [https://abizertc-arch.github.io/Kanchwala/](https://abizertc-arch.github.io/Kanchwala/)

## Current Frontend Scope

This repo currently contains a static demo of:

- Homepage
- Collection page
- Product page
- Cart drawer
- Arabic and English UI switching
- RTL and LTR layout switching
- Mobile and desktop navigation
- Civil ID collection concept inside the cart flow

## Project Files

- `index.html` - homepage
- `collection.html` - collection listing page
- `product.html` - product detail page
- `styles.css` - shared theme styling and responsive rules
- `cart.js` - cart drawer, language switching, Civil ID form behavior
- `images/` - jewellery product and visual assets

## Theme Design System

### Fonts

- Heading font: `Cairo`
- Accent font: `Noto Kufi Arabic`
- Body font: `Cairo`

### Main Colors

- Brand gold: `#c7a35f`
- Gold light: `#e1c891`
- Gold dark: `#9a7233`
- Ivory background: `#fcf5ea`
- Cream surface: `#f4e6cf`
- Primary text brown: `#4b3c2b`
- Muted text brown: `#8d7657`
- Dark brown: `#3c2f21`
- Deep brown: `#261d14`
- White: `#fffdf8`

### Visual Direction

- Warm beige luxury look instead of a dark burgundy-first look
- Rounded cards and drawers
- Gold gradient buttons
- Soft cream surfaces
- Arabic-first typography with English support

## Mobile Header and Menu Plan

### Final Mobile Header Behavior

On mobile, the header should stay compact:

- menu button
- logo
- search button
- account button
- cart button

The language switch should not appear in the mobile top bar.

It should appear only inside the slide-out mobile menu.

### Final Mobile Menu Behavior

The mobile menu should contain:

- brand logo
- language switch
- navigation links

This keeps the laptop header richer while mobile stays clean and usable.

## Shopify Migration Plan

This static demo can be moved into Shopify in phases.

### Phase 1: Theme Build

We convert the static files into Shopify theme sections/snippets:

- `header`
- `announcement bar`
- `hero`
- `collection grid`
- `featured products`
- `product template`
- `cart drawer`
- `footer`

### Phase 2: Theme Settings

We move visual controls into Shopify theme settings:

- logo
- fonts
- color palette
- button style
- spacing
- announcement bar text
- menu selection

### Phase 3: Language Structure

We replace hardcoded bilingual UI with proper Shopify locale-based translation:

- Arabic locale
- English locale
- RTL/LTR support

### Phase 4: Civil ID Verification Workflow

We add a simple non-Plus verification flow that works before or after checkout depending on the chosen implementation.

## Civil ID Verification Without Shopify Plus

The goal is:

- collect Civil ID details
- connect them to the order
- manually verify each order
- avoid Shopify Plus
- avoid expensive apps

The best low-cost solution is to use a normal Shopify theme plus a small custom backend.

## Recommended Approaches

### Approach 1: Theme Form + External Secure Storage + Shopify Order Status

This is the best balance of cost, control, and safety.

#### How it works

1. Customer enters:
   - full name
   - Civil ID number
   - phone number
   - front image
   - back image
2. Images and sensitive data are uploaded to your own secure backend or storage.
3. The storefront sends only a reference ID into Shopify.
4. After order creation, staff manually verify the uploaded documents.
5. Staff mark the order as:
   - pending
   - verified
   - rejected

#### What is stored in Shopify

- order tag: `civil_id_pending`
- order tag: `civil_id_verified`
- order tag: `civil_id_rejected`
- order metafield: `custom.civil_id_status`
- order metafield: `custom.civil_id_record_id`
- order metafield: `custom.civil_id_last4`
- order metafield: `custom.civil_id_verified_at`

#### What is stored outside Shopify

- full Civil ID number
- front image
- back image
- upload timestamp
- internal review notes

#### Why this is recommended

- no Shopify Plus
- no expensive app
- more secure than putting raw ID data into order notes
- easy to review manually

## Approach 2: Theme Fields + Line Item Properties or Cart Attributes

This is the fastest build, but not the best long-term data design.

#### How it works

1. Customer enters Civil ID details in the theme.
2. The values are stored temporarily in line item properties or cart attributes.
3. The order is created with those attached fields.
4. Staff manually review and follow up outside Shopify if images are uploaded somewhere else.

#### Pros

- fastest to launch
- no Plus
- simple frontend integration

#### Cons

- not ideal for sensitive data
- not ideal for storing image references long-term
- harder to manage as order volume grows

#### When to use it

- pilot launch
- low volume
- temporary proof of concept

## Approach 3: Manual Verification After Order Placement

This is the simplest operationally, but weaker from a compliance/control point of view.

#### How it works

1. Customer places order normally.
2. Store contacts the customer by WhatsApp, phone, or email.
3. Customer sends Civil ID details manually.
4. Staff verify before fulfillment.

#### Pros

- almost no technical setup
- no app needed
- quickest possible start

#### Cons

- manual workload is high
- bad customer experience
- weaker process control
- easy to miss or delay orders

#### When to use it

- emergency temporary process only

## Recommended Final Choice

Use **Approach 1**.

That means:

- collect the details in the storefront
- store sensitive files outside Shopify
- keep only verification references/status inside Shopify
- verify manually in an internal workflow

This is the cleanest non-Plus path.

## Step-by-Step Action Plan for Civil ID

### Option A: Low-Cost Production Path

1. Build the Civil ID form in the theme.
2. Create a small backend endpoint for uploads and verification records.
3. Upload front/back images to secure storage.
4. Return a `record_id` to the storefront.
5. Attach that `record_id` to the cart/order.
6. After order creation, sync the record to the Shopify order.
7. Add tags and metafields in Shopify admin.
8. Staff manually verify each order.
9. Staff mark each one as approved or rejected.

### Option B: Fast MVP Path

1. Keep the Civil ID form in the theme.
2. Save minimum data into cart attributes or line item properties.
3. Upload images separately.
4. Review manually.
5. Replace this later with Option A.

## Shopify Data Model Recommendation

### In Shopify

Store only:

- verification status
- reference ID
- last 4 digits
- admin tags
- review timestamp

### Outside Shopify

Store:

- full Civil ID number
- front image
- back image
- any reviewer notes

## Manual Review Workflow

For each incoming order:

1. Order appears with `civil_id_pending`
2. Staff open the verification record
3. Staff compare:
   - order name
   - phone number
   - uploaded Civil ID details
4. Staff approve or reject
5. Update the order status in Shopify

## Security Notes

Do not store full Civil ID images permanently in:

- order notes
- plain theme fields
- unstructured cart notes

Use encrypted external storage and limit admin access to only staff who need it.

## What Shopify Features Help Here

Useful standard Shopify capabilities:

- theme customization
- cart attributes
- line item properties
- order tags
- order metafields

This can be done without:

- Shopify Plus
- checkout step customization on Plus-only surfaces
- expensive third-party verification apps

## Local Preview

You can preview the static site by:

1. Opening `index.html` directly in a browser
2. Serving the folder from any static server

## Notes

- This repo is still a frontend demo, not a live checkout system.
- The Civil ID flow in this repo is currently only a UI concept.
- The production Shopify version should move sensitive verification data into a proper backend workflow.
