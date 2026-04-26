# 🧁 Val Postress — Catálogo Digital

Catálogo digital premium para **Val Postress**, una pastelería artesanal. Permite a los clientes explorar productos, armar un pedido y enviarlo directamente por WhatsApp. Incluye un panel de administración completo para gestionar productos y categorías.

---

## 📸 Preview

| Home | Catálogo | Admin |
|:---:|:---:|:---:|
| Hero editorial con carousel | Productos agrupados por categoría | Drag & Drop de categorías |

---

## 🏗️ Arquitectura

```
CatalogoVal/
├── backend/          # API REST (Express + MongoDB)
│   ├── src/
│   │   ├── config/       # DB y Cloudinary config
│   │   ├── controllers/  # Lógica de negocio
│   │   ├── middleware/    # Auth, upload, validation, errors
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # Endpoints
│   │   ├── seeds/        # Scripts de datos y migraciones
│   │   ├── utils/        # Helpers (JWT, response formatter)
│   │   └── validators/   # express-validator rules
│   └── index.js          # Entry point
│
├── frontend/         # SPA (React + Vite)
│   ├── src/
│   │   ├── assets/       # Imágenes estáticas (logos, banners)
│   │   ├── components/   # UI reutilizable (cart, layout, ui)
│   │   ├── pages/        # Vistas (Home, Catalog, Admin)
│   │   ├── services/     # Axios API client
│   │   └── store/        # Zustand (carrito persistente)
│   └── index.html
│
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend
| Tecnología | Versión | Uso |
|---|---|---|
| React | 19.2 | UI Library |
| Vite | 8.0 | Build tool & dev server |
| TailwindCSS | 3.4 | Utility-first CSS |
| Framer Motion | 12.x | Animaciones |
| React Router | 7.x | Navegación SPA |
| React Query | 5.x | Cache & data fetching |
| Zustand | 5.x | State management (carrito) |
| Lucide React | 1.9 | Iconos SVG |
| React Hook Form + Zod | 7.x / 4.x | Formularios con validación |
| @dnd-kit | 6.x | Drag & Drop (admin) |
| SweetAlert2 | 11.x | Modals de confirmación |

### Backend
| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | 20+ | Runtime |
| Express | 5.2 | Framework HTTP |
| MongoDB + Mongoose | 9.5 | Base de datos |
| Cloudinary | 2.9 | CDN de imágenes |
| JWT (jsonwebtoken) | 9.x | Autenticación |
| bcryptjs | 3.x | Hash de contraseñas |
| Helmet | 8.x | Headers de seguridad HTTP |
| express-rate-limit | — | Protección anti fuerza bruta |
| Multer | 2.1 | Upload de archivos |
| express-validator | 7.x | Validación de inputs |

---

## ⚡ Inicio Rápido

### Prerequisitos
- Node.js 20+
- MongoDB Atlas (o local)
- Cuenta Cloudinary (gratuita)

### 1. Clonar repositorio
```bash
git clone https://github.com/OnlyAlayy/CatalogoVal.git
cd CatalogoVal
```

### 2. Configurar Backend
```bash
cd backend
npm install
```

Crear archivo `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<db>
JWT_SECRET=<generar_con_crypto_randomBytes_64>
CLOUDINARY_CLOUD_NAME=<tu_cloud_name>
CLOUDINARY_API_KEY=<tu_api_key>
CLOUDINARY_API_SECRET=<tu_api_secret>
ADMIN_USERNAME=val_admin
ADMIN_PASSWORD=<tu_password_segura>
ADMIN_EMAIL=admin@tudominio.com
CORS_ORIGIN=http://localhost:5173
```

> 💡 Para generar un JWT_SECRET seguro: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### 3. Configurar Frontend
```bash
cd frontend
npm install
```

Crear archivo `frontend/.env` (opcional):
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Ejecutar en desarrollo
```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Admin: http://localhost:5173/admin/login

### 5. Seed de datos (primera vez)
```bash
cd backend
npm run seed           # Carga categorías y productos iniciales
npm run seed:images    # Sube imágenes a Cloudinary
```

---

## 🔐 Seguridad

| Feature | Detalle |
|---|---|
| Autenticación | JWT Bearer tokens con expiración 7 días |
| Contraseñas | bcrypt con salt factor 12 |
| Headers HTTP | Helmet (X-Frame-Options, CSP, HSTS, etc.) |
| Rate Limiting | 100 req/15min global, 5 req/15min en login |
| Validación | express-validator en todas las rutas protegidas |
| Uploads | Filtro MIME type (jpg/png/webp) + máximo 5MB |
| Cloudinary | Borrado restringido a carpeta `val_postress_catalog/` |
| Secretos | `.gitignore` protege `.env`, `uploads/`, `node_modules/` |

---

## 📡 API Endpoints

### Públicos
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/products` | Listar productos (filtros: category, featured, available) |
| GET | `/api/products/:slug` | Producto por slug |
| GET | `/api/categories` | Listar categorías activas |

### Protegidos (requieren JWT)
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Login admin |
| GET | `/api/auth/me` | Info del admin autenticado |
| POST | `/api/products` | Crear producto |
| PUT | `/api/products/:id` | Actualizar producto |
| PATCH | `/api/products/:id/availability` | Toggle disponibilidad |
| PATCH | `/api/products/:id/price` | Cambiar precio/variantes |
| DELETE | `/api/products/:id` | Eliminar producto + imágenes |
| POST | `/api/products/upload-image` | Subir imagen a Cloudinary |
| POST | `/api/products/delete-image` | Eliminar imagen de Cloudinary |
| POST | `/api/categories` | Crear categoría |
| PUT | `/api/categories/:id` | Actualizar categoría |
| PATCH | `/api/categories/reorder` | Reordenar categorías (Drag & Drop) |
| DELETE | `/api/categories/:id` | Eliminar categoría (soft delete) |

---

## 🚀 Deploy a Producción

### Variables de entorno requeridas
```env
NODE_ENV=production
CORS_ORIGIN=https://tu-dominio.com
# ... (mismas variables del .env de desarrollo)
```

### Frontend (Vercel / Netlify)
```bash
cd frontend
npm run build   # Genera carpeta dist/
```

### Backend (Render / Railway / Fly.io)
```bash
cd backend
npm start       # Ejecuta node index.js
```

---

## 📋 Funcionalidades

### 🏠 Home
- Hero animado con Ken Burns effect
- Sección de productos destacados
- Integración WhatsApp
- Diseño editorial premium (Ladurée-inspired)

### 📖 Catálogo
- Productos agrupados por categoría
- Navegación sticky con scroll horizontal
- Carrusel de imágenes por producto
- Modal de detalle con selector de variantes
- Carrito persistente con resumen y envío por WhatsApp

### 👩‍💼 Panel de Administración
- Login seguro con JWT
- Dashboard con métricas
- CRUD de productos con subida múltiple de imágenes
- CRUD de categorías con Drag & Drop para reordenar
- Selector visual de íconos SVG (Lucide React)
- Toggle rápido de disponibilidad
- Gestión de variantes y precios

---

## 📄 Licencia

Este proyecto es privado y fue desarrollado para **Val Postress**.

---

*Desarrollado con ❤️ por [OnlyAlayy](https://github.com/OnlyAlayy)*
