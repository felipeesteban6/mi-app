<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import Modal from '@/Components/Modal.vue';
import InputLabel from '@/Components/InputLabel.vue';
import TextInput from '@/Components/TextInput.vue';
import InputError from '@/Components/InputError.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import SecondaryButton from '@/Components/SecondaryButton.vue';
import DangerButton from '@/Components/DangerButton.vue';
import { alertSuccess, confirmAction, confirmDelete } from '@/alert';
import { useRecetasDemo } from '@/Composables/useRecetasDemo';
import { Head } from '@inertiajs/vue3';
import { computed, reactive, ref } from 'vue';

const { recetas, crearReceta, avanzarEstado, eliminarReceta } = useRecetasDemo();

const columnas = [
    { estado: 'creada', titulo: 'Creadas', accion: 'Validar', color: 'blue' },
    { estado: 'validada', titulo: 'Validadas', accion: 'Preparar entrega', color: 'amber' },
    { estado: 'preparada', titulo: 'Preparadas para entrega', accion: 'Confirmar recepción', color: 'purple' },
    { estado: 'recibida', titulo: 'Recibidas', accion: null, color: 'green' },
];

function porEstado(estado) {
    return recetas.filter((r) => r.estado === estado);
}

// Crear receta
const showCreateModal = ref(false);
const errors = reactive({});

const form = reactive({
    paciente: '',
    rut: '',
    medicamento: '',
    dosis: '',
    indicaciones: '',
});

function resetForm() {
    form.paciente = '';
    form.rut = '';
    form.medicamento = '';
    form.dosis = '';
    form.indicaciones = '';
    Object.keys(errors).forEach((key) => delete errors[key]);
}

function openCreateModal() {
    resetForm();
    showCreateModal.value = true;
}

function closeCreateModal() {
    showCreateModal.value = false;
    resetForm();
}

function submitCreate() {
    Object.keys(errors).forEach((key) => delete errors[key]);

    if (!form.paciente.trim()) errors.paciente = 'El paciente es obligatorio.';
    if (!form.medicamento.trim()) errors.medicamento = 'El medicamento es obligatorio.';
    if (!form.dosis.trim()) errors.dosis = 'La dosis es obligatoria.';

    if (Object.keys(errors).length > 0) return;

    crearReceta({ ...form });
    alertSuccess('Receta creada correctamente.');
    closeCreateModal();
}

async function avanzar(receta, siguienteLabel) {
    const confirmed = await confirmAction({
        title: `¿${siguienteLabel}?`,
        text: `Receta de ${receta.paciente} — ${receta.medicamento}`,
        confirmButtonText: 'Confirmar',
    });

    if (!confirmed) return;

    avanzarEstado(receta.id);
    alertSuccess('Receta actualizada.');
}

async function eliminar(receta) {
    const confirmed = await confirmDelete({
        title: '¿Eliminar receta?',
        text: `Receta de ${receta.paciente} — ${receta.medicamento}. Esta acción no se puede deshacer.`,
    });

    if (!confirmed) return;

    eliminarReceta(receta.id);
}

const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

const total = computed(() => recetas.length);
</script>

<template>
    <Head title="Recetas" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Recetas (demo)
                </h2>
                <PrimaryButton @click="openCreateModal">Nueva receta</PrimaryButton>
            </div>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    Demo sin base de datos: los datos se guardan solo en este navegador
                    (<code>sessionStorage</code>) y se pierden al cerrar la pestaña.
                    <span v-if="total"> {{ total }} receta(s) en esta sesión.</span>
                </p>

                <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div
                        v-for="columna in columnas"
                        :key="columna.estado"
                        class="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg"
                    >
                        <div class="border-b border-gray-100 dark:border-gray-700 px-4 py-3">
                            <span
                                class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                                :class="colorClasses[columna.color]"
                            >
                                {{ columna.titulo }}
                            </span>
                            <span class="ms-2 text-xs text-gray-400">{{ porEstado(columna.estado).length }}</span>
                        </div>

                        <div class="p-3 space-y-3 min-h-24">
                            <div
                                v-for="receta in porEstado(columna.estado)"
                                :key="receta.id"
                                class="rounded-md border border-gray-200 dark:border-gray-700 p-3 text-sm"
                            >
                                <p class="font-semibold text-gray-900 dark:text-gray-100">{{ receta.paciente }}</p>
                                <p v-if="receta.rut" class="text-xs text-gray-500 dark:text-gray-400">
                                    RUT: {{ receta.rut }}
                                </p>
                                <p class="mt-1 text-gray-700 dark:text-gray-300">
                                    {{ receta.medicamento }} — {{ receta.dosis }}
                                </p>
                                <p v-if="receta.indicaciones" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    {{ receta.indicaciones }}
                                </p>

                                <div class="mt-3 flex items-center gap-2">
                                    <SecondaryButton
                                        v-if="columna.accion"
                                        class="!text-xs"
                                        @click="avanzar(receta, columna.accion)"
                                    >
                                        {{ columna.accion }}
                                    </SecondaryButton>
                                    <DangerButton class="!text-xs" @click="eliminar(receta)">Eliminar</DangerButton>
                                </div>
                            </div>

                            <p v-if="!porEstado(columna.estado).length" class="text-xs text-gray-400 italic">
                                Sin recetas
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal: nueva receta -->
        <Modal :show="showCreateModal" @close="closeCreateModal">
            <form @submit.prevent="submitCreate" class="p-6">
                <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Nueva receta</h2>

                <div class="mt-6">
                    <InputLabel for="paciente" value="Paciente" />
                    <TextInput
                        id="paciente"
                        v-model="form.paciente"
                        type="text"
                        class="mt-1 block w-full"
                        autofocus
                    />
                    <InputError :message="errors.paciente" class="mt-2" />
                </div>

                <div class="mt-4">
                    <InputLabel for="rut" value="RUT (opcional)" />
                    <TextInput id="rut" v-model="form.rut" type="text" class="mt-1 block w-full" />
                </div>

                <div class="mt-4">
                    <InputLabel for="medicamento" value="Medicamento" />
                    <TextInput id="medicamento" v-model="form.medicamento" type="text" class="mt-1 block w-full" />
                    <InputError :message="errors.medicamento" class="mt-2" />
                </div>

                <div class="mt-4">
                    <InputLabel for="dosis" value="Dosis" />
                    <TextInput id="dosis" v-model="form.dosis" type="text" class="mt-1 block w-full" />
                    <InputError :message="errors.dosis" class="mt-2" />
                </div>

                <div class="mt-4">
                    <InputLabel for="indicaciones" value="Indicaciones (opcional)" />
                    <TextInput id="indicaciones" v-model="form.indicaciones" type="text" class="mt-1 block w-full" />
                </div>

                <div class="mt-6 flex justify-end gap-3">
                    <SecondaryButton @click="closeCreateModal">Cancelar</SecondaryButton>
                    <PrimaryButton>Crear</PrimaryButton>
                </div>
            </form>
        </Modal>
    </AuthenticatedLayout>
</template>
