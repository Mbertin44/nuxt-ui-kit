<script setup lang="ts">
// Site header with navigation, responsive mobile menu, and an optional transparent-over-hero mode.
// Content (brand, nav items, CTA) is fully prop/slot-driven so this component has no project-specific data.
import type { NavigationMenuItem } from "@nuxt/ui";

const linkUi = "font-heading text-md before:hidden";

const props = withDefaults(
  defineProps<{
    /** Text used for the header's accessible title, and as a fallback if no `#logo` slot is provided. */
    brandName?: string;
    /** Navigation items shown in the header and the mobile menu. `active` is auto-derived from the current route when `to` is set. */
    navigationItems?: NavigationMenuItem[];
    /** When true, the header starts transparent and turns opaque only after the page is scrolled. */
    transparentUntilScrolled?: boolean;
    /** Label for the call-to-action button on the right of the header. Omit to hide the button entirely. */
    ctaLabel?: string;
    /** Destination for the call-to-action button. */
    ctaTo?: string;
  }>(),
  {
    brandName: "",
    navigationItems: () => [],
    transparentUntilScrolled: false,
    ctaLabel: undefined,
    ctaTo: undefined,
  },
);

const route = useRoute();

const scrolled = ref(!props.transparentUntilScrolled);
const isHeaderVisible = ref(false);
const isMobileMenuOpen = ref(false);

/** Marks the header as scrolled once the page has moved past a small threshold. */
function handleScroll() {
  scrolled.value = window.scrollY > 10;
}

onMounted(() => {
  if (props.transparentUntilScrolled) {
    window.addEventListener("scroll", handleScroll);
  }

  nextTick(() => {
    isHeaderVisible.value = true;
  });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

watch(
  () => route.path,
  () => {
    isMobileMenuOpen.value = false;
  },
);

/** Navigation items with `active` derived from the current route for any item that sets `to`. */
const items = computed<NavigationMenuItem[]>(() =>
  props.navigationItems.map((item) => ({
    ...item,
    active:
      typeof item.to === "string" ? route.path.startsWith(item.to) : item.active,
  })),
);

/** The header is opaque once scrolled or whenever the mobile menu is open, regardless of scroll state. */
const isHeaderOpaque = computed(() => scrolled.value || isMobileMenuOpen.value);

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}
</script>

<template>
  <UHeader
    :toggle="false"
    :title="brandName"
    :ui="{
      root: [
        'transition-[opacity,translate,background-color,border-color,box-shadow] duration-700 ease-out backdrop-blur-none',
        isHeaderOpaque
          ? 'bg-white shadow-sm'
          : 'bg-transparent border-transparent',
        isHeaderVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-full',
      ],
    }"
  >
    <template #title>
      <slot name="logo" :opaque="isHeaderOpaque">
        {{ brandName }}
      </slot>
    </template>

    <UNavigationMenu
      :items="items"
      :highlight="false"
      :ui="{ link: linkUi, linkLabel: 'overflow-visible' }"
    >
      <template #item-label="{ item }">
        <span
          class="relative text-md inline-block py-1 transition-colors duration-200 after:content-[''] after:absolute after:inset-x-0 after:-bottom-1 after:h-[1.5px] after:rounded-full after:origin-center after:scale-x-0 after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100"
          :class="[
            // TEXT color based on header state + active
            scrolled
              ? item.active
                ? 'text-(--ui-text-highlighted)'
                : 'text-(--ui-text-muted) group-hover:text-primary'
              : 'text-white',
            // permanent underline if active
            item.active && 'after:scale-x-100!',
            // underline color: secondary if active (opaque), primary on hover, white if transparent
            scrolled
              ? item.active
                ? 'after:bg-secondary'
                : 'after:bg-primary'
              : 'after:bg-white',
          ]"
          >{{ item.label }}</span
        >
      </template>
    </UNavigationMenu>

    <template #right>
      <UButton
        class="lg:hidden"
        color="neutral"
        variant="ghost"
        :icon="isMobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
        :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
        :class="!isHeaderOpaque ? 'text-white!' : ''"
        @click="toggleMobileMenu"
      />
      <UButton
        v-if="ctaLabel"
        :to="ctaTo"
        :label="ctaLabel"
        variant="outline"
        size="xl"
        class="hidden lg:block rounded-3xl px-5"
        :class="!scrolled ? 'text-white ring-white hover:bg-white/10' : ''"
      />
    </template>
  </UHeader>

  <Teleport to="body">
    <Transition
      enter-active-class="transition-[opacity,transform] duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-[opacity,transform] duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-x-0 top-(--ui-header-height) z-40 bg-white shadow-md"
      >
        <div class="flex flex-col items-center gap-2 px-6 py-6">
          <UNavigationMenu
            :items="items"
            orientation="vertical"
            color="secondary"
            :ui="{ link: 'justify-center py-3' }"
          />
          <USeparator class="w-full" />
          <UButton
            v-if="ctaLabel"
            :to="ctaTo"
            :label="ctaLabel"
            variant="solid"
            class="mt-2"
            size="xl"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
