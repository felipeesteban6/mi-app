import Swal from 'sweetalert2';

const isDark = () => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;

const themed = () =>
    Swal.mixin({
        background: isDark() ? '#1f2937' : '#ffffff',
        color: isDark() ? '#f3f4f6' : '#111827',
        confirmButtonColor: '#4f46e5',
        cancelButtonColor: '#6b7280',
    });

export function alertSuccess(message) {
    return themed().fire({
        icon: 'success',
        title: message,
        toast: true,
        position: 'top-end',
        timer: 2500,
        showConfirmButton: false,
    });
}

export function alertError(message) {
    return themed().fire({
        icon: 'error',
        title: message,
        toast: true,
        position: 'top-end',
        timer: 3500,
        showConfirmButton: false,
    });
}

export function confirmDelete({ title = '¿Estás seguro?', text = '', confirmButtonText = 'Eliminar' } = {}) {
    return themed()
        .fire({
            title,
            text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText,
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc2626',
            reverseButtons: true,
        })
        .then((result) => result.isConfirmed);
}
