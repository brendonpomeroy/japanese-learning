import { useRef, useState, useEffect, useCallback } from 'react';

interface UseTracingCanvasOptions {
  guideCharacter: string;
  strokeColor: string;
  guideColor: string;
  strokeWidth?: number;
  guideOpacity?: number;
}

interface UseTracingCanvasReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  clearCanvas: () => void;
  hasStrokes: boolean;
}

export function useTracingCanvas({
  guideCharacter,
  strokeColor,
  guideColor,
  strokeWidth = 4,
  guideOpacity = 0.15,
}: UseTracingCanvasOptions): UseTracingCanvasReturn {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const [hasStrokes, setHasStrokes] = useState(false);
  const strokesRef = useRef<{ x: number; y: number; pressure: number }[][]>([]);
  const currentStrokeRef = useRef<{ x: number; y: number; pressure: number }[]>(
    []
  );

  const getCanvasPoint = useCallback(
    (e: PointerEvent): { x: number; y: number; pressure: number } => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0, pressure: 0.5 };
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        pressure: e.pressure > 0 ? e.pressure : 0.5,
      };
    },
    []
  );

  const drawGuide = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.save();
      ctx.globalAlpha = guideOpacity;
      ctx.fillStyle = guideColor;
      const fontSize = Math.min(width, height) * 0.7;
      ctx.font = `${fontSize}px "Noto Sans CJK JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(guideCharacter, width / 2, height / 2);
      ctx.restore();
    },
    [guideCharacter, guideColor, guideOpacity]
  );

  const redrawStrokes = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.strokeStyle = strokeColor;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (const stroke of strokesRef.current) {
        if (stroke.length < 2) continue;
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineWidth = strokeWidth * (0.5 + stroke[i].pressure);
          ctx.lineTo(stroke[i].x, stroke[i].y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(stroke[i].x, stroke[i].y);
        }
      }
    },
    [strokeColor, strokeWidth]
  );

  const fullRedraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);
    drawGuide(ctx, width, height);
    redrawStrokes(ctx);
    ctx.restore();
  }, [drawGuide, redrawStrokes]);

  // Resize canvas to match container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      fullRedraw();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    // Wait for fonts before initial draw
    document.fonts.ready.then(resize);

    return () => observer.disconnect();
  }, [fullRedraw]);

  // Redraw when guide character or colors change
  useEffect(() => {
    strokesRef.current = [];
    currentStrokeRef.current = [];
    setHasStrokes(false);

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Wait for fonts then redraw
    document.fonts.ready.then(fullRedraw);
  }, [guideCharacter, fullRedraw]);

  // Pointer event handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      isDrawingRef.current = true;
      const point = getCanvasPoint(e);
      currentStrokeRef.current = [point];

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = strokeColor;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = strokeWidth * (0.5 + point.pressure);
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.restore();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDrawingRef.current) return;
      e.preventDefault();
      const point = getCanvasPoint(e);
      const prev =
        currentStrokeRef.current[currentStrokeRef.current.length - 1];
      currentStrokeRef.current.push(point);

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = strokeColor;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = strokeWidth * (0.5 + point.pressure);
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
      ctx.restore();
    };

    const onPointerEnd = (e: PointerEvent) => {
      if (!isDrawingRef.current) return;
      e.preventDefault();
      isDrawingRef.current = false;
      if (currentStrokeRef.current.length > 0) {
        strokesRef.current.push([...currentStrokeRef.current]);
        currentStrokeRef.current = [];
        setHasStrokes(true);
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerEnd);
    canvas.addEventListener('pointercancel', onPointerEnd);
    canvas.addEventListener('pointerleave', onPointerEnd);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerEnd);
      canvas.removeEventListener('pointercancel', onPointerEnd);
      canvas.removeEventListener('pointerleave', onPointerEnd);
    };
  }, [getCanvasPoint, strokeColor, strokeWidth, fullRedraw]);

  const clearCanvas = useCallback(() => {
    strokesRef.current = [];
    currentStrokeRef.current = [];
    setHasStrokes(false);
    fullRedraw();
  }, [fullRedraw]);

  return { canvasRef, clearCanvas, hasStrokes };
}
