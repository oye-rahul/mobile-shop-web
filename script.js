/**
 * SHREE RAM MOBILE — Phone Scrollytelling + 3 Peak Chart Cards
 */

(function () {
  'use strict';

  /* ==========================================================================
     PART 1: 202-FRAME PHONE SCROLLYTELLING ENGINE
     ========================================================================== */
  const TOTAL_FRAMES = 202;
  const FRAME_DIR = './Smartphone_repair_and_delivery_a_53979664_1080p_gwr_video_mvp-ezgif-split';

  const getFramePath = (index) => {
    const num = String(index).padStart(3, '0');
    return `${FRAME_DIR}/ezgif-frame-${num}.png`;
  };

  const loader = document.getElementById('loader');
  const loaderPct = document.getElementById('loader-pct');
  const progressBar = document.getElementById('progress-bar');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const phoneTrack = document.getElementById('phone-track');
  const canvasWrapper = document.getElementById('canvas-wrapper');

  const images = new Array(TOTAL_FRAMES);
  let isPhoneLoaded = false;
  let targetProgress = 0;
  let currentProgress = 0;
  let lastRenderedFrame = -1;

  let canvasWidth = 0;
  let canvasHeight = 0;
  let dpr = 1;

  function resizePhoneCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    canvas.width = Math.round(canvasWidth * dpr);
    canvas.height = Math.round(canvasHeight * dpr);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    lastRenderedFrame = -1;
    const currentFrame = Math.round(currentProgress * (TOTAL_FRAMES - 1));
    drawPhoneFrame(currentFrame);
  }

  function getFrameImage(idx) {
    if (images[idx] && images[idx].complete && images[idx].naturalWidth > 0) return images[idx];
    for (let i = idx - 1; i >= 0; i--) {
      if (images[i] && images[i].complete && images[i].naturalWidth > 0) return images[i];
    }
    for (let i = idx + 1; i < TOTAL_FRAMES; i++) {
      if (images[i] && images[i].complete && images[i].naturalWidth > 0) return images[i];
    }
    return images[0];
  }

  function drawPhoneFrame(frameIdx) {
    const img = getFrameImage(frameIdx);
    if (!img || !img.complete || img.naturalWidth === 0) return;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    const scale = Math.min(canvasWidth / imgW, canvasHeight / imgH);
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const offsetX = (canvasWidth - drawW) / 2;
    const offsetY = (canvasHeight - drawH) / 2;

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    lastRenderedFrame = frameIdx;
  }

  function preloadPhoneImages() {
    let loadedCount = 0;
    const firstImg = new Image();
    images[0] = firstImg;

    firstImg.onload = () => {
      loadedCount++;
      resizePhoneCanvas();
      drawPhoneFrame(0);
      loadRest();
    };
    firstImg.onerror = () => {
      loadedCount++;
      loadRest();
    };
    firstImg.src = getFramePath(1);

    function loadRest() {
      for (let i = 2; i <= TOTAL_FRAMES; i++) {
        const idx = i - 1;
        const img = new Image();
        images[idx] = img;

        const onDone = () => {
          loadedCount++;
          const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
          if (loaderPct) loaderPct.textContent = `${pct}%`;
          if (progressBar) progressBar.style.width = `${pct}%`;
          if (loadedCount >= TOTAL_FRAMES) finishLoading();
        };

        img.onload = onDone;
        img.onerror = onDone;
        img.src = getFramePath(i);
      }
    }

    setTimeout(() => {
      if (!isPhoneLoaded) finishLoading();
    }, 4000);

    function finishLoading() {
      if (isPhoneLoaded) return;
      isPhoneLoaded = true;
      setTimeout(() => {
        if (loader) loader.classList.add('loaded');
        requestAnimationFrame(phoneRenderLoop);
      }, 200);
    }
  }

  function onPhoneScroll() {
    const totalScroll = phoneTrack ? phoneTrack.offsetHeight : 1000;
    const currentY = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || 0;
    targetProgress = Math.max(0, Math.min(1, currentY / totalScroll));

    if (currentY > totalScroll) {
      if (canvasWrapper) canvasWrapper.style.opacity = '0';
    } else {
      if (canvasWrapper) canvasWrapper.style.opacity = '1';
    }
  }

  function phoneRenderLoop() {
    const lerp = 0.15;
    const delta = targetProgress - currentProgress;
    if (Math.abs(delta) > 0.0002) {
      currentProgress += delta * lerp;
    } else {
      currentProgress = targetProgress;
    }

    const frameIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(currentProgress * (TOTAL_FRAMES - 1))));
    if (frameIdx !== lastRenderedFrame) {
      drawPhoneFrame(frameIdx);
    }
    requestAnimationFrame(phoneRenderLoop);
  }

  /* ==========================================================================
     PART 2: LOUIS STUDIOS PEAK CHART ENGINE
     ========================================================================== */
  const CW = 540;
  const CH = 696;
  const CR = 56;
  const HN = CH / CW;
  const RN = CR / CW;
  const BX = 0.32 * CW;
  const BY = 0.16 * CW;

  const FIELD_FILL = '#1678ff';
  const FIELD_SHADES = [
    { shape: [0.4748, 0.8152, 0.7509, 0.8801, 0.7026], color: '#000000', opacity: 1.0 },
    { shape: [0.3741, 0.2723, 0.7371, 0.3009, 0.1168], color: '#020000', opacity: 1.0 },
    { shape: [0.7846, 0.0251, 0.3833, 0.1301, -0.5566], color: '#2e85ff', opacity: 0.4756 },
    { shape: [0.6206, -0.2018, 0.1282, 0.5909, 0.2754], color: '#3584ff', opacity: 0.3146 },
    { shape: [0.6000, 1.2391, 0.8270, 0.2111, -1.6357], color: '#000d1e', opacity: 1.0 },
    { shape: [0.0964, 0.5388, 1000.0, 0.1285, 0.5421], color: '#000005', opacity: 0.2298 },
  ];
  const FIELD_RIMS = [
    { shape: [0.1207, -0.0365, 0.0492], color: '#2667ff', opacity: 1.0 },
    { shape: [0.0667, -0.0166, 0.0176], color: '#467dff', opacity: 1.0 },
    { shape: [0.0370, -0.0134, 0.0154], color: '#c2ffff', opacity: 0.8091 },
  ];
  const HALO = { cx: 0.4996, cy: 0.6438, sx: 0.2498, sy: 0.2433, opacity: 0.845, color: '#0e50ff' };
  const BREATH_GAIN = 0.42;
  const GRAIN = 1.7;

  const PLOT_X0 = 20.29;
  const PLOT_X1 = 503.69;
  const PLOT_TOP = 158.49;
  const PLOT_BOTTOM = 385.28;
  const LINE_W = 7.1;
  const LINE_COLOR = '#6496e2';
  const LINE_FALLOFF = 108;
  const LINE_POWER = 1.44;
  const LINE_CENTER = 12;
  const DOT_R = 13;
  const DOT_DX = 8;
  const DOT_DY = 2.6;
  const GRID_DX = 40.64;
  const GRID_DY = 40.07;
  const GRID_Y0 = 468.7;
  const GRID_COLOR = '#5a87e1';
  const GRID_ALPHA = 0.23;

  const T_GRID = 0.9;
  const T_DRAW0 = 0.25;
  const T_DRAW = 2.1;
  const T_NUM0 = 1.0;
  const T_NUM = 1.7;
  const T_ARROW = 2.65;
  const T_REST = 3.3;
  const T_BREATH = 4.6;
  const T_MORPH = 0.75;

  const BASE_ACCENT = '#4f8ef7';
  const DOT_TOP = '#2680ff';
  const DOT_MID = '#75aafa';
  const DOT_BOTTOM = '#d0e4fd';
  const DOT_GLOW = '#287dff';
  const PULSE_COLOR = '#78afff';

  const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
  const smooth = (x) => {
    const t = clamp01(x);
    return t * t * (3 - 2 * t);
  };
  const easeInOut = (x) => {
    const t = clamp01(x);
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };
  const easeOut = (x) => 1 - Math.pow(1 - clamp01(x), 3);
  const backOut = (x) => {
    const t = clamp01(x);
    const c = 1.9;
    return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
  };

  function erf(x) {
    const s = x < 0 ? -1 : 1;
    const a = Math.abs(x);
    const t = 1 / (1 + 0.3275911 * a);
    const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a);
    return s * y;
  }
  const phi = (x) => 0.5 * (1 + erf(x / Math.SQRT2));

  function sdf(u, v) {
    const qx = Math.abs(u - 0.5) - (0.5 - RN);
    const qy = Math.abs(v - HN / 2) - (HN / 2 - RN);
    const ox = Math.max(qx, 0);
    const oy = Math.max(qy, 0);
    return Math.sqrt(ox * ox + oy * oy) + Math.min(Math.max(qx, qy), 0) - RN;
  }

  function rng(seed) {
    let s = seed >>> 0;
    return () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function rgbOf(color) {
    const c = color.trim();
    const hex = /^#([0-9a-f]{6}|[0-9a-f]{3})/i.exec(c);
    if (hex) {
      const h = hex[1].length === 3 ? hex[1].split('').map((d) => d + d).join('') : hex[1];
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    }
    const m = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(c);
    return m ? [+m[1], +m[2], +m[3]] : [0, 0, 0];
  }
  const rgba = (color, a) => `rgba(${rgbOf(color).join(',')},${a.toFixed(4)})`;

  function hslOf(color) {
    if (!/^\s*(#|rgb)/i.test(color)) return null;
    const [r, g, b] = rgbOf(color).map((v) => v / 255);
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    const l = (mx + mn) / 2;
    const d = mx - mn;
    if (d === 0) return [0, 0];
    const sat = d / (1 - Math.abs(2 * l - 1));
    const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [(h * 60 + 360) % 360, sat];
  }

  function makeCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w));
    c.height = Math.max(1, Math.round(h));
    return c;
  }

  function buildField(px, seed) {
    const w = Math.round(px);
    const h = Math.round(px * HN);
    const rest = makeCanvas(w, h);
    const lift = makeCanvas(w, h);
    const c1 = rest.getContext('2d');
    const c2 = lift.getContext('2d');
    const i1 = c1.createImageData(w, h);
    const i2 = c2.createImageData(w, h);
    const d1 = i1.data;
    const d2 = i2.data;
    const rand = rng(seed);
    const fill = rgbOf(FIELD_FILL);
    const shades = FIELD_SHADES.map(({ shape: [cx, cy, sx, sy, th], color, opacity }) => ({
      cx, cy, isx: 1 / Math.abs(sx), isy: 1 / Math.abs(sy), c: Math.cos(th), s: Math.sin(th), rgb: rgbOf(color), a: opacity,
    }));
    const rims = FIELD_RIMS.map(({ shape: [off, sp, sg], color, opacity }) => ({ off, sp, sg, rgb: rgbOf(color), a: opacity }));
    const k2 = 1 + BREATH_GAIN;
    for (let j = 0; j < h; j++) {
      const v = (j + 0.5) / w;
      for (let i = 0; i < w; i++) {
        const u = (i + 0.5) / w;
        let r = fill[0], g = fill[1], b = fill[2];
        for (const o of shades) {
          const du = u - o.cx, dv = v - o.cy;
          const x = (o.c * du + o.s * dv) * o.isx;
          const y = (-o.s * du + o.c * dv) * o.isy;
          const m = o.a * Math.exp(-0.5 * (x * x + y * y));
          r += m * (o.rgb[0] - r); g += m * (o.rgb[1] - g); b += m * (o.rgb[2] - b);
        }
        let r2 = r, g2 = g, b2 = b;
        for (const o of rims) {
          const vs = v + o.off;
          const dx = Math.min(u, 1 - u), dy = Math.min(vs, HN - vs);
          const ratio = Math.min(1, phi((-sdf(u, vs) - o.sp) / o.sg) / Math.max(1e-9, phi((Math.min(dx, dy) - o.sp) / o.sg)));
          const k = 1 - phi((dx - o.sp) / o.sg) * phi((dy - o.sp) / o.sg) * ratio;
          const m = o.a * k;
          r += m * (o.rgb[0] - r); g += m * (o.rgb[1] - g); b += m * (o.rgb[2] - b);
          const m2 = Math.min(1, m * k2);
          r2 += m2 * (o.rgb[0] - r2); g2 += m2 * (o.rgb[1] - g2); b2 += m2 * (o.rgb[2] - b2);
        }
        const n = (rand() + rand() + rand() - 1.5) * 2 * GRAIN;
        const p = (j * w + i) * 4;
        d1[p] = r + n; d1[p + 1] = g + n; d1[p + 2] = b + n; d1[p + 3] = 255;
        d2[p] = r2 + n; d2[p + 1] = g2 + n; d2[p + 2] = b2 + n; d2[p + 3] = 255;
      }
    }
    c1.putImageData(i1, 0, 0);
    c2.putImageData(i2, 0, 0);
    return { rest, lift };
  }

  function buildHalo(px) {
    const s = 0.25;
    const w = Math.max(8, Math.round(((CW + 2 * BX) * px * s) / CW));
    const h = Math.max(8, Math.round(((CH + 2 * BY) * px * s) / CW));
    const c = makeCanvas(w, h);
    const cctx = c.getContext('2d');
    const img = cctx.createImageData(w, h);
    const [hr, hg, hb] = rgbOf(HALO.color);
    for (let j = 0; j < h; j++) {
      const v = (((j + 0.5) / h) * (CH + 2 * BY) - BY) / CW;
      for (let i = 0; i < w; i++) {
        const u = (((i + 0.5) / w) * (CW + 2 * BX) - BX) / CW;
        const a = (u - HALO.cx) / HALO.sx, e = (v - HALO.cy) / HALO.sy;
        const k = Math.exp(-0.5 * (a * a + e * e)) * HALO.opacity;
        const p = (j * w + i) * 4;
        img.data[p] = hr; img.data[p + 1] = hg; img.data[p + 2] = hb; img.data[p + 3] = Math.min(255, k * 255);
      }
    }
    cctx.putImageData(img, 0, 0);
    return c;
  }

  function buildGrid(px) {
    const w = Math.round(px);
    const h = Math.round(px * HN);
    const c = makeCanvas(w, h);
    const cctx = c.getContext('2d');
    const s = px / CW;
    cctx.scale(s, s);
    cctx.strokeStyle = GRID_COLOR;
    cctx.lineWidth = 1;
    cctx.beginPath();
    for (let k = -6; k <= 6; k++) {
      const x = CW / 2 + GRID_DX * k;
      cctx.moveTo(x, 250); cctx.lineTo(x, CH);
    }
    for (let k = -6; k <= 6; k++) {
      const y = GRID_Y0 + GRID_DY * k;
      if (y < 250 || y > CH) continue;
      cctx.moveTo(0, y); cctx.lineTo(CW, y);
    }
    cctx.stroke();

    const mw = 64, mh = Math.round(64 * HN);
    const m = makeCanvas(mw, mh);
    const mc = m.getContext('2d');
    const img = mc.createImageData(mw, mh);
    for (let j = 0; j < mh; j++) {
      const y = ((j + 0.5) / mh) * CH;
      const my = smooth((y - 350) / 230);
      for (let i = 0; i < mw; i++) {
        const x = ((i + 0.5) / mw) * CW;
        const mx = Math.exp(-0.5 * Math.pow((x - CW / 2) / 92, 2));
        img.data[(j * mw + i) * 4 + 3] = Math.round(255 * GRID_ALPHA * mx * my);
      }
    }
    mc.putImageData(img, 0, 0);
    cctx.setTransform(1, 0, 0, 1, 0, 0);
    cctx.globalCompositeOperation = 'destination-in';
    cctx.imageSmoothingEnabled = true;
    cctx.drawImage(m, 0, 0, w, h);
    return c;
  }

  function buildCurve(data) {
    const vals = data.length >= 2 ? data : data.length === 1 ? [data[0], data[0]] : [0, 0];
    const n = vals.length;
    let lo = Infinity, hi = -Infinity, pk = 0;
    for (let i = 0; i < n; i++) {
      if (vals[i] < lo) lo = vals[i];
      if (vals[i] > hi) { hi = vals[i]; pk = i; }
    }
    const span = hi - lo || 1;
    const yv = vals.map((v) => (hi === lo ? (PLOT_TOP + PLOT_BOTTOM) / 2 : PLOT_TOP + (1 - (v - lo) / span) * (PLOT_BOTTOM - PLOT_TOP)));
    const h = (PLOT_X1 - PLOT_X0) / (n - 1);
    const sl = [];
    for (let i = 0; i < n - 1; i++) sl.push((yv[i + 1] - yv[i]) / h);
    const m = [sl[0]];
    for (let i = 1; i < n - 1; i++) {
      const a = sl[i - 1], b = sl[i];
      m.push((Math.sign(a) + Math.sign(b)) * Math.min(Math.abs(a), Math.abs(b), 0.25 * Math.abs(a + b)));
    }
    m.push(sl[n - 2]);
    const ys = new Float32Array(CW + 1);
    for (let x = 0; x <= CW; x++) {
      let y;
      if (x <= PLOT_X0) y = yv[0] + (x - PLOT_X0) * m[0];
      else if (x >= PLOT_X1) y = yv[n - 1] + (x - PLOT_X1) * m[n - 1];
      else {
        const t = (x - PLOT_X0) / h;
        const i = Math.min(n - 2, Math.floor(t));
        const f = t - i;
        const f2 = f * f, f3 = f2 * f;
        y = (2 * f3 - 3 * f2 + 1) * yv[i] + (f3 - 2 * f2 + f) * h * m[i] + (-2 * f3 + 3 * f2) * yv[i + 1] + (f3 - f2) * h * m[i + 1];
      }
      ys[x] = y;
    }
    return { ys, peakX: PLOT_X0 + pk * h, lo, hi, n };
  }

  function curveY(ys, x) {
    const xc = Math.max(0, Math.min(CW, x));
    const i = Math.min(CW - 1, Math.floor(xc));
    const f = xc - i;
    return ys[i] * (1 - f) + ys[i + 1] * f;
  }
  const lineAlpha = (d) => Math.exp(-Math.pow(Math.abs(d) / LINE_FALLOFF, LINE_POWER));

  function inverseEase(target) {
    let lo = 0, hi = 1;
    for (let i = 0; i < 24; i++) {
      const m = (lo + hi) / 2;
      if (easeInOut(m) < target) lo = m;
      else hi = m;
    }
    return (lo + hi) / 2;
  }

  function frameAt(t, loop) {
    const f = {
      grid: smooth(t / T_GRID),
      draw: easeInOut((t - T_DRAW0) / T_DRAW),
      erase: 0,
      dotS: backOut((t - T_DRAW0) / 0.4),
      dotA: smooth((t - T_DRAW0) / 0.2),
      num: easeOut((t - T_NUM0) / T_NUM),
      numA: smooth((t - T_NUM0) / 0.45),
      numY: 1 - easeOut((t - T_NUM0) / 0.7),
      arrow: backOut((t - T_ARROW) / 0.45),
      arrowA: smooth((t - T_ARROW) / 0.18),
      breath: 0,
    };
    if (loop > 0) {
      const L = loop;
      const out = (a, d) => 1 - smooth((t - (L - a)) / d);
      f.erase = easeInOut((t - (L - 1.4)) / 1.15);
      const dk = out(1.05, 0.45);
      f.dotA *= dk;
      f.dotS *= 0.6 + 0.4 * dk;
      const nk = out(1.3, 0.55);
      f.numA *= nk;
      f.arrowA *= nk;
      f.numY -= (1 - nk) * 0.7;
      f.grid *= out(1.1, 0.85);
      const s = (((t - (L - 2.2)) % L) + L) % L;
      f.breath = s < T_BREATH ? Math.pow(Math.sin((Math.PI * s) / T_BREATH), 2) : 0;
    } else if (t > T_REST) {
      f.breath = 0.6 * Math.pow(Math.sin((Math.PI * (t - T_REST)) / 7), 2);
    }
    return f;
  }

  /* ==========================================================================
     PEAK CHART COMPONENT MOUNT
     ========================================================================== */
  function mountPeakChart(container, config) {
    const width = config.width || 360;
    const u = width / CW;
    const accent = config.accent || BASE_ACCENT;
    let currentPeriod = config.defaultPeriod || 'Monthly';
    let currentData = config.seriesMap ? config.seriesMap[currentPeriod].data : config.data;
    let currentLabels = config.seriesMap ? config.seriesMap[currentPeriod].labels : config.labels;
    let currentValue = config.seriesMap ? config.seriesMap[currentPeriod].value : config.value;

    const px = (n) => `${(n * u).toFixed(3)}px`;
    const font = 'system-ui, -apple-system, sans-serif';

    // Compute hue tint
    const a = hslOf(accent), b = hslOf(BASE_ACCENT);
    let tintStyle = '';
    if (a && b) {
      let d = a[0] - b[0];
      if (d > 180) d -= 360;
      if (d < -180) d += 360;
      const k = b[1] > 0 ? a[1] / b[1] : 1;
      if (Math.abs(d) >= 0.5 || Math.abs(k - 1) >= 0.02) {
        tintStyle = `hue-rotate(${d.toFixed(1)}deg) saturate(${k.toFixed(3)})`;
      }
    }

    // Card element
    const card = document.createElement('div');
    card.style.position = 'relative';
    card.style.width = `${width}px`;
    card.style.height = `${width * HN}px`;
    card.style.borderRadius = px(CR);
    card.style.fontFamily = font;
    card.style.color = '#fff';
    card.style.userSelect = 'none';
    card.style.webkitUserSelect = 'none';

    // Canvas
    const chartCanvas = document.createElement('canvas');
    chartCanvas.style.position = 'absolute';
    chartCanvas.style.left = '0';
    chartCanvas.style.top = '0';
    chartCanvas.style.pointerEvents = 'none';
    if (tintStyle) chartCanvas.style.filter = tintStyle;
    card.appendChild(chartCanvas);

    // Hover interactive surface
    const hoverSurface = document.createElement('div');
    hoverSurface.style.position = 'absolute';
    hoverSurface.style.left = '0';
    hoverSurface.style.top = px(96);
    hoverSurface.style.width = '100%';
    hoverSurface.style.height = px(330);
    hoverSurface.style.touchAction = 'pan-y';
    hoverSurface.style.cursor = 'crosshair';
    card.appendChild(hoverSurface);

    // Updated tag
    const updatedEl = document.createElement('p');
    updatedEl.textContent = config.updatedText || 'Live';
    updatedEl.style.position = 'absolute';
    updatedEl.style.left = px(45.6);
    updatedEl.style.top = px(43.6);
    updatedEl.style.fontSize = px(18.6);
    updatedEl.style.fontWeight = '200';
    updatedEl.style.color = '#99a3b6';
    updatedEl.style.margin = '0';
    card.appendChild(updatedEl);

    // Period Button Pill
    const pillBtn = document.createElement('button');
    pillBtn.style.position = 'absolute';
    pillBtn.style.right = px(46);
    pillBtn.style.top = px(35);
    pillBtn.style.height = px(37);
    pillBtn.style.borderRadius = px(18.5);
    pillBtn.style.border = '0';
    pillBtn.style.padding = `0 ${px(19.8)} 0 ${px(19.4)}`;
    pillBtn.style.display = 'flex';
    pillBtn.style.alignItems = 'center';
    pillBtn.style.gap = px(6.72);
    pillBtn.style.background = 'rgba(255,255,255,0.13)';
    pillBtn.style.cursor = 'pointer';
    pillBtn.style.color = '#b9cdf2';
    pillBtn.style.fontFamily = font;
    pillBtn.style.outline = 'none';
    pillBtn.innerHTML = `
      <span style="font-size:${px(17.2)}; color:#acc1e7; font-weight:300;">${currentPeriod}</span>
      <svg viewBox="0 0 12 7" style="width:${px(12)}; height:${px(7)}; fill:none; stroke:#9fb7e0; stroke-width:1.25; stroke-linecap:round; stroke-linejoin:round;">
        <path d="M0.8 0.8 L6 6 L11.2 0.8"></path>
      </svg>
    `;
    card.appendChild(pillBtn);

    // Dropdown Menu
    const menuEl = document.createElement('div');
    menuEl.style.position = 'absolute';
    menuEl.style.right = px(46);
    menuEl.style.top = px(80);
    menuEl.style.minWidth = px(150);
    menuEl.style.padding = px(6);
    menuEl.style.borderRadius = px(16);
    menuEl.style.zIndex = '15';
    menuEl.style.background = 'rgba(20,34,64,0.75)';
    menuEl.style.border = '1px solid rgba(255,255,255,0.14)';
    menuEl.style.boxShadow = '0 18px 40px rgba(0,0,0,0.6)';
    menuEl.style.backdropFilter = 'blur(18px)';
    menuEl.style.display = 'none';

    const periodsList = config.periods || ['Weekly', 'Monthly', 'Yearly'];
    periodsList.forEach((p) => {
      const opt = document.createElement('button');
      opt.textContent = p;
      opt.style.display = 'block';
      opt.style.width = '100%';
      opt.style.height = px(36);
      opt.style.padding = `0 ${px(12)}`;
      opt.style.border = '0';
      opt.style.borderRadius = px(10);
      opt.style.background = p === currentPeriod ? 'rgba(255,255,255,0.12)' : 'transparent';
      opt.style.color = '#e6eeff';
      opt.style.fontFamily = font;
      opt.style.fontSize = px(15.5);
      opt.style.cursor = 'pointer';
      opt.style.textAlign = 'left';
      opt.onclick = () => {
        currentPeriod = p;
        pillBtn.querySelector('span').textContent = p;
        menuEl.style.display = 'none';
        if (config.seriesMap && config.seriesMap[p]) {
          changeData(config.seriesMap[p].data, config.seriesMap[p].labels, config.seriesMap[p].value);
        }
      };
      menuEl.appendChild(opt);
    });
    card.appendChild(menuEl);

    let isMenuOpen = false;
    pillBtn.onclick = (e) => {
      e.stopPropagation();
      isMenuOpen = !isMenuOpen;
      menuEl.style.display = isMenuOpen ? 'block' : 'none';
    };
    document.addEventListener('click', () => {
      isMenuOpen = false;
      menuEl.style.display = 'none';
    });

    // Hover Readout Tooltip
    const readPill = document.createElement('div');
    readPill.style.position = 'absolute';
    readPill.style.left = '0';
    readPill.style.top = '0';
    readPill.style.opacity = '0';
    readPill.style.pointerEvents = 'none';
    readPill.style.zIndex = '10';
    readPill.style.display = 'flex';
    readPill.style.alignItems = 'baseline';
    readPill.style.gap = px(7);
    readPill.style.padding = `${px(7)} ${px(11)}`;
    readPill.style.borderRadius = px(11);
    readPill.style.background = 'rgba(18,36,72,0.7)';
    readPill.style.border = '1px solid rgba(160,195,255,0.22)';
    readPill.style.backdropFilter = 'blur(10px)';
    readPill.style.whiteSpace = 'nowrap';
    readPill.innerHTML = `
      <span class="read-val" style="font-size:${px(16)}; font-weight:600; color:#fff;"></span>
      <span class="read-lab" style="font-size:${px(12.5)}; color:#9fb0cc;"></span>
    `;
    card.appendChild(readPill);

    // Title
    const titleEl = document.createElement('p');
    titleEl.textContent = config.title || 'Metrics';
    titleEl.style.position = 'absolute';
    titleEl.style.left = '0';
    titleEl.style.right = '0';
    titleEl.style.textAlign = 'center';
    titleEl.style.top = px(441.4);
    titleEl.style.fontSize = px(20.2);
    titleEl.style.fontWeight = '300';
    titleEl.style.color = '#9298a5';
    titleEl.style.margin = '0';
    card.appendChild(titleEl);

    // Headline Value Number
    const numWrap = document.createElement('div');
    numWrap.style.position = 'absolute';
    numWrap.style.left = '0';
    numWrap.style.right = '0';
    numWrap.style.top = px(469);
    numWrap.style.display = 'flex';
    numWrap.style.justifyContent = 'center';
    numWrap.style.opacity = '1';

    const numValue = document.createElement('div');
    numValue.style.position = 'relative';
    numValue.style.fontFamily = font;
    numValue.style.fontWeight = '500';
    numValue.style.fontSize = px(89.2);
    numValue.style.lineHeight = '1';
    numValue.style.letterSpacing = px(-0.5);
    numValue.style.whiteSpace = 'nowrap';

    const digitsSpan = document.createElement('span');
    digitsSpan.textContent = currentValue.toFixed(config.decimals || 0);
    digitsSpan.style.fontVariantNumeric = 'tabular-nums';

    const suffixSpan = document.createElement('span');
    suffixSpan.textContent = config.valueSuffix || '';
    suffixSpan.style.fontSize = '0.7em';
    suffixSpan.style.marginLeft = px(2);
    suffixSpan.style.color = config.accent || '#93cfa2';

    numValue.appendChild(digitsSpan);
    numValue.appendChild(suffixSpan);
    numWrap.appendChild(numValue);
    card.appendChild(numWrap);

    // Caption
    const captionEl = document.createElement('p');
    captionEl.textContent = config.caption || '';
    captionEl.style.position = 'absolute';
    captionEl.style.left = '0';
    captionEl.style.right = '0';
    captionEl.style.textAlign = 'center';
    captionEl.style.top = px(560.9);
    captionEl.style.fontSize = px(12.5);
    captionEl.style.fontWeight = '300';
    captionEl.style.color = '#9299a8';
    captionEl.style.margin = '0';
    card.appendChild(captionEl);

    container.appendChild(card);

    // Canvas drawing context
    const cctx = chartCanvas.getContext('2d');
    const dprVal = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    const bxc = Math.ceil(BX * u);
    const byc = Math.ceil(BY * u);
    const bx = bxc * dprVal;
    const by = byc * dprVal;

    chartCanvas.width = Math.ceil(CW * u * dprVal + 2 * bx);
    chartCanvas.height = Math.ceil(CH * u * dprVal + 2 * by);
    chartCanvas.style.left = `${-bxc}px`;
    chartCanvas.style.top = `${-byc}px`;
    chartCanvas.style.width = `${chartCanvas.width / dprVal}px`;
    chartCanvas.style.height = `${chartCanvas.height / dprVal}px`;

    const fieldPx = Math.min(width * dprVal, Math.max(width, 700));
    const { rest: field, lift: bright } = buildField(fieldPx, 11);
    const grid = buildGrid(width * dprVal);
    const halo = buildHalo(width);
    const tLand = (frac) => T_DRAW0 + T_DRAW * inverseEase(frac);

    let curve = buildCurve(currentData);
    let fromCurve = null;
    let morphT = 1;
    let hoverX = null;
    let curHoverX = 0;
    let hoverMix = 0;
    let clock = 0;
    let lastTime = performance.now();

    function changeData(newData, newLabels, newVal) {
      fromCurve = curve;
      curve = buildCurve(newData);
      currentLabels = newLabels;
      currentValue = newVal;
      morphT = 0;
      digitsSpan.textContent = newVal.toFixed(config.decimals || 0);
    }

    hoverSurface.onpointermove = (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * CW;
      const nx = Math.max(PLOT_X0, Math.min(PLOT_X1, x));
      if (hoverX === null && hoverMix < 0.02) curHoverX = nx;
      hoverX = nx;
    };
    hoverSurface.onpointerleave = () => {
      hoverX = null;
    };

    function renderChartFrame() {
      const now = performance.now();
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      const hovering = hoverX !== null;
      if (!hovering || clock < T_REST) {
        clock += dt;
      }
      const F = frameAt(clock, 0);

      if (morphT < 1) morphT = Math.min(1, morphT + dt / T_MORPH);
      const mk = easeInOut(morphT);
      const ys = fromCurve && morphT < 1 ? new Float32Array(CW + 1) : curve.ys;
      if (ys !== curve.ys && fromCurve) {
        for (let x = 0; x <= CW; x++) ys[x] = fromCurve.ys[x] + (curve.ys[x] - fromCurve.ys[x]) * mk;
      }
      const peakX = fromCurve && morphT < 1 ? fromCurve.peakX + (curve.peakX - fromCurve.peakX) * mk : curve.peakX;
      const lo = fromCurve && morphT < 1 ? fromCurve.lo + (curve.lo - fromCurve.lo) * mk : curve.lo;
      const hi = fromCurve && morphT < 1 ? fromCurve.hi + (curve.hi - fromCurve.hi) * mk : curve.hi;

      const landed = clock >= tLand((peakX + DOT_DX) / CW) && F.dotA > 0.99;
      const wantHover = hovering && landed;
      if (hoverX !== null) curHoverX += (hoverX - curHoverX) * (1 - Math.exp(-dt * 14));
      hoverMix += ((wantHover ? 1 : 0) - hoverMix) * (1 - Math.exp(-dt * 10));

      cctx.setTransform(1, 0, 0, 1, 0, 0);
      cctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
      const s = dprVal * u;
      cctx.setTransform(s, 0, 0, s, bx, by);
      cctx.drawImage(halo, -BX, -BY, CW + 2 * BX, CH + 2 * BY);

      cctx.save();
      cctx.beginPath();
      cctx.moveTo(CR, 0);
      cctx.arcTo(CW, 0, CW, CH, CR);
      cctx.arcTo(CW, CH, 0, CH, CR);
      cctx.arcTo(0, CH, 0, 0, CR);
      cctx.arcTo(0, 0, CW, 0, CR);
      cctx.closePath();
      cctx.clip();

      cctx.drawImage(field, 0, 0, CW, CH);
      if (F.breath > 0.001) {
        cctx.globalAlpha = F.breath;
        cctx.drawImage(bright, 0, 0, CW, CH);
      }
      if (F.grid > 0.001) {
        cctx.globalAlpha = F.grid;
        cctx.drawImage(grid, 0, 0, CW, CH);
      }
      cctx.globalAlpha = 1;

      const x0 = 0;
      const x1 = F.draw * CW;
      if (x1 - x0 > 0.5) {
        const g = cctx.createLinearGradient(0, 0, CW, 0);
        const head = 0.95 * (1 - smooth((F.draw - 0.8) / 0.2));
        for (let i = 0; i <= 54; i++) {
          const x = (i / 54) * CW;
          let alpha = lineAlpha(x - peakX - LINE_CENTER);
          if (head > 0.001 && x <= x1 + 10) alpha = Math.max(alpha, head * Math.exp(-Math.max(0, x1 - x) / 70));
          g.addColorStop(i / 54, rgba(LINE_COLOR, alpha));
        }
        cctx.strokeStyle = g;
        cctx.lineWidth = LINE_W;
        cctx.lineCap = 'round';
        cctx.lineJoin = 'round';
        cctx.beginPath();
        cctx.moveTo(x0, curveY(ys, x0));
        for (let x = x0 + 1; x < x1; x++) cctx.lineTo(x, ys[x]);
        cctx.lineTo(x1, curveY(ys, x1));
        cctx.stroke();
      }

      if (F.dotA > 0.001) {
        const restX = peakX + DOT_DX;
        const baseX = Math.min(x1, restX);
        const dx = baseX + (curHoverX - baseX) * hoverMix;
        const dy = curveY(ys, dx) + DOT_DY * (1 - hoverMix) * clamp01(baseX / restX);

        cctx.globalAlpha = F.dotA;
        cctx.translate(dx, dy);
        cctx.scale(F.dotS, F.dotS);

        const hg = cctx.createRadialGradient(0, 0, 0, 0, 0, 30);
        hg.addColorStop(0, rgba(DOT_GLOW, 0.47));
        hg.addColorStop(0.5, rgba(DOT_GLOW, 0.47));
        hg.addColorStop(1, rgba(DOT_GLOW, 0));
        cctx.fillStyle = hg;
        cctx.beginPath();
        cctx.arc(0, 0, 30, 0, Math.PI * 2);
        cctx.fill();

        const bg = cctx.createLinearGradient(0, -DOT_R, 0, DOT_R);
        bg.addColorStop(0, DOT_TOP);
        bg.addColorStop(0.45, DOT_MID);
        bg.addColorStop(1, DOT_BOTTOM);
        cctx.fillStyle = bg;
        cctx.beginPath();
        cctx.arc(0, 0, DOT_R, 0, Math.PI * 2);
        cctx.fill();

        cctx.setTransform(s, 0, 0, s, bx, by);
        cctx.globalAlpha = 1;

        readPill.style.opacity = hoverMix.toFixed(3);
        readPill.style.transform = `translate(${(dx * u).toFixed(1)}px, ${((dy - 26) * u).toFixed(1)}px) translate(-50%, -100%)`;
        if (hoverMix > 0.01) {
          const v = lo + ((PLOT_BOTTOM - curveY(ys, dx)) / (PLOT_BOTTOM - PLOT_TOP)) * (hi - lo);
          readPill.querySelector('.read-val').textContent = config.formatValue ? config.formatValue(v) : `${Math.round(v)}${config.valueSuffix || ''}`;
          const n = curve.n;
          const idx = Math.round(((Math.max(PLOT_X0, Math.min(PLOT_X1, dx)) - PLOT_X0) / (PLOT_X1 - PLOT_X0)) * (n - 1));
          const lab = currentLabels ? currentLabels[idx] || '' : '';
          readPill.querySelector('.read-lab').textContent = lab;
        }
      }

      cctx.restore();
      requestAnimationFrame(renderChartFrame);
    }

    requestAnimationFrame(renderChartFrame);
  }

  /* ==========================================================================
     INITIALIZATION & MOUNTING THE 3 CARDS
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    resizePhoneCanvas();
    preloadPhoneImages();
    onPhoneScroll();
    window.addEventListener('resize', resizePhoneCanvas, { passive: true });
    window.addEventListener('scroll', onPhoneScroll, { passive: true });

    const btnGotoPhone = document.getElementById('btn-goto-phone');
    const btnGotoChart = document.getElementById('btn-goto-chart');
    const peakSection = document.getElementById('peak-section');

    if (btnGotoPhone) {
      btnGotoPhone.onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        btnGotoPhone.classList.add('active');
        if (btnGotoChart) btnGotoChart.classList.remove('active');
      };
    }
    if (btnGotoChart && peakSection) {
      btnGotoChart.onclick = () => {
        const topY = peakSection.getBoundingClientRect().top + window.scrollY - 30;
        window.scrollTo({ top: topY, behavior: 'smooth' });
        btnGotoChart.classList.add('active');
        if (btnGotoPhone) btnGotoPhone.classList.remove('active');
      };
    }

    // Measure card width for 3 cards
    const screenWidth = window.innerWidth;
    const cardWidth = screenWidth >= 1200 
      ? Math.min(370, Math.floor((screenWidth - 120) / 3))
      : screenWidth >= 768 
        ? Math.min(360, Math.floor((screenWidth - 80) / 2))
        : Math.min(340, screenWidth - 40);

    /* --- DATA FOR CARD 1: Repair phone - 5k+ --- */
    const card1Mount = document.getElementById('chart-card-1');
    if (card1Mount) {
      mountPeakChart(card1Mount, {
        width: cardWidth,
        title: 'Repair phone',
        value: 5,
        valueSuffix: 'k+',
        decimals: 0,
        caption: 'Over 5,000 devices successfully revived',
        updatedText: 'Daily Dispatch',
        accent: '#2e85ff', // Sapphire Blue
        defaultPeriod: 'Monthly',
        formatValue: (v) => `${v.toFixed(1)}k+`,
        seriesMap: {
          Weekly: {
            data: [1.8, 2.4, 2.9, 3.5, 4.2, 4.8, 5.0],
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            value: 5.0,
          },
          Monthly: {
            data: [1.2, 1.4, 1.6, 1.9, 2.2, 2.4, 2.7, 3.0, 3.3, 3.5, 3.8, 4.0, 4.3, 4.6, 4.8, 5.0],
            labels: Array.from({ length: 16 }, (_, i) => `Day ${i * 2 + 1}`),
            value: 5.0,
          },
          Yearly: {
            data: [1.2, 1.5, 1.9, 2.3, 2.8, 3.2, 3.7, 4.1, 4.4, 4.7, 4.9, 5.0],
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            value: 5.0,
          },
        },
      });
    }

    /* --- DATA FOR CARD 2: Year of experience - 10+ --- */
    const card2Mount = document.getElementById('chart-card-2');
    if (card2Mount) {
      mountPeakChart(card2Mount, {
        width: cardWidth,
        title: 'Year of experience',
        value: 10,
        valueSuffix: '+',
        decimals: 0,
        caption: 'Master hardware engineering lab since 2014',
        updatedText: 'Certified Lab',
        accent: '#f59e0b', // Cyber Gold / Amber
        defaultPeriod: 'Monthly',
        formatValue: (v) => `${Math.round(v)}+`,
        seriesMap: {
          Weekly: {
            data: [9.2, 9.4, 9.6, 9.8, 9.9, 10.0, 10.0],
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            value: 10,
          },
          Monthly: {
            data: [8.5, 8.8, 9.0, 9.1, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.8, 9.9, 9.9, 10.0, 10.0, 10.0],
            labels: Array.from({ length: 16 }, (_, i) => `Day ${i * 2 + 1}`),
            value: 10,
          },
          Yearly: {
            data: [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 8.8, 9.4, 9.8, 10.0],
            labels: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2026'],
            value: 10,
          },
        },
      });
    }

    /* --- DATA FOR CARD 3: Happy customer - 20k+ --- */
    const card3Mount = document.getElementById('chart-card-3');
    if (card3Mount) {
      mountPeakChart(card3Mount, {
        width: cardWidth,
        title: 'Happy customer',
        value: 20,
        valueSuffix: 'k+',
        decimals: 0,
        caption: '99.8% 5-star verified customer satisfaction',
        updatedText: '5-Star Rated',
        accent: '#2ec99a', // Emerald Green Glow
        defaultPeriod: 'Monthly',
        formatValue: (v) => `${v.toFixed(1)}k+`,
        seriesMap: {
          Weekly: {
            data: [15.2, 16.1, 16.9, 17.8, 18.6, 19.4, 20.0],
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            value: 20.0,
          },
          Monthly: {
            data: [7.2, 8.5, 9.8, 11.0, 12.4, 13.6, 14.8, 15.9, 16.8, 17.6, 18.2, 18.9, 19.4, 19.7, 19.9, 20.0],
            labels: Array.from({ length: 16 }, (_, i) => `Day ${i * 2 + 1}`),
            value: 20.0,
          },
          Yearly: {
            data: [5.0, 6.5, 8.2, 9.8, 11.5, 13.0, 14.8, 16.2, 17.5, 18.6, 19.4, 20.0],
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            value: 20.0,
          },
        },
      });
    }
  });
})();
