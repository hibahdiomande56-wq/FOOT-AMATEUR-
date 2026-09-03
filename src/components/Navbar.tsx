import React from 'react';
import { 
  Shield, 
  Crown, 
  Sparkles, 
  Layers, 
  Calendar, 
  FileText, 
  PlusCircle, 
  Users, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Club, ActiveRole, ClubRequest } from '../types';

interface NavbarProps {
  currentRole: ActiveRole;
  setCurrentRole: (role: ActiveRole) => void;
  clubs: Club[];
  selectedClubId: string;
  setSelectedClubId: (id: string) => void;
  requests: ClubRequest[];
  onOpenRequestModal: () => void;
  onOpenCreateEventModal: () => void;
  onOpenQuickPoster: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  setCurrentRole,
  clubs,
  selectedClubId,
  setSelectedClubId,
  requests,
  onOpenRequestModal,
  onOpenCreateEventModal,
  onOpenQuickPoster,
}) => {
  const pendingRequestsCount = requests.filter(r => r.status === 'pending').length;
  const currentClub = clubs.find(c => c.id === selectedClubId) || clubs[0];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-black text-xl">
              ⚽
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  FootAmateur <span className="text-emerald-400">Studio</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  V1 Service Géré
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Gestion d'événements & génération d'affiches pour clubs amateurs
              </p>
            </div>
          </div>

          {/* Center: Role Switcher Pill */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 shadow-inner">
            <button
              id="role-operator-btn"
              onClick={() => setCurrentRole('operator')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                currentRole === 'operator'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Opérateur (Toi)</span>
              {pendingRequestsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[11px] font-bold rounded-full bg-amber-500 text-slate-950 animate-pulse">
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            <button
              id="role-club-btn"
              onClick={() => setCurrentRole('club')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                currentRole === 'club'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Espace Club</span>
            </button>
          </div>

          {/* Right Action buttons & Club selector */}
          <div className="flex items-center space-x-3">
            {currentRole === 'club' ? (
              <>
                {/* Club selector dropdown */}
                <div className="relative flex items-center">
                  <span className="text-xs text-slate-400 mr-2 hidden md:inline">Club actif :</span>
                  <div className="relative">
                    <select
                      id="select-active-club"
                      value={selectedClubId}
                      onChange={(e) => setSelectedClubId(e.target.value)}
                      className="appearance-none bg-slate-800 hover:bg-slate-750 text-slate-200 font-medium text-xs sm:text-sm rounded-lg pl-3 pr-8 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
                    >
                      {clubs.map((club) => (
                        <option key={club.id} value={club.id}>
                          {club.name} ({club.plan === 'pro' ? '★ Pro' : 'Basique'})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Club Request button */}
                <button
                  id="club-make-request-btn"
                  onClick={onOpenRequestModal}
                  className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-lg shadow-md shadow-blue-600/20 transition active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Nouvelle Demande</span>
                  <span className="sm:hidden">Demande</span>
                </button>
              </>
            ) : (
              <>
                {/* Operator Quick Buttons */}
                <button
                  id="op-quick-poster-btn"
                  onClick={onOpenQuickPoster}
                  className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-lg shadow-md shadow-emerald-600/20 transition active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Studio Affiche</span>
                </button>

                <button
                  id="op-create-event-btn"
                  onClick={onOpenCreateEventModal}
                  className="hidden md:flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold px-3 py-2 rounded-lg border border-slate-700 transition"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <span>Créer Événement</span>
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
