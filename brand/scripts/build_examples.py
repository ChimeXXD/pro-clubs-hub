"""Generate the HTML product examples in /examples from shared partials.
All pages use only tokens/tokens.css + css/pitchside.css. Content is sample data.
    python3 scripts/build_examples.py
"""
import os, re

ROOT = os.path.join(os.path.dirname(__file__), '..')
OUT = os.path.join(ROOT, 'examples')
os.makedirs(OUT, exist_ok=True)

SPRITE = open(os.path.join(ROOT, 'icons/sprite.svg')).read().replace('style="display:none"', 'style="display:none" aria-hidden="true"')
LOGO = open(os.path.join(ROOT, 'logo/horizontal/pitchside-logo-horizontal-on-dark.svg')).read()


def icon(name, cls='ps-icon'):
    return f'<svg class="{cls}" aria-hidden="true"><use href="#i-{name}"/></svg>'


def logo_inline(height=22):
    svg = re.sub(r'width="[^"]+" height="[^"]+"', f'height="{height}" style="width:auto;height:{height}px"', LOGO, count=1)
    svg = svg.replace('role="img" aria-labelledby="t"', 'class="ps-logo" role="img" aria-label="Pitchside"').replace('<title id="t">Pitchside</title>', '')
    return svg.replace('#F6F6EE', 'currentColor')   # takes the theme's text colour


def rating(v):
    return 'r-elite' if v >= 90 else 'r-great' if v >= 80 else 'r-good' if v >= 70 else 'r-average' if v >= 60 else 'r-low'


def nav(active=''):
    links = [('Builds', 'builds.html'), ('Archetypes', 'archetype.html'), ('Faces', 'face-guide.html'), ('Compare', '#')]
    items = ''.join(f'<li><a class="ps-nav__link" href="{h}"{" aria-current=\"page\"" if n == active else ""}>{n}</a></li>' for n, h in links)
    return f'''<header class="ps-nav">
  <div class="ps-container ps-nav__inner">
    <a class="ps-nav__logo" href="index.html" aria-label="Pitchside home">{logo_inline()}</a>
    <ul class="ps-nav__links">{items}</ul>
    <div class="ps-nav__actions">
      <button class="ps-btn ps-btn--ghost ps-btn--icon ps-btn--sm" aria-label="Search">{icon('search')}</button>
      <a class="ps-btn ps-btn--primary ps-btn--sm" href="builds.html">New build</a>
      <button class="ps-btn ps-btn--ghost ps-btn--icon ps-btn--sm ps-theme-toggle" data-theme-toggle aria-label="Switch to light mode">{icon('sun')}{icon('moon')}</button>
      <span class="ps-avatar" aria-label="Your profile">SA</span>
    </div>
  </div>
</header>'''


FOOTER = f'''<footer class="ps-footer">
  <div class="ps-container ps-footer__inner">
    <div class="ps-stack" style="gap:12px">{logo_inline(18)}<span class="ps-caption">Independent companion for Pro Clubs players. Not affiliated with EA.</span></div>
    <nav class="ps-footer__links" aria-label="Design system">
      <a href="components.html">Components</a><a href="mobile.html">Mobile</a><a href="brand.html">Brand</a><a href="../README.md">Asset package</a>
    </nav>
  </div>
</footer>'''


def page(name, title, body, active='', extra_css=''):
    html = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<link rel="icon" href="../favicon/favicon.svg" type="image/svg+xml">
<link rel="icon" href="../favicon/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="../favicon/apple-touch-icon.png">
<meta name="theme-color" content="#0D1F17">
<script>/* Theme before paint: ?theme=light|dark, else the saved choice, else dark. */
(function(){{var q=new URLSearchParams(location.search).get('theme'),t=null;try{{t=localStorage.getItem('ps-theme')}}catch(e){{}}
var v=q||t;if(v==='light')document.documentElement.dataset.theme='light';}})();</script>
<link rel="stylesheet" href="../tokens/tokens.css">
<link rel="stylesheet" href="../css/pitchside.css">
{f"<style>{extra_css}</style>" if extra_css else ""}
</head>
<body>
{SPRITE}
{nav(active) if active is not None else ""}
{body}
{FOOTER if active is not None else ""}
<script>{{ const b=document.querySelector('[data-theme-toggle]'); const h=document.documentElement;
const sync=()=>{{const l=h.dataset.theme==='light'; if(b) b.setAttribute('aria-label', l?'Switch to dark mode':'Switch to light mode'); document.querySelector('meta[name=theme-color]').content=l?'#F6F6EE':'#0D1F17';}};
if(b) b.addEventListener('click',()=>{{ if(h.dataset.theme==='light') delete h.dataset.theme; else h.dataset.theme='light'; try{{localStorage.setItem('ps-theme', h.dataset.theme||'dark')}}catch(e){{}} sync(); }}); sync(); }}</script>
</body>
</html>
'''
    open(os.path.join(OUT, name), 'w').write(html)
    print('examples/' + name)


# ---------------- Sample data ----------------
BUILDS = [
    dict(name='Pacey Inside Forward', pos='LW', arch='Wide Threat', h='175 cm', w='68 kg', ovr=88, likes='2.4k', meta=True,
         attrs=[('Acceleration', 95), ('Sprint Speed', 92), ('Dribbling', 90), ('Finishing', 84), ('Agility', 93), ('Strength', 58)]),
    dict(name='Box-to-Box Engine', pos='CM', arch='Engine', h='183 cm', w='78 kg', ovr=86, likes='1.9k', meta=True,
         attrs=[('Stamina', 96), ('Short Passing', 88), ('Interceptions', 82), ('Long Shots', 79), ('Strength', 81), ('Agility', 72)]),
    dict(name='Ball-Playing Centre-Back', pos='CB', arch='Stopper', h='191 cm', w='84 kg', ovr=85, likes='1.3k', meta=False,
         attrs=[('Standing Tackle', 91), ('Defensive Aware.', 89), ('Strength', 90), ('Long Passing', 80), ('Sprint Speed', 74), ('Agility', 55)]),
    dict(name='Target Striker', pos='ST', arch='Finisher', h='188 cm', w='82 kg', ovr=87, likes='3.1k', meta=True,
         attrs=[('Finishing', 94), ('Heading Acc.', 91), ('Shot Power', 90), ('Strength', 89), ('Acceleration', 71), ('Dribbling', 74)]),
    dict(name='Deep-Lying Playmaker', pos='CDM', arch='Playmaker', h='180 cm', w='74 kg', ovr=84, likes='980', meta=False,
         attrs=[('Vision', 92), ('Long Passing', 91), ('Short Passing', 90), ('Composure', 88), ('Interceptions', 77), ('Sprint Speed', 63)]),
    dict(name='Overlapping Full-Back', pos='LB', arch='Wide Threat', h='178 cm', w='70 kg', ovr=83, likes='740', meta=False,
         attrs=[('Sprint Speed', 93), ('Stamina', 92), ('Crossing', 85), ('Standing Tackle', 78), ('Agility', 84), ('Heading Acc.', 52)]),
]

ARCHETYPES = [
    ('Finisher', 'Lives in the box. Built for clean contact and first-time shots.', [70, 92, 64, 78, 32, 80], [1, 5]),
    ('Engine', 'Covers every blade of grass and keeps the press alive.', [76, 70, 82, 74, 72, 84], [2, 5]),
    ('Playmaker', 'Sees the pass before it exists. Dictates tempo from deep.', [62, 68, 94, 82, 60, 66], [2, 3]),
    ('Stopper', 'Wins the duel, wins the header, starts the move.', [68, 40, 70, 58, 92, 88], [4, 5]),
]
CATS = ['PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY']


def build_card(b, href='#'):
    attrs = ''.join(f'''<div class="ps-attr {rating(v)}"><span class="ps-attr__label">{n}</span><span class="ps-attr__value">{v}</span><span class="ps-attr__bar"><i style="--v:{v}"></i></span></div>''' for n, v in b['attrs'][:4])
    meta = '<span class="ps-badge ps-badge--meta"><span class="ps-dot"></span>Meta</span>' if b['meta'] else ''
    return f'''<article class="ps-card ps-card--interactive ps-build-card">
  <div class="ps-build-card__head">
    <div>
      <div class="ps-row" style="gap:8px"><span class="ps-tag">{b['pos']}</span>{meta}</div>
      <h3 class="ps-build-card__title"><a href="{href}" style="text-decoration:none">{b['name']}</a></h3>
      <div class="ps-build-card__meta"><span>{b['arch']}</span><span>{b['h']}</span><span>{b['w']}</span></div>
    </div>
    <div class="ps-build-card__ovr"><span class="ps-stat-lg ps-num">{b['ovr']}</span><span class="ps-overline">OVR</span></div>
  </div>
  <div class="ps-build-card__attrs">{attrs}</div>
  <div class="ps-build-card__foot">
    <span class="ps-row" style="gap:6px">{icon('heart', 'ps-icon ps-icon--sm')}<span class="ps-num">{b['likes']}</span></span>
    <span class="ps-actions">
      <button class="ps-btn ps-btn--ghost ps-btn--icon ps-btn--sm" aria-label="Save build">{icon('save', 'ps-icon ps-icon--sm')}</button>
      <button class="ps-btn ps-btn--ghost ps-btn--icon ps-btn--sm" aria-label="Share build">{icon('share', 'ps-icon ps-icon--sm')}</button>
    </span>
  </div>
