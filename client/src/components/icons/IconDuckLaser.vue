<template>
  <svg viewBox="-15 -15 145 145" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="duck-body" x1="10" y1="0" x2="115" y2="120" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#FFDE59" />
        <stop offset="100%" stop-color="#FFB800" />
      </linearGradient>
      <!-- Outlines the whole silhouette as one unit (dilate the combined alpha,
           flood it dark, place it under the original artwork) rather than
           stroking each shape individually - the duck is built from several
           overlapping shapes (body, head, wing bump, beak), and per-shape
           strokes would leave stray outline seams wherever they overlap
           instead of just at the true outer edge. -->
      <filter id="duck-outline" x="-30%" y="-30%" width="160%" height="160%">
        <feMorphology in="SourceAlpha" operator="dilate" radius="3" result="dilated" />
        <feFlood flood-color="#2B1B4E" result="outline-color" />
        <feComposite in="outline-color" in2="dilated" operator="in" result="outline" />
        <feMerge>
          <feMergeNode in="outline" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <g filter="url(#duck-outline)">
      <ellipse cx="103" cy="70" rx="14" ry="17" fill="url(#duck-body)" />
      <ellipse cx="64" cy="82" rx="48" ry="35" fill="url(#duck-body)" />
      <circle cx="56" cy="32" r="31" fill="url(#duck-body)" />

      <path
        d="M 32 28 C 6 27, -8 39, -2 50 C 2 59, 16 65, 34 63 C 42 61, 44 50, 42 39 C 40 33, 37 29, 32 28 Z"
        fill="#FF8C1A"
      />
      <path
        d="M -2 50 C 3 60, 18 66, 34 63 C 30 58, 20 56, 8 54 C 3 53, -1 52, -2 50 Z"
        fill="#E8600A"
      />

      <circle cx="40" cy="21" r="6.8" fill="#fff" stroke="#2B1B4E" stroke-width="1.5" />
      <circle cx="62" cy="26" r="8.3" fill="#fff" stroke="#2B1B4E" stroke-width="1.5" />
      <circle cx="40" cy="21" r="4" fill="#FF1E3C" />
      <circle cx="62" cy="26" r="4.8" fill="#FF1E3C" />
    </g>

    <g class="laser-beam">
      <line x1="40" y1="21" x2="8" y2="-6" stroke="#FF1E3C" stroke-width="5" stroke-linecap="round" opacity="0.35" />
      <line x1="40" y1="21" x2="8" y2="-6" stroke="#FF1E3C" stroke-width="2" stroke-linecap="round" />
      <line x1="62" y1="26" x2="38" y2="-8" stroke="#FF1E3C" stroke-width="5" stroke-linecap="round" opacity="0.35" />
      <line x1="62" y1="26" x2="38" y2="-8" stroke="#FF1E3C" stroke-width="2" stroke-linecap="round" />
    </g>
  </svg>
</template>

<style scoped>
.laser-beam {
  animation: laser-fire 1.6s ease-in-out infinite;
}

@keyframes laser-fire {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.45;
  }
}
</style>
