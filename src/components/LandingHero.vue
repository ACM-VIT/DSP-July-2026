<script setup lang="ts">
import CountdownTimer from './CountdownTimer.vue'

defineProps<{
  countdownTarget: string
}>()
</script>

<template>
  <section
    class="mx-auto flex w-full max-w-[1162px] flex-col items-center gap-[clamp(52px,7.22vw,104px)] text-center max-[360px]:gap-[42px]"
    aria-labelledby="workshop-title"
  >
    <h1
      id="workshop-title"
      class="text-accent w-full text-[clamp(34px,3.89vw,56px)] leading-[1.15] font-semibold [font-variation-settings:'opsz'_14,'wdth'_100] max-[360px]:text-[30px]"
    >
      A Hands-On Workshop: Building Advanced AI Applications and Agents in One Hour
    </h1>

    <CountdownTimer :target="countdownTarget" />

    <p
      class="w-full text-[clamp(16px,1.39vw,20px)] leading-[1.3] text-white [font-variation-settings:'opsz'_14,'wdth'_100] max-[360px]:text-sm"
    >
      Because Technology Matters
    </p>
  </section>
</template>
