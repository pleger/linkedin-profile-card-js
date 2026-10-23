/*
 * LinkedIn Profile Card v2.0.0
 * A standalone, customizable profile link card (unofficial; not affiliated with LinkedIn).
 * MIT License. No dependencies, API keys, trackers, or LinkedIn scripts.
 */
(function () {
  'use strict';

  const DEFAULTS = Object.freeze({
    name: '',
    role: '',
    affiliation: '',
    eyebrow: 'Professional network',
    actionText: 'View LinkedIn profile',
    profileUrl: '',
    logoUrl: '',
    cardWidth: '690px',
    cardPadding: '25px',
    affiliationFontSize: '14px',
    background: 'geometric', // geometric | white | transparent | color | svg
    backgroundColor: '#f0f8ff',
    backgroundSvgUrl: '',      // absolute or relative URL to a .svg image
    backgroundSvg: '',         // optional raw SVG string via JavaScript config
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    textColor: '#162e45',
    mutedColor: '#4d7087',
    accentColor: '#0a66c2',
    eyebrowColor: '', // optional, independent from button color
    borderColor: '#a9cee1',
    shadow: true
  });

  const GEOMETRIC_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="350" viewBox="0 0 1100 350"><g fill="none" stroke="#629fc4" stroke-width="1.2" opacity=".38"><path d="M0 0 135 0 210 82 140 168 18 129 0 52M0 0 76 65 18 129 0 235M135 0 76 65 140 168 210 82 294 0M140 168 58 250 0 235M58 250 140 168 210 262 132 350M0 350 58 250 132 350"/><path d="M1100 0 1005 0 950 88 1025 164 1100 112M1005 0 1025 164 1100 12M950 88 874 10 788 72 852 176 1025 164M852 176 802 282 955 350 1025 164 1100 229M1100 350 955 350 1100 229M802 282 722 350"/></g></svg>`;

  const STYLES = `
    :host { display: block; width: 100%; }
    *, *::before, *::after { box-sizing: border-box; }
    .card {
      display: block; position: relative; overflow: hidden;
      width: 100%; max-width: var(--card-width, 690px);
      min-height: 185px; margin: 0 auto;
      padding: var(--card-padding, 25px);
      background-color: transparent;
      border: 1px solid var(--border-color, #a9cee1);
      border-radius: 22px;
      color: var(--text-color, #162e45);
      text-decoration: none;
      font-family: Arial, Helvetica, sans-serif;
      box-shadow: var(--card-shadow, 0 13px 32px #1c506f1f);
      transition: transform .22s ease, box-shadow .22s ease;
    }
    .card:hover {
      transform: translateY(-3px);
      box-shadow: var(--card-shadow-hover, 0 18px 40px #1c506f30);
    }
    .card:focus-visible {
      outline: 3px solid var(--accent-color, #0a66c2);
      outline-offset: 3px;
    }
    .content { display: flex; align-items: center; gap: 25px; min-height: 130px; }
    .avatar {
      flex: 0 0 112px; width: 112px; height: 112px; padding: 14px;
      display: grid; place-items: center;
      border-radius: 24px; background: #ffffffd9;
      border: 1px solid #bfd7e4; box-shadow: 0 6px 20px #20557419;
      color: #263d52; font-size: 30px; font-weight: 700;
    }
    .avatar img { display: block; width: 100%; height: 100%; object-fit: contain; }
    .body { flex: 1; min-width: 0; }
    .eyebrow {
      font-size: 11px; font-weight: 800; letter-spacing: .14em;
      text-transform: uppercase; color: var(--eyebrow-color, var(--accent-color, #0a66c2));
    }
    .eyebrow::before { content: '●'; margin-right: 8px; }
    h3 {
      margin: 11px 0 6px; color: inherit;
      font-size: clamp(24px, 3.4vw, 32px);
      font-weight: 700; line-height: 1.15; letter-spacing: -.03em;
    }
    .role { margin: 0; font-size: 15px; line-height: 1.4; color: var(--muted-color, #4d7087); }
    .footer {
      display: flex; align-items: center; flex-wrap: wrap;
      gap: 12px; margin-top: 17px;
    }
    .affiliation {
      font-size: var(--affiliation-size, 14px);
      color: var(--muted-color, #4d7087); line-height: 1.5;
    }
    .action {
      display: inline-flex; align-items: center; gap: 9px;
      margin-left: auto; padding: 10px 14px;
      border-radius: 100px; background: var(--accent-color, #0a66c2);
      color: white; font-size: 12px; font-weight: 700;
      white-space: normal; text-align: center;
    }
    .action .mark {
      display: inline-grid; place-items: center;
      flex: 0 0 22px; width: 22px; height: 22px;
      border-radius: 4px; background: #fff;
      color: var(--accent-color, #0a66c2);
      font-size: 15px; font-weight: 900;
    }
    @media (max-width: 660px) {
      .card { min-height: 0; }
      .content { align-items: flex-start; gap: 18px; }
      .avatar { flex-basis: 82px; width: 82px; height: 82px; padding: 10px; }
      .action { margin-left: 0; }
    }
    @media (max-width: 430px) {
      .content { display: block; }
      .avatar { margin-bottom: 15px; }
    }
    @media (prefers-reduced-motion: reduce) {
      .card { transition: none; }
      .card:hover { transform: none; }
    }
  `;

  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  function cssLength(value, fallback) {
    const s = String(value ?? '').trim();
    return /^(?:\d+(?:\.\d+)?)(?:px|rem|em|%)$/.test(s) ? s : fallback;
  }

  function color(value, fallback) {
    const s = String(value ?? '').trim();
    return s && window.CSS && CSS.supports('color', s) ? s : fallback;
  }

  function webUrl(value) {
    if (!value) return '';
    try {
      const url = new URL(String(value), document.baseURI);
      return /^https?:$/.test(url.protocol) ? url.href : '';
    } catch (_) {
      return '';
    }
  }

  function cssUrl(url) {
    return 'url(' + JSON.stringify(url) + ')';
  }

  function initials(name) {
    return String(name).trim().split(/\s+/).slice(0, 2)
      .map(p => Array.from(p)[0]?.toLocaleUpperCase() || '').join('') || '?';
  }

  function setBackground(card, options) {
    const mode = String(options.background || 'geometric').toLowerCase();
    const fallback = color(options.backgroundColor, '#f0f8ff');
    if (mode === 'white') {
      card.style.backgroundColor = '#ffffff';
    } else if (mode === 'transparent') {
      card.style.backgroundColor = 'transparent';
    } else if (mode === 'color') {
      card.style.backgroundColor = fallback;
    } else if (mode === 'svg' || mode === 'image') {
      card.style.backgroundColor = fallback;
      const svg = String(options.backgroundSvg || '').trim();
      const uri = svg.startsWith('<svg') && svg.includes('</svg>')
        ? 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
        : webUrl(options.backgroundSvgUrl);
      if (uri) {
        card.style.backgroundImage = cssUrl(uri);
        card.style.backgroundRepeat = 'no-repeat';
        card.style.backgroundSize = options.backgroundSize || 'cover';
        card.style.backgroundPosition = options.backgroundPosition || 'center';
      } else {
        console.warn('[LinkedInProfileCard] SVG background requires backgroundSvgUrl or backgroundSvg.');
      }
    } else { // default: geometric
      const uri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(GEOMETRIC_SVG);
      card.style.backgroundColor = '#e5f3fc';
      card.style.backgroundImage = [
        cssUrl(uri),
        'radial-gradient(ellipse at 45% 0, #fff, transparent 65%)',
        'linear-gradient(110deg, #dceefa, #fafdff 52%, #d5ebf8)'
      ].join(', ');
      card.style.backgroundSize = 'cover';
      card.style.backgroundPosition = 'center';
    }
  }

  function init(options = {}) {
    const target = typeof options.target === 'string'
      ? document.querySelector(options.target) : options.target;
    if (!target) return null;

    const c = Object.assign({}, DEFAULTS, options);
    const href = webUrl(c.profileUrl);
    if (!c.name || !href) {
      console.warn('[LinkedInProfileCard] Add a name and an HTTP(S) profileUrl.');
      return null;
    }

    const root = target.shadowRoot || target.attachShadow({ mode: 'open' });
    const style = el('style');
    style.textContent = STYLES;

    const card = el('a', 'card');
    card.href = href;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.setAttribute('aria-label', 'Open LinkedIn profile: ' + c.name);
    card.style.setProperty('--card-width', cssLength(c.cardWidth, '690px'));
    card.style.setProperty('--card-padding', cssLength(c.cardPadding, '25px'));
    card.style.setProperty('--affiliation-size', cssLength(c.affiliationFontSize, '14px'));
    card.style.setProperty('--text-color', color(c.textColor, DEFAULTS.textColor));
    card.style.setProperty('--muted-color', color(c.mutedColor, DEFAULTS.mutedColor));
    card.style.setProperty('--accent-color', color(c.accentColor, DEFAULTS.accentColor));
    card.style.setProperty('--eyebrow-color', color(c.eyebrowColor, color(c.accentColor, DEFAULTS.accentColor)));
    card.style.setProperty('--border-color', color(c.borderColor, DEFAULTS.borderColor));
    if (c.shadow === false || c.shadow === 'false') {
      card.style.setProperty('--card-shadow', 'none');
      card.style.setProperty('--card-shadow-hover', 'none');
    }
    setBackground(card, c);

    const content = el('div', 'content');
    const avatar = el('div', 'avatar');
    const mark = initials(c.name);
    if (c.logoUrl && webUrl(c.logoUrl)) {
      const img = el('img');
      img.src = webUrl(c.logoUrl);
      img.alt = '';
      img.loading = 'lazy';
      img.onerror = () => { avatar.replaceChildren(document.createTextNode(mark)); };
      avatar.append(img);
    } else {
      avatar.textContent = mark;
    }

    const body = el('div', 'body');
    if (c.eyebrow) body.append(el('div', 'eyebrow', c.eyebrow));
    body.append(el('h3', '', c.name));
    if (c.role) body.append(el('p', 'role', c.role));
    const footer = el('div', 'footer');
    if (c.affiliation) footer.append(el('span', 'affiliation', c.affiliation));
    const action = el('span', 'action');
    action.append(el('span', 'mark', 'in'), el('span', '', c.actionText), el('span', '', '↗'));
    footer.append(action);
    body.append(footer);
    content.append(avatar, body);
    card.append(content);
    root.replaceChildren(style, card);
    return card;
  }

  function autoInit() {
    document.querySelectorAll('[data-linkedin-card], [data-pleger-linkedin-card]')
      .forEach(target => {
        if (target.shadowRoot) return;
        const d = target.dataset;
        init({
          target,
          name: d.name || '',
          role: d.role || '',
          affiliation: d.affiliation || '',
          eyebrow: d.eyebrow ?? DEFAULTS.eyebrow,
          actionText: d.actionText || DEFAULTS.actionText,
          profileUrl: d.profileUrl || '',
          logoUrl: d.logoUrl || '',
          cardWidth: d.cardWidth || DEFAULTS.cardWidth,
          cardPadding: d.cardPadding || DEFAULTS.cardPadding,
          affiliationFontSize: d.affiliationFontSize || DEFAULTS.affiliationFontSize,
          background: d.background || DEFAULTS.background,
          backgroundColor: d.backgroundColor || DEFAULTS.backgroundColor,
          backgroundSvgUrl: d.backgroundSvgUrl || '',
          backgroundSize: d.backgroundSize || DEFAULTS.backgroundSize,
          backgroundPosition: d.backgroundPosition || DEFAULTS.backgroundPosition,
          textColor: d.textColor || DEFAULTS.textColor,
          mutedColor: d.mutedColor || DEFAULTS.mutedColor,
          accentColor: d.accentColor || DEFAULTS.accentColor,
          eyebrowColor: d.eyebrowColor || DEFAULTS.eyebrowColor,
          borderColor: d.borderColor || DEFAULTS.borderColor,
          shadow: d.shadow ?? DEFAULTS.shadow
        });
      });
  }

  window.LinkedInProfileCard = { init, autoInit, version: '2.0.0' };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit, { once: true });
  } else {
    autoInit();
  }
})();
