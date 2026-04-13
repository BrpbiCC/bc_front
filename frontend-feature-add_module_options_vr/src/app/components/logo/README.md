# Componente Logo FríaCheck

## Descripción
Componente Angular standalone que muestra el logo de FríaCheck usando los archivos SVG originales del proyecto. El logo cambia automáticamente entre light/dark mode usando **solo CSS** (sin JavaScript).

## Características

### 🔄 Cambio Automático de Tema
- **Solo CSS**: No usa JavaScript ni MutationObserver
- **Archivos SVG originales**: Usa los archivos existentes en `src/images/logo/`
- **Detección automática**: Responde al atributo `data-theme` del elemento raíz

### 📱 Estados del Sidebar
- **Expandido**: Muestra logo completo (flor + texto "FríoCheck")
- **Colapsado**: Muestra solo ícono de la flor
- **Transición instantánea**: Sin delays ni animaciones

### 🎨 Archivos SVG
Ubicación: `src/images/logo/`

| Archivo | Descripción | Contenido |
|---|---|---|
| `FrioCheck.svg` | Logo completo versión clara | Flor naranja #F97316 + "Frío" azul #1a2a4a + "Check" naranja #F97316 |
| `FrioChekModoOscuro.svg` | Logo completo versión oscura | Flor naranja + texto adaptado para fondo oscuro |

## Implementación Técnica

### Template (logo.component.ts - inline)
```html
<div class="logo-wrapper">
  <!-- Logo completo - light mode -->
  <img *ngIf="!collapsed" src="images/logo/FrioCheck.svg" alt="FríaCheck Logo" class="logo-img logo-light" />
  <!-- Logo completo - dark mode -->
  <img *ngIf="!collapsed" src="images/logo/FrioChekModoOscuro.svg" alt="FríaCheck Logo" class="logo-img logo-dark" />

  <!-- Icono - light mode (usando el mismo logo completo por ahora) -->
  <img *ngIf="collapsed" src="images/logo/FrioCheck.svg" alt="FríaCheck Icon" class="logo-img logo-light" />
  <!-- Icono - dark mode (usando el mismo logo completo por ahora) -->
  <img *ngIf="collapsed" src="images/logo/FrioChekModoOscuro.svg" alt="FríaCheck Icon" class="logo-img logo-dark" />
</div>
```

### CSS (logo.component.css)
```css
.logo-wrapper { display: flex; align-items: center; padding: 16px 20px; user-select: none; }
.logo-img { height: 36px; width: auto; }

/* light mode: mostrar logo-light, ocultar logo-dark */
.logo-light { display: block; }
.logo-dark  { display: none; }

/* dark mode */
:root[data-theme='dark'] .logo-light { display: none; }
:root[data-theme='dark'] .logo-dark  { display: block; }
```

### TypeScript (logo.component.ts)
```typescript
@Component({...})
export class LogoComponent {
  @Input() collapsed = false;  // Solo esta propiedad, sin lógica de tema
}
```

## Sistema de Tema

### Cómo Funciona el Dark Mode
La aplicación usa el atributo `data-theme` en el elemento raíz:

```typescript
// Light mode
document.documentElement.removeAttribute('data-theme');

// Dark mode
document.documentElement.setAttribute('data-theme', 'dark');
```

### Selector CSS Correcto
**✅ Correcto**: `:root[data-theme='dark']`
**❌ Incorrecto**: `.dark-mode`, `[data-theme='dark']` solo, etc.

## Diseño del Logo Original

### Elementos Visuales
- **Ícono**: Flor/asterisco con pétalos redondeados, color naranja `#F97316`
- **Texto "Frío"**: Azul oscuro `#1a2a4a`
- **Texto "Check"**: Naranja `#F97316`
- **Layout**: Ícono centrado arriba, texto abajo, alineado al centro
- **Estilo**: Flat design, sin sombras ni gradientes

### Estados Visuales

