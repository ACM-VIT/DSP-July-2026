<script setup lang="ts">
import { ref } from 'vue'
import acmLogo from '../assets/acm-vit-logo.png'

const isMenuOpen = ref(false)

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<template>
  <header
    class="absolute top-0 left-0 z-50 flex h-[91px] w-full items-center justify-between pt-[21px] pr-[43px] pl-11 max-[760px]:h-auto max-[760px]:min-h-[91px] max-[760px]:flex-wrap max-[760px]:gap-[18px] max-[760px]:p-5 max-[360px]:px-4"
  >
    <img
      class="block h-[70px] w-[206px] object-contain max-[760px]:h-[59px] max-[760px]:w-[174px] max-[360px]:h-[53px] max-[360px]:w-[156px]"
      :src="acmLogo"
      alt="ACM VIT Student Chapter"
      width="206"
      height="70"
    />

    <nav
      class="flex items-center gap-5 text-base leading-[1.2] max-[760px]:hidden"
      aria-label="Primary navigation"
    >
      <a
        class="focus-visible:outline-accent rounded-sm underline-offset-[5px] hover:underline focus-visible:outline-2 focus-visible:outline-offset-[5px]"
        href="#about-event"
      >
        About Event
      </a>
      <a
        class="focus-visible:outline-accent rounded-sm underline-offset-[5px] hover:underline focus-visible:outline-2 focus-visible:outline-offset-[5px]"
        href="#about-speaker"
      >
        About Speaker
      </a>
      <a
        class="focus-visible:outline-accent rounded-sm underline-offset-[5px] hover:underline focus-visible:outline-2 focus-visible:outline-offset-[5px]"
        href="#event-details"
      >
        Timeline
      </a>
    </nav>

    <button
      class="focus-visible:outline-accent relative hidden h-12 w-12 shrink-0 rounded-full border border-white/35 bg-black/40 focus-visible:outline-2 focus-visible:outline-offset-4 max-[760px]:block"
      type="button"
      aria-controls="mobile-navigation"
      :aria-expanded="isMenuOpen"
      :aria-label="isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'"
      @click="isMenuOpen = !isMenuOpen"
    >
      <span
        class="absolute top-[16px] left-1/2 h-0.5 w-5 -translate-x-1/2 bg-white transition-transform duration-300"
        :class="{ 'translate-y-[7px] rotate-45': isMenuOpen }"
      />
      <span
        class="absolute top-[23px] left-1/2 h-0.5 w-5 -translate-x-1/2 bg-white transition-opacity duration-200"
        :class="{ 'opacity-0': isMenuOpen }"
      />
      <span
        class="absolute top-[30px] left-1/2 h-0.5 w-5 -translate-x-1/2 bg-white transition-transform duration-300"
        :class="{ '-translate-y-[7px] -rotate-45': isMenuOpen }"
      />
    </button>

    <Transition
      enter-active-class="transition duration-250 ease-out"
      enter-from-class="-translate-y-2 opacity-0"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <nav
        v-if="isMenuOpen"
        id="mobile-navigation"
        class="absolute top-[calc(100%+10px)] right-5 left-5 hidden overflow-hidden rounded-2xl border border-white/30 bg-black/45 p-2 shadow-2xl shadow-black/70 backdrop-blur-[32px] backdrop-saturate-150 max-[760px]:grid"
        aria-label="Mobile navigation"
      >
        <a
          class="focus-visible:outline-accent rounded-xl px-5 py-4 text-lg font-semibold hover:bg-white/8 focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
          href="#about-event"
          @click="closeMenu"
        >
          About Event
        </a>
        <a
          class="focus-visible:outline-accent rounded-xl px-5 py-4 text-lg font-semibold hover:bg-white/8 focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
          href="#about-speaker"
          @click="closeMenu"
        >
          About Speaker
        </a>
        <a
          class="focus-visible:outline-accent rounded-xl px-5 py-4 text-lg font-semibold hover:bg-white/8 focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
          href="#event-details"
          @click="closeMenu"
        >
          Timeline
        </a>
      </nav>
    </Transition>
  </header>
</template>
