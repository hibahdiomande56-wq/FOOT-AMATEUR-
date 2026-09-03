import React, { useState } from 'react';
import { Users, Plus, Trophy, Shield, UserPlus, Trash2, Edit3, X, Check } from 'lucide-react';
import { Club, Team, Player, PlayerPosition } from '../../types';

interface TeamsManagerProps {
  clubs: Club[];
  teams: Team[];
  players: Player[];
  onAddPlayer: (player: Player) => void;
  onDeletePlayer: (playerId: string) => void;
}

export const TeamsManager: React.FC<TeamsManagerProps> = ({
  clubs,
  teams,
  players,
  onAddPlayer,
  onDeletePlayer,
}) => {
  const [selectedClubId, setSelectedClubId] = useState<string>(clubs[0]?.id || '');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('all');
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);

  // New player form
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newNumber, setNewNumber] = useState(10);
  const [newPosition, setNewPosition] = useState<PlayerPosition>('MID');
  const [newIsCaptain, setNewIsCaptain] = useState(false);

  const activeClub = clubs.find(c => c.id === selectedClubId) || clubs[0];
  const clubTeams = teams.filter(t => t.clubId === selectedClubId);
  const clubPlayers = players.filter(p => {
    const matchClub = p.clubId === selectedClubId;
    const matchTeam = selectedTeamId === 'all' || p.teamId === selectedTeamId;
    return matchClub && matchTeam;
  });

  const handleCreatePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLastName.trim()) return;

    const targetTeamId = selectedTeamId !== 'all' 
      ? selectedTeamId 
      : (clubTeams[0]?.id || 'team-default');

    const newP: Player = {
      id: `p-${Date.now()}`,
      clubId: selectedClubId,
      teamId: targetTeamId,
      firstName: newFirstName.trim(),
      lastName: newLastName.trim(),
      number: newNumber,
      position: newPosition,
      isCaptain: newIsCaptain,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
    };

    onAddPlayer(newP);
    setIsAddPlayerOpen(false);
    setNewFirstName('');
    setNewLastName('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <span>Équipes & Effectifs Joueurs</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {clubPlayers.length} joueurs
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Gestion des catégories, numéros de maillots et statistiques des effectifs amateurs
          </p>
        </div>

        <button
          onClick={() => setIsAddPlayerOpen(true)}
          className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Ajouter un Joueur</span>
        </button>
      </div>

      {/* Selectors Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
        
        {/* Club Select */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400">Club :</span>
          <select
            value={selectedClubId}
            onChange={(e) => {
              setSelectedClubId(e.target.value);
              setSelectedTeamId('all');
            }}
            className="w-full sm:w-auto bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            {clubs.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Team filter */}
        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setSelectedTeamId('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedTeamId === 'all'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Toutes les équipes
          </button>
          {clubTeams.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTeamId(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                selectedTeamId === t.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {clubPlayers.map((player) => {
          const team = teams.find(t => t.id === player.teamId);

          return (
            <div
              key={player.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:border-slate-700 transition"
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-md border border-white/20 shrink-0"
                  style={{ backgroundColor: activeClub.primaryColor }}
                >
                  {player.number}
                </div>

                <div>
                  <div className="flex items-center space-x-1.5">
                    <h4 className="text-sm font-extrabold text-white">
                      {player.firstName} {player.lastName}
                    </h4>
                    {player.isCaptain && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                        Cap.
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                    <span className="font-bold text-slate-300">{player.position}</span>
                    <span>•</span>
                    <span className="text-slate-400 truncate max-w-[120px]">{team?.name || 'Séniors'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                    <span>⚽ {player.goals} buts</span>
                    <span>•</span>
                    <span>👟 {player.assists} passes</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onDeletePlayer(player.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition"
                title="Supprimer le joueur"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Player Modal */}
      {isAddPlayerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Ajouter un Joueur dans l'Effectif</h3>
              <button onClick={() => setIsAddPlayerOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlayer} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Prénom</label>
                  <input
                    type="text"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">N° de maillot</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={newNumber}
                    onChange={(e) => setNewNumber(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Poste</label>
                  <select
                    value={newPosition}
                    onChange={(e) => setNewPosition(e.target.value as PlayerPosition)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="GK">Gardien (GK)</option>
                    <option value="DEF">Défenseur (DEF)</option>
                    <option value="MID">Milieu (MID)</option>
                    <option value="ATT">Attaquant (ATT)</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={newIsCaptain}
                  onChange={(e) => setNewIsCaptain(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-emerald-500"
                />
                <span>Capitaine d'équipe</span>
              </label>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddPlayerOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Enregistrer le Joueur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
