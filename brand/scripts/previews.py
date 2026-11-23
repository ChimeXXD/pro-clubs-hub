"""Render high-resolution PNG previews of the logo SVGs (for review only;
the SVGs in /logo are the real assets)."""
import os, re, subprocess, sys
sys.path.insert(0, os.path.dirname(__file__))
import geometry as g

ROOT = os.path.join(os.path.dirname(__file__), '..')
PITCH, CREAM, LIME, MUTED = '#0D1F17', '#F6F6EE', '#D6F16A', '#6F8A78'
W, H = 2400, 1350


def load(rel):
    s = open(os.path.join(ROOT, rel)).read()
    vb = re.search(r'viewBox="([^"]+)"', s).group(1)
    inner = re.sub(r'^.*?<title[^>]*>.*?</title>', '', s, flags=re.S).rsplit('</svg>', 1)[0]
    _, _, vw, vh = map(float, vb.split())
    return vb, vw, vh, inner


def place(rel, x, y, width=None, height=None, recolor=None):
    vb, vw, vh, inner = load(rel)
    if width: height = width * vh / vw
    else: width = height * vw / vh
    if recolor: inner = inner.replace(CREAM, recolor)
    return f'<svg x="{x}" y="{y}" width="{width}" height="{height}" viewBox="{vb}">{inner}</svg>', width, height


def label(x, y, text, size=26, fill=MUTED, anchor='start', weight=500):
    return f'<text x="{x}" y="{y}" fill="{fill}" font-family="Inter" font-weight="{weight}" font-size="{size}" letter-spacing="0.06em" text-anchor="{anchor}">{text}</text>'


def page(body, name, bg=PITCH, w=W, h=H):
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><rect width="100%" height="100%" fill="{bg}"/>{body}</svg>'
    out = os.path.join(ROOT, 'previews/logo', name)
    open('/tmp/_p.svg', 'w').write(svg)
    subprocess.run(['rsvg-convert', '/tmp/_p.svg', '-o', out], check=True)
    print(out)


def centered(rel, width=None, height=None, cy=None):
    _, vw, vh, _ = load(rel)
    if width: height = width * vh / vw
    else: width = height * vw / vh
    return place(rel, (W - width) / 2, (cy or H / 2) - height / 2, width=width)[0]


# 1. Primary logo
page(centered('logo/pitchside-logo-primary.svg', width=1700) +
     label(120, 1250, 'PITCHSIDE · PRIMARY LOGO · pitchside-logo-primary.svg'), '01-primary-logo.png')

# 2. Standalone symbol
page(centered('logo/pitchside-symbol.svg', height=820) +
     label(120, 1250, 'PITCHSIDE · SYMBOL · pitchside-symbol.svg'), '02-symbol.png')

# 3. Symbol construction
S = 9.0                          # px per grid unit
vb, vw, vh, _ = load('logo/pitchside-symbol.svg')
ox, oy = (W - vw * S) / 2, (H - g.H * S) / 2 - 30
sym, _, _ = place('logo/pitchside-symbol.svg', ox, oy, width=vw * S)
x0 = 0.0  # symbol file is trimmed so slanted x=0 sits at ox
def P(x, y):  # upright grid -> page px
    xs, ys = g.shear((x, y))
    return ox + xs * S, oy + ys * S
guides = []
for gy in range(0, g.H + 1, 6):           # module grid, slanted
    a, b = P(-12, gy), P(g.RIGHT + 12, gy)
    guides.append(f'<line x1="{a[0]}" y1="{a[1]}" x2="{b[0]}" y2="{b[1]}" stroke="{LIME}" stroke-opacity=".10" stroke-width="1.5"/>')
for gx in range(0, g.RIGHT + 1, 6):
    a, b = P(gx, -8), P(gx, g.H + 8)
    guides.append(f'<line x1="{a[0]}" y1="{a[1]}" x2="{b[0]}" y2="{b[1]}" stroke="{LIME}" stroke-opacity=".10" stroke-width="1.5"/>')
def hline(y, text):
    a, b = P(-30, y), P(g.RIGHT + 40, y)
    guides.append(f'<line x1="{ox - 260}" y1="{a[1]}" x2="{ox + vw * S + 200}" y2="{b[1]}" stroke="{LIME}" stroke-width="2" stroke-dasharray="10 8" stroke-opacity=".8"/>')
    guides.append(label(ox + vw * S + 220, a[1] + 9, text, size=24, fill=LIME))
hline(0, 'TOP · 0'); hline(g.CUT, f'CUT CENTRE · {g.CUT}'); hline(g.BOWL, f'BOWL / BASELINE · {g.BOWL}'); hline(g.H, f'STEM FOOT · {g.H}')
for (cx, cy, r) in [(g.R_TL, g.R_TL, g.R_TL), (g.RIGHT - g.R_TR, g.R_TR, g.R_TR), (g.RIGHT - g.R_BR, g.BOWL - g.R_BR, g.R_BR)]:
    pts = ' '.join('%.1f,%.1f' % P(cx + r * __import__('math').cos(t / 30 * 6.2832), cy + r * __import__('math').sin(t / 30 * 6.2832)) for t in range(31))
    guides.append(f'<polyline points="{pts}" fill="none" stroke="{LIME}" stroke-width="2" stroke-opacity=".55"/>')
    c = P(cx, cy); guides.append(f'<circle cx="{c[0]}" cy="{c[1]}" r="5" fill="{LIME}"/>')
    guides.append(label(c[0] + 12, c[1] - 12, f'R{r}', size=22, fill=LIME))
