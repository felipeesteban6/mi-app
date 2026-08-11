<script setup>
import { computed } from 'vue';

defineOptions({ inheritAttrs: false });

const emit = defineEmits(['update:checked']);

const props = defineProps({
    checked: {
        type: [Array, Boolean],
        required: true,
    },
    value: {
        default: null,
    },
});

const proxyChecked = computed({
    get() {
        return props.checked;
    },

    set(val) {
        emit('update:checked', val);
    },
});
</script>

<template>
    <span class="relative inline-flex h-5 w-5 shrink-0 items-center justify-center">
        <input
            type="checkbox"
            :value="value"
            v-model="proxyChecked"
            v-bind="$attrs"
            class="peer absolute inset-0 z-10 m-0 cursor-pointer opacity-0"
        />
        <span
            class="pointer-events-none flex h-5 w-5 items-center justify-center rounded-md border-2 border-gray-300 bg-white transition-all duration-150 peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2 dark:border-gray-600 dark:bg-gray-900 dark:peer-checked:border-indigo-500 dark:peer-checked:bg-indigo-500 dark:peer-focus-visible:ring-offset-gray-800"
        >
            <svg
                class="h-3.5 w-3.5 scale-0 text-white transition-transform duration-150"
                :class="{ 'scale-100': Array.isArray(checked) ? checked.includes(value) : checked }"
                viewBox="0 0 16 16"
                fill="none"
            >
                <path
                    d="M3.5 8.5L6.5 11.5L12.5 4.5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        </span>
    </span>
</template>
