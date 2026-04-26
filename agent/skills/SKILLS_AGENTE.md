# SKILLS DEL AGENTE — VAL POSTRESS
# Prompts especializados para tareas recurrentes del proyecto

---

## SKILL 01 — CREAR COMPONENTE UI

```
Necesito que crees el componente [NOMBRE] para Val Postress.

CONTEXTO:
- Es un [card / modal / section / form / nav] que [describe qué hace]
- Lo usa [la página pública del catálogo / el panel de admin]
- Recibe como props: [lista de props o "definí vos las props necesarias"]

REGLAS ESTRICTAS A SEGUIR:
- Cero emojis en texto visible, labels, o placeholders
- Solo colores de la paleta: var(--color-brand-primary), var(--color-bg-primary), etc.
- Fuentes: Cormorant Garamond para headings de producto, DM Sans para UI
- border-radius máximo: rounded (4px) en cards, rounded-sm (2px) en botones
- Animaciones: solo framer-motion, sutiles. fade-in al montar, hover scale(1.02) en botones
- Responsive mobile-first. Breakpoints sm: md: lg:
- Estado de loading: skeleton placeholder
- Estado de error: mensaje en español sin jerga técnica
- Estado vacío: UI descriptiva, no pantalla en blanco
- Sin console.log
- Sin fetch() directo: datos vienen de un hook de React Query como prop o via hook

ESTRUCTURA ESPERADA DEL ARCHIVO:
1. Imports
2. Definición de props (destructuradas con defaults)
3. Hooks y lógica local
4. Return con JSX limpio
5. Export default

Máximo 200 líneas. Si es más, avisame para dividirlo.
```

---

## SKILL 02 — CREAR ENDPOINT DE API

```
Necesito que crees el endpoint [MÉTODO] /api/[ruta] para Val Postress.

FUNCIONALIDAD:
[Describir qué debe hacer el endpoint]

DATOS DE ENTRADA:
[body / query params / route params esperados]

DATOS DE SALIDA:
[qué debe retornar]

AUTENTICACIÓN: [Requiere JWT de admin / Es público]

REGLAS OBLIGATORIAS:
- Usar asyncHandler wrapper para no repetir try/catch
- Validación completa con express-validator antes de llegar al controller
- Respuesta siempre con apiResponse helper: { success, data, message }
- Status HTTP correcto: 200 GET, 201 POST, 400 bad request, 401 no auth,
  404 not found, 422 validación, 500 error server
- Usar .lean() en queries de lectura pública
- Seleccionar solo campos necesarios con .select()
- Manejar explícitamente el caso null/not found
- Sin datos sensibles en la respuesta (nunca retornar password)
- Logs de error solo en el middleware global, no en cada controller

ARCHIVOS A GENERAR O MODIFICAR:
- /routes/[recurso].routes.js
- /controllers/[recurso].controller.js
- /validators/[recurso].validator.js (si aplica)
```

---

## SKILL 03 — CREAR O MODIFICAR SCHEMA DE MONGOOSE

```
Necesito que crees/modifiques el schema Mongoose para [MODELO] en Val Postress.

CAMPOS NECESARIOS:
[lista de campos con tipo y descripción]

RELACIONES:
[referencias a otros modelos si las hay]

REGLAS:
- Agregar timestamps: true
- Agregar un slug field con índice único (auto-generado en pre-save hook con slugify)
- Agregar campo order: Number para controlar el orden de aparición
- Agregar isActive/isAvailable: Boolean para soft delete o disponibilidad
- Los arrays de strings (imágenes, ingredientes) con default: []
- Los subschemas van fuera del schema principal (ej: variantSchema)
- Pre-save hook para hashear password si es el modelo Admin
- Índices explícitos para campos que se consultan frecuentemente
- Métodos de instancia si hay lógica que pertenece al modelo

TAMBIÉN INCLUIR:
- El validator de express-validator correspondiente
- Un ejemplo de documento seed para este modelo
```

---

## SKILL 04 — CREAR PÁGINA COMPLETA

