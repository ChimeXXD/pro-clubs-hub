"""Social graphics: SVG sources (live text in Inter) + PNG exports.
    python3 scripts/build_social.py
"""
import os, re, subprocess, math
ROOT = os.path.join(os.path.dirname(__file__), '..')
P, TURF, LIME, CH, MUTE, SURF = '#0D1F17', '#2E5E3D', '#D6F16A', '#F6F6EE', '#A3AD9F', '#11271D'
T = math.tan(math.radians(15))
RAT = lambda v: '#D6F16A' if v >= 90 else '#8FDB7A' if v >= 80 else '#E9D45C' if v >= 70 else '#EFA14A' if v >= 60 else '#EE6A55'


def nest(rel, x, y, w=None, h=None):
    s = open(os.path.join(ROOT, rel)).read()
    vb = re.search(r'viewBox="([^"]+)"', s).group(1); _, _, vw, vh = map(float, vb.split())
    inner = re.sub(r'^.*?</title>', '', s, flags=re.S).rsplit('</svg>', 1)[0]
    if w: h = w * vh / vw
    else: w = h * vw / vh
    return f'<svg x="{x}" y="{y}" width="{w:.1f}" height="{h:.1f}" viewBox="{vb}">{inner}</svg>'


def grid(w, h, step=60, op=0.06):
    lines = ''.join(f'<path d="M{x}.5 0V{h}"/>' for x in range(0, w, step)) + ''.join(f'<path d="M0 {y}.5H{w}"/>' for y in range(0, h, step))
    return f'<g stroke="{CH}" stroke-opacity="{op}" fill="none">{lines}</g>'


def cross(x, y, s=8):
    return f'<path d="M{x} {y-s}V{y+s}M{x-s} {y}H{x+s}" stroke="{CH}" stroke-opacity=".4" stroke-width="1.2"/>'


def tag(x, y, text, h=40, fill=TURF, color=CH, size=17):
    w = len(text) * size * 0.72 + 2 * (h * T + 12)
    return (f'<path d="M{x + h*T:.1f} {y}H{x + w:.1f}L{x + w - h*T:.1f} {y + h}H{x}Z" fill="{fill}"/>'
            f'<text x="{x + w/2:.1f}" y="{y + h/2 + size*0.36:.1f}" text-anchor="middle" fill="{color}" font-family="Inter" font-weight="700" font-size="{size}" letter-spacing="1.2">{text}</text>'), w


def text(x, y, s, size, weight=700, fill=CH, family='Inter Display', anchor='start', ls=None, op=None):
    ls = f' letter-spacing="{ls}"' if ls is not None else ''
    op = f' fill-opacity="{op}"' if op else ''
    return f'<text x="{x}" y="{y}" fill="{fill}"{op} font-family="{family}" font-weight="{weight}" font-size="{size}" text-anchor="{anchor}"{ls}>{s}</text>'


def write(name, w, h, body):
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">\n<rect width="{w}" height="{h}" fill="{P}"/>\n{body}\n</svg>\n'
    p = os.path.join(ROOT, 'social', name + '.svg'); open(p, 'w').write(svg)
    subprocess.run(['rsvg-convert', p, '-o', os.path.join(ROOT, 'social/png', name + '.png')], check=True)
    print('social/' + name)


# 1. Open Graph / link preview 1200x630
b = grid(1200, 630) + cross(600, 120) + cross(600, 540) + cross(60, 540)
b += nest('logo/horizontal/pitchside-logo-horizontal-on-dark.svg', 72, 66, h=44)
b += text(72, 330, 'Build', 112, ls=-3.5) + text(72, 440, 'Smarter.', 112, ls=-3.5)
b += text(74, 510, 'Pro Clubs builds, archetypes and face guides.', 26, 400, CH, 'Inter', op=.75)
b += nest('graphics/pitch/pitch-formation-433.svg', 660, 170, w=480)
write('og-image-1200x630', 1200, 630, b)

