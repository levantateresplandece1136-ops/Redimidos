import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  ArrowLeft, 
  TrendingUp,
  Heart, 
  BookOpen, 
  Feather, 
  Download, 
  Copy, 
  Check, 
  RefreshCw,
  Sparkles,
  Award,
  Calendar,
  Lock,
  Unlock,
  Inbox,
  Moon,
  Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId, UserResponses, INITIAL_RESPONSES } from './types';
import { 
  ChainIllustration, 
  HearthIllustration, 
  PrisonIllustration, 
  GraceCrossIllustration 
} from './components/Simbologia';
import { ProgressBar } from './components/ProgressBar';

// Minimal Web Audio API Synth implementation inside the component scope
class ReflectionAudioEngine {
  private ctx: AudioContext | null = null;
  private filter: BiquadFilterNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private gain: GainNode | null = null;
  private isCurrentlyPlaying = false;

  public get isPlaying(): boolean {
    return this.isCurrentlyPlaying;
  }

  start() {
    if (this.isCurrentlyPlaying) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Lowpass filter for warm, soothing dark cinematic pad
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(320, this.ctx.currentTime);
      
      this.gain = this.ctx.createGain();
      this.gain.gain.setValueAtTime(0, this.ctx.currentTime);
      
      // Warm fade in to protect ears and feel premium
      this.filter.connect(this.gain);
      this.gain.connect(this.ctx.destination);
      this.gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 3.0);

      // We compose an elevating, glorious open chord: 
      // E2 (82.41 Hz), B2 (110 Hz), E3 (164.81 Hz), F#3 (185 Hz), G#3 (207.65 Hz) - beautiful Major add9 resolve over E.
      const baseNotes = [82.41, 123.47, 164.81, 246.94, 329.63];
      
      baseNotes.forEach((freq, idx) => {
        if (!this.ctx || !this.filter) return;
        
        const osc = this.ctx.createOscillator();
        // Warm saw and triangle mixture
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const oscGain = this.ctx.createGain();
        oscGain.gain.setValueAtTime(0.04 - (idx * 0.005), this.ctx.currentTime);

        // LFO/Vibrato to make the sound sound biological & living
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.18 + (idx * 0.05), this.ctx.currentTime);
        lfoGain.gain.setValueAtTime(3, this.ctx.currentTime); // frequency dev

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        osc.connect(oscGain);
        oscGain.connect(this.filter);
        osc.start();
        this.oscillators.push(osc);
      });

      this.isCurrentlyPlaying = true;
    } catch (e) {
      console.warn("Audio Context not supported or blocked by sandbox policies:", e);
    }
  }

  stop() {
    if (!this.isCurrentlyPlaying) return;
    try {
      if (this.ctx && this.gain) {
        this.gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.2);
        setTimeout(() => {
          this.oscillators.forEach(osc => {
            try { osc.stop(); } catch(e){}
          });
          this.oscillators = [];
          if (this.ctx) {
            this.ctx.close();
            this.ctx = null;
          }
        }, 1300);
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.isCurrentlyPlaying = false;
    }
  }
}

