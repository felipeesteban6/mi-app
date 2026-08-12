import { reactive, watch } from 'vue';

const STORAGE_KEY = 'demo_syr';

const ESTADOS = ['solicitada', 'asignada', 'aprobada', 'pagada'];

function load() {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

const solicitudes = reactive(load());

watch(
    solicitudes,
    (value) => {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    },
    { deep: true }
);

function nextId() {
    return solicitudes.reduce((max, s) => Math.max(max, s.id), 0) + 1;
}

function crearSolicitud({ servicio, estamento, profesionalAusente, reemplazante, motivo, turno }) {
    solicitudes.unshift({
        id: nextId(),
        servicio,
        estamento,
        profesionalAusente,
        reemplazante: reemplazante || '',
        motivo,
        turno,
        estado: 'solicitada',
        historial: [{ estado: 'solicitada', at: new Date().toISOString() }],
    });
}

function asignarReemplazante(id, reemplazante) {
    const solicitud = solicitudes.find((s) => s.id === id);
    if (!solicitud) return;

    solicitud.reemplazante = reemplazante;
    solicitud.estado = 'asignada';
    solicitud.historial.push({ estado: 'asignada', at: new Date().toISOString() });
}

function avanzarEstado(id) {
    const solicitud = solicitudes.find((s) => s.id === id);
    if (!solicitud) return;

    const index = ESTADOS.indexOf(solicitud.estado);
    if (index === -1 || index === ESTADOS.length - 1) return;

    solicitud.estado = ESTADOS[index + 1];
    solicitud.historial.push({ estado: solicitud.estado, at: new Date().toISOString() });
}

function eliminarSolicitud(id) {
    const index = solicitudes.findIndex((s) => s.id === id);
    if (index !== -1) solicitudes.splice(index, 1);
}

export function useSyrDemo() {
    return {
        solicitudes,
        crearSolicitud,
        asignarReemplazante,
        avanzarEstado,
        eliminarSolicitud,
    };
}