```
Necesito que crees la página [NOMBRE] (/ruta) para Val Postress.

DESCRIPCIÓN:
[Qué muestra y qué hace esta página]

SECCIONES / CONTENIDO:
[Lista de secciones o contenido esperado]

DATOS QUE NECESITA:
[Qué data fetcha, de qué endpoints, con qué parámetros]

REGLAS DE DISEÑO — CRÍTICAS:
- Sin emojis absolutamente en ninguna parte
- Fondo de página: bg-[--color-bg-primary] o bg-[--color-bg-secondary] por sección
- Primera sección (hero o header de página): puede usar bg-[--color-bg-dark] con texto claro
- Tipografía: Cormorant Garamond para títulos principales, DM Sans para todo lo demás
- Separadores entre secciones: línea fina en color brand-light, o cambio de fondo
- Animaciones de entrada: fade-in staggered con Framer Motion al hacer scroll
- Layout: max-w-7xl centrado, padding px-4 sm:px-6 lg:px-8
- Mobile first. Testar mentalmente en 375px, 768px, 1280px.
- Skeleton loaders mientras cargan los datos
- Manejo de error de red con mensaje retry

ARCHIVOS A GENERAR:
- /pages/[NombrePagina].jsx
- Componentes específicos de la página en /components/[seccion]/
- Hook si se necesita lógica reutilizable en /hooks/use[Feature].js
```

---

## SKILL 05 — DEBUGGING DE BUG

```
Tengo un bug en Val Postress. Te paso el contexto:

SÍNTOMA:
[Qué está pasando mal, qué mensaje de error aparece]

CÓDIGO RELEVANTE:
[pegar el código]

CONTEXTO:
- Entorno: [dev local / staging / producción]
- Stack: [frontend React / backend Express / MongoDB query]
- Cuándo ocurre: [siempre / solo en mobile / solo con X datos / intermitente]

QUIERO QUE:
1. Identifiques la causa raíz (no solo el síntoma)
2. Propongas la solución más simple posible
3. Verifiques si la solución puede tener efectos secundarios
4. Me digas si hay que cambiar tests o validaciones relacionadas

Si es un bug de datos/MongoDB, incluí la query corregida y explicá
por qué la original fallaba.
```

---

## SKILL 06 — FORMULARIO DE ADMIN

```
Necesito el formulario de admin para [crear/editar] [RECURSO].

CAMPOS:
[Lista de campos con tipo de input, validación, y si es requerido]

CASOS ESPECIALES:
[ej: "precio tiene dos modos: único o variantes", "imágenes con drag&drop"]

REGLAS:
- React Hook Form con Controller para campos controlados
- Schema de validación con Zod (definir el schema primero)
- Errores inline bajo cada campo: texto en --color-error, tamaño text-sm
- Sin emojis en labels ni placeholders ni mensajes de error
- Labels: DM Sans, text-sm, color --color-text-secondary, font-medium
- Inputs: border 1px --color-brand-light, focus ring --color-brand-primary
- Botón submit: deshabilitado y con spinner mientras isSubmitting
- useMutation de React Query para el POST/PUT
- Toast de éxito "Guardado correctamente" al completar
- Toast de error descriptivo si falla la API
- Redirect a la lista después de guardar exitosamente
- Si es edición: precargar los valores actuales con defaultValues de useForm
```

---

## SKILL 07 — OPTIMIZACIÓN DE PERFORMANCE

```
Necesito optimizar [COMPONENTE / PÁGINA / QUERY] en Val Postress.

CONTEXTO ACTUAL:
[Describir qué hace ahora y cuál es el problema de performance]

MÉTRICAS (si las tenés):
[Tiempo de carga, tamaño del bundle, etc.]

QUIERO QUE APLIQUES:
- Code splitting si corresponde (React.lazy + Suspense)
- Memoización solo donde hay re-renders demostrados (no optimización prematura)
- Transformaciones de imagen Cloudinary: f_webp,q_auto,w_[ancho] según contexto
- React Query: configurar staleTime y cacheTime apropiados
- Lazy loading de imágenes con loading="lazy" o Intersection Observer
- Si es una lista larga: virtualización con @tanstack/react-virtual

RESTRICCIONES:
- No cambiar la UI visible al usuario
- No romper el sistema de diseño
- Cada optimización debe ser justificada, no "por las dudas"
```

---

## SKILL 08 — SEGURIDAD Y VALIDACIÓN

```
Revisá la seguridad de [COMPONENTE / ENDPOINT / FLUJO] en Val Postress.

QUÉ REVISAR:
[ ] Inputs validados en backend con express-validator
[ ] JWT verificado en rutas protegidas
[ ] Password nunca expuesta en respuestas
[ ] Rate limiting en endpoints de auth
[ ] CORS configurado solo para el dominio de Vercel en producción
[ ] Variables de entorno no hardcodeadas
[ ] Imágenes: tipos de archivo validados, tamaño máximo
[ ] NoSQL injection: mongo-sanitize aplicado
[ ] Headers de seguridad: Helmet activo

SI ENCONTRÁS VULNERABILIDADES:
1. Describí el riesgo concreto (qué podría hacer un atacante)
2. Proporcioná el fix específico
3. Ordená por prioridad: crítico / medio / bajo
```

---

