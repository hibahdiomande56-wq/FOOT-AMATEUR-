import React, { useState } from 'react';
import { 
  X, 
  Trophy, 
  Sparkles, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Share2, 
  Calendar, 
  CheckCircle2, 
  BarChart3,
  Award
} from 'lucide-react';
import { FootballEvent, MatchSummary, Scorer, Club } from '../../types';
import { generateSummaryCaption } from '../../utils/socialCaptionGenerator';

interface MatchSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: FootballEvent | null;
  club: Club | null;
  onSaveSummary: (eventId: string, summary: MatchSummary) => void;
  onOpenPosterGeneratorWithSummary: (event: FootballEvent) => void;
}

export const MatchSummaryModal: React.FC<MatchSummaryModalProps> = ({
  isOpen,
  onClose,
  event,
  club,
  onSaveSummary,
  onOpenPosterGeneratorWithSummary,
}) => {
  if (!isOpen || !event) return null;

  const initialSummary = event.summary || {
    scoreHome: 2,
    scoreAway: 1,
    scorers: [
      { playerName: 'Moussa Diarra', minute: 23, isPenalty: false },
      { playerName: 'Kader Sylla', minute: 71, isPenalty: false },
    ],
    mvpPlayerName: 'Lucas Moreira',
    mvpClub: 'home',
    shotsHome: 12,
    shotsAway: 6,
    cornersHome: 5,
    cornersAway: 2,
    foulsHome: 7,
    foulsAway: 11,
    possessionHome: 55,
    coachQuote: 'Belle rigueur défensive et efficacité clinique devant le but.',
  };

  const [scoreHome, setScoreHome] = useState(initialSummary.scoreHome);
  const [scoreAway, setScoreAway] = useState(initialSummary.scoreAway);
  const [scorers, setScorers] = useState<Scorer[]>(initialSummary.scorers || []);
  const [mvpPlayerName, setMvpPlayerName] = useState(initialSummary.mvpPlayerName || '');
  const [shotsHome, setShotsHome] = useState(initialSummary.shotsHome || 10);
  const [shotsAway, setShotsAway] = useState(initialSummary.shotsAway || 6);
  const [cornersHome, setCornersHome] = useState(initialSummary.cornersHome || 4);
  const [cornersAway, setCornersAway] = useState(initialSummary.cornersAway || 3);
  const [possessionHome, setPossessionHome] = useState(initialSummary.possessionHome || 52);
  const [coachQuote, setCoachQuote] = useState(initialSummary.coachQuote || '');
  const [copied, setCopied] = useState(false);

  // New scorer input state
  const [newScorerName, setNewScorerName] = useState('');
  const [newScorerMin, setNewScorerMin] = useState(45);
  const [newScorerPen, setNewScorerPen] = useState(false);
  const [newScorerOpp, setNewScorerOpp] = useState(false);

  const handleAddScorer = () => {
    if (!newScorerName.trim()) return;
    setScorers([
      ...scorers,
      {
        playerName: newScorerName.trim(),
        minute: newScorerMin,
        isPenalty: newScorerPen,
        isOpponent: newScorerOpp,
      }
    ]);
    setNewScorerName('');
    setNewScorerPen(false);
    setNewScorerOpp(false);
  };

  const handleRemoveScorer = (index: number) => {
    setScorers(scorers.filter((_, i) => i !== index));
  };

  const buildSummaryObject = (): MatchSummary => {
    return {
      scoreHome,
      scoreAway,
      scorers,
      mvpPlayerName,
      mvpClub: 'home',
      shotsHome,
      shotsAway,
      cornersHome,
      cornersAway,
      possessionHome,
      coachQuote,
    };
  };

  const handleSave = () => {
    const summary = buildSummaryObject();
    onSaveSummary(event.id, summary);
    onClose();
  };

  const handleGenerateVisual = () => {
    const summary = buildSummaryObject();
    onSaveSummary(event.id, summary);
    onOpenPosterGeneratorWithSummary({
      ...event,
      isFinished: true,
      summary,
    });
    onClose();
  };

  const handleCopyCaption = () => {
    const summary = buildSummaryObject();
    const caption = generateSummaryCaption(event, summary, club || undefined);
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const homeTeam = event.isHome ? (club?.name || 'Club Local') : (event.opponentName || 'Adversaire');
  const awayTeam = !event.isHome ? (club?.name || 'Club Local') : (event.opponentName || 'Adversaire');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Saisie du Résumé de Match & Stats
              </h2>
              <p className="text-xs text-slate-400">
                {event.title} • {event.date}
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Score Board */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-850 p-6 rounded-2xl border border-slate-700 text-center shadow-lg">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-3">
              SCORE FINAL DU MATCH
            </span>

            <div className="flex items-center justify-center space-x-6 sm:space-x-10">
              {/* Home */}
              <div className="flex-1 text-right">
                <div className="font-extrabold text-sm sm:text-base text-white truncate">{homeTeam}</div>
                <div className="text-xs text-slate-400 font-medium">Domicile</div>
              </div>

              {/* Counter Home */}
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min="0"
                  value={scoreHome}
                  onChange={(e) => setScoreHome(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-950 border-2 border-emerald-500/50 rounded-2xl text-center text-3xl sm:text-4xl font-black text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-2xl font-black text-slate-500">:</span>
                <input
                  type="number"
                  min="0"
                  value={scoreAway}
                  onChange={(e) => setScoreAway(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-950 border-2 border-emerald-500/50 rounded-2xl text-center text-3xl sm:text-4xl font-black text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Away */}
              <div className="flex-1 text-left">
                <div className="font-extrabold text-sm sm:text-base text-white truncate">{awayTeam}</div>
                <div className="text-xs text-slate-400 font-medium">Extérieur</div>
              </div>
            </div>
          </div>

          {/* Scorers Section */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Buteurs & Minutes (⚽)
            </span>

            {/* List */}
            <div className="space-y-2">
              {scorers.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-1">Aucun buteur ajouté pour le moment.</p>
              ) : (
                scorers.map((s, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-850 border border-slate-700/80 text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-300">
                        {s.minute}'
                      </span>
                      <span className="font-semibold text-white">{s.playerName}</span>
                      {s.isPenalty && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                          Penalty
                        </span>
                      )}
                      {s.isOpponent && (
                        <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold">
                          Adversaire
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveScorer(idx)}
                      className="p-1 rounded hover:bg-slate-750 text-slate-400 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add Scorer Row */}
            <div className="pt-2 border-t border-slate-700/60 flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="Nom du buteur (ex: Moussa Diarra)"
                value={newScorerName}
                onChange={(e) => setNewScorerName(e.target.value)}
                className="flex-1 min-w-[160px] bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={newScorerMin}
                  onChange={(e) => setNewScorerMin(parseInt(e.target.value) || 1)}
                  className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-center text-white font-bold"
                  title="Minute du but"
                />
                <span className="text-xs text-slate-400 font-bold">'</span>
              </div>
              
              <label className="flex items-center space-x-1 text-[11px] text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newScorerPen}
                  onChange={(e) => setNewScorerPen(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-emerald-500"
                />
                <span>Pénalty</span>
              </label>

              <label className="flex items-center space-x-1 text-[11px] text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newScorerOpp}
                  onChange={(e) => setNewScorerOpp(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-red-500"
                />
                <span>Adverse</span>
              </label>

              <button
                type="button"
                onClick={handleAddScorer}
                className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </button>
            </div>
          </div>

          {/* MVP & Coach Quote */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-2">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Award className="w-4 h-4" />
                <span>Homme du Match (MVP)</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Enzo Carvalho (N°10)"
                value={mvpPlayerName}
                onChange={(e) => setMvpPlayerName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              />
              <p className="text-[11px] text-slate-400">Ce joueur sera mis en valeur sur l'affiche officielle.</p>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Le mot du Coach / Débriefing
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Belle intensité et solidarité défensive sur les 90 minutes..."
                value={coachQuote}
                onChange={(e) => setCoachQuote(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white resize-none"
              />
            </div>
          </div>

          {/* Match Stats */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Statistiques du Match</span>
            </span>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Tirs Cadrés</span>
                <div className="flex items-center justify-center space-x-2">
                  <input
                    type="number"
                    value={shotsHome}
                    onChange={(e) => setShotsHome(parseInt(e.target.value) || 0)}
                    className="w-12 bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-xs text-center text-white"
                  />
                  <span className="text-slate-500 font-bold">-</span>
                  <input
                    type="number"
                    value={shotsAway}
                    onChange={(e) => setShotsAway(parseInt(e.target.value) || 0)}
                    className="w-12 bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-xs text-center text-white"
                  />
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Corners</span>
                <div className="flex items-center justify-center space-x-2">
                  <input
                    type="number"
                    value={cornersHome}
                    onChange={(e) => setCornersHome(parseInt(e.target.value) || 0)}
                    className="w-12 bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-xs text-center text-white"
                  />
                  <span className="text-slate-500 font-bold">-</span>
                  <input
                    type="number"
                    value={cornersAway}
                    onChange={(e) => setCornersAway(parseInt(e.target.value) || 0)}
                    className="w-12 bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-xs text-center text-white"
                  />
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Possession Dom. (%)</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={possessionHome}
                  onChange={(e) => setPossessionHome(parseInt(e.target.value) || 50)}
                  className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-center text-white font-bold"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/95 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleCopyCaption}
            className={`flex items-center space-x-1.5 text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl border transition ${
              copied
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
            }`}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Légende Copiée !' : 'Copier Légende Instagram'}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl border border-slate-700 transition"
            >
              Enregistrer le Score
            </button>

            <button
              onClick={handleGenerateVisual}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-lg shadow-emerald-600/30 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Générer l'Affiche Résumé</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