a, b = P(g.STEM + g.GAP / 2, -14), P(g.STEM + g.GAP / 2, g.H + 14)
guides.append(f'<line x1="{a[0]}" y1="{a[1]}" x2="{b[0]}" y2="{b[1]}" stroke="{LIME}" stroke-width="2" stroke-dasharray="10 8" stroke-opacity=".8"/>')
guides.append(label(a[0] + 16, a[1] + 6, f'15° SLANT · CUTS {g.GAP} UNITS WIDE', size=22, fill=LIME))
page(sym + ''.join(guides) + label(120, 1250, f'SYMBOL CONSTRUCTION · {g.H}-UNIT GRID, 6-UNIT MODULE, DRAWN UPRIGHT THEN SLANTED 15°'), '03-symbol-construction.png')

# 4. Lockup construction
lw = 1500
lk, lw_, lh = place('logo/pitchside-logo-primary.svg', (W - lw) / 2, 0, width=lw)
ly = (H - lh) / 2
lk, _, _ = place('logo/pitchside-logo-primary.svg', (W - lw) / 2, ly, width=lw)
k = lh / g.H
cap = g.H / 1.8
lines = []
for yv, t, dy in [(g.BOWL - cap, 'CAP HEIGHT', -12), (g.CUT, 'CUT', -12), (g.BOWL, 'BASELINE', 32)]:
    yy = ly + yv * k
    lines.append(f'<line x1="120" y1="{yy}" x2="{W - 120}" y2="{yy}" stroke="{LIME}" stroke-width="2" stroke-dasharray="10 8" stroke-opacity=".7"/>')
    lines.append(label(120, yy + dy, t, size=20, fill=LIME))
_, svw, _, _ = load('logo/pitchside-symbol.svg')
gx0 = (W - lw) / 2 + svw * k
lines.append(f'<rect x="{gx0}" y="{ly + (g.BOWL - cap) * k}" width="{cap / 2 * k}" height="{cap * k}" fill="{LIME}" fill-opacity=".18"/>')
lines.append(label(gx0 + cap / 4 * k, ly + lh + 60, '½ CAP', size=22, fill=LIME, anchor='middle'))
page(lk + ''.join(lines) + label(120, 1250, 'LOCKUP CONSTRUCTION · SYMBOL = 1.8 × CAP · BOWL FOOT ON BASELINE · CUT JUST ABOVE CAP MID · GAP = ½ CAP'), '04-lockup-construction.png')


# 5-7. Decision sheets
def sheet(items, name, title, width=1500):
    body, n = '', len(items)
    rowh = (H - 200) / n
    for i, (rel, cap_) in enumerate(items):
        _, vw, vh, _ = load(rel)
        w_ = min(width, (rowh - 120) * vw / vh)
        y = 70 + i * rowh
        body += label(120, y + 30, cap_, size=26, fill=LIME, weight=600)
        body += place(rel, (W - w_) / 2, y + 60, width=w_)[0]
    page(body + label(120, 1300, title), name)


sheet([('logo/options/dot-A-square-dot.svg', 'A · ROUNDED-SQUARE DOT (AS IN REFERENCE) · RECOMMENDED'),
       ('logo/options/dot-B-tile-dot.svg', 'B · SLANTED TILE DOT (ECHOES THE SYMBOL)'),
       ('logo/options/dot-C-round-dot.svg', 'C · ROUND DOT (STOCK INTER)')],
      '05-decision-i-dot.png', 'DECISION 1 · THE i-DOT', width=1350)
sheet([('logo/options/lockup-A-reference.svg', 'A · SYMBOL 1.8× CAP, BOWL ON BASELINE · RECOMMENDED'),
       ('logo/options/lockup-B-grid-locked.svg', 'B · SYMBOL 1.6× CAP, CUT ON CAP-MID + BOWL ON BASELINE'),
       ('logo/options/lockup-C-hero.svg', 'C · SYMBOL 2× CAP, CUT ON CAP-MID (HERO PROPORTION)')],
      '06-decision-lockup-proportion.png', 'DECISION 2 · SYMBOL-TO-WORDMARK PROPORTION', width=1350)
body = place('logo/options/symbol-long-stem.svg', 380, 300, height=700)[0] + place('logo/options/symbol-short-stem.svg', 1380, 300, height=700 * 90 / 96)[0]
body += label(380, 230, 'A · STEM FOOT AT 96 · RECOMMENDED', fill=LIME, weight=600) + label(1380, 230, 'B · STEM FOOT AT 90', fill=LIME, weight=600)
page(body + label(120, 1300, 'DECISION 3 · STEM LENGTH (THE ONLY PROPORTION THE REFERENCE DISAGREES WITH ITSELF ON)'), '07-decision-stem-length.png')
