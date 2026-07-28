<script setup lang="ts">
import conclaveLogo from '../assets/conclave-logo.png'
import dateIcon from '../assets/icon-date.svg'
import timeIcon from '../assets/icon-time.svg'
import { eventConfig } from '../config/event'
// import scheduleLine from '../assets/schedule-line.svg'

const details = [
  { label: 'Date', value: eventConfig.dateLabel, icon: dateIcon, kind: 'calendar' },
  { label: 'Time', value: eventConfig.timeLabel, icon: timeIcon, kind: 'time' },
  { label: 'Platform', value: eventConfig.platform, icon: conclaveLogo, kind: 'conclave' },
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
    class="flex min-h-[max(100svh,640px)] w-full scroll-mt-5 flex-col items-center justify-center px-6 py-[clamp(48px,7svh,80px)] max-[760px]:px-5 max-[760px]:py-10"
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
        class="event-card bg-surface grid min-h-[116px] grid-cols-[56px_minmax(0,1fr)] items-center gap-5 rounded-2xl border border-white/70 px-9 py-[18px] max-[760px]:w-full max-[760px]:px-[clamp(22px,8vw,36px)] max-[420px]:min-h-[104px] max-[420px]:grid-cols-[48px_minmax(0,1fr)] max-[420px]:gap-4 max-[420px]:px-[22px] max-[420px]:py-4"
        :class="{
          'col-span-2 w-[417px] justify-self-center max-[760px]:col-auto max-[760px]:w-full':
            index === 2,
        }"
      >
        <img
          class="block justify-self-center object-contain"
          :class="{
            'h-12 w-12 max-[420px]:h-11 max-[420px]:w-11': detail.kind === 'calendar',
            'h-10 w-10 max-[420px]:h-9 max-[420px]:w-9': detail.kind === 'time',
            'h-10 w-14 max-[420px]:h-9 max-[420px]:w-12': detail.kind === 'conclave',
          }"
          :src="detail.icon"
          alt=""
          aria-hidden="true"
          :width="detail.kind === 'conclave' ? 56 : detail.kind === 'calendar' ? 48 : 40"
          :height="detail.kind === 'calendar' ? 48 : 40"
        />
        <div>
          <h3
            class="font-numeric text-accent text-xl leading-[1.2] font-semibold max-[420px]:text-lg"
          >
            {{ detail.label }}
          </h3>
          <p
            class="font-numeric mt-2 text-xl leading-[1.2] font-semibold text-pretty max-[420px]:text-lg"
          >
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
