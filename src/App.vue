<script setup lang="ts">
import Lenis from 'lenis'
import { defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue'
import AboutEventSection from './components/AboutEventSection.vue'
import AboutSpeakerSection from './components/AboutSpeakerSection.vue'
import DotFieldBackground from './components/DotFieldBackground.vue'
import EventDetailsSection from './components/EventDetailsSection.vue'
import LandingHero from './components/LandingHero.vue'
import OrganicWireSphere from './components/OrganicWireSphere.vue'
import SectionIndicator from './components/SectionIndicator.vue'
import SiteFooter from './components/SiteFooter.vue'
import SiteHeader from './components/SiteHeader.vue'
import { eventConfig } from './config/event'
import {
  defaultOrganicSphereSettings,
  type OrganicSphereSettings,
} from './graphics/organic-sphere/types'

const organicSphereSettings = ref<OrganicSphereSettings>({
  ...defaultOrganicSphereSettings,
})

let lenis: Lenis | undefined
let isSnapping = false
let snapUnlockTimer: ReturnType<typeof window.setTimeout> | undefined

const snapTargetIds = [
  'home',
  'about-event',
  'about-speaker',
  'event-details',
  'site-footer',
] as const

// Resting against a section edge shouldn't fling the page onward on the first stray wheel
// tick — a deliberate push worth roughly one mouse notch has to build up first, and it
// decays as soon as the gesture pauses.
const snapIntentThreshold = 90
const snapIntentIdleMs = 220

let snapIntentDirection = 0
let snapIntentAmount = 0
let snapIntentAt = 0

function resetSectionSnapIntent() {
  snapIntentDirection = 0
  snapIntentAmount = 0
  snapIntentAt = 0
}

function wheelDeltaPixels(event: WheelEvent) {
  if (event.deltaMode === 1) return event.deltaY * 16
  if (event.deltaMode === 2) return event.deltaY * window.innerHeight
  return event.deltaY
}

function unlockSectionSnap() {
  isSnapping = false
  resetSectionSnapIntent()
  if (snapUnlockTimer !== undefined) {
    window.clearTimeout(snapUnlockTimer)
    snapUnlockTimer = undefined
  }
}

function handleSectionWheel(event: WheelEvent) {
  if (
    event.ctrlKey ||
    Math.abs(event.deltaY) < 2 ||
    Math.abs(event.deltaX) > Math.abs(event.deltaY)
  ) {
    return
  }

  if (isSnapping) {
    event.preventDefault()
    event.stopPropagation()
    return
  }

  const sections = snapTargetIds
    .map((id) => document.getElementById(id))
    .filter((section): section is HTMLElement => section !== null)

  if (sections.length !== snapTargetIds.length) return

  const viewportHeight = window.innerHeight
  const scrollTop = window.scrollY
  const edgeTolerance = 2

  // The footer is shorter than the viewport, so its own offset is past the end of the
  // scroll range — clamping keeps both the snap target and the "which one am I on"
  // comparison below in sync with where the page can actually stop.
  const maxScrollTop = Math.max(0, document.documentElement.scrollHeight - viewportHeight)
  const sectionTops = sections.map((section, index) =>
    index === 0 ? 0 : section.getBoundingClientRect().top + scrollTop,
  )
  const sectionHeights = sections.map((section) => section.getBoundingClientRect().height)
  const snapTops = sectionTops.map((top) => Math.min(top, maxScrollTop))
  // A section can be taller than the viewport (long copy on narrow screens), so "which one
  // am I on" is the last section whose start is at or above the current scroll position —
  // not the nearest start, which would flip to the next section halfway through the text.
  const currentIndex = snapTops.reduce(
    (activeIndex, top, index) => (scrollTop + edgeTolerance >= top ? index : activeIndex),
    0,
  )
  const direction = event.deltaY > 0 ? 1 : -1
  const lastSectionIndex = sections.length - 1

  const currentTop = sectionTops[currentIndex]!
  const currentBottom = currentTop + sectionHeights[currentIndex]!

  // Inside a section that overflows the viewport, hand the wheel back to the page so the
  // rest of its content can be read; only snap once its edge has been reached.
  if (direction > 0 && scrollTop + viewportHeight < currentBottom - edgeTolerance) {
    resetSectionSnapIntent()
    return
  }
  if (direction < 0 && scrollTop > currentTop + edgeTolerance) {
    resetSectionSnapIntent()
    return
  }

  if (currentIndex === lastSectionIndex && direction > 0) {
    event.preventDefault()
    event.stopPropagation()
    return
  }

  const targetIndex = Math.min(sections.length - 1, Math.max(0, currentIndex + direction))

  if (targetIndex === currentIndex) return

  event.preventDefault()
  event.stopPropagation()

  // Swallow the wheel while the push is still building, so a light touch neither snaps nor
  // drifts the page out of alignment with the section it is resting on.
  if (direction !== snapIntentDirection || event.timeStamp - snapIntentAt > snapIntentIdleMs) {
    snapIntentAmount = 0
  }
  snapIntentDirection = direction
  snapIntentAt = event.timeStamp
  snapIntentAmount += Math.abs(wheelDeltaPixels(event))

  if (snapIntentAmount < snapIntentThreshold) return

  resetSectionSnapIntent()

  const targetHeight = sectionHeights[targetIndex]!
  // Scrolling up into a taller-than-viewport section lands on its bottom edge, so the
  // reader walks back through its content instead of jumping over it to the heading.
  const targetTop = Math.max(
    0,
    Math.min(
      direction < 0 && targetHeight > viewportHeight
        ? sectionTops[targetIndex]! + targetHeight - viewportHeight
        : sectionTops[targetIndex]!,
      maxScrollTop,
    ),
  )
  const prefersReducedMotion =
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

  isSnapping = true
  snapUnlockTimer = window.setTimeout(unlockSectionSnap, 1400)

  if (lenis && !prefersReducedMotion) {
    lenis.scrollTo(targetTop, {
      duration: 1,
      lock: true,
      onComplete: unlockSectionSnap,
    })
    return
  }

  window.scrollTo({
    top: targetTop,
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  })
  window.clearTimeout(snapUnlockTimer)
  snapUnlockTimer = window.setTimeout(unlockSectionSnap, prefersReducedMotion ? 250 : 1000)
}

onMounted(() => {
  window.addEventListener('wheel', handleSectionWheel, { passive: false, capture: true })

  if (
    typeof ResizeObserver === 'undefined' ||
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  ) {
    return
  }

  lenis = new Lenis({
    anchors: true,
    autoRaf: true,
  })
})

onUnmounted(() => {
  window.removeEventListener('wheel', handleSectionWheel, true)
  unlockSectionSnap()
  lenis?.destroy()
})

const OrganicSphereDevPanel =
  import.meta.env.MODE === 'shader-dev'
    ? defineAsyncComponent(() => import('./components/OrganicSphereDevPanel.vue'))
    : null
</script>

<template>
  <div class="bg-canvas relative isolate min-h-svh overflow-x-clip">
    <DotFieldBackground />
    <OrganicWireSphere
      class="pointer-events-none fixed inset-0 z-0 h-svh w-full"
      :settings="organicSphereSettings"
    />
    <OrganicSphereDevPanel v-if="OrganicSphereDevPanel" v-model="organicSphereSettings" />
    <SiteHeader />
    <SectionIndicator />
    <main class="relative z-10">
      <section
        id="home"
        class="relative z-10 flex min-h-[max(100svh,640px)] w-full flex-col items-center justify-start px-6 pt-[clamp(116px,15svh,152px)] pb-[clamp(36px,6svh,64px)] max-[760px]:px-4 max-[760px]:pt-[112px]"
        aria-label="Workshop landing"
      >
        <LandingHero
          :countdown-target="eventConfig.startAt"
          :session-url="eventConfig.sessionUrl"
        />
      </section>
      <AboutEventSection />
      <AboutSpeakerSection />
      <EventDetailsSection />
    </main>
    <SiteFooter />
  </div>
</template>
