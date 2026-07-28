<script setup lang="ts">
const anchors = [
  [4, 6],
  [14, 8],
  [25, 5],
  [37, 10],
  [49, 6],
  [61, 9],
  [73, 5],
  [85, 8],
  [96, 6],
  [8, 20],
  [19, 17],
  [31, 23],
  [43, 18],
  [55, 21],
  [67, 16],
  [79, 23],
  [92, 18],
  [3, 34],
  [13, 38],
  [24, 31],
  [35, 37],
  [47, 33],
  [59, 39],
  [71, 32],
  [83, 37],
  [96, 31],
  [7, 50],
  [18, 46],
  [29, 53],
  [40, 48],
  [52, 55],
  [64, 49],
  [76, 54],
  [88, 47],
  [98, 52],
  [3, 65],
  [14, 70],
  [25, 63],
  [37, 68],
  [49, 64],
  [60, 71],
  [72, 65],
  [84, 69],
  [95, 63],
  [8, 82],
  [20, 77],
  [31, 86],
  [43, 80],
  [55, 87],
  [67, 79],
  [79, 85],
  [91, 78],
  [4, 95],
  [16, 91],
  [28, 96],
  [40, 92],
  [52, 97],
  [64, 91],
  [76, 96],
  [88, 91],
  [98, 96],
  [10, 13],
  [34, 13],
  [58, 13],
  [82, 13],
  [16, 27],
  [40, 27],
  [64, 27],
  [88, 27],
  [28, 73],
  [52, 73],
  [76, 73],
] as const

const particles = anchors.map(([x, y], index) => ({
  x,
  y,
  route: (index % 8) + 1,
  delay: -((index * 1.73) % 19),
  duration: 8.1 + (index % 7) * 0.32,
  pulse: 2.8 + (index % 6) * 0.46,
  scale: index % 11 === 0 ? 1.35 : index % 5 === 0 ? 1.12 : 0.9,
}))

function particleStyle(particle: (typeof particles)[number]) {
  return {
    '--dot-x': `${particle.x}%`,
    '--dot-y': `${particle.y}%`,
    '--walk-delay': `${particle.delay}s`,
    '--walk-duration': `${particle.duration}s`,
    '--pulse-delay': `${particle.delay * 0.37}s`,
    '--pulse-duration': `${particle.pulse}s`,
    '--dot-scale': `${particle.scale}`,
  }
}
</script>

<template>
  <div class="dot-field" aria-hidden="true" data-testid="dot-field-background">
    <div class="dot-field__walkers">
      <span
        v-for="(particle, index) in particles"
        :key="`${particle.x}-${particle.y}`"
        class="dot-field__walker"
        :class="`dot-field__walker--route-${particle.route}`"
        :style="particleStyle(particle)"
        :data-particle="index + 1"
      />
    </div>
  </div>
</template>

<style scoped>
.dot-field {
  --dot-grid: 25px;
  --dot-grid-negative: -25px;
  --dot-grid-double: 50px;
  --dot-grid-double-negative: -50px;
  position: fixed;
  z-index: 0;
  inset: 0;
  overflow: hidden;
  background: #111315;
  pointer-events: none;
}

.dot-field::before {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle,
    rgb(178 192 204 / 0.38) 0,
    rgb(178 192 204 / 0.38) 0.7px,
    transparent 0.9px
  );
  background-position: 12.5px 12.5px;
  background-size: var(--dot-grid) var(--dot-grid);
  content: '';
}

.dot-field__walkers {
  position: absolute;
  inset: -50px;
}

.dot-field__walker {
  position: absolute;
  top: var(--dot-y);
  left: var(--dot-x);
  width: 2px;
  height: 2px;
  border-radius: 50%;
  will-change: transform;
}

.dot-field__walker::before {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: #f8fcff;
  box-shadow:
    0 0 2px 1px rgb(225 241 255 / 0.82),
    0 0 7px 2px rgb(144 188 226 / 0.3);
  content: '';
  animation: light-pulse var(--pulse-duration) ease-in-out var(--pulse-delay) infinite alternate;
}

.dot-field__walker--route-1 {
  animation: random-walk-1 var(--walk-duration) steps(9, end) var(--walk-delay) infinite;
}

.dot-field__walker--route-2 {
  animation: random-walk-2 var(--walk-duration) steps(9, end) var(--walk-delay) infinite;
}

.dot-field__walker--route-3 {
  animation: random-walk-3 var(--walk-duration) steps(9, end) var(--walk-delay) infinite;
}

.dot-field__walker--route-4 {
  animation: random-walk-4 var(--walk-duration) steps(9, end) var(--walk-delay) infinite;
}

.dot-field__walker--route-5 {
  animation: random-walk-5 var(--walk-duration) steps(9, end) var(--walk-delay) infinite;
}

.dot-field__walker--route-6 {
  animation: random-walk-6 var(--walk-duration) steps(9, end) var(--walk-delay) infinite;
}

.dot-field__walker--route-7 {
  animation: random-walk-7 var(--walk-duration) steps(9, end) var(--walk-delay) infinite;
}

.dot-field__walker--route-8 {
  animation: random-walk-8 var(--walk-duration) steps(9, end) var(--walk-delay) infinite;
}

@keyframes light-pulse {
  0% {
    opacity: 0.28;
    transform: scale(calc(var(--dot-scale) * 0.72));
  }

  55% {
    opacity: 0.68;
  }

  100% {
    opacity: 1;
    transform: scale(var(--dot-scale));
  }
}

