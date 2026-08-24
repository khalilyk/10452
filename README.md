# 10452.SPACE

12 drops. 12 months. 100 pieces each. No repeats.

```bash
npm install
npm run dev
```

---

## Before this can sell anything

Two things are deliberately not faked, because both are promises to a customer.

### 1. Checkout is not connected

`ORDER NOW` and Apple Pay are drawn exactly as designed, but no payment
provider is wired. Pressing either says so plainly rather than appearing to
work. Everything needed lives behind one seam — `src/lib/commerce.ts` — where
only two functions need writing:

- `checkout(line)` — create a session with the provider, return its URL
- `fetchRemaining(dropNumber)` — live stock for the drop

Then set `COMMERCE_CONFIGURED = true`.

**Apple Pay is a wallet, not a provider.** It needs a processor behind it
(Stripe or Shopify Payments), a verified domain with Apple, and a merchant
certificate. `applePayAvailable()` already checks the browser side.

### 2. The 100-piece count is not live

`remaining` in `src/data/drops.ts` is a typed number so the page can be built
and reviewed. **It must come from whoever takes the orders before launch.**

This matters more here than on a normal shop. Scarcity *is* the product — "37 /
100 LEFT" is the reason someone buys today instead of thinking about it. A count
that never moves is a lie about the one thing the brand is selling, and if two
people buy the last piece because the page served a stale constant, that is a
refund and a broken promise on the first drop.

---

## Adding the campaign photograph

The hero shows a marked-up contact-sheet frame until a photograph exists. Put
the file in `public/drops/` and set `image` on the drop:

```ts
image: '/drops/001-batroun.jpg',
```

Same for `artwork` — the stamp graphic itself.

## Adding a drop

Append to `DROPS` in `src/data/drops.ts`, set the previous one to `sold-out`,
and the homepage becomes the new chapter. Sold-out drops fall into the archive
automatically. There is no catalogue by design: one drop, one opportunity.

## The contact form

Same arrangement as checkout: nothing is transmitted from the page. Set
`CONTACT.address` in `src/lib/contact.ts` and it composes a message in the
sender's own mail client, which they review and send. Point `CONTACT.endpoint`
at a form service instead and the fetch is already written.

Until one of those is set, submitting says so plainly. A form that swallows a
message and thanks you for it is worse than one that admits it has nowhere to
send it.

`address` is left empty on purpose — publishing an inbox on a public page
invites the obvious, and it is not mine to expose.

## Design notes

- One monospace face throughout (IBM Plex Mono) — the brief asks for "an old
  receipt or postal document", and a receipt is set in one width.
- Palette: Lebanese flag red `#C8102E` and green `#00733E`, the navy of the
  stamp artwork, cream paper, black.
- The copyright year is computed. A new shop showing a stale year reads as
  abandoned.
