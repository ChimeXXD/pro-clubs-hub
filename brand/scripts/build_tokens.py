"""Single source of truth for design tokens.
Writes tokens/tokens.json (W3C design-tokens format) and tokens/tokens.css.
    python3 scripts/build_tokens.py
"""
import json, os
ROOT = os.path.join(os.path.dirname(__file__), '..')

C = lambda v, d=None: {'$type': 'color', '$value': v, **({'$description': d} if d else {})}
D = lambda v, d=None: {'$type': 'dimension', '$value': v, **({'$description': d} if d else {})}

tokens = {
  'color': {
    'brand': {
      'pitch':      C('#0D1F17', 'Primary background. The ground everything sits on.'),
      'turf':       C('#2E5E3D', 'Secondary green: fills, selected states, illustration.'),
      'floodlight': C('#D6F16A', 'Accent. Primary actions and highlights only (max ~5% of a screen).'),
      'chalk':      C('#F6F6EE', 'Logo, headings, primary text on dark.'),
      'night':      C('#0A0A0A', 'Deepest neutral: overlays, mono logo, print.'),
    },
    'pitch': {
      '950': C('#07120D'), '900': C('#0D1F17'), '850': C('#11271D'), '800': C('#163023'),
      '750': C('#1B3A2A'), '700': C('#224634'),
    },
    'turf': {'600': C('#2E5E3D'), '500': C('#3D7650'), '400': C('#5A9268')},
    'chalk': {
      '50': C('#FBFBF7'), '100': C('#F6F6EE'), '200': C('#E7E9DE'), '300': C('#C8CDBF'),
      '400': C('#A3AD9F', 'Lowest-contrast text allowed on dark surfaces (>= 5.3:1).'),
      '500': C('#7F8C7F', 'Disabled and placeholder only. Not for readable text.'),
    },
    'floodlight': {
      '200': C('#EEF9BF'), '300': C('#E3F598'), '400': C('#D6F16A'), '500': C('#C3DE52'),
      '600': C('#A2BC33'), '800': C('#55661A', 'Floodlight-family text on light backgrounds.'),
    },
    'feedback': {
      'positive': C('#6FD68A'), 'warning': C('#F1B84A'), 'danger': C('#F26D5B'), 'info': C('#79BEF2'),
    },
    'rating': {
      'elite':   C('#D6F16A', 'Attribute 90-99'),
      'great':   C('#8FDB7A', 'Attribute 80-89'),
      'good':    C('#E9D45C', 'Attribute 70-79'),
      'average': C('#EFA14A', 'Attribute 60-69'),
      'low':     C('#EE6A55', 'Attribute below 60'),
    },
    'semantic': {
      'bg':              C('{color.pitch.900}'),
      'bg-sunken':       C('{color.pitch.950}'),
      'surface':         C('{color.pitch.850}', 'Cards, panels'),
      'surface-raised':  C('{color.pitch.800}', 'Hover, popovers, inputs'),
      'surface-strong':  C('{color.pitch.750}', 'Pressed, selected rows, modal'),
      'border':          C('rgba(246,246,238,0.10)', 'Hairlines and card borders'),
      'border-strong':   C('rgba(246,246,238,0.20)', 'Inputs, focusable outlines'),
      'grid-line':       C('rgba(246,246,238,0.06)', 'Background grid motif'),
      'text':            C('{color.chalk.100}'),
      'text-secondary':  C('{color.chalk.300}'),
      'text-tertiary':   C('{color.chalk.400}'),
      'text-disabled':   C('{color.chalk.500}'),
      'text-on-accent':  C('{color.pitch.900}'),
      'accent':          C('{color.floodlight.400}'),
      'accent-hover':    C('{color.floodlight.300}'),
      'accent-pressed':  C('{color.floodlight.500}'),
      'accent-subtle':   C('rgba(214,241,106,0.12)'),
      'focus':           C('{color.floodlight.400}'),
      'selected':        C('{color.turf.600}'),
    },
  },
  'font': {
    'family': {
      'display': {'$type': 'fontFamily', '$value': ['Inter Display', 'Inter', 'system-ui', 'sans-serif'], '$description': 'Inter at optical size 32. Headings and big numbers.'},
      'text':    {'$type': 'fontFamily', '$value': ['Inter', 'system-ui', 'sans-serif'], '$description': 'Body copy and UI.'},
      'mono':    {'$type': 'fontFamily', '$value': ['JetBrains Mono', 'ui-monospace', 'monospace'], '$description': 'Share codes only.'},
    },
    'weight': {k: {'$type': 'fontWeight', '$value': v} for k, v in
               {'regular': 400, 'medium': 500, 'semibold': 600, 'bold': 700, 'extrabold': 800}.items()},
  },
  'type': {  # size / line-height / tracking / weight / family
    'display-2xl': {'$type': 'typography', '$value': {'fontFamily': '{font.family.display}', 'fontSize': '72px', 'lineHeight': '1.0', 'letterSpacing': '-0.035em', 'fontWeight': 700}},
    'display-xl':  {'$type': 'typography', '$value': {'fontFamily': '{font.family.display}', 'fontSize': '56px', 'lineHeight': '1.04', 'letterSpacing': '-0.03em', 'fontWeight': 700}},
    'display-lg':  {'$type': 'typography', '$value': {'fontFamily': '{font.family.display}', 'fontSize': '44px', 'lineHeight': '1.08', 'letterSpacing': '-0.025em', 'fontWeight': 700}},
    'heading-1':   {'$type': 'typography', '$value': {'fontFamily': '{font.family.display}', 'fontSize': '34px', 'lineHeight': '1.15', 'letterSpacing': '-0.02em', 'fontWeight': 700}},
    'heading-2':   {'$type': 'typography', '$value': {'fontFamily': '{font.family.display}', 'fontSize': '26px', 'lineHeight': '1.2', 'letterSpacing': '-0.015em', 'fontWeight': 700}},
    'heading-3':   {'$type': 'typography', '$value': {'fontFamily': '{font.family.text}', 'fontSize': '20px', 'lineHeight': '1.3', 'letterSpacing': '-0.01em', 'fontWeight': 600}},
    'heading-4':   {'$type': 'typography', '$value': {'fontFamily': '{font.family.text}', 'fontSize': '17px', 'lineHeight': '1.35', 'letterSpacing': '-0.005em', 'fontWeight': 600}},
    'body-lg':     {'$type': 'typography', '$value': {'fontFamily': '{font.family.text}', 'fontSize': '18px', 'lineHeight': '1.55', 'letterSpacing': '0', 'fontWeight': 400}},
    'body':        {'$type': 'typography', '$value': {'fontFamily': '{font.family.text}', 'fontSize': '16px', 'lineHeight': '1.5', 'letterSpacing': '0', 'fontWeight': 400}},
    'body-sm':     {'$type': 'typography', '$value': {'fontFamily': '{font.family.text}', 'fontSize': '14px', 'lineHeight': '1.45', 'letterSpacing': '0', 'fontWeight': 400}},
    'caption':     {'$type': 'typography', '$value': {'fontFamily': '{font.family.text}', 'fontSize': '12px', 'lineHeight': '1.4', 'letterSpacing': '0.005em', 'fontWeight': 400}},
    'label':       {'$type': 'typography', '$value': {'fontFamily': '{font.family.text}', 'fontSize': '14px', 'lineHeight': '1.2', 'letterSpacing': '0', 'fontWeight': 500}},
    'overline':    {'$type': 'typography', '$value': {'fontFamily': '{font.family.text}', 'fontSize': '11px', 'lineHeight': '1.2', 'letterSpacing': '0.14em', 'fontWeight': 600, 'textTransform': 'uppercase'}},
    'stat-xl':     {'$type': 'typography', '$value': {'fontFamily': '{font.family.display}', 'fontSize': '48px', 'lineHeight': '1', 'letterSpacing': '-0.03em', 'fontWeight': 700, 'fontFeatureSettings': '"tnum" 1'}},
    'stat-lg':     {'$type': 'typography', '$value': {'fontFamily': '{font.family.display}', 'fontSize': '28px', 'lineHeight': '1', 'letterSpacing': '-0.02em', 'fontWeight': 700, 'fontFeatureSettings': '"tnum" 1'}},
    'stat':        {'$type': 'typography', '$value': {'fontFamily': '{font.family.text}', 'fontSize': '15px', 'lineHeight': '1', 'letterSpacing': '0', 'fontWeight': 600, 'fontFeatureSettings': '"tnum" 1'}},
  },
  'space': {k: D(f'{v}px') for k, v in
            {'0': 0, '0-5': 2, '1': 4, '2': 8, '3': 12, '4': 16, '5': 20, '6': 24, '8': 32, '10': 40, '12': 48, '16': 64, '20': 80, '24': 96, '32': 128}.items()},
  'radius': {k: D(v) for k, v in
             {'none': '0', 'xs': '4px', 'sm': '6px', 'md': '10px', 'lg': '14px', 'xl': '20px', '2xl': '28px', 'pill': '999px'}.items()},
  'border': {'width': {'hairline': D('1px'), 'strong': D('1.5px'), 'focus': D('2px')}},
  'shadow': {
    'sm': {'$type': 'shadow', '$value': '0 1px 2px rgba(0,0,0,0.35)'},
    'md': {'$type': 'shadow', '$value': '0 8px 24px -8px rgba(0,0,0,0.55)'},
    'lg': {'$type': 'shadow', '$value': '0 24px 56px -16px rgba(0,0,0,0.65)'},
    'inset': {'$type': 'shadow', '$value': 'inset 0 1px 0 rgba(246,246,238,0.06)'},
    'focus': {'$type': 'shadow', '$value': '0 0 0 2px #0D1F17, 0 0 0 4px #D6F16A'},
  },
  'motion': {
    'duration': {'fast': {'$type': 'duration', '$value': '120ms'}, 'base': {'$type': 'duration', '$value': '200ms'}, 'slow': {'$type': 'duration', '$value': '320ms'}},
    'easing': {'standard': {'$type': 'cubicBezier', '$value': [0.2, 0, 0, 1]}, 'exit': {'$type': 'cubicBezier', '$value': [0.4, 0, 1, 1]}},
  },
  'layout': {
    'slant': {'$type': 'number', '$value': 15, '$description': 'Brand angle in degrees, from the symbol.'},
    'container': D('1240px'), 'gutter': D('24px'), 'gutter-mobile': D('16px'),
    'breakpoint': {'sm': D('480px'), 'md': D('768px'), 'lg': D('1024px'), 'xl': D('1280px')},
    'nav-height': D('64px'),
  },
}


