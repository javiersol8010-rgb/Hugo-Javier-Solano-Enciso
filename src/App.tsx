import React, { useState, useEffect } from 'react';
import { ApprenticeProfile, GamificationState, UserRole } from './types/induction';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { InductionDashboard } from './components/InductionDashboard';
import { ModuleRights } from './components/ModuleRights';
import { ModuleDuties } from './components/ModuleDuties';
import { ModuleDilemmas } from './components/ModuleDilemmas';
import { ModuleProductiveStage } from './components/ModuleProductiveStage';
import { FinalAssessment } from './components/FinalAssessment';
import { OfficialCertificate } from './components/OfficialCertificate';
import { ApprenticeProfileModal } from './components/ApprenticeProfileModal';
import { CertificateVerificationModal } from './components/CertificateVerificationModal';
import { RegulationSearchDrawer } from './components/RegulationSearchDrawer';
import { GoogleSheetsSyncModal } from './components/GoogleSheetsSyncModal';
import { InstructorDashboard } from './components/InstructorDashboard';
import { RoleSwitchModal } from './components/RoleSwitchModal';
import { StudentCertificateViewerModal } from './components/StudentCertificateViewerModal';
import { RoleSelectionLanding } from './components/RoleSelectionLanding';
import { SenaLogo } from './components/SenaLogo';
import { Sparkles, ExternalLink } from 'lucide-react';
import { initAuth, googleSignIn } from './services/googleAuth';
import { autoSyncApprenticeRecord, getKnownSpreadsheetUrl, SheetApprenticeRow } from './services/sheetsSync';
import { User } from 'firebase/auth';

const INITIAL_PROFILE: ApprenticeProfile = {
  fullName: 'Javier Alejandro Soler Morales',
  documentType: 'CC',
  documentNumber: '1024589321',
  programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
  fichaNumber: '2874102',
  regional: 'Regional Distrito Capital (Bogotá D.C.)',
  trainingCenter: 'Centro de Gestión de Mercados, Logística y TIC',
  avatarId: 'avatar-1',
  enrollmentDate: '2024-02-15',
};

const INITIAL_GAMIFICATION: GamificationState = {
  xp: 50,
  level: 1,
  streak: 1,
  completedModules: [],
  unlockedBadges: ['badge-induccion-iniciada'],
  assessmentScore: 0,
  assessmentPassed: false,
  certificateCode: null,
  certificateIssuedDate: null,
};

