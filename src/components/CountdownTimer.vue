<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getCountdownParts } from '../lib/countdown'

const props = defineProps<{
  target: string
}>()

const now = ref(Date.now())
let intervalId: number | undefined

const remaining = computed(() => getCountdownParts(props.target, now.value))
const formattedHours = computed(() => String(remaining.value.hours).padStart(2, '0'))
const formattedMinutes = computed(() => String(remaining.value.minutes).padStart(2, '0'))
const formattedSeconds = computed(() => String(remaining.value.seconds).padStart(2, '0'))
const accessibleLabel = computed(
  () =>
    `${remaining.value.hours} hours, ${remaining.value.minutes} minutes, ` +
    `${remaining.value.seconds} seconds remaining`,
)

function stopTimer() {
  if (intervalId === undefined) {
    return
  }

  window.clearInterval(intervalId)
  intervalId = undefined
}

function tick() {
  now.value = Date.now()

  if (getCountdownParts(props.target, now.value).totalMilliseconds === 0) {
    stopTimer()
  }
}

function startTimer() {
  stopTimer()
  tick()

  if (remaining.value.totalMilliseconds > 0) {
    intervalId = window.setInterval(tick, 1000)
  }
}

watch(() => props.target, startTimer)
onMounted(startTimer)
onBeforeUnmount(stopTimer)
</script>

<template>
  <time
    class="flex items-center justify-center gap-[clamp(8px,1.39vw,20px)] text-white not-italic max-[420px]:w-full"
    :datetime="target"
    :aria-label="accessibleLabel"
    aria-live="off"
    role="timer"
  >
    <span
      class="bg-surface font-numeric inline-grid h-[clamp(92px,12.78vw,184px)] min-w-[clamp(84px,12.71vw,183px)] place-items-center rounded-[clamp(12px,1.11vw,16px)] border border-white px-[clamp(14px,1.94vw,28px)] text-[clamp(40px,6.11vw,88px)] leading-none font-semibold whitespace-nowrap [font-variation-settings:'opsz'_14] max-[420px]:w-[24%] max-[420px]:min-w-0 max-[420px]:px-2 max-[420px]:text-[clamp(32px,10vw,40px)]"
      data-testid="countdown-hours"
    >
      {{ formattedHours }}
    </span>
    <span
      class="text-[clamp(40px,6.11vw,88px)] leading-none [font-variation-settings:'opsz'_14,'wdth'_100] max-[420px]:text-[clamp(32px,10vw,40px)]"
      aria-hidden="true"
    >
      :
    </span>
    <span
      class="bg-surface font-numeric inline-grid h-[clamp(92px,12.78vw,184px)] min-w-[clamp(84px,12.71vw,183px)] place-items-center rounded-[clamp(12px,1.11vw,16px)] border border-white px-[clamp(14px,1.94vw,28px)] text-[clamp(40px,6.11vw,88px)] leading-none font-semibold whitespace-nowrap [font-variation-settings:'opsz'_14] max-[420px]:w-[24%] max-[420px]:min-w-0 max-[420px]:px-2 max-[420px]:text-[clamp(32px,10vw,40px)]"
      data-testid="countdown-minutes"
    >
      {{ formattedMinutes }}
    </span>
    <span
      class="text-[clamp(40px,6.11vw,88px)] leading-none [font-variation-settings:'opsz'_14,'wdth'_100] max-[420px]:text-[clamp(32px,10vw,40px)]"
      aria-hidden="true"
    >
      :
    </span>
    <span
      class="bg-surface font-numeric inline-grid h-[clamp(92px,12.78vw,184px)] min-w-[clamp(84px,12.71vw,183px)] place-items-center rounded-[clamp(12px,1.11vw,16px)] border border-white px-[clamp(14px,1.94vw,28px)] text-[clamp(40px,6.11vw,88px)] leading-none font-semibold whitespace-nowrap [font-variation-settings:'opsz'_14] max-[420px]:w-[24%] max-[420px]:min-w-0 max-[420px]:px-2 max-[420px]:text-[clamp(32px,10vw,40px)]"
      data-testid="countdown-seconds"
    >
      {{ formattedSeconds }}
    </span>
  </time>
</template>
