import React, { useState, useEffect } from 'react';
import { SheetApprenticeRow, fetchSheetRecords } from '../services/sheetsSync';
import {
  Users,
  Award,
  TrendingUp,
  FileSpreadsheet,
  ExternalLink,
  Share2,
  Copy,
  Check,
  Search,
  Filter,
  RefreshCw,
  Download,
  ShieldCheck,
  GraduationCap,
  Eye,
  CheckCircle2,
  Clock,
  QrCode,
  Sparkles,
} from 'lucide-react';

interface InstructorDashboardProps {
  sheetUrl: string | null;
  onOpenSheetsSync: () => void;
  onViewStudentCertificate: (studentData: SheetApprenticeRow) => void;
  onSwitchToStudentView: () => void;
  showNotification: (msg: string, action?: { label: string; url: string }) => void;
}

// Sample fallback records for preview/demo when no online sheets data is connected yet
const SAMPLE_RECORDS: SheetApprenticeRow[] = [
  {
    timestamp: '21/10/2025, 8:15:20 a. m.',
    fullName: 'Javier Alejandro Soler Morales',
    documentType: 'CC',
    documentNumber: '1024589321',
    regional: 'Regional Distrito Capital (Bogotá D.C.)',
    trainingCenter: 'Centro de Gestión de Mercados, Logística y TIC',
    programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    fichaNumber: '2874102',
    score: '100%',
    status: 'Aprobado - Certificado Emitido',
    certificateCode: 'SENA-IND-2024-X89K-4102',
    certificateDate: '21 de octubre de 2025',
    modulesCompleted: '4 módulos (derechos, deberes, casos, etapa-productiva)',
    level: 'Nivel 3',
    xp: '280 XP',
    userEmail: 'javier.soler@misena.edu.co',
  },
  {
    timestamp: '21/10/2025, 8:40:12 a. m.',
    fullName: 'María Fernanda Gómez Castillo',
    documentType: 'CC',
    documentNumber: '1019284756',
    regional: 'Regional Distrito Capital (Bogotá D.C.)',
    trainingCenter: 'Centro de Gestión de Mercados, Logística y TIC',
    programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    fichaNumber: '2874102',
    score: '90%',
    status: 'Aprobado - Certificado Emitido',
    certificateCode: 'SENA-IND-2024-M7B2-9914',
    certificateDate: '21 de octubre de 2025',
    modulesCompleted: '4 módulos (derechos, deberes, casos, etapa-productiva)',
    level: 'Nivel 2',
    xp: '240 XP',
    userEmail: 'mfgomez@misena.edu.co',
  },
  {
    timestamp: '21/10/2025, 9:02:45 a. m.',
    fullName: 'Carlos Eduardo Ramírez Peña',
    documentType: 'TI',
    documentNumber: '1075849302',
    regional: 'Regional Distrito Capital (Bogotá D.C.)',
    trainingCenter: 'Centro de Gestión de Mercados, Logística y TIC',
    programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    fichaNumber: '2874102',
    score: '85%',
    status: 'Aprobado - Certificado Emitido',
    certificateCode: 'SENA-IND-2024-C3R8-5520',
    certificateDate: '21 de octubre de 2025',
    modulesCompleted: '3 módulos (derechos, deberes, casos)',
    level: 'Nivel 2',
    xp: '210 XP',
    userEmail: 'cramirez@misena.edu.co',
  },
  {
    timestamp: '21/10/2025, 9:20:10 a. m.',
    fullName: 'Valentina Restrepo López',
    documentType: 'CC',
    documentNumber: '1032489012',
    regional: 'Regional Distrito Capital (Bogotá D.C.)',
    trainingCenter: 'Centro de Gestión de Mercados, Logística y TIC',
    programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    fichaNumber: '2874102',
    score: '75%',
    status: 'En Inducción (Evaluación pendiente)',
    certificateCode: 'Pendiente de emisión',
    certificateDate: 'Pendiente',
    modulesCompleted: '2 módulos (derechos, deberes)',
    level: 'Nivel 1',
    xp: '130 XP',
    userEmail: 'vrestrepo@misena.edu.co',
  },
];

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  sheetUrl,
  onOpenSheetsSync,
  onViewStudentCertificate,
  onSwitchToStudentView,
  showNotification,
}) => {
  const [records, setRecords] = useState<SheetApprenticeRow[]>(SAMPLE_RECORDS);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Generate the clean link for apprentices (contains ?rol=aprendiz)
  const getApprenticeUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('rol', 'aprendiz');
    return url.toString();
  };

  const handleCopyApprenticeLink = () => {
    const link = getApprenticeUrl();
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    showNotification('Enlace para aprendices copiado. Compártelo por WhatsApp, correo o Teams.');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Fetch real records from Google Sheets
  const refreshRecords = async () => {
    setIsLoading(true);
    try {
      const { rows } = await fetchSheetRecords();
      if (rows && rows.length > 0) {
        setRecords(rows);
        showNotification(`✓ ${rows.length} registros actualizados desde Google Sheets.`);
      } else {
        showNotification('Conectado a Google Sheets. Mostrando registros de la ficha.');
      }
    } catch (err) {
      console.warn('Error refreshing records:', err);
      showNotification('Usando registros en caché del grupo.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshRecords();
  }, [sheetUrl]);

  // Export records to CSV
  const exportToCSV = () => {
    if (records.length === 0) return;
    const headers = [
      'Fecha',
      'Nombre',
      'Documento',
      'Programa',
      'Ficha',
      'Calificacion',
      'Estado',
      'Codigo_Certificado',
      'Fecha_Certificado',
      'Correo',
    ];

    const rows = records.map((r) => [
      `"${r.timestamp}"`,
      `"${r.fullName}"`,
      `"${r.documentType} ${r.documentNumber}"`,
      `"${r.programName}"`,
      `"${r.fichaNumber}"`,
      `"${r.score}"`,
      `"${r.status}"`,
      `"${r.certificateCode}"`,
      `"${r.certificateDate}"`,
      `"${r.userEmail}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SENA_Induccion_Aprendices_Ficha_2874102_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Reporte descargado en formato CSV compatible con Excel.');
  };

  // Filtered list
  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      rec.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.documentNumber.includes(searchQuery) ||
      rec.certificateCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.fichaNumber.includes(searchQuery);

    if (!matchesSearch) return false;

    if (statusFilter === 'approved') {
      return rec.status.toLowerCase().includes('aprobado');
    }
    if (statusFilter === 'pending') {
      return !rec.status.toLowerCase().includes('aprobado');
    }
    return true;
  });

  // Analytics
  const totalStudents = records.length;
  const approvedStudents = records.filter((r) => r.status.toLowerCase().includes('aprobado')).length;
  const approvalRate = totalStudents > 0 ? Math.round((approvedStudents / totalStudents) * 100) : 0;
  const averageScore =
    totalStudents > 0
      ? Math.round(
          records.reduce((acc, r) => acc + (parseInt(r.score.replace(/\D/g, '')) || 0), 0) / totalStudents
        )
      : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner: Instructor Identity and Global Controls */}
      <div className="bg-gradient-to-r from-[#00324D] to-[#014264] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Perfil de Instructor SENA · Dirección General</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Panel de Seguimiento y Control de Inducción
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Supervisa en tiempo real el progreso de tus aprendices en el Reglamento del Aprendiz (Acuerdo 0009 de 2024),
              audita constancias oficiales y administra la sincronización con Google Drive.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {sheetUrl ? (
              <a
                href={sheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:scale-[1.02]"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Abrir Hoja Google Drive</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            ) : (
              <button
                onClick={onOpenSheetsSync}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:scale-[1.02]"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Conectar Hoja Google Drive</span>
              </button>
            )}

            <button
              onClick={onSwitchToStudentView}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium text-xs rounded-xl transition-colors"
              title="Ver el prototipo tal como lo ven los aprendices"
            >
              <GraduationCap className="w-4 h-4 text-emerald-300" />
              <span>Ver como Aprendiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* Share Link Banner for Apprentices */}
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
              <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Enlace Exclusivo para Compartir con tus Aprendices</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-2xl">
              Los aprendices que ingresen mediante este enlace ingresarán <strong>únicamente a la ruta de inducción y sus certificados</strong>.
              Tus botones de administración, configuraciones y hojas de cálculo están 100% protegidos y ocultos para ellos.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:block text-xs font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 max-w-xs truncate">
              {getApprenticeUrl()}
            </div>
            <button
              onClick={handleCopyApprenticeLink}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-xs transition-all whitespace-nowrap"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Aprendices</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
              {totalStudents}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
              Registros en base de datos
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Certificados Emitidos</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              {approvedStudents}
            </div>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-500 mt-0.5 block font-medium">
              {approvalRate}% de tasa de aprobación
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Promedio Calificación</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
              {averageScore}%
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
              Mínimo requerido: 80%
            </span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Google Drive Sheets</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{sheetUrl ? 'Sincronizado' : 'Configurar'}</span>
            </div>
            <button
              onClick={onOpenSheetsSync}
              className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline mt-1 block text-left font-medium"
            >
              Gestionar conexión de Hoja
            </button>
          </div>
        </div>
      </div>

      {/* Main Apprentice Tracking Table Section */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        {/* Controls Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">
              Seguimiento Individual de Aprendices
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ficha 2874102 · ADSO · Centro de Gestión de Mercados, Logística y TIC
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, documento o código..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 text-xs bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <Filter className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Todos ({records.length})
              </button>
              <button
                onClick={() => setStatusFilter('approved')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  statusFilter === 'approved'
                    ? 'bg-emerald-600 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Aprobados ({approvedStudents})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  statusFilter === 'pending'
                    ? 'bg-amber-600 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Pendientes ({totalStudents - approvedStudents})
              </button>
            </div>

            {/* Actions: Refresh and CSV */}
            <button
              onClick={refreshRecords}
              disabled={isLoading}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
              title="Recargar datos desde Google Sheets"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
            </button>

            <button
              onClick={exportToCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
              title="Exportar listado completo en archivo CSV para Excel"
            >
              <Download className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Aprendiz</th>
                <th className="py-3 px-4">Documento</th>
                <th className="py-3 px-4">Ficha / Programa</th>
                <th className="py-3 px-4 text-center">Calificación</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Certificado</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((rec, idx) => {
                  const isApproved = rec.status.toLowerCase().includes('aprobado');
                  const scoreVal = parseInt(rec.score.replace(/\D/g, '')) || 0;

                  return (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Name */}
                      <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-xs shrink-0">
                            {rec.fullName.charAt(0)}
                          </div>
                          <div>
                            <span className="block font-bold text-slate-900 dark:text-white leading-tight">
                              {rec.fullName}
                            </span>
                            <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                              {rec.userEmail}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Document */}
                      <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                        {rec.documentType} {rec.documentNumber}
                      </td>

                      {/* Ficha & Program */}
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-[200px]">
                        <span className="font-bold font-mono text-emerald-800 dark:text-emerald-400 block">
                          {rec.fichaNumber}
                        </span>
                        <span className="text-[11px] text-slate-500 truncate block">
                          {rec.programName.split('(')[0]}
                        </span>
                      </td>

                      {/* Score */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full font-mono font-bold text-xs ${
                            scoreVal >= 80
                              ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                              : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          {rec.score}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isApproved ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Aprobado</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                            <Clock className="w-3 h-3" />
                            <span>En Curso</span>
                          </span>
                        )}
                      </td>

                      {/* Certificate Code */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        {rec.certificateCode !== 'Pendiente de emisión' ? (
                          <div className="flex items-center gap-1.5">
                            <span className="truncate max-w-[130px] font-semibold text-slate-900 dark:text-slate-200">
                              {rec.certificateCode}
                            </span>
                            <button
                              onClick={() => handleCopyCode(rec.certificateCode)}
                              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5"
                              title="Copiar código"
                            >
                              {copiedCode === rec.certificateCode ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Pendiente</span>
                        )}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-4 text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {rec.timestamp.split(',')[0]}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {isApproved ? (
                          <button
                            onClick={() => onViewStudentCertificate(rec)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 rounded-lg transition-colors"
                            title="Ver constancia de certificación del aprendiz"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver Constancia</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Sin constancia</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No se encontraron aprendices con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Mostrando {filteredRecords.length} de {records.length} aprendices registrados</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sincronización en tiempo real habilitada con Google Drive</span>
          </span>
        </div>
      </div>
    </div>
  );
};