</article>'''


def archetype_card(a):
    name, desc, vals, key = a
    bars = ''.join(f'<i style="--v:{v}"{" class=\"is-key\"" if i in key else ""}></i>' for i, v in enumerate(vals))
    labels = ''.join(f'<span>{c}</span>' for c in CATS)
    return f'''<a class="ps-card ps-archetype-card" href="archetype.html">
  <span class="ps-archetype-card__tile" aria-hidden="true"></span>
  <span class="ps-overline">Archetype</span>
  <h3 class="ps-archetype-card__name">{name}</h3>
  <p class="ps-archetype-card__desc">{desc}</p>
  <div class="ps-archetype-card__spark" aria-hidden="true">{bars}</div>
  <div class="ps-archetype-card__spark-labels" aria-hidden="true">{labels}</div>
</a>'''


def media(label, ratio='16/10', extra=''):
    return f'''<div class="ps-media ps-grid-bg" style="aspect-ratio:{ratio};{extra}"><span class="ps-media__label ps-tag ps-tag--ghost">{label}</span></div>'''


PITCH_INLINE = re.sub(r'<title>.*?</title>', '<title>Pitch diagram with a 4-3-3 formation</title>', open(os.path.join(ROOT, 'graphics/pitch/pitch-formation-433.svg')).read().replace('#F6F6EE', 'currentColor').replace('<svg ', '<svg role="img" ', 1))

# ---------------- Home ----------------
home_extra = '''
.hero { position: relative; overflow: hidden; border-bottom: 1px solid var(--line); }
.hero__inner { display: grid; grid-template-columns: 1.05fr 1fr; gap: 56px; align-items: center; padding: 88px 24px 96px; }
.hero__copy p { max-width: 460px; margin: 20px 0 32px; }
.hero__pitch { position: relative; padding: 28px; }
.hero__pitch img { width: 100%; height: auto; }
.hero__float { position: absolute; right: -8px; bottom: -34px; width: 270px; }
.hero__float .ps-build-card__attrs { padding-top: 12px; }
.hero__proof { display: flex; gap: 32px; margin-top: 40px; }
.hero__proof div { display: grid; gap: 4px; }
@media (max-width: 960px) { .hero__inner { grid-template-columns: 1fr; padding-top: 56px; } .hero__float { display: none; } }
.hero__pitch > svg { width: 100%; height: auto; color: var(--text); }
/* Light mode: the hero becomes a freshly mown pitch (Fresh Cut). */
[data-theme="light"] .hero { --text: var(--ps-color-grass-950); --text-2: var(--ps-color-grass-950); --text-3: var(--ps-color-grass-950); }
[data-theme="light"] .hero.ps-grid-bg { background: var(--ps-stripes); color: var(--text); border-bottom: 0; }
[data-theme="light"] .hero .hero__copy .ps-btn--primary { background: var(--ps-color-pitch-900); color: var(--ps-color-chalk-100); }
[data-theme="light"] .hero .hero__copy .ps-btn--secondary { border-color: color-mix(in srgb, var(--text) 40%, transparent); }
[data-theme="light"] .hero__pitch { --text: var(--ps-color-pitch-900); --text-3: var(--ps-color-semantic-text-tertiary); color: var(--text); }
'''
home = f'''<main>
<section class="hero ps-grid-bg">
  <div class="ps-container hero__inner">
    <div class="hero__copy">
      <span class="ps-overline">The Pro Clubs companion</span>
      <h1 class="ps-display-2xl" style="margin-top:16px">Build<br>Smarter.</h1>
      <p class="ps-body-lg">Create, compare and share Pro Clubs builds with clarity. Meta builds, archetypes and face guides in one place.</p>
      <div class="ps-row">
        <a class="ps-btn ps-btn--primary ps-btn--lg" href="builds.html">Start building {icon('arrow-right')}</a>
        <a class="ps-btn ps-btn--secondary ps-btn--lg" href="builds.html">Browse meta builds</a>
      </div>
      <div class="hero__proof">
        <div><span class="ps-stat-lg ps-num">1,240</span><span class="ps-caption">Builds shared</span></div>
        <div><span class="ps-stat-lg ps-num">18</span><span class="ps-caption">Archetypes mapped</span></div>
        <div><span class="ps-stat-lg ps-num">96</span><span class="ps-caption">Face guides</span></div>
      </div>
    </div>
    <div class="hero__pitch ps-card">
      <div class="ps-row" style="justify-content:space-between;margin-bottom:16px"><span class="ps-overline">Your XI · 4-3-3</span><span class="ps-badge">Draft</span></div>
      {PITCH_INLINE}
      <div class="hero__float">{build_card(BUILDS[0])}</div>
    </div>
  </div>
</section>

<section class="ps-section">
  <div class="ps-container">
    <div class="ps-section-head">
      <div><span class="ps-overline">This week</span><h2 class="ps-display-lg" style="margin-top:10px">Meta builds</h2></div>
      <a class="ps-btn ps-btn--secondary" href="builds.html">All builds {icon('arrow-right')}</a>
    </div>
    <div class="ps-grid">{''.join(build_card(b) for b in BUILDS[:3])}</div>
  </div>
</section>

<section class="ps-section" style="padding-top:0">
  <div class="ps-container">
    <div class="ps-section-head">
      <div><span class="ps-overline">Know your role</span><h2 class="ps-display-lg" style="margin-top:10px">Archetypes</h2></div>
      <a class="ps-btn ps-btn--secondary" href="archetype.html">Explore {icon('arrow-right')}</a>
    </div>
    <div class="ps-grid" style="grid-template-columns:repeat(auto-fill,minmax(min(260px,100%),1fr))">{''.join(archetype_card(a) for a in ARCHETYPES)}</div>
  </div>
