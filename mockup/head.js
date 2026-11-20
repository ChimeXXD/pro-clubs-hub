// Classic script (modules are blocked on file:// pages). Exposes window.Head.
(() => {
// Stand-in head for the mockup: a faceless grey mannequin bust, like the option tiles in
// WhatsApp's avatar editor. It is nobody's likeness (D-10). In the app the same viewer
// shows Chime's in-game capture: ~36 frames of the head turning (A-16).

let uid = 0;
const f = (n) => n.toFixed(1);

// Head outline: an egg, narrower at the chin. Centre (0, -22), crown -82, chin 36.
function headPath(rx) {
  const pts = [];
  for (let i = 0; i <= 48; i++) {
    const t = (i / 48) * Math.PI * 2;
    const lower = Math.max(0, -Math.cos(t));
    const x = rx * Math.sin(t) * (1 - 0.26 * Math.pow(lower, 1.6));
    const y = -22 - (Math.cos(t) >= 0 ? 60 : 58) * Math.cos(t);
    pts.push(`${i ? "L" : "M"}${f(x)} ${f(y)}`);
  }
  return pts.join("") + "Z";
}

function headSvg(angleDeg, { testid = "head", size = "100%", label = "Stand-in head" } = {}) {
  const a = (angleDeg * Math.PI) / 180;
  const s = Math.sin(a);
  const c = Math.cos(a);
  const id = `mq${++uid}`;
  const rx = 41 + 7 * Math.abs(s); // a head is deeper than it is wide
  const sw = 34 + 62 * Math.abs(c); // shoulders narrow as it turns side-on

  // Ears sit at +-90 degrees round the head
  const ear = (side) => {
    const x = side * rx * c * 0.98;
    const near = side * -s; // > 0: facing the viewer
    const w = 4 + 3.5 * Math.abs(s);
    return { near, svg: `<ellipse cx="${f(x)}" cy="-14" rx="${f(w)}" ry="10" fill="url(#${id}-skin)" stroke="var(--mannequin-line)" stroke-width="0.8"/>` };
  };
  const ears = [ear(-1), ear(1)];

  // Eye sockets and nose: shading on the front of the head, sliding with the turn
  const feature = (az, y, w, h, op) => {
    const z = Math.cos(a + az);
    if (z < 0.05) return "";
    const x = rx * 0.92 * Math.sin(a + az);
    return `<ellipse cx="${f(x)}" cy="${y}" rx="${f(w * (0.35 + 0.65 * z))}" ry="${h}" fill="var(--mannequin-shade)" opacity="${f(op * z)}"/>`;
  };
  const noseX = rx * 0.96 * s;
  const noseTip = noseX + 6 * s;
  const nose = c < -0.05 ? "" : `<path d="M${f(noseX - 3 * c)} -24 Q${f(noseTip)} -6 ${f(noseTip)} -2 Q${f(noseX + 4 * s)} 4 ${f(noseX - 5 * c * Math.sign(c || 1))} 3Z" fill="url(#${id}-skin)" stroke="var(--mannequin-line)" stroke-width="${f(0.8 * Math.abs(s))}"/>`;

  return `<svg data-testid="${testid}" viewBox="-100 -96 200 196" width="${size}" height="${size}" role="img" aria-label="${label}">
    <defs>
      <radialGradient id="${id}-skin" cx="${f(0.42 - 0.12 * s)}" cy="0.32" r="0.75">
        <stop offset="0" stop-color="var(--mannequin-hi)"/><stop offset="0.55" stop-color="var(--mannequin-mid)"/><stop offset="1" stop-color="var(--mannequin-lo)"/>
      </radialGradient>
      <linearGradient id="${id}-torso" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="var(--mannequin-torso-hi)"/><stop offset="1" stop-color="var(--mannequin-torso-lo)"/>
      </linearGradient>
    </defs>
    <path d="M${f(-sw - 10)} 100 C${f(-sw - 6)} 76 ${f(-sw + 6)} 64 -18 58 L18 58 C${f(sw - 6)} 64 ${f(sw + 6)} 76 ${f(sw + 10)} 100Z" fill="url(#${id}-torso)"/>
    <path d="M-17 22 L-18 62 Q0 70 18 62 L17 22Z" fill="url(#${id}-skin)"/>
    <ellipse cx="0" cy="40" rx="18" ry="6" fill="var(--mannequin-shade)" opacity="0.35"/>
    ${ears.filter((e) => e.near <= 0).map((e) => e.svg).join("")}
    <path d="${headPath(rx)}" fill="url(#${id}-skin)"/>
    ${ears.filter((e) => e.near > 0).map((e) => e.svg).join("")}
    ${feature(-0.38, -20, 9, 5, 0.2)}${feature(0.38, -20, 9, 5, 0.2)}
    ${feature(0, 16, 10, 2.4, 0.22)}
    ${nose}
  </svg>`;
}

// Drag to turn plus angle buttons. Angles match A-16: Front, three-quarter, Side, In a match.
const ANGLES = { front: 0, "three-quarter": 35, side: 90 };

function mountSpin(viewer) {
  const stage = viewer.querySelector("[data-spin-stage]");
  const buttons = [...viewer.querySelectorAll("[data-angle]")];
  const id = stage.dataset.headId;
  let angle = Number(viewer.dataset.start || 0);
  let anim = 0;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const draw = () => {
    stage.innerHTML = headSvg(angle, { testid: id });
    // The stage is a slider: report the turn as -180..180 degrees
    const deg = Math.round(((((angle % 360) + 540) % 360) - 180));
    stage.setAttribute("aria-valuenow", String(deg));
    stage.setAttribute("aria-valuetext", `Turned ${deg} degrees`);
  };
  const select = (name) => buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.angle === name)));
  const tween = (to) => {
    cancelAnimationFrame(anim);
    const from = angle;
    const delta = ((((to - from) % 360) + 540) % 360) - 180;
    if (reduce) return ((angle = to), draw());
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 300);
      angle = from + delta * (1 - Math.pow(1 - k, 3));
      draw();
      if (k < 1) anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  };

  buttons.forEach((b) =>
    b.addEventListener("click", () => {
      select(b.dataset.angle);
      if (b.dataset.angle === "match") return void (viewer.dataset.mode = "match");
      viewer.dataset.mode = "spin";
      tween(ANGLES[b.dataset.angle]);
    }),
  );

  let startX = 0;
  let startAngle = 0;
  stage.addEventListener("pointerdown", (e) => {
    cancelAnimationFrame(anim);
    stage.setPointerCapture(e.pointerId);
    startX = e.clientX;
    startAngle = angle;
    viewer.dataset.mode = "spin";
    viewer.dataset.dragging = "true";
    select(null);
  });
  stage.addEventListener("pointermove", (e) => {
    if (viewer.dataset.dragging !== "true") return;
    // One full turn per 360 px of drag: the frame under the finger follows it 1:1
    angle = startAngle + (e.clientX - startX);
    draw();
  });
  const end = () => (viewer.dataset.dragging = "false");
  stage.addEventListener("pointerup", end);
  stage.addEventListener("pointercancel", end);
  stage.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      cancelAnimationFrame(anim); // a running tween would overwrite the key's turn on its next frame
      angle += e.key === "ArrowLeft" ? -10 : 10;
      viewer.dataset.mode = "spin";
      select(null);
      draw();
    }
  });
  draw();
}

  window.Head = { headSvg, mountSpin, ANGLES };
})();
