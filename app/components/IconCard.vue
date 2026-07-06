<script setup lang="ts">
// Generic icon + label + description card, e.g. for a services/features grid.
withDefaults(
  defineProps<{
    icon: string;
    label: string;
    description?: string;
    iconSize?: string;
  }>(),
  {
    iconSize: "size-10",
  },
);
</script>

<template>
  <div
    class="group flex flex-col items-center justify-center gap-3 p-6 rounded-xl text-center border transition-all duration-300 cursor-default active:border-secondary active:bg-secondary-50 active:shadow-lg active:scale-105 active:z-10 hover:border-secondary hover:shadow-lg hover:scale-105 hover:z-10"
  >
    <UIcon :name="icon" class="text-primary shrink-0" :class="iconSize" />
    <span class="text-sm font-medium leading-snug">{{ label }}</span>
    <p v-if="description" class="text-xs text-muted pt-1 leading-snug w-full">
      {{ description }}
    </p>
  </div>
</template>
