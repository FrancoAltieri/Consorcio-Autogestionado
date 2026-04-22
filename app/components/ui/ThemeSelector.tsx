import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, CheckCircle } from 'lucide-react';
// Ajustamos las rutas a tu estructura app/contexts/
import { useTheme, themes, ThemeName } from '@/contexts/ThemeContext';

const ThemeSelector: React.FC = () => {
  const { currentTheme, theme, setTheme } = useTheme();
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Botón Flotante */}
      <button
        onClick={() => setShowThemeSelector(!showThemeSelector)}
        className={`p-4 bg-gradient-to-r ${theme.iconGradient} text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 ${theme.buttonShadow}`}
        title="Personalizar colores"
        aria-label="Cambiar tema"
      >
        <Palette className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {showThemeSelector && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl min-w-[280px]"
          >
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-white font-semibold text-sm">Temas de la Comunidad</h3>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Beta</span>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
              {Object.entries(themes).map(([key, themeOption]) => (
                <button
                  key={key}
                  onClick={() => {
                    setTheme(key as ThemeName);
                    setShowThemeSelector(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${currentTheme === key
                      ? 'bg-white/20 border border-white/20'
                      : 'bg-white/5 border border-transparent hover:bg-white/10'
                    }`}
                >
                  {/* Vista previa del color */}
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${themeOption.iconGradient} shadow-inner flex-shrink-0 group-hover:rotate-12 transition-transform duration-500`}></div>

                  <div className="text-left">
                    <span className="text-white text-sm font-medium block">{themeOption.name}</span>
                    <span className="text-[10px] text-white/40 block">Esquema {key}</span>
                  </div>

                  {currentTheme === key && (
                    <div className="ml-auto bg-white/20 p-1 rounded-full">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSelector;