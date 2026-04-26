import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { cn } from '../../utils/cn';
import logoImg from '../../assets/images/logoprueba4.png';
import { useCartStore } from '../../store/useCartStore';
import { CartDrawer } from '../cart/CartDrawer';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const { getTotalItems } = useCartStore();
  const totalItems = getTotalItems();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Catálogo', path: '/catalogo' },
  ];

  const showSolid = isScrolled || !isHome;

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-500',
        showSolid
          ? 'bg-white backdrop-blur-lg shadow-nav py-2'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 z-50">
          <img
            src={logoImg}
            alt="Val Postress"
            className={cn(
              'h-12 w-auto object-contain flex-shrink-0 transition-all duration-500',
              showSolid ? 'h-10' : 'h-12',
              !showSolid && 'brightness-0 invert drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]'
            )}
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                'px-4 py-2 text-[13px] font-sans font-medium tracking-wide uppercase transition-all duration-300 rounded-full',
                showSolid
                  ? 'text-text-secondary hover:text-brand-primary hover:bg-brand-rose/40'
                  : 'text-white/80 hover:text-white hover:bg-white/10',
                location.pathname === link.path && (showSolid ? 'text-brand-primary' : 'text-white')
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="w-px h-5 bg-current opacity-15 mx-2" />
          
          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className={cn(
              'p-2 transition-colors duration-300 relative',
              showSolid ? 'text-text-primary hover:text-brand-primary' : 'text-white hover:text-brand-light'
            )}
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span 
                key={totalItems}
                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-brand-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-md animate-bounce-once"
              >
                {totalItems}
              </span>
            )}
          </button>

          <a
            href="https://wa.me/59892612169?text=Hola%20Val!%20Me%20encantar%C3%ADa%20hacer%20un%20pedido"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'ml-2 px-5 py-2.5 text-[13px] font-sans font-semibold tracking-wide rounded-full transition-all duration-300',
              showSolid
                ? 'bg-brand-primary text-white hover:bg-brand-dark hover:shadow-lg'
                : 'bg-white/15 text-white backdrop-blur-sm border border-white/25 hover:bg-white/25'
            )}
          >
            Hacer Pedido
          </a>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-4">
           <button
            onClick={() => setIsCartOpen(true)}
            className={cn(
              'p-2.5 rounded-full transition-all duration-300 relative',
              isMobileMenuOpen ? 'text-text-primary' : (showSolid ? 'text-text-primary' : 'text-white')
            )}
          >
            <ShoppingBag size={22} />
            {totalItems > 0 && (
              <span 
                key={totalItems}
                className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-brand-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-md animate-bounce-once"
              >
                {totalItems}
              </span>
            )}
          </button>
          <button
            className={cn(
              'p-2.5 rounded-full transition-all duration-300',
              isMobileMenuOpen ? 'text-text-primary bg-bg-secondary' : (showSolid ? 'text-text-primary hover:bg-bg-secondary' : 'text-white hover:bg-white/10')
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menú"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Fullscreen Menu */}
      <div
        className={cn(
          'md:hidden fixed inset-0 bg-bg-primary z-40 flex flex-col items-center justify-center transition-all duration-500',
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <div className="flex flex-col items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                'text-3xl font-serif font-light text-text-primary hover:text-brand-primary transition-colors py-3',
                location.pathname === link.path && 'text-brand-primary'
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="gold-line my-6" />
          <a
            href="https://wa.me/59892612169?text=Hola%20Val!%20Me%20encantar%C3%ADa%20hacer%20un%20pedido"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-3.5 bg-brand-primary text-white rounded-full font-sans font-medium text-sm tracking-wide hover:bg-brand-dark transition-colors"
          >
            Hacer Pedido
          </a>
        </div>
      </div>
    </nav>
  );
};
