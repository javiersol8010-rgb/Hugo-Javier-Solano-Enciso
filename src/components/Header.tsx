import React from 'react';
import { SenaLogo } from './SenaLogo';
import { Award, User, Search, Sun, Moon, FileSpreadsheet, ShieldCheck, GraduationCap, Share2, LogOut } from 'lucide-react';
import { ApprenticeProfile, GamificationState, UserRole } from '../types/induction';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  profile: ApprenticeProfile;
  gamification: GamificationState;
  onOpenProfile: () => void;
  onOpenSearch: () => void;
  onOpenSheetsSync?: () => void;
  sheetUrl?: string | null;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  userRole: UserRole;
  onOpenRoleSwitch: () => void;
  onCopyApprenticeLink?: () => void;
  onExitToRoleSelection?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  gamification,
  onOpenProfile,
  onOpenSearch,
  onOpenSheetsSync,
  sheetUrl,
  isDarkMode,
  onToggleDarkMode,
  userRole,
  onOpenRoleSwitch,
  onCopyApprenticeLink,
  onExitToRoleSelection,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3.5 no-print transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-6">
        {/* Zone 1: Brand Zone - Single element lockup */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('inicio')}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity text-left"
            title="SENA Inducción al Reglamento"
          >
            <SenaLogo className="h-[61px]" variant="full" />
            <div className="hidden sm:block border-l border-slate-200 dark:border-slate-800 pl-3">
              <span className="block text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                Inducción al Reglamento
              </span>
              <span className="block text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                Acuerdo 0009 de 2024
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-5 Concise Single-line Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          {userRole === 'instructor' && (
            <button
              onClick={() => onSelectTab('instructor')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                currentTab === 'instructor'
                  ? 'text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-white font-semibold'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Panel Instructor</span>
            </button>
          )}

          <button
            onClick={() => onSelectTab('inicio')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'inicio'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-500'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Ruta de Inducción
          </button>
          <button
            onClick={() => onSelectTab('derechos')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'derechos'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-500'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Derechos del Aprendiz
          </button>
          <button
            onClick={() => onSelectTab('deberes')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'deberes'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-500'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Deberes y Ética
          </button>
          <button
            onClick={() => onSelectTab('casos')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'casos'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-500'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Casos del Comité
          </button>
          <button
            onClick={() => onSelectTab('etapa-productiva')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'etapa-productiva'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-500'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Etapa Productiva
          </button>
          <button
            onClick={() => onSelectTab('evaluacion')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'evaluacion'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-500'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Evaluación y Certificado
          </button>
        </nav>

        {/* Zone 3: Action Area with Role Badge & Dark Mode */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Quick Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="hidden md:inline-flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap"
            title="Buscar artículos en el reglamento"
          >
            <Search className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden xl:inline">Consultar Artículos</span>
          </button>

          {/* Role Indicator Button */}
          <button
            onClick={onOpenRoleSwitch}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all border shadow-xs ${
              userRole === 'instructor'
                ? 'font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60'
                : 'font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
            }`}
            title="Cambiar entre modo Instructor y modo Aprendiz"
          >
            {userRole === 'instructor' ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Instructor</span>
              </>
            ) : (
              <>
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Aprendiz</span>
              </>
            )}
          </button>

          {/* Return to Role Selection Landing */}
          {onExitToRoleSelection && (
            <button
              onClick={onExitToRoleSelection}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
              title="Volver al portal de bienvenida y selección de rol"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden md:inline">Cambiar Rol</span>
            </button>
          )}

          {/* Instructor Share Link Quick Button */}
          {userRole === 'instructor' && onCopyApprenticeLink && (
            <button
              onClick={onCopyApprenticeLink}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300/80 dark:border-emerald-800 rounded-lg transition-colors whitespace-nowrap shadow-xs"
              title="Copiar enlace exclusivo para compartir con aprendices"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden xl:inline">Enlace Aprendices</span>
            </button>
          )}

          {/* XP & Level Status Pill (Shown for Aprendiz) */}
          {userRole === 'aprendiz' && (
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/80 rounded-lg text-xs">
              <span className="font-semibold text-emerald-800 dark:text-emerald-300">Nivel {gamification.level}</span>
              <span className="text-emerald-400 dark:text-emerald-500 font-bold">·</span>
              <span className="font-mono tabular-nums text-emerald-700 dark:text-emerald-300 font-medium">
                {gamification.xp} XP
              </span>
            </div>
          )}

          {/* Profile & Certificate Primary Action */}
          {gamification.assessmentPassed ? (
            <button
              onClick={() => onSelectTab('certificado')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Mi Certificado</span>
              <span className="sm:hidden">Certificado</span>
            </button>
          ) : (
            <button
              onClick={onOpenProfile}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
              <span className="hidden sm:inline">Ficha</span>
            </button>
          )}

          {/* Google Drive / Sheets Sync Button - ONLY AVAILABLE TO INSTRUCTOR */}
          {userRole === 'instructor' && (
            sheetUrl ? (
              <a
                href={sheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300/80 dark:border-emerald-700 rounded-lg transition-colors whitespace-nowrap shadow-xs"
                title="Abrir hoja de cálculo de aprendices en Google Drive"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden md:inline">Hoja Drive</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Sincronizado" />
              </a>
            ) : onOpenSheetsSync ? (
              <button
                onClick={onOpenSheetsSync}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50/90 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300/80 dark:border-emerald-800 rounded-lg transition-colors whitespace-nowrap shadow-xs"
                title="Sincronizar y consultar registros en Google Sheets"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden md:inline">Google Drive</span>
              </button>
            ) : null
          )}

          {/* Dark Mode Icon Button - Positioned in the top right */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-slate-600 dark:text-amber-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 transition-all duration-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label="Alternar modo oscuro y modo claro"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 animate-in spin-in-180 duration-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto pt-2.5 pb-1 text-xs font-medium text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 mt-2.5 scrollbar-none">
        {userRole === 'instructor' && (
          <button
            onClick={() => onSelectTab('instructor')}
            className={`px-2.5 py-1 rounded whitespace-nowrap text-blue-700 dark:text-blue-300 font-bold ${
              currentTab === 'instructor'
                ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-900 dark:text-white'
                : 'bg-blue-50 dark:bg-blue-950/50'
            }`}
          >
            Panel Instructor
          </button>
        )}
        <button
          onClick={() => onSelectTab('inicio')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            currentTab === 'inicio'
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-semibold'
              : ''
          }`}
        >
          Inicio
        </button>
        <button
          onClick={() => onSelectTab('derechos')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            currentTab === 'derechos'
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-semibold'
              : ''
          }`}
        >
          Derechos
        </button>
        <button
          onClick={() => onSelectTab('deberes')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            currentTab === 'deberes'
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-semibold'
              : ''
          }`}
        >
          Deberes
        </button>
        <button
          onClick={() => onSelectTab('casos')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            currentTab === 'casos'
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-semibold'
              : ''
          }`}
        >
          Casos Reales
        </button>
        <button
          onClick={() => onSelectTab('etapa-productiva')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            currentTab === 'etapa-productiva'
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-semibold'
              : ''
          }`}
        >
          Etapa Productiva
        </button>
        <button
          onClick={() => onSelectTab('evaluacion')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            currentTab === 'evaluacion'
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-semibold'
              : ''
          }`}
        >
          Evaluación
        </button>
        {gamification.assessmentPassed && (
          <button
            onClick={() => onSelectTab('certificado')}
            className={`px-2.5 py-1 rounded whitespace-nowrap text-emerald-700 dark:text-emerald-400 font-bold ${
              currentTab === 'certificado' ? 'bg-emerald-200 dark:bg-emerald-900/60' : ''
            }`}
          >
            Certificado
          </button>
        )}
      </div>
    </header>
  );
};
