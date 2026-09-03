import React, { useState } from 'react';
import { 
  Calendar, 
  Download, 
  Send, 
  Users, 
  Shield, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Trophy, 
  Share2, 
  Copy, 
  Check, 
  ArrowUpRight,
  Printer,
  ChevronRight
} from 'lucide-react';
import { Club, FootballEvent, ClubRequest, Team, Player } from '../../types';
import { generateMatchdayCaption } from '../../utils/socialCaptionGenerator';

interface ClubPortalProps {
  club: Club;
  events: FootballEvent[];
  requests: ClubRequest[];
  teams: Team[];
  players: Player[];
  onOpenRequestModal: () => void;
  onOpenPosterModal: (event: FootballEvent) => void;
  onOpenSummaryModal: (event: FootballEvent) => void;
}

export const ClubPortal: React.FC<ClubPortalProps> = ({
  club,
  events,
  requests,
  teams,
  players,
  onOpenRequestModal,
  onOpenPosterModal,
  onOpenSummaryModal,
}) => {
  const [activeTab, setActiveTab] = useState<'events' | 'requests' | 'roster' | 'club_info'>('events');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter events and requests for this club
  const clubEvents = events.filter(e => e.clubId === club.id);
  const clubRequests = requests.filter(r => r.clubId === club.id);
  const clubTeams = teams.filter(t => t.clubId === club.id);
  const clubPlayers = players.filter(p => p.clubId === club.id);

  const handleCopyCaption = (event: FootballEvent) => {
    const caption = generateMatchdayCaption(event, club);
    navigator.clipboard.writeText(caption);
    setCopiedId(event.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Club Banner Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        
        {/* Background ambient lighting */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 20% 30%, ${club.primaryColor}, transparent 60%), radial-gradient(circle at 80% 70%, ${club.secondaryColor || '#0ea5e9'}, transparent 60%)`
          }}
        />

        <div className="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Club identity */}
          <div className="flex items-center space-x-5">
            <div 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl text-white shadow-xl border-2 border-white/20 shrink-0"
              style={{
                backgroundColor: club.primaryColor,
              }}
            >
              {club.code || club.name.slice(0, 3)}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {club.name}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  club.plan === 'pro'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {club.plan === 'pro' ? '★ Formule PRO' : 'Formule BASIQUE'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {club.stadiumName}, {club.city}
                </span>
                <span>•</span>
                <span className="text-slate-400">Fondé en {club.foundedYear}</span>
              </p>

              <div className="flex items-center gap-2 mt-3">
                <span className="text-[11px] text-slate-400">Couleurs officielles :</span>
                <div 
                  className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                  style={{ backgroundColor: club.primaryColor }}
                  title="Couleur Principale"
                />
                <div 
                  className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                  style={{ backgroundColor: club.secondaryColor || '#ffffff' }}
                  title="Couleur Secondaire"
                />
                <span className="text-xs text-slate-400 ml-2">
                  Président : <strong className="text-slate-200">{club.presidentName}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick CTA & Stats */}
          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
            <button
              id="club-cta-request-btn"
              onClick={onOpenRequestModal}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-lg shadow-blue-600/30 transition active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Faire une Demande à l'Opérateur</span>
            </button>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
                📅 {clubEvents.length} événements
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
                🖼️ {clubEvents.filter(e => e.hasPoster).length} affiches générées
              </span>
            </div>
          </div>

        </div>

        {/* Navigation Sub-Tabs */}
        <div className="px-6 border-t border-slate-800/80 bg-slate-900/60 flex space-x-6 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('events')}
            className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === 'events'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Événements & Affiches ({clubEvents.length})
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'requests'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Mes Demandes</span>
            {clubRequests.filter(r => r.status === 'pending' || r.status === 'in_progress').length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold">
                {clubRequests.filter(r => r.status === 'pending' || r.status === 'in_progress').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('roster')}
            className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === 'roster'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Effectifs & Équipes ({clubPlayers.length} joueurs)
          </button>

          <button
            onClick={() => setActiveTab('club_info')}
            className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === 'club_info'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Formule & Droits ({club.plan === 'pro' ? 'Pro' : 'Basique'})
          </button>
        </div>

      </div>

      {/* TAB 1: Événements & Affiches */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Événements & Visuels Officiels du Club
              </h2>
              <p className="text-xs text-slate-400">
                Téléchargez les affiches de match et résumés haute qualité prêts à poster sur les réseaux
              </p>
            </div>

            <button
              onClick={onOpenRequestModal}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1"
            >
              <span>Demander un nouvel événement</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {clubEvents.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
                📅
              </div>
              <h3 className="text-base font-bold text-white mb-1">Aucun événement programmé</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                Transmettez votre calendrier ou demandez la création de votre premier match amical ou tournoi.
              </p>
              <button
                onClick={onOpenRequestModal}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition"
              >
                Envoyer une demande de match
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {clubEvents.map((event) => {
                const isFinished = !!event.isFinished;

                return (
                  <div 
                    key={event.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Top badge */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            event.type === 'friendly' 
                              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                              : event.type === 'tournament'
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {event.type === 'friendly' ? 'Match Amical' : (event.type === 'tournament' ? 'Tournoi' : 'Plateau Jeunes')}
                          </span>
                          
                          {isFinished ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                              Terminé (Score enregistré)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-semibold">
                              À Venir
                            </span>
                          )}
                        </div>

                        <span className="text-xs font-bold text-slate-300">
                          {event.category}
                        </span>
                      </div>

                      {/* Event Title */}
                      <h3 className="text-base font-extrabold text-white mb-2">
                        {event.title}
                      </h3>

                      {/* Match Details */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 mb-3 bg-slate-850 p-3 rounded-xl border border-slate-800">
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

                      {/* If finished: Score preview */}
                      {isFinished && event.summary && (
                        <div className="p-3 bg-slate-950/60 rounded-xl border border-emerald-500/30 mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                              Score Final
                            </span>
                            <span className="text-base font-black text-white">
                              {event.summary.scoreHome} - {event.summary.scoreAway}
                            </span>
                          </div>
                          {event.summary.mvpPlayerName && (
                            <p className="text-[11px] text-amber-400 font-medium">
                              ⭐ Homme du match : {event.summary.mvpPlayerName}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Notes / Special info */}
                      {event.notes && (
                        <p className="text-xs text-slate-400 italic">
                          "{event.notes}"
                        </p>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        {/* Open visual generator / download */}
                        <button
                          onClick={() => onOpenPosterModal(event)}
                          className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-md transition cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Télécharger l'Affiche HD</span>
                        </button>

                        {/* Copy caption */}
                        <button
                          onClick={() => handleCopyCaption(event)}
                          className={`flex items-center space-x-1 text-xs font-semibold px-2.5 py-2 rounded-xl border transition ${
                            copiedId === event.id
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                              : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
                          }`}
                          title="Copier le texte prêt à poster sur Instagram & Facebook"
                        >
                          {copiedId === event.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="hidden sm:inline">{copiedId === event.id ? 'Copié' : 'Légende Insta'}</span>
                        </button>
                      </div>

                      {/* Debrief / Summary button */}
                      <button
                        onClick={() => onOpenSummaryModal(event)}
                        className="text-xs text-slate-400 hover:text-slate-200 font-semibold underline underline-offset-2 transition"
                      >
                        {isFinished ? 'Voir Résumé & Stats' : 'Renseigner le score'}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: Mes Demandes en cours */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Suivi de vos Demandes
              </h2>
              <p className="text-xs text-slate-400">
                Toutes vos demandes sont examinées et exécutées directement par votre opérateur
              </p>
            </div>

            <button
              onClick={onOpenRequestModal}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition"
            >
              + Nouvelle Demande
            </button>
          </div>

          {clubRequests.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
              <p className="text-xs text-slate-400">Aucune demande active pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {clubRequests.map((req) => (
                <div 
                  key={req.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {req.typeLabel}
                      </span>
                      {req.urgency === 'urgent' && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                          ⚡ Urgent
                        </span>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div>
                      {req.status === 'pending' && (
                        <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>En attente de prise en charge</span>
                        </span>
                      )}
                      {req.status === 'in_progress' && (
                        <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold flex items-center space-x-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>En cours de traitement par l'opérateur</span>
                        </span>
                      )}
                      {req.status === 'completed' && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Traité & Terminé</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1.5">{req.title}</h4>
                  <p className="text-xs text-slate-300 mb-3">{req.description}</p>

                  {req.operatorNotes && (
                    <div className="p-3 bg-slate-850 rounded-xl border border-slate-800 text-xs text-slate-300 mb-2">
                      <strong className="text-emerald-400 block mb-0.5">Note de l'opérateur :</strong>
                      {req.operatorNotes}
                    </div>
                  )}

                  <div className="text-[11px] text-slate-500">
                    Demandé le {new Date(req.createdAt).toLocaleDateString('fr-FR')} à {new Date(req.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Effectifs */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Effectifs & Joueurs ({club.name})
              </h2>
              <p className="text-xs text-slate-400">
                Ces joueurs sont directement proposés lors de la saisie des buteurs et hommes du match
              </p>
            </div>

            <button
              onClick={onOpenRequestModal}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 transition"
            >
              + Demander l'ajout d'un joueur
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {clubPlayers.map((player) => (
              <div 
                key={player.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center font-black text-lg text-emerald-400 border border-slate-700">
                  {player.number}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-sm text-white truncate">
                      {player.firstName} {player.lastName}
                    </span>
                    {player.isCaptain && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                        Cap.
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="font-semibold text-slate-300">{player.position}</span>
                    <span>•</span>
                    <span>⚽ {player.goals} buts</span>
                    <span>•</span>
                    <span>👟 {player.assists} passes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Formule & Droits */}
      {activeTab === 'club_info' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Active plan card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Votre Formule Actuelle</h3>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                club.plan === 'pro' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {club.plan === 'pro' ? 'Pro' : 'Basique'}
              </span>
            </div>

            <p className="text-xs text-slate-300">
              {club.plan === 'pro'
                ? 'Accès complet : événements illimités, personnalisation de templates avancée, export haute résolution et traitement prioritaire.'
                : 'Accès standard : personnalisation essentielle avec logo, formats réseaux sociaux et création d’événements gérée.'}
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span className="text-slate-400">Événements par mois :</span>
                <strong className="text-white">{club.plan === 'pro' ? 'Illimités' : 'Jusqu’à 4 par mois'}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span className="text-slate-400">Export Haute Résolution (HD 1080p) :</span>
                <strong className="text-emerald-400">Inclus</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span className="text-slate-400">Templates Graphiques :</span>
                <strong className="text-white">{club.plan === 'pro' ? 'Tous les templates (5+)' : 'Templates standards'}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span className="text-slate-400">Support & Délais :</span>
                <strong className="text-white">{club.plan === 'pro' ? 'Prioritaire (< 2h)' : 'Sous 24h'}</strong>
              </div>
            </div>

            {club.plan === 'basic' && (
              <button
                onClick={onOpenRequestModal}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs py-3 rounded-xl shadow transition"
              >
                Demander le passage en Formule PRO
              </button>
            )}
          </div>

          {/* Club Info card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Coordonnées du Club</h3>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Stade principal</span>
                <strong className="text-white">{club.stadiumName}</strong>
                <div className="text-slate-400 text-[11px]">{club.stadiumAddress}</div>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Contact Référent</span>
                <strong className="text-white">{club.presidentName} (Président)</strong>
                <div className="text-slate-400 text-[11px]">{club.contactEmail} • {club.contactPhone}</div>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Date d'adhésion</span>
                <strong className="text-white">{club.joinedDate}</strong>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
