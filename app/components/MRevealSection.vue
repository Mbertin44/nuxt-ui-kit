<script setup lang="ts">
// Wraps its slot content and animates it into view (fade + slide) once it enters the viewport.
const props = withDefaults(
  defineProps<{
    slideFrom?: "left" | "right" | "top" | "bottom";
    /** Animation delay in milliseconds, mapped to a matching Tailwind `delay-*` class. */
    delay?:
      | 0
      | 100
      | 200
      | 300
      | 400
      | 500
      | 600
      | 700
      | 800
      | 900
      | 1000
      | 1100
      | 1200
      | 1300
      | 1400
      | 1500;
    align?: "start" | "center" | "end";
    orientation?: "horizontal" | "vertical";
  }>(),
  {
    delay: 0,
    align: "center",
    orientation: "vertical",
  },
);

const horizontalAlignmentClassMap = {
  start: "flex flex-row justify-start",
  center: "flex flex-row justify-center",
  end: "flex flex-row justify-end",
} as const;

const verticalAlignmentClassMap = {
  start: "flex flex-col items-start",
  center: "flex flex-col items-center",
  end: "flex flex-col items-end",
} as const;

/** Resolves the flex alignment classes based on the current orientation. */
const alignmentClass = computed(() =>
  props.orientation === "vertical"
    ? verticalAlignmentClassMap[props.align]
    : horizontalAlignmentClassMap[props.align],
);

const sectionElement = ref<HTMLElement | null>(null);
const isSectionVisible = ref(false);

/** Fraction of the element that must be intersecting the viewport before the reveal animation triggers. */
const minimumVisibleFraction = 0.1;

const tailwindDelayClassMap = {
  0: "delay-0",
  100: "delay-100",
  200: "delay-200",
  300: "delay-300",
  400: "delay-400",
  500: "delay-500",
  600: "delay-600",
  700: "delay-700",
  800: "delay-800",
  900: "delay-900",
  1000: "delay-1000",
  1100: "delay-1100",
  1200: "delay-1200",
  1300: "delay-1300",
  1400: "delay-1400",
  1500: "delay-1500",
} as const;

const transitionDelayClass = computed(() => tailwindDelayClassMap[props.delay]);

/** Classes applied before the section becomes visible: transparent and offset in the `slideFrom` direction. */
const hiddenPositionClass = computed(() => {
  if (props.slideFrom === "left") return "opacity-0 -translate-x-20";
  if (props.slideFrom === "right") return "opacity-0 translate-x-20";
  if (props.slideFrom === "top") return "opacity-0 -translate-y-20";
  if (props.slideFrom === "bottom") return "opacity-0 translate-y-20";
  return "opacity-0 translate-y-20";
});

/** Classes applied once the section has been revealed: fully opaque and at its natural position. */
const visiblePositionClass = computed(() => {
  if (props.slideFrom === "left" || props.slideFrom === "right")
    return "opacity-100 translate-x-0";
  return "opacity-100 translate-y-0";
});

// Observes the section and triggers the reveal animation once, the first time it enters the viewport.
onMounted(() => {
  const visibilityObserver = new IntersectionObserver(
    ([intersectionEntry]) => {
      if (intersectionEntry?.isIntersecting) {
        isSectionVisible.value = true;
        visibilityObserver.disconnect();
      }
    },
    { threshold: minimumVisibleFraction },
  );

  if (sectionElement.value) visibilityObserver.observe(sectionElement.value);
});
</script>

<template>
  <div
    ref="sectionElement"
    :class="[
      'transition-[opacity,translate] duration-700 ease-out',
      transitionDelayClass,
      alignmentClass,
      isSectionVisible ? visiblePositionClass : hiddenPositionClass,
    ]"
  >
    <slot />
  </div>
</template>
