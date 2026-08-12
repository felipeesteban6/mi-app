// Paleta validada (ver skill de dataviz) — light/dark por rol.
export const categorical = [
    { light: '#2a78d6', dark: '#3987e5' }, // 1 blue
    { light: '#eb6834', dark: '#d95926' }, // 2 orange
    { light: '#1baf7a', dark: '#199e70' }, // 3 aqua
    { light: '#eda100', dark: '#c98500' }, // 4 yellow
];

export const status = {
    good: '#0ca30c',
    warning: '#fab219',
    serious: '#ec835a',
    critical: '#d03b3b',
};

export const chrome = {
    gridline: { light: '#e1e0d9', dark: '#2c2c2a' },
    axis: { light: '#c3c2b7', dark: '#383835' },
    muted: { light: '#898781', dark: '#898781' },
    textSecondary: { light: '#52514e', dark: '#c3c2b7' },
};

export function pick(role, isDark) {
    return isDark ? role.dark : role.light;
}
