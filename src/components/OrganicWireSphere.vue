<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { createRenderer } from '../graphics/organic-sphere/createRenderer'
import type { OrganicSphereRenderer, OrganicSphereSettings } from '../graphics/organic-sphere/types'

const canvas = ref<HTMLCanvasElement | null>(null)
const props = defineProps<{
  settings?: Partial<OrganicSphereSettings>
}>()

let renderer: OrganicSphereRenderer | null = null
let intersectionObserver: IntersectionObserver | null = null
let reducedMotionQuery: MediaQueryList | null = null
let previousScrollY = 0

function handleReducedMotionChange(event: MediaQueryListEvent) {
  renderer?.setReducedMotion(event.matches)
}

function handleScroll() {
  const scrollY = window.scrollY
  const scrollDelta = Math.abs(scrollY - previousScrollY)
  previousScrollY = scrollY
  renderer?.setScrollDistortion(0.2 + scrollDelta / 45)
}

onMounted(() => {
  if (!canvas.value || !('WebGL2RenderingContext' in window)) {
    return
  }

  renderer = createRenderer(canvas.value, props.settings)

  if (!renderer) {
    return
  }

  if (typeof window.matchMedia === 'function') {
    reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    renderer.setReducedMotion(reducedMotionQuery.matches)
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange)
  }
  previousScrollY = window.scrollY
  window.addEventListener('scroll', handleScroll, { passive: true })

  if ('IntersectionObserver' in window) {
    intersectionObserver = new IntersectionObserver(
      ([entry]) => renderer?.setInViewport(entry?.isIntersecting ?? false),
      { threshold: 0.01 },
    )
    intersectionObserver.observe(canvas.value)
  }

  renderer.start()
})

watch(
  () => props.settings,
  (settings) => renderer?.setSettings(settings ?? {}),
  { deep: true },
)

onBeforeUnmount(() => {
  intersectionObserver?.disconnect()
  reducedMotionQuery?.removeEventListener('change', handleReducedMotionChange)
  window.removeEventListener('scroll', handleScroll)
  renderer?.destroy()
  renderer = null
})
</script>

<template>
  <canvas ref="canvas" class="block" aria-hidden="true" data-testid="organic-wire-sphere" />
</template>
