import React, { useState } from 'react';
import { 
  Shield, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Plus, 
  Edit3, 
  X, 
  Check, 
  Sparkles, 
  MapPin, 
  Mail, 
  Phone,
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Club, SubscriptionPlan, ClubStatus } from '../../types';

interface ClubManagementProps {
  clubs: Club[];
  onUpdateClub: (club: Club) => void;
  onAddClub: (club: Club) => void;
  onSelectClubToView: (clubId: string) => void;
}

export const ClubManagement: React.FC<ClubManagementProps> = ({
  clubs,
  onUpdateClub,
  onAddClub,
  onSelectClubToView,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | ClubStatus>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);

  // New club form state
  const [newClubName, setNewClubName] = useState('');
  const [newClubCity, setNewClubCity] = useState('');
  const [newClubPrimaryColor, setNewClubPrimaryColor] = useState('#0ea5e9');
  const [newClubStadium, setNewClubStadium] = useState('');
  const [newClubEmail, setNewClubEmail] = useState('');
  const [newClubPlan, setNewClubPlan] = useState<SubscriptionPlan>('basic');

  const filteredClubs = clubs.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.presidentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleValidatePendingClub = (club: Club) => {
    const updated: Club = {
      ...club,
      status: 'active',
      renewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    onUpdateClub(updated);

    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.7 }
    });
  };

  const handleTogglePlan = (club: Club) => {
    const nextPlan: SubscriptionPlan = club.plan === 'basic' ? 'pro' : 'basic';
    const updated: Club = {
      ...club,
      plan: nextPlan,
      limits: {
        ...club.limits,
        maxEventsPerMonth: nextPlan === 'pro' ? 999 : 4,
        customTemplates: nextPlan === 'pro',
        highResExport: true,
        prioritySupport: nextPlan === 'pro',
      }
    };
    onUpdateClub(updated);
  };

  const handleCreateClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClubName.trim()) return;

    const newClub: Club = {
      id: `club-${Date.now()}`,
      name: newClubName.trim(),
      shortName: newClubName.trim().slice(0, 14),
      code: newClubName.trim().split(' ').map(w => w[0]).join('').slice(0, 4).toUpperCase(),
      city: newClubCity.trim() || 'Paris',
      postalCode: '75000',
      foundedYear: 2020,
      primaryColor: newClubPrimaryColor,
      secondaryColor: '#ffffff',
      accentColor: '#f59e0b',
      logoUrl: '',
      contactEmail: newClubEmail.trim() || 'contact@club.fr',
      contactPhone: '06 00 00 00 00',
      presidentName: 'Président du club',
      stadiumName: newClubStadium.trim() || 'Stade Municipal',
      stadiumAddress: 'Adresse du stade',
      plan: newClubPlan,
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      renewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      eventsCount: 0,
      postersCount: 0,
      limits: {
        maxEventsPerMonth: newClubPlan === 'pro' ? 999 : 4,
        customTemplates: newClubPlan === 'pro',
        highResExport: true,
        prioritySupport: newClubPlan === 'pro',
        unlimitedPhotos: newClubPlan === 'pro',
        customSponsors: newClubPlan === 'pro',
      }
    };

    onAddClub(newClub);
    setIsAddModalOpen(false);
    setNewClubName('');
    setNewClubCity('');
    setNewClubStadium('');
    setNewClubEmail('');

    confetti({
      particleCount: 50,
      spread: 60,
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Search and New Club */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <span>Gestion des Clubs & Abonnements</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {clubs.length} clubs au total
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Validation des inscriptions, gestion des formules Basique vs Pro et quotas mensuels
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Inscrire un Nouveau Club</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par club, ville, président..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              filterStatus === 'all'
                ? 'bg-slate-800 text-white border border-slate-600'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tous ({clubs.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              filterStatus === 'active'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Validés ({clubs.filter(c => c.status === 'active').length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              filterStatus === 'pending'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            En attente ({clubs.filter(c => c.status === 'pending').length})
          </button>
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClubs.map((club) => {
          const isPending = club.status === 'pending';

          return (
            <div
              key={club.id}
              className={`bg-slate-900 border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                isPending
                  ? 'border-amber-500/50 bg-amber-950/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header card with status & badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md border border-white/20"
                      style={{ backgroundColor: club.primaryColor }}
                    >
                      {club.code || club.name.slice(0, 3)}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-white truncate max-w-[170px]">
                        {club.name}
                      </h3>
                      <p className="text-xs text-slate-400">{club.city}</p>
                    </div>
                  </div>

                  {/* Plan badge */}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    club.plan === 'pro'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {club.plan === 'pro' ? '★ Pro' : 'Basique'}
                  </span>
                </div>

                {/* Status indicator */}
                <div className="mb-3">
                  {isPending ? (
                    <div className="flex items-center space-x-1.5 p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>Nouvelle inscription à valider</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-slate-400 py-1 border-b border-slate-800">
                      <span>Statut club :</span>
                      <span className="text-emerald-400 font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Actif & Validé</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                  <div className="flex items-center space-x-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{club.stadiumName}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{club.contactEmail}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-400">Président :</span>
                    <span className="font-semibold text-white">{club.presidentName}</span>
                  </div>
                </div>

                {/* Quotas & Limits */}
                <div className="p-2.5 rounded-xl bg-slate-850 border border-slate-800 text-[11px] text-slate-300 space-y-1 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Événements ce mois :</span>
                    <strong>{club.eventsCount} / {club.plan === 'pro' ? 'Illimités' : '4 max'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Templates Pro :</span>
                    <strong className={club.limits.customTemplates ? 'text-emerald-400' : 'text-slate-500'}>
                      {club.limits.customTemplates ? 'Inclus' : 'Non'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                {isPending ? (
                  <button
                    onClick={() => handleValidatePendingClub(club)}
                    className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-xl shadow-md transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Valider l'Inscription du Club</span>
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleTogglePlan(club)}
                      className="bg-slate-800 hover:bg-slate-750 text-slate-300 text-[11px] font-semibold py-1.5 rounded-lg border border-slate-700 transition"
                      title="Changer entre formule Basique et Pro"
                    >
                      Passer en {club.plan === 'basic' ? 'Pro' : 'Basique'}
                    </button>

                    <button
                      onClick={() => onSelectClubToView(club.id)}
                      className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-[11px] font-bold py-1.5 rounded-lg border border-blue-500/30 transition"
                    >
                      Voir Espace Club →
                    </button>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Club Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Inscrire un Club (Service Géré)</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClub} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Nom Officiel du Club *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: FC Les Gobelins Amateurs"
                  value={newClubName}
                  onChange={(e) => setNewClubName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Ville</label>
                  <input
                    type="text"
                    placeholder="Ex: Paris 13e"
                    value={newClubCity}
                    onChange={(e) => setNewClubCity(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Couleur Principale</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={newClubPrimaryColor}
                      onChange={(e) => setNewClubPrimaryColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-xs text-slate-300 font-mono">{newClubPrimaryColor}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Stade principal</label>
                <input
                  type="text"
                  placeholder="Ex: Stade Boutroux"
                  value={newClubStadium}
                  onChange={(e) => setNewClubStadium(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Email de contact</label>
                <input
                  type="email"
                  placeholder="secretariat@club.com"
                  value={newClubEmail}
                  onChange={(e) => setNewClubEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Formule d'Abonnement</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewClubPlan('basic')}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      newClubPlan === 'basic'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    Formule Basique
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewClubPlan('pro')}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      newClubPlan === 'pro'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    Formule PRO ★
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Créer et Valider le Club
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
