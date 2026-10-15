# nuxt-ui-kit

A personal [Nuxt Layer](https://nuxt.com/docs/getting-started/layers): a reusable set of Vue components built on Nuxt UI v4 + Tailwind CSS v4, shared across projects instead of copy-pasted between them.

This is **not a standalone site**. It's a base layer that other Nuxt projects extend to inherit its components, without needing to rebuild them from scratch each time.

---

## Using this kit in a project

Install it as a dependency pinned to a release tag, so the exact version is recorded in the lockfile:

```bash
pnpm add -D "nuxt-ui-kit@github:Mbertin44/nuxt-ui-kit#v0.1.0"
```

Then extend it in the consuming project's `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: ["nuxt-ui-kit"],
});
```

Then just use the components in templates — no import statements needed, Nuxt auto-imports them the same way it does for local components:

```vue
<template>
  <MHeader brand-name="My Site" :navigation-items="navItems" cta-label="Contact" cta-to="/contact" />
</template>
```

Moving to a newer version of the kit is an explicit change: update the tag in `package.json`, then run `pnpm install`.

**Peer dependencies.** The kit declares `nuxt`, `@nuxt/ui`, `@iconify-json/lucide` and `@internationalized/date` as peer dependencies: it uses the consuming project's own copies, so every package is installed once. The `main` field of `package.json` points to `nuxt.config.ts`; without it, Nuxt cannot load an installed layer and builds the project without it, with only a "Cannot extend config" warning.

**No global CSS.** The kit ships no stylesheet and no `@theme` tokens. The consuming project owns its Tailwind entry point (`@import "tailwindcss"; @import "@nuxt/ui";`) and its design system; the components read it through Nuxt UI's semantic classes and CSS variables (`--ui-primary`, `--ui-bg`, `--ui-text`...). Two values come from the project when it sets them: `--font-heading` in its `@theme`, used by the `font-heading` labels of `MHeader` and `MFooter` (without it they inherit the page font), and `--ui-header-height`, the height of `MHeader` (Nuxt UI's default: 4rem). The project's Tailwind generates the kit's classes: Nuxt UI adds an `@source` for every layer.

**Why the `M` prefix**: every component here is named `M<Something>` (`MHeader`, `MRevealSection`, ...) instead of a plain name. This is deliberate: a consuming project's own `app/components/Header.vue` would otherwise silently override this layer's `Header.vue` (local components always win over layer components with the same name), so a project couldn't have its own custom `Header` *and* use this kit's `Header` side by side. The prefix avoids that collision entirely — a project can freely define its own `Header.vue` while also using `<MHeader>` from the kit, or use `<MHeader>` directly without ever touching a local `Header.vue`.

**Colors**: components use Nuxt UI's semantic color classes (`primary`, `secondary`, `neutral`) rather than hardcoded hex values. Define your own palette per-project via `app.config.ts`:

```ts
export default defineAppConfig({
  ui: { colors: { primary: "green", secondary: "amber", neutral: "zinc" } },
});
```

---

## Local development

This repo is a pnpm workspace with two packages:

- `/` — the layer itself (components and config). Not runnable as a site on its own (no pages).
- `/playground` — a minimal Nuxt app that `extends: ["../"]` to exercise the layer's components, with its own Tailwind entry point (`playground/app/assets/css/main.css`), as any consuming project has.

```bash
pnpm install        # installs both workspace packages
pnpm dev:prepare    # generates the Nuxt types for the layer and the playground
pnpm dev            # preview components at http://localhost:3000
pnpm lint           # ESLint (standalone @nuxt/eslint-config, no module in the layer)
pnpm typecheck      # typecheck the layer itself
```

---

## Components

### `MHeader`

Site header with a responsive mobile menu and an optional "transparent until scrolled" mode (for hero sections).

| Prop | Type | Default | Description |
|---|---|---|---|
| `brandName` | `string` | `""` | Accessible title, and fallback text if no `#logo` slot is given |
| `navigationItems` | `NavigationMenuItem[]` | `[]` | Nav items; `active` auto-derives from the current route when `to` is set |
| `transparentUntilScrolled` | `boolean` | `false` | Header starts transparent, turns opaque past a small scroll threshold |
| `ctaLabel` / `ctaTo` | `string` | `undefined` | Call-to-action button on the right; omit `ctaLabel` to hide it |

Slot: `#logo` (scope: `{ opaque: boolean }`) — replaces the default brand-name text with a custom logo lockup.

### `MFooter`

Logo/tagline, nav links, a contact card, and social links — all optional, sections hide themselves when their props are omitted.

| Prop | Type |
|---|---|
| `brandName`, `tagline` | `string` |
| `navigationItems` | `Array<{ label: string; to: string }>` |
| `contactPhone`, `contactEmail` | `{ display: string; href: string }` |
| `locationLabel` | `string` |
| `socialLinks` | `Array<{ icon: string; href: string; label: string }>` |

Slot: `#logo` — replaces the default brand-name text with a custom logo lockup.

### `MRevealSection`

Wraps its slot content and animates it into view (fade + slide) the first time it enters the viewport, via `IntersectionObserver`.

| Prop | Type | Default |
|---|---|---|
| `slideFrom` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'bottom'` |
| `delay` | `0` to `1500` (steps of 100) | `0` |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` |
| `orientation` | `'horizontal' \| 'vertical'` | `'vertical'` |

### `MIconCard`

Generic icon + label + description card, e.g. for a services/features grid.

| Prop | Type | Default |
|---|---|---|
| `icon` | `string` (Iconify name) | — |
| `label` | `string` | — |
| `description` | `string` | `undefined` |
| `iconSize` | `string` (Tailwind size class) | `'size-10'` |

### `MDateRangePicker` + `MCalendar`

A popover-based date range picker (built on Nuxt UI's `UCalendar`/`UPopover`), with a clear button once a range is selected. `MCalendar` is a thin styling wrapper that `MDateRangePicker` uses internally, but it's also exported standalone for single-date use cases.

| Prop | Type |
|---|---|
| `modelValue` | `DateRange \| undefined` (from `reka-ui`) |
| `placeholder` | `string` |

---

## Adding a new shared component

1. Add it to `app/components/` here, named `M<Something>.vue`, following the same rule as everything else in this kit: **no project-specific data**. Content (text, links, images) comes in through props/slots, not hardcoded values. Visual values come from the consuming project: Nuxt UI's semantic variables, or a component-scoped CSS variable with a fallback (`var(--m-marquee-gap, 1rem)`) — never a global `@theme` token or stylesheet.
2. Preview it in `playground/app/pages/index.vue`.
3. Document its props/slots in this README.
