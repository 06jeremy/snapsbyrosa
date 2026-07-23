# SNAPSBYROSA — Roadmap to Top 1% & €5k/Month

A working document. The goal is concrete: **fully booked months** = 2 retainer clients
+ at least 2 milestone shoots a week, landing **€5k/month or more**. This lays out
what you, the business, the socials, and the site each need. Check things off as you go.

Last updated: 22 July 2026

---

## The number, broken down

€5,000/month is very reachable with your mix. One realistic split:

| Source | Amount | What it is |
| --- | --- | --- |
| 2 retainer clients | €1,500 (2 × €750) | Monthly content for a company or founder — a set number of photos/reels each month |
| ~8 milestone shoots | €3,200 (8 × €400) | ~2 a week: athletes, founders, people marking a moment |
| Buffer / upsell | €300+ | Extra edits, rush delivery, print, licensing |
| **Total** | **€5,000+** | |

These are starting prices. Once you're turning work away, raise them. The path to
top 1% is not more shoots — it's **higher prices for the same number of shoots**.

---

## Phase 0 — Launch essentials (do before going live)

The site is built and de-slopped. These are the last blockers before it should be public.

- [x] **Legal placeholders removed** — KvK and btw-id lines dropped from `/legal` since
      registration isn't done yet, rather than showing "to follow." Revisit once KvK/btw-id
      exist — quotes go out net of VAT until then (see the pricing framework).
- [x] **Hosting provider confirmed** on `/legal` (privacy section) — GitHub Pages serves the
      site, Porkbun handles the domain and email forwarding.
- [x] **HTTPS fixed and enforced** — `snapsbyrosa.com` redirects HTTP → HTTPS with a valid
      certificate.
- [x] **Password gate removed** — `/home/`, `/legal`, `/work/*` are all directly public now.
- [ ] **Fix the domain root** — `snapsbyrosa.com` (`/`) still shows the old "coming soon, head
      to Pixieset" holding page with no link into `/home/`. Now that the gate's gone, this is
      the real blocker: decide whether `/` redirects to `/home/`, or the coming-soon page is
      retired and `/home/`'s content moves to `/`. This is also the URL the sitemap lists as
      priority 1.0, so it's what search engines index as the homepage.
- [ ] **Testimonials shows real placeholder text to live visitors** — "Client name" ×8,
      "Their words go here" ×3, "Video coming soon" ×3, confirmed on the live page. Fill with
      real quotes/video before launch, or comment the section out of `home/index.astro` until
      ready — no section reads better than an obviously fake one.
- [ ] **Set up Google Analytics** — deliberately deferred; site opens to the public first, GA4
      comes later. Create a free GA4 property, paste the `G-XXXXXXXXXX` ID into
      `src/components/Analytics.astro` (line 24) when ready.
- [ ] **Confirm `info@snapsbyrosa.com` actually delivers** — MX/SPF for Porkbun's email
      forwarding are correctly configured, but delivery to the inbox is unverified. Send a
      test email.
- [ ] **Confirm the real availability hours** in `src/components/Contact.astro` (currently
      Mon–Sat, 17:00–18:30 CET) — the file's own comment flags this as needing real values.
- [ ] **Get a free Web3Forms key** (web3forms.com) for `Contact.astro`'s `WEB3FORMS_KEY` —
      without it, Google Meet requests fall back to a `mailto:` link instead of landing
      directly in the inbox.
- [ ] **Buy/confirm the KvK registration** if not done — you cannot legally invoice without it.
- [ ] **Remaining LogoCloud logos** — Government of Curaçao, Favela Street, Youmeet, CSA still
      show as text-fallback wordmarks pending real transparent logo art (see the component's
      own TODO comment).

---

## Phase 1 — Foundation (weeks 1–4)

### You
- [ ] Write a one-line positioning statement you can say out loud: *"I make photo, film
      and social content for athletes, founders and people marking a milestone, in The Hague."*
- [ ] Pick your **3 signature deliverables** and name them (e.g. "Founder Story Shoot",
      "Milestone Session", "Monthly Content Retainer"). Clarity sells.
- [ ] Set your **prices in writing** (even if you only share on enquiry) so you never
      quote inconsistently.

### Business
- [ ] KvK registration + btw-id (Phase 0).
- [ ] A simple **quote/contract template** (algemene voorwaarden) — scope, usage rights,
      payment terms, cancellation. Have it reviewed once by a professional (see legal note).
- [ ] A **client onboarding flow**: enquiry → quote → deposit → shoot → delivery. Write
      it down so every client gets the same experience.
- [ ] Invoicing tool (Moneybird or e-Boekhouden are common NL choices).

### Socials
- [ ] Instagram bio matches the site exactly: what you do, who for, where, and a link.
- [ ] Pin 3 posts that show your **range**: one portrait, one reel, one brand/company job.
- [ ] Turn on a professional/business account so you get insights.

### Site
- [x] Copy cleaned up, The Hague / since 2024 everywhere, footer on brand.
- [x] Single-block auto-advancing contact form with contact info below.
- [x] Legal & privacy page.
- [x] Consent-gated analytics scaffold.
- [ ] Go live and submit the sitemap (see SEO below).

---

## Phase 2 — Get found (weeks 2–8, ongoing)

### Advanced SEO (already built into the site)
The technical groundwork is in place: clean semantic HTML, fast static Astro build,
structured data (ProfessionalService + founder), Open Graph/Twitter cards, canonical
URLs, a sitemap, and robots.txt. What's left is **content and signals**:

