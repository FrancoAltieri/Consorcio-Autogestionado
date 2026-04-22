import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeName = 'purple' | 'ocean' | 'emerald' | 'sunset' | 'cyber' | 'navy';

export interface Theme {
  name: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  blob1: string;
  blob2: string;
  blob3: string;
  headerBg: string;
  iconGradient: string;
  textGradient: string;
  textColor: string;
  borderColor: string;
  hoverBg: string;
  hoverBorder: string;
  buttonGradient: string;
  buttonHover: string;
  buttonShadow: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  secondaryText: string;
  feature1: string;
  feature2: string;
  feature3: string;
  feature4: string;
}

export const themes: Record<ThemeName, Theme> = {
  purple: {
    name: 'Purple/Pink',
    gradientFrom: 'from-slate-900',
    gradientVia: 'via-purple-900',
    gradientTo: 'to-slate-900',
    blob1: 'bg-purple-500/30',
    blob2: 'bg-blue-500/30',
    blob3: 'bg-pink-500/30',
    headerBg: 'bg-slate-900/80',
    iconGradient: 'from-purple-500 to-pink-500',
    textGradient: 'from-purple-400 to-pink-400',
    textColor: 'text-purple-300',
    borderColor: 'border-purple-400/50',
    hoverBg: 'hover:bg-purple-500/10',
    hoverBorder: 'hover:border-purple-400',
    buttonGradient: 'from-purple-500 to-pink-500',
    buttonHover: 'hover:from-purple-600 hover:to-pink-600',
    buttonShadow: 'hover:shadow-purple-500/50',
    badgeBg: 'bg-purple-500/20',
    badgeBorder: 'border-purple-400/30',
    badgeText: 'text-purple-200',
    secondaryText: 'text-purple-200',
    feature1: 'from-purple-500 to-pink-500',
    feature2: 'from-blue-500 to-purple-500',
    feature3: 'from-pink-500 to-purple-500',
    feature4: 'from-purple-500 to-blue-500',
  },
  ocean: {
    name: 'Ocean Blue',
    gradientFrom: 'from-slate-900',
    gradientVia: 'via-blue-900',
    gradientTo: 'to-cyan-900',
    blob1: 'bg-blue-500/30',
    blob2: 'bg-cyan-500/30',
    blob3: 'bg-sky-500/30',
    headerBg: 'bg-slate-900/80',
    iconGradient: 'from-blue-500 to-cyan-500',
    textGradient: 'from-blue-400 to-cyan-400',
    textColor: 'text-blue-300',
    borderColor: 'border-blue-400/50',
    hoverBg: 'hover:bg-blue-500/10',
    hoverBorder: 'hover:border-blue-400',
    buttonGradient: 'from-blue-500 to-cyan-500',
    buttonHover: 'hover:from-blue-600 hover:to-cyan-600',
    buttonShadow: 'hover:shadow-blue-500/50',
    badgeBg: 'bg-blue-500/20',
    badgeBorder: 'border-blue-400/30',
    badgeText: 'text-blue-200',
    secondaryText: 'text-blue-200',
    feature1: 'from-blue-500 to-cyan-500',
    feature2: 'from-sky-500 to-blue-500',
    feature3: 'from-cyan-500 to-blue-500',
    feature4: 'from-blue-500 to-sky-500',
  },
  emerald: {
    name: 'Emerald Green',
    gradientFrom: 'from-slate-900',
    gradientVia: 'via-emerald-900',
    gradientTo: 'to-teal-900',
    blob1: 'bg-emerald-500/30',
    blob2: 'bg-teal-500/30',
    blob3: 'bg-green-500/30',
    headerBg: 'bg-slate-900/80',
    iconGradient: 'from-emerald-500 to-teal-500',
    textGradient: 'from-emerald-400 to-teal-400',
    textColor: 'text-emerald-300',
    borderColor: 'border-emerald-400/50',
    hoverBg: 'hover:bg-emerald-500/10',
    hoverBorder: 'hover:border-emerald-400',
    buttonGradient: 'from-emerald-500 to-teal-500',
    buttonHover: 'hover:from-emerald-600 hover:to-teal-600',
    buttonShadow: 'hover:shadow-emerald-500/50',
    badgeBg: 'bg-emerald-500/20',
    badgeBorder: 'border-emerald-400/30',
    badgeText: 'text-emerald-200',
    secondaryText: 'text-emerald-200',
    feature1: 'from-emerald-500 to-teal-500',
    feature2: 'from-teal-500 to-emerald-500',
    feature3: 'from-green-500 to-emerald-500',
    feature4: 'from-emerald-500 to-green-500',
  },
  sunset: {
    name: 'Sunset Orange',
    gradientFrom: 'from-slate-900',
    gradientVia: 'via-orange-900',
    gradientTo: 'to-red-900',
    blob1: 'bg-orange-500/30',
    blob2: 'bg-amber-500/30',
    blob3: 'bg-red-500/30',
    headerBg: 'bg-slate-900/80',
    iconGradient: 'from-orange-500 to-red-500',
    textGradient: 'from-orange-400 to-amber-400',
    textColor: 'text-orange-300',
    borderColor: 'border-orange-400/50',
    hoverBg: 'hover:bg-orange-500/10',
    hoverBorder: 'hover:border-orange-400',
    buttonGradient: 'from-orange-500 to-red-500',
    buttonHover: 'hover:from-orange-600 hover:to-red-600',
    buttonShadow: 'hover:shadow-orange-500/50',
    badgeBg: 'bg-orange-500/20',
    badgeBorder: 'border-orange-400/30',
    badgeText: 'text-orange-200',
    secondaryText: 'text-orange-200',
    feature1: 'from-orange-500 to-red-500',
    feature2: 'from-amber-500 to-orange-500',
    feature3: 'from-red-500 to-orange-500',
    feature4: 'from-orange-500 to-amber-500',
  },
  cyber: {
    name: 'Cyber Teal',
    gradientFrom: 'from-slate-900',
    gradientVia: 'via-teal-900',
    gradientTo: 'to-cyan-900',
    blob1: 'bg-teal-500/30',
    blob2: 'bg-cyan-500/30',
    blob3: 'bg-blue-500/30',
    headerBg: 'bg-slate-900/80',
    iconGradient: 'from-teal-500 to-cyan-500',
    textGradient: 'from-teal-400 to-cyan-400',
    textColor: 'text-teal-300',
    borderColor: 'border-teal-400/50',
    hoverBg: 'hover:bg-teal-500/10',
    hoverBorder: 'hover:border-teal-400',
    buttonGradient: 'from-teal-500 to-cyan-500',
    buttonHover: 'hover:from-teal-600 hover:to-cyan-600',
    buttonShadow: 'hover:shadow-teal-500/50',
    badgeBg: 'bg-teal-500/20',
    badgeBorder: 'border-teal-400/30',
    badgeText: 'text-teal-200',
    secondaryText: 'text-teal-200',
    feature1: 'from-teal-500 to-cyan-500',
    feature2: 'from-cyan-500 to-teal-500',
    feature3: 'from-blue-500 to-teal-500',
    feature4: 'from-teal-500 to-blue-500',
  },
  navy: {
    name: 'Royal Navy',
    gradientFrom: 'from-slate-900',
    gradientVia: 'via-blue-950',
    gradientTo: 'to-indigo-950',
    blob1: 'bg-blue-600/30',
    blob2: 'bg-indigo-600/30',
    blob3: 'bg-violet-600/30',
    headerBg: 'bg-slate-900/80',
    iconGradient: 'from-blue-600 to-indigo-600',
    textGradient: 'from-blue-400 to-indigo-400',
    textColor: 'text-blue-300',
    borderColor: 'border-blue-500/50',
    hoverBg: 'hover:bg-blue-600/10',
    hoverBorder: 'hover:border-blue-500',
    buttonGradient: 'from-blue-600 to-indigo-600',
    buttonHover: 'hover:from-blue-700 hover:to-indigo-700',
    buttonShadow: 'hover:shadow-blue-600/50',
    badgeBg: 'bg-blue-600/20',
    badgeBorder: 'border-blue-500/30',
    badgeText: 'text-blue-200',
    secondaryText: 'text-blue-200',
    feature1: 'from-blue-600 to-indigo-600',
    feature2: 'from-indigo-600 to-blue-600',
    feature3: 'from-violet-600 to-blue-600',
    feature4: 'from-blue-600 to-violet-600',
  },
};

interface ThemeContextType {
  currentTheme: ThemeName;
  theme: Theme;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(() => {
    // Cargar tema guardado de localStorage o usar 'purple' por defecto
    const savedTheme = localStorage.getItem('gestorph-theme') as ThemeName;
    return savedTheme && themes[savedTheme] ? savedTheme : 'purple';
  });

  const setTheme = (themeName: ThemeName) => {
    setCurrentTheme(themeName);
    localStorage.setItem('gestorph-theme', themeName);
  };

  useEffect(() => {
    // Guardar tema en localStorage cuando cambie
    localStorage.setItem('gestorph-theme', currentTheme);
  }, [currentTheme]);

  const value = {
    currentTheme,
    theme: themes[currentTheme],
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
