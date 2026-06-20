import React from 'react';
import { ScreenId } from '../types';

interface ProgressBarProps {
  currentScreen: ScreenId;
}

const SCREENS_ORDER: ScreenId[] = [
  'welcome',
  'station1_struggles',
  'station1_liberation',
  'station2_lost',
  'station2_restored',
  'station3_lies',
  'culminating',
  'gratitude_prayer',
  'cierre',
];

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentScreen }) => {
  const currentIndex = SCREENS_ORDER.indexOf(currentScreen);
  const totalSteps = SCREENS_ORDER.length - 1; // Welcome is 0
  const percentage = Math.round((currentIndex / totalSteps) * 100);

  // Determine current main visual phase
  let phaseName = 'Bienvenida';
  let phaseColor = 'text-amber-200';
  if (currentScreen.startsWith('station1')) {
    phaseName = 'Estación 1: El Esclavo Rescatado';
    phaseColor = 'text-[#d4a359]';
  } else if (currentScreen.startsWith('station2')) {
    phaseName = 'Estación 2: El Heredero Restaurado';
    phaseColor = 'text-amber-400';
  } else if (currentScreen.startsWith('station3_lies')) {
    phaseName = 'Estación 3: El Prisionero Liberado';
    phaseColor = 'text-amber-500';
  } else if (currentScreen === 'culminating') {
    phaseName = 'Momento Culminante';
    phaseColor = 'text-emerald-400 font-semibold';
  } else if (currentScreen === 'gratitude_prayer') {
    phaseName = 'Respuesta de Gratitud';
    phaseColor = 'text-rose-300';
  } else if (currentScreen === 'cierre') {
    phaseName = 'Cierre Final';
    phaseColor = 'text-slate-200';
  }

  if (currentScreen === 'welcome') {
    return null; // Don't show progress bar on welcome screen to maximize immersive focus
  }

  return (
    <div className="w-full select-none mb-6">
      {/* Upper Status Line */}
      <div className="flex justify-between items-center text-xs tracking-wider uppercase mb-2">
        <span className={`${phaseColor} transition-colors duration-500 font-mono font-medium`}>
          {phaseName}
        </span>
        <span className="text-slate-400 font-mono">
          {percentage}% completado
        </span>
      </div>

      {/* Actual Bar */}
      <div className="w-full bg-slate-900/60 rounded-full h-1.5 overflow-hidden border border-slate-800/20 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-[#d4a359] rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Small dot steps representing spiritual milestones */}
      <div className="flex justify-between px-1 mt-1.5 opacity-40">
        {SCREENS_ORDER.slice(1).map((scr, idx) => {
          const isActive = SCREENS_ORDER.indexOf(scr) <= currentIndex;
          return (
            <div
              key={scr}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                isActive ? 'bg-[#d4a359] scale-110 shadow-sm shadow-amber-400' : 'bg-slate-800'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
