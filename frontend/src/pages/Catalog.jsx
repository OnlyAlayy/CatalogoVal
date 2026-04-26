import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { Spinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { DynamicIcon } from '../components/ui/IconPicker';
import bannerImg from '../assets/images/Imagen1.png';
import { useCartStore } from '../store/useCartStore';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';


const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
};

// ─── Card Image Carousel ───
const CardImageCarousel = ({ images, name, isAvailable }) => {
  const [idx, setIdx] = useState(0);
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-bg-secondary text-text-muted text-xs font-sans tracking-wide uppercase">
        Foto no disponible
      </div>
    );
  }

  const currentImage = images[idx]?.url || images[idx];

  return (
    <>
      <img
        src={currentImage}
        alt={`${name} ${idx + 1}`}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
      />
      {images.length > 1 && (
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setIdx(i); }}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === idx ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
      {!isAvailable && (
        <div className="absolute inset-0 bg-white/75 backdrop-blur-[3px] flex items-center justify-center">
          <span className="text-[10px] font-sans font-medium text-text-muted uppercase tracking-[0.15em] bg-white/80 px-4 py-1.5 rounded-full">
            No disponible
          </span>
        </div>
      )}
    </>
  );
};

// ─── Modal Image Carousel ───
const ModalImageCarousel = ({ images, name }) => {
  const [idx, setIdx] = useState(0);
  if (!images || images.length === 0) return null;

  const prev = () => setIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === images.length - 1 ? 0 : i + 1));

  const currentImage = images[idx]?.url || images[idx];

  return (
    <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-bg-secondary group/carousel">
      <img
        src={currentImage}
        alt={`${name} ${idx + 1}`}
        className="w-full h-full object-cover"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-text-primary flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all shadow-sm"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-text-primary flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all shadow-sm"
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'bg-white w-5' : 'bg-white/50 w-1.5 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};


export const Catalog = () => {
  const { data: categories, isLoading: isLoadingCats } = useCategories();
  const { data: products, isLoading: isLoadingProds } = useProducts();
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const { addItem } = useCartStore();

  const groupedProducts = useMemo(() => {
    if (!categories || !products) return [];
    return categories
      .map(cat => ({
        ...cat,
        products: products.filter(p => p.category && (p.category._id === cat._id || p.category === cat._id))
      }))
      .filter(cat => cat.products.length > 0);
  }, [categories, products]);

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setSelectedVariantIdx(0);
  };


  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price);
  };

  if (isLoadingCats || isLoadingProds) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      {/* Hero Banner */}
      <section className="relative pt-36 pb-24 mb-12 flex items-center justify-center overflow-hidden min-h-[50vh]">
        {/* Background image with Ken Burns */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0.8)_100%)] z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40 z-10" />
          <img
            src={bannerImg}
            alt="Catálogo"
            className="w-full h-full object-cover animate-ken-burns"
          />
        </div>

        {/* Content */}
        <motion.div
          initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}
          className="relative z-20 text-center px-5 max-w-3xl mx-auto mt-8"
        >
          <span className="font-cursive text-2xl md:text-4xl text-[#E6D5B8] mb-4 block drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            Nuestros productos
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light text-[#F5EDE3] mb-5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] tracking-tight">
            Catálogo
          </h1>
          {/* Decorative line */}
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4B896] to-transparent mx-auto mb-6" />
          <p className="text-sm md:text-base font-sans text-[#E6D5B8]/90 max-w-md mx-auto font-light leading-relaxed tracking-wide drop-shadow-[0_1px_6px_rgba(0,0,0,0.4)]">
            Explorá todas nuestras opciones. Cada producto es artesanal y hecho a pedido.
          </p>
        </motion.div>
      </section>

      <div className="container-custom">

        {/* Category Sticky Nav */}
        {groupedProducts.length > 0 && (
          <div className="sticky top-14 z-30 bg-white/90 backdrop-blur-md py-4 mb-16 -mx-5 border-b border-black/[0.04]">
            <div className="relative">
              {/* Fade indicator derecho (solo visible en mobile) */}
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white/90 to-transparent z-10 pointer-events-none lg:hidden" />
              
              <div className="overflow-x-auto px-5 scrollbar-thin">
                <div className="flex gap-3 min-w-max lg:justify-center items-center px-1 py-0.5">
                  {groupedProducts.map(group => (
                    <a
                      key={group._id}
                      href={`#cat-${group._id}`}
                      className="px-5 py-2 text-[11px] sm:text-[12px] font-sans font-medium text-text-secondary bg-white border border-brand-light/30 hover:border-brand-primary hover:text-brand-primary transition-all duration-300 rounded-full whitespace-nowrap uppercase tracking-widest shadow-sm hover:shadow-md active:scale-95"
                    >
                      {group.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Sections */}
        <div className="space-y-20">
          {groupedProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-text-muted text-sm font-sans">No hay productos disponibles en este momento.</p>
            </div>
          )}

          {groupedProducts.map((group, groupIdx) => (
            <motion.section
              key={group._id}
              id={`cat-${group._id}`}
              className="scroll-mt-32"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: groupIdx * 0.08 }}
            >
              {/* Category header */}
              <div className="flex items-center gap-5 mb-10">
                <h2 className="text-sm md:text-base font-sans font-medium uppercase tracking-[0.15em] text-text-secondary whitespace-nowrap">{group.name}</h2>
                <span className="flex-1 h-px bg-brand-light/20" />
                <span className="text-[11px] font-sans text-text-muted tracking-wide">
                  {group.products.length} {group.products.length === 1 ? 'producto' : 'productos'}
                </span>
              </div>

              {/* Product grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {group.products.map(product => (
                  <div
                    key={product._id}
                    className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-500 border border-black/[0.03] hover:-translate-y-1 flex flex-col"
                    onClick={() => openProductModal(product)}
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-bg-secondary">
                      <CardImageCarousel
                        images={product.images}
                        name={product.name}
                        isAvailable={product.isAvailable}
                      />
                      {/* Subtle dark gradient overlay on hover for premium feel */}
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </div>

                    {/* Info */}
                    <div className="p-6 flex flex-col flex-1 relative">
                      <h3 className="font-serif text-xl text-text-primary mb-2 font-medium group-hover:text-brand-primary transition-colors duration-300">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-text-muted text-[13px] font-sans font-light line-clamp-2 leading-relaxed mb-6">
                          {product.description}
                        </p>
                      )}
                      
                      {/* Bottom action row */}
                      <div className="flex items-end justify-between mt-auto pt-4 border-t border-brand-light/20">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-text-muted mb-1">Precio</span>
                          <span className="font-sans font-semibold text-brand-primary text-sm">
                            {product.variants && product.variants.length > 0
                              ? `Desde ${formatPrice(Math.min(...product.variants.map(v => v.price)))}`
                              : product.price
                                ? formatPrice(product.price)
                                : 'Consultar'
                            }
                          </span>
                        </div>
                        
                        <div className="w-8 h-8 rounded-full bg-brand-rose/30 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-400">
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>
      </div>

      {/* ─── Product Detail Modal ─── */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.name}
        maxWidth="max-w-4xl"
      >
        {selectedProduct && (
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            {/* Image Column */}
            <div className="w-full md:w-1/2">
              <div className="rounded-2xl overflow-hidden shadow-sm bg-bg-secondary h-full min-h-[300px]">
                <ModalImageCarousel
                  images={selectedProduct.images}
                  name={selectedProduct.name}
                />
              </div>
            </div>

            {/* Info Column */}
            <div className="w-full md:w-1/2 flex flex-col h-full py-2">
              {/* Description */}
              {selectedProduct.description && (
                <div className="mb-8">
                  <h4 className="text-[10px] font-sans font-semibold text-text-muted uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                    <span className="w-4 h-px bg-brand-light"></span>
                    Descripción
                  </h4>
                  <p className="text-text-secondary text-sm md:text-[15px] leading-relaxed font-sans font-light">
                    {selectedProduct.description}
                  </p>
                </div>
              )}

              {/* Ingredients */}
              {selectedProduct.ingredients && selectedProduct.ingredients.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-[10px] font-sans font-semibold text-text-muted uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                    <span className="w-4 h-px bg-brand-light"></span>
                    Ingredientes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.ingredients.map((ing, idx) => (
                      <span key={idx} className="text-[11px] font-sans text-brand-dark bg-brand-rose/40 px-3.5 py-1.5 rounded-full border border-brand-rose">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Variants */}
              {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-[10px] font-sans font-semibold text-text-muted uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                    <span className="w-4 h-px bg-brand-light"></span>
                    Opciones
                  </h4>
                  <div className="space-y-3">
                    {selectedProduct.variants.map((variant, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setSelectedVariantIdx(idx)}
                        className={`flex justify-between items-center p-4 rounded-2xl border transition-all cursor-pointer ${
                          selectedVariantIdx === idx 
                            ? 'bg-brand-rose/20 border-brand-primary shadow-sm' 
                            : 'bg-bg-secondary border-black/[0.03] hover:border-brand-light'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedVariantIdx === idx ? 'border-brand-primary' : 'border-text-muted/30'}`}>
                            {selectedVariantIdx === idx && <div className="w-2 h-2 rounded-full bg-brand-primary" />}
                          </div>
                          <span className={`font-sans text-[14px] font-medium ${selectedVariantIdx === idx ? 'text-brand-dark' : 'text-text-primary'}`}>
                            {variant.label || variant.name}
                          </span>
                        </div>
                        <span className="font-sans text-[14px] text-brand-primary font-semibold">{formatPrice(variant.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto pt-8 border-t border-brand-light/30">
                {/* Quantity & Price */}
                <div className="flex items-end justify-between mb-8">
                  
                  {/* Quantity Selector */}
                  <div>
                    <p className="text-[10px] font-sans font-semibold text-text-muted uppercase tracking-[0.2em] mb-3">Cantidad</p>
                    <div className="flex items-center gap-4 bg-bg-secondary rounded-full px-2 py-1.5 border border-black/[0.03]">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white text-text-primary transition-colors disabled:opacity-50"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="font-sans font-medium text-[15px] w-6 text-center text-text-primary">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white text-text-primary transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total Price & Advance */}
                  <div className="text-right">
                    <p className="text-[10px] font-sans font-semibold text-text-muted uppercase tracking-[0.2em] mb-1">Precio Total</p>
                    <p className="text-3xl font-serif text-brand-primary">
                      {formatPrice(
                        (selectedProduct.variants && selectedProduct.variants.length > 0 
                          ? selectedProduct.variants[selectedVariantIdx]?.price || 0
                          : selectedProduct.price || 0) * quantity
                      )}
                    </p>
                    {selectedProduct.advanceHours > 0 && (
                      <p className="text-[10px] text-text-muted mt-2 font-sans font-medium">
                        Requiere {selectedProduct.advanceHours}hs de anticipación
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => {
                      const variant = selectedProduct.variants && selectedProduct.variants.length > 0 
                        ? selectedProduct.variants[selectedVariantIdx] 
                        : null;
                        
                      addItem(selectedProduct, variant, quantity);
                      setSelectedProduct(null);
                      Swal.fire({
                        title: '¡Agregado!',
                        text: 'El producto se sumó a tu pedido.',
                        icon: 'success',
                        confirmButtonColor: '#8a644c',
                        confirmButtonText: 'Seguir mirando',
                        timer: 2500,
                        timerProgressBar: true
                      });
                    }}
                    disabled={!selectedProduct.isAvailable}
                    className="w-full sm:w-1/2 rounded-full py-4 flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-dark text-white shadow-xl shadow-brand-primary/20 transition-all duration-300 border-none uppercase tracking-widest text-[11px] font-semibold hover:-translate-y-0.5"
                  >
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    Agregar al Pedido
                  </Button>

                  <Button
                    onClick={() => {
                      const variant = selectedProduct.variants && selectedProduct.variants.length > 0 
                        ? selectedProduct.variants[selectedVariantIdx] 
                        : null;
                      const variantText = variant ? ` (${variant.name || variant.label})` : '';
                      const price = variant ? variant.price : selectedProduct.price;
                      const total = price * quantity;
                      
                      const text = `¡Hola Val! Me gustaría pedir:\n\n📦 *${quantity}x ${selectedProduct.name}*${variantText}\n💰 *Precio Total: ${formatPrice(total)}*\n\n¿Tienen disponibilidad?`;
                      const url = `https://wa.me/59892612169?text=${encodeURIComponent(text)}`;
                      window.open(url, '_blank');
                    }}
                    disabled={!selectedProduct.isAvailable}
                    className="w-full sm:w-1/2 rounded-full py-4 flex items-center justify-center gap-2 bg-white text-brand-primary border border-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-300 uppercase tracking-widest text-[11px] font-semibold hover:-translate-y-0.5"
                  >
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Consultar solo este
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