</section>

<section class="ps-section" style="padding-top:0">
  <div class="ps-container">
    <div class="ps-card" style="display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;padding:40px;overflow:hidden">
      <div>
        <span class="ps-overline">Face guides</span>
        <h2 class="ps-display-lg" style="margin:10px 0 14px">Recreate any face,<br>slider by slider.</h2>
        <p class="ps-body-lg" style="margin:0 0 28px">Every value for head, eyes, nose, mouth and hair, laid out in the order you set them in game.</p>
        <a class="ps-btn ps-btn--chalk" href="face-guide.html">Open a face guide {icon('arrow-right')}</a>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
        {media('Face', '4/5')}{media('Face', '4/5')}{media('Face', '4/5')}
      </div>
    </div>
  </div>
</section>
</main>'''
page('index.html', 'Pitchside · Build smarter', home, active='', extra_css=home_extra)

# ---------------- Build discovery ----------------
more = BUILDS + [dict(BUILDS[3], name='Poacher', ovr=85, likes='620', meta=False), dict(BUILDS[1], name='Pressing Midfielder', pos='CDM', arch='Engine', ovr=84, likes='510', meta=False), dict(BUILDS[0], name='Inverted Winger', pos='RW', ovr=86, likes='1.1k', meta=True)]
builds = f'''<main class="ps-container" style="padding-top:48px;padding-bottom:96px">
  <div class="ps-section-head" style="margin-bottom:28px">
    <div><span class="ps-overline">Discover</span><h1 class="ps-display-lg" style="margin-top:10px">Builds</h1></div>
    <a class="ps-btn ps-btn--primary" href="#">{icon('plus')} New build</a>
  </div>
  <div class="ps-row" style="margin-bottom:20px;align-items:stretch">
    <label class="ps-search" style="flex:1;min-width:240px"><span class="ps-sr-only">Search builds</span>{icon('search')}<input class="ps-input" placeholder="Search builds, archetypes, players"><span class="ps-kbd">/</span></label>
    <select class="ps-select" style="width:200px" aria-label="Sort"><option>Most liked</option><option>Newest</option><option>Highest OVR</option></select>
  </div>
  <div class="ps-row" style="justify-content:space-between;margin-bottom:16px">
    <div class="ps-segmented" role="group" aria-label="Position">
      <button aria-pressed="true">All</button><button>ATT</button><button>MID</button><button>DEF</button><button>GK</button>
    </div>
    <div class="ps-chips" role="group" aria-label="Filters">
      <button class="ps-chip" aria-pressed="true">Meta</button><button class="ps-chip" aria-pressed="true">Under 180 cm</button><button class="ps-chip">Finisher</button><button class="ps-chip">Engine</button><button class="ps-chip">Playmaker</button>
      <button class="ps-chip">{icon('filter', 'ps-icon ps-icon--sm')} More</button>
    </div>
  </div>
  <div class="ps-tabs" role="tablist" style="margin-bottom:28px">
    <button class="ps-tab" role="tab" aria-selected="true">All builds<span class="ps-count ps-num">1,240</span></button>
    <button class="ps-tab" role="tab" aria-selected="false">Meta<span class="ps-count ps-num">86</span></button>
    <button class="ps-tab" role="tab" aria-selected="false">Saved<span class="ps-count ps-num">12</span></button>
    <button class="ps-tab" role="tab" aria-selected="false">Mine<span class="ps-count ps-num">3</span></button>
  </div>
  <div class="ps-grid">{''.join(build_card(b) for b in more)}</div>
  <div class="ps-row" style="justify-content:center;margin-top:40px"><button class="ps-btn ps-btn--secondary">Load more builds</button></div>
</main>'''
page('builds.html', 'Builds · Pitchside', builds, active='Builds')

# ---------------- Archetype ----------------
dist = [('Pace', 58, 86, 72), ('Shooting', 82, 97, 91), ('Passing', 52, 78, 64), ('Dribbling', 66, 88, 78), ('Defending', 20, 45, 31), ('Physical', 70, 92, 81)]
dist_html = ''.join(f'''<div class="ps-dist"><span class="ps-text-2">{n}</span><span class="ps-dist__track"><span class="ps-dist__range" style="--min:{a};--max:{b}"></span><span class="ps-dist__avg" style="--avg:{m}"></span></span><span class="ps-dist__val {rating(m)}" style="color:var(--rating)">{m}</span></div>''' for n, a, b, m in dist)
groups = [('Shooting', 91, [('Finishing', 95), ('Shot Power', 92), ('Positioning', 93), ('Volleys', 86)]),
          ('Physical', 81, [('Strength', 88), ('Jumping', 84), ('Stamina', 70), ('Aggression', 74)]),
          ('Pace', 72, [('Acceleration', 70), ('Sprint Speed', 74)])]
groups_html = ''.join(f'''<div class="ps-card ps-card__pad ps-attr-group {rating(avg)}"><div class="ps-attr-group__head"><span class="ps-h4">{g}</span><span class="ps-stat-lg ps-num">{avg}</span></div>{''.join(f'<div class="ps-attr ps-attr--lg {rating(v)}"><span class="ps-attr__label">{n}</span><span class="ps-attr__value">{v}</span><span class="ps-attr__bar"><i style="--v:{v}"></i></span></div>' for n, v in rows)}</div>''' for g, avg, rows in groups)
arch = f'''<main>
<section style="border-bottom:1px solid var(--line)" class="ps-grid-bg">
  <div class="ps-container" style="padding-top:56px;padding-bottom:56px;display:grid;grid-template-columns:1.3fr 1fr;gap:48px;align-items:end">
    <div>
      <div class="ps-row" style="gap:8px"><span class="ps-tag ps-tag--accent">Attacker</span><span class="ps-tag ps-tag--ghost">ST · CF</span></div>
      <h1 class="ps-display-xl" style="margin:18px 0 14px">Finisher</h1>
      <p class="ps-body-lg" style="margin:0;max-width:520px">Lives in the box. Built around clean first-time contact, late runs across the near post and strength to hold off a centre-back.</p>
    </div>
    <div class="ps-row" style="gap:40px;justify-content:flex-end">
      <div><span class="ps-stat-xl ps-num">214</span><div class="ps-caption">Builds</div></div>
      <div><span class="ps-stat-xl ps-num">186</span><div class="ps-caption">Avg height (cm)</div></div>
      <div><span class="ps-stat-xl ps-num ps-text-accent">91</span><div class="ps-caption">Avg shooting</div></div>
    </div>
  </div>
</section>
<section class="ps-container" style="padding-top:48px;padding-bottom:96px">
  <div style="display:grid;grid-template-columns:1fr 1.4fr;gap:24px;align-items:start">
    <div class="ps-card ps-card__pad ps-stack" style="gap:18px">
      <div class="ps-row" style="justify-content:space-between"><h2 class="ps-h3">Attribute distribution</h2><span class="ps-caption">Range across 214 builds · marker = average</span></div>
      {dist_html}
    </div>
    <div class="ps-grid" style="grid-template-columns:repeat(auto-fill,minmax(min(240px,100%),1fr))">{groups_html}</div>
  </div>
  <hr class="ps-cut-divider" style="margin:56px 0 40px">
  <div class="ps-section-head"><h2 class="ps-h1">Top Finisher builds</h2><a class="ps-btn ps-btn--secondary" href="builds.html">See all 214 {icon('arrow-right')}</a></div>
  <div class="ps-grid">{build_card(BUILDS[3])}{build_card(dict(BUILDS[3], name='Poacher', h='176 cm', w='70 kg', ovr=85, likes='620', meta=False, attrs=[('Positioning', 95), ('Finishing', 93), ('Acceleration', 90), ('Agility', 88)]))}{build_card(dict(BUILDS[3], name='Complete Forward', ovr=86, likes='880', meta=False, attrs=[('Finishing', 90), ('Short Passing', 84), ('Dribbling', 85), ('Strength', 83)]))}</div>
