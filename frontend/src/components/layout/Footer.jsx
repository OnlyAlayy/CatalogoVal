import { Link } from 'react-router-dom';
import logoImg from '../../assets/images/logoprueba4.png';

export const Footer = () => {
  return (
    <footer className="bg-[#1C1210] text-[#F3EDE6]">
      {/* Top decorative line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#8B5E3C]/40 to-transparent" />

      <div className="container-custom pt-20 pb-10">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">

          {/* Brand — takes more space */}
          <div className="md:col-span-5 flex flex-col items-center md:items-start">
            <img
              src={logoImg}
              alt="Val Postress"
              className="h-14 w-auto object-contain brightness-0 invert opacity-80 mb-5"
            />
            <p className="text-[#9C8578] text-sm leading-relaxed max-w-sm text-center md:text-left">
              Pastelería artesanal hecha con dedicación y los mejores ingredientes.
              Postres individuales, shots, cookies, alfajores y más.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3 flex flex-col items-center md:items-start">
            <h4 className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#D4B896] mb-5">
              Navegación
            </h4>
            <ul className="space-y-3 text-center md:text-left">
              <li>
                <Link to="/" className="text-[#9C8578] hover:text-white transition-colors duration-300 text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className="text-[#9C8578] hover:text-white transition-colors duration-300 text-sm">
                  Catálogo
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start">
            <h4 className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#D4B896] mb-5">
              Contacto
            </h4>
            <div className="space-y-3 text-center md:text-left">
              <a
                href="https://instagram.com/val.postress"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-[#9C8578] hover:text-white transition-colors duration-300 text-sm group"
              >
                <svg className="w-4 h-4 text-[#D4B896] group-hover:text-white transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                @val.postress
              </a>
              <a
                href="https://wa.me/59892612169"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-[#9C8578] hover:text-white transition-colors duration-300 text-sm group"
              >
                <svg className="w-4 h-4 text-[#D4B896] group-hover:text-white transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                +598 92 612 169
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[#6B5347] font-sans tracking-wide">
            &copy; {new Date().getFullYear()} Val Postress. Todos los derechos reservados.
          </p>
          <p className="text-[11px] text-[#6B5347] font-sans tracking-wide">
            Hecho con amor en Montevideo
          </p>
        </div>
      </div>
    </footer>
  );
};
