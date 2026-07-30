# DSP 2026

First-pass implementation of the DSP 2026 scrolling website from the approved Figma “Final”
frames: landing, about the event, about the speaker, and event details. The three-dimensional mesh
is intentionally omitted and replaced with a black background.

Built with Vue 3, TypeScript, Vite, Bun, and Tailwind CSS v4. Design tokens live in
`src/style.css`; responsive page styling is expressed with Tailwind utilities in the Vue
components.

The landing screen includes a raw WebGL2 animated wireframe sphere. Its UV-grid geometry,
renderer, and controls live in `src/graphics/organic-sphere`, while the GLSL sources live in
`src/shaders`. The effect uses a single draw call, reduced mobile geometry, a capped device pixel
ratio, visibility pausing, reduced-motion support, and context-loss recovery.

To tune the sphere with the development-only slider panel, run:

```sh
bun run dev:shader
```

The regular `bun run dev` command does not load or display the panel. The shader mode starts from
the original sphere settings, includes an opt-in high-noise preset, updates every uniform live, and
can copy the current settings as JSON. It also provides six wireframe treatments—Ice Grid, Aurora
Flow, Signal Scan, Polar Threads, Chaos Lattice, and Ghost X-Ray—with style-specific topology,
colour, and animation.

## Setup

```sh
bun install
cp .env.example .env.local
bun run dev
```

Event details come from the build environment:

- `VITE_EVENT_START_AT` and `VITE_EVENT_END_AT`: ISO 8601 timestamps with explicit UTC offsets
- `VITE_EVENT_TIME_ZONE`: IANA time zone used for the visible date and time
- `VITE_EVENT_PLATFORM`: platform shown in the Event Details section
- `VITE_EVENT_SESSION_URL`: meet/session link shown when the countdown ends
- `VITE_SITE_URL`: public origin used for canonical and social-preview URLs

The values in `.env.example` are safe build fallbacks. Set the production values in Cloudflare
before deploying; Vite embeds them at build time.

## Deployment

The shader-development build is deployed as Cloudflare Workers static assets. Build and deploy it
with:

```sh
bun run deploy:shader
```

The same build can also be uploaded to the `dsp` Cloudflare Pages project as a fallback:

```sh
bun run deploy:shader:pages
```

## Quality checks

```sh
bun run typecheck
bun run lint
bun run format:check
bun run test:run
bun run build
```