</section>
</main>'''
page('archetype.html', 'Finisher archetype · Pitchside', arch, active='Archetypes', extra_css='@media (max-width:960px){main section > div[style*="grid-template-columns"]{grid-template-columns:1fr !important}}')

# ---------------- Face guide ----------------
steps = [
    ('Head', 'Preset 14', True, [('Head width', 46), ('Head height', 55), ('Jaw width', 38), ('Chin height', 62)]),
    ('Eyes', 'Preset 7', True, [('Eye size', 40), ('Eye spacing', 52), ('Eye angle', 58), ('Brow height', 44)]),
    ('Nose', 'Preset 21', False, [('Nose width', 34), ('Nose length', 60), ('Bridge depth', 48), ('Tip height', 53)]),
    ('Mouth', 'Preset 3', False, [('Lip width', 50), ('Upper lip', 42), ('Lower lip', 57), ('Mouth height', 49)]),
    ('Hair & extras', 'Style 112', False, [('Hair colour', 8), ('Fade', 70), ('Beard', 0), ('Skin tone', 33)]),
]
steps_html = ''.join(f'''<section class="ps-card ps-face-step{' is-done' if done else ''}">
  <div class="ps-face-step__head"><span class="ps-face-step__num" aria-hidden="true"></span><h3 class="ps-face-step__title">{t}</h3><span class="ps-face-step__sub">{sub}</span></div>
  <div class="ps-sliders">{''.join(f'<div class="ps-slider-val"><span>{n}</span><b>{v}</b><span class="ps-slider-val__track"><i style="--v:{v}"></i></span></div>' for n, v in vals)}</div>
</section>''' for t, sub, done, vals in steps)
face = f'''<main class="ps-container" style="padding-top:40px;padding-bottom:96px">
  <nav class="ps-caption" aria-label="Breadcrumb" style="margin-bottom:16px"><a href="#" style="text-decoration:none">Faces</a> / Legends</nav>
  <div class="ps-section-head" style="margin-bottom:32px">
    <div>
      <div class="ps-row" style="gap:8px"><span class="ps-tag">Face guide</span><span class="ps-badge ps-badge--new">New</span></div>
      <h1 class="ps-display-lg" style="margin:14px 0 8px">The Maestro</h1>
      <p class="ps-text-3" style="margin:0">Sample guide · 5 steps · about 6 minutes in game</p>
    </div>
    <div class="ps-row"><button class="ps-btn ps-btn--secondary">{icon('save')} Save</button><button class="ps-btn ps-btn--primary">{icon('share')} Share guide</button></div>
  </div>
  <div class="ps-face">
    <aside class="ps-face__preview">
      <div class="ps-face__frame"><div class="ps-grid-bg"></div>
        <svg viewBox="0 0 24 24" class="ps-icon" style="position:absolute;inset:0;margin:auto;width:46%;height:46%;stroke-width:0.6;color:color-mix(in srgb, var(--text) 22%, transparent)"><use href="#i-face"/></svg>
        <span class="ps-media__label ps-tag ps-tag--ghost">In-game screenshot</span>
      </div>
      <div class="ps-face__thumbs"><span class="ps-face__thumb" aria-current="true"></span><span class="ps-face__thumb"></span><span class="ps-face__thumb"></span><span class="ps-face__thumb"></span></div>
      <p class="ps-caption" style="margin-top:12px">Values match the in-game sliders (0 to 100). The centre tick marks the default.</p>
    </aside>
    <div class="ps-face-steps">{steps_html}</div>
  </div>
