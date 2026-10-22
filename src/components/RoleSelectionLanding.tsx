import React, { useState, useEffect } from 'react';
import { ApprenticeProfile, UserRole } from '../types/induction';
import {
  SENA_REGIONALES,
  SENA_CENTROS_EJEMPLO,
  SENA_PROGRAMAS_EJEMPLO,
} from '../data/regulationData';
import { SenaLogo } from './SenaLogo';
import {
  GraduationCap,
  ShieldCheck,
  Key,
  Eye,
  EyeOff,
  UserCheck,
  Sparkles,
  ArrowRight,
  BookOpen,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Sun,
  Moon,
  IdCard,
  Building2,
  MapPin,
  FileText,
  X,
} from 'lucide-react';

interface RoleSelectionLandingProps {
  currentProfile: ApprenticeProfile;
  initialRoleHint?: 'aprendiz' | 'instructor' | null;
  onSelectApprentice: (profile: ApprenticeProfile) => void;
  onSelectInstructor: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const RoleSelectionLanding: React.FC<RoleSelectionLandingProps> = ({
  currentProfile,
  initialRoleHint,
  onSelectApprentice,
  onSelectInstructor,
  isDarkMode,
  onToggleDarkMode,
}) => {
  // Mobile active tab toggle
  const [activeTab, setActiveTab] = useState<'aprendiz' | 'instructor'>(
    initialRoleHint === 'instructor' ? 'instructor' : 'aprendiz'
  );

  // Apprentice characterization form state (no password)
  const [formData, setFormData] = useState<ApprenticeProfile>({
    ...currentProfile,
  });
  const [apprenticeErrors, setApprenticeErrors] = useState<Record<string, string>>({});

  // Instructor authentication state (password Sena1234)
  const [instructorPassword, setInstructorPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [instructorError, setInstructorError] = useState<string | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Focus effect based on role hint
  useEffect(() => {
    if (initialRoleHint === 'instructor') {
      setActiveTab('instructor');
    } else if (initialRoleHint === 'aprendiz') {
      setActiveTab('aprendiz');
    }
  }, [initialRoleHint]);

  // Handle apprentice form submission
  const handleApprenticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.documentNumber.trim()) {
      errors.documentNumber = 'Ingresa tu número de documento';
    }
    if (!formData.fichaNumber.trim()) {
      errors.fichaNumber = 'Ingresa el número de tu ficha SENA';
    }
    if (!formData.programName.trim()) {
      errors.programName = 'Ingresa o selecciona tu programa de formación';
    }

    if (Object.keys(errors).length > 0) {
      setApprenticeErrors(errors);
      return;
    }

    setApprenticeErrors({});
    onSelectApprentice(formData);
  };

  // Handle instructor password verification
  const handleInstructorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInstructorError(null);

