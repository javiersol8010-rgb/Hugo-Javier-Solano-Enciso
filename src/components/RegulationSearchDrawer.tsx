import React, { useState } from 'react';
import { REGULATION_KNOWLEDGE_BASE } from '../data/regulationData';
import { RegulationSearchItem } from '../types/induction';
import { X, Search, BookOpen, Tag } from 'lucide-react';

interface RegulationSearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegulationSearchDrawer: React.FC<RegulationSearchDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<RegulationSearchItem | null>(null);

  if (!isOpen) return null;

  const filtered = REGULATION_KNOWLEDGE_BASE.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.chapter.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col transition-colors">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100">
              Compendio Normativo: Acuerdo 0009 de 2024
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Buscador rápido de capítulos y artículos del Reglamento del Aprendiz SENA.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por palabra clave (ej. derechos, faltas, IA, bitácoras, deserción)..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto p-6 space-y-4">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedItem?.id === item.id
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600'
                    : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-800 dark:text-emerald-400 mb-1">
                  <span>{item.chapter}</span>
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h4 className="font-display font-bold text-sm text-slate-900 dark:text-slate-100">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {item.summary}
                </p>

                {selectedItem?.id === item.id && (
                  <div className="mt-3 pt-3 border-t border-emerald-200 dark:border-emerald-800 text-xs text-slate-700 dark:text-slate-300 space-y-2 animate-in fade-in">
                    <p className="font-medium text-emerald-950 dark:text-emerald-200">
                      {item.fullNote}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300"
                        >
                          <Tag className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              No se encontraron artículos que coincidan con "{query}". Intenta buscar "deberes", "etapa productiva" o "sanciones".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Consejo Directivo Nacional SENA</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
