// Datos de muestra (fijos) simulando sensores de un invernadero.
// No hay backend: sirven solo para maquetar el dashboard.

export function useInvernaderoDemo() {
    const horas = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

    const temperatura = [16, 15, 15, 16, 19, 23, 27, 29, 28, 24, 20, 18];
    const humedadAmbiente = [78, 80, 81, 79, 72, 62, 51, 45, 47, 55, 65, 73];
    const humedadSuelo = [58, 57, 56, 55, 53, 50, 47, 44, 42, 41, 44, 50];

    const luzPorZona = [
        { label: 'Zona A (Norte)', value: 12400 },
        { label: 'Zona B (Centro)', value: 18700 },
        { label: 'Zona C (Sur)', value: 21200 },
        { label: 'Techo', value: 9600 },
    ];

    const resumen = {
        temperatura: { valor: 24.8, unidad: '°C', status: 'good', statusLabel: 'Óptima', delta: '+1.2° última hora' },
        humedadAmbiente: { valor: 58, unidad: '%', status: 'good', statusLabel: 'Óptima', delta: '-3% última hora' },
        humedadSuelo: { valor: 41, unidad: '%', status: 'warning', statusLabel: 'Bajo lo ideal', delta: '-2% última hora' },
        co2: { valor: 620, unidad: ' ppm', status: 'good', statusLabel: 'Normal', delta: '+15 ppm última hora' },
    };

    return { horas, temperatura, humedadAmbiente, humedadSuelo, luzPorZona, resumen };
}