</main>'''
page('face-guide.html', 'The Maestro face guide · Pitchside', face, active='Faces')

# ---------------- Components reference ----------------
def spec(title, inner, note=''):
    return f'''<section class="cmp"><div class="cmp__head"><h2 class="ps-h3">{title}</h2>{f'<span class="ps-caption">{note}</span>' if note else ''}</div><div class="cmp__body">{inner}</div></section>'''

cmp_css = '''
.cmp { padding: 40px 0; border-bottom: 1px solid var(--line); }
.cmp__head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 20px; }
.cmp__body { display: grid; gap: 20px; }
.state { display: grid; gap: 8px; justify-items: start; }
.state > .ps-caption { text-transform: uppercase; letter-spacing: .1em; font-size: 10px; font-weight: 600; }
.states { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 20px; align-items: end; }
.force-hover.ps-btn--primary { background: var(--accent-hover); }
.force-active.ps-btn--primary { background: var(--accent-pressed); transform: translateY(1px); }
.force-hover.ps-btn--secondary { background: var(--surface); border-color: color-mix(in srgb, var(--text) 32%, transparent); }
.force-focus { box-shadow: var(--ps-shadow-focus); }
.force-hover.ps-input { border-color: color-mix(in srgb, var(--text) 32%, transparent); }
.force-focus.ps-input { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-subtle); }
.force-hover.ps-card { border-color: var(--line-strong); background: var(--surface-raised); }
.swatches { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 12px; }
.sw { border-radius: 10px; border: 1px solid var(--line); overflow: hidden; font-size: 12px; }
.sw i { display: block; height: 56px; }
.sw div { padding: 8px 10px; display: grid; gap: 2px; }
.scale-row { display: flex; align-items: end; gap: 10px; flex-wrap: wrap; }
.scale-row span { background: var(--accent); opacity: .85; display: block; }
'''

def states_btn(kind, label):
    def st(n, cls='', attr=''):
        return f'<div class="state"><span class="ps-caption">{n}</span><button class="ps-btn ps-btn--{kind} {cls}"{attr}>{label}</button></div>'
    return f'<div class="states">{st("Default")}{st("Hover", "force-hover")}{st("Pressed", "force-active")}{st("Focus", "force-focus")}{st("Disabled", attr=" disabled")}</div>'

sw = lambda name, hexv, txt='': f'<div class="sw"><i style="background:{hexv}"></i><div><b>{name}</b><span class="ps-caption ps-mono">{hexv}</span>{f"<span class=ps-caption>{txt}</span>" if txt else ""}</div></div>'
cmp = f'''<main class="ps-container" style="padding-top:48px;padding-bottom:96px">
  <span class="ps-overline">Design system</span><h1 class="ps-display-lg" style="margin:10px 0 8px">Components</h1>
  <p class="ps-body-lg" style="margin:0 0 16px">Every component with its states. Built from tokens/tokens.css and css/pitchside.css only.</p>
  {spec('Colour', '<div class="swatches">' + sw('Pitch', '#0D1F17', 'Background') + sw('Turf', '#2E5E3D', 'Selected, tags') + sw('Floodlight', '#D6F16A', 'Accent ≤ 5%') + sw('Chalk', '#F6F6EE', 'Text, logo') + sw('Night', '#0A0A0A', 'Overlays') + sw('Surface', '#11271D', 'Cards') + sw('Raised', '#163023', 'Hover') + sw('Strong', '#1B3A2A', 'Modal') + '</div><div class="swatches">' + sw('Elite 90+', '#D6F16A') + sw('Great 80–89', '#8FDB7A') + sw('Good 70–79', '#E9D45C') + sw('Average 60–69', '#EFA14A') + sw('Low <60', '#EE6A55') + '</div><h3 class="ps-h4" style="margin:8px 0 0">Light mode · Fresh Cut</h3><div class="swatches">' + sw('Chalk', '#F6F6EE', 'Background') + sw('White', '#FFFFFF', 'Cards') + sw('Pitch', '#0D1F17', 'Text, selected') + sw('Grass', '#1FC46E', 'Accent') + sw('Grass 800', '#0E7A43', 'Accent as text') + sw('Raised', '#F0F1E8', 'Hover') + sw('Strong', '#E4E7DA', 'Pressed') + '</div><div class="swatches">' + sw('Elite 90+', '#0E7A43') + sw('Great 80–89', '#3A7317') + sw('Good 70–79', '#856100') + sw('Average 60–69', '#A84B00') + sw('Low <60', '#B52D1B') + '</div>', 'Dark is the default; light via data-theme="light"')}
  {spec('Typography', '''<div class="ps-display-xl">Build Smarter.</div><div class="ps-h1">Heading 1 · Inter Display 34 Bold</div><div class="ps-h2">Heading 2 · Inter Display 26 Bold</div><div class="ps-h3">Heading 3 · Inter 20 Semibold</div><p class="ps-body-lg" style="margin:0">Body large · 18/28. Create, compare and share Pro Clubs builds.</p><p class="ps-body" style="margin:0">Body · 16/24. Every value laid out in the order you set it in game.</p><span class="ps-overline">Overline · 11 semibold, +14% tracking</span><div class="ps-row" style="gap:32px"><span class="ps-stat-xl ps-num">88</span><span class="ps-stat-lg ps-num">1,240</span><span class="ps-attr__value r-great ps-num">84</span></div>''', 'Inter + Inter Display (OFL)')}
  {spec('Buttons', f'<div class="ps-stack" style="gap:28px">{states_btn("primary", "Start building")}{states_btn("secondary", "Browse builds")}{states_btn("ghost", "Cancel")}<div class="ps-row"><button class="ps-btn ps-btn--primary ps-btn--lg">Large {icon("arrow-right")}</button><button class="ps-btn ps-btn--primary">Medium</button><button class="ps-btn ps-btn--primary ps-btn--sm">Small</button><button class="ps-btn ps-btn--chalk">Chalk</button><button class="ps-btn ps-btn--secondary ps-btn--icon" aria-label="Share">{icon("share")}</button></div></div>', 'Pill, 44px default height, 15px semibold')}
  {spec('Inputs', f'''<div class="states" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">
    <label class="ps-field"><span class="ps-field__label">Default</span><input class="ps-input" placeholder="Build name"></label>
    <label class="ps-field"><span class="ps-field__label">Hover</span><input class="ps-input force-hover" placeholder="Build name"></label>
    <label class="ps-field"><span class="ps-field__label">Focus</span><input class="ps-input force-focus" value="Pacey Inside Forward"></label>
    <label class="ps-field"><span class="ps-field__label">Error</span><input class="ps-input" aria-invalid="true" value="P"><span class="ps-field__error">Use at least 3 characters.</span></label>
    <label class="ps-field"><span class="ps-field__label">Disabled</span><input class="ps-input" disabled value="Locked"></label>
    <label class="ps-field"><span class="ps-field__label">Select</span><select class="ps-select"><option>Striker</option></select><span class="ps-field__hint">Primary position</span></label>
  </div><label class="ps-search"><span class="ps-sr-only">Search</span>{icon('search')}<input class="ps-input" placeholder="Search builds, archetypes, players"><span class="ps-kbd">/</span></label>''')}
  {spec('Tabs, segmented control and filter chips', f'''<div class="ps-tabs" role="tablist"><button class="ps-tab" aria-selected="true">All builds<span class="ps-count">1,240</span></button><button class="ps-tab" aria-selected="false">Meta<span class="ps-count">86</span></button><button class="ps-tab" aria-selected="false">Saved</button></div>
  <div class="ps-row"><div class="ps-segmented"><button aria-pressed="true">All</button><button>ATT</button><button>MID</button><button>DEF</button></div></div>
  <div class="ps-chips"><button class="ps-chip">Default</button><button class="ps-chip force-hover" style="background:var(--surface);color:var(--text)">Hover</button><button class="ps-chip" aria-pressed="true">Selected</button><button class="ps-chip" disabled>Disabled</button></div>''')}
  {spec('Tags and badges', '<div class="ps-row"><span class="ps-tag">ST</span><span class="ps-tag ps-tag--accent">Attacker</span><span class="ps-tag ps-tag--chalk">LW</span><span class="ps-tag ps-tag--ghost">Draft</span><span class="ps-badge ps-badge--meta"><span class="ps-dot"></span>Meta</span><span class="ps-badge ps-badge--new">New</span><span class="ps-badge">12 saves</span></div>', 'Tags carry the 15° cut')}
  {spec('Cards', f'<div class="ps-grid">{build_card(BUILDS[0])}{build_card(BUILDS[2]).replace("ps-card ps-card--interactive", "ps-card ps-card--interactive force-hover")}{archetype_card(ARCHETYPES[1])}</div>', 'Build card · build card hover · archetype card')}
  {spec('Attribute displays', f'''<div class="ps-grid" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr))">{''.join(f'<div class="ps-attr ps-attr--lg {rating(v)}"><span class="ps-attr__label">{n}</span><span class="ps-attr__value">{v}</span><span class="ps-attr__bar"><i style="--v:{v}"></i></span></div>' for n, v in [('Finishing', 94), ('Shot Power', 86), ('Stamina', 74), ('Agility', 63), ('Heading Acc.', 48)])}</div><div class="ps-card ps-card__pad ps-stack" style="gap:16px;max-width:560px">{dist_html}</div>''', 'Colour encodes the rating band; the number always carries the value')}
  {spec('Modal', f'''<div class="ps-overlay ps-overlay--inline"><div class="ps-modal" role="dialog" aria-labelledby="mt"><div class="ps-modal__head"><h3 class="ps-h3" id="mt">Share build</h3><button class="ps-btn ps-btn--ghost ps-btn--icon ps-btn--sm" aria-label="Close">{icon('close')}</button></div><div class="ps-modal__body ps-stack"><p class="ps-text-2" style="margin:0">Anyone with this code can load Pacey Inside Forward into Pitchside.</p><div class="ps-share-code"><span class="ps-mono">PS-LW-7Q4K-9XA2</span><button class="ps-btn ps-btn--secondary ps-btn--sm">Copy</button></div></div><div class="ps-modal__foot"><button class="ps-btn ps-btn--ghost">Cancel</button><button class="ps-btn ps-btn--primary">{icon('share')} Share image</button></div></div></div>''', 'Night overlay at 72%')}
  {spec('Empty state', f'''<div class="ps-empty ps-grid-bg"><span class="ps-empty__icon">{icon('save', 'ps-icon')}</span><h3 class="ps-h3">No saved builds yet</h3><p>Tap save on any build and it lands here, ready to recreate in game.</p><a class="ps-btn ps-btn--primary" href="builds.html">Browse builds</a></div>''')}
  {spec('Spacing and radius', '<div class="scale-row">' + ''.join(f'<div class="state"><span style="width:{v}px;height:{v}px"></span><span class="ps-caption">{v}</span></div>' for v in (4, 8, 12, 16, 24, 32, 48, 64)) + '</div><div class="scale-row">' + ''.join(f'<div class="state"><span style="width:64px;height:64px;border-radius:{v};background:var(--surface-strong);opacity:1;border:1px solid var(--line-strong)"></span><span class="ps-caption">{n}</span></div>' for n, v in (('xs 4', '4px'), ('sm 6', '6px'), ('md 10', '10px'), ('lg 14', '14px'), ('xl 20', '20px'), ('2xl 28', '28px'), ('pill', '999px'))) + '</div>', '4px base unit')}
