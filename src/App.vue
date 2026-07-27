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
import { eventStartAt } from './config/event'
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

function unlockSectionSnap() {
  isSnapping = false
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

  // The footer is shorter than the viewport, so its own offset is past the end of the
  // scroll range — clamping keeps both the snap target and the "which one am I on"
  // comparison below in sync with where the page can actually stop.
  const maxScrollTop = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  const sectionTops = sections.map((section, index) =>
    index === 0 ? 0 : Math.min(section.getBoundingClientRect().top + window.scrollY, maxScrollTop),
  )
  const currentIndex = sectionTops.reduce(
    (closestIndex, top, index) =>
      Math.abs(window.scrollY - top) < Math.abs(window.scrollY - sectionTops[closestIndex]!)
        ? index
        : closestIndex,
    0,
  )
  const direction = event.deltaY > 0 ? 1 : -1
  const lastSectionIndex = sections.length - 1

  if (currentIndex === lastSectionIndex && direction > 0) {
    event.preventDefault()
    event.stopPropagation()
    return
  }

  const targetIndex = Math.min(sections.length - 1, Math.max(0, currentIndex + direction))

  if (targetIndex === currentIndex) return

  event.preventDefault()
  event.stopPropagation()

  const targetTop = sectionTops[targetIndex]!
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
        class="relative z-10 flex h-screen w-full flex-col items-center justify-center px-6 max-[760px]:min-h-svh max-[760px]:px-4"
        aria-label="Workshop landing"
      >
        <LandingHero :countdown-target="eventStartAt" />
      </section>
      <AboutEventSection />
      <AboutSpeakerSection />
      <EventDetailsSection />
    </main>
    <SiteFooter />
  </div>
</template>
