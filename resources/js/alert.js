import Swal from 'sweetalert2';

const isDark = () => document.documentElement.classList.contains('dark');

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

export function confirmAction({ title = '¿Confirmar?', text = '', confirmButtonText = 'Confirmar' } = {}) {
    return themed()
        .fire({
            title,
            text,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText,
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
        })
        .then((result) => result.isConfirmed);
}

export function promptText({ title, inputLabel = '', inputPlaceholder = '', confirmButtonText = 'Guardar' } = {}) {
    return themed()
        .fire({
            title,
            input: 'text',
            inputLabel,
            inputPlaceholder,
            showCancelButton: true,
            confirmButtonText,
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            inputValidator: (value) => (!value ? 'Este campo es obligatorio.' : undefined),
        })
        .then((result) => (result.isConfirmed ? result.value : null));
}