## SKILL 09 — DEPLOY Y CONFIGURACIÓN

```
Necesito configurar/revisar el deploy de Val Postress.

COMPONENTE:
[ ] Frontend en Vercel
[ ] Backend en Render
[ ] MongoDB Atlas
[ ] Cloudinary

TAREA:
[Describir qué necesitás configurar o el problema que tenés]

CHECKLIST QUE DEBE VERIFICARSE:
Frontend (Vercel):
- [ ] VITE_API_URL apunta a la URL de Render (https, no http)
- [ ] Build command: npm run build desde directorio frontend/
- [ ] Output directory: dist
- [ ] Sin variables VITE_ con datos sensibles

Backend (Render):
- [ ] NODE_ENV=production
- [ ] CORS_ORIGIN coincide exactamente con el dominio de Vercel
- [ ] MONGO_URI desde Atlas con usuario/pass correctos
- [ ] JWT_SECRET: mínimo 64 caracteres, generado aleatoriamente
- [ ] Health check en /api/health responde 200
- [ ] Keep-alive implementado (ping cada 14min desde frontend si es free tier)

MongoDB Atlas:
- [ ] IP whitelist: 0.0.0.0/0 para Render (IP dinámica)
- [ ] Usuario tiene solo permisos read/write, no admin
```

---

## SKILL 10 — SEED DE BASE DE DATOS

```
Necesito crear/actualizar el seed de datos iniciales para Val Postress.

DATOS A POBLAR:
Basate en el catálogo oficial. Los datos son:

CATEGORÍAS (en orden):
1. Postres Individuales
2. Shots
3. Cookies
4. Mini Donas
5. Alfajores de Maicena
6. Alfajores Chocochips

PRODUCTOS:
[Ver PLAN_ValPostress.md sección "Productos del Catálogo" para la lista completa]

REGLAS DEL SEED:
- El seed debe ser idempotente: si se corre dos veces no duplica datos
  (usar findOneAndUpdate con upsert:true, o borrar y recrear)
- Generar slugs desde los nombres
- El admin inicial se crea desde las variables ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_EMAIL del .env
- El password del admin siempre hasheado con bcrypt, nunca en texto plano en el seed
- Productos con isAvailable: false para los marcados como "No disponible" en el catálogo
- El seed muestra en consola qué creó y qué actualizó
- Archivo: /backend/src/seeds/seed.js
- Ejecutable con: npm run seed (script en package.json)
```

---

## SKILL 11 — HOOK DE REACT QUERY

```
Necesito el hook de React Query para [RECURSO] en Val Postress.

OPERACIONES NECESARIAS:
[ ] useQuery para listar todos
[ ] useQuery para obtener uno por id/slug
[ ] useMutation para crear
[ ] useMutation para actualizar
[ ] useMutation para eliminar
[ ] useMutation para cambio rápido de disponibilidad / precio

REGLAS:
- Query keys como arrays descriptivos: ['products'], ['product', slug]
- staleTime: 5 * 60 * 1000 para catálogo público / 0 para panel admin
- onSuccess en mutations: invalidateQueries de las queries relacionadas
- onError en mutations: mostrar toast de error con el mensaje de la API
- Separar hooks de lectura pública de los de admin (usan diferentes configs)
- Exportar cada hook con nombre descriptivo: useProducts, useProduct, useCreateProduct, etc.
- Archivo en /frontend/src/hooks/use[Recurso].js
```

---

## SKILL 12 — REVISAR RESPONSIVIDAD

```
Necesito que revises la responsividad de [COMPONENTE / PÁGINA].

BREAKPOINTS A VERIFICAR:
- 375px: iPhone SE, el más chico que debe funcionar perfectamente
- 390px: iPhone 14 (más común)
- 768px: iPad vertical
- 1024px: iPad horizontal / laptop chica
- 1280px: desktop estándar

ASPECTOS A REVISAR:
- Texto: no hay overflow horizontal, no hay texto cortado
- Imágenes: mantienen aspect-ratio, no se distorsionan
- Grids: colapsan correctamente (3 cols → 2 cols → 1 col)
- Navbar: menú hamburger en mobile funciona y cierra al clickear un link
- Modales: ocupan bien la pantalla en mobile (casi fullscreen)
- Formularios admin: inputs con ancho correcto, no overflow
- CategoryNav: scroll horizontal en mobile sin scrollbar visible
- Botones: mínimo 44px de alto en mobile (accesibilidad táctil)
- Espaciados: menos padding en mobile, más en desktop

CÓDIGO ACTUAL:
[pegar JSX + clases de Tailwind]

QUIERO:
Las clases de Tailwind corregidas y una explicación de cada cambio.
```
