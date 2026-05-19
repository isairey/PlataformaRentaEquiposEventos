<div align="center">

<img width="220" src="https://cdn-icons-png.flaticon.com/512/3659/3659898.png" />

# 🎪 ERS - Event Rental System

### Plataforma moderna de renta de artículos y equipos para eventos 🚀

<p align="center">
  <b>ERS - Event Rental System</b> es una plataforma desarrollada con Next.js y Firebase que permite a usuarios publicar, rentar y administrar mobiliario y equipos para eventos sociales.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/EventRental-ModernPlatform-purple?style=for-the-badge">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white">
  <img src="https://img.shields.io/badge/Firebase-Backend-FFCA28?style=for-the-badge&logo=firebase&logoColor=black">
  <img src="https://img.shields.io/badge/TailwindCSS-UI-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white">
</p>

<p align="center">
  <a href="#-acerca-del-proyecto">Acerca</a> •
  <a href="#-módulos-del-sistema">Módulos</a> •
  <a href="#-características">Características</a> •
  <a href="#-tecnologías-utilizadas">Tecnologías</a> •
  <a href="#-instalación">Instalación</a>
</p>

</div>

---

# 🌌 Acerca del proyecto

**ERS - Event Rental System** es una plataforma web moderna enfocada en la administración y renta de artículos para eventos sociales como fiestas, bodas, conciertos y celebraciones.

El sistema permite:

- 🎪 Publicar artículos de renta
- 📦 Gestionar inventario
- 👥 Administrar usuarios
- 📅 Reservar equipos
- 🔍 Buscar productos
- ⭐ Gestionar reseñas
- 💳 Integrar pagos
- 🔔 Recibir notificaciones en tiempo real

---

# ✨ Características

## 👤 Sistema de autenticación

- 🔐 Inicio de sesión seguro
- 📧 Login con email y contraseña
- 🌐 Acceso con Google
- 👥 Gestión de perfiles
- 🛡️ Protección de sesiones

---

## 📦 Gestión de artículos

- 🪑 Publicación de productos
- 🖼️ Subida de imágenes
- 📋 Administración de inventario
- 💰 Configuración de precios
- 📍 Gestión de ubicación

---

## 🔍 Sistema de búsqueda

- 🔎 Búsqueda avanzada
- 📍 Filtrado por ubicación
- 💰 Filtrado por precios
- 🏷️ Categorías dinámicas
- ⚡ Resultados rápidos

---

## 📅 Sistema de reservas

- 📆 Reservaciones en tiempo real
- 💳 Gestión de pagos
- 🔔 Notificaciones instantáneas
- ⭐ Sistema de reseñas
- 📊 Historial de rentas

---

# 👨‍💼 Módulos del sistema

## 👤 User Module

Módulo principal de usuarios y autenticación.

### Funcionalidades

- Registro de usuarios
- Inicio de sesión
- Perfil personalizado
- Gestión de reservas
- Historial de actividad

---

## 📦 Rental Items Module

Módulo encargado de los productos y artículos de renta.

### Funcionalidades

- Publicar artículos
- Editar productos
- Subir imágenes
- Control de disponibilidad
- Administración de precios

---

## 📅 Booking Module

Sistema de reservaciones y solicitudes.

### Funcionalidades

- Solicitudes de renta
- Confirmación de reservas
- Historial de pedidos
- Gestión de pagos
- Seguimiento de órdenes

---

# 🛠️ Tecnologías utilizadas

## ⚛️ Frontend

<p>
  <img src="https://skillicons.dev/icons?i=nextjs,react,typescript,tailwind" />
</p>

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion

---

## ⚙️ Backend & Cloud

<p>
  <img src="https://skillicons.dev/icons?i=firebase" />
</p>

- Firebase Authentication
- Firestore Database
- Firebase Storage
- Firebase Hosting
- Cloud Services

---

## 🧠 Gestión de estado

<p>
  <img src="https://skillicons.dev/icons?i=react" />
</p>

- Zustand
- React Query
- React Hook Form
- Context API

---

## 🧰 Herramientas

<p>
  <img src="https://skillicons.dev/icons?i=git,github,vscode,npm" />
</p>

- Git
- GitHub
- VS Code
- NPM

---

