import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Trophy, 
  Users, 
  Plus, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { FootballEvent, EventType, Club, Team } from '../../types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  clubs: Club[];
  teams: Team[];
  defaultClubId?: string;
  onCreateEvent: (event: FootballEvent) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  clubs,
  teams,
  defaultClubId,
  onCreateEvent,
}) => {
  if (!isOpen) return null;

  const [eventType, setEventType] = useState<EventType>('friendly');
  const [selectedClubId, setSelectedClubId] = useState(defaultClubId || clubs[0]?.id || '');
  const activeClub = clubs.find(c => c.id === selectedClubId) || clubs[0];
  const clubTeams = teams.filter(t => t.clubId === selectedClubId);

  const [selectedTeamId, setSelectedTeamId] = useState(clubTeams[0]?.id || '');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2025-03-29');
  const [time, setTime] = useState('15:00');
  const [stadium, setStadium] = useState(activeClub?.stadiumName || 'Stade Municipal');
  const [city, setCity] = useState(activeClub?.city || 'Paris');
  const [isHome, setIsHome] = useState(true);

  // Friendly fields
  const [opponentName, setOpponentName] = useState('');
  const [opponentCity, setOpponentCity] = useState('');
  const [category, setCategory] = useState('Séniors R3');
  const [competitionName, setCompetitionName] = useState('Match Amical de Préparation');

  // Tournament fields
  const [tournamentEdition, setTournamentEdition] = useState('1ère Édition Annuelle');
  const [teamsCount, setTeamsCount] = useState(16);
  const [tournamentFormat, setTournamentFormat] = useState('16 équipes - 4 poules de 4 + Phase Finale');
  const [dotation, setDotation] = useState('Coupes pour les 3 premiers, médailles pour tous les participants');
  const [cateringInfo, setCateringInfo] = useState('Buvette, crêpes & barbecue toute la journée');

  // Plateau fields
  const [ageCategory, setAgeCategory] = useState('U10 / U11');
  const [pitchesCount, setPitchesCount] = useState(4);
  const [participatingClubsStr, setParticipatingClubsStr] = useState('FCM Aubervilliers, FC Bobigny, CS Meaux, Red Star');
  const [matchDuration, setMatchDuration] = useState(12);

  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let computedTitle = title.trim();
    if (!computedTitle) {
      if (eventType === 'friendly') {
        computedTitle = `${activeClub?.shortName || activeClub?.name} vs ${opponentName || 'Adversaire'}`;
      } else if (eventType === 'tournament') {
        computedTitle = `Tournoi ${category} - ${activeClub?.name}`;
      } else {
        computedTitle = `Grand Plateau ${ageCategory} - ${activeClub?.name}`;
      }
    }

    const newEvent: FootballEvent = {
      id: `ev-${Date.now()}`,
      clubId: selectedClubId,
      teamId: selectedTeamId || (clubTeams[0]?.id || 'team-default'),
      type: eventType,
      title: computedTitle,
      date,
      time,
      stadium: stadium || 'Stade Municipal',
      city: city || 'Île-de-France',
      isHome,
      hasPoster: true,
      category,
      competitionName,
      opponentName: eventType === 'friendly' ? opponentName : undefined,
      opponentCity: eventType === 'friendly' ? opponentCity : undefined,
      tournamentEdition: eventType === 'tournament' ? tournamentEdition : undefined,
      teamsCount: eventType === 'tournament' ? teamsCount : undefined,
      tournamentFormat: eventType === 'tournament' ? tournamentFormat : undefined,
      dotation: eventType === 'tournament' ? dotation : undefined,
      cateringInfo: eventType === 'tournament' ? cateringInfo : undefined,
      ageCategory: eventType === 'plateau' ? ageCategory : undefined,
      pitchesCount: eventType === 'plateau' ? pitchesCount : undefined,
      participatingClubs: eventType === 'plateau' 
        ? [activeClub?.name || 'Club Hôte', ...participatingClubsStr.split(',').map(s => s.trim()).filter(Boolean)] 
        : undefined,
      matchDurationMinutes: eventType === 'plateau' ? matchDuration : undefined,
      notes: notes.trim(),
      posterConfig: {
        template: 'matchday_dynamic',
        format: 'square',
        title: eventType === 'friendly' ? 'JOUR DE MATCH' : (eventType === 'tournament' ? 'TOURNOI OFFICIEL' : 'GRAND PLATEAU'),
        subtitle: competitionName || `${category} • Match Amical`,
        homeTeam: activeClub?.name || 'Club Hôte',
        awayTeam: opponentName || (eventType === 'tournament' ? `${teamsCount} Équipes en lice` : 'Clubs Invités'),
        homeColor: activeClub?.primaryColor || '#0ea5e9',
        awayColor: '#ef4444',
        dateStr: date,
        timeStr: time,
        stadium,
        city,
        competition: competitionName,
        sponsorText: 'Avec le soutien des partenaires du club',
        entryFee: 'Entrée Libre • Buvette sur place'
      }
    };

    onCreateEvent(newEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Créer un Nouvel Événement Sportif
              </h2>
              <p className="text-xs text-slate-400">
                Match amical, tournoi ou plateau avec génération automatique du visuel
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* 1. Type de l'événement */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Type d'Événement
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setEventType('friendly')}
                className={`p-3 rounded-xl border text-center transition ${
                  eventType === 'friendly'
                    ? 'bg-emerald-600/20 border-emerald-500 text-white font-bold ring-1 ring-emerald-500'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="text-base mb-1">⚽</div>
                <div className="text-xs">Match Amical</div>
              </button>

              <button
                type="button"
                onClick={() => setEventType('tournament')}
                className={`p-3 rounded-xl border text-center transition ${
                  eventType === 'tournament'
                    ? 'bg-emerald-600/20 border-emerald-500 text-white font-bold ring-1 ring-emerald-500'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="text-base mb-1">🏆</div>
                <div className="text-xs">Tournoi</div>
              </button>

              <button
                type="button"
                onClick={() => setEventType('plateau')}
                className={`p-3 rounded-xl border text-center transition ${
                  eventType === 'plateau'
                    ? 'bg-emerald-600/20 border-emerald-500 text-white font-bold ring-1 ring-emerald-500'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="text-base mb-1">🌱</div>
                <div className="text-xs">Plateau Jeunes</div>
              </button>
            </div>
          </div>

          {/* 2. Club & Équipe */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Club Organisateur</label>
              <select
                value={selectedClubId}
                onChange={(e) => {
                  setSelectedClubId(e.target.value);
                  const newC = clubs.find(c => c.id === e.target.value);
                  if (newC) {
                    setStadium(newC.stadiumName);
                    setCity(newC.city);
                  }
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {clubs.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Équipe / Catégorie</label>
              <select
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {clubTeams.length > 0 ? (
                  clubTeams.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} ({t.categoryLabel})</option>
                  ))
                ) : (
                  <option value="team-generic">Équipe Première</option>
                )}
              </select>
            </div>
          </div>

          {/* 3. Spécifique Amical */}
          {eventType === 'friendly' && (
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Détails du Match Amical
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Adversaire *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: FC Les Lilas ou Red Star Amateurs"
                    value={opponentName}
                    onChange={(e) => setOpponentName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Ville de l'adversaire</label>
                  <input
                    type="text"
                    placeholder="Ex: Les Lilas (93)"
                    value={opponentCity}
                    onChange={(e) => setOpponentCity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Lieu</label>
                  <div className="flex rounded-lg border border-slate-700 overflow-hidden text-xs">
                    <button
                      type="button"
                      onClick={() => setIsHome(true)}
                      className={`flex-1 py-1.5 font-semibold ${isHome ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                    >
                      Domicile
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsHome(false)}
                      className={`flex-1 py-1.5 font-semibold ${!isHome ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                    >
                      Extérieur
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Type de rencontre</label>
                  <input
                    type="text"
                    value={competitionName}
                    onChange={(e) => setCompetitionName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. Spécifique Tournoi */}
          {eventType === 'tournament' && (
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Configuration du Tournoi
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Édition / Nom</label>
                  <input
                    type="text"
                    value={tournamentEdition}
                    onChange={(e) => setTournamentEdition(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Nombre d'équipes</label>
                  <input
                    type="number"
                    value={teamsCount}
                    onChange={(e) => setTeamsCount(parseInt(e.target.value) || 8)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Formule sportive</label>
                <input
                  type="text"
                  value={tournamentFormat}
                  onChange={(e) => setTournamentFormat(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Dotations & Récompenses</label>
                <input
                  type="text"
                  value={dotation}
                  onChange={(e) => setDotation(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
          )}

          {/* 3. Spécifique Plateau */}
          {eventType === 'plateau' && (
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Organisation du Plateau Jeunes
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Catégorie d'âge</label>
                  <input
                    type="text"
                    value={ageCategory}
                    onChange={(e) => setAgeCategory(e.target.value)}
                    placeholder="U9 / U11"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Nb de terrains</label>
                  <input
                    type="number"
                    value={pitchesCount}
                    onChange={(e) => setPitchesCount(parseInt(e.target.value) || 2)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Durée match (min)</label>
                  <input
                    type="number"
                    value={matchDuration}
                    onChange={(e) => setMatchDuration(parseInt(e.target.value) || 12)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Clubs invités (séparés par des virgules)</label>
                <input
                  type="text"
                  value={participatingClubsStr}
                  onChange={(e) => setParticipatingClubsStr(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
          )}

          {/* 4. Date & Lieu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Horaire coup d'envoi</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="15:30"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Stade ou Complexe</label>
              <input
                type="text"
                value={stadium}
                onChange={(e) => setStadium(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Ville</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">Consignes & Notes particulières</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Arbitrage officiel assuré, protocole d'échauffement sur le terrain annexe..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Créer & Préparer l'Affiche</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