</main>'''
page('components.html', 'Components · Pitchside', cmp, active='', extra_css=cmp_css)

# ---------------- Mobile ----------------
mob_css = '''
body { background: var(--bg-sunken); }
.phones { display: flex; gap: 40px; justify-content: center; flex-wrap: wrap; padding: 56px 24px 96px; }
.phone { width: 390px; height: 844px; border-radius: 48px; border: 10px solid #050a07; background: var(--bg); overflow: hidden; display: flex; flex-direction: column; box-shadow: var(--ps-shadow-lg); position: relative; }
.phone__status { height: 47px; display: flex; justify-content: space-between; align-items: center; padding: 0 28px; font-size: 14px; font-weight: 600; flex: none; }
.phone__body { flex: 1; overflow: hidden; padding: 0 16px; }
.phone__top { display: flex; align-items: center; justify-content: space-between; height: 52px; }
.phone .ps-build-card__attrs { grid-template-columns: 1fr 1fr; }
.phone h1 { font-size: 34px !important; }
.mlabel { text-align: center; margin-top: 14px; }
'''
status = '<div class="phone__status"><span class="ps-num">9:41</span><span>●●● ▮</span></div>'
tabbar = lambda a: '<nav class="ps-tabbar">' + ''.join(f'<a class="ps-tabbar__item" href="#"{" aria-current=\"page\"" if n == a else ""}>{icon(i)}<span>{n}</span></a>' for n, i in (('Home', 'pitch'), ('Builds', 'build'), ('Archetypes', 'archetype'), ('Faces', 'face'), ('Saved', 'save'))) + '</nav>'
sym_small = open(os.path.join(ROOT, 'logo/symbol/pitchside-symbol-on-dark.svg')).read().replace('width="120.74" height="96"', 'style="height:22px;width:auto"').replace('<title id="t">Pitchside symbol</title>', '').replace('#F6F6EE', 'currentColor')
m_home = f'''<div class="phone">{status}<div class="phone__body">
  <div class="phone__top">{logo_inline(20)}<span class="ps-avatar">SA</span></div>
  <div class="ps-grid-bg" style="margin:8px -16px 0;padding:24px 16px 28px;border-bottom:1px solid var(--line)">
    <span class="ps-overline">The Pro Clubs companion</span>
    <h1 class="ps-display-xl" style="margin:12px 0 12px">Build Smarter.</h1>
    <p class="ps-text-2" style="margin:0 0 20px;font-size:15px">Create, compare and share builds with clarity.</p>
    <a class="ps-btn ps-btn--primary" style="width:100%" href="#">Start building {icon('arrow-right')}</a>
  </div>
  <div class="ps-row" style="justify-content:space-between;margin:22px 0 12px"><h2 class="ps-h3">Meta builds</h2><a class="ps-caption" href="#" style="text-decoration:none">See all</a></div>
  {build_card(BUILDS[3])}
</div>{tabbar('Home')}</div>'''
b = BUILDS[0]
attr_rows = ''.join(f'<div class="ps-attr ps-attr--lg {rating(v)}"><span class="ps-attr__label">{n}</span><span class="ps-attr__value">{v}</span><span class="ps-attr__bar"><i style="--v:{v}"></i></span></div>' for n, v in b['attrs'])
m_build = f'''<div class="phone">{status}<div class="phone__body">
  <div class="phone__top"><button class="ps-btn ps-btn--ghost ps-btn--icon ps-btn--sm" aria-label="Back" style="transform:scaleX(-1)">{icon('arrow-right')}</button><span class="ps-row" style="gap:2px"><button class="ps-btn ps-btn--ghost ps-btn--icon ps-btn--sm" aria-label="Save">{icon('save')}</button><button class="ps-btn ps-btn--ghost ps-btn--icon ps-btn--sm" aria-label="Share">{icon('share')}</button></span></div>
  <div class="ps-row" style="gap:8px;margin-top:8px"><span class="ps-tag">{b['pos']}</span><span class="ps-badge ps-badge--meta"><span class="ps-dot"></span>Meta</span></div>
  <div class="ps-row" style="justify-content:space-between;align-items:end;margin:12px 0 4px"><h1 class="ps-h1" style="margin:0;font-size:28px !important">{b['name']}</h1><span class="ps-stat-xl ps-num" style="font-size:44px">{b['ovr']}</span></div>
  <div class="ps-build-card__meta" style="margin-bottom:18px"><span>{b['arch']}</span><span>{b['h']}</span><span>{b['w']}</span></div>
  <div class="ps-segmented" style="width:100%;margin-bottom:18px"><button aria-pressed="true" style="flex:1">Attributes</button><button style="flex:1">Playstyles</button><button style="flex:1">Face</button></div>
  <div class="ps-card ps-card__pad ps-stack" style="gap:14px">{attr_rows}</div>
</div>{tabbar('Builds')}</div>'''
st = steps[2]
m_face = f'''<div class="phone">{status}<div class="phone__body">
  <div class="phone__top"><span class="ps-h4">The Maestro</span><span class="ps-caption ps-num">Step 3 of 5</span></div>
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-bottom:16px">{''.join(f'<i style="height:4px;border-radius:2px;background:{"var(--accent)" if i < 3 else "color-mix(in srgb, var(--text) 12%, transparent)"}"></i>' for i in range(5))}</div>
  <div class="ps-face__frame" style="aspect-ratio:4/3"><div class="ps-grid-bg" style="position:absolute;inset:0"></div><svg viewBox="0 0 24 24" class="ps-icon" style="position:absolute;inset:0;margin:auto;width:40%;height:50%;stroke-width:.6;color:color-mix(in srgb, var(--text) 22%, transparent)"><use href="#i-face"/></svg><span class="ps-media__label ps-tag ps-tag--ghost">Nose close-up</span></div>
  <section class="ps-card ps-face-step" style="margin-top:14px;counter-reset:step 2"><div class="ps-face-step__head"><span class="ps-face-step__num" aria-hidden="true"></span><h3 class="ps-face-step__title">{st[0]}</h3><span class="ps-face-step__sub">{st[1]}</span></div>
  <div class="ps-sliders" style="grid-template-columns:1fr">{''.join(f'<div class="ps-slider-val"><span>{n}</span><b>{v}</b><span class="ps-slider-val__track"><i style="--v:{v}"></i></span></div>' for n, v in st[3])}</div></section>
  <div class="ps-row" style="margin-top:14px;flex-wrap:nowrap"><button class="ps-btn ps-btn--secondary" style="flex:1">Previous</button><button class="ps-btn ps-btn--primary" style="flex:1">Next: Mouth</button></div>
</div>{tabbar('Faces')}</div>'''
mobile = f'''<main><div class="ps-container" style="padding-top:48px"><span class="ps-overline">Mobile</span><h1 class="ps-display-lg" style="margin-top:10px">Pitchside on the phone</h1><p class="ps-body-lg">390 × 844 frames. Same tokens and components, single column, bottom tab bar.</p></div>
<div class="phones"><div>{m_home}<p class="mlabel ps-caption">Home</p></div><div>{m_build}<p class="mlabel ps-caption">Build detail</p></div><div>{m_face}<p class="mlabel ps-caption">Face guide, step by step</p></div></div></main>'''
page('mobile.html', 'Mobile · Pitchside', mobile, active='', extra_css=mob_css)

# ---------------- Brand guidelines (visual) ----------------
ICONS = ['build', 'archetype', 'face', 'compare', 'meta', 'share', 'save', 'search', 'pitch', 'filter', 'heart', 'plus', 'arrow-right', 'close']
brand_css = '''
.bsec { padding: 64px 0; border-bottom: 1px solid var(--line); }
.bsec h2 { margin: 10px 0 8px; }
.bsec > p { max-width: 640px; color: var(--text-2); margin: 0 0 32px; }
.tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
.tile { border-radius: 16px; border: 1px solid var(--line); min-height: 240px; display: grid; place-items: center; padding: 40px; position: relative; background: #0D1F17; color: #F6F6EE; --text: #F6F6EE; --text-3: #A3AD9F; --line: rgba(246,246,238,.10); --ps-color-semantic-grid-line: rgba(246,246,238,.06); }
.tile img { max-height: 72px; width: auto; }
.tile figcaption, .tile .cap { position: absolute; left: 16px; bottom: 12px; font-size: 12px; color: var(--text-3); }
.tile.light { background: #F6F6EE; } .tile.light .cap { color: #4A5E52; }
.tile.turf { background: #2E5E3D; } .tile.turf .cap { color: #C8CDBF; }
.tile.lime { background: #D6F16A; } .tile.lime .cap { color: #55661A; }
.bad { position: relative; }
.bad::after { content: "✕"; position: absolute; top: 12px; right: 14px; width: 26px; height: 26px; border-radius: 50%; background: #F26D5B; color: #0D1F17; font-weight: 800; display: grid; place-items: center; font-size: 13px; }
.clear { position: relative; padding: 48px; outline: 1px dashed rgba(214,241,106,.6); outline-offset: 0; }
.clear img { height: 96px; max-height: none; }
.clear i { position: absolute; font-style: normal; font-size: 12px; color: var(--accent); font-weight: 700; }
.prop { display: flex; height: 96px; border-radius: 14px; overflow: hidden; border: 1px solid var(--line); }
.prop div { display: flex; align-items: end; padding: 10px 12px; font-size: 12px; font-weight: 600; }
.icons { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 12px; }
.icons div { display: grid; justify-items: center; gap: 10px; padding: 18px 8px; border-radius: 12px; background: var(--surface); border: 1px solid var(--line); font-size: 12px; color: var(--text-3); }
.icons svg { width: 28px; height: 28px; color: var(--text); }
'''
L = '../logo/'
brand = f'''<main class="ps-container" style="padding-bottom:64px">
<section class="bsec" style="padding-top:56px"><span class="ps-overline">Brand guidelines</span><h1 class="ps-display-xl" style="margin:12px 0 16px">The Grid</h1>
<p class="ps-body-lg" style="max-width:640px;margin:0">A structured identity built on the logic of the game. A slanted P cut into four tiles by the lines of the pitch, set beside a calm, upright wordmark. Clean, system-driven, built to scale across the product.</p></section>

<section class="bsec"><span class="ps-overline">01 · Logo</span><h2 class="ps-h1">Logo system</h2><p>The horizontal logo is primary. Use the stacked logo where width is tight, and the symbol alone once the brand is already established on the screen (app icon, avatar, favicon, nav on mobile).</p>
<div class="tiles">
  <figure class="tile" style="margin:0;grid-column:1/-1;min-height:320px"><img src="{L}horizontal/pitchside-logo-horizontal-on-dark.svg" alt="Pitchside logo" style="max-height:110px"><span class="cap">Primary · on dark</span></figure>
  <figure class="tile light" style="margin:0"><img src="{L}horizontal/pitchside-logo-horizontal-on-light.svg" alt=""><span class="cap">On light</span></figure>
  <figure class="tile turf" style="margin:0"><img src="{L}horizontal/pitchside-logo-horizontal-on-dark.svg" alt=""><span class="cap">On Turf</span></figure>
  <figure class="tile lime" style="margin:0"><img src="{L}horizontal/pitchside-logo-horizontal-on-light.svg" alt=""><span class="cap">On Floodlight (sparingly)</span></figure>
  <figure class="tile light" style="margin:0"><img src="{L}horizontal/pitchside-logo-horizontal-mono-black.svg" alt=""><span class="cap">Mono black</span></figure>
  <figure class="tile" style="margin:0;background:#0A0A0A"><img src="{L}horizontal/pitchside-logo-horizontal-mono-white.svg" alt=""><span class="cap">Mono white</span></figure>
  <figure class="tile" style="margin:0"><img src="{L}stacked/pitchside-logo-stacked-on-dark.svg" alt="" style="max-height:150px"><span class="cap">Stacked</span></figure>
  <figure class="tile" style="margin:0"><img src="{L}symbol/pitchside-symbol-on-dark.svg" alt="" style="max-height:110px"><span class="cap">Symbol</span></figure>
  <figure class="tile" style="margin:0"><img src="{L}wordmark/pitchside-wordmark-on-dark.svg" alt="" style="max-height:52px"><span class="cap">Wordmark</span></figure>
</div></section>

<section class="bsec"><span class="ps-overline">02 · Logo usage</span><h2 class="ps-h1">Clear space and minimum size</h2><p>Clear space X = half the symbol height, on every side of the logo. For the symbol alone, X = a quarter of its height. Below 32 px, use the small symbol files, which have wider cuts.</p>
<div class="tiles">
  <div class="tile" style="min-height:320px"><div class="clear"><img src="{L}horizontal/pitchside-logo-horizontal-on-dark.svg" alt=""><i style="top:16px;left:50%">X</i><i style="bottom:16px;left:50%">X</i><i style="left:18px;top:50%">X</i><i style="right:18px;top:50%">X</i></div></div>
  <div class="tile"><div class="ps-stack" style="gap:20px;justify-items:start">
    <div class="ps-row"><img src="{L}horizontal/pitchside-logo-horizontal-on-dark.svg" alt="" style="height:24px"><span class="ps-caption">Horizontal · min 96 px wide / 25 mm</span></div>
    <div class="ps-row"><img src="{L}stacked/pitchside-logo-stacked-on-dark.svg" alt="" style="height:48px"><span class="ps-caption">Stacked · min 64 px wide / 18 mm</span></div>
    <div class="ps-row"><img src="{L}symbol/pitchside-symbol-small-on-dark.svg" alt="" style="height:16px"><span class="ps-caption">Symbol · min 16 px / 5 mm (small version)</span></div>
  </div></div>
</div>
<h3 class="ps-h3" style="margin:40px 0 16px">Don't</h3>
<div class="tiles" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">
  <div class="tile bad"><img src="{L}horizontal/pitchside-logo-horizontal-on-dark.svg" alt="" style="transform:scaleX(1.35)"><span class="cap">Stretch or squash</span></div>
  <div class="tile bad"><img src="{L}horizontal/pitchside-logo-horizontal-on-dark.svg" alt="" style="transform:rotate(-12deg)"><span class="cap">Rotate</span></div>
  <div class="tile bad light"><img src="{L}horizontal/pitchside-logo-horizontal-on-dark.svg" alt="" style="filter:brightness(1.0) sepia(1) hue-rotate(30deg) saturate(4)"><span class="cap">Low-contrast colours</span></div>
  <div class="tile bad"><img src="{L}horizontal/pitchside-logo-horizontal-on-dark.svg" alt="" style="filter:drop-shadow(0 0 14px #D6F16A)"><span class="cap">Glows, shadows, effects</span></div>
  <div class="tile bad" style="background:repeating-linear-gradient(45deg,#2E5E3D 0 14px,#D6F16A 14px 28px)"><img src="{L}horizontal/pitchside-logo-horizontal-on-dark.svg" alt=""><span class="cap" style="color:#0D1F17;background:#F6F6EE;padding:2px 6px">Busy backgrounds</span></div>
  <div class="tile bad"><div class="ps-row" style="gap:10px;flex-wrap:nowrap"><img src="{L}symbol/pitchside-symbol-on-dark.svg" alt="" style="height:32px"><span style="font:italic 300 28px Georgia,serif">Pitchside</span></div><span class="cap">Retype the wordmark</span></div>
  <div class="tile bad"><div class="ps-row" style="gap:12px;flex-wrap:nowrap"><img src="{L}wordmark/pitchside-wordmark-on-dark.svg" alt="" style="height:24px"><img src="{L}symbol/pitchside-symbol-on-dark.svg" alt="" style="height:30px"></div><span class="cap">Rearrange the lockup</span></div>
  <div class="tile bad"><img src="{L}symbol/pitchside-symbol-on-dark.svg" alt="" style="height:80px;transform:scaleX(-1)"><span class="cap">Mirror or re-slant the symbol</span></div>
</div></section>

<section class="bsec"><span class="ps-overline">03 · Colour</span><h2 class="ps-h1">Pitch, Turf, Floodlight, Chalk, Night, Grass</h2><p>Dark-first. Pitch carries the surface, Chalk the content, Floodlight the one thing to do next. If a screen has more than one Floodlight element competing, one of them is wrong.</p>
<div class="prop"><div style="flex:60;background:#0D1F17;color:#C8CDBF">Pitch 60%</div><div style="flex:18;background:#2E5E3D">Turf + surfaces 18%</div><div style="flex:14;background:#F6F6EE;color:#0D1F17">Chalk 14%</div><div style="flex:5;background:#D6F16A;color:#0D1F17">5%</div><div style="flex:3;background:#0A0A0A"></div></div>
<h3 class="ps-h3" style="margin:40px 0 12px">Light mode · Fresh Cut</h3><p style="margin:0 0 20px">The same brand in daylight. Chalk becomes the ground, white the cards and Pitch the ink, with Grass as the accent. Floodlight lime stays a dark-mode colour. On light, heroes can use the mowing stripes.</p>
<div class="prop"><div style="flex:60;background:#F6F6EE;color:#33473C">Chalk 60%</div><div style="flex:18;background:#FFFFFF;color:#33473C;border-left:1px solid #E4E7DA">White cards 18%</div><div style="flex:14;background:#0D1F17;color:#C8CDBF">Pitch 14%</div><div style="flex:5;background:#1FC46E;color:#062214">5%</div><div style="flex:3;background:#0E7A43"></div></div>
<div class="ps-stripes-bg" style="height:96px;border-radius:14px;margin-top:12px;display:flex;align-items:end;padding:10px 12px;font-size:12px;font-weight:600">Mowing stripes · light-mode heroes only</div>
<p class="ps-caption" style="margin-top:12px">Full ramps, semantic roles and rating colours: tokens/tokens.json · components.html</p></section>

<section class="bsec"><span class="ps-overline">04 · Typography</span><h2 class="ps-h1">Inter Display and Inter</h2><p>One superfamily, two optical sizes. Inter Display (grotesk) for headlines and big numbers, set tight. Inter (neo-grotesk) for everything you read and tap. Tabular figures on for every number. Both are free under the SIL Open Font License.</p>
<div class="ps-card ps-card__pad" style="padding:40px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
  <div><span class="ps-overline">Display · Inter Display Bold</span><div class="ps-display-2xl" style="margin-top:16px">AaBbCc</div><div class="ps-stat-xl ps-num" style="margin-top:16px">0123456789</div></div>
  <div><span class="ps-overline">Text · Inter Regular to Semibold</span><div style="font-size:72px;line-height:1;margin-top:16px;letter-spacing:-0.02em">AaBbCc</div><p class="ps-body-lg" style="margin-top:16px">Create, compare and share Pro Clubs builds with clarity. 175 cm · 68 kg · 95 Acceleration.</p></div>
</div></section>

<section class="bsec"><span class="ps-overline">05 · Graphic language</span><h2 class="ps-h1">Grid, pitch, cut, tile</h2><p>Four motifs, all drawn from the symbol and the game. Use one or two per layout, always in hairline Chalk at low opacity. Floodlight only for the single marker that matters.</p>
<div class="tiles">
  <div class="tile ps-crosshair-bg" style="background-color:#0D1F17"><span class="cap">The grid · 48 px module, crosshairs at intersections</span></div>
  <div class="tile"><img src="../graphics/pitch/pitch-formation-433.svg" alt="" style="max-height:170px"><span class="cap">Pitch markings · formations, positions</span></div>
  <div class="tile"><div class="ps-row"><span class="ps-tag">ST</span><span class="ps-tag ps-tag--accent">Finisher</span><span class="ps-tag ps-tag--chalk">01</span></div><span class="cap">The cut · 15° on tags, steps, markers</span></div>
  <div class="tile" style="padding:24px"><div class="ps-tile-crop" style="width:100%;aspect-ratio:1.26;background:#2E5E3D url(../graphics/pitch/pitch-formation-433.svg) center / 140% no-repeat"></div><span class="cap">The tile crop · imagery masked by the symbol (stand-in shown)</span></div>
</div></section>

<section class="bsec"><span class="ps-overline">06 · Iconography</span><h2 class="ps-h1">Icons</h2><p>24 px grid, 1.75 stroke, round caps and joins, no fills. Custom icons for Pitchside concepts. For anything else use Lucide (ISC licence), which matches this stroke.</p>
<div class="icons">{''.join(f'<div>{icon(n)}<span>{n}</span></div>' for n in ICONS)}</div></section>

<section class="bsec" style="border:0"><span class="ps-overline">07 · App icon</span><h2 class="ps-h1">App icon and favicon</h2><p>Chalk symbol on deep Pitch green. The lime edge is for marketing presentations only. Stores and operating systems get the flat icon.</p>
<div class="ps-row" style="gap:28px;align-items:end">
  <img src="../app-icon/png/app-icon-rounded-1024.png" alt="App icon" style="width:180px;height:180px">
  <img src="../app-icon/png/app-icon-showcase-1024.png" alt="App icon with lime edge" style="width:120px;height:120px">
  <img src="../app-icon/png/app-icon-rounded-1024.png" alt="" style="width:60px;height:60px">
  <img src="../favicon/favicon-32.png" alt="Favicon" style="width:32px;height:32px">
  <img src="../favicon/favicon-16.png" alt="" style="width:16px;height:16px">
</div></section>
</main>'''
page('brand.html', 'Brand guidelines · Pitchside', brand, active='', extra_css=brand_css)
