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
        class="h-[416px] w-[375px] max-[1100px]:h-[356px] max-[1100px]:w-[320px] max-[760px]:mx-auto max-[760px]:aspect-[375/416] max-[760px]:h-auto max-[760px]:w-[min(100%,320px)]"
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
          Mehdi Bahrami is a Principal Researcher at Fujitsu Research of America in California. His
          work centres on machine learning and natural language processing. Before being a part of
          Fujitsu, he was part of the Cloud Lab at University of California, Merced where he
          completed his PhD in Electrical Engineering and Computer Science.
        </p>
        <p>
          He has experience of over a decade in the software industry and is a stellar inventor with
          a multitude of patents, more than 34 granted US parents with much more pending. His
          research as been widely published and covered by various outlets even including MIT
          Technology Review. He also serves as an editor and reviewer for various international
          computer science journals.
        </p>
        <p>
          Mr. Bahrami is a frequented feature speaker at multiple international conferences. He’s
          also previously twice served on cloud computing panels for the U.S National Science
          Foundation. His laurels and recognitions are not limited to and the 2024 IEEE Outstanding
          Engineer Award, the Best Demo Award at ACM ICN 2016 and the 2015 Distinguished Leadership
          Award from the Margo F. Souza Leadership Center.
        </p>
      </div>
    </div>
  </section>
</template>
