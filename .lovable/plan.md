## New Feature: OPERATIVE TIMELINE — Career & Milestones Dossier

A new section between **Projects** and **Reviews** that tells your story as a redacted FBI/cyberpunk case file: a vertical mission log showing your career milestones, achievements, and "operations" over time. Heavy on animations, fully in-theme.

### What the user will see

A new `// MISSION_LOG` section with:

```text
        ┌──────────────────────────────┐
        │   OPERATIVE TIMELINE         │
        │   CASE FILE: PHANTOM_DEV     │
        └──────────────────────────────┘

  ●━━━━┓
       ┃   [2020] FIRST CONTACT
       ┃   Discovered Lua. Compiled first script.
       ┃   STATUS: ████████ RESOLVED
  ●━━━━┫
       ┃   [2022] OPERATION: BLOX FRUITS
       ┃   Joined dev team. UI systems shipped.
       ┃   STATUS: ████████ ACTIVE
  ●━━━━┫
       ┃   [2024] CYBERSEC CLEARANCE
       ┃   Head of CyberSecurity promotion.
       ┃   STATUS: ████████ OMEGA-7
  ●━━━━┛
```

A vertical timeline with glowing nodes, animated connecting line that "draws itself" as you scroll, and entries that slide in alternating left/right like classified case files being declassified.

### Visual & animation details

- **Header**: `// MISSION_LOG` mono label, glitching `OPERATIVE TIMELINE` heading (using existing `GlitchText`), neon-green divider line.
- **Vertical spine**: A glowing cyan vertical line down the center that animates its `scaleY` from 0 → 1 as the section scrolls into view (`useScroll` + `useTransform`), with a traveling pulse of light running down it on loop.
- **Timeline nodes**: Each milestone has a pulsing neon node (concentric rings, rotating dashed outer ring) that "unlocks" with a scale-in + flash when its card appears.
- **Case-file cards**: Alternating left/right of the spine on desktop, stacked on mobile. Each card uses the existing `HolographicCard` / `hud-panel` style with:
  - Year stamp top-left (`[2020]`)
  - Operation codename (e.g. `OPERATION: BLOX FRUITS`)
  - Short redacted-style description with occasional `████` redaction blocks
  - Status bar: animated progress fill + status label (`RESOLVED`, `ACTIVE`, `CLASSIFIED`)
  - Mini typewriter effect on the description first time it enters view
  - Corner HUD brackets matching site style
- **Decoding effect**: When a card enters view, its codename briefly scrambles through random chars before settling (lightweight, no library needed).
- **Ambient**: Faint scrolling matrix characters in the background of the section, scanline overlay consistent with the rest of the site.
- **Sound**: Reuses the existing audio engine — `playDataSound` when a node unlocks, `playTypingSound` while the description types out, `playScanSound` once when the section first enters view.

### Content (5 milestones, fully editable later)

1. `[2020] FIRST CONTACT` — Discovered Lua, first script compiled.
2. `[2021] OPERATION: SOLO BUILDS` — First published Roblox games.
3. `[2022] OPERATION: BLOX FRUITS` — Joined the Blox Fruits dev team.
4. `[2024] CYBERSEC CLEARANCE` — Promoted to Head Of CyberSecurity.
5. `[2026] PROJECT: PHANTOM` — Current classified ops (this very site).

(Real dates/wording are yours to edit — these are placeholders following your existing dossier story.)

### Technical plan

- **New file**: `src/components/TimelineSection.tsx`
  - Local `milestones` array (id, year, codename, description, status, statusColor).
  - Subcomponents: `TimelineNode`, `MilestoneCard`, `ScrambleText`, `RedactedText`.
  - Uses `framer-motion` (`useScroll`, `useTransform`, `useInView`, `motion`) — already a dependency.
  - Reuses `HolographicCard`, `GlitchText`, and the existing sound utilities from `@/lib/sounds` (`playDataSound`, `playTypingSound`, `playScanSound`).
- **Edit**: `src/pages/Index.tsx` — import and render `<TimelineSection />` between `<ProjectsSection />` and `<ReviewsSection />`.
- **Edit**: `src/components/Navigation.tsx` — add a `TIMELINE` nav link pointing to `#timeline` (keeps the HUD nav consistent).
- **Styling**: Pure Tailwind + existing CSS tokens (`neon-cyan`, `neon-magenta`, `neon-green`, `hud-panel`, `neon-border`, `bg-cyber-grid`). No new colors, no new fonts.
- **Performance**: Animations gated on `useInView` (once: true) so off-screen cards don't run. Scramble interval clears on completion. No new dependencies.

### Out of scope (not doing now)

- No editing UI / CMS — milestones live in code, you tell me what to change.
- No backend / database.
- No new routes — section lives on the main page.
- Doesn't touch the existing Classified page, intro, or hero.