# 📂 Estructura del proyecto

```bash
ers-event-rental/
│
├── app/                      # Next.js App Router
│   ├── (auth)/               # Autenticación
│   ├── items/                # Gestión de artículos
│   ├── profile/              # Perfil de usuario
│   └── layout.tsx
│
├── components/               # Componentes reutilizables
├── contexts/                 # Context API
├── lib/firebase/             # Configuración Firebase
├── types/                    # Tipos TypeScript
├── public/                   # Recursos estáticos
├── firestore.rules           # Reglas Firestore
├── storage.rules             # Reglas Storage
├── package.json
└── README.md
```

---

# ⚡ Instalación

## 📋 Requisitos

- Node.js 18+
- NPM
- Firebase Account
- Git
- VS Code

---

# 🚀 Configuración del proyecto

## 1️⃣ Clonar repositorio

```bash
git clone https://github.com/gitCarrot/ers-event-rental.git
```

---

## 2️⃣ Entrar al proyecto

```bash
cd ers-event-rental
```

---

## 3️⃣ Instalar dependencias

```bash
npm install
```

---

## 4️⃣ Configurar Firebase

Crear archivo:

```bash
.env.local
```

Agregar:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## 5️⃣ Ejecutar proyecto

```bash
npm run dev
```

---

## 6️⃣ Abrir en navegador

```bash
http://localhost:3000
```

---

# 🔥 Configuración Firebase

## 📡 Inicializar Firebase

```bash
npm install -g firebase-tools
```

---

## 🔐 Login Firebase

```bash
firebase login
```

---

## ⚙️ Inicializar proyecto

```bash
firebase init
```

---

## 🚀 Deploy reglas

```bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

---

# 📊 Funcionalidades principales

## 📦 Gestión de productos

- Publicación de artículos
- Gestión de imágenes
- Inventario dinámico
- Control de disponibilidad

---

## 👥 Administración de usuarios

- Login social
- Gestión de perfiles
- Historial de actividad
- Seguridad Firebase

---

## 📅 Reservaciones inteligentes

- Reservas en tiempo real
- Confirmaciones automáticas
- Historial de pedidos
- Notificaciones instantáneas

---

# 📸 Vista previa

## 🖥️ Interfaces del sistema

<div align="center">

### 🎪 Página principal
- Exploración de artículos y eventos

### 🔐 Sistema de autenticación
- Login y registro de usuarios

### 📦 Catálogo de productos
- Gestión y búsqueda de artículos

### 📅 Reservaciones
- Solicitudes y confirmaciones

### 👤 Perfil de usuario
- Historial y administración personal

</div>

---

# 🧠 Objetivos del proyecto

## 🎯 Aprendizaje y desarrollo

- Desarrollo con Next.js
- Arquitectura moderna frontend
- Integración Firebase
- Gestión de estado avanzada
- UI/UX moderna
- Aplicaciones escalables

---

# 🚧 Roadmap

## 🔮 Próximas mejoras

- 📱 Aplicación móvil
- 💬 Chat en tiempo real
- 💳 Integración de pagos
- 📊 Dashboard analítico
- 🌎 Multi idioma
- 🤖 Recomendaciones inteligentes
- ☁️ Infraestructura cloud avanzada

---

# 🤝 Contribuciones

Las contribuciones son bienvenidas ❤️

## Cómo contribuir

1. Fork del proyecto

```bash
git checkout -b feature/nueva-funcionalidad
```

2. Commit

```bash
git commit -m "✨ Nueva funcionalidad"
```

3. Push

```bash
git push origin feature/nueva-funcionalidad
```

4. Pull Request 🚀

---

# 👨‍💻 Desarrollador

<div align="center">

## Isai Reyes — Full Stack Developer

Desarrollador apasionado por plataformas de eventos, experiencias modernas y aplicaciones escalables 🚀

</div>

---

# 🌟 Apoya el proyecto

⭐ Dale una estrella  
🍴 Haz fork  
📢 Comparte el proyecto

---

# 📜 Licencia

Proyecto open source bajo licencia MIT orientado al aprendizaje y desarrollo de plataformas modernas de renta para eventos.

---

<div align="center">

### 🎪 ERS - Event Rental System — experiencias modernas para la renta de eventos 🚀

</div>
