"""Pitchside wordmark: Inter Bold (OFL) outlines, re-spaced by hand and
converted to plain paths so no font is needed to render the logo."""
import math
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.recordingPen import RecordingPen, DecomposingRecordingPen
from fontTools.pens.boundsPen import BoundsPen

FONT = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"
TEXT = "Pitchside"
CAP = 1490  # Inter cap height (font units)

# Spacing in font units. Letter positions were fitted to the reference
# (average +18 units per pair), then balanced by eye: the open P and c get
# a little more room, the d-e pair a little less.
TRACK = 20
PAIRS = {("P", "i"): 20, ("c", "h"): 16, ("d", "e"): -10}

_font = TTFont(FONT)
_gs = _font.getGlyphSet()
_cmap = _font.getBestCmap()
_hmtx = _font['hmtx']


def glyph_contours(ch):
    """Return list of contours (each a RecordingPen value list) for a char."""
    name = _cmap[ord(ch)]
    rp = DecomposingRecordingPen(_gs)
    _gs[name].draw(rp)
    contours, cur = [], []
    for op, args in rp.value:
        cur.append((op, args))
        if op in ('closePath', 'endPath'):
            contours.append(cur); cur = []
    return contours, _hmtx[name][0]


def contour_bounds(c):
    xs = [p[0] for op, args in c for p in args]
    ys = [p[1] for op, args in c for p in args]
    return min(xs), min(ys), max(xs), max(ys)


def layout(text=TEXT, mods=None):
    """Return list of (x_offset, contours) with spacing applied."""
    mods = mods or {}
    out, x = [], 0
    for i, ch in enumerate(text):
        contours, adv = glyph_contours(ch)
        if ch in mods:
            contours = mods[ch](contours, i)
        out.append((x, contours))
        nxt = text[i + 1] if i + 1 < len(text) else None
        x += adv + (TRACK + PAIRS.get((ch, nxt), 0) if nxt else 0)
    return out


def ink_bounds(laid):
    xs0, xs1 = [], []
    for x, cs in laid:
        for c in cs:
            a, b, cc, d = contour_bounds(c)
            xs0.append(a + x); xs1.append(cc + x)
    return min(xs0), max(xs1)


def to_d(laid, scale, dx, baseline):
    """Path data in SVG space: scale font units, flip y, shift."""
    parts = []
    for x, cs in laid:
        pen = SVGPathPen(None, ntos=lambda v: (f"{v:.2f}".rstrip('0').rstrip('.')) or '0')
        tp = TransformPen(pen, (scale, 0, 0, -scale, dx + x * scale, baseline))
        for c in cs:
            for op, args in c:
                getattr(tp, op)(*args)
        parts.append(pen.getCommands())
    return ''.join(parts)


# ---- Tittle (i-dot) treatments ----
SLANT_T = math.tan(math.radians(15))
DOT = 300           # = i stem width, so the dot sits square on the stem
DOT_CY = 1418       # Inter's own dot centre
DOT_R = 72          # corner radius of the rounded-square dot (24% of DOT)
KAPPA = 0.5522847498


def _find_dot(contours):
    return max(range(len(contours)), key=lambda k: contour_bounds(contours[k])[1])


def _stem_cx(contours, dot_idx):
    stem = [c for k, c in enumerate(contours) if k != dot_idx][0]
    x0, _, x1, _ = contour_bounds(stem)
    return (x0 + x1) / 2


def square_tittle(contours, i):
    """Rounded-square dot, as seen in the reference (replaces Inter's round dot)."""
    idx = _find_dot(contours)
    cx = _stem_cx(contours, idx)
    x0, x1 = cx - DOT / 2, cx + DOT / 2
    y0, y1 = DOT_CY - DOT / 2, DOT_CY + DOT / 2
    r, k = DOT_R, DOT_R * KAPPA
    c = [('moveTo', ((x0 + r, y0),)),
         ('lineTo', ((x1 - r, y0),)),
         ('curveTo', ((x1 - r + k, y0), (x1, y0 + r - k), (x1, y0 + r))),
         ('lineTo', ((x1, y1 - r),)),
         ('curveTo', ((x1, y1 - r + k), (x1 - r + k, y1), (x1 - r, y1))),
         ('lineTo', ((x0 + r, y1),)),
         ('curveTo', ((x0 + r - k, y1), (x0, y1 - r + k), (x0, y1 - r))),
         ('lineTo', ((x0, y0 + r),)),
         ('curveTo', ((x0, y0 + r - k), (x0 + r - k, y0), (x0 + r, y0))),
         ('closePath', ())]
    return [cc for kk, cc in enumerate(contours) if kk != idx] + [c]


def round_tittle(contours, i):
    """Inter's stock round dot (unchanged)."""
    return contours



def tile_tittle(contours, i):
    """Dot drawn as a 15-degree slanted tile, echoing the symbol's quarters."""
    idx = _find_dot(contours)
    cx = _stem_cx(contours, idx)
    y0, y1 = DOT_CY - DOT / 2, DOT_CY + DOT / 2
    w = DOT * 0.96
    off = DOT * SLANT_T / 2
    pts = [(cx - w / 2 - off, y0), (cx + w / 2 - off, y0),
           (cx + w / 2 + off, y1), (cx - w / 2 + off, y1)]
    tile = [('moveTo', (pts[0],)), ('lineTo', (pts[1],)), ('lineTo', (pts[2],)),
            ('lineTo', (pts[3],)), ('closePath', ())]
    return [c for k, c in enumerate(contours) if k != idx] + [tile]
