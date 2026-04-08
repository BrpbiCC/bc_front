# FrioCheck - Entorno de Desarrollo (Codespaces)

¡Bienvenido al equipo! Para este proyecto **NO necesitas instalar Node.js, Angular, NestJS ni dependencias en tu computadora local**. 

Hemos configurado un entorno virtual en la nube (DevContainer) que te armará un Visual Studio Code directamente en tu navegador con todas las herramientas exactas que necesitamos.

## Cómo arrancar en 3 pasos:

### 1. Levantar la máquina virtual
1. Ve a la página principal de este repositorio en GitHub.
2. Haz clic en el botón verde que dice **"<> Code"**.
3. Cambia a la pestaña **"Codespaces"**.
4. Haz clic en el botón **"Create codespace on 1FrioCheckWeb"** (o en la rama en la que vayas a trabajar).

### 2. Esperar la auto-configuración
Se abrirá una nueva pestaña en tu navegador con una interfaz idéntica a VS Code. 
* Tómate un café (tardará unos 1-2 minutos la primera vez). 
* El sistema instalará automáticamente la versión correcta de Node, las extensiones recomendadas y ejecutará `npm install` en el frontend por ti.

### 3. Encender los motores
Una vez que la terminal del editor web esté libre, abre dos pestañas de terminal (puedes dividir la pantalla en VS Code) para correr ambos proyectos:

**Terminal 1 (Panel Web - Angular):**
```bash
cd frontendweb
npm start