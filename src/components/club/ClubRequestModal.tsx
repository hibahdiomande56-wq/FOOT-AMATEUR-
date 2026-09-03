import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Calendar, 
  UserPlus, 
  AlertCircle, 
  FileQuestion, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Club, ClubRequest, RequestType, RequestUrgency } from '../../types';

interface ClubRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  club: Club;
  onSubmitRequest: (request: ClubRequest) => void;
}

export const ClubRequestModal: React.FC<ClubRequestModalProps> = ({
  isOpen,
  onClose,
  club,
  onSubmitRequest,
}) => {
  if (!isOpen) return null;

  const [requestType, setRequestType] = useState<RequestType>('create_match');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<RequestUrgency>('normal');

  // Specific helpers
  const [opponent, setOpponent] = useState('');
  const [matchDate, setMatchDate] = useState('2025-03-22');
  const [matchTime, setMatchTime] = useState('15:00');
  const [playerName, setPlayerName] = useState('');
  const [playerNumber, setPlayerNumber] = useState('');
  const [playerPosition, setPlayerPosition] = useState('ATT');

  const requestOptions: { id: RequestType; label: string; icon: string; desc: string }[] = [
    { 
      id: 'create_match', 
      label: 'Créer un match amical', 
      icon: '⚽', 
      desc: 'Planifier une rencontre et commander l’affiche officielle' 
    },
    { 
      id: 'urgent_poster', 
      label: 'Affiche urgente pour réseaux', 
      icon: '⚡', 
      desc: 'Besoin d’un visuel à diffuser rapidement sur Instagram/Facebook' 
    },
    { 
      id: 'create_tournament', 
      label: 'Organiser un tournoi', 
      icon: '🏆', 
      desc: 'Affiche tournoi multi-équipes, dotations et programme' 
    },
    { 
      id: 'create_plateau', 
      label: 'Organiser un plateau jeunes', 
      icon: '🌱', 
      desc: 'Rassemblement U7 à U13 avec clubs invités et terrains' 
    },
    { 
      id: 'update_roster', 
      label: 'Mettre à jour l’effectif', 
      icon: '👥', 
      desc: 'Ajout ou modification d’un joueur, numéro ou coach' 
    },
    { 
      id: 'custom_request', 
      label: 'Autre demande sur-mesure', 
      icon: '💬', 
      desc: 'Bannière spéciale, sponsor ou question technique' 
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let computedTitle = title.trim();
    if (!computedTitle) {
      if (requestType === 'create_match') {
        computedTitle = `Match amical vs ${opponent || 'Adversaire'} (${matchDate})`;
      } else if (requestType === 'urgent_poster') {
        computedTitle = `Affiche urgente matchday pour ${matchDate}`;
      } else if (requestType === 'update_roster') {
        computedTitle = `Ajout du joueur ${playerName || 'nouvelle recrue'}`;
      } else {
        computedTitle = `Demande ${club.name} - ${new Date().toLocaleDateString('fr-FR')}`;
      }
    }

    const currentTypeObj = requestOptions.find(o => o.id === requestType);

    const newRequest: ClubRequest = {
      id: `req-${Date.now()}`,
      clubId: club.id,
      clubName: club.name,
      type: requestType,
      typeLabel: currentTypeObj?.label || 'Demande club',
      title: computedTitle,
      description: description.trim() || `Demande transmise pour traitement par l'opérateur.`,
      urgency,
      status: 'pending',
      createdAt: new Date().toISOString(),
      details: {
        opponent,
        matchDate,
        matchTime,
        playerName,
        playerNumber,
        playerPosition,
      }
    };

    onSubmitRequest(newRequest);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
                <span>Formulaire de Demande Club</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {club.shortName}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Service géré : votre demande sera traitée et validée directement par l'opérateur
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Plan badge & SLA info */}
          <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="text-lg">⭐</span>
              <div>
                <span className="text-xs font-bold text-slate-200">
                  Abonnement actuel : {club.plan === 'pro' ? 'Formule PRO (Prioritaire)' : 'Formule BASIQUE'}
                </span>
                <p className="text-[11px] text-slate-400">
                  {club.plan === 'pro' 
                    ? 'Traitement prioritaire en moins de 2h • Visuels illimités HD' 
                    : 'Traitement sous 24h ouvrées • Quota mensuel standard'}
                </p>
              </div>
            </div>
          </div>

          {/* Type of request */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Que souhaitez-vous demander ?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {requestOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setRequestType(opt.id)}
                  className={`p-3 rounded-xl border text-left transition ${
                    requestType === opt.id
                      ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500 shadow-md'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center space-x-2 font-bold text-xs">
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 pl-6">
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Contextual fields for Match or Poster */}
          {(requestType === 'create_match' || requestType === 'urgent_poster') && (
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Informations sur la rencontre
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Club adverse</label>
                  <input
                    type="text"
                    placeholder="Ex: FC Les Lilas, AS Bondy..."
                    value={opponent}
                    onChange={(e) => setOpponent(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Date</label>
                    <input
                      type="date"
                      value={matchDate}
                      onChange={(e) => setMatchDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Heure</label>
                    <input
                      type="text"
                      value={matchTime}
                      onChange={(e) => setMatchTime(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contextual fields for Roster */}
          {requestType === 'update_roster' && (
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Joueur à ajouter / modifier
              </span>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 block mb-1">Nom et prénom du joueur</label>
                  <input
                    type="text"
                    placeholder="Ex: Karim Bensaïd"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">N° de maillot</label>
                  <input
                    type="number"
                    placeholder="9"
                    value={playerNumber}
                    onChange={(e) => setPlayerNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white text-center"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Detailed description */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">
              Précisions & Détails de votre demande *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Indiquez ici tout détail utile (lieu, couleurs souhaitées, sponsors à mentionner, consigne pour l'opérateur)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Niveau d'Urgence
            </label>
            <div className="flex space-x-3">
              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="urgency"
                  value="normal"
                  checked={urgency === 'normal'}
                  onChange={() => setUrgency('normal')}
                  className="text-blue-500"
                />
                <span>Normal (Délai habituel)</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-amber-400 font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="urgency"
                  value="urgent"
                  checked={urgency === 'urgent'}
                  onChange={() => setUrgency('urgent')}
                  className="text-amber-500"
                />
                <span>⚡ Urgent (Match dans moins de 48h)</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition"
            >
              <Send className="w-4 h-4" />
              <span>Envoyer la Demande à l'Opérateur</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
