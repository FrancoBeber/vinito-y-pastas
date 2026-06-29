# Vinito y Pastas - E-commerce de Vinos

Este proyecto contiene la estructura base para un e-commerce premium de venta de vinos con catálogo interactivo, filtros y soporte para bases de datos relacionales (PostgreSQL).

## Tecnologías

- **Frontend**: React + Vite (Vanilla CSS Premium)
- **Backend**: Node.js + Express
- **Base de Datos**: PostgreSQL

---

## Requisitos Previos

1. Tener instalado [Node.js](https://nodejs.org/) (ya instalado en este sistema).
2. Tener instalado y corriendo [PostgreSQL](https://www.postgresql.org/).

---

## Configuración y Despliegue

### 1. Base de Datos (PostgreSQL)

Crea una base de datos llamada `vinito_y_pastas` en tu cliente de base de datos o consola de PostgreSQL:

```sql
CREATE DATABASE vinito_y_pastas;
```

Luego, ejecuta los scripts de base de datos en el siguiente orden para crear las tablas e insertar los datos semilla (vinos con sus respectivas bodegas, categorías, stock e imágenes):

1. [database/schema.sql](file:///c:/Users/USRAdmin/Desktop/Vinito%20y%20Pastas/database/schema.sql)
2. [database/seed.sql](file:///c:/Users/USRAdmin/Desktop/Vinito%20y%20Pastas/database/seed.sql)

### 2. Backend (Node + Express)

1. Abre una terminal en la carpeta `backend/`.
2. Si deseas cambiar las credenciales de conexión de la base de datos, crea un archivo `.env` en la raíz de `backend/` con el siguiente formato:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://tu_usuario:tu_contraseña@localhost:5432/vinito_y_pastas
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   El servidor backend correrá en `http://localhost:5000`.

### 3. Frontend (React + Vite)

1. Abre una terminal en la carpeta `frontend/`.
2. Inicia el servidor de desarrollo del frontend:
   ```bash
   npm run dev
   ```
   El frontend React estará disponible en la dirección que indique la consola (generalmente `http://localhost:5173`).

---

## Funcionalidades del Catálogo

- **Buscador interactivo**: Permite buscar vinos por nombre o descripción en tiempo real.
- **Filtros por Tipo de Vino**: Filtros radio interactivos para mostrar categorías específicas (Tinto, Blanco, Rosado, Espumante).
- **Filtros por Bodega**: Muestra de forma dinámica solo las bodegas disponibles cargadas en la base de datos.
- **Filtro de Rango de Precios**: Permite limitar la búsqueda por precio mínimo y/o máximo.
- **Estilo Premium**: Paleta de colores refinada inspirada en vinos, modo oscuro premium, micro-animaciones en tarjetas y botones.