export default function App() {
  const [profile, setProfile] = useState<ApprenticeProfile>(() => {
    const saved = localStorage.getItem('sena_apprentice_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [gamification, setGamification] = useState<GamificationState>(() => {
    const saved = localStorage.getItem('sena_gamification_state');
    return saved ? JSON.parse(saved) : INITIAL_GAMIFICATION;
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('sena_dark_mode');
    if (saved !== null) {
      return saved === 'true';
    }
    // Check system preference
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get('rol') || params.get('role');
    if (r === 'aprendiz') return 'aprendiz';
    if (r === 'instructor') return 'instructor';
    const saved = localStorage.getItem('sena_user_role');
    return saved === 'instructor' ? 'instructor' : 'aprendiz';
  });

  const [isScreenBlurring, setIsScreenBlurring] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get('rol') || params.get('role');
    if (r === 'instructor') return 'instructor';
    const savedRole = localStorage.getItem('sena_user_role');
    return savedRole === 'instructor' ? 'instructor' : 'inicio';
  });

  const [isRoleSwitchOpen, setIsRoleSwitchOpen] = useState(false);
  const [selectedStudentForCert, setSelectedStudentForCert] = useState<SheetApprenticeRow | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isVerifierOpen, setIsVerifierOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSheetsOpen, setIsSheetsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastAction, setToastAction] = useState<{ label: string; url: string } | null>(null);
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [sheetUrl, setSheetUrl] = useState<string | null>(() => getKnownSpreadsheetUrl());
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLandingActive, setIsLandingActive] = useState<boolean>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('portal') === 'landing' || params.get('rol') === 'select') return true;
    const sessionAuth = sessionStorage.getItem('sena_session_authenticated');
    if (sessionAuth === 'true') return false;
    return true;
  });

  // Sync role to localStorage & manage tabs
  useEffect(() => {
    localStorage.setItem('sena_user_role', userRole);
    if (userRole === 'aprendiz' && currentTab === 'instructor') {
      setCurrentTab('inicio');
    }
  }, [userRole]);

  const handleCopyApprenticeLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('rol', 'aprendiz');
    navigator.clipboard.writeText(url.toString());
    showNotification('Enlace para aprendices copiado. Compártelo con tu grupo.');
  };

  // Initialize and listen to Google Auth status
  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setGoogleUser(user);
      },
      () => {
        setGoogleUser(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Sync dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('sena_dark_mode', String(isDarkMode));
  }, [isDarkMode]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sena_apprentice_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('sena_gamification_state', JSON.stringify(gamification));
  }, [gamification]);

  const handleToggleDarkMode = () => {
    // Trigger screen blur transition
    setIsScreenBlurring(true);
    setIsDarkMode((prev) => !prev);

    // Remove the blur flash overlay after the transition completes
    setTimeout(() => {
      setIsScreenBlurring(false);
    }, 650);
  };

  const showNotification = (msg: string, action?: { label: string; url: string }) => {
    setToastMessage(msg);
    setToastAction(action || null);
    setTimeout(() => {
      setToastMessage(null);
      setToastAction(null);
    }, action ? 6500 : 3800);
  };

  const handleCompleteModule = (moduleId: string, xpEarned: number, badgeId?: string) => {
    setGamification((prev) => {
      const alreadyCompleted = prev.completedModules.includes(moduleId);
      const newModules = alreadyCompleted ? prev.completedModules : [...prev.completedModules, moduleId];
      const newXP = prev.xp + (alreadyCompleted ? 15 : xpEarned);

      // Level formula: level = Math.floor(XP / 100) + 1
      const newLevel = Math.floor(newXP / 100) + 1;

      const newBadges = [...prev.unlockedBadges];
      if (badgeId && !newBadges.includes(badgeId)) {
        newBadges.push(badgeId);
        showNotification(`¡Insignia Desbloqueada! Sumaste +${xpEarned} XP`);
      } else {
        showNotification(`¡Módulo completado con éxito! +${xpEarned} XP`);
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        completedModules: newModules,
        unlockedBadges: newBadges,
      };
    });
  };

  const triggerBackgroundSync = async (prof: ApprenticeProfile, gam: GamificationState) => {
    setIsSyncing(true);
    try {
      const res = await autoSyncApprenticeRecord(prof, gam, googleUser?.email || undefined);
      if (res.success && res.spreadsheetUrl) {
        setSheetUrl(res.spreadsheetUrl);
        showNotification('✓ Certificado emitido y guardado automáticamente en Google Drive', {
          label: 'Abrir Hoja',
          url: res.spreadsheetUrl,
        });
      } else if (res.requiresAuth) {
        showNotification(
          '¡Felicitaciones! Certificado emitido. Conecta Google Drive para registrarlo automáticamente en la Hoja SENA.'
        );
      } else {
        showNotification('¡Felicitaciones! Has aprobado la inducción y generado tu certificado.');
      }
    } catch (e) {
      console.warn('Auto-sync notice:', e);
      showNotification('¡Felicitaciones! Has aprobado la inducción y generado tu certificado.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleOneClickConnectAndSync = async () => {
    setIsSyncing(true);
    try {
      const authRes = await googleSignIn();
      if (!authRes) return;
      setGoogleUser(authRes.user);

      const res = await autoSyncApprenticeRecord(profile, gamification, authRes.user.email || undefined);
      if (res.success && res.spreadsheetUrl) {
        setSheetUrl(res.spreadsheetUrl);
        showNotification('✓ Registro sincronizado automáticamente en Google Drive', {
          label: 'Abrir Hoja',
          url: res.spreadsheetUrl,
        });
      } else {
        showNotification(res.message || 'Error al guardar en Google Sheets.');
      }
    } catch (err: any) {
      console.error('Error on one-click Google sync:', err);
      showNotification('No se pudo completar la conexión con Google.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePassAssessment = (scorePercentage: number, certificateCode: string) => {
    const nowStr = new Date().toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const newXP = gamification.xp + 160;
    const newLevel = Math.floor(newXP / 100) + 1;
    const newBadges = [...gamification.unlockedBadges];
    if (!newBadges.includes('badge-certificado')) {
      newBadges.push('badge-certificado');
    }

    const updatedGamification: GamificationState = {
      ...gamification,
      xp: newXP,
      level: newLevel,
      assessmentScore: scorePercentage,
      assessmentPassed: true,
      certificateCode,
      certificateIssuedDate: nowStr,
      unlockedBadges: newBadges,
    };

    setGamification(updatedGamification);

    // Trigger automatic background synchronization
    triggerBackgroundSync(profile, updatedGamification);
  };

  // Dedicated Landing Page for Role Selection (Instructor with password Sena1234, Aprendiz with characterization)
  if (isLandingActive) {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('rol') || params.get('role');
    const initialRoleHint = roleParam === 'instructor' ? 'instructor' : 'aprendiz';

    return (
      <RoleSelectionLanding
        currentProfile={profile}
        initialRoleHint={initialRoleHint}
        onSelectApprentice={(newProfile) => {
          setProfile(newProfile);
          setUserRole('aprendiz');
          setIsLandingActive(false);
          sessionStorage.setItem('sena_session_authenticated', 'true');
          setCurrentTab('inicio');
          showNotification(`¡Bienvenido aprendiz ${newProfile.fullName}! Perfil registrado.`);
        }}
        onSelectInstructor={() => {
          setUserRole('instructor');
          setIsLandingActive(false);
          sessionStorage.setItem('sena_session_authenticated', 'true');
          setCurrentTab('instructor');
          showNotification('Autenticado como Instructor. Bienvenido al panel de gestión y seguimiento.');
        }}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 selection:bg-emerald-500 selection:text-white transition-colors duration-300 relative">
      {/* Screen Blur Wave Flash when switching modes */}
      {isScreenBlurring && (
        <div
          className="fixed inset-0 z-50 screen-blur-flash pointer-events-none bg-slate-950/20 backdrop-blur-md"
          aria-hidden="true"
        />
      )}

      {/* Ambient background blur glow for Dark Mode depth */}
      {isDarkMode && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 no-print" aria-hidden="true">
          <div className="absolute top-[-10%] right-[-5%] w-[550px] h-[550px] rounded-full bg-emerald-600/10 blur-[130px]" />
          <div className="absolute top-[35%] left-[-10%] w-[650px] h-[650px] rounded-full bg-blue-600/10 blur-[150px]" />
          <div className="absolute bottom-[-10%] right-[15%] w-[550px] h-[550px] rounded-full bg-emerald-500/10 blur-[140px]" />
        </div>
      )}

      {/* Top Bar Header with Dark Mode Icon Button in Zone 3 */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        profile={profile}
        gamification={gamification}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSheetsSync={() => setIsSheetsOpen(true)}
        sheetUrl={sheetUrl}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        userRole={userRole}
        onOpenRoleSwitch={() => setIsRoleSwitchOpen(true)}
        onCopyApprenticeLink={handleCopyApprenticeLink}
        onExitToRoleSelection={() => {
          sessionStorage.removeItem('sena_session_authenticated');
          setIsLandingActive(true);
        }}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 relative z-10">
        {currentTab === 'instructor' && userRole === 'instructor' && (
          <InstructorDashboard
            sheetUrl={sheetUrl}
            onOpenSheetsSync={() => setIsSheetsOpen(true)}
            onViewStudentCertificate={(studentData) => setSelectedStudentForCert(studentData)}
            onSwitchToStudentView={() => {
              setUserRole('aprendiz');
              setCurrentTab('inicio');
              showNotification(
                'Vista de Aprendiz activada. Estás viendo la inducción tal como la ven tus alumnos.'
              );
            }}
            showNotification={showNotification}
          />
        )}

        {currentTab === 'inicio' && (
          <div className="space-y-10">
            <HeroBanner
              profile={profile}
              gamification={gamification}
              onStartLearning={() => setCurrentTab('derechos')}
              onOpenEvaluation={() => setCurrentTab('evaluacion')}
              onOpenCertificate={() => setCurrentTab('certificado')}
            />
            <InductionDashboard
              profile={profile}
              gamification={gamification}
              onNavigate={setCurrentTab}
              onOpenProfile={() => setIsProfileOpen(true)}
            />
          </div>
        )}

        {currentTab === 'derechos' && (
          <ModuleRights
            onCompleteModule={handleCompleteModule}
            isCompleted={gamification.completedModules.includes('derechos')}
          />
        )}

        {currentTab === 'deberes' && (
          <ModuleDuties
            onCompleteModule={handleCompleteModule}
            isCompleted={gamification.completedModules.includes('deberes')}
          />
        )}

        {currentTab === 'casos' && (
          <ModuleDilemmas
            onCompleteModule={handleCompleteModule}
            isCompleted={gamification.completedModules.includes('casos')}
          />
        )}

        {currentTab === 'etapa-productiva' && (
          <ModuleProductiveStage
            onCompleteModule={handleCompleteModule}
            isCompleted={gamification.completedModules.includes('etapa-productiva')}
          />
        )}

        {currentTab === 'evaluacion' && (
          <FinalAssessment
            onPassAssessment={handlePassAssessment}
            alreadyPassed={gamification.assessmentPassed}
            previousScore={gamification.assessmentScore}
            onOpenCertificate={() => setCurrentTab('certificado')}
          />
        )}

        {currentTab === 'certificado' && (
          <OfficialCertificate
            profile={profile}
            gamification={gamification}
            onOpenVerifier={() => setIsVerifierOpen(true)}
            onBackToHome={() => setCurrentTab('inicio')}
            onOpenSheetsSync={() => setIsSheetsOpen(true)}
            sheetUrl={sheetUrl}
            isGoogleConnected={!!googleUser}
            onOneClickConnectAndSync={handleOneClickConnectAndSync}
            isSyncing={isSyncing}
            userRole={userRole}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 py-8 px-4 sm:px-8 text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SenaLogo className="h-6" variant="full" />
            <div className="border-l border-slate-200 dark:border-slate-800 pl-3">
              <span>Servicio Nacional de Aprendizaje SENA · Dirección General</span>
              <span className="block text-[11px] text-slate-400 dark:text-slate-500">
                Reglamento del Aprendiz — Acuerdo 0009 de 2024 · Rol actual:{' '}
                <strong className="text-slate-800 dark:text-slate-200 capitalize">{userRole}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 sm:gap-6">
            {userRole === 'instructor' && (
              <button
                onClick={() => setIsSheetsOpen(true)}
                className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline transition-colors flex items-center gap-1.5"
              >
                <span>Hoja Google Drive</span>
              </button>
            )}

            <button
              onClick={() => {
                sessionStorage.removeItem('sena_session_authenticated');
                setIsLandingActive(true);
              }}
              className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline transition-colors flex items-center gap-1"
            >
              <span>Cambiar Rol / Portal de Inicio</span>
            </button>

            <button
              onClick={() => setIsRoleSwitchOpen(true)}
              className="text-blue-700 dark:text-blue-400 font-semibold hover:underline transition-colors flex items-center gap-1"
            >
              <span>{userRole === 'instructor' ? 'Cambiar a Vista Aprendiz' : 'Acceso Instructor'}</span>
            </button>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Consultar Reglamento
            </button>
            <button
              onClick={() => setIsVerifierOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Verificar Certificado
            </button>
            <button
              onClick={() => setIsProfileOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Ficha del Aprendiz
            </button>
          </div>
        </div>
      </footer>

      {/* Profile Modal */}
      <ApprenticeProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSaveProfile={setProfile}
        gamification={gamification}
        onOpenSheetsSync={userRole === 'instructor' ? () => setIsSheetsOpen(true) : undefined}
      />

      {/* Certificate Verification Modal */}
      <CertificateVerificationModal
        isOpen={isVerifierOpen}
        onClose={() => setIsVerifierOpen(false)}
        profile={profile}
        gamification={gamification}
      />

      {/* Search Drawer */}
      <RegulationSearchDrawer
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Google Drive & Sheets Sync Modal (Only opened by Instructor) */}
      <GoogleSheetsSyncModal
        isOpen={isSheetsOpen}
        onClose={() => setIsSheetsOpen(false)}
        profile={profile}
        gamification={gamification}
        onSuccessNotification={showNotification}
      />

      {/* Role Switcher Modal */}
      <RoleSwitchModal
        isOpen={isRoleSwitchOpen}
        onClose={() => setIsRoleSwitchOpen(false)}
        currentRole={userRole}
        onSelectRole={(newRole) => {
          setUserRole(newRole);
          if (newRole === 'instructor') {
            setCurrentTab('instructor');
            showNotification('Perfil de Instructor activado. Privilegios de gestión habilitados.');
          } else {
            setCurrentTab('inicio');
            showNotification('Vista de Aprendiz activada. Privilegios administrativos ocultos.');
          }
        }}
      />

      {/* Student Certificate Viewer Modal for Instructor */}
      <StudentCertificateViewerModal
        isOpen={!!selectedStudentForCert}
        onClose={() => setSelectedStudentForCert(null)}
        student={selectedStudentForCert}
      />

      {/* Toast Notification with subtle interactive link */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-slate-800 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-medium border border-slate-700 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-3 max-w-md">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="flex-1 leading-snug">{toastMessage}</span>
          {toastAction && (
            <a
              href={toastAction.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-md shrink-0 transition-colors shadow-xs"
            >
              <span>{toastAction.label}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
