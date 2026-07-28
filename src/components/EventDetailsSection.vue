<script setup lang="ts">
import dateIcon from '../assets/icon-date.svg'
import timeIcon from '../assets/icon-time.svg'
import platformIcon from '../assets/icon-venue.svg'
import { eventConfig } from '../config/event'
// import scheduleLine from '../assets/schedule-line.svg'

const details = [
  { label: 'Date', value: eventConfig.dateLabel, icon: dateIcon },
  { label: 'Time', value: eventConfig.timeLabel, icon: timeIcon },
  { label: 'Platform', value: eventConfig.platform, icon: platformIcon },
]

/* const schedule = [
  {
    time: '4:00 PM – 4:15 PM',
    description:
      'Stuff stuff Stuff stuffStuff stuff Stuff stuff Stuff stuffStuff stuff Stuff stuff Stuff stuffStuff stuff Stuff stuff Stuff stuff Stuff stuff Stuff stuff',
  },
  {
    time: '4:15 PM – 4:30 PM',
    description:
      'Stuff stuff Stuff stuffStuff stuff Stuff stuff Stuff stuffStuff stuff Stuff stuff Stuff stuffStuff stuff Stuff stuff Stuff stuff Stuff stuff Stuff stuff',
  },
  {
    time: '4:30 PM – 4:40 PM',
    description:
      'Stuff stuff Stuff stuffStuff stuff Stuff stuff Stuff stuffStuff stuff Stuff stuff Stuff stuffStuff stuff Stuff stuff Stuff stuff Stuff stuff Stuff stuff',
  },
  {
    time: '4:50 PM – 5:00 PM',
    description: 'stuff stuff stuff stuff',
  },
] */
</script>

<template>
  <section
    id="event-details"
    class="flex h-screen w-full scroll-mt-5 flex-col items-center justify-center overflow-hidden px-6 py-[clamp(48px,7vh,80px)] max-[760px]:h-svh max-[760px]:px-5 max-[760px]:py-8"
    aria-labelledby="event-details-title"
  >
    <h2
      id="event-details-title"
      class="text-accent text-center text-[clamp(38px,3.34vw,48px)] leading-[1.2] font-bold [font-variation-settings:'opsz'_14,'wdth'_100]"
    >
      Event Details
    </h2>

    <div
      class="mx-auto mt-11 grid w-full max-w-[878px] grid-cols-[repeat(2,minmax(0,417px))] justify-center gap-x-11 gap-y-[38px] max-[760px]:mt-12 max-[760px]:max-w-[417px] max-[760px]:grid-cols-1 max-[760px]:gap-[18px]"
    >
      <article
        v-for="(detail, index) in details"
        :key="detail.label"
        class="event-card bg-surface grid min-h-[102px] grid-cols-[24px_minmax(0,1fr)] items-start gap-5 rounded-2xl border border-white px-[46px] py-[18px] max-[760px]:w-full max-[760px]:px-[clamp(22px,8vw,46px)] max-[420px]:min-h-24 max-[420px]:gap-4 max-[420px]:px-[22px] max-[420px]:py-4"
        :class="{
          'col-span-2 w-[417px] justify-self-center max-[760px]:col-auto max-[760px]:w-full':
            index === 2,
        }"
      >
        <img class="mt-0.5 block h-6 w-6" :src="detail.icon" alt="" width="24" height="24" />
        <div>
          <h3 class="font-numeric text-accent text-xl leading-[1.2] font-semibold">
            {{ detail.label }}
          </h3>
          <p class="font-numeric mt-[9px] text-xl leading-[1.2] font-semibold">
            {{ detail.value }}
          </p>
        </div>
      </article>
    </div>

    <!-- <div class="mx-auto mt-[42px] w-full max-w-[980px] max-[760px]:mt-14">
      <h3
        class="text-accent text-2xl leading-[1.2] font-bold [font-variation-settings:'opsz'_14,'wdth'_100]"
      >
        Event Schedule:
      </h3>
      <div class="relative mt-6 max-[760px]:mt-7">
        <img
          class="absolute top-0 left-[236px] block h-px w-[332px] origin-top-left rotate-90 max-[760px]:hidden"
          :src="scheduleLine"
          alt=""
          width="332"
          height="1"
        />
        <article
          v-for="(item, index) in schedule"
          :key="item.time"
          class="event-schedule__row grid min-h-12 grid-cols-[236px_minmax(0,1fr)] gap-[49px] text-xl leading-[1.2] text-white max-[760px]:block max-[760px]:min-h-0 max-[760px]:text-[17px]"
          :class="{ 'mt-12 max-[760px]:mt-[30px]': index > 0 }"
        >
          <time class="font-sans">{{ item.time }}</time>
          <p class="max-[760px]:mt-2 max-[760px]:text-[#d9d9d9]">
            {{ item.description }}
          </p>
        </article>
      </div>
    </div> -->
  </section>
</template>
