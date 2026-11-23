"""Outline the built SVGs (red) over the reference hero logo, each element
at the reference's own scale, to check the reconstruction."""
import subprocess, sys
from PIL import Image, ImageFilter
REF = sys.argv[1]
S = 6
ref = Image.open(REF).convert('RGB')
big = ref.resize((ref.width * S, ref.height * S), Image.LANCZOS)
def outline(svg, h_px, left, top):
    subprocess.run(['rsvg-convert', '-h', str(int(h_px * S)), svg, '-o', '/tmp/_o.png'], check=True)
    m = Image.open('/tmp/_o.png').split()[-1]
    c = Image.new('L', big.size, 0); c.paste(m, (int(left * S), int(top * S)))
    e = c.filter(ImageFilter.FIND_EDGES).point(lambda v: 255 if v > 60 else 0).filter(ImageFilter.MaxFilter(3))
    big.paste(Image.new('RGB', big.size, (255, 50, 50)), mask=e)
outline('logo/pitchside-symbol.svg', 79, 82, 132)
cap = 39.5
outline('logo/pitchside-wordmark.svg', 1591 / 1490 * cap, 200.5, 186 - 1572 / 1490 * cap)
big.crop((70 * S, 120 * S, 470 * S, 215 * S)).save('previews/logo/08-fidelity-check.png')
