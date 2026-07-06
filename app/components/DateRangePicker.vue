<script setup lang="ts">
import { today, getLocalTimeZone } from '@internationalized/date'
import type { CalendarDate } from '@internationalized/date'
import type { DateRange } from 'reka-ui'

const props = defineProps<{
  modelValue: DateRange | undefined
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: DateRange | undefined]
}>()

const isPopoverOpen = ref(false)
const todayDate = today(getLocalTimeZone())

/** Formats a calendar date as a short label, e.g. "Jan 5". */
function formatCalendarDate(date: CalendarDate): string {
  return new Date(date.year, date.month - 1, date.day).toLocaleDateString('en', {
    month: 'short',
    day: 'numeric',
  })
}

/** Human-readable label for the current selection, or the placeholder when no full range is set. */
const selectedRangeLabel = computed(() => {
  if (!props.modelValue?.start || !props.modelValue?.end) {
    return props.placeholder ?? 'Select dates'
  }
  const start = formatCalendarDate(props.modelValue.start as CalendarDate)
  const end = formatCalendarDate(props.modelValue.end as CalendarDate)
  return `${start} – ${end}`
})

/** Propagates the calendar selection and closes the popover once a full range is picked. */
function handleCalendarUpdate(range: DateRange | undefined) {
  emit('update:modelValue', range)
  if (range?.start && range?.end) {
    isPopoverOpen.value = false
  }
}

/** Clears the selected range without triggering the popover toggle. */
function clearDates(event: MouseEvent) {
  event.stopPropagation()
  emit('update:modelValue', undefined)
}
</script>

<template>
  <div class="flex items-center gap-1">
    <UPopover v-model:open="isPopoverOpen" :ui="{ content: 'w-auto p-0' }">
      <UButton
        variant="outline"
        color="neutral"
        size="sm"
        leading-icon="i-lucide-calendar"
        :label="selectedRangeLabel"
        :class="modelValue ? 'pr-2' : ''"
      />

      <template #content>
        <ClientOnly>
          <div class="p-3">
            <Calendar
              :model-value="modelValue"
              range
              :number-of-months="1"
              :min-value="todayDate"
              @update:model-value="handleCalendarUpdate"
            />
          </div>
        </ClientOnly>
      </template>
    </UPopover>

    <UButton
      v-if="modelValue"
      icon="i-lucide-x"
      variant="ghost"
      color="neutral"
      size="sm"
      @click="clearDates"
    />
  </div>
</template>
