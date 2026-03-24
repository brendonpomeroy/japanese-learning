import { useTracingCanvas } from '../hooks/useTracingCanvas';

interface TracingCanvasProps {
  guideCharacter: string;
  isDarkMode: boolean;
  onClear?: () => void;
  onHasStrokesChange?: (hasStrokes: boolean) => void;
  clearRef?: React.MutableRefObject<(() => void) | null>;
  hasStrokesRef?: React.MutableRefObject<boolean>;
}

export function TracingCanvas({
  guideCharacter,
  isDarkMode,
  clearRef,
  hasStrokesRef,
}: TracingCanvasProps) {
  const strokeColor = isDarkMode ? '#e5e7eb' : '#1f2937';
  const guideColor = isDarkMode ? '#9ca3af' : '#374151';

  const { canvasRef, clearCanvas, hasStrokes } = useTracingCanvas({
    guideCharacter,
    strokeColor,
    guideColor,
  });

  // Expose clear and hasStrokes to parent
  if (clearRef) clearRef.current = clearCanvas;
  if (hasStrokesRef) hasStrokesRef.current = hasStrokes;

  return (
    <canvas
      ref={canvasRef}
      className="w-full aspect-square max-w-[400px] mx-auto border-2 border-border rounded-xl bg-surface cursor-crosshair"
      style={{ touchAction: 'none' }}
      role="img"
      aria-label={`Tracing canvas for character ${guideCharacter}`}
    />
  );
}
