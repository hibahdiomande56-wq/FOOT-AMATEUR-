import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Sparkles, 
  Palette, 
  Image as ImageIcon, 
  Calendar, 
  Clock, 
  MapPin, 
  Trophy, 
  Share2,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PosterConfig, PosterFormat, PosterTemplate, FootballEvent, Club } from '../../types';
import { renderPosterToCanvas, downloadCanvasAsImage } from '../../utils/canvasPosterRenderer';
import { generateMatchdayCaption, generateSummaryCaption } from '../../utils/socialCaptionGenerator';

interface PosterGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: FootballEvent | null;
  club?: Club | null;
  initialTemplate?: PosterTemplate;
  onSavePosterToEvent?: (eventId: string, config: PosterConfig) => void;
}

export const PosterGeneratorModal: React.FC<PosterGeneratorModalProps> = ({
  isOpen,
  onClose,
  event,
  club,
  initialTemplate = 'matchday_dynamic',
  onSavePosterToEvent,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copiedCaption, setCopiedCaption] = useState(false);

  // Poster Config State
  const [config, setConfig] = useState<PosterConfig>({
    template: initialTemplate,
    format: 'square',
    title: event?.isFinished ? 'RÉSULTAT DU MATCH' : 'JOUR DE MATCH',
    subtitle: event?.competitionName || 'Match de préparation • Saison 2024-2025',
    homeTeam: event?.isHome ? (club?.name || 'Club Local') : (event?.opponentName || 'Adversaire'),
    awayTeam: !event?.isHome ? (club?.name || 'Club Local') : (event?.opponentName || 'Équipe Extérieure'),
    homeColor: club?.primaryColor || '#0ea5e9',
    awayColor: '#ef4444',
    dateStr: event ? `${event.date}` : 'Samedi 15 Mars 2025',
    timeStr: event?.time || '15:30',
    stadium: event?.stadium || (club?.stadiumName || 'Stade Municipal'),
    city: event?.city || (club?.city || 'Paris'),
    competition: event?.competitionName || 'Match Amical',
    sponsorText: 'Avec le soutien de la municipalité & de nos partenaires locaux',
    entryFee: 'Entrée Libre • Buvette & Grillades sur place',
    isResult: !!event?.isFinished,
    scoreHome: event?.summary?.scoreHome ?? 3,
    scoreAway: event?.summary?.scoreAway ?? 1,
    scorersText: event?.summary?.scorers 
      ? event.summary.scorers.map(s => `${s.minute}' ${s.playerName}`).join(', ')
      : '18\' M. Diarra, 54\' E. Carvalho, 82\' K. Sylla',
    mvpText: event?.summary?.mvpPlayerName || 'Enzo Carvalho'
  });

  // Re-sync when props change
  useEffect(() => {
    if (event) {
      const isFin = !!event.isFinished;
      setConfig({
        template: event.posterConfig?.template || initialTemplate,
        format: event.posterConfig?.format || 'square',
        title: isFin ? 'RÉSULTAT DU MATCH' : (event.posterConfig?.title || 'JOUR DE MATCH'),
        subtitle: event.competitionName || 'Match Amical Officiel',
        homeTeam: event.isHome ? (club?.name || 'Club Domicile') : (event.opponentName || 'Équipe A'),
        awayTeam: !event.isHome ? (club?.name || 'Club Visiteur') : (event.opponentName || 'Équipe B'),
        homeColor: club?.primaryColor || '#0ea5e9',
        awayColor: '#ef4444',
        dateStr: event.date,
        timeStr: event.time,
        stadium: event.stadium,
        city: event.city,
        competition: event.competitionName || (event.type === 'friendly' ? 'Match Amical' : 'Tournoi'),
        sponsorText: event.posterConfig?.sponsorText || 'FootAmateur Studio • Partagez la passion amateur',
        entryFee: event.posterConfig?.entryFee || 'Entrée gratuite pour tous • Restauration sur place',
        isResult: isFin,
        scoreHome: event.summary?.scoreHome ?? 3,
        scoreAway: event.summary?.scoreAway ?? 1,
        scorersText: event.summary?.scorers 
          ? event.summary.scorers.map(s => `${s.minute}' ${s.playerName}`).join(', ')
          : '14\' But Club, 68\' But Club',
        mvpText: event.summary?.mvpPlayerName || 'Joueur Clé'
      });
    }
  }, [event, club, initialTemplate]);

  // Re-render canvas whenever config changes
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    renderPosterToCanvas(canvasRef.current, config, 1);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleDownloadPNG = () => {
    if (!canvasRef.current) return;
    const filename = `Affiche_${config.homeTeam.replace(/\s+/g, '_')}_vs_${config.awayTeam.replace(/\s+/g, '_')}_${config.format}`;
    downloadCanvasAsImage(canvasRef.current, filename);
    
    // Celebration confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.85 }
    });
  };

  const handlePrint = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const win = window.open('');
    if (win) {
      win.document.write(`
        <html>
          <head>
            <title>Impression Affiche Match - ${config.title}</title>
            <style>
              body { margin: 0; display: flex; align-items: center; justify-content: center; background: #fff; }
              img { max-width: 100vw; max-height: 100vh; object-fit: contain; }
              @media print {
                img { width: 100%; height: auto; }
              }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" onload="window.print(); window.close();" />
          </body>
        </html>
      `);
      win.document.close();
    }
  };

  const handleCopyCaption = () => {
    let caption = '';
    if (event) {
      if (config.isResult && event.summary) {
        caption = generateSummaryCaption(event, event.summary, club || undefined);
      } else {
        caption = generateMatchdayCaption(event, club || undefined);
      }
    } else {
      caption = `🔥 ${config.title} ! ⚽\n\n${config.homeTeam} VS ${config.awayTeam}\n🏆 ${config.competition}\n📅 ${config.dateStr} à ${config.timeStr}\n📍 ${config.stadium}, ${config.city}\n\nVenez soutenir nos couleurs ! 🙌 #FootAmateur #Matchday`;
    }

    navigator.clipboard.writeText(caption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  const handleSaveToEvent = () => {
    if (event && onSavePosterToEvent) {
      onSavePosterToEvent(event.id, config);
      onClose();
    }
  };

  const templates: { id: PosterTemplate; name: string; tag: string }[] = [
    { id: 'matchday_dynamic', name: 'Matchday Dynamique', tag: 'Moderne' },
    { id: 'choc_weekend', name: 'Choc du Week-end', tag: 'Sombre & Or' },
    { id: 'neon_stadium', name: 'Néon Stadium', tag: 'Électrique' },
    { id: 'retro_gazette', name: 'Gazette Rétro', tag: 'Authentique' },
    { id: 'minimal_pro', name: 'Minimaliste Pro', tag: 'Épuré' },
  ];

  const formats: { id: PosterFormat; name: string; ratio: string }[] = [
    { id: 'square', name: 'Carré 1:1', ratio: 'Instagram Feed / Facebook' },
    { id: 'story', name: 'Story 9:16', ratio: 'Instagram Story / TikTok' },
    { id: 'landscape', name: 'Bannière 16:9', ratio: 'Site Web / Twitter' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center space-x-2">
                <span>Générateur Automatique d'Affiches & Résumés</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  HD Export
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Personnalisation instantanée avec logos, couleurs des clubs et formats réseaux sociaux
              </p>
            </div>
          </div>

          <button
            id="close-poster-generator-btn"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left controls + Right canvas preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Template Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                1. Style de Template
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setConfig({ ...config, template: tpl.id })}
                    className={`text-left p-2.5 rounded-xl border text-xs font-semibold transition ${
                      config.template === tpl.id
                        ? 'bg-emerald-600/20 border-emerald-500 text-white ring-1 ring-emerald-500 shadow-md'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-bold">{tpl.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{tpl.tag}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Format Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                2. Format Réseaux Sociaux
              </label>
              <div className="grid grid-cols-3 gap-2">
                {formats.map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setConfig({ ...config, format: fmt.id })}
                    className={`text-left p-2.5 rounded-xl border text-xs font-semibold transition ${
                      config.format === fmt.id
                        ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500 shadow-md'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-bold">{fmt.name}</div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">{fmt.ratio}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Poster Type Switch: Matchday vs Résultat */}
            <div className="p-3 bg-slate-800/70 border border-slate-700/70 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200">Mode Résumé de Match (Score Final)</span>
                <p className="text-[11px] text-slate-400">Injecte le score, les buteurs et le joueur clé</p>
              </div>
              <button
                onClick={() => setConfig({ 
                  ...config, 
                  isResult: !config.isResult,
                  title: !config.isResult ? 'RÉSULTAT DU MATCH' : 'JOUR DE MATCH'
                })}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                  config.isResult ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-md transform transition" />
              </button>
            </div>

            {/* Teams and Colors */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/80 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Équipes & Couleurs
              </span>

              <div className="grid grid-cols-2 gap-3">
                {/* Home */}
                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">Équipe Domicile</label>
                  <input
                    type="text"
                    value={config.homeTeam}
                    onChange={(e) => setConfig({ ...config, homeTeam: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                  <div className="flex items-center space-x-2 mt-1.5">
                    <input
                      type="color"
                      value={config.homeColor}
                      onChange={(e) => setConfig({ ...config, homeColor: e.target.value })}
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-[10px] text-slate-400">Couleur Domicile</span>
                  </div>
                </div>

                {/* Away */}
                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">Équipe Extérieure</label>
                  <input
                    type="text"
                    value={config.awayTeam}
                    onChange={(e) => setConfig({ ...config, awayTeam: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                  <div className="flex items-center space-x-2 mt-1.5">
                    <input
                      type="color"
                      value={config.awayColor}
                      onChange={(e) => setConfig({ ...config, awayColor: e.target.value })}
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-[10px] text-slate-400">Couleur Extérieure</span>
                  </div>
                </div>
              </div>

              {/* If Result: Score inputs */}
              {config.isResult && (
                <div className="pt-2 border-t border-slate-700/60 space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 font-medium block mb-1">Score Domicile</label>
                      <input
                        type="number"
                        min="0"
                        value={config.scoreHome ?? 0}
                        onChange={(e) => setConfig({ ...config, scoreHome: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white text-center font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 font-medium block mb-1">Score Extérieur</label>
                      <input
                        type="number"
                        min="0"
                        value={config.scoreAway ?? 0}
                        onChange={(e) => setConfig({ ...config, scoreAway: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white text-center font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 font-medium block mb-1">Buteurs</label>
                    <input
                      type="text"
                      value={config.scorersText || ''}
                      onChange={(e) => setConfig({ ...config, scorersText: e.target.value })}
                      placeholder="Ex: 18' M. Diarra, 54' E. Carvalho"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 font-medium block mb-1">Homme du Match (MVP)</label>
                    <input
                      type="text"
                      value={config.mvpText || ''}
                      onChange={(e) => setConfig({ ...config, mvpText: e.target.value })}
                      placeholder="Ex: Sekou Fofana (Capitaine)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Date, Location, Info */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/80 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Informations Rencontre
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">Date</label>
                  <input
                    type="text"
                    value={config.dateStr}
                    onChange={(e) => setConfig({ ...config, dateStr: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">Coup d'envoi</label>
                  <input
                    type="text"
                    value={config.timeStr}
                    onChange={(e) => setConfig({ ...config, timeStr: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">Stade</label>
                  <input
                    type="text"
                    value={config.stadium}
                    onChange={(e) => setConfig({ ...config, stadium: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">Ville</label>
                  <input
                    type="text"
                    value={config.city}
                    onChange={(e) => setConfig({ ...config, city: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">Compétition / Titre Bannière</label>
                <input
                  type="text"
                  value={config.competition}
                  onChange={(e) => setConfig({ ...config, competition: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">Accès & Buvette (Texte bas)</label>
                <input
                  type="text"
                  value={config.entryFee || ''}
                  onChange={(e) => setConfig({ ...config, entryFee: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>
            </div>

          </div>

          {/* Canvas Live Preview Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-between bg-slate-950/60 p-4 sm:p-6 rounded-2xl border border-slate-800">
            
            {/* Live Canvas Viewport */}
            <div className="w-full flex-1 flex items-center justify-center overflow-hidden min-h-[380px] p-2">
              <div className="relative shadow-2xl rounded-xl overflow-hidden border border-slate-700/60 max-h-[520px] flex items-center justify-center bg-black/40">
                <canvas
                  ref={canvasRef}
                  className="max-h-[500px] w-auto max-w-full object-contain rounded-lg shadow-2xl transition-all"
                  style={{
                    aspectRatio: config.format === 'story' ? '9/16' : (config.format === 'landscape' ? '16/9' : '1/1'),
                  }}
                />
              </div>
            </div>

            {/* Quick Action Bar under Canvas */}
            <div className="w-full mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
              
              <div className="flex items-center space-x-2">
                {/* Download PNG */}
                <button
                  id="download-poster-png-btn"
                  onClick={handleDownloadPNG}
                  className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 transition active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger PNG (HD)</span>
                </button>

                {/* Print / PDF */}
                <button
                  id="print-poster-btn"
                  onClick={handlePrint}
                  className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold px-3 py-2.5 rounded-xl border border-slate-700 transition"
                  title="Imprimer ou enregistrer en PDF"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Imprimer / PDF</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                {/* Copy Instagram Caption */}
                <button
                  id="copy-instagram-caption-btn"
                  onClick={handleCopyCaption}
                  className={`flex items-center space-x-1.5 text-xs sm:text-sm font-semibold px-3 py-2.5 rounded-xl border transition ${
                    copiedCaption
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                      : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
                  }`}
                >
                  {copiedCaption ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCaption ? 'Légende Copiée !' : 'Légende Insta'}</span>
                </button>

                {/* If event linked: Save poster to event */}
                {event && (
                  <button
                    id="save-poster-to-event-btn"
                    onClick={handleSaveToEvent}
                    className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold px-3 py-2.5 rounded-xl shadow-md transition"
                  >
                    <Check className="w-4 h-4" />
                    <span>Lier à l'événement</span>
                  </button>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
