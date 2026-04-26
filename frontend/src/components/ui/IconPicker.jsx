import { 
  Cake, 
  CakeSlice, 
  Coffee, 
  Cookie, 
  Croissant, 
  IceCream, 
  Candy, 
  Cherry, 
  Citrus, 
  Heart, 
  Star, 
  Gift, 
  Sparkles,
  CupSoda
} from 'lucide-react';
import { useState } from 'react';

// Mapeo de nombres a componentes
export const iconMap = {
  Cake: Cake,
  CakeSlice: CakeSlice,
  Coffee: Coffee,
  Cookie: Cookie,
  Croissant: Croissant,
  IceCream: IceCream,
  Candy: Candy,
  Cherry: Cherry,
  Citrus: Citrus,
  CupSoda: CupSoda,
  Heart: Heart,
  Star: Star,
  Gift: Gift,
  Sparkles: Sparkles,
};

// Componente para renderizar dinámicamente un ícono desde su nombre
export const DynamicIcon = ({ name, size = 20, className = "" }) => {
  const IconComponent = iconMap[name] || Star; // Fallback a Star si no se encuentra
  return <IconComponent size={size} className={className} />;
};

export const IconPicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (iconName) => {
    onChange(iconName);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-3 text-gray-700">
          {value ? <DynamicIcon name={value} size={20} className="text-brand-primary" /> : <span className="text-gray-400">Seleccionar ícono</span>}
          <span>{value || ''}</span>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 p-4 bg-white border border-gray-100 shadow-xl rounded-xl w-[280px] max-h-[300px] overflow-y-auto grid grid-cols-3 gap-3">
          {Object.keys(iconMap).map((iconName) => {
            const isSelected = value === iconName;
            return (
              <div
                key={iconName}
                onClick={() => handleSelect(iconName)}
                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'bg-brand-rose/30 text-brand-primary border-2 border-brand-primary shadow-sm' 
                    : 'hover:bg-gray-50 text-gray-500 border-2 border-transparent hover:text-gray-700'
                }`}
                title={iconName}
              >
                <DynamicIcon name={iconName} size={22} />
                <span className="text-[9px] font-sans font-medium tracking-wide uppercase">{iconName}</span>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Click outside overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
