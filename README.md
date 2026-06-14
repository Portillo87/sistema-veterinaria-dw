# Sistema de Gestión Veterinaria DW

Proyecto desarrollado para la asignatura **Desarrollo Web (DW)** de la carrera **Ingeniería en Desarrollo de Software**, cuyo objetivo es aplicar los conocimientos adquiridos en el desarrollo de aplicaciones web mediante la integración de tecnologías de frontend, backend y bases de datos.

---

## Descripción

El Sistema de Gestión Veterinaria DW es una aplicación web orientada a la administración de información dentro de una clínica veterinaria. El sistema permite registrar propietarios y mascotas, gestionar historiales clínicos y mantener organizada la información relacionada con la atención veterinaria.

Para el desarrollo del proyecto se implementó una arquitectura cliente-servidor utilizando Vue.js para la interfaz de usuario, Node.js y Express para el desarrollo de la API REST, y MongoDB Atlas como sistema de almacenamiento de datos.

Este proyecto permitió poner en práctica conocimientos relacionados con el desarrollo web moderno, la construcción de APIs REST, el manejo de bases de datos NoSQL y la integración de servicios en aplicaciones web.

---

## Objetivo General

Desarrollar una aplicación web que permita gestionar de manera eficiente la información de una clínica veterinaria, facilitando el control de propietarios, mascotas e historiales clínicos.

---

## Funcionalidades Principales

* Registro y administración de propietarios.
* Registro y gestión de mascotas.
* Consulta y actualización de historiales clínicos.
* Gestión de expedientes médicos veterinarios.
* Control de información de las mascotas registradas.
* Comunicación mediante una API REST.
* Almacenamiento de información en MongoDB Atlas.
* Interfaz web amigable y de fácil uso.
* Gestión de datos mediante operaciones CRUD.

---

## Tecnologías Utilizadas

### Frontend

* Vue.js 3
* Vue Router
* Axios
* Bootstrap 5
* Bootstrap Icons
* Tailwind CSS
* Vite

### Backend

* Node.js
* Express.js
* Mongoose
* CORS
* dotenv

### Base de Datos

* MongoDB Atlas

---

## Arquitectura del Proyecto

```text
PROYECTO VETERINARIA/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── routes/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontendDW/
│   ├── src/
│   │   ├── assets/
│   │   ├── router/
│   │   ├── services/
│   │   └── views/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

### Arquitectura Implementada

* Patrón Cliente - Servidor.
* Comunicación mediante HTTP y JSON.
* API REST para la gestión de datos.
* Base de datos NoSQL utilizando MongoDB Atlas.

---

## Requisitos Previos

Antes de ejecutar el proyecto es necesario tener instalado:

* Node.js versión 18 o superior.
* Git.
* MongoDB Atlas o una instancia de MongoDB.
* Visual Studio Code (opcional).

Verificar instalaciones:

```bash
node --version
npm --version
git --version
```

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Portillo87/sistema-veterinaria-dw.git
```

Ingresar al proyecto:

```bash
cd sistema-veterinaria-dw
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

## Configuración de Variables de Entorno

Dentro de la carpeta backend crear un archivo llamado:

```text
.env
```

Ejemplo:

```env
PORT=3000
MONGO_URI=tu_cadena_de_conexion_mongodb
```

> Importante: El archivo `.env` no debe subirse a GitHub.

---

## Ejecución del Proyecto

### Iniciar Backend

Ubicarse en la carpeta backend:

```bash
cd backend
```

Ejecutar:

```bash
npm start
```

Si la configuración es correcta, el servidor iniciará y se conectará automáticamente a MongoDB Atlas.

Servidor disponible en:

```text
http://localhost:3000
```

---

### Iniciar Frontend

Abrir una nueva terminal.

Ubicarse en la carpeta frontendDW:

```bash
cd frontendDW
```

Ejecutar:

```bash
npm run dev
```

La aplicación estará disponible en:

```text
http://localhost:5173
```

---

## Endpoints Principales

### Propietarios

| Método | Ruta                  |
| ------ | --------------------- |
| GET    | /api/propietarios     |
| POST   | /api/propietarios     |
| PUT    | /api/propietarios/:id |
| DELETE | /api/propietarios/:id |

### Mascotas

| Método | Ruta            |
| ------ | --------------- |
| GET    | /api/perros     |
| POST   | /api/perros     |
| PUT    | /api/perros/:id |
| DELETE | /api/perros/:id |

### Historial Clínico

| Método | Ruta               |
| ------ | ------------------ |
| GET    | /api/historial     |
| POST   | /api/historial     |
| PUT    | /api/historial/:id |
| DELETE | /api/historial/:id |

---

## Base de Datos

El proyecto utiliza MongoDB Atlas para el almacenamiento de la información.

### Colecciones Principales

#### Propietarios

Contiene la información de los propietarios registrados.

* Nombre completo
* DUI
* Teléfono
* Correo electrónico
* Dirección

#### Mascotas

Contiene la información de las mascotas.

* Nombre
* Raza
* Edad
* Peso
* Sexo
* Propietario asociado

#### Historial Clínico

Contiene el expediente médico de cada mascota.

* Fecha de consulta
* Motivo de consulta
* Diagnóstico
* Tratamiento
* Veterinario responsable

---

## Capturas del Sistema

Las capturas de pantalla del sistema pueden agregarse en esta sección para mostrar las principales funcionalidades de la aplicación.

* Inicio de sesión
* Dashboard principal
* Gestión de propietarios
* Gestión de mascotas
* Historial clínico
* Registro de consultas

---

## Aprendizajes Obtenidos

Durante el desarrollo de este proyecto se fortalecieron conocimientos relacionados con:

* Desarrollo Frontend con Vue.js.
* Desarrollo Backend con Node.js y Express.
* Diseño e implementación de APIs REST.
* Manejo de bases de datos MongoDB Atlas.
* Uso de Git y GitHub para control de versiones.
* Integración de sistemas cliente-servidor.

---

## Autor

**Wilfredo Villalta**

Estudiante de Ingeniería en Desarrollo de Software

Asignatura: Desarrollo Web (DW)

Año: 2026

---

## Observaciones

Este proyecto fue desarrollado con fines académicos para poner en práctica los conocimientos adquiridos durante la asignatura Desarrollo Web, aplicando tecnologías modernas utilizadas en el desarrollo de aplicaciones web.