export default function App() {
  const [screen, setScreen] = useState<ScreenId>('welcome');
  const [isReadingMode, setIsReadingMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('redencion_reading_mode') === 'true';
    } catch {
      return false;
    }
  });

  const [responses, setResponses] = useState<UserResponses>(() => {
    // Attempt local storage hydration safely
    try {
      const saved = localStorage.getItem('redencion_responses');
      return saved ? JSON.parse(saved) : { ...INITIAL_RESPONSES };
    } catch {
      return { ...INITIAL_RESPONSES };
    }
  });

  // Sync reading mode state with local storage
  useEffect(() => {
    try {
      localStorage.setItem('redencion_reading_mode', String(isReadingMode));
    } catch (e) {
      console.error("Local storage error:", e);
    }
  }, [isReadingMode]);
  
  const [customStruggleInput, setCustomStruggleInput] = useState('');
  const [customLostInput, setCustomLostInput] = useState('');
  
  // Audio state
  const [isAudioOn, setIsAudioOn] = useState(false);
  const synthRef = useRef<ReflectionAudioEngine | null>(null);

  // Copied alert state
  const [copied, setCopied] = useState(false);

  // Dynamic class helpers for Reading Mode (increased line height and warmer contrast)
  const paragraphClass = isReadingMode 
    ? 'text-[14px] sm:text-[15px] leading-[1.8] text-amber-200/95 font-serif' 
    : 'text-xs sm:text-sm leading-relaxed text-slate-400';

  const headingClass = isReadingMode
    ? 'text-xl sm:text-2xl font-serif text-amber-100 font-bold tracking-normal'
    : 'text-xl sm:text-2xl font-serif text-slate-200 tracking-tight leading-snug';

  const welcomeTextClass = isReadingMode
    ? 'text-sm sm:text-[15px] leading-[1.8] text-amber-200/95 font-serif space-y-5'
    : 'space-y-4 text-slate-300 text-sm sm:text-[15px] leading-relaxed';

  const quoteClass = isReadingMode
    ? 'border-l-2 border-[#d4a359]/40 pl-3 italic text-amber-300/80 font-serif leading-[1.8]'
    : 'border-l-2 border-[#d4a359]/30 pl-3 italic text-slate-400';

  const inputStyleClass = isReadingMode
    ? 'bg-[#080503] border-amber-950 text-amber-100 placeholder:text-amber-900/50 focus:border-amber-800 focus:ring-1 focus:ring-amber-950/50'
    : 'bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-700 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30';

  // Count of completed stations (as a measurement of grace recognized)
  const getCompletedStationsCount = () => {
    let completed = 0;
    const s1 = (responses.struggles?.length > 0) && 
               (responses.selfEffort?.trim().length > 0) && 
               (responses.gratitudeLiberation?.trim().length > 0);
    if (s1) completed++;
    
    const s2 = (responses.lostTraits?.length > 0) && 
               (responses.restoredDetails?.trim().length > 0) && 
               (responses.restorationSentence?.trim().length > 0);
    if (s2) completed++;
    
    const s3 = (responses.believedLie?.trim().length > 0) && 
               (responses.governingTruth?.trim().length > 0);
    if (s3) completed++;
    
    return completed;
  };

  const graceCount = getCompletedStationsCount();

  // Culminating screen states
  const [culminatingPhase, setCulminatingPhase] = useState(0); 
  const [secondsRemaining, setSecondsRemaining] = useState(6);
  const [culminatingReady, setCulminatingReady] = useState(false);

  // Declaraciones que refuerzan la identidad en Cristo de cada elemento redimido
  const [declaredDeclarations, setDeclaredDeclarations] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('redencion_declared_declarations');
      return saved ? JSON.parse(saved) : { liberacion: false, restauracion: false, verdad: false };
    } catch {
      return { liberacion: false, restauracion: false, verdad: false };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('redencion_declared_declarations', JSON.stringify(declaredDeclarations));
    } catch (e) {
      console.error("Local storage error on declarations:", e);
    }
  }, [declaredDeclarations]);

  // Generador dinámico de oración devocional basado en declaraciones personales de identidad en Cristo
  const generateDefaultPrayer = () => {
    const strugglesStr = responses.struggles.join(', ');
    const lostStr = responses.lostTraits.join(', ');
    const restoredStr = responses.restoredDetails?.trim();
    const sentence = responses.restorationSentence?.trim();
    const lie = responses.believedLie?.trim();
    const truth = responses.governingTruth?.trim();

    return `Amado Jesús,
Hoy delante de Ti proclamo con profunda gratitud mi camino de redención:

1. LIBERTAD: Te doy gracias porque pagaste el precio de mi rescate, quebrando la esclavitud de: "${strugglesStr || 'mis debilidades'}". En Tu amor incondicional ya no soy esclavo, ¡soy perfectamente libre!

2. RESTAURACIÓN: Te doy gracias porque en Tu mesa me devolviste la dignidad, paz y herencia de: "${lostStr || 'mi vida pura'}" (${restoredStr || 'restaurado por Tu gracia'}). Gracias de corazón, porque sé que restauraste: "${sentence || 'todo lo que el pecado desoló'}". En Ti soy un Hijo y Heredero legítimo de Tu Reino de gracia.

3. VERDAD: Te doy gracias porque derribaste los muros de mi prisión mental. Desecho hoy la mentira de que "${lie || 'no soy suficiente'}" y me abrazo con fe a Tu verdad gobernante de que "${truth || 'en Ti soy infinitamente amado y sustentado'}". En Ti tengo una mente sana y camino en la luz de Tu verdad eterna.

Sello hoy mi nueva identidad restaurada en Ti, con el compromiso de recordar siempre de dónde me sacaste, para guiar a otros con Tu misma misericordia y compasión.

Amén.`;
  };

  // Sync state with localstorage safely (strict requirements: "respuestas permanecen privadas, persistencia temporal de respuestas durante la sesión")
  useEffect(() => {
    try {
      localStorage.setItem('redencion_responses', JSON.stringify(responses));
    } catch (e) {
      console.error("Local storage not writable:", e);
    }
  }, [responses]);

  // Audio start/stop handler
  const handleToggleAudio = () => {
    if (!synthRef.current) {
      synthRef.current = new ReflectionAudioEngine();
    }
    
    if (isAudioOn) {
      synthRef.current.stop();
      setIsAudioOn(false);
    } else {
      synthRef.current.start();
      setIsAudioOn(true);
    }
  };

  // Timer logic for the intense central culmination step
  useEffect(() => {
    let interval: any;
    if (screen === 'culminating') {
      setCulminatingPhase(0);
      setSecondsRemaining(6);
      setCulminatingReady(false);

      // Phase changes automatically after seconds
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCulminatingReady(true);
            return 0;
          }
          
          // Step-by-step reveal triggers
          if (prev === 5) setCulminatingPhase(1);
          if (prev === 3) setCulminatingPhase(2);
          if (prev === 2) setCulminatingPhase(3);
          
          return prev - 1;
        });
      }, 1100);
    }
    return () => clearInterval(interval);
  }, [screen]);

  // Reset helper
  const handleReset = () => {
    if (window.confirm('¿Deseas iniciar una nueva reflexión limpia? Todo tu progreso anterior volverá a comenzar.')) {
      setResponses({ ...INITIAL_RESPONSES });
      setDeclaredDeclarations({ liberacion: false, restauracion: false, verdad: false });
      setScreen('welcome');
      setCustomStruggleInput('');
      setCustomLostInput('');
    }
  };

  // Safe back routing helper
  const navigateBack = () => {
    if (screen === 'station1_struggles') setScreen('welcome');
    else if (screen === 'station1_liberation') setScreen('station1_struggles');
    else if (screen === 'station2_lost') setScreen('station1_liberation');
    else if (screen === 'station2_restored') setScreen('station2_lost');
    else if (screen === 'station3_lies') setScreen('station2_restored');
    else if (screen === 'culminating') setScreen('station3_lies');
    else if (screen === 'gratitude_prayer') setScreen('culminating');
    else if (screen === 'cierre') setScreen('gratitude_prayer');
  };

  const toggleDeclaration = (key: 'liberacion' | 'restauracion' | 'verdad') => {
    setDeclaredDeclarations(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      const allDone = updated.liberacion && updated.restauracion && updated.verdad;
      if (allDone) {
        setResponses(r => {
          if (!r.prayer || !r.prayer.trim()) {
            return { ...r, prayer: generateDefaultPrayer() };
          }
          return r;
        });
      }
      return updated;
    });
  };

  // Multiselect togglers
  const toggleStruggle = (struggle: string) => {
    setResponses(prev => {
      const exists = prev.struggles.includes(struggle);
      const updated = exists 
        ? prev.struggles.filter(s => s !== struggle) 
        : [...prev.struggles, struggle];
      return { ...prev, struggles: updated };
    });
  };

  const toggleLostTrait = (trait: string) => {
    setResponses(prev => {
      const exists = prev.lostTraits.includes(trait);
      const updated = exists 
        ? prev.lostTraits.filter(t => t !== trait) 
        : [...prev.lostTraits, trait];
      return { ...prev, lostTraits: updated };
    });
  };

  // Standard struggles options
  const STRUGGLE_OPTIONS = [
    'Necesidad de aprobación',
    'Ira / Resentimiento',
    'Ansiedad',
    'Temor al futuro / rechazo',
    'Orgullo / Autosuficiencia',
    'Control / Perfeccionismo',
    'Materialismo / Ambición',
    'Comparación',
    'Culpa',
    'Adicciones',
  ];

  // Standard lost traits
  const LOST_TRAITS_OPTIONS = [
    'Identidad ordenada',
    'Paz profunda',
    'Propósito claro',
    'Gozo genuino',
    'Dignidad restaurada',
    'Esperanza de vida',
    'Relaciones sanas',
    'Confianza en los demás',
  ];

  // Standard mental lies suggestion templates
  const LIES_EXAMPLES = [
    'No valgo nada',
    'Nunca podré cambiar',
    'Estoy completamente solo',
    'Dios está cansado de mí y de mis faltas',
    'Mi pasado define mi eternidad',
  ];

  // Copy full reflection dossier text to clipboard safely
  const copyDossierToClipboard = () => {
    const text = `===========================================
REFLEXIÓN PERSONAL: RECUERDA DE DÓNDE TE SACÓ
Una experiencia íntima sobre la redención de Cristo
Curso de Consejería Bíblica
===========================================

ESTACIÓN 1: EL ESCLAVO RESCATADO
- Sentía dominio o luchas con: ${responses.struggles.join(', ') || 'Ninguno especificado'}
- Intento fallido con mis propias fuerzas:
  "${responses.selfEffort || 'No respondido'}"
- Aspecto de Su liberación por el que agradezco:
  "${responses.gratitudeLiberation || 'No respondido'}"

ESTACIÓN 2: EL HEREDERO RESTAURADO
- Lo que sentía que el pecado había robado: ${responses.lostTraits.join(', ') || 'Ninguno especificado'}
- Lo que Dios me ha devuelto:
  "${responses.restoredDetails || 'No respondido'}"
- Frase de gratitud proclamada:
  "Gracias Jesús, porque restauraste ${responses.restorationSentence || '...'}"

ESTACIÓN 3: EL PRISIONERO LIBERADO
- La mentira que gobernaba mi corazón:
  "${responses.believedLie || 'No respondida'}"
- La verdad del Evangelio que me gobierna hoy:
  "${responses.governingTruth || 'No respondida'}"

MI RESPUESTA DE GRATITUD:
- Oración directa escrita a Jesús:
  "${responses.prayer || 'No respondida'}"

-------------------------------------------
"Porque el Hijo del Hombre vino a buscar y a salvar lo que se había perdido." - Lucas 19:10
===========================================`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  // Download dossier as local .txt file
  const downloadDossierText = () => {
    const text = `===========================================
REFLEXIÓN PERSONAL: RECUERDA DE DÓNDE TE SACÓ
Una experiencia de redención para consejeros bíblicos
===========================================

ESTACIÓN 1: EL ESCLAVO RESCATADO
- Luchas o temores que ejercían dominio: ${responses.struggles.join(', ') || 'Ninguno'}
- Mi lucha bajo mis propias fuerzas:
  "${responses.selfEffort || 'Sin respuesta'}"
- Mi agradecimiento por la liberación:
  "${responses.gratitudeLiberation || 'Sin respuesta'}"

ESTACIÓN 2: EL HEREDERO RESTAURADO
- Lo que sentía que había perdido: ${responses.lostTraits.join(', ') || 'Ninguno'}
- Lo que Dios me ha devuelto hoy:
  "${responses.restoredDetails || 'Sin respuesta'}"
- Declaración restaurada:
  "Gracias Jesús, porque restauraste: ${responses.restorationSentence || '...'}"

ESTACIÓN 3: EL PRISIONERO LIBERADO
- Mentira que solía gobernarme:
  "${responses.believedLie || 'Sin respuesta'}"
- Verdad del Evangelio que reina hoy:
  "${responses.governingTruth || 'Sin respuesta'}"

MI RESPUESTA DE GRATITUD:
- Mi oración personal conversando con Cristo:
  "${responses.prayer || 'Sin respuesta'}"

-------------------------------------------
"Porque el Hijo del Hombre vino a buscar y a salvar lo que se había perdido." - Lucas 19:10
===========================================`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Mi_Reflexion_Redencion_${new Date().toISOString().slice(0,10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-start py-8 px-4 relative overflow-hidden transition-all duration-700 ${
      isReadingMode ? 'bg-[#040301] text-[#f7eada]' : 'bg-slate-950 text-slate-100'
    }`}>
      
      {/* Decorative Warm Ambient backlighting or particles */}
      <div 
        className="absolute top-[-25%] left-[-10%] w-[120%] h-[150%] pointer-events-none select-none transition-all duration-1000 opacity-30 saturate-150"
        style={{
          background: isReadingMode
            ? (screen === 'culminating'
              ? 'radial-gradient(circle, rgba(146,64,14,0.18) 0%, rgba(4,3,1,0.9) 60%, rgba(4,3,1,1) 100%)'
              : 'radial-gradient(circle, rgba(146,64,14,0.12) 0%, rgba(0,0,0,0) 65%)')
            : (screen === 'culminating' 
              ? 'radial-gradient(circle, rgba(254,240,138,0.45) 0%, rgba(255,255,255,0.7) 40%, rgba(248,250,252,0.9) 100%)'
              : 'radial-gradient(circle, rgba(212,163,89,0.12) 0%, rgba(0,0,0,0) 65%)')
        }}
      />

      {/* Mini top interface bar (Audio controllers & reset) */}
      <header className="w-full max-w-md mx-auto flex justify-between items-center z-10 py-2 border-b border-rose-950/10 mb-4 text-xs font-mono select-none">
        <div className={`flex items-center gap-2 ${isReadingMode ? 'text-amber-300/60' : 'text-slate-400'}`}>
          <BookOpen className="w-4 h-4 text-[#d4a359]" />
          <span>Curso de Consejería Bíblica</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Button Modo Lectura */}
          <button
            onClick={() => setIsReadingMode(prev => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all duration-300 ${
              isReadingMode 
                ? 'bg-[#d4a359]/20 border-amber-650 text-amber-200 shadow-md shadow-[#d4a359]/5 hover:bg-[#d4a359]/30' 
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
            title="Modo Lectura: Ideal para la reflexión nocturna, con contrastes cálidos, suaves e íntimos"
            id="reading-mode-toggle-btn"
          >
            {isReadingMode ? (
              <>
                <Moon className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="text-[10px] hidden sm:inline">NOCHE</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[10px] hidden sm:inline">DÍA</span>
              </>
            )}
            <span className="text-[10px] hidden sm:inline">LECTURA</span>
            <span className="text-[10px] inline sm:hidden">{isReadingMode ? 'NOCHE' : 'DÍA'}</span>
          </button>

          {/* Audio toggle button with sound waves effect */}
          <button
            onClick={handleToggleAudio}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all duration-300 ${
              isAudioOn 
                ? 'bg-[#d4a359]/10 border-[#d4a359] text-amber-300 shadow-md shadow-[#d4a359]/5' 
                : (isReadingMode ? 'bg-[#0f0a06]/80 border-amber-950/50 text-amber-300/50 hover:border-amber-900/50' : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700')
            }`}
            title="Activa o desactiva la música reflexiva ambiental"
            id="audio-toggle-btn"
          >
            {isAudioOn ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="text-[10px] hidden sm:inline">MÚSICA</span>
          </button>

          {screen !== 'welcome' && (
            <button
              onClick={handleReset}
              className={`transition-colors py-1 px-2 rounded ${
                isReadingMode 
                  ? 'text-amber-500 hover:text-rose-400 hover:bg-amber-950/20' 
                  : 'text-slate-500 hover:text-rose-400 hover:bg-slate-900/40'
              }`}
              title="Iniciar una nueva sesión y vaciar respuestas"
              id="reset-session-btn"
            >
              <RefreshCw className="w-3 h-3 inline mr-1" />
              <span>REINICIAR</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Focus Card Frame Container */}
      <main 
        id="devotional-card"
        className={`w-full max-w-md backdrop-blur-md rounded-2xl p-6 sm:p-8 flex flex-col justify-between border relative transition-all duration-1000 ${
          isReadingMode 
            ? (screen === 'culminating'
              ? 'bg-[#120a05]/95 border-amber-900/50 shadow-2xl shadow-yellow-950/40 text-amber-50/90'
              : 'bg-[#0b0805]/95 border-[#1f120a] shadow-2xl shadow-black/95 text-[#f4e2ce]')
            : (screen === 'culminating'
              ? 'bg-slate-50 border-amber-300 shadow-2xl shadow-yellow-500/20 text-slate-900' 
              : 'border-slate-800/80 shadow-xl shadow-black/80 text-slate-100')
        }`}
        style={{ minHeight: '610px' }}
      >
        {/* Gratitude/Grace Count Tracker in the corner of the card */}
        <div 
          className={`absolute -top-3.5 right-6 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono tracking-wider transition-all duration-500 shadow-md select-none ${
            isReadingMode 
              ? 'bg-[#180f08] border-[#3d1d07] text-amber-300 shadow-[#0c0602]/80' 
              : 'bg-slate-900 border-slate-800 text-amber-400 shadow-black/85'
          }`}
          title="Estaciones de gracia completadas y reconocidas hoy"
          id="gratitude-tracker-badge"
        >
          <Sparkles className={`w-3 h-3 transition-colors duration-500 ${graceCount > 0 ? 'text-amber-400' : 'text-slate-500'}`} />
          <span className={isReadingMode ? 'text-amber-400/60' : 'text-slate-400'}>GRACIA:</span>
          <motion.span
            key={graceCount}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: [0.8, 1.45, 1], opacity: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className={`font-semibold cursor-default ${isReadingMode ? 'text-amber-305' : 'text-amber-300'}`}
          >
            {graceCount}
          </motion.span>
          <span className={isReadingMode ? 'text-amber-500/30' : 'text-slate-600'}>/</span>
          <span className={isReadingMode ? 'text-amber-400/50' : 'text-slate-500'}>3</span>
        </div>

        {/* Progress header inside the card container */}
        <ProgressBar currentScreen={screen} />

        {/* Dynamic Route Screen Switcher */}
        <div className="flex-grow flex flex-col justify-center py-2 h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col h-full justify-between"
            >
              
              {/* SCREEN: WELCOME / INICIO */}
              {screen === 'welcome' && (
                <div id="screen-welcome" className="text-center flex flex-col items-center">
                  <GraceCrossIllustration active={true} />
                  
                  <h1 className="text-2xl sm:text-3xl font-serif text-amber-200 tracking-tight leading-snug mt-6 mb-2">
                    ¿Recuerdas quién eras antes de ser alcanzado por la gracia?
                  </h1>
                  
                  <p className="text-xs text-[#d4a359] uppercase tracking-[0.15em] font-mono mb-6 font-medium">
                    Una experiencia íntima sobre la redención
                  </p>

                  <div className={`${welcomeTextClass} text-center px-1 max-w-sm`}>
                    <p>
                      Durante unos minutos no pienses como consejero.
                    </p>
                    <p className={quoteClass}>
                      "No pienses en las personas a quienes ayudas. Piensa en ti. Recuerda quién eras. Recuerda quién eres hoy."
                    </p>
                    <p>
                      Porque quienes olvidan de dónde fueron rescatados corren el riesgo de ministrar sin asombro.
                    </p>
                    <p className={`font-semibold ${isReadingMode ? 'text-amber-200' : 'text-amber-100'}`}>
                      Pero quienes recuerdan su propia redención sirven con humildad, compasión y gratitud.
                    </p>
                  </div>

                  {/* Warning on Private Context */}
                  <div className="mt-8 flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-950/60 p-2.5 rounded-lg border border-slate-900/60 w-full max-w-xs justify-center font-mono">
                    <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Respuestas 100% privadas (sin servidor)</span>
                  </div>

                  <div className="w-full mt-8">
                    <button
                      onClick={() => setScreen('station1_struggles')}
                      className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-[#d4a359] hover:from-amber-500 hover:to-amber-300 text-slate-950 font-semibold rounded-xl transition-all duration-300 tracking-wider shadow-lg shadow-amber-900/10 active:scale-[0.99] group text-sm flex items-center justify-center gap-2 cursor-pointer"
                      id="welcome-start-btn"
                    >
                      COMENZAR LA EXPERIENCIA
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                    <p className="text-[10px] text-slate-600 mt-2.5 font-mono">
                      Duración estimada: 7 - 10 minutos
                    </p>
                  </div>
                </div>
              )}


              {/* SCREEN: ESTACIÓN 1 - STRUGGLES / PREDISPOCISIÓN (A) */}
              {screen === 'station1_struggles' && (
                <div id="screen-station-1a" className="flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-center gap-2 text-rose-300/90 text-[11px] font-mono tracking-widest uppercase mb-1">
                      <Flame className="w-3.5 h-3.5" />
                      <span>Estación 1: El Esclavo Rescatado</span>
                    </div>
                    
                    <h2 className={headingClass + " text-center mb-1"}>
                      La Liberación de la Esclavitud
                    </h2>

                    {/* Verse Box */}
                    <div className={`${isReadingMode ? 'bg-[#0a0502]/85 border-amber-900/10' : 'bg-slate-950/40 border-slate-800/20'} p-3.5 rounded-xl border text-center my-4 font-serif`}>
                      <p className={`${isReadingMode ? 'text-amber-200/90' : 'text-slate-300'} text-xs italic`}>
                        "Todo aquel que hace pecado, esclavo es del pecado."
                      </p>
                      <p className={`${isReadingMode ? 'text-amber-500' : 'text-slate-500'} text-[10px] font-mono mt-1 uppercase tracking-widest`}>
                        Juan 8:34
                      </p>
                    </div>

                    <p className={`${paragraphClass} text-center mb-4`}>
                      ¿Qué lucha, pecado o temor ejercía dominio sobre tu vida en el pasado (o sigue llamando a tu puerta)? Selecciona las aplicables y añade si es necesario.
                    </p>

                    {/* Tag list */}
                    <div className="flex flex-wrap gap-2 justify-center max-h-48 overflow-y-auto pr-1">
                      {STRUGGLE_OPTIONS.map((struggle) => {
                        const isSelected = responses.struggles.includes(struggle);
                        return (
                          <button
                            key={struggle}
                            onClick={() => toggleStruggle(struggle)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 flex items-center gap-1 ${
                              isSelected 
                                ? 'bg-[#d4a359]/20 border-[#d4a359] text-amber-200' 
                                : (isReadingMode ? 'bg-[#120a06]/40 border-amber-950/30 text-amber-400 hover:border-amber-900/40' : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700')
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                            {struggle}
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom input struggles descriptor */}
                    <div className="mt-3.5 flex gap-2">
                      <input
                        type="text"
                        value={customStruggleInput}
                        onChange={(e) => setCustomStruggleInput(e.target.value)}
                        placeholder="Otro temor o lucha..."
                        className={`text-xs rounded-lg px-3 py-2 flex-grow focus:outline-none ${inputStyleClass}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && customStruggleInput.trim()) {
                            toggleStruggle(customStruggleInput.trim());
                            setCustomStruggleInput('');
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (customStruggleInput.trim()) {
                            toggleStruggle(customStruggleInput.trim());
                            setCustomStruggleInput('');
                          }
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-2 rounded-lg border border-slate-700 transition"
                      >
                        Añadir
                      </button>
                    </div>

                    {/* Selected List placeholder to enforce selection */}
                    {responses.struggles.length === 0 && (
                      <p className="text-[11px] text-rose-300/70 italic text-center mt-3 animate-pulse">
                        * Por favor selecciona al menos una lucha para continuar
                      </p>
                    )}
                  </div>

                  <div className="mt-8 flex justify-between gap-3 pt-4 border-t border-slate-900/60">
                    <button
                      onClick={navigateBack}
                      className="px-4 py-2 text-xs text-slate-400 hover:text-slate-100 flex items-center gap-1.5 transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Volver
                    </button>
                    <button
                      onClick={() => setScreen('station1_liberation')}
                      disabled={responses.struggles.length === 0}
                      className="px-5 py-2.5 bg-[#d4a359] disabled:bg-slate-800 disabled:text-slate-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition duration-300 select-none cursor-pointer"
                      id="station-1a-next"
                    >
                      Continuar <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}


              {/* SCREEN: ESTACIÓN 1 - LIBERATION (B) */}
              {screen === 'station1_liberation' && (
                <div id="screen-station-1b" className="flex flex-col justify-between h-full">
                  <div>
                    <ChainIllustration />

                    <div className={`${isReadingMode ? 'bg-[#0a0502]/85 border-[#2c1708]' : 'bg-slate-950/40 border-slate-800/20'} p-4 rounded-xl border text-center my-4`}>
                      <p className={`${isReadingMode ? 'text-amber-200/90' : 'text-slate-400'} text-xs italic`}>
                        "Habéis sido comprados por precio."
                      </p>
                      <p className={`${isReadingMode ? 'text-amber-400' : 'text-[#d4a359]'} text-[10px] font-mono mt-0.5 tracking-widest font-semibold uppercase`}>
                        1 Corintios 6:20
                      </p>
                    </div>

                    {/* Step 1: Self effort question */}
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-xs font-mono mb-1.5 uppercase tracking-wider ${isReadingMode ? 'text-amber-305/70' : 'text-slate-400'}`}>
                          ¿Cómo te ha ido intentando vencerlo con tus propias fuerzas?
                        </label>
                        <textarea
                          value={responses.selfEffort}
                          onChange={(e) => setResponses(prev => ({ ...prev, selfEffort: e.target.value }))}
                          placeholder="Escribe brevemente tu experiencia de frustración antes de rendirte a Su providencia..."
                          rows={3}
                          className={`w-full p-3 rounded-lg text-xs leading-relaxed focus:outline-none resize-none ${inputStyleClass}`}
                        />
                      </div>

                      {/* Display after answering selfEffort */}
                      {responses.selfEffort.trim().length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="pt-2"
                        >
                          <p className={`text-center text-sm font-serif italic p-2.5 rounded-lg mb-3 ${
                            isReadingMode 
                              ? 'text-yellow-250 bg-[#2d1203]/40 border border-amber-950/50' 
                              : 'text-amber-200/90 bg-[#d4a359]/5 border border-[#d4a359]/20'
                          }`}>
                            "Cristo pagó el precio que tú no podías pagar."
                          </p>
                          
                          <label className={`block text-xs font-mono mb-1.5 uppercase tracking-wider ${isReadingMode ? 'text-amber-305/70' : 'text-slate-400'}`}>
                            ¿Por qué aspecto de Su liberación agradeces hoy?
                          </label>
                          <input
                            type="text"
                            value={responses.gratitudeLiberation}
                            onChange={(e) => setResponses(prev => ({ ...prev, gratitudeLiberation: e.target.value }))}
                            placeholder="Ej. Por Su paz, por romper el ciclo de mi ira..."
                            className={`w-full p-3 rounded-lg text-xs focus:outline-none ${inputStyleClass}`}
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between gap-3 pt-4 border-t border-slate-900/60">
                    <button
                      onClick={navigateBack}
                      className="px-4 py-2 text-xs text-slate-400 hover:text-slate-100 flex items-center gap-1.5 transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Volver
                    </button>
                    <button
                      onClick={() => setScreen('station2_lost')}
                      disabled={!responses.selfEffort.trim() || !responses.gratitudeLiberation.trim()}
                      className="px-5 py-2.5 bg-[#d4a359] disabled:bg-slate-800 disabled:text-slate-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition duration-300 select-none cursor-pointer"
                      id="station-1b-next"
                    >
                      A Estación 2 <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}


              {/* SCREEN: ESTACIÓN 2 - THE LOST / PREDISPOCISIÓN (A) */}
              {screen === 'station2_lost' && (
                <div id="screen-station-2a" className="flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-center gap-2 text-amber-300 text-[11px] font-mono tracking-widest uppercase mb-1">
                      <Feather className="w-3.5 h-3.5 text-amber-400" />
                      <span>Estación 2: El Heredero Restaurado</span>
                    </div>

                    <h2 className={headingClass + " text-center mb-1"}>
                      Recuperando la Herencia Perdida
                    </h2>

                    {/* Scripture Box */}
                    <div className={`${isReadingMode ? 'bg-[#0a0502]/85 border-[#2c1708]' : 'bg-slate-950/40 border-slate-800/20'} p-3.5 rounded-xl border text-center my-4 font-serif`}>
                      <p className={`${isReadingMode ? 'text-amber-250/90' : 'text-slate-300'} text-xs italic`}>
                        "En él asimismo tuvimos herencia... para que seamos para alabanza de su gloria."
                      </p>
                      <p className={`${isReadingMode ? 'text-amber-400/90' : 'text-amber-400'} text-[10px] font-mono mt-1 uppercase tracking-widest`}>
                        Efesios 1:11, Romanos 8:17
                      </p>
                    </div>

                    <p className={`${paragraphClass} text-center mb-4`}>
                      El pecado no solo esclaviza. También roba identidad, propósito y esperanza. Pero Cristo restaura lo que parecía perdido de forma irrevocable.
                    </p>

                    <p className={`text-xs font-semibold mb-2.5 text-center ${isReadingMode ? 'text-amber-100/90' : 'text-slate-300'}`}>
                      ¿Qué sentías que habías perdido debido a tus caídas o mentiras?
                    </p>

                    {/* Lost Traits Multi-selectors */}
                    <div className="flex flex-wrap gap-2 justify-center max-h-44 overflow-y-auto pr-1">
                      {LOST_TRAITS_OPTIONS.map((trait) => {
                        const isSelected = responses.lostTraits.includes(trait);
                        return (
                          <button
                            key={trait}
                            onClick={() => toggleLostTrait(trait)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 flex items-center gap-1 ${
                              isSelected 
                                ? 'bg-amber-400/20 border-amber-400 text-amber-200' 
                                : (isReadingMode ? 'bg-[#120a06]/40 border-amber-950/30 text-amber-400 hover:border-amber-900/40' : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700')
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                            {trait}
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom lost input */}
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={customLostInput}
                        onChange={(e) => setCustomLostInput(e.target.value)}
                        placeholder="Otro aspecto perdido..."
                        className={`text-xs rounded-lg px-3 py-2 flex-grow focus:outline-none ${inputStyleClass}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && customLostInput.trim()) {
                            toggleLostTrait(customLostInput.trim());
                            setCustomLostInput('');
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (customLostInput.trim()) {
                            toggleLostTrait(customLostInput.trim());
                            setCustomLostInput('');
                          }
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-2 rounded-lg border border-slate-700 transition"
                      >
                        Añadir
                      </button>
                    </div>

                    {responses.lostTraits.length === 0 && (
                      <p className="text-[11px] text-amber-300/70 italic text-center mt-3 animate-pulse">
                        * Selecciona al menos un aspecto para continuar
                      </p>
                    )}
                  </div>

                  <div className="mt-8 flex justify-between gap-3 pt-4 border-t border-slate-900/60 font-medium">
                    <button
                      onClick={navigateBack}
                      className="px-4 py-2 text-xs text-slate-400 hover:text-slate-100 flex items-center gap-1.5 transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Volver
                    </button>
                    <button
                      onClick={() => setScreen('station2_restored')}
                      disabled={responses.lostTraits.length === 0}
                      className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition duration-300 select-none cursor-pointer"
                      id="station-2a-next"
                    >
                      Continuar <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}


              {/* SCREEN: ESTACIÓN 2 - RESTORED / COVENANT (B) */}
              {screen === 'station2_restored' && (
                <div id="screen-station-2b" className="flex flex-col justify-between h-full">
                  <div>
                    <HearthIllustration />

                    <div className={`${isReadingMode ? 'bg-[#0a0502]/85 border-[#2c1708]' : 'bg-slate-950/40 border-slate-850'} p-3 rounded-lg border text-center my-3.5`}>
                      <p className={`${isReadingMode ? 'text-amber-200/90' : 'text-slate-400'} text-xs font-serif italic`}>
                        "Cristo restaura todo lo que parecía perdido en la mesa del Padre."
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Open Question: What has God restored */}
                      <div>
                        <label className={`block text-xs font-mono mb-1.5 uppercase tracking-wider ${isReadingMode ? 'text-amber-305/70' : 'text-slate-400'}`}>
                          ¿Qué te ha devuelto Dios que creías perdido para siempre?
                        </label>
                        <textarea
                          value={responses.restoredDetails}
                          onChange={(e) => setResponses(prev => ({ ...prev, restoredDetails: e.target.value }))}
                          placeholder="Reconoce Su gracia tangible restaurando tu dignidad, esperanza, un ministerio o una relación..."
                          rows={3}
                          className={`w-full p-2.5 rounded-lg text-xs leading-relaxed focus:outline-none resize-none ${inputStyleClass}`}
                        />
                      </div>

                      {/* Display after writing */}
                      {responses.restoredDetails.trim().length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="pt-2"
                        >
                          <label className={`block text-xs font-mono mb-1.5 uppercase tracking-wider font-semibold ${isReadingMode ? 'text-amber-400/90' : 'text-amber-300'}`}>
                            Completa esta frase con asombro:
                          </label>
                          <div className={`${isReadingMode ? 'bg-[#060402] border-amber-950' : 'bg-slate-950/90 border-amber-500/20'} p-3 rounded-lg border`}>
                            <span className={`text-xs font-serif block mb-1 ${isReadingMode ? 'text-amber-300/80' : 'text-slate-300'}`}>
                              "Gracias Jesús, porque restauraste..."
                            </span>
                            <input
                              type="text"
                              value={responses.restorationSentence}
                              onChange={(e) => setResponses(prev => ({ ...prev, restorationSentence: e.target.value }))}
                              placeholder="ej. mi valor filial al llamarme Tu hijo amado..."
                              className={`w-full p-2.5 rounded text-xs focus:outline-none text-amber-200 ${inputStyleClass}`}
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between gap-3 pt-4 border-t border-slate-900/60">
                    <button
                      onClick={navigateBack}
                      className="px-4 py-2 text-xs text-slate-400 hover:text-slate-100 flex items-center gap-1.5 transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Volver
                    </button>
                    <button
                      onClick={() => setScreen('station3_lies')}
                      disabled={!responses.restoredDetails.trim() || !responses.restorationSentence.trim()}
                      className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition duration-300 disabled:bg-slate-800 disabled:text-slate-500 select-none cursor-pointer"
                      id="station-2b-next"
                    >
                      A Estación 3 <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}


              {/* SCREEN: ESTACIÓN 3 - PRISONER LIBERATED */}
              {screen === 'station3_lies' && (
                <div id="screen-station-3" className="flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-center gap-2 text-amber-500 text-[11px] font-mono tracking-widest uppercase mb-1">
                      <Unlock className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                      <span>Estación 3: El Prisionero Liberado</span>
                    </div>

                    <h2 className={headingClass + " text-center mb-1"}>
                      El Traslado de Reino
                    </h2>

                    {/* Verses */}
                    <div className={`${isReadingMode ? 'bg-[#0a0502]/85 border-[#2c1708]' : 'bg-slate-950/40 border-slate-800/20'} p-3.5 rounded-xl border text-center my-3`}>
                      <p className={`${isReadingMode ? 'text-amber-250/95' : 'text-slate-300'} text-xs font-serif italic leading-relaxed`}>
                        "El cual nos ha librado de la potestad de las tinieblas, y trasladado al reino de su amado Hijo."
                      </p>
                      <p className={`${isReadingMode ? 'text-amber-500' : 'text-amber-500'} text-[10px] font-mono mt-1 uppercase tracking-widest`}>
                        Colosenses 1:13, Lucas 4:18
                      </p>
                    </div>

                    <PrisonIllustration />

                    <p className={`${paragraphClass} text-center mb-4 mt-2`}>
                      Había una prisión de mentiras oscuras que no podías abrir desde dentro. Pero Cristo rompió el cerrojo y abrió la puerta.
                    </p>

                    {/* Lies input and recommendations */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className={`block text-xs font-mono uppercase tracking-wider ${isReadingMode ? 'text-amber-305/70' : 'text-slate-400'}`}>
                            ¿Qué mentira gobernaba tu vida?
                          </label>
                          <span className={`text-[10px] ${isReadingMode ? 'text-amber-600/70' : 'text-slate-500'}`}>Toca un ejemplo para rellenar</span>
                        </div>

                        {/* Recommendation Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {LIES_EXAMPLES.map((lie) => (
                            <button
                              key={lie}
                              type="button"
                              onClick={() => setResponses(prev => ({ ...prev, believedLie: lie }))}
                              className={`text-[10px] font-serif italic px-2 py-1 rounded transition text-left border ${
                                isReadingMode 
                                  ? 'bg-[#0e0703]/90 border-amber-950 text-amber-300 hover:text-amber-100 hover:bg-[#180e07]' 
                                  : 'bg-slate-950 hover:bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              "{lie}"
                            </button>
                          ))}
                        </div>

                        <input
                          type="text"
                          value={responses.believedLie}
                          onChange={(e) => setResponses(prev => ({ ...prev, believedLie: e.target.value }))}
                          placeholder="ej. No soy digno de ser amado o usado por Dios..."
                          className={`w-full p-3 rounded-lg text-xs focus:outline-none ${inputStyleClass}`}
                        />
                      </div>

                      {/* Display subsequent question after writing lie */}
                      {responses.believedLie.trim().length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="pt-1.5"
                        >
                          <label className={`block text-xs font-mono mb-1.5 uppercase tracking-wider ${isReadingMode ? 'text-amber-305/70' : 'text-slate-400'}`}>
                            ¿Qué verdad del Evangelio gobierna hoy tu corazón?
                          </label>
                          <input
                            type="text"
                            value={responses.governingTruth}
                            onChange={(e) => setResponses(prev => ({ ...prev, governingTruth: e.target.value }))}
                            placeholder="ej. En Cristo soy justificado, adoptado y escogido."
                            className={`w-full p-3 rounded-lg text-xs focus:outline-none ${inputStyleClass}`}
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between gap-3 pt-4 border-t border-slate-900/60 font-medium">
                    <button
                      onClick={navigateBack}
                      className="px-4 py-2 text-xs text-slate-400 hover:text-slate-100 flex items-center gap-1.5 transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Volver
                    </button>
                    <button
                      onClick={() => setScreen('culminating')}
                      disabled={!responses.believedLie.trim() || !responses.governingTruth.trim()}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition duration-300 disabled:bg-slate-800 disabled:text-slate-500 select-none cursor-pointer font-mono"
                      id="station-3-next"
                    >
                      MOMENTO CULMINANTE <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}


              {/* SCREEN: CULMINATING MOMENT (TRANSITION TO WHITE & GOLD LIGHT SCREEN, PAUSE EXPLICIT) */}
              {screen === 'culminating' && (
                <div id="screen-culminating" className="text-center flex flex-col justify-between h-full py-1">
                  
                  <div>
                    {/* Visual countdown / pause display */}
                    <div className="flex justify-center items-center gap-2 mb-4">
                      {secondsRemaining > 0 ? (
                        <div className="flex items-center gap-2 text-amber-700/80 font-mono text-xs uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-200/50">
                          <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
                          <span>Silencio reflexivo: {secondsRemaining}s</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-emerald-700 font-mono text-xs uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200/50 animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-emerald-600" />
                          <span>Experiencia asimilada</span>
                        </div>
                      )}
                    </div>

                    <h1 className={`text-3xl font-serif tracking-tight text-center font-bold animate-fade-in my-3 ${
                      isReadingMode ? 'text-amber-100/90' : 'text-slate-900'
                    }`}>
                      MIRA LO QUE CRISTO HIZO
                    </h1>

                    <p className={`text-center text-xs tracking-wider font-mono uppercase mb-8 ${
                      isReadingMode ? 'text-amber-400/60' : 'text-slate-500'
                    }`}>
                      Detente. No hay prisa. Contempla la gracia.
                    </p>

                    {/* Step by step reveal with gorgeous timing transitions linked to timer */}
                    <div className="space-y-4 max-w-sm mx-auto text-left py-2 px-1">
                      
                      {/* Item 1 */}
                      <div className={`transition-all duration-1000 transform ${
                        culminatingPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                      } flex items-start gap-3 p-3 rounded-xl border ${
                        isReadingMode 
                          ? 'bg-amber-950/20 border-amber-900/25' 
                          : 'bg-slate-100/70 border-slate-200/40'
                      }`}>
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-amber-50 flex items-center justify-center font-serif text-xs shrink-0 mt-0.5 shadow-sm">
                          1
                        </div>
                        <div>
                          <p className={`text-xs font-mono uppercase tracking-wider ${isReadingMode ? 'text-amber-400/60' : 'text-slate-500'}`}>De la esclavitud:</p>
                          <p className={`text-sm ${isReadingMode ? 'text-amber-100/90' : 'text-slate-800'} font-medium`}>
                            Eras esclavo de <span className={`${isReadingMode ? 'text-amber-300' : 'text-amber-700'} font-semibold`}>{responses.struggles.slice(0, 3).join(', ')}</span>.
                          </p>
                          <p className={`${isReadingMode ? 'text-amber-300/80' : 'text-amber-800'} text-xs italic font-serif mt-0.5`}>
                            Él pagó tu rescate pagando el precio.
                          </p>
                        </div>
                      </div>

                      {/* Item 2 */}
                      <div className={`transition-all duration-1000 transform ${
                        culminatingPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                      } flex items-start gap-3 p-3 rounded-xl border ${
                        isReadingMode 
                          ? 'bg-amber-950/20 border-amber-900/25' 
                          : 'bg-slate-100/70 border-slate-200/40'
                      }`}>
                        <div className="w-6 h-6 rounded-full bg-amber-600 text-amber-50 flex items-center justify-center font-serif text-xs shrink-0 mt-0.5 shadow-sm">
                          2
                        </div>
                        <div>
                          <p className={`text-xs font-mono uppercase tracking-wider ${isReadingMode ? 'text-amber-400/60' : 'text-slate-500'}`}>De la ruina familiar:</p>
                          <p className={`text-sm ${isReadingMode ? 'text-amber-100/90' : 'text-slate-800'} font-medium`}>
                            Eras heredero perdido de <span className={`${isReadingMode ? 'text-amber-300' : 'text-[#a76a16]'} font-semibold`}>{responses.lostTraits.slice(0,3).join(', ')}</span>.
                          </p>
                          <p className={`${isReadingMode ? 'text-amber-300/80' : 'text-[#92400e]'} text-xs italic font-serif mt-0.5`}>
                            Él restauró tu lugar en la mesa familiar como hijo legítimo.
                          </p>
                        </div>
                      </div>

                      {/* Item 3 */}
                      <div className={`transition-all duration-1000 transform ${
                        culminatingPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                      } flex items-start gap-3 p-3 rounded-xl border ${
                        isReadingMode 
                          ? 'bg-amber-950/20 border-amber-900/25' 
                          : 'bg-slate-100/70 border-slate-200/40'
                      }`}>
                        <div className="w-6 h-6 rounded-full bg-[#a76a16] text-[#fef3c7] flex items-center justify-center font-serif text-xs shrink-0 mt-0.5 shadow-sm">
                          3
                        </div>
                        <div>
                          <p className={`text-xs font-mono uppercase tracking-wider ${isReadingMode ? 'text-amber-400/60' : 'text-slate-500'}`}>De la prisión mental:</p>
                          <p className={`text-sm ${isReadingMode ? 'text-amber-100/90' : 'text-slate-800'} font-medium`}>
                            Eras prisionero creyendo que <span className={`font-serif italic text-slate-900 border-b ${isReadingMode ? 'border-amber-700 text-amber-50' : 'border-amber-200 text-slate-900'}`}>"{responses.believedLie}"</span>.
                          </p>
                          <p className={`${isReadingMode ? 'text-amber-300/80' : 'text-amber-800'} text-xs italic font-serif mt-0.5`}>
                            Él abrió tu prisión y te trasladó a Su Reino de verdad.
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Silence visual quote trigger */}
                    <div className={`mt-8 transition-all duration-1000 transform ${
                      secondsRemaining === 0 ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
                    }`}>
                      <p className={`${
                        isReadingMode ? 'text-amber-300' : 'text-amber-700'
                      } text-lg sm:text-xl font-serif italic font-medium leading-relaxed max-w-xs mx-auto`}>
                        "Jesús no mejoró tu vida. Jesús te redimió."
                      </p>
                    </div>

                    {/* Quiet sanctuary space text */}
                    <p className={`text-[11px] italic mt-3 max-w-xs mx-auto ${isReadingMode ? 'text-amber-400/40' : 'text-slate-400'}`}>
                      La consejería bíblica nace de derramarse en asombro por esta gracia.
                    </p>
                  </div>

                  <div className="mt-8 flex flex-col items-center gap-2 pt-4 border-t border-slate-200">
                    {secondsRemaining > 0 ? (
                      <button
                        disabled
                        className="w-full py-3.5 bg-slate-200 text-slate-400 text-xs font-mono rounded-xl tracking-widest uppercase cursor-wait select-none"
                      >
                        ASIMILANDO VERDAD (PAUSA)...
                      </button>
                    ) : (
                      <button
                        onClick={() => setScreen('gratitude_prayer')}
                        className="w-full py-3.5 bg-[#a76a16] hover:bg-amber-900 text-slate-50 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition duration-500 tracking-wider shadow-lg shadow-amber-950/20 animate-bounce"
                        id="culminating-next-btn"
                      >
                        OFRECER MI GRATITUD
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}


              {/* SCREEN: PRAYER OF GRATITUDE */}
              {screen === 'gratitude_prayer' && (
                <div id="screen-gratitude" className="flex flex-col justify-between h-full space-y-6">
                  <div>
                    <div className="flex items-center justify-center gap-2 text-rose-300 text-[11px] font-mono tracking-widest uppercase mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                      <span>Respuesta de Adoración</span>
                    </div>

                    <h2 className={headingClass + " text-center mb-1 font-serif"}>
                      Proclama tu Redención
                    </h2>

                    <p className={`${paragraphClass} text-center mb-5`}>
                      Sella tu agradecimiento por fe y refuerza tu nueva identidad en Cristo. Presiona cada tarjeta para proclamar de dónde te sacó:
                    </p>

                    {/* DECLARATIVE GRATITUDE STACK */}
                    <div className="space-y-3.5 my-4">
                      {/* CARD 1: LIBERACIÓN */}
                      <div 
                        onClick={() => toggleDeclaration('liberacion')}
                        className={`p-3.5 rounded-xl border text-left transition-all duration-500 cursor-pointer select-none group relative ${
                          declaredDeclarations.liberacion 
                            ? isReadingMode
                              ? 'bg-amber-100/5 border-amber-500 shadow-md shadow-amber-950/50'
                              : 'bg-amber-950/15 border-amber-500/85 shadow-md shadow-black/85'
                            : isReadingMode
                              ? 'bg-[#120b05] border-amber-950/60 hover:border-amber-900/60'
                              : 'bg-slate-950/55 border-slate-850 hover:border-slate-800'
                        }`}
                        id="declaration-liberacion-card"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-mono tracking-wider uppercase ${isReadingMode ? 'text-amber-500/70' : 'text-slate-500'}`}>
                            Estación 1: El Rescatado
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono transition-all duration-500 ${
                            declaredDeclarations.liberacion 
                              ? 'bg-amber-500/25 text-amber-300 border border-amber-500/30 font-semibold' 
                              : isReadingMode ? 'bg-amber-950/20 text-amber-500/50' : 'bg-slate-900 text-slate-500'
                          }`}>
                            {declaredDeclarations.liberacion ? '✓ ACTIVO y SELLADO' : 'PENDIENTE'}
                          </span>
                        </div>

                        <p className={`text-[11px] mb-1.5 ${isReadingMode ? 'text-amber-300/40' : 'text-slate-500'} italic font-sans`}>
                          Luchas redimidas: <strong className="font-semibold text-slate-300">{responses.struggles.join(', ') || 'mis propias fuerzas'}</strong>
                        </p>

                        <p className={`text-xs sm:text-[13px] leading-relaxed font-serif ${isReadingMode ? 'text-amber-100/90' : 'text-slate-200'}`}>
                          "Gracias, Señor Jesús, por pagar mi rescate. Ya no soy esclavo del pecado ni de <strong className="text-amber-300 font-medium">{responses.struggles.join(', ') || 'mis temores'}</strong>. En Ti hoy me afirmo: ¡Tengo una identidad de <span className="text-yellow-400 font-semibold italic">Libertad y Victoria</span>, he sido de gracia redimido!"
                        </p>

                        {declaredDeclarations.liberacion && (
                          <div className="mt-2.5 flex items-center gap-1.5 text-[9.5px] font-mono tracking-wide text-amber-400 bg-amber-500/10 py-1 px-2.5 rounded border border-amber-500/15 animate-pulse w-fit">
                            <Sparkles className="w-3 h-3 text-[#d4a359]" />
                            <span>IDENTIDAD EN CRISTO: PERFECTAMENTE LIBRE Y SEGURO DE LA CULPA</span>
                          </div>
                        )}
                      </div>

                      {/* CARD 2: RESTAURACIÓN */}
                      <div 
                        onClick={() => toggleDeclaration('restauracion')}
                        className={`p-3.5 rounded-xl border text-left transition-all duration-500 cursor-pointer select-none group relative ${
                          declaredDeclarations.restauracion 
                            ? isReadingMode
                              ? 'bg-amber-100/5 border-amber-500 shadow-md shadow-amber-950/50'
                              : 'bg-amber-950/15 border-amber-500/85 shadow-md shadow-black/85'
                            : isReadingMode
                              ? 'bg-[#120b05] border-amber-950/60 hover:border-amber-900/60'
                              : 'bg-slate-950/55 border-slate-850 hover:border-slate-800'
                        }`}
                        id="declaration-restauracion-card"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-mono tracking-wider uppercase ${isReadingMode ? 'text-amber-500/70' : 'text-slate-500'}`}>
                            Estación 2: El Heredero
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono transition-all duration-500 ${
                            declaredDeclarations.restauracion 
                              ? 'bg-amber-500/25 text-amber-300 border border-amber-500/30 font-semibold' 
                              : isReadingMode ? 'bg-amber-950/20 text-amber-500/50' : 'bg-slate-900 text-slate-500'
                          }`}>
                            {declaredDeclarations.restauracion ? '✓ ACTIVO y SELLADO' : 'PENDIENTE'}
                          </span>
                        </div>

                        <p className={`text-[11px] mb-1.5 ${isReadingMode ? 'text-amber-300/40' : 'text-slate-500'} italic font-sans`}>
                          Atributos recuperados: <strong className="font-semibold text-slate-300">{responses.lostTraits.join(', ') || 'la paz y el gozo'}</strong>
                        </p>

                        <p className={`text-xs sm:text-[13px] leading-relaxed font-serif ${isReadingMode ? 'text-amber-100/90' : 'text-slate-200'}`}>
                          "Padre celestial, gracias por sentarme de nuevo a Tu mesa y devolverme <strong className="text-amber-300 font-medium">{responses.restoredDetails || responses.lostTraits.join(', ') || 'mi paz, dignidad y gozo'}</strong>. No soy un huérfano espiritual; en Cristo hoy me afirmo: ¡Tengo una identidad de <span className="text-yellow-400 font-semibold italic">Heredero Restaurado</span>, amado y provisto!"
                        </p>

                        {declaredDeclarations.restauracion && (
                          <div className="mt-2.5 flex items-center gap-1.5 text-[9.5px] font-mono tracking-wide text-amber-400 bg-amber-500/10 py-1 px-2.5 rounded border border-amber-500/15 animate-pulse w-fit">
                            <Sparkles className="w-3 h-3 text-[#d4a359]" />
                            <span>IDENTIDAD EN CRISTO: HIJO AMADO Y COHEREDERO CON ÉL</span>
                          </div>
                        )}
                      </div>

                      {/* CARD 3: VERDAD */}
                      <div 
                        onClick={() => toggleDeclaration('verdad')}
                        className={`p-3.5 rounded-xl border text-left transition-all duration-500 cursor-pointer select-none group relative ${
                          declaredDeclarations.verdad 
                            ? isReadingMode
                              ? 'bg-amber-100/5 border-amber-500 shadow-md shadow-amber-950/50'
                              : 'bg-amber-950/15 border-amber-500/85 shadow-md shadow-black/85'
                            : isReadingMode
                              ? 'bg-[#120b05] border-amber-950/60 hover:border-amber-900/60'
                              : 'bg-slate-950/55 border-slate-850 hover:border-slate-800'
                        }`}
                        id="declaration-verdad-card"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-mono tracking-wider uppercase ${isReadingMode ? 'text-amber-500/70' : 'text-slate-500'}`}>
                            Estación 3: El Liberado
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono transition-all duration-500 ${
                            declaredDeclarations.verdad 
                              ? 'bg-amber-500/25 text-amber-300 border border-amber-500/30 font-semibold' 
                              : isReadingMode ? 'bg-amber-950/20 text-amber-500/50' : 'bg-slate-900 text-slate-500'
                          }`}>
                            {declaredDeclarations.verdad ? '✓ ACTIVO y SELLADO' : 'PENDIENTE'}
                          </span>
                        </div>

                        <p className={`text-[11px] mb-1.5 ${isReadingMode ? 'text-amber-300/40' : 'text-slate-500'} italic font-sans`}>
                          Mentira desarmada: <strong className="font-semibold text-slate-300">"{responses.believedLie || 'no valgo nada'}"</strong>
                        </p>

                        <p className={`text-xs sm:text-[13px] leading-relaxed font-serif ${isReadingMode ? 'text-amber-100/90' : 'text-slate-200'}`}>
                          "Espíritu Santo, gracias por quebrar los barrotes de mi mente. Despojo hoy la mentira de que <strong className="text-rose-300/85 font-medium">"{responses.believedLie || 'no valgo nada'}"</strong>, y me abrazo a Tu Verdad inquebrantable de que <strong className="text-yellow-400 font-medium">"{responses.governingTruth || 'en Cristo soy escogido y justificado'}"</strong>. ¡Tengo una identidad de <span className="text-yellow-400 font-semibold italic">Mente Sana y Libre</span>!"
                        </p>

                        {declaredDeclarations.verdad && (
                          <div className="mt-2.5 flex items-center gap-1.5 text-[9.5px] font-mono tracking-wide text-amber-400 bg-amber-500/10 py-1 px-2.5 rounded border border-amber-500/15 animate-pulse w-fit">
                            <Sparkles className="w-3 h-3 text-[#d4a359]" />
                            <span>IDENTIDAD EN CRISTO: RENOVADO EN INTELIGENCIA Y PORTADOR DE VERDAD</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* DYNAMIC ORACIÓN DE GRATITUD SECTION */}
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className={`text-xs font-mono uppercase tracking-wider ${isReadingMode ? 'text-amber-400/80' : 'text-slate-400'}`}>
                          Tu Oración Escrita a Cristo
                        </label>
                        
                        <button
                          onClick={() => setResponses(prev => ({ ...prev, prayer: generateDefaultPrayer() }))}
                          className={`flex items-center gap-1 text-[10px] font-mono border rounded px-2.5 py-1 transition duration-300 ${
                            isReadingMode 
                              ? 'border-amber-900/60 bg-amber-950/20 text-amber-400 hover:bg-amber-950/40' 
                              : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-900 hover:text-[#d4a359]'
                          }`}
                          title="Volver a componer o rellenar la oración con tus declaraciones personalizadas"
                          id="btn-recompose-prayer"
                        >
                          <RefreshCw className="w-2.5 h-2.5 text-[#d4a359]" />
                          <span>Autocomponer Oración</span>
                        </button>
                      </div>

                      <div className="relative">
                        {/* Feather aesthetic background icon inside text field */}
                        <div className="absolute right-3.5 top-3.5 text-slate-800/20 pointer-events-none select-none">
                          <Feather className="w-8 h-8 rotate-45 animate-pulse" />
                        </div>

                        <textarea
                          value={responses.prayer}
                          onChange={(e) => setResponses(prev => ({ ...prev, prayer: e.target.value }))}
                          placeholder="Te damos la bienvenida a escribir aquí. Al sellar las 3 declaraciones de arriba se completará automáticamente con una oración devocional integrada, la cual podrás modificar o expandir de forma libre..."
                          rows={7}
                          className={`w-full focus:border-[#d4a359]/70 focus:ring-[#d4a359]/30 rounded-xl p-4 text-xs sm:text-sm leading-relaxed shadow-inner resize-none font-serif min-h-[160px] ${inputStyleClass}`}
                          id="prayer-textarea"
                        />
                      </div>

                      <p className={`text-[11px] italic text-center transition-all duration-300 ${
                        !(declaredDeclarations.liberacion && declaredDeclarations.restauracion && declaredDeclarations.verdad)
                          ? 'text-amber-400 font-semibold bg-amber-500/10 py-1.5 px-3 rounded-lg border border-amber-500/20'
                          : 'text-slate-500'
                      }`}>
                        {!(declaredDeclarations.liberacion && declaredDeclarations.restauracion && declaredDeclarations.verdad)
                          ? '⚠️ Por favor, proclama las 3 declaraciones de arriba (Estación 1, 2 y 3) para habilitar tu oración de gratitud y poder continuar al Cierre.'
                          : '✨ ¡Tus 3 declaraciones de gracia han sido consolidadas! Puedes ajustar el texto de tu oración devocional de ofrenda a mano.'
                        }
                      </p>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-600 justify-center">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      <span>Almacenado localmente — confidencialidad garantizada para tu curso</span>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between gap-3 pt-4 border-t border-slate-900/60 font-medium font-sans">
                    <button
                      onClick={navigateBack}
                      className="px-4 py-2 text-xs text-slate-400 hover:text-slate-100 flex items-center gap-1.5 transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Volver
                    </button>
                    <button
                      onClick={() => setScreen('cierre')}
                      disabled={
                        !(declaredDeclarations.liberacion && declaredDeclarations.restauracion && declaredDeclarations.verdad) || 
                        !responses.prayer.trim()
                      }
                      className="px-5 py-2.5 bg-[#d4a359] hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 transition duration-300 disabled:bg-slate-800 disabled:text-slate-500 select-none cursor-pointer shadow-lg shadow-black/40"
                      id="gratitude-next"
                    >
                      Continuar al Cierre <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}


              {/* SCREEN: FINAL CLOSURE & PRINT FILE COMPILATION PORTFOLIO */}
              {screen === 'cierre' && (
                <div id="screen-cierre" className="flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="text-center">
                      <Sparkles className="w-8 h-8 text-amber-300 mx-auto animate-pulse" />
                      
                      <h2 className="text-xl sm:text-2xl font-serif text-amber-200 tracking-tight leading-snug my-2">
                        Nunca olvides de dónde te sacó.
                      </h2>
                    </div>

                    {/* Charge block */}
                    <div className={`space-y-3.5 text-xs sm:text-[13px] leading-relaxed px-1 italic border-l-2 border-[#d4a359]/40 pl-3 ${isReadingMode ? 'text-amber-100/90' : 'text-slate-300'}`}>
                      <p>
                        "Cuando acompañes a alguien atrapado por el pecado, <strong className={isReadingMode ? 'text-yellow-400 font-semibold' : 'text-amber-100'}>recuerda tus cadenas</strong>."
                      </p>
                      <p>
                        "Cuando acompañes a alguien que ha perdido la esperanza, <strong className={isReadingMode ? 'text-yellow-400 font-semibold' : 'text-amber-100'}>recuerda tu restauración</strong>."
                      </p>
                      <p>
                        "Cuando veas a alguien cautivo, <strong className={isReadingMode ? 'text-yellow-400 font-semibold' : 'text-amber-100'}>recuerda tu propia prisión</strong>."
                      </p>
                      <p className={`not-italic text-center text-xs font-sans mt-4 font-semibold ${isReadingMode ? 'text-amber-400' : 'text-[#d4a359]/90'}`}>
                        Porque el mejor consejero no es quien ha olvidado su pasado, sino quien nunca supera el asombro de haber sido redimido.
                      </p>
                    </div>

                    {/* Scripture Card */}
                    <div className={`${isReadingMode ? 'bg-[#0f0803] border-amber-900/40' : 'bg-slate-950/60 border-slate-900'} p-3.5 border rounded-xl text-center my-3 max-w-sm mx-auto`}>
                      <p className={`text-xs sm:text-sm font-serif italic ${isReadingMode ? 'text-amber-200/90' : 'text-slate-200'}`}>
                        "Porque el Hijo del Hombre vino a buscar y a salvar lo que se había perdido."
                      </p>
                      <p className="text-[#d4a359] text-[10px] font-mono mt-1 uppercase tracking-widest">
                        Lucas 19:10
                      </p>
                    </div>

                    {/* Liturgical final prompt */}
                    <div className={`${isReadingMode ? 'bg-amber-950/15 border-amber-900/30 text-amber-200/80' : 'bg-[#d4a359]/5 border-[#d4a359]/20 text-amber-200/90'} border rounded-xl p-3.5 text-center text-xs leading-relaxed font-serif`}>
                      <span className={`block font-sans text-[10px] uppercase font-mono tracking-wider mb-1 ${isReadingMode ? 'text-amber-400/55' : 'text-slate-400'}`}>
                        Instrucción pastoral silenciosa
                      </span>
                      Antes de cerrar esta experiencia, detente por un momento y di en voz baja o piensa en tu corazón:
                      <strong className={`block text-sm mt-1 ${isReadingMode ? 'text-yellow-300 font-bold' : 'text-yellow-100'}`}>
                        "Gracias, Jesús, porque me encontraste."
                      </strong>
                    </div>

                    {/* DEVOTIONAL RECORDER / EXPORT DOSSIER CARD */}
                    <div className={`mt-6 border rounded-xl p-4 ${isReadingMode ? 'border-amber-950/40 bg-amber-950/10' : 'border-slate-800/80 bg-slate-950/85'}`}>
                      <h3 className="text-xs font-mono uppercase text-slate-400 mb-2 tracking-widest flex items-center gap-1.5 justify-center">
                        <Award className="w-3.5 h-3.5 text-[#d4a359]" />
                        <span className={isReadingMode ? 'text-amber-300/80' : ''}>Mi Ofrenda de Recordación</span>
                      </h3>
                      <p className={`text-[10.5px] text-center mb-3 ${isReadingMode ? 'text-amber-450/40' : 'text-slate-500'}`}>
                        Tus respuestas y oración están archivadas temporalmente de forma segura en tu navegador. Puedes guardarlas o copiarlas como ayuda de diario para tu curso de Consejería Bíblica.
                      </p>
                      
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={copyDossierToClipboard}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs hover:border-slate-700 transition"
                          title="Copia todas tus respuestas al portapapeles"
                          id="btn-copy-dossier"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
                        </button>
                        
                        <button
                          onClick={downloadDossierText}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs hover:border-slate-700 transition"
                          title="Descargar dossier completo como un archivo de texto .txt"
                          id="btn-download-dossier"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-400" />
                          <span>Descargar Recuerdo (.txt)</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-2 pt-4 border-t border-slate-900/60">
                    <button
                      onClick={() => {
                        // Resets properly to main screen
                        setScreen('welcome');
                        setResponses({ ...INITIAL_RESPONSES });
                        setDeclaredDeclarations({ liberacion: false, restauracion: false, verdad: false });
                        setCustomStruggleInput('');
                        setCustomLostInput('');
                      }}
                      className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-[#d4a359] hover:from-amber-500 hover:to-amber-300 text-slate-950 font-bold rounded-xl transition duration-500 tracking-wider text-sm shadow-md flex items-center justify-center gap-1 cursor-pointer"
                      id="amen-final-btn"
                    >
                      <span>AMÉN.</span>
                    </button>
                    <p className="text-[10px] text-slate-600 font-mono text-center">
                      Finaliza la experiencia y limpia de forma segura el historial
                    </p>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </main>

      {/* Aesthetic Footer / Credit banner */}
      <footer className="w-full max-w-md mx-auto mt-6 text-center text-[10px] font-mono text-slate-600 flex flex-col gap-1 inline font-medium">
        <div>Experiencia interactiva para estudiantes de Consejería Bíblica</div>
        <div>
          La doctrina de la redención vivida en la propia historia para sanar a otros con compasión.
        </div>
      </footer>
    </div>
  );
}
