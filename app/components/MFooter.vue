<script setup lang="ts">
// Site footer: logo/tagline, nav links, a contact card, and social links.
// Content is fully prop/slot-driven so this component has no project-specific data.
withDefaults(
  defineProps<{
    /** Fallback text rendered where the `#logo` slot would go, and used in the copyright line. */
    brandName?: string;
    tagline?: string;
    navigationItems?: Array<{ label: string; to: string }>;
    contactPhone?: { display: string; href: string };
    contactEmail?: { display: string; href: string };
    locationLabel?: string;
    /** e.g. [{ icon: 'i-lucide-instagram', href: '...', label: 'Instagram' }] */
    socialLinks?: Array<{ icon: string; href: string; label: string }>;
  }>(),
  {
    brandName: "",
    tagline: undefined,
    navigationItems: () => [],
    contactPhone: undefined,
    contactEmail: undefined,
    locationLabel: undefined,
    socialLinks: () => [],
  },
);
</script>

<template>
  <footer class="bg-primary-800 text-white">
    <UContainer>
      <div class="py-16 md:py-24 flex flex-col items-center gap-12 md:gap-16">
        <!-- Logo + tagline -->
        <div class="flex flex-col items-center gap-5 text-center">
          <slot name="logo">
            <span class="text-2xl font-heading">{{ brandName }}</span>
          </slot>
          <p
            v-if="tagline"
            class="font-sans italic text-[15px] text-white/55 max-w-[38ch] leading-relaxed"
          >
            {{ tagline }}
          </p>
        </div>

        <!-- Navigation inline -->
        <nav
          v-if="navigationItems.length"
          class="flex flex-wrap flex-col sm:flex-row items-center justify-center gap-x-9 gap-y-3"
        >
          <NuxtLink
            v-for="item in navigationItems"
            :key="item.to"
            :to="item.to"
            class="font-heading text-[13px] tracking-[0.28em] uppercase text-white/55 hover:text-white transition-colors"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Contact card -->
        <div
          v-if="contactPhone || contactEmail || locationLabel"
          class="w-full flex flex-col items-center gap-5 text-center py-8 border-t border-b border-white/10"
        >
          <span
            class="font-heading text-[10px] tracking-[0.4em] uppercase text-white/55"
          >
            Get in Touch
          </span>
          <div class="flex flex-col gap-1.5">
            <a
              v-if="contactPhone"
              :href="contactPhone.href"
              class="font-heading text-[18px] tracking-[0.08em] text-white hover:text-white/65 transition-colors"
            >
              {{ contactPhone.display }}
            </a>
            <a
              v-if="contactEmail"
              :href="contactEmail.href"
              class="font-sans text-[16px] text-white/55 hover:text-white transition-colors"
            >
              {{ contactEmail.display }}
            </a>
            <span v-if="locationLabel" class="font-sans text-[16px] text-white/55">
              {{ locationLabel }}
            </span>
          </div>
          <div
            v-if="socialLinks.length"
            class="flex items-center gap-4 mt-1"
            aria-label="Social networks"
          >
            <a
              v-for="social in socialLinks"
              :key="social.href"
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="social.label"
              class="w-9 h-9 border border-white/55 rounded-full grid place-items-center text-white/55 hover:bg-white hover:text-primary-800 transition-colors"
            >
              <UIcon :name="social.icon" class="size-4" />
            </a>
          </div>
        </div>

        <!-- Copyright -->
        <div class="flex items-center gap-3 text-xs text-white/55 font-sans">
          <span>© {{ new Date().getFullYear() }} {{ brandName }}</span>
        </div>
      </div>
    </UContainer>
  </footer>
</template>
