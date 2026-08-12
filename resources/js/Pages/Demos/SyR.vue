<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import Modal from '@/Components/Modal.vue';
import InputLabel from '@/Components/InputLabel.vue';
import TextInput from '@/Components/TextInput.vue';
import InputError from '@/Components/InputError.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import SecondaryButton from '@/Components/SecondaryButton.vue';
import DangerButton from '@/Components/DangerButton.vue';
import { alertSuccess, confirmAction, confirmDelete, promptText } from '@/alert';
import { useSyrDemo } from '@/Composables/useSyrDemo';
import { Head } from '@inertiajs/vue3';
import { computed, reactive, ref } from 'vue';

const { solicitudes, crearSolicitud, asignarReemplazante, avanzarEstado, eliminarSolicitud } = useSyrDemo();

const columnas = [
    { estado: 'solicitada', titulo: 'Solicitadas', color: 'blue' },
    { estado: 'asignada', titulo: 'Reemplazante asignado', color: 'amber' },
    { estado: 'aprobada', titulo: 'Aprobadas', color: 'purple' },
    { estado: 'pagada', titulo: 'Pagadas / Cerradas', color: 'green' },
];

function porEstado(estado) {
    return solicitudes.filter((s) => s.estado === estado);
}

// Crear solicitud
const showCreateModal = ref(false);
const errors = reactive({});

const form = reactive({
    servicio: '',
    estamento: '',
    profesionalAusente: '',
    motivo: '',
    turno: '',
});

function resetForm() {
    form.servicio = '';
    form.estamento = '';
    form.profesionalAusente = '';
    form.motivo = '';
    form.turno = '';
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

    if (!form.servicio.trim()) errors.servicio = 'El servicio es obligatorio.';
    if (!form.estamento.trim()) errors.estamento = 'El estamento es obligatorio.';
    if (!form.motivo.trim()) errors.motivo = 'El motivo es obligatorio.';

    if (Object.keys(errors).length > 0) return;

    crearSolicitud({ ...form });
    alertSuccess('Solicitud de reemplazo creada.');
    closeCreateModal();
}

// Solicitada -> asignada: pide el nombre del reemplazante
async function asignar(solicitud) {
    const nombre = await promptText({
        title: 'Asignar reemplazante',
        inputLabel: `Servicio: ${solicitud.servicio}`,
        inputPlaceholder: 'Nombre del profesional reemplazante',
        confirmButtonText: 'Asignar',
    });

    if (!nombre) return;

    asignarReemplazante(solicitud.id, nombre);
    alertSuccess('Reemplazante asignado.');
}

// Resto de transiciones: solo confirmar
async function avanzar(solicitud, siguienteLabel) {
    const confirmed = await confirmAction({
        title: `¿${siguienteLabel}?`,
        text: `${solicitud.servicio} — ${solicitud.estamento}`,
        confirmButtonText: 'Confirmar',
    });

    if (!confirmed) return;

    avanzarEstado(solicitud.id);
    alertSuccess('Solicitud actualizada.');
}

async function eliminar(solicitud) {
    const confirmed = await confirmDelete({
        title: '¿Eliminar solicitud?',
        text: `${solicitud.servicio} — ${solicitud.estamento}. Esta acción no se puede deshacer.`,
    });

    if (!confirmed) return;

    eliminarSolicitud(solicitud.id);
}

const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

const total = computed(() => solicitudes.length);
</script>

