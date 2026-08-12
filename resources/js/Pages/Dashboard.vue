<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import StatTile from '@/Components/Charts/StatTile.vue';
import StatusIcon from '@/Components/Charts/StatusIcon.vue';
import LineChart from '@/Components/Charts/LineChart.vue';
import BarChart from '@/Components/Charts/BarChart.vue';
import { useInvernaderoDemo } from '@/Composables/useInvernaderoDemo';
import { categorical, status as statusColors } from '@/chartColors';
import { useTheme } from '@/theme';
import { pick } from '@/chartColors';
import { Head } from '@inertiajs/vue3';
import { computed } from 'vue';

const { horas, temperatura, humedadAmbiente, humedadSuelo, luzPorZona, resumen } = useInvernaderoDemo();
const { isDark } = useTheme();

const humedadSeries = [
    { name: 'Ambiente', color: categorical[0], data: humedadAmbiente },
    { name: 'Suelo', color: categorical[2], data: humedadSuelo },
];

const temperaturaSeries = [{ name: 'Temperatura', color: categorical[1], data: temperatura }];

const metricasTitulo = {
    temperatura: 'Temperatura',
    humedadAmbiente: 'Humedad ambiente',
    humedadSuelo: 'Humedad de suelo',
    co2: 'CO₂',
};

const alertas = computed(() =>
    Object.entries(resumen)
        .filter(([, m]) => m.status !== 'good')
        .map(([clave, m]) => ({
            titulo: metricasTitulo[clave],
            status: m.status,
            mensaje: `${m.statusLabel}: ${m.valor}${m.unidad}`,
        }))
);
</script>

<template>
    <Head title="Dashboard" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                <div>
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Monitoreo de invernadero
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        Datos de muestra — vista de ejemplo de un sistema de sensores. Iremos mejorando este panel.
                    </p>
                </div>

                <!-- Alertas por umbral -->
                <div
                    v-if="alertas.length"
                    class="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg border-l-4 p-4"
                    :style="{ borderLeftColor: statusColors[alertas[0].status] }"
                >
                    <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {{ alertas.length }} métrica(s) fuera de rango
                    </p>
                    <ul class="mt-2 space-y-1.5">
                        <li
                            v-for="alerta in alertas"
                            :key="alerta.titulo"
                            class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                            <StatusIcon :status="alerta.status" />
                            <span class="font-medium text-gray-800 dark:text-gray-200">{{ alerta.titulo }}:</span>
                            {{ alerta.mensaje }}
                        </li>
                    </ul>
                </div>

                <!-- Stat tiles -->
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatTile
                        title="Temperatura"
                        :value="resumen.temperatura.valor"
                        :unit="resumen.temperatura.unidad"
                        :status="resumen.temperatura.status"
                        :status-label="resumen.temperatura.statusLabel"
                        :delta="resumen.temperatura.delta"
                    />
                    <StatTile
                        title="Humedad ambiente"
                        :value="resumen.humedadAmbiente.valor"
                        :unit="resumen.humedadAmbiente.unidad"
                        :status="resumen.humedadAmbiente.status"
                        :status-label="resumen.humedadAmbiente.statusLabel"
                        :delta="resumen.humedadAmbiente.delta"
                    />
                    <StatTile
                        title="Humedad de suelo"
                        :value="resumen.humedadSuelo.valor"
                        :unit="resumen.humedadSuelo.unidad"
                        :status="resumen.humedadSuelo.status"
                        :status-label="resumen.humedadSuelo.statusLabel"
                        :delta="resumen.humedadSuelo.delta"
                    />
                    <StatTile
                        title="CO₂"
                        :value="resumen.co2.valor"
                        :unit="resumen.co2.unidad"
                        :status="resumen.co2.status"
                        :status-label="resumen.co2.statusLabel"
                        :delta="resumen.co2.delta"
                    />
                </div>

                <!-- Charts -->
                <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div class="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-5">
                        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Temperatura — últimas 24 h
                        </h4>
                        <LineChart :labels="horas" :series="temperaturaSeries" unit="°C" class="mt-4" />
                    </div>

                    <div class="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-5">
                        <div class="flex items-center justify-between">
                            <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Humedad — últimas 24 h
                            </h4>
                            <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                <span
                                    v-for="s in humedadSeries"
                                    :key="s.name"
                                    class="inline-flex items-center gap-1.5"
                                >
                                    <span
                                        class="inline-block h-2 w-2 rounded-full"
                                        :style="{ backgroundColor: pick(s.color, isDark) }"
                                    />
                                    {{ s.name }}
                                </span>
                            </div>
                        </div>
                        <LineChart :labels="horas" :series="humedadSeries" unit="%" :y-min="0" :y-max="100" class="mt-4" />
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-5">
                    <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Luminosidad promedio por zona (lux)
                    </h4>
                    <BarChart :items="luzPorZona" class="mt-4" />
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
