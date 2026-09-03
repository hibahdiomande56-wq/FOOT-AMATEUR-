import { PosterConfig } from '../types';

export function renderPosterToCanvas(
  canvas: HTMLCanvasElement,
  config: PosterConfig,
  scale: number = 1
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Dimensions based on format
  let width = 1080;
  let height = 1080;

  if (config.format === 'story') {
    width = 1080;
    height = 1920;
  } else if (config.format === 'landscape') {
    width = 1920;
    height = 1080;
  }

  canvas.width = width * scale;
  canvas.height = height * scale;

  ctx.save();
  ctx.scale(scale, scale);

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Apply template
  switch (config.template) {
    case 'choc_weekend':
      drawChocWeekendTemplate(ctx, width, height, config);
      break;
    case 'retro_gazette':
      drawRetroGazetteTemplate(ctx, width, height, config);
      break;
    case 'neon_stadium':
      drawNeonStadiumTemplate(ctx, width, height, config);
      break;
    case 'minimal_pro':
      drawMinimalProTemplate(ctx, width, height, config);
      break;
    case 'matchday_dynamic':
    default:
      drawMatchdayDynamicTemplate(ctx, width, height, config);
      break;
  }

  ctx.restore();
}

// Helper: draw nice club shield badge
function drawClubBadge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  primaryColor: string,
  secondaryColor: string,
  clubName: string
) {
  ctx.save();
  ctx.translate(x, y);

  // Drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 10;

  // Shield Path
  ctx.beginPath();
  const w = size;
  const h = size * 1.15;
  ctx.moveTo(-w / 2, -h / 2);
  ctx.lineTo(w / 2, -h / 2);
  ctx.lineTo(w / 2, h * 0.1);
  ctx.bezierCurveTo(w / 2, h * 0.45, 0, h * 0.65, 0, h / 2);
  ctx.bezierCurveTo(0, h * 0.65, -w / 2, h * 0.45, -w / 2, h * 0.1);
  ctx.closePath();

  // Gradient fill
  const grad = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  grad.addColorStop(0, primaryColor);
  grad.addColorStop(1, secondaryColor || '#0f172a');
  ctx.fillStyle = grad;
  ctx.fill();

  // Border
  ctx.shadowColor = 'transparent';
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();

  // Inner subtle border
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.stroke();

  // Soccer ball icon or initials in center
  const initials = clubName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 ${size * 0.36}px 'Bebas Neue', 'Plus Jakarta Sans', sans-serif`;
  ctx.fillText(initials, 0, -h * 0.05);

  // Mini soccer star
  ctx.font = `${size * 0.18}px sans-serif`;
  ctx.fillText('⚽', 0, h * 0.22);

  ctx.restore();
}

// 1. TEMPLATE: MATCHDAY DYNAMIQUE
function drawMatchdayDynamicTemplate(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  cfg: PosterConfig
) {
  // Dark textured background
  const bgGrad = ctx.createRadialGradient(w / 2, h * 0.4, 100, w / 2, h / 2, w * 0.8);
  bgGrad.addColorStop(0, '#1e293b');
  bgGrad.addColorStop(1, '#090d16');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Stadium spotlight beams
  ctx.save();
  const beamGrad = ctx.createLinearGradient(0, 0, w, h * 0.6);
  beamGrad.addColorStop(0, hexToRgba(cfg.homeColor, 0.35));
  beamGrad.addColorStop(0.5, 'transparent');
  beamGrad.addColorStop(1, hexToRgba(cfg.awayColor, 0.35));
  ctx.fillStyle = beamGrad;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  // Angled geometric cutouts
  ctx.save();
  ctx.fillStyle = hexToRgba(cfg.homeColor, 0.15);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(w * 0.55, 0);
  ctx.lineTo(w * 0.35, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = hexToRgba(cfg.awayColor, 0.15);
  ctx.beginPath();
  ctx.moveTo(w, 0);
  ctx.lineTo(w * 0.55, 0);
  ctx.lineTo(w * 0.75, h);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Top competition banner
  const topY = h * 0.06;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#38bdf8';
  ctx.font = "800 24px 'Plus Jakarta Sans', sans-serif";
  ctx.letterSpacing = '4px';
  ctx.fillText((cfg.competition || 'MATCH OFFICIEL').toUpperCase(), w / 2, topY);

  // Main Title (e.g. JOUR DE MATCH or RESULTAT DU MATCH)
  const titleY = h * 0.13;
  ctx.fillStyle = '#ffffff';
  ctx.font = "900 68px 'Bebas Neue', 'Plus Jakarta Sans', sans-serif";
  ctx.letterSpacing = '6px';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 15;
  ctx.fillText(cfg.title.toUpperCase(), w / 2, titleY);
  ctx.shadowColor = 'transparent';

  if (cfg.subtitle) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = "600 20px 'Plus Jakarta Sans', sans-serif";
    ctx.letterSpacing = '1px';
    ctx.fillText(cfg.subtitle, w / 2, titleY + 36);
  }

  // Badges & Teams
  const centerY = cfg.format === 'story' ? h * 0.42 : h * 0.44;
  const badgeSize = w * 0.22;
  const leftX = w * 0.25;
  const rightX = w * 0.75;

  drawClubBadge(ctx, leftX, centerY, badgeSize, cfg.homeColor, '#0f172a', cfg.homeTeam);
  drawClubBadge(ctx, rightX, centerY, badgeSize, cfg.awayColor, '#0f172a', cfg.awayTeam);

  // Center VS or Score
  if (cfg.isResult && cfg.scoreHome !== undefined && cfg.scoreAway !== undefined) {
    // Big Score
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = "900 90px 'Bebas Neue', 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(`${cfg.scoreHome} - ${cfg.scoreAway}`, w / 2, centerY + 10);

    ctx.fillStyle = '#10b981';
    ctx.font = "800 20px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText('SCORE FINAL', w / 2, centerY + 50);
  } else {
    // "VS" Badge
    ctx.beginPath();
    ctx.arc(w / 2, centerY, 42, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#38bdf8';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = "900 38px 'Bebas Neue', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('VS', w / 2, centerY);
  }

  // Club Names
  const nameY = centerY + badgeSize * 0.75;
  ctx.font = "900 32px 'Plus Jakarta Sans', sans-serif";
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';

  wrapText(ctx, cfg.homeTeam.toUpperCase(), leftX, nameY, w * 0.38, 36);
  wrapText(ctx, cfg.awayTeam.toUpperCase(), rightX, nameY, w * 0.38, 36);

  // If match result: Scorers and MVP section
  if (cfg.isResult && (cfg.scorersText || cfg.mvpText)) {
    const resultBoxY = h * 0.62;
    const boxW = w * 0.86;
    const boxH = h * 0.16;
    const boxX = (w - boxW) / 2;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 2;
    roundRect(ctx, boxX, resultBoxY, boxW, boxH, 16);
    ctx.fill();
    ctx.stroke();

    if (cfg.scorersText) {
      ctx.textAlign = 'left';
      ctx.fillStyle = '#38bdf8';
      ctx.font = "800 18px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText('⚽ BUTEURS & ACTIONS :', boxX + 24, resultBoxY + 36);

      ctx.fillStyle = '#f1f5f9';
      ctx.font = "600 20px 'Plus Jakarta Sans', sans-serif";
      wrapText(ctx, cfg.scorersText, boxX + 24, resultBoxY + 68, boxW - 48, 28);
    }

    if (cfg.mvpText) {
      ctx.textAlign = 'left';
      ctx.fillStyle = '#f59e0b';
      ctx.font = "800 18px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(`⭐ HOMME DU MATCH : ${cfg.mvpText}`, boxX + 24, resultBoxY + boxH - 24);
    }
  }

  // Bottom Match Details Card
  const cardY = cfg.isResult ? h * 0.82 : (cfg.format === 'story' ? h * 0.68 : h * 0.72);
  const cardW = w * 0.86;
  const cardH = cfg.format === 'story' ? 260 : 180;
  const cardX = (w - cardW) / 2;

  // Glass card effect
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  roundRect(ctx, cardX, cardY, cardW, cardH, 20);
  ctx.fill();
  ctx.stroke();

  // Date & Time
  ctx.fillStyle = '#f8fafc';
  ctx.font = "800 32px 'Plus Jakarta Sans', sans-serif";
  ctx.textAlign = 'center';
  ctx.fillText(`📅  ${cfg.dateStr}   •   ⏰  ${cfg.timeStr}`, w / 2, cardY + 54);

  // Stadium & City
  ctx.fillStyle = '#94a3b8';
  ctx.font = "600 22px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText(`📍  ${cfg.stadium || 'Stade Municipal'} (${cfg.city || 'Île-de-France'})`, w / 2, cardY + 98);

  // Entry fee / info
  if (cfg.entryFee) {
    ctx.fillStyle = '#38bdf8';
    ctx.font = "700 18px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(`🎟️  ${cfg.entryFee}`, w / 2, cardY + 138);
  }

  // Footer / Sponsors
  const footerY = h - (cfg.format === 'story' ? 60 : 36);
  ctx.fillStyle = '#64748b';
  ctx.font = "500 16px 'Plus Jakarta Sans', sans-serif";
  ctx.textAlign = 'center';
  ctx.fillText(
    cfg.sponsorText || 'FootAmateur Studio • Propulsé par le football amateur',
    w / 2,
    footerY
  );
}

// 2. TEMPLATE: CHOC DU WEEKEND (Dark Arena & Split Glow)
function drawChocWeekendTemplate(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  cfg: PosterConfig
) {
  // Deep dark pitch background
  ctx.fillStyle = '#060a10';
  ctx.fillRect(0, 0, w, h);

  // Left vs Right Dual Glow
  const leftGlow = ctx.createRadialGradient(0, h * 0.45, 50, 0, h * 0.45, w * 0.7);
  leftGlow.addColorStop(0, hexToRgba(cfg.homeColor, 0.4));
  leftGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = leftGlow;
  ctx.fillRect(0, 0, w / 2, h);

  const rightGlow = ctx.createRadialGradient(w, h * 0.45, 50, w, h * 0.45, w * 0.7);
  rightGlow.addColorStop(0, hexToRgba(cfg.awayColor, 0.4));
  rightGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = rightGlow;
  ctx.fillRect(w / 2, 0, w / 2, h);

  // Golden Frame
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
  ctx.lineWidth = 4;
  ctx.strokeRect(36, 36, w - 72, h - 72);

  // Header
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f59e0b';
  ctx.font = "900 24px 'Plus Jakarta Sans', sans-serif";
  ctx.letterSpacing = '8px';
  ctx.fillText('LE CHOC DU WEEK-END', w / 2, h * 0.09);

  // Match Title
  ctx.fillStyle = '#ffffff';
  ctx.font = "900 64px 'Bebas Neue', 'Plus Jakarta Sans', sans-serif";
  ctx.letterSpacing = '4px';
  ctx.fillText(cfg.title.toUpperCase(), w / 2, h * 0.16);

  const centerY = h * 0.42;
  const badgeSize = w * 0.23;

  drawClubBadge(ctx, w * 0.26, centerY, badgeSize, cfg.homeColor, '#0f172a', cfg.homeTeam);
  drawClubBadge(ctx, w * 0.74, centerY, badgeSize, cfg.awayColor, '#0f172a', cfg.awayTeam);

  // Score or VS
  if (cfg.isResult && cfg.scoreHome !== undefined && cfg.scoreAway !== undefined) {
    ctx.fillStyle = '#ffffff';
    ctx.font = "900 86px 'Bebas Neue', sans-serif";
    ctx.fillText(`${cfg.scoreHome} - ${cfg.scoreAway}`, w / 2, centerY + 10);
  } else {
    ctx.fillStyle = '#f59e0b';
    ctx.font = "900 52px 'Bebas Neue', sans-serif";
    ctx.fillText('VS', w / 2, centerY + 10);
  }

  // Names
  ctx.fillStyle = '#ffffff';
  ctx.font = "800 30px 'Plus Jakarta Sans', sans-serif";
  wrapText(ctx, cfg.homeTeam, w * 0.26, centerY + badgeSize * 0.72, w * 0.4, 34);
  wrapText(ctx, cfg.awayTeam, w * 0.74, centerY + badgeSize * 0.72, w * 0.4, 34);

  // Details
  const boxY = h * 0.72;
  ctx.fillStyle = '#f8fafc';
  ctx.font = "800 28px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText(`🗓️  ${cfg.dateStr}   •   ⏰  ${cfg.timeStr}`, w / 2, boxY);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = "600 22px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText(`📍 ${cfg.stadium} - ${cfg.city}`, w / 2, boxY + 44);

  if (cfg.entryFee) {
    ctx.fillStyle = '#f59e0b';
    ctx.font = "700 18px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(cfg.entryFee, w / 2, boxY + 84);
  }
}

// 3. TEMPLATE: RETRO GAZETTE (Vintage Sports Newspaper)
function drawRetroGazetteTemplate(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  cfg: PosterConfig
) {
  // Kraft / Vintage off-white background
  ctx.fillStyle = '#fcf8ee';
  ctx.fillRect(0, 0, w, h);

  // Vintage double border
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 6;
  ctx.strokeRect(30, 30, w - 60, h - 60);
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, w - 80, h - 80);

  // Newspaper Header
  ctx.textAlign = 'center';
  ctx.fillStyle = '#0f172a';
  ctx.font = "900 20px 'Times New Roman', serif";
  ctx.letterSpacing = '6px';
  ctx.fillText('ÉDITION SPÉCIALE • LA GAZETTE DU FOOTBALL AMATEUR', w / 2, 80);

  // Thick line
  ctx.beginPath();
  ctx.moveTo(60, 95);
  ctx.lineTo(w - 60, 95);
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#0f172a';
  ctx.stroke();

  // Big Headline
  ctx.font = "900 76px 'Times New Roman', serif";
  ctx.fillText(cfg.title.toUpperCase(), w / 2, 175);

  ctx.font = "italic 600 22px 'Times New Roman', serif";
  ctx.fillText(cfg.subtitle || cfg.competition || 'LE RENDEZ-VOUS SPORTIF À NE PAS MANQUER', w / 2, 215);

  // Horizontal divider
  ctx.beginPath();
  ctx.moveTo(60, 235);
  ctx.lineTo(w - 60, 235);
  ctx.lineWidth = 2;
  ctx.stroke();

  // Badges & Teams
  const centerY = h * 0.46;
  const badgeSize = w * 0.22;

  drawClubBadge(ctx, w * 0.26, centerY, badgeSize, cfg.homeColor, '#334155', cfg.homeTeam);
  drawClubBadge(ctx, w * 0.74, centerY, badgeSize, cfg.awayColor, '#334155', cfg.awayTeam);

  ctx.fillStyle = '#0f172a';
  if (cfg.isResult && cfg.scoreHome !== undefined && cfg.scoreAway !== undefined) {
    ctx.font = "900 84px 'Times New Roman', serif";
    ctx.fillText(`${cfg.scoreHome} - ${cfg.scoreAway}`, w / 2, centerY + 10);
  } else {
    ctx.font = "italic 900 48px 'Times New Roman', serif";
    ctx.fillText('CONTRE', w / 2, centerY + 10);
  }

  // Club Names in Serif
  ctx.font = "900 28px 'Times New Roman', serif";
  wrapText(ctx, cfg.homeTeam, w * 0.26, centerY + badgeSize * 0.75, w * 0.4, 32);
  wrapText(ctx, cfg.awayTeam, w * 0.74, centerY + badgeSize * 0.75, w * 0.4, 32);

  // Gazette Article Box
  const boxY = h * 0.74;
  ctx.fillStyle = '#0f172a';
  ctx.font = "900 26px 'Times New Roman', serif";
  ctx.fillText(`LE RENDEZ-VOUS : ${cfg.dateStr.toUpperCase()} À ${cfg.timeStr}`, w / 2, boxY);

  ctx.font = "italic 22px 'Times New Roman', serif";
  ctx.fillText(`Au ${cfg.stadium}, ${cfg.city}`, w / 2, boxY + 40);

  if (cfg.entryFee) {
    ctx.font = "600 18px 'Times New Roman', serif";
    ctx.fillText(cfg.entryFee, w / 2, boxY + 75);
  }
}

// 4. TEMPLATE: NEON STADIUM (Cyber Glow & High Impact)
function drawNeonStadiumTemplate(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  cfg: PosterConfig
) {
  // Midnight navy
  ctx.fillStyle = '#030712';
  ctx.fillRect(0, 0, w, h);

  // Electric grid floor effect
  ctx.save();
  ctx.strokeStyle = 'rgba(14, 165, 233, 0.15)';
  ctx.lineWidth = 1;
  const gridStep = 40;
  for (let x = 0; x < w; x += gridStep) {
    ctx.beginPath();
    ctx.moveTo(x, h * 0.6);
    ctx.lineTo(x + (x - w / 2) * 1.5, h);
    ctx.stroke();
  }
  for (let y = h * 0.6; y < h; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.restore();

  // Neon Title
  ctx.textAlign = 'center';
  ctx.fillStyle = '#38bdf8';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 25;
  ctx.font = "900 70px 'Bebas Neue', sans-serif";
  ctx.letterSpacing = '6px';
  ctx.fillText(cfg.title.toUpperCase(), w / 2, h * 0.14);
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#e2e8f0';
  ctx.font = "700 20px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText((cfg.competition || 'FOOTBALL AMATEUR').toUpperCase(), w / 2, h * 0.19);

  const centerY = h * 0.44;
  const badgeSize = w * 0.22;

  drawClubBadge(ctx, w * 0.25, centerY, badgeSize, cfg.homeColor, '#0f172a', cfg.homeTeam);
  drawClubBadge(ctx, w * 0.75, centerY, badgeSize, cfg.awayColor, '#0f172a', cfg.awayTeam);

  ctx.fillStyle = '#ffffff';
  if (cfg.isResult && cfg.scoreHome !== undefined && cfg.scoreAway !== undefined) {
    ctx.font = "900 84px 'Bebas Neue', sans-serif";
    ctx.fillText(`${cfg.scoreHome} - ${cfg.scoreAway}`, w / 2, centerY + 10);
  } else {
    ctx.font = "900 48px 'Bebas Neue', sans-serif";
    ctx.fillText('⚡ VS ⚡', w / 2, centerY + 10);
  }

  // Names
  ctx.fillStyle = '#ffffff';
  ctx.font = "800 28px 'Plus Jakarta Sans', sans-serif";
  wrapText(ctx, cfg.homeTeam, w * 0.25, centerY + badgeSize * 0.75, w * 0.4, 32);
  wrapText(ctx, cfg.awayTeam, w * 0.75, centerY + badgeSize * 0.75, w * 0.4, 32);

  // Bottom Box
  const bY = h * 0.75;
  ctx.fillStyle = '#38bdf8';
  ctx.font = "800 30px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText(`⚡ ${cfg.dateStr.toUpperCase()}  |  ${cfg.timeStr} ⚡`, w / 2, bY);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = "600 22px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText(`${cfg.stadium} • ${cfg.city}`, w / 2, bY + 42);
}

// 5. TEMPLATE: MINIMAL PRO (Sleek High Fashion Sports Studio)
function drawMinimalProTemplate(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  cfg: PosterConfig
) {
  // Pure modern slate
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // Clean border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, w - 80, h - 80);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#94a3b8';
  ctx.font = "700 18px 'Plus Jakarta Sans', sans-serif";
  ctx.letterSpacing = '3px';
  ctx.fillText(cfg.competition.toUpperCase(), 80, 100);

  ctx.fillStyle = '#ffffff';
  ctx.font = "900 64px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText(cfg.title.toUpperCase(), 80, 175);

  const centerY = h * 0.46;
  const badgeSize = w * 0.22;

  drawClubBadge(ctx, w * 0.3, centerY, badgeSize, cfg.homeColor, '#1e293b', cfg.homeTeam);
  drawClubBadge(ctx, w * 0.7, centerY, badgeSize, cfg.awayColor, '#1e293b', cfg.awayTeam);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  if (cfg.isResult && cfg.scoreHome !== undefined && cfg.scoreAway !== undefined) {
    ctx.font = "900 80px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(`${cfg.scoreHome} — ${cfg.scoreAway}`, w / 2, centerY + 10);
  } else {
    ctx.font = "700 32px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText('VS', w / 2, centerY + 10);
  }

  // Names
  ctx.font = "800 28px 'Plus Jakarta Sans', sans-serif";
  wrapText(ctx, cfg.homeTeam, w * 0.3, centerY + badgeSize * 0.75, w * 0.35, 34);
  wrapText(ctx, cfg.awayTeam, w * 0.7, centerY + badgeSize * 0.75, w * 0.35, 34);

  // Footer
  ctx.textAlign = 'left';
  ctx.fillStyle = '#38bdf8';
  ctx.font = "800 26px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText(`DATE & HEURE : ${cfg.dateStr} • ${cfg.timeStr}`, 80, h * 0.82);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = "600 22px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText(`LIEU : ${cfg.stadium}, ${cfg.city}`, 80, h * 0.87);
}

// Utilities
function hexToRgba(hex: string, alpha: number = 1): string {
  if (!hex) return `rgba(14, 165, 233, ${alpha})`;
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}

export function downloadCanvasAsImage(canvas: HTMLCanvasElement, filename: string): void {
  const link = document.createElement('a');
  link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
