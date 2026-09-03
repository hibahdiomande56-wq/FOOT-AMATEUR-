import React from 'react';
import { 
  Shield, 
  Users, 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ArrowRight, 
  Download, 
  TrendingUp,
  Crown
} from 'lucide-react';
import { Club, ClubRequest, FootballEvent } from '../../types';

interface OperatorDashboardProps {
  clubs: Club[];
  requests: ClubRequest[];
  events: FootballEvent[];
  onNavigateToTab: (tab: 'requests' | 'clubs' | 'events') => void;
  onOpenQuickPoster: () => void;
  onOpenCreateEvent: () => void;
  onOpenStudioForRequest: (req: ClubRequest) => void;
  onValidateClub: (club: Club) => void;
}

export const OperatorDashboard: React.FC<OperatorDashboardProps> = ({
  clubs,
  requests,
  events,
  onNavigateToTab,
  onOpenQuickPoster,
  onOpenCreateEvent,
  onOpenStudioForRequest,
  onValidateClub,
}) => {
  const activeClubs = clubs.filter(c => c.status === 'active');
  const pendingClubs = clubs.filter(c => c.status === 'pending');
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const proClubs = clubs.filter(c => c.plan === 'pro');
  const totalPosters = events.filter(e => e.hasPoster).length;

  return (
    <div className="space-y-6">
      
      {/* Pending club approval alert banner */}
      {pendingClubs.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-transparent border border-amber-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {pendingClubs.length} nouveau(x) club(s) en attente de validation
              </h3>
              <p className="text-xs text-slate-300">
                {pendingClubs.map(c => c.name).join(', ')} attendent votre validation pour démarrer.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('clubs')}
            className="flex items-center justify-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl shadow transition shrink-0"
          >
            <span>Examiner & Valider</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Clubs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Clubs Actifs</span>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{activeClubs.length}</span>
            <span className="text-xs text-emerald-400 font-bold">
              ({proClubs.length} Formule Pro)
            </span>
          </div>
          <button 
            onClick={() => onNavigateToTab('clubs')}
            className="text-[11px] text-slate-400 hover:text-white mt-2 flex items-center space-x-1"
          >
            <span>Gérer les formules</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Demandes */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Demandes en attente</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{pendingRequests.length}</span>
            <span className="text-xs text-slate-400">à traiter</span>
          </div>
          <button 
            onClick={() => onNavigateToTab('requests')}
            className="text-[11px] text-amber-400 hover:text-amber-300 mt-2 flex items-center space-x-1 font-semibold"
          >
            <span>Traiter les demandes</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Événements */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Événements Sportifs</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{events.length}</span>
            <span className="text-xs text-slate-400">matchs & tournois</span>
          </div>
          <button 
            onClick={() => onNavigateToTab('events')}
            className="text-[11px] text-slate-400 hover:text-white mt-2 flex items-center space-x-1"
          >
            <span>Voir le planning</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Affiches générées */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Affiches & Visuels</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{totalPosters}</span>
            <span className="text-xs text-purple-400 font-bold">HD 1080p</span>
          </div>
          <button 
            onClick={onOpenQuickPoster}
            className="text-[11px] text-purple-400 hover:text-purple-300 mt-2 flex items-center space-x-1 font-semibold"
          >
            <span>Ouvrir Studio Affiche</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>

      {/* Service Géré Quick-Action Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Urgent and Pending Requests Queue (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold text-white">File des Demandes Clubs à Exécuter</span>
              {pendingRequests.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">
                  {pendingRequests.length}
                </span>
              )}
            </div>

            <button
              onClick={() => onNavigateToTab('requests')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1"
            >
              <span>Voir tout</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="p-8 text-center bg-slate-850 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-200">Toutes les demandes sont traitées !</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Le back-office est à jour.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {pendingRequests.slice(0, 3).map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-xl bg-slate-850 border border-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-650 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-extrabold text-white">{req.clubName}</span>
                      {req.urgency === 'urgent' && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                          ⚡ Urgent
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">({req.typeLabel})</span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-1">{req.title}</p>
                  </div>

                  <button
                    onClick={() => onOpenStudioForRequest(req)}
                    className="flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow transition shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Traiter & Générer l'Affiche</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Tools & Subscription Tier Guide (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-white">Formules d'Abonnement (V1)</span>
            <span className="text-xs text-slate-400">Modèle Évolutif</span>
          </div>

          <div className="space-y-3">
            {/* Basique card */}
            <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Formule Basique</span>
                <span className="text-xs text-slate-400">{clubs.filter(c => c.plan === 'basic').length} clubs</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1 pl-1">
                <li className="flex items-center space-x-1.5">
                  <span className="text-emerald-400">✓</span>
                  <span>Jusqu'à 4 affiches & événements / mois</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="text-emerald-400">✓</span>
                  <span>Templates standards Instagram / Facebook</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="text-slate-500">✗</span>
                  <span className="text-slate-400">Personnalisation sponsors limitée</span>
                </li>
              </ul>
            </div>

            {/* Pro card */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500/10 to-slate-850 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Formule PRO</span>
                </span>
                <span className="text-xs text-amber-300 font-bold">{proClubs.length} clubs</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1 pl-1">
                <li className="flex items-center space-x-1.5">
                  <span className="text-amber-400">✓</span>
                  <span>Événements & affiches illimités</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="text-amber-400">✓</span>
                  <span>Tous les templates graphiques (5+ styles)</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="text-amber-400">✓</span>
                  <span>Traitement prioritaire en &lt; 2h</span>
                </li>
              </ul>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <button
                onClick={onOpenQuickPoster}
                className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold py-2.5 rounded-xl border border-slate-700 transition"
              >
                Studio Affiche Libre
              </button>
              <button
                onClick={onOpenCreateEvent}
                className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-bold py-2.5 rounded-xl border border-emerald-500/30 transition"
              >
                + Créer Événement
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
