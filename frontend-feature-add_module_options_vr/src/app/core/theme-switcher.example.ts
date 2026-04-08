/**
 * EJEMPLO: Cómo cambiar el tema de la aplicación
 *
 * El sistema de colores ahora es centralizado en colors.css
 *
 * Para cambiar el tema, simplemente cambia el atributo data-theme en HTML
 */

// Ejemplo 1: Cambiar al tema oscuro
export function enableDarkTheme() {
  document.documentElement.setAttribute('data-theme', 'dark');
  localStorage.setItem('theme', 'dark');
}

// Ejemplo 2: Cambiar al tema claro
export function enableLightTheme() {
  document.documentElement.setAttribute('data-theme', 'light');
  localStorage.setItem('theme', 'light');
}

// Ejemplo 3: Toggle entre temas
export function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  if (currentTheme === 'dark') {
    enableLightTheme();
  } else {
    enableDarkTheme();
  }
}

// Ejemplo 4: Cargar tema guardado
export function loadSavedTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
}

/**
 * USO EN COMPONENTE:
 *
 * constructor() {
 *   loadSavedTheme();
 * }
 *
 * onThemeToggle() {
 *   toggleTheme();
 * }
 *
 * Variables CSS disponibles:
 * - var(--primary)
 * - var(--surface)
 * - var(--text-primary)
 * - var(--border)
 * - var(--shadow-lg)
 * - etc...
 */
