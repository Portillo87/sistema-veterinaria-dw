# Sistema de Gestión Veterinaria DW

Sistema web completo para la administración de clínicas veterinarias, desarrollado como proyecto académico para la asignatura **Desarrollo Web (DW)** — Ingeniería en Desarrollo de Software.

---

## Descripción

Aplicación full-stack que permite gestionar de forma integral los procesos de una clínica veterinaria: registro de propietarios, mascotas, expedientes clínicos, historial médico y control de consultas. Cuenta con una interfaz moderna y responsiva que facilita la operación diaria del personal clínico y administrativo.

---

## Características Principales

- Registro e inicio de sesión de usuarios
- Gestión completa de propietarios (CRUD)
- Gestión completa de mascotas (CRUD)
- Expedientes clínicos por mascota
- Historial médico detallado
- Control de vacunas
- Gestión de citas
- Dashboard administrativo con estadísticas
- Reportes del sistema
- Control de roles de usuario
- API REST documentada

---

## Tecnologías Utilizadas

### Frontend
| Tecnología | Versión | Propósito |
|---|---|---|
| Vue.js 3 | ^3.5 | Framework principal (Composition API) |
| Vue Router | ^4.5 | Navegación SPA |
| Axios | ^1.7 | Cliente HTTP |
| Bootstrap 5 | ^5.3 | Componentes UI y estilos |
| Bootstrap Icons | ^1.11 | Iconografía |
| Tailwind CSS | ^4.3 | Utilidades CSS |
| Vite | ^8.0 | Bundler y servidor de desarrollo |

### Backend
| Tecnología | Versión | Propósito |
|---|---|---|
| Node.js | ≥18.x | Entorno de ejecución |
| Express.js | ^5.2 | Framework HTTP / API REST |
| Mongoose | ^9.6 | ODM para MongoDB |
| CORS | ^2.8 | Control de acceso entre orígenes |
| dotenv | ^17.4 | Gestión de variables de entorno |

### Base de Datos
| Tecnología | Propósito |
|---|---|
| MongoDB Atlas | Base de datos NoSQL en la nube |
| Mongoose | Modelado y validación de esquemas |

---

## Arquitectura del Sistema

```
PROYECTO VETERINARIA/
├── backend/                  # API REST — Node.js + Express
│   ├── src/
│   │   ├── app.js            # Configuración de la aplicación Express
│   │   ├── config/
│   │   │   └── db.js         # Conexión a MongoDB
│   │   ├── controllers/      # Lógica de negocio por entidad
│   │   ├── models/           # Esquemas Mongoose
│   │   └── routes/           # Definición de rutas REST
│   ├── server.js             # Punto de entrada del servidor
│   ├── .env.example          # Plantilla de variables de entorno
│   └── package.json
│
└── frontendDW/               # SPA — Vue 3 + Vite
    ├── src/
    │   ├── main.js           # Punto de entrada
    │   ├── App.vue           # Componente raíz
    │   ├── router/           # Configuración de rutas Vue
    │   ├── services/         # Clientes HTTP (Axios)
    │   ├── views/            # Páginas de la aplicación
    │   └── assets/           # Estilos y recursos estáticos
    ├── index.html
    └── package.json
```

**Patrón arquitectónico:** Cliente-Servidor con API REST  
**Comunicación:** HTTP/JSON entre frontend (puerto 5173) y backend (puerto 3000)  
**Persistencia:** MongoDB Atlas (cloud) con Mongoose ODM

---

## Requisitos Previos

Asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) — versión 18.x o superior
- [Git](https://git-scm.com/) — para clonar el repositorio
- Una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas) — o MongoDB local

Verifica las instalaciones:
```bash
node --version
npm --version
git --version
```

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/NOMBRE_DEL_REPO.git
cd NOMBRE_DEL_REPO
```

### 2. Instalar dependencias del Backend

```bash
cd backend
npm install
```

### 3. Instalar dependencias del Frontend

```bash
cd ../frontendDW
npm install
```

---

## Configuración

### Backend — Variables de Entorno

Crea el archivo `.env` dentro de la carpeta `backend/` copiando el ejemplo:

```bash
cd backend
copy .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
PORT=3000
MONGO_URI=mongodb+srv://USUARIO:CONTRASEÑA@cluster.mongodb.net/veterinaria?retryWrites=true&w=majority
```

> **Nota:** El archivo `.env` está incluido en `.gitignore` y nunca debe subirse al repositorio.

---

## Ejecución

### Backend

```bash
cd backend
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

### Frontend

Abre una nueva terminal:

```bash
cd frontendDW
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

---

## Endpoints de la API REST

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/propietarios` | Listar todos los propietarios |
| POST | `/api/propietarios` | Crear propietario |
| PUT | `/api/propietarios/:id` | Actualizar propietario |
| DELETE | `/api/propietarios/:id` | Eliminar propietario |
| GET | `/api/perros` | Listar todas las mascotas |
| POST | `/api/perros` | Registrar mascota |
| PUT | `/api/perros/:id` | Actualizar mascota |
| DELETE | `/api/perros/:id` | Eliminar mascota |
| GET | `/api/historial` | Listar historial clínico |
| POST | `/api/historial` | Crear registro clínico |
| PUT | `/api/historial/:id` | Actualizar registro |
| DELETE | `/api/historial/:id` | Eliminar registro |

---

## Base de Datos

El proyecto utiliza **MongoDB Atlas** como base de datos en la nube.

### Modelos de Datos

**Propietario**
```json
{
  "nombreCompleto": "String",
  "dui": "String",
  "telefono": "String",
  "correo": "String",
  "direccion": "String"
}
```

**Mascota (Perro)**
```json
{
  "nombre": "String",
  "raza": "String",
  "edad": "Number",
  "peso": "Number",
  "sexo": "String",
  "propietario": "ObjectId (ref: Propietario)"
}
```

**Historial Clínico**
```json
{
  "fechaConsulta": "Date",
  "motivoConsulta": "String",
  "diagnostico": "String",
  "tratamiento": "String",
  "veterinarioResponsable": "String",
  "mascota": "ObjectId (ref: Perro)"
}
```

---

## Capturas del Sistema

> *(Agrega aquí capturas de pantalla de las vistas principales del sistema)*

| Dashboard | Gestión de Mascotas |
|---|---|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Mascotas](docs/screenshots/mascotas.png) |

---

## Autor

**Wilfredo Villalta**  
Estudiante de Ingeniería en Desarrollo de Software — 4.º año  
Asignatura: Desarrollo Web (DW)  
Correo: wilfredovillalta828@gmail.com

---

## Licencia

Este proyecto está bajo la Licencia MIT.  
Uso exclusivamente académico.

```
MIT License — Copyright (c) 2026 Wilfredo Villalta
```
