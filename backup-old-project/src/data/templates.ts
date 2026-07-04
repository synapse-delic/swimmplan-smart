import type { BlockTemplate } from '../types';

export const defaultTemplates: BlockTemplate[] = [
  // WARMUP
  { id: 'wu1', title: '400m Kraul', distance: 400, time: 10, category: 'warmup', details: 'Locker Einschwimmen', description: 'Ganz lockeres Kraulschwimmen. Achte auf eine lange Gleitphase und entspannte Atmung, um die Muskulatur aufzuwärmen.' },
  { id: 'wu2', title: '200m Lagen', distance: 200, time: 5, category: 'warmup', details: 'Wechselnde Lagen' },
  { id: 'wu3', title: '300m Kraul Beine', distance: 300, time: 8, category: 'warmup', details: 'Fokus auf Beinschlag' },
  { id: 'wu4', title: '600m Mix', distance: 600, time: 14, category: 'warmup', details: '200 K, 200 R, 200 B' },

  // DRILLS
  { id: 'dr1', title: '8x50m Beine', distance: 400, time: 12, category: 'drills', details: 'Mit Brett', description: 'Kraulbeinschlag mit Schwimmbrett. Kopf entspannt auf dem Wasser. Fokus auf den Kick aus der Hüfte (nicht aus dem Knie).' },
  { id: 'dr2', title: '4x100m Technik', distance: 400, time: 10, category: 'drills', details: 'Einarmig / Abschlag' },
  { id: 'dr3', title: '10x25m Tauchen', distance: 250, time: 8, category: 'drills', details: 'Unterwasserphasen' },
  { id: 'dr4', title: '8x50m Wassergefühl', distance: 400, time: 12, category: 'drills', details: 'Sculling / Scheibenwischer' },

  // MAIN SET
  { id: 'ms1', title: '10x100m Intervalle', distance: 1000, time: 20, category: 'mainset', details: 'Abgang 1:45', description: 'Intervalltraining. Versuche jeden 100m Block in genau 1:30 min zu schwimmen, sodass du 15 Sekunden Pause hast, bevor der nächste startet.' },
  { id: 'ms2', title: '5x200m GA1', distance: 1000, time: 18, category: 'mainset', details: 'Grundlagenausdauer' },
  { id: 'ms3', title: '15x100m Laktattoleranz', distance: 1500, time: 30, category: 'mainset', details: 'Abgang 1:30' },
  { id: 'ms4', title: 'Pyramide 1-2-3-2-1', distance: 900, time: 18, category: 'mainset', details: '100, 200, 300, 200, 100' },
  { id: 'ms5', title: '4x400m Kraul', distance: 1600, time: 25, category: 'mainset', details: 'Gleichmäßiges Tempo' },

  // SPRINT
  { id: 'sp1', title: '4x50m Max', distance: 200, time: 6, category: 'sprint', details: 'All out!' },
  { id: 'sp2', title: '8x25m Sprint', distance: 200, time: 8, category: 'sprint', details: 'Ohne Atmen' },
  { id: 'sp3', title: '6x50m Schmetterling', distance: 300, time: 10, category: 'sprint', details: 'Wettkampftempo' },

  // COOLDOWN
  { id: 'cd1', title: '200m Locker', distance: 200, time: 5, category: 'cooldown', details: 'Ausschwimmen' },
  { id: 'cd2', title: '400m Paddles', distance: 400, time: 8, category: 'cooldown', details: 'Sehr ruhig' },
  { id: 'cd3', title: '100m Rücken', distance: 100, time: 3, category: 'cooldown', details: 'Doppelarmiger Rücken' },
];