def resolve(v):
    if isinstance(v, str) and v.startswith('{'):
        path = v.strip('{}').split('.')
        return 'var(--ps-' + '-'.join(path) + ')'
    return v


def flatten(node, prefix):
    for k, v in node.items():
        if k.startswith('$'): continue
        name = f'{prefix}-{k}'
        if isinstance(v, dict) and '$value' in v:
            yield name, v
        elif isinstance(v, dict):
            yield from flatten(v, name)


lines = []
for name, t in flatten(tokens, '--ps'):
    typ, val = t['$type'], t['$value']
    if typ == 'typography':
        val = dict(val)
        fam = val['fontFamily']
        lines.append(f'  {name}-family: {resolve(fam)};')
        lines.append(f'  {name}-size: {val["fontSize"]};')
        lines.append(f'  {name}-line: {val["lineHeight"]};')
        lines.append(f'  {name}-tracking: {val["letterSpacing"]};')
        lines.append(f'  {name}-weight: {val["fontWeight"]};')
        continue
    if typ == 'fontFamily':
        val = ', '.join(f'"{f}"' if ' ' in f else f for f in val)
    elif typ == 'cubicBezier':
        val = 'cubic-bezier(' + ', '.join(map(str, val)) + ')'
    lines.append(f'  {name}: {resolve(val)};')

css = ('/* Pitchside design tokens. Generated by scripts/build_tokens.py. Do not edit by hand. */\n'
       ':root {\n' + '\n'.join(lines) + '\n}\n')
os.makedirs(os.path.join(ROOT, 'tokens'), exist_ok=True)
json.dump(tokens, open(os.path.join(ROOT, 'tokens/tokens.json'), 'w'), indent=2)
open(os.path.join(ROOT, 'tokens/tokens.css'), 'w').write(css)
print(len(lines), 'custom properties')
