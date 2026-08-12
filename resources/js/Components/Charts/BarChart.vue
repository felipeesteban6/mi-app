<script setup>
import { computed, ref } from 'vue';
import { useTheme } from '@/theme';
import { categorical, chrome, pick } from '@/chartColors';

const props = defineProps({
    items: { type: Array, required: true }, // [{ label, value }]
    unit: { type: String, default: '' },
    height: { type: Number, default: 200 },
});

const { isDark } = useTheme();

const width = 560;
const padding = { top: 16, right: 16, bottom: 28, left: 16 };
const plotW = width - padding.left - padding.right;
const plotH = props.height - padding.top - padding.bottom;

const maxValue = computed(() => Math.max(...props.items.map((i) => i.value)) * 1.15);

const barGap = 12;
const barWidth = computed(() => (plotW - barGap * (props.items.length - 1)) / props.items.length);

function xFor(i) {
    return padding.left + i * (barWidth.value + barGap);
}

function heightFor(v) {
    return (v / maxValue.value) * plotH;
}

// Rectángulo con solo las esquinas superiores redondeadas (anclado a la línea base).
function topRoundedRect(x, y, w, h, r) {
    const radius = Math.min(r, h, w / 2);
    return `M ${x} ${y + h}
            L ${x} ${y + radius}
            Q ${x} ${y} ${x + radius} ${y}
            L ${x + w - radius} ${y}
            Q ${x + w} ${y} ${x + w} ${y + radius}
            L ${x + w} ${y + h}
            Z`;
}

const hoverIndex = ref(null);
</script>

<template>
    <svg :viewBox="`0 0 ${width} ${height}`" class="w-full" :style="{ height: height + 'px' }">
        <line
            :x1="padding.left"
            :x2="width - padding.right"
            :y1="height - padding.bottom"
            :y2="height - padding.bottom"
            :stroke="pick(chrome.axis, isDark)"
            stroke-width="1"
        />

        <g
            v-for="(item, i) in items"
            :key="item.label"
            @mouseenter="hoverIndex = i"
            @mouseleave="hoverIndex = null"
        >
            <path
                :d="
                    topRoundedRect(
                        xFor(i),
                        height - padding.bottom - Math.max(heightFor(item.value), 2),
                        barWidth,
                        Math.max(heightFor(item.value), 2),
                        4
                    )
                "
                :fill="pick(categorical[i % categorical.length], isDark)"
                :opacity="hoverIndex === null || hoverIndex === i ? 1 : 0.45"
                class="transition-opacity duration-150"
            />
            <text
                :x="xFor(i) + barWidth / 2"
                :y="height - padding.bottom - heightFor(item.value) - 6"
                text-anchor="middle"
                :fill="pick(chrome.textSecondary, isDark)"
                font-size="11"
                font-weight="600"
            >
                {{ item.value }}{{ unit }}
            </text>
            <text
                :x="xFor(i) + barWidth / 2"
                :y="height - padding.bottom + 16"
                text-anchor="middle"
                :fill="pick(chrome.muted, isDark)"
                font-size="10"
            >
                {{ item.label }}
            </text>
        </g>
    </svg>
</template>
