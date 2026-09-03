import React, { useState } from 'react';
import { 
  Calendar, 
  Sparkles, 
  Download, 
  Plus, 
  Trophy, 
  Clock, 
  MapPin, 
  Copy, 
  Check, 
  Trash2,
  Filter,
  BarChart2
} from 'lucide-react';
import { FootballEvent, Club, EventType } from '../../types';
import { generateMatchdayCaption } from '../../utils/socialCaptionGenerator';

interface EventsManagerProps {
  events: FootballEvent[];
  clubs: Club[];
  onOpenCreateEventModal: () => void;
  onOpenPosterModal: (event: FootballEvent) => void;
  onOpenSummaryModal: (event: FootballEvent) => void;
  onDeleteEvent: (eventId: string) => void;
}

export const EventsManager: React.FC<EventsManagerProps> = ({
  events,
  clubs,
  onOpenCreateEventModal,
  onOpenPosterModal,
  onOpenSummaryModal,
  onDeleteEvent,
}) => {
  const [filterType, setFilterType] = useState<'all' | EventType>('all');
  const [filterClubId, setFilterClubId] = useState<string>('all');
  const [copiedEventId, setCopiedEventId] = useState<string | null>(null);

  const filteredEvents = events.filter(e => {
    const matchType = filterType === 'all' || e.type === filterType;
    const matchClub = filterClubId === 'all' || e.clubId === filterClubId;
    return matchType && matchClub;
  });

  const handleCopyCaption = (event: FootballEvent) => {
    const club = clubs.find(c => c.id === event.clubId);
    const caption = generateMatchdayCaption(event, club);
    navigator.clipboard.writeText(caption);
    setCopiedEventId(event.id);
    setTimeout(() => setCopiedEventId(null), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <span>Événements Sportifs des Clubs</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {events.length} au calendrier
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Gestion centralisée des matchs amicaux, tournois amateurs et plateaux jeunes U7-U13
          </p>
        </div>

        <button
          onClick={onOpenCreateEventModal}
          className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Créer un Événement</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
        
        {/* Type Filter */}
        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterType === 'all'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tous ({events.length})
          </button>
          <button
            onClick={() => setFilterType('friendly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterType === 'friendly'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Matchs Amicaux ({events.filter(e => e.type === 'friendly').length})
          </button>
          <button
            onClick={() => setFilterType('tournament')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterType === 'tournament'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tournois ({events.filter(e => e.type === 'tournament').length})
          </button>
          <button
            onClick={() => setFilterType('plateau')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterType === 'plateau'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Plateaux Jeunes ({events.filter(e => e.type === 'plateau').length})
          </button>
        </div>

        {/* Club Filter Dropdown */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 hidden sm:inline">Club :</span>
          <select
            value={filterClubId}
            onChange={(e) => setFilterClubId(e.target.value)}
            className="w-full sm:w-auto bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            <option value="all">Tous les clubs ({clubs.length})</option>
            {clubs.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.map((event) => {
          const club = clubs.find(c => c.id === event.clubId);
          const isFinished = !!event.isFinished;

          return (
            <div
              key={event.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                {/* Badge header */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center space-x-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: club?.primaryColor || '#0ea5e9' }}
                    />
                    <span className="font-bold text-xs text-slate-300">
                      {club?.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      event.type === 'friendly'
                        ? 'bg-blue-500/20 text-blue-400'
                        : (event.type === 'tournament' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400')
                    }`}>
                      {event.type === 'friendly' ? 'Amical' : (event.type === 'tournament' ? 'Tournoi' : 'Plateau')}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteEvent(event.id)}
                    className="p-1 rounded text-slate-500 hover:text-red-400 transition"
                    title="Supprimer l'événement"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Event Title */}
                <h3 className="text-base font-extrabold text-white mb-2">
                  {event.title}
                </h3>

                {/* Event coordinates */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-850 p-2.5 rounded-xl border border-slate-800 mb-3">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{event.time}</span>
                  </div>
                  <div className="col-span-2 flex items-center space-x-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{event.stadium}, {event.city}</span>
                  </div>
                </div>

                {/* Score if finished */}
                {isFinished && event.summary && (
                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-emerald-500/30 mb-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase block">Score Final</span>
                      <span className="text-base font-black text-white">
                        {event.summary.scoreHome} - {event.summary.scoreAway}
                      </span>
                    </div>
                    {event.summary.mvpPlayerName && (
                      <span className="text-xs text-amber-400 font-medium">
                        ⭐ MVP : {event.summary.mvpPlayerName}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  {/* Studio Poster */}
                  <button
                    onClick={() => onOpenPosterModal(event)}
                    className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Studio Affiche</span>
                  </button>

                  {/* Caption */}
                  <button
                    onClick={() => handleCopyCaption(event)}
                    className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1.5 rounded-lg border transition ${
                      copiedEventId === event.id
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
                    }`}
                    title="Copier la légende réseaux sociaux"
                  >
                    {copiedEventId === event.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEventId === event.id ? 'Copié' : 'Légende Insta'}</span>
                  </button>
                </div>

                {/* Score / Debrief */}
                <button
                  onClick={() => onOpenSummaryModal(event)}
                  className="text-xs text-slate-400 hover:text-white underline underline-offset-2 transition"
                >
                  {isFinished ? 'Modifier le Score' : 'Saisir le Score'}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
