# FríaCheck - Frontend Angular

Aplicación web frontend desarrollada en Angular para el sistema de gestión FríaCheck. Incluye funcionalidades de dashboard, gestión de usuarios, locales, pedidos, reportes y más.

## 🚀 Características Principales

### Gestión de Usuarios y Roles
- Sistema de autenticación con RBAC (Role-Based Access Control)
- Gestión de usuarios con diferentes niveles de permisos
- Perfiles de usuario personalizables

### Dashboard Interactivo
- Métricas globales en tiempo real
- Visualización de datos con gráficos y estadísticas
- Tema oscuro/claro con persistencia automática

### Gestión de Locales
- Mapa interactivo de locales
- Información detallada de cada ubicación
- Gestión de activos por local

### Sistema de Pedidos y Tickets
- Seguimiento de pedidos
- Sistema de tickets de soporte
- Reportes y métricas de rendimiento

## 🛠️ Tecnologías Utilizadas

- **Framework**: Angular 17+
- **Lenguaje**: TypeScript
- **Estilos**: CSS/SCSS con Material Design
- **Arquitectura**: Componentes standalone
- **Estado**: Servicios inyectables
- **Routing**: Angular Router con guards

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/          # Componentes de UI
│   │   ├── dashboard/       # Dashboard principal
│   │   ├── sidebar/         # Navegación lateral
│   │   ├── topbar/          # Barra superior
│   │   ├── logo/            # Componente logo con temas
│   │   └── ...
│   ├── core/                # Servicios core y guards
│   ├── features/            # Módulos de características
│   └── styles/              # Estilos globales
├── assets/                  # Recursos estáticos
│   └── images/
│       └── logo/            # Archivos SVG del logo
└── environments/            # Configuraciones por entorno
```

## 🎨 Tema y Diseño

### Modos de Visualización
- **Light Mode**: Tema claro con colores suaves
- **Dark Mode**: Tema oscuro optimizado para uso nocturno
- **Responsive**: Diseño adaptativo para móviles y desktop

### Logo Dinámico
El componente logo automáticamente selecciona el archivo SVG apropiado según:
- Modo de tema activo (light/dark)
- Estado del sidebar (expandido/colapsado)

**Archivos SVG utilizados**:
- `logo-light.svg` / `logo-dark.svg`: Logo completo
- `logo-icon-light.svg` / `logo-icon-dark.svg`: Ícono para sidebar colapsado

## 🔧 Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+
- Angular CLI 17+
- npm o yarn

### Instalación
```bash
npm install
```

### Desarrollo Local
```bash
npm start
# La aplicación estará disponible en http://localhost:4200
```

### Build de Producción
```bash
npm run build
```

### Tests
```bash
npm test
```

## 📋 Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Inicia servidor de desarrollo |
| `npm run build` | Construye la aplicación para producción |
| `npm test` | Ejecuta los tests unitarios |
| `npm run lint` | Ejecuta el linter de código |

## 🔒 Seguridad y RBAC

Implementa un sistema completo de control de acceso basado en roles:
- **Guards** para protección de rutas
- **Directivas** para control de elementos UI
- **Servicios** para gestión de permisos
- **Modelos** para definición de roles y permisos

## 📊 Métricas y Reportes

- Dashboard con métricas globales
- Reportes de rendimiento
- Visualización de datos con gráficos
- Exportación de datos

## 🌐 Despliegue

La aplicación está configurada para despliegue en múltiples entornos:
- **Desarrollo**: Configuración local
- **Staging**: Entorno de pruebas
- **Producción**: Entorno final

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, contactar al equipo de desarrollo.

---

**Última actualización**: Abril 2026
**Versión**: 1.0.0