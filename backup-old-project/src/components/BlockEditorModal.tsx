import React, { useState, useEffect } from 'react';
import type { TrainingBlock, BlockTemplate, BlockCategory } from '../types';

interface BlockEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: TrainingBlock | BlockTemplate | null;
  onSave: (data: any) => void;
}

export const BlockEditorModal: React.FC<BlockEditorModalProps> = ({
  isOpen, onClose, initialData, onSave
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BlockCategory>('warmup');
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [details, setDetails] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setCategory(initialData.category);
      setTime(initialData.time);
      setDistance(initialData.distance);
      setDetails(initialData.details || '');
      setDescription(initialData.description || '');
    } else {
      setTitle('');
      setCategory('warmup');
      setTime(10);
      setDistance(400);
      setDetails('');
      setDescription('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(initialData || {}),
      title,
      category,
      time: Number(time),
      distance: Number(distance),
      details,
      description
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>
          {initialData ? 'Block bearbeiten' : 'Neue Übung erstellen'}
        </h2>
        <form onSubmit={handleSubmit} className="editor-form">
          <div className="form-group">
            <label>Titel</label>
            <input required type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="z.B. 400m Kraul" />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Kategorie</label>
              <select value={category} onChange={e => setCategory(e.target.value as BlockCategory)}>
                <option value="warmup">Einschwimmen</option>
                <option value="drills">Technik</option>
                <option value="mainset">Hauptteil</option>
                <option value="sprint">Sprint</option>
                <option value="cooldown">Ausschwimmen</option>
              </select>
            </div>
            <div className="form-group">
              <label>Dauer (Min)</label>
              <input required type="number" min="1" value={time} onChange={e => setTime(Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label>Distanz (m)</label>
              <input required type="number" min="0" step="25" value={distance} onChange={e => setDistance(Number(e.target.value))} />
            </div>
          </div>

          <div className="form-group">
            <label>Kurzbeschreibung (Details)</label>
            <input type="text" value={details} onChange={e => setDetails(e.target.value)} placeholder="z.B. Locker Einschwimmen" />
          </div>

          <div className="form-group">
            <label>Lange Beschreibung (Optional)</label>
            <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Detaillierte Anweisungen..." />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Abbrechen</button>
            <button type="submit" className="btn-primary">Speichern</button>
          </div>
        </form>
      </div>
    </div>
  );
};
