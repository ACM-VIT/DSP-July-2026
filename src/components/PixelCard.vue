<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

type PixelAnimation = 'appear' | 'disappear'
type PixelCardVariant = 'default' | 'blue' | 'yellow' | 'pink'

type VariantSettings = {
  gap: number
  speed: number
  colors: string
  noFocus: boolean
}

const variants: Record<PixelCardVariant, VariantSettings> = {
  default: {
    gap: 5,
    speed: 35,
    colors: '#f8fafc,#f1f5f9,#cbd5e1',
    noFocus: false,
  },
  blue: {
    gap: 10,
    speed: 25,
    colors: '#e0f2fe,#7dd3fc,#0ea5e9',
    noFocus: false,
  },
  yellow: {
    gap: 3,
    speed: 20,
    colors: '#fef08a,#fde047,#eab308',
    noFocus: false,
  },
  pink: {
    gap: 6,
    speed: 80,
    colors: '#fecdd3,#fda4af,#e11d48',
    noFocus: true,
  },
}

const props = withDefaults(
  defineProps<{
    variant?: PixelCardVariant
    gap?: number
    speed?: number
    colors?: string
    noFocus?: boolean
  }>(),
  {
    variant: 'default',
    gap: undefined,
    speed: undefined,
    colors: undefined,
    noFocus: undefined,
  },
)

class Pixel {
  private readonly context: CanvasRenderingContext2D
  private readonly x: number
  private readonly y: number
  private readonly color: string
  private readonly speed: number
  private readonly sizeStep: number
  private readonly minSize = 0.5
  private readonly maxSizeInteger = 2
  private readonly maxSize: number
  private readonly delay: number
  private readonly counterStep: number
  private size = 0
  private counter = 0
  private isReverse = false
  private isShimmer = false
  isIdle = false

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    speed: number,
    delay: number,
  ) {
    this.context = context
    this.x = x
    this.y = y
    this.color = color
    this.speed = this.randomValue(0.1, 0.9) * speed
    this.sizeStep = Math.random() * 0.4
    this.maxSize = this.randomValue(this.minSize, this.maxSizeInteger)
    this.delay = delay
    this.counterStep = Math.random() * 4 + (canvas.width + canvas.height) * 0.01
  }

  private randomValue(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  private draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5
    this.context.fillStyle = this.color
    this.context.fillRect(this.x + centerOffset, this.y + centerOffset, this.size, this.size)
  }

  appear() {
    this.isIdle = false
    if (this.counter <= this.delay) {
      this.counter += this.counterStep
      return
    }
    if (this.size >= this.maxSize) {
      this.isShimmer = true
    }
    if (this.isShimmer) {
      this.shimmer()
    } else {
      this.size += this.sizeStep
    }
    this.draw()
  }

  disappear() {
    this.isShimmer = false
    this.counter = 0
    if (this.size <= 0) {
      this.isIdle = true
      return
    }
    this.size -= 0.1
    this.draw()
  }

  private shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true
    } else if (this.size <= this.minSize) {
      this.isReverse = false
    }
    this.size += this.isReverse ? -this.speed : this.speed
  }
}

const container = ref<HTMLDivElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const pixels: Pixel[] = []
let animationFrame: number | undefined
let previousTime = performance.now()
let resizeObserver: ResizeObserver | undefined

const variantSettings = variants[props.variant]
const gap = props.gap ?? variantSettings.gap
const speed = props.speed ?? variantSettings.speed
const colors = props.colors ?? variantSettings.colors
const noFocus = props.noFocus ?? variantSettings.noFocus
const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

function effectiveSpeed(value: number) {
  if (value <= 0 || reducedMotion) return 0
  return Math.min(value, 100) * 0.001
}

function initializePixels() {
  if (!container.value || !canvas.value) return

  const bounds = container.value.getBoundingClientRect()
  const width = Math.floor(bounds.width)
  const height = Math.floor(bounds.height)
  const context = canvas.value.getContext('2d')

  if (!context || width === 0 || height === 0) return

  canvas.value.width = width
  canvas.value.height = height
  pixels.length = 0

  const palette = colors.split(',')
  for (let x = 0; x < width; x += gap) {
    for (let y = 0; y < height; y += gap) {
      const color = palette[Math.floor(Math.random() * palette.length)] ?? palette[0] ?? '#f8fafc'
      const distance = Math.hypot(x - width / 2, y - height / 2)
      pixels.push(
        new Pixel(
          canvas.value,
          context,
          x,
          y,
          color,
          effectiveSpeed(speed),
          reducedMotion ? 0 : distance,
        ),
      )
    }
  }
}

function animate(animation: PixelAnimation) {
  animationFrame = requestAnimationFrame(() => animate(animation))
  const currentTime = performance.now()
  const elapsed = currentTime - previousTime
  const interval = 1000 / 60

  if (elapsed < interval || !canvas.value) return
  previousTime = currentTime - (elapsed % interval)

  const context = canvas.value.getContext('2d')
  if (!context) return

  context.clearRect(0, 0, canvas.value.width, canvas.value.height)
  let allIdle = true

  for (const pixel of pixels) {
    pixel[animation]()
    if (!pixel.isIdle) allIdle = false
  }

  if (allIdle && animationFrame !== undefined) {
    cancelAnimationFrame(animationFrame)
    animationFrame = undefined
  }
}

function startAnimation(animation: PixelAnimation) {
  if (animationFrame !== undefined) cancelAnimationFrame(animationFrame)
  animationFrame = requestAnimationFrame(() => animate(animation))
}

function handleFocus(event: FocusEvent) {
  if (noFocus || event.currentTarget instanceof Node === false) return
  if ((event.currentTarget as Node).contains(event.relatedTarget as Node | null)) return
  startAnimation('appear')
}

function handleBlur(event: FocusEvent) {
  if (noFocus || event.currentTarget instanceof Node === false) return
  if ((event.currentTarget as Node).contains(event.relatedTarget as Node | null)) return
  startAnimation('disappear')
}

onMounted(() => {
  if (typeof ResizeObserver === 'undefined') return

  initializePixels()
  resizeObserver = new ResizeObserver(initializePixels)
  if (container.value) resizeObserver.observe(container.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  if (animationFrame !== undefined) cancelAnimationFrame(animationFrame)
})
</script>

<template>
  <div
    ref="container"
    class="pixel-card"
    :tabindex="noFocus ? -1 : 0"
    @mouseenter="startAnimation('appear')"
    @mouseleave="startAnimation('disappear')"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <slot />
    <canvas ref="canvas" class="pixel-canvas" aria-hidden="true" />
  </div>
</template>

<style scoped>
.pixel-card {
  position: relative;
  display: grid;
  width: 100%;
  height: 100%;
  overflow: hidden;
  place-items: center;
  isolation: isolate;
  border: 1px solid #27272a;
  border-radius: 25px;
  user-select: none;
  transition: border-color 200ms cubic-bezier(0.5, 1, 0.89, 1);
}

.pixel-card::before {
  position: absolute;
  z-index: 1;
  inset: 0;
  aspect-ratio: 1;
  margin: auto;
  background: radial-gradient(circle, rgb(9 9 11 / 0.25), transparent 85%);
  content: '';
  opacity: 0;
  transition: opacity 800ms cubic-bezier(0.5, 1, 0.89, 1);
}

.pixel-card:hover::before,
.pixel-card:focus-within::before {
  opacity: 1;
}

.pixel-canvas {
  position: absolute;
  z-index: 2;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
