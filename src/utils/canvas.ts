export const GRID_N = 16;

let seed = 42;
export const pseudoRandom = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

export function generateFaceImage(): number[] {
  const data: number[] = [];
  for (let y = 0; y < GRID_N; y++) {
    for (let x = 0; x < GRID_N; x++) {
      let v = 45 + x * 3;
      // Visage rond
      if (Math.hypot(x - 6, y - 6) < 4.5) v = 215;
      // Cheveux / capuche
      if (y <= 3 && x >= 2 && x <= 10) v = 35;
      // Buste / t-shirt
      if (x >= 8 && x <= 14 && y >= 7 && y <= 14) v = 90;
      // Éclairage / yeux
      if (x >= 9 && x <= 13 && y >= 8 && y <= 11) v = 240;
      // Bruit subtil
      data.push(Math.max(0, Math.min(255, Math.round(v + (pseudoRandom() - 0.5) * 22))));
    }
  }
  return data;
}

export function generateGeoImage(): number[] {
  const data: number[] = [];
  for (let y = 0; y < GRID_N; y++) {
    for (let x = 0; x < GRID_N; x++) {
      if (x < 4) data.push(30);
      else if (x > 11) data.push(225);
      else if (y > 5 && y < 10) data.push(175);
      else data.push(95);
    }
  }
  return data;
}

export const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));

export const getPixel = (img: number[], x: number, y: number, n = GRID_N) => {
  const cx = Math.min(n - 1, Math.max(0, x));
  const cy = Math.min(n - 1, Math.max(0, y));
  return img[cy * n + cx];
};

export function applyConvolution(
  src: number[],
  kernel: number[],
  divisor = 1,
  offset = 0,
  n = GRID_N
): number[] {
  const out: number[] = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      let sum = 0;
      for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 3; i++) {
          sum += getPixel(src, x + i - 1, y + j - 1, n) * kernel[j * 3 + i];
        }
      }
      out.push(clamp(sum / (divisor || 1) + offset));
    }
  }
  return out;
}

export interface DrawOptions {
  nums?: boolean;
  cellSize?: number;
  boxes?: Array<[number, number, number, number, string]>;
  gridLines?: boolean;
}

export function renderToCanvas(
  canvas: HTMLCanvasElement,
  data: (number | null)[],
  opts: DrawOptions = {}
) {
  const n = Math.round(Math.sqrt(data.length));
  const cell = opts.cellSize || 20;
  canvas.width = canvas.height = n * cell;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  data.forEach((v, i) => {
    const x = i % n;
    const y = Math.floor(i / n);
    if (v === null || v === undefined) {
      ctx.fillStyle = '#1e2442';
    } else {
      ctx.fillStyle = `rgb(${v},${v},${v})`;
    }
    ctx.fillRect(x * cell, y * cell, cell, cell);

    if (opts.gridLines) {
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.strokeRect(x * cell, y * cell, cell, cell);
    }

    if (opts.nums && v !== null && v !== undefined && cell >= 18) {
      ctx.fillStyle = v > 128 ? '#000000' : '#ffffff';
      ctx.font = `600 ${Math.round(cell * 0.36)}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(v), x * cell + cell / 2, y * cell + cell / 2);
    }
  });

  (opts.boxes || []).forEach(([bx, by, bw, bh, col]) => {
    ctx.lineWidth = 3;
    ctx.strokeStyle = col;
    ctx.strokeRect(bx * cell + 1.5, by * cell + 1.5, bw * cell - 3, bh * cell - 3);
  });
}
