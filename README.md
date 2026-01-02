# Linked Platform

Una plataforma web tipo portfolio profesional minimalista y premium, diseñada para centralizar proyectos y servicios como desarrollador.

## ✨ Características

- 🎨 **Diseño Premium Minimalista** - Estética limpia y elegante con mucho espacio en blanco
- 📱 **Totalmente Responsive** - Mobile-first, adaptado a todos los dispositivos
- ⚡ **Rendimiento Optimizado** - Construido con Vite para carga ultrarrápida
- 🎭 **Animaciones Suaves** - Transiciones elegantes con Framer Motion
- 🧩 **Arquitectura Modular** - Componentes reutilizables y código escalable
- 🎯 **SEO Friendly** - Estructura optimizada para motores de búsqueda

## 🚀 Inicio Rápido

### Instalación
```bash
npm install
```

### Desarrollo
```bash
npm run dev
```

El servidor de desarrollo se iniciará en `http://localhost:5173`

### Build para Producción
```bash
npm run build
```

### Preview del Build
```bash
npm run preview
```

## 🛠️ Stack Tecnológico

- **React 18** - Biblioteca de UI moderna
- **Vite** - Herramienta de construcción ultrarrápida
- **Tailwind CSS** - Framework CSS utility-first
- **React Router** - Enrutamiento para SPA
- **Framer Motion** - Animaciones fluidas y elegantes
- **ESLint** - Linter para código JavaScript/JSX

## 📁 Estructura del Proyecto

```
src/
 ├─ components/        # Componentes reutilizables
 │   ├─ Navbar.jsx     # Navegación principal
 │   ├─ Hero.jsx       # Sección hero
 │   ├─ Services.jsx   # Lista de servicios
 │   ├─ ServiceCard.jsx
 │   ├─ Projects.jsx   # Lista de proyectos
 │   ├─ ProjectCard.jsx
 │   ├─ Footer.jsx     # Pie de página
 │   └─ Layout.jsx     # Layout principal
 ├─ pages/             # Páginas de la aplicación
 │   ├─ Home.jsx       # Página de inicio
 │   └─ Projects.jsx   # Página de proyectos
 ├─ data/              # Datos estáticos
 │   ├─ services.js    # Array de servicios
 │   └─ projects.js    # Array de proyectos
 ├─ assets/            # Recursos estáticos
 ├─ App.jsx            # Componente raíz
 └─ main.jsx           # Punto de entrada
```

## 🎨 Personalización

### Agregar Proyectos

Edita `src/data/projects.js` para agregar tus proyectos:

```javascript
{
  id: 1,
  name: 'Nombre del Proyecto',
  description: 'Descripción del proyecto',
  technologies: ['React', 'Node.js'],
  image: 'url-de-la-imagen',
  previewUrl: 'https://...',
  detailsUrl: '/projects/proyecto',
}
```

### Agregar Servicios

Edita `src/data/services.js` para agregar tus servicios:

```javascript
{
  id: 1,
  title: 'Título del Servicio',
  description: 'Descripción del servicio',
  icon: '💻',
}
```

### Cambiar Colores

Edita `tailwind.config.js` para personalizar la paleta de colores.

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.