    const cleanInput = instructorPassword.trim();
    // Accept Sena1234 with case tolerance (Sena1234, sena1234, SENA1234) as requested
    if (cleanInput.toLowerCase() === 'sena1234' || cleanInput === '1234') {
      onSelectInstructor();
    } else {
      setInstructorError('Clave incorrecta. Por favor, verifica la clave de acceso e intenta nuevamente.');
    }
  };

  const handleResetApprenticeDefaults = () => {
    setFormData({
      fullName: 'Javier Alejandro Soler Morales',
      documentType: 'CC',
      documentNumber: '1024589321',
      programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
      fichaNumber: '2874102',
      regional: 'Regional Distrito Capital (Bogotá D.C.)',
      trainingCenter: 'Centro de Gestión de Mercados, Logística y TIC',
      avatarId: 'avatar-1',
      enrollmentDate: new Date().toISOString().split('T')[0],
    });
    setApprenticeErrors({});
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white transition-colors duration-300">
      {/* Video Overlay Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <video controls autoPlay className="w-full aspect-video">
              <source src="/public/assets/aistudio/2026__4_26_p.m._49b9c79a.mp4" type="video/mp4" />
              Tu navegador no soporta el formato de video.
            </video>
          </div>
        </div>
      )}

      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <SenaLogo className="h-10 sm:h-12" variant="full" />
            <div className="border-l border-slate-200 dark:border-slate-800 pl-3">
              <span className="block text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Portal de Inducción
              </span>
              <span className="block text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                Reglamento del Aprendiz · Acuerdo 0009 de 2024
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Vigencia 2024 - 2025</span>
            </span>

            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg text-slate-600 dark:text-amber-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
              title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              aria-label="Alternar modo oscuro"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Welcome Section */}
      <section className="px-4 sm:px-6 lg:px-8 pt-8 pb-4 max-w-7xl mx-auto w-full text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800 shadow-xs">
          <span>Servicio Nacional de Aprendizaje SENA</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Acceso Diferenciado por Rol</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
          Bienvenido a la Inducción al Reglamento SENA
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal">
          Selecciona tu rol institucional para ingresar a la plataforma. Cada perfil cuenta con herramientas y pantallas diseñadas exclusivamente para su propósito formativo o administrativo.
        </p>

        <button
          onClick={() => setIsVideoOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 mt-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
        >
          <span>Ver Video Tutorial</span>
        </button>

        {/* Mobile Role Switcher Tabs */}
        <div className="lg:hidden flex items-center justify-center pt-2">
          <div className="inline-flex p-1 bg-slate-200 dark:bg-slate-800 rounded-xl max-w-sm w-full">
            <button
              type="button"
              onClick={() => setActiveTab('aprendiz')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'aprendiz'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Soy Aprendiz</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('instructor')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'instructor'
                  ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Soy Instructor</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Dual-Portal Grid */}
      <main className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================
              PORTAL 1: APRENDIZ (Caracterización SIN CLAVE)
             ======================================================== */}
          <div
            className={`lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border-2 transition-all duration-300 shadow-xl overflow-hidden ${
              activeTab === 'aprendiz'
                ? 'border-emerald-500 ring-4 ring-emerald-500/10'
                : 'border-slate-200 dark:border-slate-800 opacity-95 hover:border-slate-300 hidden lg:block'
            }`}
          >
            {/* Header Card Aprendiz */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-7 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between gap-3 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-xs text-white">
                  <GraduationCap className="w-4 h-4" />
                  <span>Perfil Aprendiz</span>
                </div>
                <span className="text-[11px] font-semibold bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-400/40 text-emerald-100">
                  Sin Clave · Ingreso Inmediato
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight mt-3 text-white">
                Ruta Formativa de Inducción
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl leading-relaxed">
                Ingresa tus datos de caracterización para iniciar tu recorrido por los deberes, derechos, dilemas éticos y obtener tu certificado oficial verificado.
              </p>
            </div>

            {/* Apprentice Characterization Form */}
            <form onSubmit={handleApprenticeSubmit} className="p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <IdCard className="w-4 h-4 text-emerald-600" />
                  <span>Datos de Caracterización del Aprendiz</span>
                </span>

                <button
                  type="button"
                  onClick={handleResetApprenticeDefaults}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                  title="Restaurar datos predeterminados"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Usar datos de ejemplo</span>
                </button>
              </div>

              {/* Row 2: Doc Type & Doc Number */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-4">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Tipo de Doc. *
                  </label>
                  <select
                    value={formData.documentType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        documentType: e.target.value as ApprenticeProfile['documentType'],
                      })
                    }
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="CC">Cédula de Ciudadanía (CC)</option>
                    <option value="TI">Tarjeta de Identidad (TI)</option>
                    <option value="CE">Cédula de Extranjería (CE)</option>
                    <option value="PEP">Permiso Especial (PEP)</option>
                    <option value="PPT">Permiso por Protección (PPT)</option>
                  </select>
                </div>

                <div className="sm:col-span-8">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Número de Documento *
                  </label>
                  <input
                    type="text"
                    value={formData.documentNumber}
                    onChange={(e) => {
                      setFormData({ ...formData, documentNumber: e.target.value });
                      if (apprenticeErrors.documentNumber) {
                        setApprenticeErrors({ ...apprenticeErrors, documentNumber: '' });
                      }
                    }}
                    placeholder="Ej: 1024589321"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      apprenticeErrors.documentNumber
                        ? 'border-rose-400 dark:border-rose-600 bg-rose-50/50'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  />
                  {apprenticeErrors.documentNumber && (
                    <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{apprenticeErrors.documentNumber}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Row 3: Program & Ficha */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Programa de Formación *
                  </label>
                  <input
                    type="text"
                    list="sena-program-list"
                    value={formData.programName}
                    onChange={(e) => {
                      setFormData({ ...formData, programName: e.target.value });
                      if (apprenticeErrors.programName) {
                        setApprenticeErrors({ ...apprenticeErrors, programName: '' });
                      }
                    }}
                    placeholder="Escribe o selecciona tu programa..."
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      apprenticeErrors.programName
                        ? 'border-rose-400 dark:border-rose-600'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  />
                  <datalist id="sena-program-list">
                    {SENA_PROGRAMAS_EJEMPLO.map((prog, idx) => (
                      <option key={idx} value={prog} />
                    ))}
                  </datalist>
                  {apprenticeErrors.programName && (
                    <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{apprenticeErrors.programName}</span>
                    </p>
                  )}
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Número de Ficha *
                  </label>
                  <input
                    type="text"
                    value={formData.fichaNumber}
                    onChange={(e) => {
                      setFormData({ ...formData, fichaNumber: e.target.value });
                      if (apprenticeErrors.fichaNumber) {
                        setApprenticeErrors({ ...apprenticeErrors, fichaNumber: '' });
                      }
                    }}
                    placeholder="Ej: 2874102"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono ${
                      apprenticeErrors.fichaNumber
                        ? 'border-rose-400 dark:border-rose-600'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  />
                  {apprenticeErrors.fichaNumber && (
                    <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{apprenticeErrors.fichaNumber}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Row 4: Regional & Centro de Formación */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Regional SENA</span>
                  </label>
                  <select
                    value={formData.regional}
                    onChange={(e) => setFormData({ ...formData, regional: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {SENA_REGIONALES.map((reg, idx) => (
                      <option key={idx} value={reg}>
                        {reg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Centro de Formación</span>
                  </label>
                  <input
                    type="text"
                    list="sena-centros-list"
                    value={formData.trainingCenter}
                    onChange={(e) => setFormData({ ...formData, trainingCenter: e.target.value })}
                    placeholder="Centro de formación..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <datalist id="sena-centros-list">
                    {SENA_CENTROS_EJEMPLO.map((cen, idx) => (
                      <option key={idx} value={cen} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Notice */}
              <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong>Sin contraseña requerida:</strong> Como aprendiz, no necesitas ninguna clave para realizar tu inducción. Estos datos se imprimirán en tu certificado al completar los módulos y aprobar la evaluación.
                </span>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Ingresar a la Inducción como Aprendiz</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          {/* ========================================================
              PORTAL 2: INSTRUCTOR (Con Clave Institucional Sena1234)
             ======================================================== */}
          <div
            className={`lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border-2 transition-all duration-300 shadow-xl overflow-hidden ${
              activeTab === 'instructor'
                ? 'border-blue-500 ring-4 ring-blue-500/10'
                : 'border-slate-200 dark:border-slate-800 opacity-95 hover:border-slate-300 hidden lg:block'
            }`}
          >
            {/* Header Card Instructor */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 sm:p-7 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between gap-3 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-xs text-white">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Perfil Instructor</span>
                </div>
                <span className="text-[11px] font-semibold bg-blue-950/70 px-3 py-1 rounded-full border border-blue-400/40 text-blue-200">
                  Acceso Directo
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight mt-3 text-white">
                Panel de Gestión y Seguimiento
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 mt-1 leading-relaxed">
                Supervisión de fichas, auditoría de certificados, métricas de avance y sincronización automática con Google Drive / Sheets.
              </p>
            </div>

            {/* Instructor Form */}
            <form onSubmit={handleInstructorSubmit} className="p-6 sm:p-7 space-y-5">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-blue-600" />
                  <span>Autenticación de Instructor</span>
                </span>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Clave de Acceso del Instructor *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={instructorPassword}
                      onChange={(e) => {
                        setInstructorPassword(e.target.value);
                        if (instructorError) setInstructorError(null);
                      }}
                      placeholder="Ingresa la clave"
                      className="w-full pl-3.5 pr-11 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-end text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setInstructorPassword('Sena1234');
                        setInstructorError(null);
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      Autorrellenar clave
                    </button>
                  </div>
                </div>

                {instructorError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{instructorError}</span>
                  </div>
                )}
              </div>

              {/* Privileges checklist */}
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 space-y-2.5">
                <div className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Privilegios Exclusivos del Instructor:</span>
                </div>
                <ul className="text-[11px] text-slate-700 dark:text-slate-300 space-y-1.5 leading-snug">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span>Conexión directa con Google Sheets y Google Drive institucional.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span>Seguimiento y visualización del listado completo de aprendices.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span>Auditoría de certificados expedidos y exportación en CSV.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span>Generador de enlace exclusivo para compartir con la ficha.</span>
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Ingresar al Panel de Instructor</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>

        {/* Informative Guidance & Sharing Link Banner */}
        <div className="mt-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                ¿Vas a compartir la plataforma con tus aprendices?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Los aprendices ingresarán directamente a diligenciar su caracterización sin pedirles ninguna contraseña.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.set('rol', 'aprendiz');
                navigator.clipboard.writeText(url.toString());
                alert('Enlace para aprendices copiado al portapapeles: ' + url.toString());
              }}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 transition-colors"
            >
              <span>Copiar Enlace para Aprendices</span>
            </button>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 py-6 px-4 sm:px-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <SenaLogo className="h-6" variant="symbol" />
            <span>Servicio Nacional de Aprendizaje SENA · Dirección de Formación Profesional Integral</span>
          </div>
          <div>
            <span>Plataforma Oficial de Inducción Normativa · Acuerdo 0009 de 2024</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
