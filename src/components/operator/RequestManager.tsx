import React, { useState } from 'react';
import { 
  Inbox, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  Check, 
  Calendar, 
  Users, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClubRequest, RequestStatus, Club } from '../../types';

interface RequestManagerProps {
  requests: ClubRequest[];
  clubs: Club[];
  onUpdateRequest: (request: ClubRequest) => void;
  onOpenStudioForRequest: (req: ClubRequest) => void;
  onOpenCreateEventForRequest: (req: ClubRequest) => void;
}

export const RequestManager: React.FC<RequestManagerProps> = ({
  requests,
  clubs,
  onUpdateRequest,
  onOpenStudioForRequest,
  onOpenCreateEventForRequest,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | RequestStatus>('all');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const filteredRequests = requests.filter(r => {
    if (activeFilter === 'all') return true;
    return r.status === activeFilter;
  });

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const inProgressCount = requests.filter(r => r.status === 'in_progress').length;
  const completedCount = requests.filter(r => r.status === 'completed').length;

  const handleStatusChange = (req: ClubRequest, newStatus: RequestStatus) => {
    const updated: ClubRequest = {
      ...req,
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : req.completedAt,
    };
    onUpdateRequest(updated);

    if (newStatus === 'completed') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  const handleSaveNote = (req: ClubRequest) => {
    const updated: ClubRequest = {
      ...req,
      operatorNotes: noteText.trim(),
    };
    onUpdateRequest(updated);
    setEditingNoteId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <span>Centre de Traitement des Demandes Clubs</span>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold animate-pulse">
                {pendingCount} en attente
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400">
            Exécutez les actions clés (création de matchs, génération d'affiches, résumés) selon la formule du club
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeFilter === 'all'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Toutes ({requests.length})
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeFilter === 'pending'
                ? 'bg-amber-500/20 text-amber-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            En attente ({pendingCount})
          </button>
          <button
            onClick={() => setActiveFilter('in_progress')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeFilter === 'in_progress'
                ? 'bg-blue-500/20 text-blue-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            En cours ({inProgressCount})
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeFilter === 'completed'
                ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Traitées ({completedCount})
          </button>
        </div>
      </div>

      {/* Requests Queue */}
      {filteredRequests.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Aucune demande dans cette catégorie</h3>
          <p className="text-xs text-slate-400">
            Toutes les demandes de vos clubs amateurs ont été traitées !
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((req) => {
            const reqClub = clubs.find(c => c.id === req.clubId);

            return (
              <div
                key={req.id}
                className={`bg-slate-900 border rounded-2xl p-5 transition ${
                  req.status === 'pending'
                    ? 'border-amber-500/40 bg-amber-950/10'
                    : (req.status === 'in_progress' ? 'border-blue-500/40 bg-blue-950/10' : 'border-slate-800')
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                  
                  {/* Left info: Club name, badge, urgency */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-black text-sm text-white flex items-center gap-1.5">
                      <span 
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: reqClub?.primaryColor || '#0ea5e9' }}
                      />
                      {req.clubName}
                    </span>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      reqClub?.plan === 'pro'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {reqClub?.plan === 'pro' ? '★ Formule PRO' : 'Basique'}
                    </span>

                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold">
                      {req.typeLabel}
                    </span>

                    {req.urgency === 'urgent' && (
                      <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-black animate-pulse">
                        ⚡ URGENT
                      </span>
                    )}
                  </div>

                  {/* Status buttons */}
                  <div className="flex items-center space-x-2">
                    {req.status !== 'in_progress' && req.status !== 'completed' && (
                      <button
                        onClick={() => handleStatusChange(req, 'in_progress')}
                        className="text-xs text-blue-400 hover:text-blue-300 font-semibold px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 transition"
                      >
                        Passer En Cours
                      </button>
                    )}

                    {req.status !== 'completed' ? (
                      <button
                        onClick={() => handleStatusChange(req, 'completed')}
                        className="flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Marquer Terminé</span>
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Terminé</span>
                      </span>
                    )}
                  </div>

                </div>

                {/* Title & description */}
                <h4 className="text-sm font-extrabold text-white mb-1">{req.title}</h4>
                <p className="text-xs text-slate-300 mb-4">{req.description}</p>

                {/* Operator Note section */}
                {editingNoteId === req.id ? (
                  <div className="mb-3 p-3 bg-slate-850 rounded-xl border border-slate-700 space-y-2">
                    <label className="text-[11px] font-bold text-slate-300 block">
                      Note pour le club (visible dans leur espace) :
                    </label>
                    <textarea
                      rows={2}
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white resize-none"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingNoteId(null)}
                        className="text-xs text-slate-400 hover:text-white px-2 py-1"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => handleSaveNote(req)}
                        className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded-lg"
                      >
                        Enregistrer la note
                      </button>
                    </div>
                  </div>
                ) : (
                  req.operatorNotes && (
                    <div className="mb-3 p-2.5 bg-slate-850 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start justify-between">
                      <div>
                        <strong className="text-emerald-400 text-[11px] block">Note transmise au club :</strong>
                        <span>{req.operatorNotes}</span>
                      </div>
                      <button
                        onClick={() => {
                          setEditingNoteId(req.id);
                          setNoteText(req.operatorNotes || '');
                        }}
                        className="text-[11px] text-slate-400 hover:text-white ml-2 shrink-0 underline"
                      >
                        Modifier
                      </button>
                    </div>
                  )
                )}

                {/* 1-Click Operational Action Buttons */}
                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    {/* 1-Click: Studio Affiche */}
                    <button
                      onClick={() => onOpenStudioForRequest(req)}
                      className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>1-Clic : Générer l'Affiche pour ce Club</span>
                    </button>

                    {/* 1-Click: Create Event */}
                    <button
                      onClick={() => onOpenCreateEventForRequest(req)}
                      className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition"
                    >
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>Créer l'Événement</span>
                    </button>
                  </div>

                  {!req.operatorNotes && editingNoteId !== req.id && (
                    <button
                      onClick={() => {
                        setEditingNoteId(req.id);
                        setNoteText('');
                      }}
                      className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Ajouter une consigne / note</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