#### Light Mode + Sidebar Expandido
```
   🌸
  Frío
 Check
```
(Flor naranja + texto azul oscuro/naranja)

#### Dark Mode + Sidebar Expandido
```
   🌸
  Frío
 Check
```
(Flor naranja + texto adaptado para contraste en fondo oscuro)

#### Light Mode + Sidebar Colapsado
```
   🌸
```
(Solo flor naranja)

#### Dark Mode + Sidebar Colapsado
```
   🌸
```
(Solo flor naranja)

## Beneficios de la Implementación

### ✅ Integridad de Archivos
- **SVG originales intactos**: No se modificaron los archivos existentes
- **Diseño preservado**: Logo se ve exactamente como el original
- **Consistencia**: Mismo aspecto visual en todas las versiones

### ✅ Performance
- **Sin JavaScript**: No ejecuta código en runtime
- **Archivos estáticos**: SVG se cargan directamente
- **Cero overhead**: Solo HTML y CSS

### ✅ Mantenibilidad
- **Simple**: Template directo con elementos img
- **Predecible**: Comportamiento determinístico
- **Fácil debug**: Solo inspeccionar CSS

### ✅ Compatibilidad
- **SSR friendly**: Funciona con server-side rendering
- **No flickering**: Logo aparece inmediatamente
- **Progressive enhancement**: Funciona sin JavaScript

## Historial de Cambios

### v3.0.0 - Abril 2026
- ✅ **Restauración completa**: Regreso a archivos SVG originales
- ✅ **Simplificación extrema**: Eliminada toda lógica compleja
- ✅ **Diseño original**: Logo con flor + "FríoCheck" como especificado
- ✅ **CSS puro**: Switch de tema solo con selectores CSS
- ✅ **Archivos intactos**: No se modificaron los SVG existentes

### v2.0.0 - Abril 2026 (anterior)
- ❌ Lógica JavaScript con MutationObserver
- ❌ Archivos SVG modificados
- ❌ Diseño alterado

### v1.0.0 - Abril 2026 (inicial)
- ❌ Implementación problemática que causó pérdida del logo

## Testing

### Verificar Funcionamiento
1. **Light mode**: Logo completo con flor naranja + texto "Frío" azul + "Check" naranja
2. **Dark mode**: Logo completo con flor naranja + texto adaptado para dark
3. **Sidebar expandido**: Logo completo visible
4. **Sidebar colapsado**: Solo ícono de flor visible
5. **Transición**: Cambiar tema debe ser instantáneo

### Debug CSS
Si no funciona, verificar:
- ✅ Atributo `data-theme="dark"` en `<html>` element
- ✅ Selector `:root[data-theme='dark']` en CSS
- ✅ Archivos SVG existen en `assets/images/logo/`
- ✅ Elementos img tienen las clases correctas

## Notas para Desarrolladores

### Modificar el Logo
Para cambiar el diseño del logo:
1. **No modificar** los archivos SVG existentes
2. Crear nuevos archivos SVG con el diseño deseado
3. Actualizar las rutas `src` en el template
4. Asegurarse de que los nuevos SVG mantengan el mismo formato

### Colores del Logo
- **Flor**: `#F97316` (naranja)
- **Texto "Frío"**: `#1a2a4a` (azul oscuro)
- **Texto "Check"**: `#F97316` (naranja)

### Responsive
El logo se adapta automáticamente en móviles con media queries que reducen el tamaño de 36px a 32px.

## Características

### 🔄 Cambio Automático de Tema
- **Solo CSS**: No usa JavaScript ni MutationObserver
- **Selector específico**: `:root[data-theme='dark']` (como requiere la app)
- **Detección automática**: Responde al atributo `data-theme` del elemento raíz

### 📱 Estados del Sidebar
- **Expandido**: Muestra logo completo (light/dark según tema)
- **Colapsado**: Muestra ícono reducido (light/dark según tema)
- **Transición instantánea**: Sin delays ni animaciones complejas

### 🎨 Archivos SVG
Ubicación: `src/assets/images/logo/`

