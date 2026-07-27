<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import {
  defaultOrganicSphereSettings,
  noisyOrganicSphereSettings,
  type OrganicSphereSettings,
} from '../graphics/organic-sphere/types'
import { wireframeStyles, type WireframeStyle } from '../graphics/organic-sphere/wireframeStyles'

type NumericSettingKey = Exclude<keyof OrganicSphereSettings, 'wireframeStyle'>

type SliderControl = {
  key: NumericSettingKey
  label: string
  min: number
  max: number
  step: number
}

const props = defineProps<{
  modelValue: OrganicSphereSettings
}>()

const emit = defineEmits<{
  'update:modelValue': [settings: OrganicSphereSettings]
}>()

const controls: SliderControl[] = [
  { key: 'baseFrequency', label: 'Base frequency', min: 0.2, max: 6, step: 0.1 },
  { key: 'frequency', label: 'Peak frequency', min: 0.2, max: 10, step: 0.1 },
  { key: 'baseAmplitude', label: 'Base amplitude', min: 0, max: 0.6, step: 0.01 },
  { key: 'peakAmplitude', label: 'Peak amplitude', min: 0, max: 1.5, step: 0.01 },
  { key: 'peakSharpness', label: 'Peak sharpness', min: 0.5, max: 8, step: 0.05 },
  { key: 'peakBias', label: 'Peak bias', min: 0, max: 0.6, step: 0.01 },
  { key: 'valleyAmplitude', label: 'Valley amplitude', min: 0, max: 1.5, step: 0.01 },
  { key: 'warpFrequency', label: 'Warp frequency', min: 0.2, max: 8, step: 0.1 },
  { key: 'warpStrength', label: 'Warp strength', min: 0, max: 1.2, step: 0.01 },
  { key: 'detailFrequency', label: 'Detail multiplier', min: 0.5, max: 6, step: 0.05 },
  { key: 'detailAmplitude', label: 'Detail amplitude', min: 0, max: 0.6, step: 0.005 },
  { key: 'microFrequency', label: 'Micro multiplier', min: 1, max: 12, step: 0.1 },
  { key: 'microAmplitude', label: 'Micro amplitude', min: 0, max: 0.3, step: 0.005 },
  { key: 'animationSpeed', label: 'Mutation speed', min: 0, max: 0.5, step: 0.005 },
  { key: 'rotationSpeed', label: 'Rotation speed', min: 0, max: 0.5, step: 0.005 },
  { key: 'opacity', label: 'Line opacity', min: 0.02, max: 1, step: 0.01 },
]

const copyStatus = ref('Copy values')
let copyStatusTimer: number | undefined

function updateSetting(key: NumericSettingKey, event: Event) {
  const input = event.currentTarget as HTMLInputElement

  emit('update:modelValue', {
    ...props.modelValue,
    [key]: Number(input.value),
  })
}

function selectStyle(wireframeStyle: WireframeStyle) {
  emit('update:modelValue', {
    ...props.modelValue,
    wireframeStyle,
  })
}

function applyPreset(settings: Readonly<OrganicSphereSettings>, preserveStyle = false) {
  emit('update:modelValue', {
    ...settings,
    wireframeStyle: preserveStyle ? props.modelValue.wireframeStyle : settings.wireframeStyle,
  })
}

async function writeToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.opacity = '0'
  document.body.append(textArea)
  textArea.select()
  const copied = document.execCommand('copy')
  textArea.remove()

  if (!copied) {
    throw new Error('Clipboard access is unavailable')
  }
}

async function copyValues() {
  window.clearTimeout(copyStatusTimer)

  try {
    await writeToClipboard(JSON.stringify(props.modelValue, null, 2))
    copyStatus.value = 'Copied!'
  } catch {
    copyStatus.value = 'Copy failed'
  }

  copyStatusTimer = window.setTimeout(() => {
    copyStatus.value = 'Copy values'
  }, 1800)
}

onBeforeUnmount(() => window.clearTimeout(copyStatusTimer))
</script>

<template>
  <aside
    class="fixed top-4 right-4 z-50 max-h-[calc(100svh-2rem)] w-[min(360px,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-[#c2e5fe]/40 bg-[#081017]/95 text-[#c2e5fe] shadow-2xl backdrop-blur-md"
    data-testid="organic-sphere-dev-panel"
  >
    <details open>
      <summary
        class="sticky top-0 z-10 cursor-pointer list-none border-b border-[#c2e5fe]/20 bg-[#081017]/95 px-4 py-3 font-semibold"
      >
        <span class="flex items-center justify-between gap-4">
          <span>Organic Sphere Lab</span>
          <span class="h-3 w-3 rounded-full bg-[#c2e5fe]" title="Wire colour #C2E5FE" />
        </span>
      </summary>

      <div class="space-y-4 p-4">
        <fieldset class="space-y-2">
          <legend class="text-xs font-semibold tracking-[0.08em] uppercase">Wireframe style</legend>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="style in wireframeStyles"
              :key="style.id"
              class="rounded-xl border p-2 text-left transition-colors"
              :class="
                modelValue.wireframeStyle === style.id
                  ? 'border-[#c2e5fe] bg-[#c2e5fe]/15'
                  : 'border-[#c2e5fe]/20 hover:border-[#c2e5fe]/55 hover:bg-[#c2e5fe]/5'
              "
              type="button"
              :aria-pressed="modelValue.wireframeStyle === style.id"
              :data-style="style.id"
              @click="selectStyle(style.id)"
            >
              <span class="mb-1 flex items-center justify-between gap-2">
                <span class="text-xs font-semibold">{{ style.label }}</span>
                <span class="flex -space-x-1">
                  <span
                    v-for="swatch in style.swatches"
                    :key="swatch"
                    class="h-3 w-3 rounded-full border border-black/30"
                    :style="{ backgroundColor: swatch }"
                  />
                </span>
              </span>
              <span class="block text-[10px] leading-tight text-[#c2e5fe]/65">
                {{ style.description }}
              </span>
            </button>
          </div>
        </fieldset>

        <div class="grid grid-cols-3 gap-2">
          <button
            class="rounded-lg border border-[#c2e5fe]/35 px-2 py-2 text-xs hover:bg-[#c2e5fe]/10"
            type="button"
            @click="applyPreset(defaultOrganicSphereSettings)"
          >
            Original
          </button>
          <button
            class="rounded-lg border border-[#c2e5fe]/35 px-2 py-2 text-xs hover:bg-[#c2e5fe]/10"
            type="button"
            @click="applyPreset(noisyOrganicSphereSettings, true)"
          >
            Noisy preset
          </button>
          <button
            class="rounded-lg bg-[#c2e5fe] px-2 py-2 text-xs font-semibold text-[#081017] hover:bg-white"
            type="button"
            @click="copyValues"
          >
            {{ copyStatus }}
          </button>
        </div>

        <label
          v-for="control in controls"
          :key="control.key"
          class="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 text-xs"
        >
          <span>{{ control.label }}</span>
          <output class="font-numeric tabular-nums">
            {{ modelValue[control.key] }}
          </output>
          <input
            class="col-span-2 w-full cursor-pointer accent-[#c2e5fe]"
            type="range"
            :min="control.min"
            :max="control.max"
            :step="control.step"
            :value="modelValue[control.key]"
            @input="updateSetting(control.key, $event)"
          />
        </label>
      </div>
    </details>
  </aside>
</template>
