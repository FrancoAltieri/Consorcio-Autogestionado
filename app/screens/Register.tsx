import React, { useState } from 'react';
import { User, Phone, Mail, Lock, Building2, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useNavigate, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { authService } from '@/services/authService';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeSelector from '@/components/ui/ThemeSelector';
import { registerSchema, RegisterFormData } from '@/utils/validationSchemas';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    watch
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange'
  });

  const watchedNombre = watch('nombre');
  const watchedTelefono = watch('telefono');
  const watchedEmail = watch('email');
  const watchedPassword = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);

    try {
      await authService.register(data);
      navigate('/mis-consorcios');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientVia} ${theme.gradientTo} transition-all duration-1000`}>
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -left-40 w-80 h-80 ${theme.blob1} rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob transition-colors duration-1000`}></div>
        <div className={`absolute -top-40 -right-40 w-80 h-80 ${theme.blob2} rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 transition-colors duration-1000`}></div>
        <div className={`absolute -bottom-40 left-20 w-80 h-80 ${theme.blob3} rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 transition-colors duration-1000`}></div>
      </div>

      {/* Theme Selector */}
      <ThemeSelector />

      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 transform transition-all duration-500 hover:scale-[1.02]">

          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${theme.iconGradient} rounded-full mb-4 animate-bounce-slow transition-all duration-500`}>
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Registrarse</h1>
            <p className={`${theme.secondaryText} transition-colors duration-500`}>Gestiona tu consorcio fácilmente</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Campo Nombre */}
            <div className="relative group">
              <label className={`block ${theme.badgeText} text-sm font-medium mb-2 transition-colors duration-500`}>Nombre</label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === 'nombre' ? theme.textColor.replace('text-', 'text-') : 'text-gray-400'}`} />
                <input
                  type="text"
                  {...register('nombre')}
                  onFocus={() => setFocusedField('nombre')}
                  onBlur={() => setFocusedField(null)}
                  disabled={loading}
                  className={`w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-current transition-all duration-300 backdrop-blur-sm disabled:opacity-50 ${focusedField === 'nombre' ? theme.textColor : ''}`}
                  placeholder="Tu nombre completo"
                />
                {watchedNombre && !errors.nombre && <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400 animate-scale-in" />}
              </div>
              {errors.nombre && <p className="text-red-400 text-sm mt-1">{errors.nombre.message}</p>}
            </div>

            {/* Campo Teléfono */}
            <div className="relative group">
              <label className={`block ${theme.badgeText} text-sm font-medium mb-2 transition-colors duration-500`}>Teléfono</label>
              <div className="relative">
                <PhoneInput
                  international
                  defaultCountry="AR"
                  value={watchedTelefono}
                  onChange={(value) => setValue('telefono', value || '')}
                  onFocus={() => setFocusedField('telefono')}
                  onBlur={() => setFocusedField(null)}
                  disabled={loading}
                  className={`w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-current transition-all duration-300 backdrop-blur-sm disabled:opacity-50 ${focusedField === 'telefono' ? theme.textColor : ''}`}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'white',
                    fontSize: '16px',
                    width: '100%'
                  }}
                />
                <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === 'telefono' ? theme.textColor.replace('text-', 'text-') : 'text-gray-400'}`} />
                {watchedTelefono && !errors.telefono && <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400 animate-scale-in" />}
              </div>
              {errors.telefono && <p className="text-red-400 text-sm mt-1">{errors.telefono.message}</p>}
            </div>

            {/* Campo Email */}
            <div className="relative group">
              <label className={`block ${theme.badgeText} text-sm font-medium mb-2 transition-colors duration-500`}>Email</label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === 'email' ? theme.textColor.replace('text-', 'text-') : 'text-gray-400'}`} />
                <input
                  type="email"
                  {...register('email')}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  disabled={loading}
                  className={`w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-current transition-all duration-300 backdrop-blur-sm disabled:opacity-50 ${focusedField === 'email' ? theme.textColor : ''}`}
                  placeholder="tu@email.com"
                />
                {watchedEmail && !errors.email && <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400 animate-scale-in" />}
              </div>
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Campo Contraseña */}
            <div className="relative group">
              <label className={`block ${theme.badgeText} text-sm font-medium mb-2 transition-colors duration-500`}>Contraseña</label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === 'password' ? theme.textColor.replace('text-', 'text-') : 'text-gray-400'}`} />
                <input
                  type="password"
                  {...register('password')}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  disabled={loading}
                  className={`w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-current transition-all duration-300 backdrop-blur-sm disabled:opacity-50 ${focusedField === 'password' ? theme.textColor : ''}`}
                  placeholder="••••••••"
                />
                {watchedPassword && !errors.password && <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400 animate-scale-in" />}
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || !isValid}
              className={`w-full py-3 bg-gradient-to-r ${theme.buttonGradient} ${theme.buttonHover} disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg ${theme.buttonShadow}`}
            >
              {loading && <Loader className="w-5 h-5 animate-spin" />}
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>

            <p className={`text-center ${theme.secondaryText} text-sm transition-colors duration-500`}>
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className={`${theme.textColor} hover:opacity-80 font-semibold transition-all duration-300`}>
                Inicia sesión aquí
              </Link>
            </p>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes scale-in {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-bounce-slow { animation: bounce-slow 3s infinite; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default Register;
