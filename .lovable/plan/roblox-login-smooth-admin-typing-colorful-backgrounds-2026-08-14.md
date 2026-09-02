# Roblox login, smooth admin typing, colorful backgrounds

## 1. Roblox connect actually works

The error "Application not found: 5811359021" is because the saved Client ID is your Roblox **user ID**, not an OAuth app ID. Roblox OAuth needs a real app.

What you do (2 minutes):

1. Go to [create.roblox.com](http://create.roblox.com) -> Settings -> Credentials -> OAuth 2.0 Apps -> Create app.

2. Redirect URL: `https://edwardthedev.lovable.app/`

3. Scopes: `openid`, `profile`.

4. Copy the Client ID and Client Secret.

What I do:

- Ask for both values through the secure secret form and replace the current wrong ones.

- Harden the connect flow: the redirect URL sent to Roblox will always match the published site, the returned `state` is verified, and failures show a clear message ("app not found", "redirect mismatch") instead of a raw Roblox error page.

- After sign-in, followers / following / friends / groups load live and refresh on a timer. Public stats keep working even when signed out.

## 2. Admin typing fixed (the big annoyance)

Right now every keystroke writes to the database and then re-reads the whole list, so the field re-renders with stale text and the cursor jumps to the end.

Fix: each admin field keeps its own local text state, updates instantly as you type, and saves in the background about half a second after you stop typing. Cursor stays put, no lag, and a small "Saved" tick appears when the write lands. Applies to project, timeline, review, hero, about, nav, footer and section fields.

## 3. Backgrounds

- **Site background:** a layered animated backdrop — soft colorful gradient wash, slow-drifting blobs, a faint doodle-grid paper texture, and a fine grain overlay. Works in both light and dark, and is calmed down for reduced-motion / Lite performance mode, backgroudn should me like shown in the screenshot

- **Admin panel background:** a new "Background" tab with a gallery of presets (paper, doodle grid, dots, confetti, aurora, gradient mesh, stripes, plain) plus custom controls: pick two accent colors, choose pattern opacity, animation speed, and upload or paste any image/GIF URL to use as the page background with blur and dim sliders. Live preview, applies instantly to the site. All the background must be animated too

## 4. Projects heading and cards

- The clipped "Projects" title is caused by a gradient-clipped text style that cuts descenders. Replace it with the same chunky outlined sketch heading used by the other sections, with an outer ink stroke, offset shadow and room for descenders. animate the whole website and in the top where it says Edward Dev make it like when i curser is on it the drawing outline animation  appeares, also make everything a little bit colorful

- Cards redesigned: bigger cover image with rounded ink-outlined frame, hover lift with a slight peel/rotate, colored top ribbon per project status, chunkier tag stickers, cleaner like/view/share row, skeleton while covers load.

- Section gets more color: accent-tinted card backs per project color instead of everything cream.

## 5. More color across the site

Warmer, richer palette applied through the existing theme tokens: gold, coral, sky, mint and lilac accents used across section headers, buttons, tags, timeline nodes and the stat counters, with per-section tinted panels so each block reads distinctly. Contrast checked in both themes.

## Technical notes

- `src/components/AdminConsole.tsx`: introduce a `useDebouncedField` hook (local state + 500ms flush + `onBlur` immediate save) and route all text inputs through it; stop calling `refreshAll()` on every keystroke.

- `src/hooks/useSite.tsx`: optimistic cache write for project/timeline/review patches so the UI doesn't wait on a refetch; add `settings.background` (preset, colors, opacity, speed, imageUrl, blur, dim) to `SiteSettings` defaults in `src/lib/siteContent.ts`.

- New `src/components/SiteBackground.tsx` rendering the layered background from settings; mounted in `src/pages/Index.tsx` replacing the current inline wash.

- `src/index.css`: background pattern utilities, richer accent tokens, stronger `.sketch-title` with `padding-bottom` + `leading` fix.

- `src/components/ProjectsSection.tsx` heading swap; `src/components/ProjectCard.tsx` restyle.

- `supabase/functions/roblox`: clearer error mapping; redeploy after the new Client ID/Secret are stored. No schema changes beyond the settings JSON.