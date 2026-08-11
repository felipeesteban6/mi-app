import { reactive, watch } from 'vue';

const STORAGE_KEY = 'demo_recetas';

const ESTADOS = ['creada', 'validada', 'preparada', 'recibida'];

const ESTADO_LABEL = {
    creada: 'Creada',
    validada: 'Validada',
    preparada: 'Preparada para entrega',
    recibida: 'Recibida',
};

function load() {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

const recetas = reactive(load());

watch(
    recetas,
    (value) => {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    },
    { deep: true }
);

function nextId() {
    return recetas.reduce((max, r) => Math.max(max, r.id), 0) + 1;
}

function crearReceta({ paciente, rut, medicamento, dosis, indicaciones }) {
    recetas.unshift({
        id: nextId(),
        paciente,
        rut,
        medicamento,
        dosis,
        indicaciones,
        estado: 'creada',
        historial: [{ estado: 'creada', at: new Date().toISOString() }],
    });
}

function avanzarEstado(id) {
    const receta = recetas.find((r) => r.id === id);
    if (!receta) return;

    const index = ESTADOS.indexOf(receta.estado);
    if (index === -1 || index === ESTADOS.length - 1) return;

    receta.estado = ESTADOS[index + 1];
    receta.historial.push({ estado: receta.estado, at: new Date().toISOString() });
}

function eliminarReceta(id) {
    const index = recetas.findIndex((r) => r.id === id);
    if (index !== -1) recetas.splice(index, 1);
}

export function useRecetasDemo() {
    return {
        recetas,
        ESTADOS,
        ESTADO_LABEL,
        crearReceta,
        avanzarEstado,
        eliminarReceta,
    };
}
