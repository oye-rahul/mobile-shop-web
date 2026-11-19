'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

export interface ShreeRamScrollytellingProps {
  totalFrames?: number;
  frameDir?: string;
  backgroundColor?: string;
}

export const ShreeRamScrollytelling: React.FC<ShreeRamScrollytellingProps> = ({
  totalFrames = 202,
  frameDir = '/Smartphone_repair_and_delivery_a_53979664_1080p_gwr_video_mvp-ezgif-split',
  backgroundColor = '#000000',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadPct, setLoadPct] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, totalFrames - 1]);

  const getPath = useCallback(
    (i: number) => {
      const num = String(i).padStart(3, '0');
      return `${frameDir}/ezgif-frame-${num}.png`;
    },
    [frameDir]
  );

  const drawFrame = useCallback(
    (idx: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      const img = images[idx] || images[0];
      if (!img || !img.complete) return;

      const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.scale(dpr, dpr);
      }

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      const scale = Math.min(width / img.naturalWidth, height / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      const x = (width - w) / 2;
      const y = (height - h) / 2;

      ctx.drawImage(img, x, y, w, h);
    },
    [images, backgroundColor]
  );

  useMotionValueEvent(frameIndex, 'change', (latest) => {
    const clamped = Math.max(0, Math.min(totalFrames - 1, Math.round(latest)));
    drawFrame(clamped);
  });

  useEffect(() => {
    let loaded = 0;
    const loadedImgs: HTMLImageElement[] = new Array(totalFrames);

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = getPath(i);

      const onDone = () => {
        loaded++;
        const pct = Math.round((loaded / totalFrames) * 100);
        setLoadPct(pct);

        if (loaded >= totalFrames) {
          setImages(loadedImgs);
          setIsLoaded(true);
        }
      };

      img.onload = onDone;
      img.onerror = onDone;
      loadedImgs[i - 1] = img;
    }
  }, [totalFrames, getPath]);

  useEffect(() => {
    if (isLoaded && images.length > 0) {
      drawFrame(0);
    }
  }, [isLoaded, images, drawFrame]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500vh] bg-black"
      style={{ backgroundColor }}
    >
      {/* Loading Screen */}
      {!isLoaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black gap-5 text-white">
          <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          <span className="font-mono text-sm tracking-widest">{loadPct}%</span>
          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100"
              style={{ width: `${loadPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Fixed Canvas: Never scrolls away */}
      <div className="fixed inset-0 w-screen h-screen overflow-hidden flex items-center justify-center bg-black pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </div>
  );
};

export default ShreeRamScrollytelling;
