<script setup lang="ts">
import type { DateRange } from "reka-ui";

const selectedRange = ref<DateRange | undefined>(undefined);

const navigationItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
];

const socialLinks = [
  { icon: "i-lucide-instagram", href: "#", label: "Instagram" },
  { icon: "i-lucide-facebook", href: "#", label: "Facebook" },
];
</script>

<template>
  <div>
    <Header
      brand-name="MY BRAND"
      :navigation-items="navigationItems"
      cta-label="Contact"
      cta-to="/contact"
    />

    <main class="pt-(--ui-header-height) max-w-3xl mx-auto p-8 space-y-16">
      <RevealSection slide-from="bottom">
        <h1 class="text-3xl">nuxt-ui-kit playground</h1>
        <p class="text-muted mt-2">
          This page exists only to preview the kit's shared components during
          local development. It is not part of what a consuming project
          inherits.
        </p>
      </RevealSection>

      <RevealSection slide-from="left" :delay="200">
        <div class="grid grid-cols-3 gap-4 w-full">
          <IconCard icon="i-lucide-plane" label="Transfers" description="Airport pickups" />
          <IconCard icon="i-lucide-utensils" label="Dining" description="In-villa chef" />
          <IconCard icon="i-lucide-waves" label="Diving" description="Guided dives" />
        </div>
      </RevealSection>

      <RevealSection slide-from="right" :delay="400">
        <DateRangePicker v-model="selectedRange" placeholder="Pick a date range" />
      </RevealSection>
    </main>

    <Footer
      brand-name="MY BRAND"
      tagline="A short tagline describing the brand."
      :navigation-items="navigationItems"
      :contact-phone="{ display: '+1 555 0100', href: 'tel:+15550100' }"
      :contact-email="{ display: 'hello@example.com', href: 'mailto:hello@example.com' }"
      location-label="Somewhere, Earth"
      :social-links="socialLinks"
    />
  </div>
</template>
