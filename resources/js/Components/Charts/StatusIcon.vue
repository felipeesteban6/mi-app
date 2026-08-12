<script setup>
import { status as statusColors } from '@/chartColors';

defineProps({
    status: { type: String, required: true }, // good | warning | serious | critical
    class: { type: String, default: 'h-3.5 w-3.5' },
});
</script>

<template>
    <svg v-if="status === 'good'" :class="$props.class" viewBox="0 0 20 20" :fill="statusColors.good">
        <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
        />
    </svg>
    <svg
        v-else-if="status === 'warning' || status === 'serious'"
        :class="$props.class"
        viewBox="0 0 20 20"
        :fill="statusColors[status]"
    >
        <path
            fill-rule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l6.28 11.18c.75 1.334-.213 2.98-1.742 2.98H3.72c-1.53 0-2.492-1.646-1.743-2.98l6.28-11.18zM11 14a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.5a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"
            clip-rule="evenodd"
        />
    </svg>
    <svg v-else :class="$props.class" viewBox="0 0 20 20" :fill="statusColors.critical">
        <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
            clip-rule="evenodd"
        />
    </svg>
</template>
