/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Calendar, 
  Inbox, 
  Sparkles, 
  RotateCcw,
  LayoutDashboard,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  Club, 
  Team, 
  Player, 
  FootballEvent, 
  ClubRequest, 
  ActiveRole,
  PosterConfig,
  MatchSummary
} from './types';
import { 
  INITIAL_CLUBS, 
  INITIAL_TEAMS, 
  INITIAL_PLAYERS, 
  INITIAL_EVENTS, 
  INITIAL_REQUESTS 
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { OperatorDashboard } from './components/operator/OperatorDashboard';
import { ClubManagement } from './components/operator/ClubManagement';
import { RequestManager } from './components/operator/RequestManager';
import { EventsManager } from './components/operator/EventsManager';
import { TeamsManager } from './components/operator/TeamsManager';
import { ClubPortal } from './components/club/ClubPortal';
import { PosterGeneratorModal } from './components/posters/PosterGeneratorModal';
import { MatchSummaryModal } from './components/posters/MatchSummaryModal';
import { CreateEventModal } from './components/events/CreateEventModal';
import { ClubRequestModal } from './components/club/ClubRequestModal';

type OperatorTab = 'dashboard' | 'requests' | 'clubs' | 'events' | 'teams';

export default function App() {
  // Persistence state with localStorage
  const [clubs, setClubs] = useState<Club[]>(() => {
    const saved = localStorage.getItem('foot_saas_clubs');
    return saved ? JSON.parse(saved) : INITIAL_CLUBS;
  });

  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('foot_saas_teams');
    return saved ? JSON.parse(saved) : INITIAL_TEAMS;
  });

  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem('foot_saas_players');
    return saved ? JSON.parse(saved) : INITIAL_PLAYERS;
  });

  const [events, setEvents] = useState<FootballEvent[]>(() => {
    const saved = localStorage.getItem('foot_saas_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [requests, setRequests] = useState<ClubRequest[]>(() => {
    const saved = localStorage.getItem('foot_saas_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  // Active Role and selections
  const [currentRole, setCurrentRole] = useState<ActiveRole>('operator');
  const [selectedClubId, setSelectedClubId] = useState<string>('club-1');
  const [operatorTab, setOperatorTab] = useState<OperatorTab>('dashboard');

  // Modals state
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
  const [activePosterEvent, setActivePosterEvent] = useState<FootballEvent | null>(null);
  const [activePosterClub, setActivePosterClub] = useState<Club | null>(null);

  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [activeSummaryEvent, setActiveSummaryEvent] = useState<FootballEvent | null>(null);

  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [createEventDefaultClubId, setCreateEventDefaultClubId] = useState<string>('club-1');

  const [isClubRequestModalOpen, setIsClubRequestModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('foot_saas_clubs', JSON.stringify(clubs));
  }, [clubs]);

  useEffect(() => {
    localStorage.setItem('foot_saas_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('foot_saas_players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('foot_saas_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('foot_saas_requests', JSON.stringify(requests));
  }, [requests]);

  // Selected Club
  const currentClub = clubs.find(c => c.id === selectedClubId) || clubs[0];

  // Operator Handlers
  const handleUpdateClub = (updatedClub: Club) => {
    setClubs(clubs.map(c => c.id === updatedClub.id ? updatedClub : c));
  };

  const handleAddClub = (newClub: Club) => {
    setClubs([newClub, ...clubs]);
  };

  const handleUpdateRequest = (updatedReq: ClubRequest) => {
    setRequests(requests.map(r => r.id === updatedReq.id ? updatedReq : r));
  };

  const handleAddRequest = (newReq: ClubRequest) => {
    setRequests([newReq, ...requests]);
  };

  const handleCreateEvent = (newEvent: FootballEvent) => {
    setEvents([newEvent, ...events]);
    // Also update club events count
    setClubs(clubs.map(c => {
      if (c.id === newEvent.clubId) {
        return {
          ...c,
          eventsCount: c.eventsCount + 1,
          postersCount: c.postersCount + 1,
        };
      }
      return c;
    }));
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  const handleSavePosterToEvent = (eventId: string, config: PosterConfig) => {
    setEvents(events.map(e => {
      if (e.id === eventId) {
        return {
          ...e,
          hasPoster: true,
          posterConfig: config,
        };
      }
      return e;
    }));
  };

  const handleSaveSummary = (eventId: string, summary: MatchSummary) => {
    setEvents(events.map(e => {
      if (e.id === eventId) {
        return {
          ...e,
          isFinished: true,
          summary,
        };
      }
      return e;
    }));
  };

  const handleAddPlayer = (newPlayer: Player) => {
    setPlayers([newPlayer, ...players]);
  };

  const handleDeletePlayer = (playerId: string) => {
    setPlayers(players.filter(p => p.id !== playerId));
  };

  // Launch modal helpers
  const handleOpenQuickPoster = () => {
    setActivePosterEvent(events[0] || null);
    setActivePosterClub(currentClub);
    setIsPosterModalOpen(true);
  };

  const handleOpenPosterForEvent = (event: FootballEvent) => {
    const club = clubs.find(c => c.id === event.clubId) || null;
    setActivePosterEvent(event);
    setActivePosterClub(club);
    setIsPosterModalOpen(true);
  };

  const handleOpenSummaryForEvent = (event: FootballEvent) => {
    setActiveSummaryEvent(event);
    setIsSummaryModalOpen(true);
  };

  const handleOpenPosterFromSummary = (event: FootballEvent) => {
    const club = clubs.find(c => c.id === event.clubId) || null;
    setActivePosterEvent(event);
    setActivePosterClub(club);
    setIsPosterModalOpen(true);
  };

  const handleOpenStudioForRequest = (req: ClubRequest) => {
    const club = clubs.find(c => c.id === req.clubId) || currentClub;
    // Create a synthesized event or find existing
    const synthEvent: FootballEvent = {
      id: `ev-req-${req.id}`,
      clubId: club.id,
      teamId: 'team-1',
      type: req.type === 'create_tournament' ? 'tournament' : (req.type === 'create_plateau' ? 'plateau' : 'friendly'),
      title: req.title,
      date: req.details?.matchDate || new Date().toISOString().split('T')[0],
      time: req.details?.matchTime || '15:30',
      stadium: club.stadiumName,
      city: club.city,
      isHome: true,
      category: 'Séniors',
      opponentName: req.details?.opponent || 'Club Invité',
      hasPoster: true,
      posterConfig: {
        template: 'matchday_dynamic',
        format: 'square',
        title: req.type === 'urgent_poster' ? 'JOUR DE MATCH' : 'MATCH OFFICIEL',
        subtitle: `${club.shortName} • Saison 2024-2025`,
        homeTeam: club.name,
        awayTeam: req.details?.opponent || 'Équipe Adverse',
        homeColor: club.primaryColor,
        awayColor: '#ef4444',
        dateStr: req.details?.matchDate || 'Samedi 15 Mars 2025',
        timeStr: req.details?.matchTime || '15:30',
        stadium: club.stadiumName,
        city: club.city,
        competition: 'Match Amical Officiel',
        sponsorText: 'Avec le soutien des partenaires du club',
        entryFee: 'Entrée Libre • Buvette sur place'
      }
    };

    setActivePosterEvent(synthEvent);
    setActivePosterClub(club);
    setIsPosterModalOpen(true);
  };

  const handleOpenCreateEventForRequest = (req: ClubRequest) => {
    setCreateEventDefaultClubId(req.clubId);
    setIsCreateEventModalOpen(true);
  };

  const handleResetData = () => {
    if (window.confirm('Voulez-vous réinitialiser les données de démo (clubs, matchs, demandes) ?')) {
      localStorage.removeItem('foot_saas_clubs');
      localStorage.removeItem('foot_saas_teams');
      localStorage.removeItem('foot_saas_players');
      localStorage.removeItem('foot_saas_events');
      localStorage.removeItem('foot_saas_requests');
      setClubs(INITIAL_CLUBS);
      setTeams(INITIAL_TEAMS);
      setPlayers(INITIAL_PLAYERS);
      setEvents(INITIAL_EVENTS);
      setRequests(INITIAL_REQUESTS);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar with Role Switcher */}
      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        clubs={clubs}
        selectedClubId={selectedClubId}
        setSelectedClubId={setSelectedClubId}
        requests={requests}
        onOpenRequestModal={() => setIsClubRequestModalOpen(true)}
        onOpenCreateEventModal={() => {
          setCreateEventDefaultClubId(selectedClubId);
          setIsCreateEventModalOpen(true);
        }}
        onOpenQuickPoster={handleOpenQuickPoster}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* OPERATOR VIEW */}
        {currentRole === 'operator' ? (
          <div className="space-y-6">
            
            {/* Operator Sub-Navigation Bar */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 overflow-x-auto scrollbar-none">
              <div className="flex items-center space-x-2">
                
                <button
                  id="tab-op-dashboard"
                  onClick={() => setOperatorTab('dashboard')}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                    operatorTab === 'dashboard'
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Tableau de Bord</span>
                </button>

                <button
                  id="tab-op-requests"
                  onClick={() => setOperatorTab('requests')}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                    operatorTab === 'requests'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Inbox className="w-4 h-4" />
                  <span>Demandes Clubs</span>
                  {requests.filter(r => r.status === 'pending').length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                      {requests.filter(r => r.status === 'pending').length}
                    </span>
                  )}
                </button>

                <button
                  id="tab-op-clubs"
                  onClick={() => setOperatorTab('clubs')}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                    operatorTab === 'clubs'
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Clubs & Formules</span>
                  {clubs.filter(c => c.status === 'pending').length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                      {clubs.filter(c => c.status === 'pending').length}
                    </span>
                  )}
                </button>

                <button
                  id="tab-op-events"
                  onClick={() => setOperatorTab('events')}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                    operatorTab === 'events'
                      ? 'bg-purple-600/20 text-purple-400 border border-purple-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Événements & Matchs ({events.length})</span>
                </button>

                <button
                  id="tab-op-teams"
                  onClick={() => setOperatorTab('teams')}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                    operatorTab === 'teams'
                      ? 'bg-teal-600/20 text-teal-400 border border-teal-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Effectifs & Joueurs</span>
                </button>

              </div>

              {/* Reset Data shortcut */}
              <button
                onClick={handleResetData}
                className="hidden lg:flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-300 transition px-2 py-1"
                title="Réinitialiser les données de démo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Démo</span>
              </button>
            </div>

            {/* Operator Active Sub-View */}
            {operatorTab === 'dashboard' && (
              <OperatorDashboard
                clubs={clubs}
                requests={requests}
                events={events}
                onNavigateToTab={(tab) => setOperatorTab(tab)}
                onOpenQuickPoster={handleOpenQuickPoster}
                onOpenCreateEvent={() => {
                  setCreateEventDefaultClubId(clubs[0]?.id || 'club-1');
                  setIsCreateEventModalOpen(true);
                }}
                onOpenStudioForRequest={handleOpenStudioForRequest}
                onValidateClub={handleUpdateClub}
              />
            )}

            {operatorTab === 'requests' && (
              <RequestManager
                requests={requests}
                clubs={clubs}
                onUpdateRequest={handleUpdateRequest}
                onOpenStudioForRequest={handleOpenStudioForRequest}
                onOpenCreateEventForRequest={handleOpenCreateEventForRequest}
              />
            )}

            {operatorTab === 'clubs' && (
              <ClubManagement
                clubs={clubs}
                onUpdateClub={handleUpdateClub}
                onAddClub={handleAddClub}
                onSelectClubToView={(clubId) => {
                  setSelectedClubId(clubId);
                  setCurrentRole('club');
                }}
              />
            )}

            {operatorTab === 'events' && (
              <EventsManager
                events={events}
                clubs={clubs}
                onOpenCreateEventModal={() => {
                  setCreateEventDefaultClubId(selectedClubId);
                  setIsCreateEventModalOpen(true);
                }}
                onOpenPosterModal={handleOpenPosterForEvent}
                onOpenSummaryModal={handleOpenSummaryForEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            )}

            {operatorTab === 'teams' && (
              <TeamsManager
                clubs={clubs}
                teams={teams}
                players={players}
                onAddPlayer={handleAddPlayer}
                onDeletePlayer={handleDeletePlayer}
              />
            )}

          </div>
        ) : (
          /* CLUB CLIENT VIEW */
          <ClubPortal
            club={currentClub}
            events={events}
            requests={requests}
            teams={teams}
            players={players}
            onOpenRequestModal={() => setIsClubRequestModalOpen(true)}
            onOpenPosterModal={handleOpenPosterForEvent}
            onOpenSummaryModal={handleOpenSummaryForEvent}
          />
        )}

      </main>

      {/* Footer Info */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-400">FootAmateur Studio</span>
            <span>•</span>
            <span>SaaS Géré V1 pour clubs amateurs de football</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-emerald-400 font-semibold">⚽ Service Opérateur Actif</span>
            <span>•</span>
            <span>Génération Affiches & Résumés Réseaux Sociaux</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Poster Generator Modal */}
      <PosterGeneratorModal
        isOpen={isPosterModalOpen}
        onClose={() => setIsPosterModalOpen(false)}
        event={activePosterEvent}
        club={activePosterClub}
        onSavePosterToEvent={handleSavePosterToEvent}
      />

      {/* 2. Match Summary Debrief Modal */}
      <MatchSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        event={activeSummaryEvent}
        club={activePosterClub || currentClub}
        onSaveSummary={handleSaveSummary}
        onOpenPosterGeneratorWithSummary={handleOpenPosterFromSummary}
      />

      {/* 3. Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateEventModalOpen}
        onClose={() => setIsCreateEventModalOpen(false)}
        clubs={clubs}
        teams={teams}
        defaultClubId={createEventDefaultClubId}
        onCreateEvent={handleCreateEvent}
      />

      {/* 4. Club Request Submission Modal */}
      <ClubRequestModal
        isOpen={isClubRequestModalOpen}
        onClose={() => setIsClubRequestModalOpen(false)}
        club={currentClub}
        onSubmitRequest={handleAddRequest}
      />

    </div>
  );
}
