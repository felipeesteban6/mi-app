<script setup>
import { computed, ref } from 'vue';
import { useTheme } from '@/theme';
import { chrome, pick } from '@/chartColors';

const props = defineProps({
    labels: { type: Array, required: true }, // x-axis categories (strings)
    series: { type: Array, required: true }, // [{ name, color: {light,dark}, data: number[] }]
    unit: { type: String, default: '' },
    height: { type: Number, default: 220 },
    yMin: { type: Number, default: null },
    yMax: { type: Number, default: null },
});

const { isDark } = useTheme();

const width = 560;
const padding = { top: 16, right: 16, bottom: 24, left: 36 };
const plotW = width - padding.left - padding.right;
const plotH = props.height - padding.top - padding.bottom;

const domain = computed(() => {
    const all = props.series.flatMap((s) => s.data);
    const min = props.yMin ?? Math.min(...all);
    const max = props.yMax ?? Math.max(...all);
    const pad = (max - min) * 0.1 || 1;
    return { min: Math.floor(min - pad), max: Math.ceil(max + pad) };
});

function xAt(i) {
    return padding.left + (i / (props.labels.length - 1)) * plotW;
}

function yAt(v) {
    const { min, max } = domain.value;
    return padding.top + plotH - ((v - min) / (max - min)) * plotH;
}

function pathFor(data) {
    return data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(1)} ${yAt(v).toFixed(1)}`).join(' ');
}

const gridLines = computed(() => {
    const { min, max } = domain.value;
    const steps = 4;
    return Array.from({ length: steps + 1 }, (_, i) => {
        const v = min + ((max - min) / steps) * i;
        return { value: Math.round(v), y: yAt(v) };
    });
});

// Hover
const hoverIndex = ref(null);
const svgEl = ref(null);

function onMove(evt) {
    const rect = svgEl.value.getBoundingClientRect();
    const relX = ((evt.clientX - rect.left) / rect.width) * width;
    const ratio = (relX - padding.left) / plotW;
    const idx = Math.round(ratio * (props.labels.length - 1));
    hoverIndex.value = Math.min(Math.max(idx, 0), props.labels.length - 1);
}

function onLeave() {
    hoverIndex.value = null;
}

const tooltipX = computed(() => (hoverIndex.value === null ? 0 : xAt(hoverIndex.value)));
const tooltipSide = computed(() => (tooltipX.value > width / 2 ? 'left' : 'right'));
</script>

<template>
    <div class="relative">
        <svg
            ref="svgEl"
            :viewBox="`0 0 ${width} ${height}`"
            class="w-full"
            :style="{ height: height + 'px' }"
            @mousemove="onMove"
            @mouseleave="onLeave"
        >
            <!-- Gridlines -->
            <g v-for="g in gridLines" :key="g.value">
                <line
                    :x1="padding.left"
                    :x2="width - padding.right"
                    :y1="g.y"
                    :y2="g.y"
                    :stroke="pick(chrome.gridline, isDark)"
                    stroke-width="1"
                />
                <text
                    :x="padding.left - 8"
                    :y="g.y"
                    text-anchor="end"
                    dominant-baseline="middle"
                    :fill="pick(chrome.muted, isDark)"
                    font-size="10"
                >
                    {{ g.value }}
                </text>
            </g>

            <!-- Series lines -->
            <path
                v-for="s in series"
                :key="s.name"
                :d="pathFor(s.data)"
                fill="none"
                :stroke="pick(s.color, isDark)"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />

            <!-- Hover crosshair -->
            <g v-if="hoverIndex !== null">
                <line
                    :x1="tooltipX"
                    :x2="tooltipX"
                    :y1="padding.top"
                    :y2="height - padding.bottom"
                    :stroke="pick(chrome.axis, isDark)"
                    stroke-width="1"
                    stroke-dasharray="3,3"
                />
                <circle
                    v-for="s in series"
                    :key="s.name"
                    :cx="tooltipX"
                    :cy="yAt(s.data[hoverIndex])"
                    r="4"
                    :fill="pick(s.color, isDark)"
                    :stroke="isDark ? '#1a1a19' : '#fcfcfb'"
                    stroke-width="2"
                />
            </g>
        </svg>

        <!-- Tooltip -->
        <div
            v-if="hoverIndex !== null"
            class="pointer-events-none absolute top-2 z-10 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs shadow-lg"
            :style="tooltipSide === 'right' ? { left: (tooltipX / width) * 100 + '%', marginLeft: '12px' } : { right: 100 - (tooltipX / width) * 100 + '%', marginRight: '12px' }"
        >
            <p class="font-medium text-gray-700 dark:text-gray-300">{{ labels[hoverIndex] }}</p>
            <p v-for="s in series" :key="s.name" class="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <span class="inline-block h-2 w-2 rounded-full" :style="{ backgroundColor: pick(s.color, isDark) }" />
                {{ s.name }}: <span class="font-semibold text-gray-900 dark:text-gray-100">{{ s.data[hoverIndex] }}{{ unit }}</span>
            </p>
        </div>
    </div>
</template>
