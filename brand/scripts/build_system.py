"""Build the full logo system: colourways, stacked lockup, small-size symbol,
app icons and favicons. Run after scripts/build.py logic is final.
    python3 scripts/build_system.py
"""
import os, sys, subprocess, importlib
sys.path.insert(0, os.path.dirname(__file__))
import geometry as g
import build as b
import wordmark as w

ROOT = b.ROOT
COLOURS = {
    'on-dark': '#F6F6EE',     # Chalk, for Pitch / dark backgrounds
    'on-light': '#0D1F17',    # Pitch, for Chalk / light backgrounds
    'mono-black': '#0A0A0A',  # Night, single-colour print, stamps
    'mono-white': '#FFFFFF',  # pure white, for photography and partner use
}
PITCH, CHALK, ICON_BG, LIME = '#0D1F17', '#F6F6EE', '#1B3A2A', '#D6F16A'


def png(svg, out, w=None, h=None, bg=None):
    cmd = ['rsvg-convert', svg, '-o', out]
    if w: cmd += ['-w', str(w)]
    if h: cmd += ['-h', str(h)]
    if bg: cmd += ['-b', bg]
    subprocess.run(cmd, check=True)


def stacked(fill, path):
    """Symbol centred above the wordmark, for square and narrow spaces."""
    cap = 30.0                       # wordmark cap height in symbol units (symbol = 3.2 x cap)
    s = cap / w.CAP
    laid = w.layout(mods=b.WORDMARKS['A-square-dot'])
    ink0, ink1 = w.ink_bounds(laid)
    wm_w = (ink1 - ink0) * s
    sym_w = b.SYM_X1 - b.SYM_X0
    total_w = max(wm_w, sym_w)
    sx = (total_w - sym_w) / 2
    gap = 1.0 * cap                  # symbol foot to cap top
    dot_top = 1572 * s               # i-dot rises above cap height
    baseline = g.H + gap + cap
    wx = (total_w - wm_w) / 2 - ink0 * s
    body = (f'  <g id="pitchside-symbol">\n{b.symbol_paths(dx=sx, fill=fill, indent="    ")}\n  </g>\n'
            f'  <path id="pitchside-wordmark" fill="{fill}" d="{w.to_d(laid, s, wx, baseline)}"/>')
    return b.write(path, b.svg(total_w, baseline + 19 * s, body, 'Pitchside'))


def small_symbol(fill, path):
    """Symbol with wider cuts (9 units) so they stay open at 32 px and below."""
    old = g.GAP
    g.GAP = 9
    p = b.build_symbol(fill=fill, path=path)
    g.GAP = old
    return p


def symbol_in_square(size, bg, fill, sym_width_ratio, radius_ratio=0.0, stroke=None, small=False, path=None, transparent=False, gap=None):
    """Symbol optically centred in a square. Returns path to SVG."""
    old = g.GAP
    if small: g.GAP = 9
    if gap: g.GAP = gap
    sym_w = b.SYM_X1 - b.SYM_X0
    k = size * sym_width_ratio / sym_w
    sh = g.H * k
    # optical centring: the bowl carries the visual weight, so nudge the
    # symbol 2% of the tile left of its geometric centre
    dx = (size - sym_w * k) / 2 - size * 0.02
    dy = (size - sh) / 2
    paths = b.symbol_paths(dx=dx, dy=dy, scale=k, fill=fill, indent='  ')
    g.GAP = old
    rx = size * radius_ratio
    parts = []
    if not transparent:
        parts.append(f'  <rect width="{size}" height="{size}" rx="{b.fmt(rx)}" fill="{bg}"/>')
    if stroke:
        sw = size * 0.012
        parts.append(f'  <rect x="{b.fmt(sw/2)}" y="{b.fmt(sw/2)}" width="{b.fmt(size-sw)}" height="{b.fmt(size-sw)}" rx="{b.fmt(rx - sw/2)}" fill="none" stroke="{stroke}" stroke-width="{b.fmt(sw)}"/>')
    parts.append(paths)
    return b.write(path, b.svg(size, size, '\n'.join(parts), 'Pitchside'))


