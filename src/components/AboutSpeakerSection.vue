<script setup lang="ts">
import speakerPortrait from '../assets/speaker-mehdi-bahrami.png'
import PixelCard from './PixelCard.vue'
</script>

<template>
  <section
    id="about-speaker"
    class="flex min-h-screen w-full scroll-mt-5 flex-col items-center justify-center px-6 py-20 max-[760px]:min-h-svh max-[760px]:px-5 max-[760px]:py-[72px]"
    aria-labelledby="about-speaker-title"
  >
    <h2
      id="about-speaker-title"
      class="text-accent text-center text-[clamp(38px,3.34vw,48px)] leading-[1.2] font-bold [font-variation-settings:'opsz'_14,'wdth'_100]"
    >
      About The Speaker
    </h2>

    <div
      class="mx-auto mt-[90px] grid w-full max-w-[1322px] grid-cols-[375px_minmax(0,1fr)] items-start gap-[43px] max-[1100px]:grid-cols-[320px_minmax(0,1fr)] max-[1100px]:gap-[34px] max-[760px]:mt-[52px] max-[760px]:grid-cols-1 max-[760px]:gap-[38px]"
    >
      <PixelCard
        variant="blue"
        :density="0.5"
        class="h-[416px] w-[375px] -translate-y-10 max-[1100px]:h-[356px] max-[1100px]:w-[320px] max-[1100px]:-translate-y-6 max-[760px]:mx-auto max-[760px]:aspect-[375/416] max-[760px]:h-auto max-[760px]:w-[min(100%,320px)] max-[760px]:translate-y-0"
      >
        <img
          class="absolute inset-0 z-10 h-full w-full object-cover"
          :src="speakerPortrait"
          alt="Mehdi Bahrami"
          width="375"
          height="416"
        />
      </PixelCard>

      <div
        class="text-copy grid gap-6 text-justify text-xl leading-[1.22] [font-variation-settings:'opsz'_14,'wdth'_100] max-[760px]:gap-5 max-[760px]:text-left max-[760px]:text-[17px] max-[760px]:leading-[1.35]"
      >
        <p>
          Dr. Mehdi Bahrami is a Principal Researcher at Fujitsu Research of America, specializing
          in machine learning and natural language processing. He earned his PhD in Electrical
          Engineering and Computer Science from the University of California, Merced, after working
          at its Cloud Lab.
        </p>
        <p>
          With over a decade of industry experience, he holds more than 34 granted U.S. patents and
          has published widely, with his work also featured in MIT Technology Review. He also serves
          as an editor and reviewer for international computer science journals.
        </p>
        <p>
          Dr. Bahrami, a frequent international speaker, has served twice in the U.S. National
          Science Foundation cloud computing panels. His honors include the 2024 IEEE Outstanding
          Engineer Award, the ACM ICN 2016 Best Demo Award, and the 2015 Distinguished Leadership
          Award from the Margo F. Souza Leadership Center.
        </p>
      </div>
    </div>
  </section>
</template>
