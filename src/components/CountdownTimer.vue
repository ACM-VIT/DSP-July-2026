<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getCountdownParts } from '../lib/countdown'

const props = defineProps<{
  target: string
  sessionUrl: string
}>()

const now = ref(Date.now())
let intervalId: number | undefined

const remaining = computed(() => getCountdownParts(props.target, now.value))
const isExpired = computed(() => remaining.value.totalMilliseconds === 0)
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
  <a
    v-if="isExpired"
    class="join-session bg-surface text-accent inline-flex h-[clamp(92px,12.78vw,184px)] min-w-[min(100%,420px)] items-center justify-center gap-3 rounded-[clamp(12px,1.11vw,16px)] border border-white px-[clamp(28px,4vw,56px)] text-[clamp(22px,2.5vw,36px)] leading-none font-semibold tracking-wide no-underline transition-[border-color,background-color,transform] duration-300 hover:border-accent hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:scale-[0.98] max-[420px]:h-[clamp(72px,22vw,92px)] max-[420px]:w-full max-[420px]:min-w-0 max-[420px]:text-[clamp(18px,5.5vw,22px)]"
    :href="sessionUrl"
    target="_blank"
    rel="noopener noreferrer"
    data-testid="join-session"
    aria-label="Join the session (opens in a new tab)"
  >
    <span>Join the session</span>
    <span
      class="join-session__arrow inline-block text-[1.05em] leading-none"
      aria-hidden="true"
    >
      →
    </span>
  </a>
  <time
    v-else
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

<style scoped>
.join-session {
  animation: join-session-in 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.join-session__arrow {
  animation: join-session-nudge 1.8s ease-in-out infinite;
}

@keyframes join-session-in {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.97);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes join-session-nudge {
  0%,
  100% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(4px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .join-session,
  .join-session__arrow {
    animation: none;
  }
}
</style>
