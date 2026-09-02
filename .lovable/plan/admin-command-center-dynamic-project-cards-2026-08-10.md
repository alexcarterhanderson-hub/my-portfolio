# Admin Command Center + Dynamic Project Cards

Turn the hardcoded projects grid into a live, editable card system with a hidden admin console (click SYSTEM ONLINE 5x), remove the Personal/Classified area, kill the video glitch effect, and cut the lag.

## Core changes

- **Cards are data, not code.** Projects move to Lovable Cloud so you can add, edit, reorder and delete them from the site itself. Each card: title, description, cover image (upload your own), video (YouTube ID or uploaded file), tech tags, accent color, status badge, featured flag, order.
- **Show more.** Grid shows 4 cards by default with a neon "SHOW MORE" expander that reveals the rest (and collapses back).
- **No glitch on video open.** Video opens with a clean scale instead.
- **Personal removed.** The Personal nav button (desktop + mobile), ClassifiedAnimation, the /classified page and its route all get deleted.
- **Admin unlock.** 5 clicks on SYSTEM ONLINE opens the admin console. No password, as requested — anyone who discovers the easter egg can edit. Since edits save to the shared database, this means the public can technically change content. Say the word and I'll add a passcode gate.

## Performance

Cause of lag: the always-on 3D scene, unthrottled scroll listeners, big unoptimized images, and many simultaneous framer-motion loops.

Fix: **Performance Mode toggle** (Ultra / Balanced / Lite) that auto-selects Lite on weak devices and remembers your choice, and if they want they can choose

## 44 admin features

Content (1-12): add card, edit card, delete card, duplicate card, drag-to-reorder, bulk select, bulk delete, cover image upload, image URL paste, AI-free cover cropper, YouTube video link, direct video file upload.

Card design (13-22): accent color picker, status badge (Live / Beta / WIP / Archived), tech-tag editor with autocomplete, featured pin, custom card layout (tall / wide / standard), hover-effect selector, per-card glow intensity, card visibility toggle (draft/public), custom card link/CTA, card subtitle.

Site content (23-32): edit hero headline & tagline, edit About text and stats, skill bar editor, timeline entry CRUD, reviews CRUD with avatars, footer links editor, nav label editor, site title/meta editor, "SYSTEM ONLINE" status text editor, announcement ticker.

Look & feel (33-38): live theme editor (neon palette), font-pair switcher, background effect picker (grid / particles / 3D / none), global glow intensity slider, sound-effects volume + mute, intro animation on/off, global animation play which means like when owner can add themes for example there are a 44 themes on a theme choosing page and the admin can choose a theme and the theme can be adjustable for example the admin can type a promt in the theme like this, Create it more cyber punk and then the theme changes it self and changes into it like that, all counts can be edited by the admin and the admin can add reviews too 

Power tools (39-44): global search across all content, undo/redo history stack, JSON export of all content, JSON import/restore, activity log of recent edits, admin dashboard with counts, view stats and a one-click "preview as visitor" mode.

## 22 visitor features

1. Show-more card expansion, 2. clean video lightbox with keyboard controls, 3. tech-tag filtering, 4. category/status filter chips, 5. live search across projects, 6. sort (newest / featured / A-Z), 7. grid/list view switch, 8. per-card detail view, 9. share-card link with copy toast, 10. like/reaction counter, 11. view counter per card, 12. lazy image loading with skeletons, 13. Performance Mode toggle, 14. sound on/off toggle, 15. reduced-motion respect, 16. keyboard navigation and shortcuts, 17. scroll progress HUD, 18. back-to-top rocket, 19. section quick-jump, 20. review submission form (queued for your approval), 21. copy contact/social handles, 22. full mobile-tuned responsive layout.

## Technical notes

- Lovable Cloud gets enabled: tables for `projects`, `timeline_entries`, `reviews`, `site_settings`, `activity_log`, plus a public storage bucket for card images/videos. Public read on everything; public write on the editable tables (consequence of no admin login) with RLS grants written explicitly.
- `ProjectsSection` splits into `ProjectsSection`, `ProjectCard`, `VideoLightbox`, `ProjectFilters`, `ShowMoreGrid`.
- New `AdminConsole` shell (slide-in HUD panel) with tabbed sub-panels, backed by a `useAdmin` context and React Query mutations with optimistic updates.
- Existing hardcoded projects and timeline entries are seeded into the database so nothing is lost.
- `PerformanceContext` gates 3D quality, particle counts and effect layers everywhere.
- Deleted: `src/pages/Classified.tsx`, `src/components/ClassifiedAnimation.tsx`, the `/classified` route and the Personal nav entries.

## Build order

1. Enable Cloud, create tables/bucket, seed existing content.
2. Remove Personal/Classified, remove video glitch.
3. Dynamic cards + show-more + filters.
4. Admin console (all 44 features across tabs).
5. Visitor features (22).
6. Performance pass + Performance Mode toggle.