<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import Modal from '@/Components/Modal.vue';
import InputLabel from '@/Components/InputLabel.vue';
import TextInput from '@/Components/TextInput.vue';
import InputError from '@/Components/InputError.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import SecondaryButton from '@/Components/SecondaryButton.vue';
import DangerButton from '@/Components/DangerButton.vue';
import Checkbox from '@/Components/Checkbox.vue';
import { alertError, alertSuccess, confirmDelete } from '@/alert';
import { Head, router, useForm, usePage } from '@inertiajs/vue3';
import { ref, watch } from 'vue';

const props = defineProps({
    users: Array,
    roles: Array,
});

const page = usePage();

watch(
    () => page.props.flash?.success,
    (message) => {
        if (message) alertSuccess(message);
    }
);

watch(
    () => page.props.flash?.error,
    (message) => {
        if (message) alertError(message);
    }
);

// Crear usuario
const showCreateModal = ref(false);

const createForm = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    roles: [],
});

function openCreateModal() {
    createForm.reset();
    createForm.clearErrors();
    showCreateModal.value = true;
}

function closeCreateModal() {
    showCreateModal.value = false;
    createForm.reset();
    createForm.clearErrors();
}

function submitCreate() {
    createForm.post(route('admin.users.store'), {
        preserveScroll: true,
        onSuccess: () => closeCreateModal(),
    });
}

// Editar roles
const showEditModal = ref(false);
const editingUser = ref(null);

const editForm = useForm({
    roles: [],
});

function openEditModal(user) {
    editingUser.value = user;
    editForm.reset();
    editForm.clearErrors();
    editForm.roles = user.roles.map((role) => role.name);
    showEditModal.value = true;
}

function closeEditModal() {
    showEditModal.value = false;
    editingUser.value = null;
    editForm.reset();
    editForm.clearErrors();
}

function submitEdit() {
    editForm.patch(route('admin.users.roles.update', editingUser.value.id), {
        preserveScroll: true,
        onSuccess: () => closeEditModal(),
    });
}

// Eliminar usuario
async function destroyUser(user) {
    const confirmed = await confirmDelete({
        title: `¿Eliminar a "${user.name}"?`,
        text: 'Esta acción no se puede deshacer.',
    });

    if (!confirmed) return;

    router.delete(route('admin.users.destroy', user.id), { preserveScroll: true });
}
</script>

<template>
    <Head title="Usuarios y roles" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Usuarios y roles
                </h2>
                <PrimaryButton @click="openCreateModal">Crear usuario</PrimaryButton>
            </div>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6 text-gray-900 dark:text-gray-100">
                        <table class="w-full text-left text-sm">
                            <thead>
                                <tr class="border-b border-gray-200 dark:border-gray-700">
                                    <th class="py-2 pr-4">Nombre</th>
                                    <th class="py-2 pr-4">Email</th>
                                    <th class="py-2 pr-4">Roles</th>
                                    <th class="py-2 pr-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="user in users"
                                    :key="user.id"
                                    class="border-b border-gray-100 dark:border-gray-700"
                                >
                                    <td class="py-3 pr-4">{{ user.name }}</td>
                                    <td class="py-3 pr-4">{{ user.email }}</td>
                                    <td class="py-3 pr-4">
                                        <div class="flex flex-wrap gap-1">
                                            <span
                                                v-for="role in user.roles"
                                                :key="role.id"
                                                class="inline-flex items-center rounded-full bg-indigo-100 dark:bg-indigo-900 px-2 py-0.5 text-xs font-medium text-indigo-800 dark:text-indigo-200"
                                            >
                                                {{ role.name }}
                                            </span>
                                            <span v-if="!user.roles.length" class="text-xs text-gray-400">
                                                Sin roles
                                            </span>
                                        </div>
                                    </td>
                                    <td class="py-3 pr-4">
                                        <div class="flex gap-2">
                                            <SecondaryButton @click="openEditModal(user)">Editar</SecondaryButton>
                                            <DangerButton @click="destroyUser(user)">Eliminar</DangerButton>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal: crear usuario -->
        <Modal :show="showCreateModal" @close="closeCreateModal">
            <form @submit.prevent="submitCreate" class="p-6">
                <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Crear usuario</h2>

                <div class="mt-6">
                    <InputLabel for="create_name" value="Nombre" />
                    <TextInput
                        id="create_name"
                        v-model="createForm.name"
                        type="text"
                        class="mt-1 block w-full"
                        required
                        autofocus
                    />
                    <InputError :message="createForm.errors.name" class="mt-2" />
                </div>

                <div class="mt-4">
                    <InputLabel for="create_email" value="Email" />
                    <TextInput
                        id="create_email"
                        v-model="createForm.email"
                        type="email"
                        class="mt-1 block w-full"
                        required
                    />
                    <InputError :message="createForm.errors.email" class="mt-2" />
                </div>

                <div class="mt-4">
                    <InputLabel for="create_password" value="Contraseña" />
                    <TextInput
                        id="create_password"
                        v-model="createForm.password"
                        type="password"
                        class="mt-1 block w-full"
                        required
                    />
                    <InputError :message="createForm.errors.password" class="mt-2" />
                </div>

                <div class="mt-4">
                    <InputLabel for="create_password_confirmation" value="Confirmar contraseña" />
                    <TextInput
                        id="create_password_confirmation"
                        v-model="createForm.password_confirmation"
                        type="password"
                        class="mt-1 block w-full"
                        required
                    />
                </div>

                <div class="mt-4">
                    <InputLabel value="Roles" />
                    <div class="mt-2 flex flex-wrap gap-3">
                        <label v-for="role in roles" :key="role" class="inline-flex items-center gap-2 text-sm">
                            <Checkbox :value="role" v-model:checked="createForm.roles" />
                            <span>{{ role }}</span>
                        </label>
                    </div>
                </div>

                <div class="mt-6 flex justify-end gap-3">
                    <SecondaryButton @click="closeCreateModal">Cancelar</SecondaryButton>
                    <PrimaryButton :disabled="createForm.processing">Crear</PrimaryButton>
                </div>
            </form>
        </Modal>

        <!-- Modal: editar roles de usuario -->
        <Modal :show="showEditModal" @close="closeEditModal">
            <form v-if="editingUser" @submit.prevent="submitEdit" class="p-6">
                <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Editar usuario: {{ editingUser.name }}
                </h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ editingUser.email }}</p>

                <div class="mt-6">
                    <InputLabel value="Roles" />
                    <div class="mt-2 flex flex-wrap gap-3">
                        <label v-for="role in roles" :key="role" class="inline-flex items-center gap-2 text-sm">
                            <Checkbox :value="role" v-model:checked="editForm.roles" />
                            <span>{{ role }}</span>
                        </label>
                    </div>
                    <InputError :message="editForm.errors.roles" class="mt-2" />
                </div>

                <div class="mt-6 flex justify-end gap-3">
                    <SecondaryButton @click="closeEditModal">Cancelar</SecondaryButton>
                    <PrimaryButton :disabled="editForm.processing">Guardar</PrimaryButton>
                </div>
            </form>
        </Modal>
    </AuthenticatedLayout>
</template>