# 2. Build share card, Instagram portrait 1080x1350
attrs = [('Acceleration', 95), ('Sprint Speed', 92), ('Agility', 93), ('Dribbling', 90), ('Finishing', 84), ('Strength', 58)]
b = grid(1080, 1350, 72)
t1, w1 = tag(80, 96, 'LW', 48, TURF, CH, 20)
t2, _ = tag(80 + w1 + 12, 96, 'META', 48, LIME, P, 20)
b += t1 + t2
b += text(80, 260, 'Pacey Inside', 92, ls=-2.8) + text(80, 360, 'Forward', 92, ls=-2.8)
b += text(80, 420, 'Wide Threat · 175 cm · 68 kg', 30, 400, MUTE, 'Inter')
b += text(1000, 300, '88', 190, anchor='end', ls=-6) + text(1000, 350, 'OVR', 24, 600, MUTE, 'Inter', 'end', 3)
b += f'<rect x="80" y="480" width="920" height="600" rx="24" fill="{SURF}" stroke="{CH}" stroke-opacity=".1"/>'
for i, (n, v) in enumerate(attrs):
    y = 560 + i * 88
    b += text(124, y, n, 30, 500, '#C8CDBF', 'Inter') + text(956, y, str(v), 36, 700, RAT(v), 'Inter', 'end')
    b += f'<rect x="124" y="{y + 22}" width="832" height="8" rx="4" fill="{CH}" fill-opacity=".08"/><rect x="124" y="{y + 22}" width="{832 * v / 100:.0f}" height="8" rx="4" fill="{RAT(v)}"/>'
b += nest('logo/horizontal/pitchside-logo-horizontal-on-dark.svg', 80, 1180, h=48)
b += f'<rect x="704" y="1172" width="296" height="64" rx="12" fill="none" stroke="{CH}" stroke-opacity=".25" stroke-dasharray="6 6"/>' + text(852, 1214, 'PS-LW-7Q4K-9XA2', 24, 500, CH, 'JetBrains Mono', 'middle')
write('build-share-1080x1350', 1080, 1350, b)

# 3. Story 1080x1920: meta build of the week
b = grid(1080, 1920, 72) + cross(540, 160) + cross(540, 1760)
b += nest('logo/symbol/pitchside-symbol-on-dark.svg', 80, 120, h=64)
b += text(80, 380, 'META BUILD', 30, 700, LIME, 'Inter', ls=6) + text(80, 420, 'OF THE WEEK', 30, 700, LIME, 'Inter', ls=6)
b += text(80, 600, 'Target', 150, ls=-5) + text(80, 750, 'Striker', 150, ls=-5)
t1, _ = tag(80, 810, 'ST', 52, TURF, CH, 22); b += t1
b += text(1000, 1010, '87', 260, anchor='end', ls=-8) + text(1000, 1060, 'OVR', 28, 600, MUTE, 'Inter', 'end', 3)
for i, (n, v) in enumerate([('Finishing', 94), ('Heading Acc.', 91), ('Shot Power', 90), ('Strength', 89)]):
    y = 1200 + i * 110
    b += text(80, y, n, 38, 500, '#C8CDBF', 'Inter') + text(1000, y, str(v), 46, 700, RAT(v), 'Inter', 'end')
    b += f'<rect x="80" y="{y + 28}" width="920" height="10" rx="5" fill="{CH}" fill-opacity=".08"/><rect x="80" y="{y + 28}" width="{920 * v / 100:.0f}" height="10" rx="5" fill="{RAT(v)}"/>'
b += f'<rect x="80" y="1690" width="920" height="110" rx="55" fill="{LIME}"/>' + text(540, 1760, 'Get the full build on Pitchside', 36, 700, P, 'Inter', 'middle')
write('story-1080x1920', 1080, 1920, b)

# 4. X / Twitter header 1500x500 (keep the left ~400px clear for the avatar overlap)
b = grid(1500, 500, 50)
b += f'<g opacity=".9">{nest("logo/symbol/pitchside-symbol-on-dark.svg", 1010, -60, h=620).replace("#F6F6EE", TURF)}</g>'
b += nest('logo/horizontal/pitchside-logo-horizontal-on-dark.svg', 470, 190, h=96)
b += text(474, 350, 'Build smarter. The Pro Clubs companion.', 28, 400, CH, 'Inter', op=.7)
write('x-header-1500x500', 1500, 500, b)

# 5. Profile avatar 800x800 (social profile picture; circle-safe)
b = nest('logo/symbol/pitchside-symbol-on-dark.svg', 400 - 0.5 * 360 * 120.74 / 96 - 10, 220, h=360)
write('avatar-800', 800, 800, f'<rect width="800" height="800" fill="#1B3A2A"/>' + b)
