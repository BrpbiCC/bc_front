# Imágenes - FrioCheck

Esta carpeta contiene todos los recursos de imagen de la aplicación FrioCheck.

## Estructura

- **logos/** - Logos de la marca y logotipos empresariales
- **icons/** - Iconos de interfaz de usuario

## Uso

Para referenciar imágenes desde los componentes:

```html
<!-- Logos -->
<img src="/imagenes/logos/logo.png" alt="Logo" />

<!-- Iconos -->
<img src="/imagenes/icons/icon-name.png" alt="Icono" />
```

## Formatos recomendados

- **Logos**: PNG (transparencia) o SVG (escalable)
- **Iconos**: PNG, SVG o WEBP

## Optimización

Se recomienda optimizar las imágenes antes de subirlas para mejorar el rendimiento:

- Compresión de PNG: TinyPNG, ImageOptim
- SVG: SVGO para minificación
- Webp: mayor compatibilidad y menor tamaño
