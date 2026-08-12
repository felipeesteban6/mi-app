<script setup>
import StatusIcon from '@/Components/Charts/StatusIcon.vue';
import { status as statusColors } from '@/chartColors';

const props = defineProps({
    title: { type: String, required: true },
    value: { type: [Number, String], required: true },
    unit: { type: String, default: '' },
    status: { type: String, default: null }, // good | warning | serious | critical
    statusLabel: { type: String, default: '' },
    delta: { type: String, default: '' },
});

const statusMeta = {
    good: { label: 'Normal' },
    warning: { label: 'Atención' },
    serious: { label: 'Alerta' },
    critical: { label: 'Crítico' },
};

const borderColor = {
    good: 'transparent',
    warning: statusColors.warning,
    serious: statusColors.serious,
    critical: statusColors.critical,
};
</script>

<template>
    <div
        class="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-5 border-l-4"
        :style="{ borderLeftColor: status ? borderColor[status] : 'transparent' }"
    >
        <p class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{{ title }}</p>

        <p class="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100" style="font-variant-numeric: tabular-nums">
            {{ value }}<span class="text-lg font-normal text-gray-500 dark:text-gray-400">{{ unit }}</span>
        </p>

        <div class="mt-3 flex items-center justify-between">
            <span v-if="status" class="inline-flex items-center gap-1.5 text-xs font-medium">
                <StatusIcon :status="status" />
                <span :style="{ color: statusColors[status] }">{{ statusLabel || statusMeta[status].label }}</span>
            </span>
            <span v-else></span>

            <span v-if="delta" class="text-xs text-gray-400">{{ delta }}</span>
        </div>
    </div>
</template>