if __name__ == '__main__':
    out = []
    # 1. Lockups and symbols in every colourway
    for name, fill in COLOURS.items():
        out.append(b.build_lockup('A-reference', 'A-square-dot', fill=fill, path=f'logo/horizontal/pitchside-logo-horizontal-{name}.svg'))
        out.append(stacked(fill, f'logo/stacked/pitchside-logo-stacked-{name}.svg'))
        out.append(b.build_symbol(fill=fill, path=f'logo/symbol/pitchside-symbol-{name}.svg'))
        out.append(small_symbol(fill, f'logo/symbol/pitchside-symbol-small-{name}.svg'))
        out.append(b.build_wordmark('A-square-dot', fill=fill, path=f'logo/wordmark/pitchside-wordmark-{name}.svg'))
    # keep the approved masters at the top level too
    out.append(b.build_lockup('A-reference', 'A-square-dot', path='logo/pitchside-logo-primary.svg'))
    out.append(b.build_symbol())
    out.append(b.build_wordmark('A-square-dot'))

    # 2. App icons
    os.makedirs(os.path.join(ROOT, 'app-icon/png'), exist_ok=True)
    ios = symbol_in_square(1024, ICON_BG, CHALK, 0.54, path='app-icon/app-icon-ios-1024.svg')          # iOS masks corners itself
    rounded = symbol_in_square(1024, ICON_BG, CHALK, 0.54, radius_ratio=0.225, path='app-icon/app-icon-rounded.svg')
    showcase = symbol_in_square(1024, ICON_BG, CHALK, 0.54, radius_ratio=0.225, stroke=LIME, path='app-icon/app-icon-showcase-lime-edge.svg')
    maskable = symbol_in_square(512, ICON_BG, CHALK, 0.44, path='app-icon/app-icon-maskable-512.svg')   # PWA safe zone 80%
    fg = symbol_in_square(432, None, CHALK, 0.40, transparent=True, path='app-icon/android-adaptive-foreground.svg')  # 108dp grid x4
    b.write('app-icon/android-adaptive-background.svg', b.svg(432, 432, f'  <rect width="432" height="432" fill="{ICON_BG}"/>', 'Pitchside icon background'))
    png(ios, os.path.join(ROOT, 'app-icon/png/app-icon-ios-1024.png'), 1024)
    png(rounded, os.path.join(ROOT, 'app-icon/png/app-icon-rounded-1024.png'), 1024)
    png(showcase, os.path.join(ROOT, 'app-icon/png/app-icon-showcase-1024.png'), 1024)
    for s in (512, 192):
        png(maskable if s == 512 else ios, os.path.join(ROOT, f'app-icon/png/icon-{s}{"-maskable" if s == 512 else ""}.png'), s)
    png(rounded, os.path.join(ROOT, 'app-icon/png/icon-512.png'), 512)

    # 3. Favicons (small-size symbol with wider cuts)
    os.makedirs(os.path.join(ROOT, 'favicon'), exist_ok=True)
    fav = symbol_in_square(64, PITCH, CHALK, 0.72, radius_ratio=0.22, small=True, path='favicon/favicon.svg')
    png(fav, os.path.join(ROOT, 'favicon/favicon-32.png'), 32)
    fav16 = symbol_in_square(64, PITCH, CHALK, 0.76, radius_ratio=0.18, gap=13, path='favicon/favicon-16-source.svg')  # extra-wide cuts survive 16 px
    png(fav16, os.path.join(ROOT, 'favicon/favicon-16.png'), 16)
    png(fav, os.path.join(ROOT, 'favicon/favicon-48.png'), 48)
    touch = symbol_in_square(180, ICON_BG, CHALK, 0.56, path='favicon/apple-touch-icon.svg')
    png(touch, os.path.join(ROOT, 'favicon/apple-touch-icon.png'), 180)
    from PIL import Image
    ims = [Image.open(os.path.join(ROOT, f'favicon/favicon-{s}.png')) for s in (16, 32, 48)]
    ims[2].save(os.path.join(ROOT, 'favicon/favicon.ico'), sizes=[(16, 16), (32, 32), (48, 48)], append_images=ims[:2])
    for p in out: print(os.path.relpath(p, ROOT))