@keyframes random-walk-1 {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  12% {
    transform: translate3d(var(--dot-grid), 0, 0);
  }

  25% {
    transform: translate3d(var(--dot-grid), var(--dot-grid-negative), 0);
  }

  38% {
    transform: translate3d(var(--dot-grid-double), var(--dot-grid-negative), 0);
  }

  50% {
    transform: translate3d(var(--dot-grid-double), var(--dot-grid), 0);
  }

  63% {
    transform: translate3d(var(--dot-grid), var(--dot-grid), 0);
  }

  76% {
    transform: translate3d(0, var(--dot-grid-double), 0);
  }

  88% {
    transform: translate3d(var(--dot-grid-negative), var(--dot-grid), 0);
  }
}

@keyframes random-walk-2 {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  14% {
    transform: translate3d(0, var(--dot-grid-negative), 0);
  }

  28% {
    transform: translate3d(var(--dot-grid-negative), var(--dot-grid-negative), 0);
  }

  42% {
    transform: translate3d(var(--dot-grid-double-negative), 0, 0);
  }

  57% {
    transform: translate3d(var(--dot-grid-negative), var(--dot-grid), 0);
  }

  71% {
    transform: translate3d(0, var(--dot-grid), 0);
  }

  86% {
    transform: translate3d(var(--dot-grid), 0, 0);
  }
}

@keyframes random-walk-3 {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  11% {
    transform: translate3d(var(--dot-grid-negative), 0, 0);
  }

  22% {
    transform: translate3d(var(--dot-grid-negative), var(--dot-grid), 0);
  }

  36% {
    transform: translate3d(0, var(--dot-grid-double), 0);
  }

  50% {
    transform: translate3d(var(--dot-grid), var(--dot-grid), 0);
  }

  64% {
    transform: translate3d(var(--dot-grid-double), var(--dot-grid), 0);
  }

  78% {
    transform: translate3d(var(--dot-grid), 0, 0);
  }

  89% {
    transform: translate3d(var(--dot-grid), var(--dot-grid-negative), 0);
  }
}

@keyframes random-walk-4 {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  13% {
    transform: translate3d(0, var(--dot-grid), 0);
  }

  26% {
    transform: translate3d(var(--dot-grid), var(--dot-grid), 0);
  }

  39% {
    transform: translate3d(var(--dot-grid), var(--dot-grid-double), 0);
  }

  52% {
    transform: translate3d(var(--dot-grid-negative), var(--dot-grid-double), 0);
  }

  65% {
    transform: translate3d(var(--dot-grid-negative), var(--dot-grid), 0);
  }

  78% {
    transform: translate3d(var(--dot-grid-double-negative), 0, 0);
  }

  90% {
    transform: translate3d(var(--dot-grid-negative), 0, 0);
  }
}

@keyframes random-walk-5 {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  10% {
    transform: translate3d(var(--dot-grid), 0, 0);
  }

  24% {
    transform: translate3d(var(--dot-grid-double), 0, 0);
  }

  38% {
    transform: translate3d(var(--dot-grid-double), var(--dot-grid), 0);
  }

  52% {
    transform: translate3d(var(--dot-grid), var(--dot-grid-double), 0);
  }

  66% {
    transform: translate3d(0, var(--dot-grid), 0);
  }

  80% {
    transform: translate3d(var(--dot-grid-negative), var(--dot-grid), 0);
  }

  90% {
    transform: translate3d(var(--dot-grid-negative), 0, 0);
  }
}

@keyframes random-walk-6 {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  12% {
    transform: translate3d(0, var(--dot-grid-negative), 0);
  }

  25% {
    transform: translate3d(var(--dot-grid), var(--dot-grid-negative), 0);
  }

  37% {
    transform: translate3d(var(--dot-grid), var(--dot-grid-double-negative), 0);
  }

  50% {
    transform: translate3d(0, var(--dot-grid-double-negative), 0);
  }

  63% {
    transform: translate3d(var(--dot-grid-negative), var(--dot-grid-negative), 0);
  }

  76% {
    transform: translate3d(var(--dot-grid-double-negative), 0, 0);
  }

  88% {
    transform: translate3d(var(--dot-grid-negative), 0, 0);
  }
}

@keyframes random-walk-7 {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  14% {
    transform: translate3d(var(--dot-grid-negative), 0, 0);
  }

  28% {
    transform: translate3d(var(--dot-grid-double-negative), var(--dot-grid-negative), 0);
  }

  42% {
    transform: translate3d(var(--dot-grid-negative), var(--dot-grid-double-negative), 0);
  }

  56% {
    transform: translate3d(0, var(--dot-grid-negative), 0);
  }

  70% {
    transform: translate3d(var(--dot-grid), var(--dot-grid-negative), 0);
  }

  84% {
    transform: translate3d(var(--dot-grid), 0, 0);
  }
}

@keyframes random-walk-8 {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  11% {
    transform: translate3d(0, var(--dot-grid), 0);
  }

  23% {
    transform: translate3d(var(--dot-grid-negative), var(--dot-grid-double), 0);
  }

  36% {
    transform: translate3d(var(--dot-grid-double-negative), var(--dot-grid), 0);
  }

  49% {
    transform: translate3d(var(--dot-grid-double-negative), 0, 0);
  }

  62% {
    transform: translate3d(var(--dot-grid-negative), var(--dot-grid-negative), 0);
  }

  75% {
    transform: translate3d(0, var(--dot-grid-negative), 0);
  }

  88% {
    transform: translate3d(var(--dot-grid), 0, 0);
  }
}

@media (max-width: 760px) {
  .dot-field__walker:nth-child(5n) {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dot-field__walker,
  .dot-field__walker::before {
    animation: none;
  }

  .dot-field__walker::before {
    opacity: 0.55;
    transform: scale(var(--dot-scale));
  }
}
</style>
