## 🚘 Concesionaria Autos Usados – UTN

Proyecto web desarrollado para la gestión de vehículos usados.
Los clientes pueden ver autos publicados, solicitar una cita para ver el modelo, agregar autos a favoritos y navegar por un catálogo completo de unidades disponibles con filtros de búsqueda y ordenamiento ya implementados. A su vez, los administradores pueden ver los autos disponibles en su sucursal, registrar nuevos autos, editar autos existentes y visualizar las citas reservadas en su sucursal. Por otro lado, todos los usuarios pueden acceder a la funcionalidad del Simulador de Financiación.
A su vez, el sistema utiliza una serie de Guards que permiten o restringen la navegación a ciertas rutas en base al tipo de usuario. Por ejemplo, los administradores no pueden entrar al componente detalle de autos que no son parte de su concesionaria. La totalidad de Guards implementados puede verse en la carpeta src/app/guards.

---

### 🌟 Características principales

✔️ Catálogo de autos usados
✔️ Detalle del vehículo con información completa
✔️ Solicitud de citas para ver un vehículo
✔️ Sistema de favoritos
✔️ Inicio de sesión para acceso a funciones avanzadas
✔️ Simulador de financiación
✔️ Filtros de búsqueda para refinar el catálogo

---

### 🛠️ Tecnologías utilizadas

| Tecnología | Descripción                             |
| ---------- | --------------------------------------- |
| Angular    | Framework principal para el frontend    |
| TypeScript | Lenguaje base para la lógica            |
| HTML / CSS | Estructura y estilos                    |
| Bootstrap  | Componentes visuales                    |
| JSON       | Manejo de datos de vehículos y usuarios |

---

### 📂 Componentes del proyecto

* `login`
* `sign up`
* `catalogo de autos`
* `detalle del vehiculo`
* `simulador de financiacion`
* `favoritos`
* `citas`

---

### 🚀 Ejecución del proyecto

1️⃣ Clonar el repositorio

```bash
git clone https://github.com/solej1980/Concesionaria-UTN.git
```

2️⃣ Acceder al directorio del proyecto

```bash
cd Concesionaria-UTN
```

3️⃣ Instalar dependencias

```bash
npm install
```

4️⃣ Ejecutar el servidor de desarrollo

```bash
ng serve -o
```

---

### 👥 Colaboradores

| Nombre                | Rol        |
| --------------------- | ---------- |
| Patuto, Federico      | Desarrollo |
| Guerra, Ezequiel      | Desarrollo |
| Juarez, María Soledad | Desarrollo |

---

### 📌 Estado del proyecto

🟢 En desarrollo — nuevas funcionalidades se incorporarán progresivamente.

---

### 🛣️ Mejoras futuras (Roadmap)

* [ ] Agregado de sección Perfil, con posibilidad de edición de datos personales
* [ ] Lógica compleja de Citas, con notificaciones por cambios de estado
* [ ] Implementación de notificaciones
* [ ] Mejoras de interfaz visual

---

### 📄 Licencia

Proyecto educativo desarrollado en el marco académico de la **UTN**.
