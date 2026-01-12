Got it — thank you for the correction.
You’re absolutely right, and this is an important distinction.

What you want is **not a replacement PRD**, but:

> **The original PRD structure + decisions + phase plan
> with requirements and user stories layered on top of it.**

Below is a **merged, canonical PRD** where:

* ✅ **All previously agreed structure, phases, and decisions remain**
* ✅ **Nothing is removed or rewritten away**
* ✅ **Requirements & user stories are ADDED inside each phase**
* ✅ **You can still read it top-down as a simple plan**
* ✅ **You can also use it bottom-up as a “definition of done”**

Think of this as **PRD v1.1 (expanded)**.

---

# PRD — *A Whole Life*

**(Merged + Expanded with Requirements & User Stories)**

---

## 1. Product Summary (UNCHANGED)

*A Whole Life* is a **creator-owned, text-first platform** that combines:

* a blog
* a life-timeline archive
* a private music platform
* a paid community
* direct monetization

The platform launches **unstyled, minimal, and functional**, and grows in capability—not polish.

---

## 2. Tech Stack (UNCHANGED)

* Frontend: Next.js (App Router), TypeScript
* Styling: Tailwind + shadcn/ui (defaults only initially)
* CMS: Payload
* Auth / Data (where needed): Convex
* Hosting: Vercel
* Payments: Stripe (single account)

---

## 3. Locked Product Decisions (UNCHANGED)

* Auth: email/password **and** magic link
* Timeline: date-based **and** age-based
* Pricing:

  * Community = cheapest
  * Music = more expensive and **includes community**
* Erotic writing: one category to start
* Royalties: manual
* App: explicitly out of scope
* Language:

  * Swedish + English mixed
  * Automatic translation both ways
  * Manual fine-tuning supported

---

## 4. Core Content Models (UNCHANGED)

(Kept exactly as before: BlogPost, MusicTrack, User, Comment, Event, BookingRequest.)

---

# 5. Phase Plan

**(Original phases preserved, now expanded with requirements & user stories)**

---

## PHASE 0 — Skeleton (Local & Private)

**Goal:** Enable writing and archiving with no public pressure.

### Features (original)

* Payload CMS
* BlogPost creation
* Life date + life age
* Minimal frontend
* No auth, no payments, no styling

### Added Functional Requirements

* Admin can:

  * create, edit, delete (soft-delete) posts
  * save drafts
  * publish/unpublish posts
  * attach multiple images
  * set lifeDate and/or lifeAge independently
* System must:

  * allow posts without lifeDate or lifeAge
  * store content independently of deploys
  * generate stable URLs

### User Stories

* As the creator, I can write without committing to sharing.
* As the creator, I can archive memories from any time in my life.
* As the creator, I don’t have to decide structure perfectly yet.

### Definition of Done

* Posts can be written, saved, published, viewed.
* Life-time fields exist and persist.
* No auth, no styling dependencies.

---

## PHASE 1 — Public Archive & Timeline

**Goal:** Make the archive navigable by others.

### Features (original)

* Public blog feed
* Timeline toggle
* Tag & category filtering
* Image galleries
* Static pages

### Added Functional Requirements

* Timeline toggle must:

  * switch ordering instantly
  * fallback gracefully if lifeDate is missing
* Filters must:

  * be combinable
  * not break pagination or URLs
* Static pages editable in CMS

### User Stories

* As a reader, I can explore the creator’s life chronologically.
* As a reader, I can focus on specific periods or themes.
* As a reader, I understand what this site is.

### Definition of Done

* Timeline ordering works correctly.
* Filters never produce empty/broken states.
* Static pages load publicly.

---

## PHASE 2 — Bilingual Writing System

**Goal:** Support mixed-language expression.

### Features (original)

* Language detection
* Automatic translation
* Manual fine-tuning
* Reader language toggle

### Added Functional Requirements

* On publish:

  * original language is detected
  * translation runs async
* Storage must keep:

  * original text
  * auto translation
  * manual override (if edited)
* Reader preference persists per session

### User Stories

* As the creator, I write naturally without choosing a language.
* As a reader, I can read everything in one language.
* As the creator, I can polish translations later.

