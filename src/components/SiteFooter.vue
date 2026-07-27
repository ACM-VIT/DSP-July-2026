<script setup lang="ts">
import acmLogo from '../assets/acm-vit-logo.svg'
import facebookIcon from '../assets/icon-facebook.svg'
import hashnodeIcon from '../assets/icon-hashnode.png'
import instagramIcon from '../assets/icon-instagram.svg'
import linkedinIcon from '../assets/icon-linkedin.svg'
import twitterIcon from '../assets/icon-twitter.svg'
import youtubeIcon from '../assets/icon-youtube.png'
import { socialLinks } from '../config/social'

const iconSources: Record<(typeof socialLinks)[number]['id'], string> = {
  twitter: twitterIcon,
  instagram: instagramIcon,
  facebook: facebookIcon,
  hashnode: hashnodeIcon,
  linkedin: linkedinIcon,
  youtube: youtubeIcon,
}

// Figma renders each social glyph inside its own designed box, so the sizes differ per icon.
const iconSizes: Record<(typeof socialLinks)[number]['id'], { width: number; height: number }> = {
  twitter: { width: 31.074, height: 31.074 },
  instagram: { width: 31.074, height: 31.074 },
  facebook: { width: 31.038, height: 30.038 },
  hashnode: { width: 27, height: 27 },
  linkedin: { width: 31.074, height: 31.074 },
  youtube: { width: 30, height: 30 },
}

const navLinks = [
  { href: '#about-event', label: 'About Event' },
  { href: '#about-speaker', label: 'About Speaker' },
  { href: '#event-details', label: 'Event Details' },
]
</script>

<template>
  <footer
    id="site-footer"
    class="relative z-10 w-full px-20 pt-[49px] pb-9 max-[760px]:px-6 max-[760px]:pt-10 max-[760px]:pb-8"
  >
    <div
      class="mx-auto flex w-full max-w-[1281px] flex-col items-center gap-[55px] max-[760px]:gap-9"
    >
      <div class="flex w-full items-center justify-between max-[760px]:flex-col max-[760px]:gap-8">
        <img
          class="block h-[103.829px] w-[299px] shrink-0 max-[760px]:h-[73px] max-[760px]:w-[210px]"
          :src="acmLogo"
          alt="ACM VIT Student Chapter"
          width="299"
          height="104"
        />

        <nav
          class="flex flex-col items-center justify-center gap-5 text-base leading-[1.1875] whitespace-nowrap text-white [font-variation-settings:'opsz'_14,'wdth'_100] max-[760px]:gap-[14px]"
          aria-label="Footer navigation"
        >
          <a
            v-for="link in navLinks"
            :key="link.href"
            class="focus-visible:outline-accent rounded-sm underline-offset-[5px] hover:underline focus-visible:outline-2 focus-visible:outline-offset-[5px]"
            :href="link.href"
          >
            {{ link.label }}
          </a>
        </nav>
      </div>

      <ul class="flex items-center justify-center gap-5">
        <li v-for="social in socialLinks" :key="social.id" class="flex">
          <a
            class="focus-visible:outline-accent flex items-center justify-center rounded-sm opacity-100 transition-opacity duration-200 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4"
            :href="social.href"
            target="_blank"
            rel="noreferrer noopener"
            :aria-label="social.label"
          >
            <img
              class="block"
              :src="iconSources[social.id]"
              :style="{
                width: `${iconSizes[social.id].width}px`,
                height: `${iconSizes[social.id].height}px`,
              }"
              alt=""
              aria-hidden="true"
            />
          </a>
        </li>
      </ul>

      <p
        class="w-full text-center text-[32px] leading-[1.1875] font-medium text-[#c2e5fe] [font-variation-settings:'opsz'_14,'wdth'_100] max-[760px]:text-[24px]"
      >
        made with &lt;3 by acmvit
      </p>
    </div>
  </footer>
</template>