<template>
    <Head title="SyR" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Suplencias y Reemplazos (demo)
                </h2>
                <PrimaryButton @click="openCreateModal">Nueva solicitud</PrimaryButton>
            </div>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    Demo sin base de datos: los datos se guardan solo en este navegador
                    (<code>sessionStorage</code>) y se pierden al cerrar la pestaña.
                    <span v-if="total"> {{ total }} solicitud(es) en esta sesión.</span>
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
                                v-for="solicitud in porEstado(columna.estado)"
                                :key="solicitud.id"
                                class="rounded-md border border-gray-200 dark:border-gray-700 p-3 text-sm"
                            >
                                <p class="font-semibold text-gray-900 dark:text-gray-100">{{ solicitud.servicio }}</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">{{ solicitud.estamento }}</p>
                                <p v-if="solicitud.profesionalAusente" class="mt-1 text-gray-700 dark:text-gray-300">
                                    Ausente: {{ solicitud.profesionalAusente }}
                                </p>
                                <p v-if="solicitud.turno" class="text-gray-700 dark:text-gray-300">
                                    Turno: {{ solicitud.turno }}
                                </p>
                                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ solicitud.motivo }}</p>
                                <p
                                    v-if="solicitud.reemplazante"
                                    class="mt-1 text-xs font-medium text-indigo-600 dark:text-indigo-400"
                                >
                                    Reemplazante: {{ solicitud.reemplazante }}
                                </p>

                                <div class="mt-3 flex items-center gap-2">
                                    <SecondaryButton
                                        v-if="columna.estado === 'solicitada'"
                                        class="!text-xs"
                                        @click="asignar(solicitud)"
                                    >
                                        Asignar reemplazante
                                    </SecondaryButton>
                                    <SecondaryButton
                                        v-else-if="columna.estado === 'asignada'"
                                        class="!text-xs"
                                        @click="avanzar(solicitud, 'Aprobar reemplazo')"
                                    >
                                        Aprobar
                                    </SecondaryButton>
                                    <SecondaryButton
                                        v-else-if="columna.estado === 'aprobada'"
                                        class="!text-xs"
                                        @click="avanzar(solicitud, 'Pagar y cerrar')"
                                    >
                                        Pagar / cerrar
                                    </SecondaryButton>
                                    <DangerButton class="!text-xs" @click="eliminar(solicitud)">
                                        Eliminar
                                    </DangerButton>
                                </div>
                            </div>

                            <p v-if="!porEstado(columna.estado).length" class="text-xs text-gray-400 italic">
                                Sin solicitudes
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal: nueva solicitud -->
        <Modal :show="showCreateModal" @close="closeCreateModal">
            <form @submit.prevent="submitCreate" class="p-6">
                <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Nueva solicitud de reemplazo</h2>

                <div class="mt-6">
                    <InputLabel for="servicio" value="Servicio" />
                    <TextInput
                        id="servicio"
                        v-model="form.servicio"
                        type="text"
                        class="mt-1 block w-full"
                        autofocus
                        placeholder="Ej: UCI, Pabellón, Urgencia"
                    />
                    <InputError :message="errors.servicio" class="mt-2" />
                </div>

                <div class="mt-4">
                    <InputLabel for="estamento" value="Estamento requerido" />
                    <TextInput
                        id="estamento"
                        v-model="form.estamento"
                        type="text"
                        class="mt-1 block w-full"
                        placeholder="Ej: Enfermera, TENS, Médico, Kinesiólogo"
                    />
                    <InputError :message="errors.estamento" class="mt-2" />
                </div>

                <div class="mt-4">
                    <InputLabel for="profesionalAusente" value="Profesional que se ausenta (opcional)" />
                    <TextInput
                        id="profesionalAusente"
                        v-model="form.profesionalAusente"
                        type="text"
                        class="mt-1 block w-full"
                    />
                </div>

                <div class="mt-4">
                    <InputLabel for="turno" value="Turno / fecha (opcional)" />
                    <TextInput
                        id="turno"
                        v-model="form.turno"
                        type="text"
                        class="mt-1 block w-full"
                        placeholder="Ej: Noche 12/08"
                    />
                </div>

                <div class="mt-4">
                    <InputLabel for="motivo" value="Motivo" />
                    <TextInput
                        id="motivo"
                        v-model="form.motivo"
                        type="text"
                        class="mt-1 block w-full"
                        placeholder="Ej: Licencia médica"
                    />
                    <InputError :message="errors.motivo" class="mt-2" />
                </div>

                <div class="mt-6 flex justify-end gap-3">
                    <SecondaryButton @click="closeCreateModal">Cancelar</SecondaryButton>
                    <PrimaryButton>Crear</PrimaryButton>
                </div>
            </form>
        </Modal>
    </AuthenticatedLayout>
</template>
