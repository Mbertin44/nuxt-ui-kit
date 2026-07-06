<!-- Thin wrapper around UCalendar that adds a style hook for disabled/unavailable date cells. -->
<script setup lang="ts">
defineOptions({ inheritAttrs: false });
</script>

<template>
  <UCalendar
    v-bind="$attrs"
    :ui="{
      cellTrigger: 'data-disabled:opacity-30 data-unavailable:bg-accented/50',
    }"
  />
</template>
