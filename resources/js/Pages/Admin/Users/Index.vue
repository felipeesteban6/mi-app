<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import { Head, useForm, usePage } from '@inertiajs/vue3';
import { reactive } from 'vue';

const props = defineProps({
    users: Array,
    roles: Array,
});

const page = usePage();

const selections = reactive(
    Object.fromEntries(
        props.users.map((user) => [user.id, user.roles.map((role) => role.name)])
    )
);

const forms = reactive(Object.fromEntries(props.users.map((user) => [user.id, useForm({ roles: [] })])));

function submit(userId) {
    forms[userId].roles = selections[userId];
    forms[userId].patch(route('admin.users.roles.update', userId), {
        preserveScroll: true,
    });
}
</script>

<template>
    <Head title="Usuarios y roles" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                Usuarios y roles
            </h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div
                    v-if="page.props.flash?.success"
                    class="mb-4 rounded-md bg-green-100 dark:bg-green-900 px-4 py-3 text-sm text-green-800 dark:text-green-200"
                >
                    {{ page.props.flash.success }}
                </div>

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
                                        <div class="flex flex-wrap gap-3">
                                            <label
                                                v-for="role in roles"
                                                :key="role"
                                                class="inline-flex items-center gap-1"
                                            >
                                                <input
                                                    type="checkbox"
                                                    :value="role"
                                                    v-model="selections[user.id]"
                                                    class="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                                />
                                                <span>{{ role }}</span>
                                            </label>
                                        </div>
                                    </td>
                                    <td class="py-3 pr-4">
                                        <PrimaryButton
                                            :disabled="forms[user.id].processing"
                                            @click="submit(user.id)"
                                        >
                                            Guardar
                                        </PrimaryButton>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
