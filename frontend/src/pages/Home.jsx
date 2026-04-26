import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChefHat, Palette, Gift } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useProducts } from '../hooks/useProducts';
import eventImg from '../assets/images/Imagen1.png';
import eventImg2 from '../assets/images/Imagen2.png';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.12 }
  }
};

// ─── Golden Particles ───
const GoldenParticles = () => {
  const particles = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 6,
      duration: Math.random() * 4 + 5,
      opacity: Math.random() * 0.4 + 0.1,
    }))
    , []);

  return (
    <div className="absolute inset-0 z-[11] pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(212,184,150,${p.opacity}) 0%, transparent 70%)`,
            boxShadow: `0 0 ${p.size * 3}px rgba(212,184,150,${p.opacity * 0.6})`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [p.opacity * 0.5, p.opacity, p.opacity * 0.5],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// ─── Product Card for Featured Section ───
const FeaturedProductCard = ({ product, index }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price);
  };

  const price = product.variants && product.variants.length > 0
    ? Math.min(...product.variants.map(v => v.price))
    : product.price;

  const mainImage = product.images && product.images.length > 0
    ? (product.images[0]?.url || product.images[0])
    : null;

  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link to="/catalogo" className="block">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-bg-secondary shadow-card group-hover:shadow-card-hover transition-all duration-500">
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted text-xs font-sans tracking-wide uppercase">
              Foto no disponible
            </div>
          )}
          {/* Subtle gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        <h3 className="font-serif text-lg text-text-primary font-medium mb-1 group-hover:text-brand-primary transition-colors duration-300">
          {product.name}
        </h3>
        <p className="font-sans text-sm text-brand-primary font-semibold">
          {price ? (product.variants && product.variants.length > 0 ? `Desde ${formatPrice(price)}` : formatPrice(price)) : 'Consultar'}
        </p>
      </Link>
    </motion.div>
  );
};


export const Home = () => {
  const { data: products } = useProducts();

  // Get first 4 available products for featured section
  const featuredProducts = useMemo(() => {
    if (!products) return [];
    return products
      .filter(p => p.isAvailable && p.images && p.images.length > 0)
      .slice(0, 4);
  }, [products]);

  return (
    <div className="flex flex-col">

      {/* ─── Hero ─── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background image with Ken Burns */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0.8)_100%)] z-10" />
          <div className="absolute inset-0 bg-black/20 z-10" />
          <img
            src="https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=2070&auto=format&fit=crop"
            alt="Pastelería artesanal"
            className="w-full h-full object-cover animate-ken-burns"
          />
        </div>

        {/* Golden particles */}
        <GoldenParticles />

        {/* Content */}
        <div className="relative z-20 text-center px-6 max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="font-cursive text-3xl md:text-5xl bg-gradient-to-r from-[#D4B896] via-[#E6D5B8] to-[#D4B896] bg-clip-text text-transparent mb-6 drop-shadow-sm"
            >
              Pastelería Artesanal
            </motion.p>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-light text-white mb-8 leading-[1.1] tracking-tight drop-shadow-lg"
            >
              Arte en cada<br />
              <span className="italic text-white/90">bocado</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base md:text-lg text-white/80 mb-12 font-sans font-light max-w-lg mx-auto leading-relaxed tracking-wide drop-shadow-md"
            >
              Postres artesanales hechos con dedicación y los mejores ingredientes.
              Cada creación es única.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link to="/catalogo">
                <Button size="lg" className="w-full sm:w-auto rounded-full px-10 text-sm tracking-wide">
                  Ver Catálogo
                </Button>
              </Link>
              <a
                href="https://instagram.com/val.postress"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-10 text-sm tracking-wide border-white/40 text-white bg-white/5 backdrop-blur-sm hover:bg-white/15 hover:text-white hover:border-white/50">
                  Seguinos
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>


      </section>


      {/* ─── Featured Products ─── */}
      {featuredProducts.length > 0 && (
        <section className="section-spacing bg-bg-primary">
          <div className="container-custom">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
            >
              {/* Section header */}
              <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="text-center mb-14">
                <span className="section-label">Lo más pedido</span>
                <h2 className="section-title mb-4">Nuestros Favoritos</h2>
                <p className="section-subtitle mx-auto">
                  Descubrí los productos más pedidos por nuestros clientes.
                </p>
              </motion.div>

              {/* Products grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8 mb-12">
                {featuredProducts.map((product, i) => (
                  <FeaturedProductCard key={product._id} product={product} index={i} />
                ))}
              </div>

              {/* CTA */}
              <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="text-center">
                <Link to="/catalogo">
                  <Button variant="outline" size="lg" className="rounded-full group px-8">
                    Ver todo el catálogo
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}


      {/* ─── About — Split Layout ─── */}
      <section className="section-spacing bg-bg-secondary">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Image */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
              transition={{ duration: 0.7 }}
            >
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-card aspect-square">
                  <img
                    src={eventImg2}
                    alt="Postres artesanales Val Postress"
                    className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700"
                  />
                </div>
                {/* Decorative floating badge */}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-card-hover px-6 py-4 hidden md:flex flex-col items-center">
                  <span className="font-cursive text-2xl text-brand-primary">Val</span>
                  <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-text-muted">Postres</span>
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
              className="space-y-8"
            >
              <motion.span variants={fadeUp} transition={{ duration: 0.5 }} className="section-label">
                Nuestra esencia
              </motion.span>

              <motion.h2
                variants={fadeUp}
                transition={{ duration: 0.6 }}
                className="section-title"
              >
                Sobre Val Postres
              </motion.h2>

              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.6 }}
                className="section-subtitle"
              >
                En Val Postres hacemos postres artesanales con dedicación y los mejores ingredientes.
                Desde nuestros clásicos postres individuales de chocotorta y cheesecake,
                hasta shots, cookies, mini donas y alfajores — cada producto está hecho a pedido
                para que lo disfrutes siempre fresco.
              </motion.p>

              <motion.ul
                variants={fadeUp}
                transition={{ duration: 0.6 }}
                className="space-y-4 text-text-secondary font-sans text-[15px]"
              >
                {[
                  '100% artesanal — hecho a mano con amor',
                  'Ingredientes frescos y de primera calidad',
                  'Hecho a pedido — siempre fresco para vos',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ─── Featured / Event CTA ─── */}
      <section className="section-spacing bg-bg-primary">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Text */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
              className="space-y-8"
            >
              <motion.span variants={fadeUp} transition={{ duration: 0.5 }} className="section-label">
                Para tus eventos
              </motion.span>

              <motion.h2
                variants={fadeUp}
                transition={{ duration: 0.6 }}
                className="section-title"
              >
                ¿Tenés un evento<br />especial?
              </motion.h2>

              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.6 }}
                className="section-subtitle"
              >
                Para consultar sabores, diseños o pedidos personalizados, escribime.
                Navegá por el catálogo para ver todos los productos disponibles y sus precios.
              </motion.p>

              <motion.ul
                variants={fadeUp}
                transition={{ duration: 0.6 }}
                className="space-y-4 text-text-secondary font-sans text-[15px]"
              >
                {[
                  'Postres individuales — Chocotorta, Oreo, Cheesecake y más',
                  'Shots, cookies y mini donas',
                  'Alfajores de maicena y chocochips',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1 h-1 rounded-full bg-brand-primary mt-2.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </motion.ul>

              <motion.div variants={fadeUp} transition={{ duration: 0.6 }}>
                <Link to="/catalogo">
                  <Button variant="outline" size="lg" className="rounded-full group">
                    Explorar Catálogo
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
              transition={{ duration: 0.7 }}
            >
              <div className="rounded-2xl overflow-hidden shadow-card aspect-[4/5]">
                <img
                  src={eventImg}
                  alt="Mesa dulce Val Postress"
                  className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ─── Info Cards ─── */}
      <section className="section-spacing bg-bg-secondary">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                title: 'Hecho a pedido',
                desc: 'Todos nuestros productos son artesanales y hechos a pedido con ingredientes frescos.',
                Icon: ChefHat,
              },
              {
                title: 'Consultá sabores',
                desc: 'Variedad de sabores para shots, postres y cookies. Consultá por más opciones.',
                Icon: Palette,
              },
              {
                title: 'Pedidos personalizados',
                desc: 'Armamos bandejas y combos a medida para eventos, cumpleaños o para disfrutar en casa.',
                Icon: Gift,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="bg-white p-10 rounded-2xl shadow-soft text-center group hover:shadow-card-hover transition-all duration-400 border border-black/[0.03]"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-rose/50 text-brand-primary mb-5 group-hover:bg-brand-primary group-hover:text-white transition-all duration-400">
                  <item.Icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl text-text-primary mb-3 font-medium">{item.title}</h3>
                <p className="text-text-muted text-sm font-sans leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* ─── Final CTA ─── */}
      <section className="py-28 md:py-36 bg-[#1C1210] relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,94,60,0.12)_0%,_transparent_70%)]" />

        <div className="container-custom text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.span
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="text-[11px] font-sans font-medium uppercase tracking-[0.25em] text-[#D4B896]/60 mb-6 block"
            >
              ¿Listo para pedir?
            </motion.span>

            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-serif font-light text-white mb-6 leading-tight"
            >
              Tu próximo postre<br />te espera
            </motion.h2>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="text-[#9C8578] font-sans mb-12 max-w-md mx-auto text-sm font-light leading-relaxed"
            >
              Explorá nuestro catálogo o escribinos directamente por Instagram para hacer tu pedido.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link to="/catalogo">
                <Button size="lg" className="w-full sm:w-auto rounded-full px-10 text-sm tracking-wide">
                  Ver Catálogo
                </Button>
              </Link>
              <a href="https://instagram.com/val.postress" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-10 text-sm tracking-wide border-[#D4B896]/25 text-[#D4B896] hover:bg-[#D4B896]/10 hover:border-[#D4B896]/40">
                  Escribinos por Instagram
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};
