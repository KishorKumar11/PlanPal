# Recommendations → Decision Loop

**Date:** 2026-05-29
**Status:** Approved

## Overview

PlanPal currently ends at voting — users thumbs-up recommendations but nothing happens next. This spec closes the loop: voting triggers an automatic plan decision, members coordinate a date on an availability grid, and completed plans are archived for history. A shareable card gives the group a way to spread the word.

---

## 1. Activity Auto-Lock

### Trigger
When the last group member casts their first vote (thumbs up or down on any recommendation), the system evaluates all recommendation scores and locks the top-scored recommendation as "the plan."

### Vote Page Changes
- A status bar at the top shows "Waiting for X more members to vote" with member avatars — greyed out for those who haven't voted yet.
- When the last vote lands: a confetti/celebration animation fires, the winning card is highlighted with a winner state (crown SVG), and losing cards dim but remain visible.
- After the celebration, the page redirects to `/group/[id]/plan`.

### Data Model Changes
Add to `VibeGroup`:
- `planStatus`: enum `idle | voting | locked` (default `idle`)
- `lockedRecommendationId`: optional foreign key to `Recommendation`

`planStatus` transitions:
- `idle` → `voting`: first vote cast in the group
- `voting` → `locked`: last member casts their first vote
- `locked` → `idle`: creator marks plan as done (see Section 4)

Note: "last member" means every member present in the group at the time the lock check runs. Members who join after voting begins must also vote before auto-lock triggers.

---

## 2. Plan Page & Group Page Preview

### New Route: `/group/[id]/plan`
Shows:
- The locked recommendation in full: title, category SVG icon, description, price range, duration, energy level, "why this fits" expandable
- Vote tally (e.g. "4 of 5 members voted for this")
- Date availability grid (Section 3)
- Share card button (Section 5)
- Creator-only: "Mark as Done" button (Section 4)

### Group Page Changes
- When `planStatus === locked` or `done`: the "Get AI Recommendations" button is replaced by a prominent "Our Plan" card showing the activity title, category SVG icon, locked date (if set), and a "View Plan" link to `/group/[id]/plan`.
- When `planStatus === idle` or `voting`: existing behaviour — show recommendations button and, if voting is in progress, a "Voting in progress" indicator linking to the vote page.

### Vote Page Changes
- Adds the "Waiting for X members" status bar at the top.
- When `planStatus === locked`, the page shows the winner state and a link to the plan page instead of the normal card list.

---

## 3. Date Availability Grid

### Setup (Creator Only)
After the plan locks, the creator sees a "Set a date window" prompt on the plan page. They pick a start and end date (max 14 days apart) using a date range picker. This is optional — the plan page is usable without a date window.

Add to `VibeGroup`:
- `dateWindowStart`: optional `DateTime`
- `dateWindowEnd`: optional `DateTime`
- `lockedDate`: optional `DateTime`

### Grid (All Members)
- A horizontal grid of day columns spanning the creator's window (e.g. Mon Jun 2 … Sun Jun 15, max 14 columns).
- Members mark their free days by tapping — selected days highlight in the group accent colour.
- Each day column shows a stacked count of how many members are free (e.g. "3/5").
- The day with the highest count is highlighted as the suggested best date.

### Auto-Lock
- When the last member submits their availability, the day with the highest member count auto-locks as `lockedDate`.
- Creator receives a subtle "Date set — tap to change" affordance. Tapping opens the date window picker again; saving a new window resets member availability and restarts the grid.

### New Data Model: `Availability`
| Field | Type | Notes |
|-------|------|-------|
| `id` | String | cuid |
| `userId` | String | FK User |
| `groupId` | String | FK VibeGroup |
| `date` | DateTime | midnight UTC of the free day |

One row per free day per user. Replaced wholesale when a user resubmits.

---

## 4. Plan History

### "Mark as Done" Action
- Creator-only button on `/group/[id]/plan`.
- Sets `planStatus` to `done`, snapshots the current plan into a new `Plan` row, then resets `lockedRecommendationId` and `lockedDate` to null and sets `planStatus` back to `idle`.

### History Display
- On the group page, below the Members section: a collapsible "Past Plans" section.
- Each row shows: activity title, category SVG icon, locked date (or "No date set"), and a "Done" badge.
- Tapping a row expands it inline to show the full recommendation description and reasoning — no separate route.

### New Data Model: `Plan`
| Field | Type | Notes |
|-------|------|-------|
| `id` | String | cuid |
| `groupId` | String | FK VibeGroup |
| `title` | String | snapshot from Recommendation |
| `category` | String | snapshot |
| `description` | String | snapshot |
| `reasoning` | String | snapshot |
| `metadata` | Json | price_range, duration, energy_level |
| `lockedDate` | DateTime? | the agreed date, if set |
| `completedAt` | DateTime | when marked done |

Snapshots decouple history from live `Recommendation` rows, which may be cleared on regeneration.

---

## 5. Shareable Card

### Location
"Share Plan" button on `/group/[id]/plan`, visible when `planStatus === locked`.

### Card Contents
- Group name
- Activity title and category (with SVG icon)
- Locked date, or "Date TBD" if not yet set
- PlanPal wordmark and app URL in the corner

### Implementation
- The card is a styled hidden `<div>` on the plan page rendered at a fixed width (e.g. 600px).
- On click, `html2canvas` captures the div as a PNG.
- On desktop: PNG is offered as a file download.
- On mobile: Web Share API triggers the native share sheet with the PNG.
- Fallback: if `html2canvas` fails or is unsupported, a "Copy plan details" button copies a plain-text summary to the clipboard.

---

## Error Handling & Edge Cases

- **Tie votes:** If two recommendations share the top score when the last vote lands, the one created first (earliest `createdAt`) wins. No UI complexity needed.
- **Creator leaves group:** If the group creator leaves, plan management (mark done, set date window, edit date) passes to the longest-standing remaining member.
- **Single-member group:** Auto-lock triggers immediately when the sole member votes. Availability grid auto-locks on their first submission.
- **Regeneration while voting:** If a user hits "Regenerate" while `planStatus === voting`, all existing votes are cleared and `planStatus` resets to `idle`. A confirmation prompt guards this action.

---

## Out of Scope

- Push notifications / email when a plan locks or a date is set
- Comments or discussion threads on recommendations
- Public plan URL (non-member access)
- Hour-level time slot granularity in the availability grid
- External calendar integration (Google Calendar, iCal export)
