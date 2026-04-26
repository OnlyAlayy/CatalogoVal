# 🍫 Plan de Desarrollo — Val Postress · Catálogo Digital

> **Documento de arquitectura y diseño — Versión 1.0**
> Stack: React + Vite + Tailwind CSS (Frontend) · Node.js + Express + MongoDB (Backend)
> Deploy: Vercel (FE) + Render (BE)

---

## ÍNDICE

1. [Análisis de Marca](#1-análisis-de-marca)
2. [Sistema de Diseño](#2-sistema-de-diseño)
3. [Arquitectura del Proyecto](#3-arquitectura-del-proyecto)
4. [Estructura de Carpetas](#4-estructura-de-carpetas)
5. [Base de Datos — MongoDB Schemas](#5-base-de-datos--mongodb-schemas)
6. [API REST — Backend](#6-api-rest--backend)
7. [Frontend — Páginas y Componentes](#7-frontend--páginas-y-componentes)
8. [Panel de Administración](#8-panel-de-administración)
9. [Variables de Entorno](#9-variables-de-entorno)
10. [Estrategia de Deploy](#10-estrategia-de-deploy)
11. [Roadmap de Desarrollo](#11-roadmap-de-desarrollo)
12. [Consideraciones Técnicas Extra](#12-consideraciones-técnicas-extra)

---

## 1. ANÁLISIS DE MARCA

### Identidad Visual (extraída del catálogo, logo e Instagram)

| Atributo | Descripción |
|---|---|
| **Nombre** | Val Postress / Postres Val |
| **Voz** | Cálida, artesanal, femenina, elegante pero cercana |
| **Público** | Personas que buscan postres caseros de calidad para eventos o consumo propio |
| **Estética** | Elegante y artesanal. Colores cálidos (cremas, marrones chocolates). Tipografía cursiva para marca + sans-serif limpia para texto |
| **Diferencial** | Hechos a pedido, personalizables, calidad casera con presentación cuidada |

### Productos del Catálogo

```
POSTRES INDIVIDUALES
├── Frutilla          $130  (NO DISPONIBLE)
├── Durazno           $130
├── Cheesecake        $155
├── Chocotorta        $155
├── Oreo              $130
└── Dulce de leche    $130

SHOTS
└── 12 unidades a elección  $1000

COOKIES
├── Bandeja de 4      $180
└── Bandeja de 6      $260

MINI DONAS
├── Bandeja de 6      $150
├── Bandeja de 9      $180
└── Bandeja de 12     $220

ALFAJORES DE MAICENA
├── Bandeja de 6      $150
└── Bandeja de 12     $280

ALFAJORES CHOCOCHIPS
├── Bandeja de 6      $180
└── Bandeja de 12     $300
```

---

## 2. SISTEMA DE DISEÑO

### 2.1 Paleta de Colores

Extraída del catálogo PDF, Instagram y logo:

```css
:root {
  /* Fondos */
  --color-bg-primary:    #F5F0EB;  /* Crema cálido — fondo principal */
  --color-bg-secondary:  #EDE6DC;  /* Crema más oscuro — secciones alternas */
  --color-bg-dark:       #1A0F0A;  /* Negro chocolate — hero, footer */
  --color-bg-card:       #FFFFFF;  /* Blanco puro — cards de productos */

  /* Marca */
  --color-brand-primary:   #6B3A2A;  /* Marrón chocolate — títulos, CTAs */
  --color-brand-dark:      #3D1F0D;  /* Chocolate oscuro — hover, énfasis */
  --color-brand-medium:    #9B6B47;  /* Caramelo — subtítulos, iconos */
  --color-brand-light:     #C49A6C;  /* Dorado/arena — detalles decorativos */
  --color-brand-accent:    #D4956A;  /* Salmón cálido — badges, highlights */

  /* Texto */
  --color-text-primary:   #2C1810;  /* Casi negro chocolatoso */
  --color-text-secondary: #6B4C3B;  /* Marrón suave */
  --color-text-muted:     #A08070;  /* Para placeholders, info secundaria */
  --color-text-on-dark:   #F5F0EB;  /* Texto sobre fondos oscuros */

  /* Funcionales */
  --color-success:  #5A7A4A;   /* Verde oliva apagado */
  --color-warning:  #C49A6C;   /* Amarillo/caramelo */
  --color-error:    #9B3A2A;   /* Rojo ladrillo */
  --color-badge-unavailable: #D0C5BC; /* "No disponible" */
}
```

### 2.2 Tipografía

| Rol | Fuente | Uso |
|---|---|---|
| **Display / Brand** | `Playfair Display` (Google Fonts) | Títulos hero, nombre de categorías, logo text |
| **Headings** | `Cormorant Garamond` (Google Fonts) | H1–H3, nombres de productos |
| **Body** | `DM Sans` (Google Fonts) | Párrafos, descripciones, precios, UI |
| **Accent / Cursive** | `Great Vibes` (Google Fonts) | Detalles decorativos, citas |

```css
/* Escalas tipográficas — Mobile First */
--text-xs:   0.75rem;   /* 12px */
--text-sm:   0.875rem;  /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg:   1.125rem;  /* 18px */
--text-xl:   1.25rem;   /* 20px */
--text-2xl:  1.5rem;    /* 24px */
--text-3xl:  1.875rem;  /* 30px */
--text-4xl:  2.25rem;   /* 36px */
--text-5xl:  3rem;      /* 48px */
--text-6xl:  3.75rem;   /* 60px */
```

### 2.3 Espaciado y Grid

```
Grid: 12 columnas
Gutter: 24px (mobile) / 32px (tablet) / 48px (desktop)
Max container: 1280px
Breakpoints:
  sm:  640px
  md:  768px
  lg:  1024px
  xl:  1280px
```

### 2.4 Componentes UI Base

```
Botón Primario:
  bg: --color-brand-primary
  text: blanco
  border-radius: 2px (casi sin redondeo, estética editorial)
  hover: --color-brand-dark + slight scale(1.02)
  padding: 12px 32px

Botón Secundario (outline):
  border: 1.5px solid --color-brand-primary
  text: --color-brand-primary
  bg: transparent
  hover: bg --color-brand-primary, text white

Card de Producto:
  bg: white
  border: none
  box-shadow: 0 2px 20px rgba(44, 24, 16, 0.08)
  border-radius: 4px
  hover: translateY(-4px) + shadow más pronunciado
  transition: 300ms ease

Badge "No disponible":
  bg: --color-badge-unavailable
  text: --color-text-muted
  font-size: text-xs
  border-radius: 2px
  text: "TEMPORALMENTE NO DISPONIBLE"

Badge de categoría:
  bg: --color-brand-light / 20%
  text: --color-brand-primary
  border: 1px solid --color-brand-light
```

### 2.5 Estética General

- **Estilo editorial artesanal**: Mezcla de elegancia (tipografías serifadas, espaciado generoso) con calidez casera (texturas sutiles de papel, fotografías reales, tonos tierra)
- **Líneas decorativas**: Separadores finos en color --color-brand-light (como los del catálogo PDF)
- **Estrellas/sparkles decorativos**: SVG inline, como los ✦ del catálogo
- **Fotografías**: Siempre con aspect-ratio fijo, object-fit cover, sin filtros fuertes (máximo un leve warm overlay)
- **Animaciones**: Sutiles. Fade-in al hacer scroll (Intersection Observer), hover en cards, transiciones de página suaves

---

## 3. ARQUITECTURA DEL PROYECTO

```
val-postress/
├── frontend/          ← React + Vite + Tailwind
│   ├── public/
│   ├── src/
│   └── .env           ← VITE_API_URL, VITE_CLOUDINARY_URL
│
└── backend/           ← Node.js + Express + MongoDB
    ├── src/
    └── .env           ← MONGO_URI, JWT_SECRET, CLOUDINARY_*, PORT
```

### Stack Completo

**Frontend:**
- React 18
- Vite 5
- Tailwind CSS 3
- React Router DOM v6
- Axios (HTTP client)
- React Query (TanStack) — cache y estado del servidor
- Framer Motion — animaciones
- React Hook Form + Zod — formularios y validación
- Cloudinary React SDK — upload de imágenes
- Lucide React — iconos
- React Hot Toast — notificaciones

**Backend:**
- Node.js 20 LTS
- Express 4
- Mongoose 8 (ODM para MongoDB)
- JWT (jsonwebtoken) — autenticación admin
- Bcryptjs — hash de contraseñas
- Multer + Cloudinary — subida de imágenes
- Cors, Helmet, Morgan — middleware de seguridad y logging
- Dotenv
- Express Validator — validación de inputs

**Base de Datos:**
- MongoDB Atlas (free tier M0 suficiente para este proyecto)

**Almacenamiento de imágenes:**
- Cloudinary (free tier: 25GB, más que suficiente)

---

## 4. ESTRUCTURA DE CARPETAS

### Frontend `/frontend/src/`

```
src/
├── assets/
│   ├── fonts/
│   ├── images/
│   │   ├── logo.png
│   │   └── hero-bg.jpg
│   └── icons/
│
├── components/
│   ├── ui/                         ← Componentes base reutilizables
│   │   ├── Button.jsx
│   │   ├── Badge.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── Spinner.jsx
│   │   ├── Toast.jsx
│   │   └── ImageFallback.jsx
│   │
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── PageWrapper.jsx
│   │   └── AdminLayout.jsx
│   │
│   ├── catalog/
│   │   ├── CategoryNav.jsx         ← Navegación sticky de categorías
│   │   ├── CategorySection.jsx     ← Sección con título + grid de productos
│   │   ├── ProductCard.jsx         ← Card individual de producto
│   │   ├── ProductModal.jsx        ← Modal con detalle del producto
│   │   └── PriceDisplay.jsx        ← Lógica de mostrar precio/variantes
│   │
│   ├── home/
│   │   ├── HeroSection.jsx
│   │   ├── AboutSection.jsx
│   │   ├── FeaturedProducts.jsx
│   │   └── ContactSection.jsx
│   │
│   └── admin/
│       ├── ProductForm.jsx
│       ├── ProductTable.jsx
│       ├── CategoryManager.jsx
│       ├── ImageUploader.jsx
│       └── LoginForm.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Catalog.jsx
│   ├── ProductDetail.jsx           ← (opcional, para SEO)
│   ├── admin/
│   │   ├── AdminLogin.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminProducts.jsx
│   │   └── AdminCategories.jsx
│   └── NotFound.jsx
│
├── hooks/
│   ├── useProducts.js              ← React Query hooks
│   ├── useCategories.js
│   ├── useAuth.js
│   └── useScrollSpy.js             ← Para CategoryNav activo
│
├── services/
│   ├── api.js                      ← Instancia de Axios configurada
│   ├── products.service.js
│   ├── categories.service.js
│   └── auth.service.js
│
├── store/
│   └── authStore.js                ← Zustand para estado de auth admin
│
├── utils/
│   ├── formatPrice.js              ← Ej: 1000 → "$1.000"
│   ├── constants.js
│   └── cn.js                       ← Helper para clsx + tailwind-merge
│
├── styles/
│   └── globals.css                 ← CSS variables + @font-face + base styles
│
├── router/
│   ├── AppRouter.jsx
│   └── ProtectedRoute.jsx          ← Guard para rutas /admin
│
├── App.jsx
└── main.jsx
```

### Backend `/backend/src/`

```
src/
├── config/
│   ├── db.js                       ← Conexión a MongoDB
│   └── cloudinary.js               ← Config de Cloudinary
│
├── models/
│   ├── Product.model.js
│   ├── Category.model.js
│   └── Admin.model.js
│
├── controllers/
│   ├── product.controller.js
│   ├── category.controller.js
│   └── auth.controller.js
│
├── routes/
│   ├── product.routes.js
│   ├── category.routes.js
│   └── auth.routes.js
│
├── middleware/
│   ├── auth.middleware.js          ← Verificar JWT
│   ├── upload.middleware.js        ← Multer + Cloudinary
│   ├── validate.middleware.js      ← Express Validator wrapper
│   └── errorHandler.middleware.js
│
├── utils/
│   ├── generateToken.js
│   └── apiResponse.js              ← Formato estándar de respuesta
│
├── validators/
│   ├── product.validator.js
│   └── auth.validator.js
│
├── seeds/
│   └── seed.js                     ← Poblar DB con datos del catálogo inicial
│
└── app.js                          ← Express app + middleware
index.js                            ← Entry point (listen)
```

---

## 5. BASE DE DATOS — MONGODB SCHEMAS

### 5.1 Category Schema

```javascript
// models/Category.model.js
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
    // Ej: "Postres Individuales", "Shots", "Cookies"
  },
  slug: {
    type: String,
    required: true,
    unique: true
    // Ej: "postres-individuales", "shots"
  },
  description: {
    type: String,
    default: ''
  },
  emoji: {
    type: String,
    default: '🍮'
  },
  order: {
    type: Number,
    default: 0
    // Para controlar el orden de aparición en el catálogo
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});
```

### 5.2 Product Schema

```javascript
// models/Product.model.js
const variantSchema = new mongoose.Schema({
  label: { type: String, required: true },
  // Ej: "Bandeja de 6", "Bandeja de 12", "12 shots"
  price: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
    // Ej: "Chocotorta", "Alfajores Chocochips"
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  description: {
    type: String,
    default: ''
    // Ej: "Base de chocolinas, mezcla de dulce de leche y queso crema"
  },
  ingredients: {
    type: [String],
    default: []
    // Array de ingredientes para mostrar como lista
  },
  images: {
    type: [String],
    default: []
    // Array de URLs de Cloudinary
  },
  variants: {
    type: [variantSchema],
    default: []
    // Si no tiene variantes, se usa price directamente
  },
  price: {
    // Precio base (cuando no hay variantes)
    type: Number,
    default: null
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
    // Para mostrar en la home
  },
  orderNote: {
    type: String,
    default: ''
    // Ej: "Se realiza los martes y jueves"
  },
  advanceHours: {
    type: Number,
    default: 24
    // Horas de anticipación requeridas
  },
  requiresDeposit: {
    type: Boolean,
    default: false
  },
  depositPercentage: {
    type: Number,
    default: 50
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});
```

### 5.3 Admin Schema

```javascript
// models/Admin.model.js
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
    // Siempre hasheada con bcrypt
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Pre-save hook para hashear password
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
```

---

## 6. API REST — BACKEND

### Base URL
- **Dev:** `http://localhost:5000/api`
- **Prod (Render):** `https://val-postress-api.onrender.com/api`

### 6.1 Auth Endpoints

```
POST   /api/auth/login
  Body: { username, password }
  Returns: { token, admin: { id, username, email } }
  Token lifetime: 7 días

POST   /api/auth/refresh
  Header: Authorization: Bearer <token>
  Returns: { token }

GET    /api/auth/me
  Header: Authorization: Bearer <token>
  Returns: { admin }
```

### 6.2 Category Endpoints

```
GET    /api/categories
  Public. Returns todas las categorías activas ordenadas por .order
  Response: { success, data: [categories] }

GET    /api/categories/:slug
  Public. Returns categoría + sus productos

POST   /api/categories
  🔒 Admin. Crear categoría
  Body: { name, description, emoji, order }

PUT    /api/categories/:id
  🔒 Admin. Editar categoría

DELETE /api/categories/:id
  🔒 Admin. Soft delete (isActive = false)

PATCH  /api/categories/reorder
  🔒 Admin. Reordenar categorías
  Body: [{ id, order }]
```

### 6.3 Product Endpoints

```
GET    /api/products
  Public. Query params: ?category=slug&featured=true&available=true
  Response: { success, data: [products], total }

GET    /api/products/:slug
  Public. Returns producto completo con categoría populada

POST   /api/products
  🔒 Admin. Crear producto
  Content-Type: multipart/form-data
  Body: { name, categoryId, description, ingredients[], variants[], price,
          isAvailable, isFeatured, orderNote, advanceHours,
          requiresDeposit, depositPercentage, images[] }

PUT    /api/products/:id
  🔒 Admin. Editar producto (mismos campos)

PATCH  /api/products/:id/availability
  🔒 Admin. Toggle disponibilidad rápido
  Body: { isAvailable: boolean }

PATCH  /api/products/:id/price
  🔒 Admin. Cambio rápido de precio (para el panel de admin)
  Body: { price } | { variants: [{ label, price }] }

DELETE /api/products/:id
  🔒 Admin. Eliminar producto

POST   /api/products/upload-image
  🔒 Admin. Subir imagen a Cloudinary
  Content-Type: multipart/form-data
  Returns: { url, publicId }
```

### 6.4 Formato Estándar de Respuesta

```javascript
// utils/apiResponse.js
// Éxito
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa"
}

// Error
{
  "success": false,
  "message": "Descripción del error",
  "errors": [ ... ]   // Solo en errores de validación
}
```

---

## 7. FRONTEND — PÁGINAS Y COMPONENTES

### 7.1 Página Home (`/`)

```
SECCIONES EN ORDEN:

1. NAVBAR
   - Logo SVG/PNG izquierda
   - Links: Catálogo | Sobre mí | Contacto
   - En mobile: hamburger menu con drawer
   - Sticky con blur backdrop al hacer scroll

2. HERO SECTION
   - Background: foto oscura de fondo (estilo Instagram oscuro de la marca)
   - Overlay: gradiente oscuro sutil
   - Texto: "Siempre hay lugar para algo dulce 🍓"
     - Tipografía Great Vibes grande para la frase
     - "Val Postress" en Playfair Display
   - CTA: "Ver Catálogo" (→ /catalogo)
   - Altura: 100vh en desktop, 80vh en mobile

3. CATEGORÍAS DESTACADAS
   - Grid de 3 cols (desktop) / 2 cols (tablet) / 1 col (mobile)
   - Cards con foto de fondo, nombre de categoría encima
   - Efecto hover: zoom de imagen + overlay más oscuro
   - Click → scroll/navega a esa sección en /catalogo

4. PRODUCTOS DESTACADOS (isFeatured: true)
   - Título: "Nuestros Favoritos" (script cursive)
   - Grid horizontal scrollable en mobile
   - Muestra 3-4 productos marcados como featured

5. SOBRE VAL
   - Layout: foto izquierda, texto derecha (se invierte en mobile)
   - Foto: foto de perfil de Instagram o foto trabajando
   - Texto: breve descripción del emprendimiento
   - "Hecho con amor en Belvedere, Buenos Aires"
   - Datos: pedidos a medida, ingredientes de calidad, etc.

6. INFORMACIÓN IMPORTANTE
   - Cards con íconos:
     🕐 "Pedí con anticipación"
     📦 "Retiro o delivery"
     💰 "Seña del 50% en pedidos grandes"
   - Fondo: --color-bg-secondary

7. CONTACTO / CTA FINAL
   - Título grande: "¿Lista para pedir?"
   - Botón: "Escribime por Instagram" → link a @val.postress
   - Botón: "Ver Catálogo Completo" → /catalogo
   - Fondo oscuro (--color-bg-dark) con texto claro

8. FOOTER
   - Logo
   - "© 2025 Val Postress — Hecho con amor en Buenos Aires"
   - Links a Instagram
```

### 7.2 Página Catálogo (`/catalogo`)

```
LAYOUT:

1. HEADER DE PÁGINA
   - Título "Catálogo" en tipografía display
   - Subtítulo: "Todos los productos hechos a pedido"

2. NAVEGACIÓN DE CATEGORÍAS (sticky)
   - Pills/tabs horizontales scrollables
   - Una por categoría: "Postres Individuales | Shots | Cookies | ..."
   - Al clickear: scroll suave a la sección
   - ScrollSpy: resalta la categoría activa al scrollear

3. SECCIONES POR CATEGORÍA
   Por cada categoría se renderiza:

   [Línea decorativa]
   [Nombre categoría — tipografía Playfair Display grande]
   [Descripción opcional de la categoría]

   Grid de productos:
   - Desktop: 3 columnas
   - Tablet: 2 columnas
   - Mobile: 1 columna (cards horizontales) o 2 col compactas

4. PRODUCT CARD
   Contiene:
   - Imagen (aspect-ratio 4/3, object-fit cover)
   - Badge "NO DISPONIBLE" si isAvailable: false
   - Nombre del producto
   - Descripción breve (1-2 líneas)
   - Precio / variantes de precio
   - Botón "Ver detalle" → abre ProductModal

5. PRODUCT MODAL
   - Imagen más grande (o carrusel si hay múltiples)
   - Nombre completo
   - Ingredientes (lista visual)
   - Variantes con precios (si aplica)
   - Nota de pedido (ej: "Se realiza martes y jueves")
   - Anticipación requerida
   - Seña si aplica
   - CTA: "Pedir por Instagram" (link directo a DM)
   - Fondo: blur del contenido detrás

6. SECCIÓN SHOTS — DISEÑO ESPECIAL
   - Layout diferente: foto grande + texto al lado
   - Muestra las variantes de sabores en imagen
   - "12 shots a elección — $1.000"
   - "Consultá por más cantidad"
```

### 7.3 Navegación y Rutas

```javascript
// router/AppRouter.jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/catalogo" element={<Catalog />} />
  <Route path="/catalogo/:productSlug" element={<ProductDetail />} />

  {/* Admin */}
  <Route path="/admin/login" element={<AdminLogin />} />
  <Route element={<ProtectedRoute />}>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<AdminDashboard />} />
      <Route path="productos" element={<AdminProducts />} />
      <Route path="productos/nuevo" element={<ProductFormPage />} />
      <Route path="productos/:id/editar" element={<ProductFormPage />} />
      <Route path="categorias" element={<AdminCategories />} />
    </Route>
  </Route>

  <Route path="*" element={<NotFound />} />
</Routes>
```

---

## 8. PANEL DE ADMINISTRACIÓN

### 8.1 Login (`/admin/login`)

- Formulario simple: username + password
- JWT guardado en `localStorage` (con fecha de expiración)
- Redirect automático si ya está logueado
- Diseño: simple, usando misma paleta de marca

### 8.2 Dashboard (`/admin`)

```
Cards de resumen:
- Total de productos
- Productos no disponibles
- Total de categorías
- Última modificación

Acciones rápidas:
- "+ Nuevo Producto"
- "Gestionar Categorías"
```

### 8.3 Gestión de Productos (`/admin/productos`)

```
Tabla con:
- Imagen thumbnail
- Nombre
- Categoría
- Precio / variantes
- Estado (disponible/no)
- Acciones: Editar | Toggle disponibilidad | Eliminar

Buscador y filtro por categoría.

Acciones en bulk: cambiar disponibilidad de varios a la vez.
```

### 8.4 Formulario de Producto (`/admin/productos/nuevo` y `/editar`)

```
Sección 1 — Información básica:
  - Nombre *
  - Categoría * (dropdown)
  - Descripción
  - Ingredientes (campo dinámico: agregar/quitar tags)

Sección 2 — Precios:
  Toggle: "¿Tiene variantes de precio?"
  
  SI NO tiene variantes:
    - Precio único *
  
  SI tiene variantes (ej: Bandeja de 6, de 12):
    - Lista dinámica: [Label] [Precio] [Disponible toggle] [Eliminar]
    - Botón "+ Agregar variante"

Sección 3 — Imágenes:
  - Drag & drop zone
  - Upload a Cloudinary via backend
  - Preview de imágenes subidas
  - Reordenamiento (drag para cambiar imagen principal)
  - Máximo 5 imágenes por producto

Sección 4 — Disponibilidad y Pedido:
  - Toggle: Disponible / No disponible
  - Toggle: Producto destacado (aparece en Home)
  - Nota de pedido (textarea): ej "Se realiza martes y jueves"
  - Anticipación: [número] horas
  - ¿Requiere seña? Toggle → % de seña

Botones:
  - "Guardar" (POST/PUT)
  - "Cancelar" (volver)
```

### 8.5 Gestión de Categorías (`/admin/categorias`)

```
Lista con drag & drop para reordenar (usando @dnd-kit/core)
Por cada categoría:
  - Nombre
  - Emoji
  - Cantidad de productos
  - Activa/Inactiva toggle
  - Botón editar (inline o modal)

Formulario de categoría:
  - Nombre *
  - Slug (auto-generado, editable)
  - Descripción
  - Emoji
  - Orden (auto por posición en drag)
```

---

## 9. VARIABLES DE ENTORNO

### Frontend `.env` (Vercel)

```env
# API
VITE_API_URL=https://val-postress-api.onrender.com/api

# Cloudinary (solo para cliente de upload directo si se implementa)
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name

# App
VITE_APP_NAME=Val Postress
VITE_INSTAGRAM_URL=https://instagram.com/val.postress
```

### Backend `.env` (Render)

```env
# Server
NODE_ENV=production
PORT=5000

# MongoDB
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/val-postress

# JWT
JWT_SECRET=una_clave_secreta_muy_larga_y_random_minimo_64_chars
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Admin inicial (para el seed)
ADMIN_USERNAME=val_admin
ADMIN_PASSWORD=password_seguro_aqui
ADMIN_EMAIL=val@postress.com

# CORS
CORS_ORIGIN=https://val-postress.vercel.app
```

---

## 10. ESTRATEGIA DE DEPLOY

### 10.1 Frontend — Vercel

```
1. Conectar repo GitHub a Vercel
2. Framework preset: Vite
3. Build command: npm run build
4. Output directory: dist
5. Root directory: frontend/

Variables de entorno en Vercel Dashboard:
  VITE_API_URL → URL del backend de Render
  VITE_CLOUDINARY_CLOUD_NAME → cloud name

Domain: val-postress.vercel.app (o dominio custom si tiene)

Preview deployments: automáticos en cada PR (útil para testear)
```

### 10.2 Backend — Render

```
1. Conectar repo GitHub a Render
2. Type: Web Service
3. Runtime: Node
4. Build command: npm install
5. Start command: node index.js  (o npm start)
6. Root directory: backend/
7. Plan: Free (con cold start de ~30s, aceptable para MVP)

Variables de entorno: configurar todas las del .env en Render Dashboard

Health check: GET /api/health → { status: 'ok' }

IMPORTANTE en Free de Render:
  - El servicio "duerme" después de 15min de inactividad
  - Solución: implementar un ping cada 14min desde el frontend
    (tiny useEffect en App.jsx que llama /api/health al montar)
  - O upgrade a $7/mes starter para uptime 24/7
```

### 10.3 MongoDB Atlas

```
1. Crear cluster M0 (Free)
2. Crear usuario DB con read/write
3. Whitelist IP: 0.0.0.0/0 (allow all, para Render con IP dinámica)
4. Connection string → MONGO_URI en Render
5. Crear índices manualmente o via Mongoose:
   - products: slug (unique), category (index), isAvailable (index)
   - categories: slug (unique), order (index)
```

### 10.4 Cloudinary

```
1. Crear cuenta free (25GB storage, 25GB bandwidth/mes)
2. Crear una carpeta: val-postress/products
3. Configurar upload preset (unsigned, para subida desde admin)
4. Credenciales → en ambos .env (backend para server upload)
```

---

## 11. ROADMAP DE DESARROLLO

### FASE 1 — Setup y Fundamentos (1-2 días)

```
[ ] Inicializar repos (monorepo o 2 repos separados según preferencia)
[ ] Setup Frontend: Vite + React + Tailwind + ESLint + Prettier
[ ] Configurar CSS variables y tokens de diseño en globals.css
[ ] Setup Backend: Express + Mongoose + estructura de carpetas
[ ] Conexión a MongoDB Atlas
[ ] Setup Cloudinary
[ ] Seed inicial con todos los productos del catálogo PDF
[ ] Configurar CORS correctamente
```

### FASE 2 — Backend Core (2-3 días)

```
[ ] Modelos: Category, Product, Admin
[ ] Auth: login, JWT middleware, protección de rutas
[ ] CRUD completo de categorías
[ ] CRUD completo de productos
[ ] Endpoint de upload de imágenes (Multer → Cloudinary)
[ ] Endpoint PATCH para cambio rápido de precios/disponibilidad
[ ] Middleware de errores global
[ ] Validaciones con express-validator
[ ] Ruta /api/health para health check
[ ] Testing manual con Thunder Client / Postman
```

### FASE 3 — Frontend Público (3-4 días)

```
[ ] Configurar React Router
[ ] Axios instance con interceptors
[ ] React Query setup
[ ] Componentes UI base: Button, Badge, Card, Modal, Spinner
[ ] Navbar + Footer
[ ] Página Home completa:
    [ ] Hero
    [ ] Categorías destacadas
    [ ] Productos destacados
    [ ] Sobre Val
    [ ] Info importante
    [ ] CTA + Contacto
[ ] Página Catálogo:
    [ ] CategoryNav sticky con scrollspy
    [ ] Secciones por categoría
    [ ] ProductCard con badge de no disponible
    [ ] ProductModal con detalle completo
[ ] Animaciones con Framer Motion
[ ] Responsivo completo (mobile first)
[ ] Optimización de imágenes (lazy loading)
```

### FASE 4 — Panel de Admin (2-3 días)

```
[ ] Login page + AuthStore (Zustand)
[ ] ProtectedRoute guard
[ ] AdminLayout con sidebar
[ ] Dashboard con resumen
[ ] Tabla de productos con búsqueda y filtros
[ ] Formulario de producto completo:
    [ ] Fields básicos
    [ ] Sistema de variantes dinámico
    [ ] Upload de imágenes con preview
    [ ] Toggle disponibilidad / destacado
[ ] Gestión de categorías con drag & drop
[ ] Cambio de contraseña
```

### FASE 5 — Polish y Deploy (1-2 días)

```
[ ] SEO básico: meta tags, og:image, og:title
[ ] Favicon y manifest
[ ] Variables de entorno en Vercel y Render
[ ] Deploy frontend en Vercel
[ ] Deploy backend en Render
[ ] Deploy y test en producción
[ ] Ping keep-alive para Render free tier
[ ] Test completo en mobile
[ ] Entregar credenciales de admin a Val
```

---

## 12. CONSIDERACIONES TÉCNICAS EXTRA

### Seguridad

```
- JWT en localStorage (para admin panel simple está bien; si se necesita más
  seguridad en el futuro, migrar a httpOnly cookies)
- Passwords: bcrypt con salt rounds 12
- Helmet.js en Express para headers de seguridad
- Rate limiting en endpoints de auth (express-rate-limit):
  máximo 5 intentos de login por IP cada 15 minutos
- Variables sensibles NUNCA en el código, siempre en .env
- CORS: whitelist solo el dominio de Vercel en producción
- Validación de inputs en backend siempre (no confiar solo en el frontend)
```

### Performance

```
Frontend:
- Code splitting automático con Vite (lazy imports por ruta)
- React.lazy() para el Admin Panel (no cargar si no es admin)
- Imágenes: usar srcset y sizes, formato WebP desde Cloudinary
  Ejemplo URL Cloudinary: .../upload/f_webp,q_auto,w_600/...
- React Query: cache de 5 minutos para el catálogo público

Backend:
- Lean queries en Mongoose: .lean() para GET públicos
- Limitar fields en queries: .select('name price images isAvailable')
- Paginación en endpoints de admin (aunque no hay miles de productos,
  es buena práctica)
```

### Experiencia de Usuario

```
- Skeleton loaders mientras carga el catálogo
- Optimistic updates en el admin (actualizar UI antes de que confirme el server)
- Toast notifications para acciones del admin
- Scroll restoration al volver de product detail a catálogo
- Link de WhatsApp/Instagram para pedidos:
  https://instagram.com/val.postress
  (deep link: https://ig.me/m/val.postress para DM directo)
```

### Accesibilidad Básica

```
- Alt text en todas las imágenes de productos
- Roles ARIA en el modal (role="dialog", aria-modal="true")
- Focus trap en modales
- Contraste de colores: verificar con paleta elegida (mínimo 4.5:1)
- Labels en todos los inputs del admin
```

### SEO

```
- Title dinámico por página usando React Helmet Async
- Open Graph tags para compartir en redes:
  og:title, og:description, og:image (foto de un producto destacado)
- Meta description
- URLs semánticas: /catalogo, /catalogo/chocotorta
- (Opcional futuro) Generar sitemap.xml
```

---

## RESUMEN EJECUTIVO

| Aspecto | Decisión |
|---|---|
| **Frontend** | React + Vite + Tailwind + Framer Motion |
| **Backend** | Node.js + Express + MongoDB Atlas |
| **Auth** | JWT, bcrypt, solo para admin |
| **Imágenes** | Cloudinary (free tier) |
| **Deploy FE** | Vercel (automático desde GitHub) |
| **Deploy BE** | Render Free (con keep-alive workaround) |
| **Estado cliente** | React Query (server state) + Zustand (auth) |
| **Formularios admin** | React Hook Form + Zod |
| **Drag & drop** | @dnd-kit (categorías) |
| **Notificaciones** | React Hot Toast |
| **Tiempo estimado** | 10–14 días de desarrollo |

---

> **Nota para el equipo:** Los precios del catálogo están en el seed inicial pero
> serán totalmente gestionables desde el panel de admin. Val podrá actualizar
> cualquier precio, disponibilidad, o agregar productos nuevos sin tocar código.

---
*Plan generado para Val Postress · Abril 2025*
