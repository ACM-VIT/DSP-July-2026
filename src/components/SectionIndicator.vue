<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about-event', label: 'Event' },
  { id: 'about-speaker', label: 'Speaker' },
  { id: 'event-details', label: 'Timeline' },
] as const

const activeSection = ref<(typeof sections)[number]['id']>('home')
let animationFrame: number | undefined

function updateActiveSection() {
  animationFrame = undefined
  const viewportMarker = window.scrollY + window.innerHeight * 0.35
  let currentSection: (typeof sections)[number]['id'] = sections[0]!.id

  for (const section of sections) {
    const element = document.getElementById(section.id)
    const sectionTop =
      section.id === 'home'
        ? 0
        : element
          ? element.getBoundingClientRect().top + window.scrollY
          : Number.POSITIVE_INFINITY

    if (viewportMarker >= sectionTop) {
      currentSection = section.id
    }
  }

  activeSection.value = currentSection
}

function requestUpdate() {
  if (animationFrame === undefined) {
    animationFrame = window.requestAnimationFrame(updateActiveSection)
  }
}

onMounted(() => {
  updateActiveSection()
  window.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('resize', requestUpdate)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', requestUpdate)
  window.removeEventListener('resize', requestUpdate)
  if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame)
})
</script>

<template>
  <nav
    class="fixed top-1/2 right-4 z-40 flex -translate-y-1/2 flex-col gap-1 rounded-full border border-white/20 bg-black/45 p-1.5 shadow-lg shadow-black/30 backdrop-blur-xl max-[760px]:hidden"
    aria-label="Section navigation"
  >
    <a
      v-for="section in sections"
      :key="section.id"
      class="group focus-visible:outline-accent flex h-5 w-5 items-center justify-center rounded-full transition-colors duration-300 hover:bg-white/8 focus-visible:outline-2 focus-visible:outline-offset-2"
      :class="{ 'bg-white/10 text-white': activeSection === section.id }"
      :href="`#${section.id}`"
      :aria-current="activeSection === section.id ? 'location' : undefined"
      :aria-label="section.label"
      :title="section.label"
    >
      <span
        class="block h-1.5 w-1.5 shrink-0 rounded-full bg-white/35 transition-[height,background-color] duration-300 group-hover:bg-white/70"
        :class="{ 'bg-accent h-3': activeSection === section.id }"
        aria-hidden="true"
      />
    </a>
  </nav>
</template>
