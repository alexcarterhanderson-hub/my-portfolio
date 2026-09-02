# Hand-Drawn Makeover + Working Admin Sync

Rebuild the site's look in the sketchbook/sticker style of the reference (cream paper, doodle pattern, chunky outlined headings, gold sticker buttons), add a dark/light toggle, make the admin panel actually drive the live site, fix Roblox sign-in, and make groups + card cover images editable. Ad shown in a screenshot there is no need for two buttons called Pricing and Questions and no need for like a logo button on left top corner make it hella beatufiul.

## Visual direction

- **Paper base**: warm cream (#F7F3EA) with a faint repeating doodle-icon watermark grid, subtle paper grain, and a thin outlined frame around the page.
- **Type**: chunky rounded outlined display headings with an offset drop shadow (skribbl-style wordmark treatment) + a friendly rounded body font.
- **Accents**: gold (#E0A93B) sticker buttons with black outline and hard shadow, Custom Fonts for make it look like more cartoony, plus small hand-drawn doodle marks (stars, arrows, squiggles) near headings.
- **Cards**: outlined "sticker" cards with slight random rotation, hard shadow, and a peel/lift on hover.
- **Animation**: hand-drawn SVG stroke draw-on for underlines and the hero mark, wobble/jitter loops on doodles, sticker press on buttons, staggered pop-in on scroll, marquee ticker, animated counters for Roblox stats. All respect reduced-motion.  
 Make it look like in the screenshot exactly or better

## Dark / light mode

- Toggle button in the nav (sun/moon sticker) with a smooth cross-fade.
- Dark mode = "night sketchbook": deep ink background, cream strokes, same gold accent. Both themes defined as tokens so every section flips cleanly.
- Choice is remembered between visits and defaults to the system setting.

## Admin panel actually syncing

- Every admin field writes to the database and the site re-reads it immediately — no page refresh, no stale values.
- Fixes the currently disconnected controls: hero/about text, stats, nav labels, footer links, theme, glow, background, ticker.
- Theme picker now also sets light/dark variants.
- Clear save/saved feedback and an error toast when a write fails.
- Panel keeps its plain-language descriptions and gets the new controls below.

## Roblox

- **Sign-in fix**: the current error ("Application not found: 5811359021") happens because the saved Client ID is your Roblox *user* ID, not an OAuth app ID. You'll create an OAuth app (create.roblox.com → Credentials → OAuth 2.0), set the redirect URL to the published site URL, and I'll request the real Client ID + Secret securely and re-deploy. Public stats (followers/friends) keep working regardless.
- **Sign-in button visibility**: the "Sign in with Roblox / connect your profile" control only renders when admin mode is unlocked. Visitors just see the profile card and live stats.
- **Groups**: still pulled live, with admin overrides — hide a group, reorder, rename the display name/role, or add a manual entry. Overrides are stored per group id and merged over the live fetch.

## Cards

- Front cover image editable from the card itself in admin mode: hover a card → "change cover" sticker → upload a file or paste a URL, with instant preview and a focal-point/zoom control so the crop looks right.
- Cover images get skeleton loading and lazy loading; cards restyled as sticker cards with the new hover.

## Technical notes

- `src/index.css` + `tailwind.config.ts`: new dual-theme token set (paper/ink), doodle background pattern, sticker button/card utilities, stroke-draw keyframes.
- New `ThemeToggle` component + `theme` handling in `useSite` (localStorage + `class="dark"` on `<html>`).
- `useSite` gains an optimistic write path and invalidation so admin edits reflect instantly; `site_settings` gains `robloxGroupOverrides` and `mode` keys.
- `RobloxSection`: admin-gated sign-in, groups merged with overrides.
- `ProjectCard`: inline cover editor using the existing `uploadMedia` helper and the `media` bucket.
- `supabase/functions/roblox`: unchanged logic; redeployed once real OAuth credentials are stored.
- Existing projects, videos, timeline and reviews data is untouched.

## Build order

1. Design tokens, doodle background, sticker primitives, dark/light toggle.
2. Restyle nav, hero, projects, roblox, timeline, reviews, about, footer with animations.
3. Admin sync pass + new settings keys.
4. Roblox admin-gating, group overrides, credential swap.
5. Card cover editor + polish pass.