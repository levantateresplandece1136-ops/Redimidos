export interface UserResponses {
  // Estación 1: El Esclavo Rescatado
  struggles: string[];
  selfEffort: string;
  gratitudeLiberation: string;

  // Estación 2: El Heredero Restaurado
  lostTraits: string[];
  restoredDetails: string;
  restorationSentence: string;

  // Estación 3: El Prisionero Liberado
  believedLie: string;
  governingTruth: string;

  // Final: Respuesta de Gratitud
  prayer: string;
}

export type ScreenId = 
  | 'welcome' 
  | 'station1_struggles' 
  | 'station1_liberation'
  | 'station2_lost'
  | 'station2_restored'
  | 'station3_lies'
  | 'culminating'
  | 'gratitude_prayer'
  | 'cierre';

export const INITIAL_RESPONSES: UserResponses = {
  struggles: [],
  selfEffort: '',
  gratitudeLiberation: '',
  lostTraits: [],
  restoredDetails: '',
  restorationSentence: '',
  believedLie: '',
  governingTruth: '',
  prayer: ''
};