- [ ] **Google Business Profile** — free, and the single biggest local-SEO lever. Register
      "SNAPSBYROSA, The Hague". This is how you show up in Maps and local searches like
      *"personal brand photographer The Hague"*.
- [ ] **Google Search Console** — verify the site, submit `sitemap.xml`. Free, tells you
      exactly what people search to find you.
- [ ] **Real reviews** — after each happy client, ask for a Google review. 10+ reviews
      moves you up local rankings fast. Once you have real ones, we can add them to the
      site with proper `Review` structured data (do NOT fabricate any).
- [ ] **Target real search terms** in a short services page or FAQ: "personal brand
      photographer The Hague", "founder headshots Den Haag", "content creator for athletes",
      "employer branding video Netherlands". Write like a human answering a question.
- [ ] **Confirm your real socials** and add them to the site's structured data `sameAs`
      (currently only Instagram is listed — add Vimeo/LinkedIn/TikTok when real).

### AI search (ChatGPT, Claude, Perplexity, Google AI)
AI answers pull from clear, factual, well-structured pages — which you now have.
- [ ] Keep the copy **specific and factual** (who, what, where, prices-on-enquiry). AI
      surfaces sites that state facts plainly. The structured data already helps here.
- [ ] Get **mentioned on other sites** (directories, collaborators, press). AI weighs
      third-party mentions heavily.

### Instagram & TikTok
The algorithm rewards consistency and watch-time, not perfection.
- [ ] **Post 3–5× a week**, mostly reels. Repurpose the same clip to both platforms.
- [ ] **Hook in the first second** — the result, the transformation, the behind-the-scenes.
- [ ] Use **3–5 relevant hashtags**, not 30. Local + niche: #denhaag #personalbranding
      #contentcreator.
- [ ] **Show your face and process** — people book people. Talk to camera occasionally.
- [ ] **One clear CTA** in bio and captions: "Book a shoot → link in bio" pointing at the site.
- [ ] Reply to every comment/DM within a few hours — engagement compounds.

---

## Phase 3 — Book it out (weeks 4–12)

### Retainer clients (target: 2)
- [ ] Make a **one-page retainer offer**: "X photos + Y reels a month for €750, shot and
      edited by me." Companies love predictable content.
- [ ] Approach **5–10 local businesses** whose brand you'd genuinely improve. Show them a
      mock of what their feed could look like.
- [ ] Offer a **first-month trial rate** to land the relationship, then lock the retainer.

### Milestone shoots (target: 2/week)
- [ ] Lean on your niche: athletes signing/transferring, founders launching, graduations,
      anniversaries, promotions. These have deadlines — people pay to capture them.
- [ ] **Referral loop**: every client gets 2 shareable edits + a "refer a friend, both get
      10% off" note. Word of mouth is your cheapest channel.
- [ ] **Partner with adjacent businesses** — gyms, coworking spaces, agencies, event
      venues — who send you a steady stream of milestone clients.

---

## Phase 4 — Reach top 1% (months 3–12)

Top 1% is not busier — it's **more selective and better paid**.
- [ ] **Raise prices** once you're booking 2/week comfortably. Aim milestone shoots toward
      €500–750 and retainers toward €1,000+.
- [ ] **Signature style** — make your edits instantly recognisable (colour, framing, pace).
      People should know it's yours before they see the tag.
- [ ] **Testimonials + case studies** on the site: "Here's what I shot for X and what it did."
- [ ] **A portfolio that says no** — only show the work you want more of. Cut anything
      off-brand.
- [ ] **Systemise delivery** so a shoot takes less of your time: templates for editing,
      a gallery-delivery tool, a standard turnaround you promise and beat.
- [ ] **Own a lane** — become *the* person for one specific thing (e.g. "athlete personal
      branding in NL"). Specialists charge more and get referred more.

---

## Dashboard & tracking

**Google Analytics 4** is the right call — free, and the standard. It's already scaffolded
in the site (privacy-first, consent-gated). Once you paste your Measurement ID:

- **What to watch:** visits, which pages they land on, where they come from (Google,
  Instagram, direct), and how many click the contact form / WhatsApp.
- **View it as a dashboard:** GA4's own "Reports" and "Realtime" screens work well. For a
  cleaner single-screen view, connect GA4 to the **free Looker Studio** and build a one-page
  dashboard (visits, top pages, traffic sources, contact clicks).
- **The one metric that matters:** enquiries per month. Everything else is a leading
  indicator. Track it against the €5k goal.

Alternative if you'd rather have **no cookie banner at all**: a cookieless tool like
**Plausible** or **Umami** (small monthly fee, or self-host Umami free). Simpler and
privacy-friendly by default. GA4 is free and more powerful; either is fine.

---

## Monthly review (keep this honest)

At the end of each month, fill this in:

| Month | Enquiries | Shoots | Retainers | Revenue | Notes |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

You've hit the goal when: **2 retainers + ~8 milestone shoots + €5k**, repeatably.

---

## Legal note

The `/legal` page is a clear, standard baseline covering business details, privacy
(GDPR/AVG), cookies, and terms of use. It is **not formal legal advice**. Before you
rely on it commercially, have a Dutch professional review it once — together with your
project terms (algemene voorwaarden). The bracketed placeholders (KvK, btw-id, hosting
provider) must be filled with your real details first.
