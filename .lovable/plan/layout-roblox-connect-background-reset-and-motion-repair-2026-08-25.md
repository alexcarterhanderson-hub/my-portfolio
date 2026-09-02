# Layout, Roblox Connect, Background Reset, and Motion Repair

## Priority 1: Repair every broken position

- Recompose the hero so its heading, copy, buttons, stats, avatar, and scroll cue occupy a balanced first viewport instead of being vertically displaced by the full-screen centering.
- Normalize section containers, heading spacing, card grids, and responsive gaps across Projects, Timeline, Roblox, Reviews, About, navigation, footer, and the admin drawer.
- Remove transform conflicts where reusable card hover transforms overwrite intentional card rotation or Framer Motion transforms.
- Fix the confirmed About-section horizontal overflow and audit all other sections for clipping, off-screen cards, overlapping labels, and mobile wrapping.
- Make long editable titles, tags, group names, status labels, and buttons wrap safely without shifting surrounding UI.

## Priority 2: Fix Roblox OAuth end to end

- Replace the current `window.location.origin` callback, which changes between preview and published domains, with one canonical published callback URL used identically for authorization and token exchange.
- Add a dedicated public callback route/handler that completes sign-in and returns the owner to the Roblox section cleanly.
- Validate the returned OAuth `state` before exchanging the code, preserve useful error details, and prevent unrelated query parameters from triggering the flow.
- Show the exact callback URL inside the owner-only connect UI so it can be copied into the Roblox OAuth application settings; explain there that Roblox requires an exact character-for-character redirect match.
- Keep public followers, friends, avatar, and groups loading independently even when OAuth is disconnected.

## Priority 3: Add “Revert to system original”

- Define an immutable system-original background matching the presented pastel confetti, paper texture, and soft color-cloud design.
- Add a clearly labeled reset button in the Background admin tab with a short explanation and confirmation.
- Reset every background field together—preset, colors, visibility, speed, animation, clouds, grain, image, blur, and fade—then persist and preview the result immediately.
- Keep custom uploaded backgrounds untouched in storage; resetting only changes which background settings are active.

## Priority 4: Polish motion without bringing lag back

- Add coordinated section reveals, subtle doodle drift, heading draw-ons, card stagger, button press feedback, and gentle background parallax.
- Use transform/opacity-only animation, limit perpetual motion, and preserve reduced-motion behavior.
- Remove animation from layout-critical wrappers where it causes jumps; animate inner decorative layers instead.
- Keep project video playback free of glitch effects.

## Admin smoothness

- Route project edits through the existing optimistic update helpers instead of forcing full data refreshes after each save.
- Give editable Roblox groups local/debounced fields so typing does not trigger a database write and full settings update on every keystroke.
- Keep controls stable while saves happen and surface concise success/error feedback.

## Verification

- Check the complete page at desktop and mobile widths, including first viewport, every section boundary, admin drawer, long-content cases, light mode, and dark mode.
- Assert no horizontal overflow or clipped headings and visually compare the repaired hero/Roblox composition against the supplied screenshots.
- Exercise Roblox authorize URL generation and callback handling with the canonical redirect, then confirm live public stats still load.
- Test background reset, custom background selection, admin typing, project video opening, and reduced-motion mode.

## Technical details

- Current code sends `${window.location.origin}/` from both OAuth steps, so clicking Connect in the changing preview domain produces a redirect URI that cannot match a single registered Roblox callback.
- The hero currently uses `min-h-screen` plus vertical centering, while its content and scroll cue exceed the intended first-screen composition.
- The confirmed overflow is caused by content reaching 6px beyond the viewport in the About skills column; shared hover transforms and fixed rotations also compete on several cards.
- No project rows, uploaded covers, videos, timeline entries, reviews, or existing site copy will be removed.