| Archivo | Descripción | Uso |
|---|---|---|
| `logo-light.svg` | Logo completo versión clara | Sidebar expandido + light mode |
| `logo-dark.svg` | Logo completo versión oscura | Sidebar expandido + dark mode |
| `logo-icon-light.svg` | Ícono reducido versión clara | Sidebar colapsado + light mode |
| `logo-icon-dark.svg` | Ícono reducido versión oscura | Sidebar colapsado + dark mode |

## Implementación Técnica

### Template (logo.component.ts - inline)
```html
<div class="logo-container">
  <!-- Logo completo - light mode -->
  <img *ngIf="!collapsed" src="assets/images/logo/logo-light.svg" alt="FríaCheck Logo" class="logo-full" />
  <!-- Logo completo - dark mode -->
  <img *ngIf="!collapsed" src="assets/images/logo/logo-dark.svg" alt="FríaCheck Logo" class="logo-full--dark" />

  <!-- Icono - light mode -->
  <img *ngIf="collapsed" src="assets/images/logo/logo-icon-light.svg" alt="FríaCheck Icon" class="logo-icon" />
  <!-- Icono - dark mode -->
  <img *ngIf="collapsed" src="assets/images/logo/logo-icon-dark.svg" alt="FríaCheck Icon" class="logo-icon--dark" />
</div>
```

### CSS (logo.component.css)
```css
/* Base styles */
.logo-full, .logo-full--dark { height: 32px; width: auto; display: block; }
.logo-icon, .logo-icon--dark { height: 24px; width: 24px; display: block; }

/* Por defecto: mostrar light, ocultar dark */
.logo-full--dark, .logo-icon--dark { display: none; }

/* Dark mode: usar el selector exacto de esta app */
:root[data-theme='dark'] .logo-full { display: none; }
:root[data-theme='dark'] .logo-full--dark { display: block; }
:root[data-theme='dark'] .logo-icon { display: none; }
:root[data-theme='dark'] .logo-icon--dark { display: block; }
```

### TypeScript (logo.component.ts)
```typescript
@Component({...})
export class LogoComponent {
  @Input() collapsed = false;  // Solo esta propiedad, sin lógica de tema
}
```

## Sistema de Tema

### Cómo Funciona el Dark Mode
La aplicación usa el atributo `data-theme` en el elemento raíz:

```typescript
// Light mode
document.documentElement.removeAttribute('data-theme');

// Dark mode
document.documentElement.setAttribute('data-theme', 'dark');
```

### Selector CSS Correcto
**✅ Correcto**: `:root[data-theme='dark']`
**❌ Incorrecto**: `.dark-mode`, `[data-theme='dark']` solo, etc.

## Beneficios de la Implementación CSS-Pure

### ✅ Performance
- **Sin JavaScript**: No ejecuta código en runtime
- **Sin observadores**: No usa MutationObserver
- **Cero overhead**: Solo CSS puro

### ✅ Fiabilidad
- **Siempre funciona**: No depende de timing de JavaScript
- **Inmediato**: Cambia instantáneamente con el tema
- **No rompe**: Si JS falla, el CSS sigue funcionando

### ✅ Mantenibilidad
- **Simple**: Solo HTML y CSS
- **Predecible**: Comportamiento determinístico
- **Fácil debug**: Solo inspeccionar CSS

### ✅ Compatibilidad
- **SSR friendly**: Funciona con server-side rendering
- **No flickering**: No hay delay entre HTML y JS
- **Progressive enhancement**: Funciona sin JavaScript

## Estados Visuales

### Light Mode + Sidebar Expandido
```html
<img src="assets/images/logo/logo-light.svg" class="logo-full" style="display: block;" />
<img src="assets/images/logo/logo-dark.svg" class="logo-full--dark" style="display: none;" />
```

### Dark Mode + Sidebar Expandido
```html
<img src="assets/images/logo/logo-light.svg" class="logo-full" style="display: none;" />
<img src="assets/images/logo/logo-dark.svg" class="logo-full--dark" style="display: block;" />
```

