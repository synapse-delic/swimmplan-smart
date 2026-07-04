# SwimmPlan Smart - Handover & Status Quo

Dieses Dokument fasst den aktuellen Entwicklungsstand, die Architektur und alle bisherigen Implementierungen zusammen. Es dient als Startpunkt (Handover) für zukünftige Entwicklungen in einem neuen Chat.

## 1. Projektübersicht
- **Projekt:** SwimmPlan Smart
- **Stack:** React (Vite), TypeScript, CSS (Vanilla), Lucide-React (Icons), @dnd-kit (Drag & Drop)
- **Status:** Lauffähiger Prototyp mit fokussierter "Spotify Dark" Mobile-UI.

## 2. Abgeschlossene Features
1. **Drag & Drop Timeline:**
   - @dnd-kit Integration (SortableContext für die Timeline, Draggable für die Bibliothek).
   - Blöcke können von der Bibliothek (Bottom Sheet) in die Timeline gezogen und dort umsortiert werden.
2. **Trainings-Bibliothek & CRUD:**
   - Hardcoded Standard-Übungen + Möglichkeit, *eigene* Übungen zu erstellen (Speicherung in `localStorage`).
   - Bestehende Übungen in der Timeline UND in der Bibliothek können über ein Modal editiert werden (`BlockEditorModal.tsx`).
3. **Mobile-First "Spotify Dark" UI:**
   - **Timeline:** Zweispaltiges Layout (Uhrzeit/Dauer links, vertikaler Strich mit Kategorie-Punkt in der Mitte, Block rechts).
   - **Trainingsblöcke (`Block.tsx`):** Nutzt eine `variant`-Prop (`timeline` vs. `library`). Timeline-Blöcke haben links eine Neon-Akzentlinie (Kategorie-Farbe) und zeigen lange Beschreibungen nur als *diskretes Hover-Tooltip*.
   - **Bottom Sheet Bibliothek:** Schiebt sich von unten ins Bild. Besitzt horizontal scrollbare "Pills" für Kategoriefilter und die Übungs-Vorlagen werden auf Mobile als **horizontale quadratische Karten** angezeigt.
4. **Design Book:**
   - Ein detailliertes `design_book.md` wurde erstellt, das alle Neon-Farbcodes, Abstände und Flexbox-Regeln für das Mobile UI genau definiert.

## 3. Architektur & State Management
- **State (`App.tsx`):**
  - `blocks` (Aktueller Trainingsplan in der Timeline).
  - `templates` (Bibliothek der verfügbaren Übungen).
  - Beide States werden bei Änderungen in den `localStorage` synchronisiert.
- **Komponenten:**
  - `Block.tsx`: Die universelle UI-Komponente für alle Übungen. Passt ihr Layout über die `variant`-Prop an.
  - `SortableTimelineBlock.tsx`: Wrapper für die Timeline (berechnet laufende Uhrzeit z.B. "09:00").
  - `ExerciseLibrary.tsx`: Das Menü für die Übungsauswahl.
  - `BlockEditorModal.tsx`: Das Popup zum Anlegen/Ändern von Übungen.

## 4. Offene Punkte / Nächste Schritte
- **Deployment:** Das Deployment auf GCP/Firebase wurde gestoppt, um erst das Design zu finalisieren. Dies kann im nächsten Schritt erfolgen.
- **Backend-Integration:** Bisher läuft alles rein im Browser (`localStorage`). Eine echte Datenbank (z.B. Firebase Firestore) könnte als nächstes angebunden werden, um Accounts zu ermöglichen.
- **Feinschliff Mobile UI:** Testen des "Hover-Tooltips" für Beschreibungen auf echten Touch-Geräten (Tippen statt Hover).
