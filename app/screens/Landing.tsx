import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router';
import { DollarSign, BarChart3, Calendar, AlertTriangle, Building2, Users, CheckCircle } from 'lucide-react';

const Landing: React.FC = () => {
  const heroRef = React.useRef(null);
  const featuresRef = React.useRef(null);
  const socialProofRef = React.useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const featuresInView = useInView(featuresRef, { once: true });
  const socialProofInView = useInView(socialProofRef, { once: true });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-transparent to-green-400/10 animate-pulse"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl animate-bounce"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-300/20 rounded-full blur-3xl animate-bounce delay-1000"></div>

      {/* Header/Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-lg transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">GestorPH</span>
          </div>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 hover:scale-105"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-md"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            La gestión de tu consorcio, clara y sin intermediarios
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Ideal para PHs y casas familiares. Registra gastos, gestiona expensas y liquida saldos mensuales de forma automática.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/register"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-md"
            >
              Comenzar Ahora
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 hover:scale-105"
            >
              Iniciar Sesión
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12"
          >
            ¿Por qué elegir GestorPH?
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
              <DollarSign className="w-12 h-12 text-blue-600 mx-auto mb-4 hover:animate-bounce" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reparto Equitativo de Gastos</h3>
              <p className="text-gray-600">Divide automáticamente los gastos entre todos los copropietarios de manera justa.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
              <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-4 hover:animate-bounce" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Control de Expensas</h3>
              <p className="text-gray-600">Registra y administra todos los gastos comunes con facilidad.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
              <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4 hover:animate-bounce" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Balances Mensuales Automáticos</h3>
              <p className="text-gray-600">Genera balances y reportes al final de cada mes automáticamente.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
              <AlertTriangle className="w-12 h-12 text-blue-600 mx-auto mb-4 hover:animate-bounce" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gestión de Morosidad</h3>
              <p className="text-gray-600">Identifica y gestiona pagos pendientes de forma eficiente.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section ref={socialProofRef} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={socialProofInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8"
          >
            Ideal para tu comunidad
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={socialProofInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="p-6 bg-white/80 rounded-lg shadow-md">
              <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">PHs de pocos departamentos</h3>
              <p className="text-gray-600">Simplifica la gestión en propiedades horizontales pequeñas.</p>
            </div>
            <div className="p-6 bg-white/80 rounded-lg shadow-md">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Casas de veraneo compartidas</h3>
              <p className="text-gray-600">Gestiona gastos compartidos en propiedades vacacionales.</p>
            </div>
            <div className="p-6 bg-white/80 rounded-lg shadow-md">
              <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Complejos pequeños</h3>
              <p className="text-gray-600">Autonomía total sin necesidad de administradores externos.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Cómo Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Regístrate</h3>
              <p className="text-gray-600">Crea tu cuenta y configura tu consorcio en minutos.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Registra Gastos</h3>
              <p className="text-gray-600">Agrega gastos comunes y el sistema los reparte automáticamente.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gestiona Saldos</h3>
              <p className="text-gray-600">Revisa balances mensuales y gestiona pagos pendientes.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;