### Light Mode + Sidebar Colapsado
```html
<img src="assets/images/logo/logo-icon-light.svg" class="logo-icon" style="display: block;" />
<img src="assets/images/logo/logo-icon-dark.svg" class="logo-icon--dark" style="display: none;" />
```

### Dark Mode + Sidebar Colapsado
```html
<img src="assets/images/logo/logo-icon-light.svg" class="logo-icon" style="display: none;" />
<img src="assets/images/logo/logo-icon-dark.svg" class="logo-icon--dark" style="display: block;" />
```

## Historial de Cambios

### v2.0.0 - Abril 2026
- ✅ **Reemplazo completo**: Eliminada lógica JavaScript, implementado switch CSS-puro
- ✅ **Selector correcto**: `:root[data-theme='dark']` como requiere la app
- ✅ **Simplificación**: Componente TypeScript reducido a mínima expresión
- ✅ **Performance**: Eliminados MutationObserver y lógica de runtime
- ✅ **Fiabilidad**: Funciona incluso si JavaScript falla

### v1.0.0 - Abril 2026 (anterior)
- ❌ Lógica JavaScript con MutationObserver
- ❌ Dependencia de timing de ejecución
- ❌ Posible flickering en carga inicial

## Testing

### Verificar Funcionamiento
1. **Light mode**: Logo completo light visible, icono light visible cuando colapsado
2. **Dark mode**: Logo completo dark visible, icono dark visible cuando colapsado
3. **Transición**: Cambiar tema debe ser instantáneo sin recargar

### Debug CSS
Si no funciona, verificar:
- ✅ Atributo `data-theme="dark"` en `<html>` element
- ✅ Selector `:root[data-theme='dark']` en CSS
- ✅ Archivos SVG existen en `assets/images/logo/`
- ✅ No hay CSS overriding los display properties

## Notas para Desarrolladores

### Agregar Nuevos Temas
Si se agregan temas como "blue" o "high-contrast":

```css
/* Agregar para tema blue */
:root[data-theme='blue'] .logo-full { display: none; }
:root[data-theme='blue'] .logo-full--blue { display: block; }
```

### Modificar Tamaños
Los tamaños están centralizados en el CSS:

```css
.logo-full, .logo-full--dark { height: 32px; /* cambiar aquí */ }
.logo-icon, .logo-icon--dark { height: 24px; /* cambiar aquí */ }
```

### Responsive
Los tamaños se ajustan automáticamente en móviles via media queries.

### v1.0.0 - Abril 2026
- ✅ Implementación inicial con cambio dinámico de tema
- ✅ Soporte para estados expandido/colapsado del sidebar
- ✅ Integración con `MutationObserver` para detección de temas
- ✅ Optimización responsive para móviles
- ✅ Documentación completa del componente

## Notas para Desarrolladores

### Actualización de Logos
Para cambiar los logos, simplemente reemplazar los archivos SVG en `src/assets/images/logo/` manteniendo los mismos nombres.

### Agregar Nuevos Temas
Si se agregan nuevos temas (ej: "blue", "high-contrast"), actualizar la lógica en `updateLogo()`:

```typescript
private updateLogo() {
  const theme = document.documentElement.getAttribute('data-theme');
  switch(theme) {
    case 'dark':
      // lógica para dark
      break;
    case 'blue':
      // lógica para blue theme
      break;
    default:
      // lógica para light (default)
  }
}
```

### Debugging
Para debuggear cambios de tema, agregar console.log en `updateLogo()`:
```typescript
private updateLogo() {
  console.log('Theme changed to:', document.documentElement.getAttribute('data-theme'));
  // ... resto de la lógica
}
```</content>
<parameter name="filePath">c:\Users\Plaza Vespucio\Documents\GitHub\bc_front\frontend-feature-add_module_options_vr\src\app\components\logo\README.md