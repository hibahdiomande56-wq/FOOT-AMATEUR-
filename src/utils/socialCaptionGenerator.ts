import { FootballEvent, MatchSummary, Club } from '../types';

export function generateMatchdayCaption(event: FootballEvent, club?: Club): string {
  const hashtags = `#FootballAmateur #${cleanTag(club?.name || 'Football')} #${cleanTag(event.category || 'Foot')} #Matchday #JourDeMatch #FFF #PassionFoot`;

  return `🔴 JOUR DE MATCH ! ⚽🔥

${event.title}
🏆 ${event.competitionName || 'Match Amical'}
📍 ${event.stadium}, ${event.city}
⏰ Coup d'envoi à ${event.time}
📅 ${event.date}

Nos joueurs comptent sur votre soutien en tribune pour porter haut les couleurs du club ! 🙌💙
Buvette et ambiance conviviale au rendez-vous.

Venez nombreux encourager l'équipe ! 📣

${hashtags}`;
}

export function generateSummaryCaption(
  event: FootballEvent,
  summary: MatchSummary,
  club?: Club
): string {
  const isVictory = summary.scoreHome > summary.scoreAway;
  const isDraw = summary.scoreHome === summary.scoreAway;
  const statusEmoji = isVictory ? '✅ VICTOIRE !' : (isDraw ? '🤝 MATCH NUL' : '⏱️ FIN DU MATCH');

  const scorersList = summary.scorers.length > 0
    ? summary.scorers
        .map(s => `⚽ ${s.minute}' ${s.playerName}${s.isPenalty ? ' (sp)' : ''}`)
        .join('\n')
    : 'Aucun but inscrit.';

  const coachWord = summary.coachQuote ? `\n\n💬 Le mot du coach :\n"${summary.coachQuote}"` : '';
  const mvp = summary.mvpPlayerName ? `\n⭐ Homme du match : ${summary.mvpPlayerName}` : '';

  const hashtags = `#ResultatMatch #ScoreFinal #FootballAmateur #${cleanTag(club?.name || 'Football')} #Victoire #TeamFoot`;

  return `${statusEmoji} 🏁

${event.title}
Score final : ${summary.scoreHome} - ${summary.scoreAway}

${scorersList}${mvp}${coachWord}

Merci aux supporters présents pour l'ambiance et aux bénévoles pour l'organisation ! Prochain rendez-vous le week-end prochain.

${hashtags}`;
}

export function generateTournamentCaption(event: FootballEvent, club?: Club): string {
  return `🏆 GRAND TOURNOI DE FOOTBALL ! ⚽

${event.title}
📅 ${event.date} à partir de ${event.time}
📍 ${event.stadium}, ${event.city}
👥 ${event.teamsCount || 16} équipes engagées
🎁 ${event.dotation || 'Trophées & médailles'}
🍔 ${event.cateringInfo || 'Restauration & buvette sur place'}

Une journée 100% football, esprit sportif et festivités pour nos jeunes et amateurs !
Entrée libre, venez nombreux !

#TournoiFoot #FootballAmateur #${cleanTag(club?.name || 'Foot')} #PassionJeunes #FFF`;
}

export function generatePlateauCaption(event: FootballEvent, club?: Club): string {
  return `🌱 PLATEAU JEUNES ${event.ageCategory || 'U9/U11'} ! ⚽👦👧

${event.title}
📅 ${event.date} • Rendez-vous dès ${event.time}
📍 ${event.stadium}, ${event.city}
🏟️ ${event.pitchesCount || 4} terrains aménagés
🤝 Clubs invités : ${(event.participatingClubs || []).join(', ')}

Encourageons la relève et le beau jeu ! Respect, plaisir et fair-play au cœur de la matinée.

#PlateauFoot #EcoleDeFoot #FootballAmateur #JeunesTalents #FFF`;
}

function cleanTag(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, '');
}
