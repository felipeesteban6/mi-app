<script setup>
import { ref } from 'vue';

const count = ref(0);
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white p-10 rounded-lg shadow-xl text-center">
            <h1 class="text-3xl font-bold text-gray-900">Laravel + Vue + Vite + Tailwind</h1>
            <p class="mt-2 text-gray-500">Todo funcionando correctamente.</p>

            <button
                @click="count++"
                class="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
                Contador: {{ count }}
            </button>
        </div>
    </div>
</template>