### Definition of Done

* Every post has two readable versions.
* Manual edits override automation.
* Publishing never waits on translation.

---

## PHASE 3 — Accounts & Community Membership

**Goal:** Introduce commitment and safety.

### Features (original)

* Auth (magic link + password)
* Community subscription (lowest price)
* Paid commenting

### Added Functional Requirements

* Auth must:

  * support login/logout
  * persist sessions
* Stripe must:

  * create recurring subscriptions
  * sync status to user
* Comments must:

  * be text-only
  * be deletable by admin
  * require active community membership

### User Stories

* As a member, paying even 1 kr feels intentional.
* As the creator, I avoid anonymous abuse.
* As a member, my access updates immediately.

### Definition of Done

* Non-members cannot comment.
* Cancelled subscriptions remove access.
* Stripe webhooks are reliable.

---

## PHASE 4 — Locked Writing & Categories

**Goal:** Monetize writing safely.

### Features (original)

* Category-based paywalls
* Locked posts
* Erotic writing category

### Added Functional Requirements

* Categories define access rules
* Posts inherit category rules
* Locked posts show:

  * preview
  * clear upgrade message
* Erotic category:

  * always locked
  * clearly labeled

### User Stories

* As a reader, I understand why content is locked.
* As the creator, I publish intimate work safely.

### Definition of Done

* Locked content never leaks.
* Access rules apply consistently.

---

## PHASE 5 — Music Platform (MVP)

**Goal:** Become “my own Spotify”.

### Features (original)

* Music uploads
* Audio playback
* 1-play IP rule
* Music subscription includes community

### Added Functional Requirements

* Admin can:

  * upload audio
  * mark demo/released
  * add collaborators
* Playback must:

  * not block page render
  * respect IP limits
* Subscription logic:

  * music tier > community tier
  * music tier includes community

### User Stories

* As a visitor, I can sample music once.
* As a supporter, I can listen freely.
* As the creator, unreleased music lives here.

### Definition of Done

* IP limits work.
* Subscribers never hit limits.
* Audio playback is stable.

---

## PHASE 6 — Music Analytics & Royalties

**Goal:** Transparency and ownership.

### Features (original)

* Stream tracking
* Revenue tracking
* Manual royalties
* Reports

### Added Functional Requirements

* System tracks:

  * streams per track
  * streams per user (if logged in)
* Admin dashboard shows:

  * monthly totals
  * per-track revenue
* CSV export supported

### User Stories

* As the creator, I can explain income clearly.
* As a collaborator, numbers feel fair.

### Definition of Done

* Numbers are internally consistent.
* Reports export correctly.

---

## PHASE 7 — Membership Tiers & Events

**Goal:** Reward loyalty.

### Features (original)

* Supporter / Fan / Partner
* Tier-locked events

### Added Functional Requirements

* Tier hierarchy enforced everywhere
* Events:

  * created via CMS
  * locked by tier
  * have date + description

### User Stories

* As a top supporter, I get closer access.
* As the creator, I reward loyalty intentionally.

### Definition of Done

* Tier checks are consistent.
* Event access is enforced.

---

## PHASE 8 — Community Touchpoints

**Goal:** Ongoing connection.

### Features (original)

* Weekly check-ins
* RSVP
* Event discussions

### Added Functional Requirements

* RSVP stored per user
* Admin can see attendees
* Event discussions follow comment rules

### User Stories

* As a member, I can show up.
* As the creator, I know who’s coming.

### Definition of Done

* RSVP works.
* Discussions respect access.

---

## PHASE 9 — Booking System

**Goal:** Monetize presence.

### Features (original)

* Booking requests
* Booking types
* Manual approval

### Added Functional Requirements

* Public booking form
* Admin status updates
* No double-booking allowed
* Notes + invoice context stored

### User Stories

* As a booker, it’s easy to reach out.
* As the creator, bookings don’t overwhelm me.

### Definition of Done

* Requests persist.
* Status updates reliable.

---

## 6. Final Invariant

Nothing ships unless:

* It respects ownership
* It preserves life as archive
* It avoids algorithmic pressure
* It can be explained calmly, in human language