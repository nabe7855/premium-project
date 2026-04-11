'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Camera, Undo, Trash2, Check, Sparkles, Image as ImageIcon, Info, MousePointer2, Move, RotateCcw } from 'lucide-react';
import Script from 'next/script';
import { v4 as uuidv4 } from 'uuid';

interface PortraitEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (blob: Blob) => void;
  initialImage: File | string;
}

type BgMode = 'none' | 'blur' | 'studio' | 'white' | 'gray';
type MosMode = 'brush' | 'circle' | 'rect';

interface MosLayer {
  id: string;
  type: MosMode | 'path';
  points?: { x: number; y: number }[];
  cx: number;
  cy: number;
  r?: number;
  w?: number;
  h?: number;
  size: number;
  opacity: number;
  glow: number;
}

export default function PortraitEditorModal({
  isOpen,
  onClose,
  onApply,
  initialImage,
}: PortraitEditorModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [bgMode, setBgMode] = useState<BgMode>('none');
  const [mosMode, setMosMode] = useState<MosMode>('brush');
  const [mosLayers, setMosLayers] = useState<MosLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [segState, setSegState] = useState<'none' | 'loading' | 'ready'>('none');
  const [personMask, setPersonMask] = useState<HTMLCanvasElement | null>(null);
  const [faceCenter, setFaceCenter] = useState({ x: 50, y: 30 }); // %

  // Params (Global or for Selected Layer)
  const [blurAmt, setBlurAmt] = useState(20);
  const [edgeSoft, setEdgeSoft] = useState(3);
  const [mosSize, setMosSize] = useState(90);
  const [mosOpacity, setMosOpacity] = useState(92);
  const [mosGlow, setMosGlow] = useState(45);

  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingLayer, setIsDraggingLayer] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [currentPath, setCurrentPath] = useState<MosLayer | null>(null);

  const selfieSegmentationRef = useRef<any>(null);

  // Initialize MediaPipe
  const initMediaPipe = useCallback(() => {
    if (typeof (window as any).SelfieSegmentation === 'undefined') return;
    if (selfieSegmentationRef.current) return;

    const selfieSegmentation = new (window as any).SelfieSegmentation({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
    });
    selfieSegmentation.setOptions({ modelSelection: 1 });
    selfieSegmentation.onResults((results: any) => {
      setPersonMask(results.segmentationMask);
      setSegState('ready');
      setIsProcessing(false);
    });
    selfieSegmentationRef.current = selfieSegmentation;
  }, []);

  const runSegmentation = useCallback(async (image: HTMLImageElement) => {
    if (!selfieSegmentationRef.current) return;
    setSegState('loading');
    setIsProcessing(true);
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = image.naturalWidth;
    tempCanvas.height = image.naturalHeight;
    tempCanvas.getContext('2d')?.drawImage(image, 0, 0);
    
    try {
      await selfieSegmentationRef.current.send({ image: tempCanvas });
    } catch (e) {
      console.error('Segmentation error:', e);
      setSegState('none');
      setIsProcessing(false);
    }
  }, []);

  // Load Initial Image
  useEffect(() => {
    if (!isOpen) return;
    
    const load = async () => {
      let src = '';
      if (typeof initialImage === 'string') {
        src = initialImage;
      } else {
        src = URL.createObjectURL(initialImage);
      }

      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        setImg(image);
        setMosLayers([]);
        setPersonMask(null);
        setSegState('none');
        if ((window as any).SelfieSegmentation) {
          initMediaPipe();
          setTimeout(() => runSegmentation(image), 500);
        }
      };
      image.src = src;
    };

    load();
  }, [isOpen, initialImage, initMediaPipe, runSegmentation]);

  // Handle Layer Selection - Update Sliders
  useEffect(() => {
    if (selectedLayerId) {
      const layer = mosLayers.find(l => l.id === selectedLayerId);
      if (layer) {
        setMosSize(layer.size);
        setMosOpacity(Math.round(layer.opacity * 100));
        setMosGlow(layer.glow);
      }
    }
  }, [selectedLayerId, mosLayers]);

  // Update Selected Layer Params
  const updateSelectedLayer = (updates: Partial<MosLayer>) => {
    if (!selectedLayerId) return;
    setMosLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, ...updates } : l));
  };

  const handleMosSizeChange = (val: number) => {
    setMosSize(val);
    if (selectedLayerId) updateSelectedLayer({ size: val });
  };
  const handleMosOpacityChange = (val: number) => {
    setMosOpacity(val);
    if (selectedLayerId) updateSelectedLayer({ opacity: val / 100 });
  };
  const handleMosGlowChange = (val: number) => {
    setMosGlow(val);
    if (selectedLayerId) updateSelectedLayer({ glow: val });
  };

  // ─── RENDER LOGIC ─────────────────────────────────────────

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderTo(ctx, canvas.width, canvas.height, 1, true);
  }, [img, bgMode, blurAmt, edgeSoft, mosLayers, personMask, segState, selectedLayerId]);

  const renderTo = (ctx: CanvasRenderingContext2D, cw: number, ch: number, scale: number, interactive: boolean = false) => {
    ctx.clearRect(0, 0, cw, ch);
    if (!img) return;

    // 1. Draw Background
    if (bgMode === 'none') {
      ctx.drawImage(img, 0, 0, cw, ch);
    } else {
      drawBackground(ctx, cw, ch, blurAmt * scale);
      
      if (personMask && segState === 'ready') {
        const personOff = document.createElement('canvas');
        personOff.width = cw; personOff.height = ch;
        const poc = personOff.getContext('2d')!;
        poc.drawImage(img, 0, 0, cw, ch);

        const maskOff = document.createElement('canvas');
        maskOff.width = cw; maskOff.height = ch;
        const moc = maskOff.getContext('2d')!;
        if (edgeSoft > 0) moc.filter = `blur(${edgeSoft * scale}px)`;
        moc.drawImage(personMask, 0, 0, cw, ch);
        moc.filter = 'none';

        poc.globalCompositeOperation = 'destination-in';
        poc.drawImage(maskOff, 0, 0);
        ctx.drawImage(personOff, 0, 0);
      } else {
        drawPersonFallback(ctx, cw, ch, edgeSoft * scale);
      }

      if (bgMode === 'studio') drawDropShadow(ctx, cw, ch);
    }

    // 2. Draw Mosaic Layers
    const drawScale = cw / (canvasRef.current?.width || cw);
    
    mosLayers.forEach(layer => {
      ctx.save();
      const isActive = layer.id === selectedLayerId;
      
      if (layer.type === 'path' && layer.points) {
        layer.points.forEach(pt => {
          drawGlowCircle(ctx, pt.x * drawScale, pt.y * drawScale, layer.size * scale, layer.opacity, layer.glow * scale);
        });
      } else if (layer.type === 'circle') {
        drawGlowCircle(ctx, layer.cx * drawScale, layer.cy * drawScale, (layer.r || 0) * drawScale, layer.opacity, layer.glow * scale);
      } else if (layer.type === 'rect') {
        drawGlowRect(ctx, layer.cx * drawScale, layer.cy * drawScale, (layer.w || 0) * drawScale, (layer.h || 0) * drawScale, layer.opacity, layer.glow * scale);
      }

      // Selection Highlight
      if (interactive && isActive) {
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = '#5b8dee';
        ctx.lineWidth = 2;
        if (layer.type === 'circle') {
          ctx.beginPath();
          ctx.arc(layer.cx * drawScale, layer.cy * drawScale, (layer.r || 0) * drawScale + layer.glow + 2, 0, Math.PI * 2);
          ctx.stroke();
        } else if (layer.type === 'rect') {
          ctx.strokeRect(
            Math.min(layer.cx, layer.cx + (layer.w || 0)) * drawScale - layer.glow - 2, 
            Math.min(layer.cy, layer.cy + (layer.h || 0)) * drawScale - layer.glow - 2, 
            Math.abs(layer.w || 0) * drawScale + layer.glow * 2 + 4, 
            Math.abs(layer.h || 0) * drawScale + layer.glow * 2 + 4
          );
        }
      }
      ctx.restore();
    });
  };

  const drawBackground = (ctx: CanvasRenderingContext2D, cw: number, ch: number, blur: number) => {
    if (!img) return;
    if (bgMode === 'blur') {
      const off = document.createElement('canvas');
      off.width = cw; off.height = ch;
      const oc = off.getContext('2d')!;
      oc.filter = `blur(${blur}px) brightness(1.05)`; // Slight boost for bokeh
      oc.drawImage(img, 0, 0, cw, ch);
      ctx.drawImage(off, 0, 0);
      
      const vg = ctx.createRadialGradient(cw/2, ch/2, cw*0.1, cw/2, ch/2, cw*0.9);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,0,0.3)');
      ctx.fillStyle = vg; ctx.fillRect(0, 0, cw, ch);
    } else if (bgMode === 'studio') {
      const bg = ctx.createLinearGradient(0, 0, 0, ch);
      bg.addColorStop(0, '#f0f0f0'); bg.addColorStop(0.5, '#e8e8e8');
      bg.addColorStop(0.7, '#dfdfdf'); bg.addColorStop(1, '#d5d5d5');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, cw, ch);
      
      const hg = ctx.createRadialGradient(cw/2, ch*0.6, 0, cw/2, ch*0.6, cw*0.8);
      hg.addColorStop(0, 'rgba(255,255,255,0.6)');
      hg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = hg; ctx.fillRect(0, 0, cw, ch);
    } else if (bgMode === 'white') {
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, cw, ch);
    } else if (bgMode === 'gray') {
      ctx.fillStyle = '#d6d6d6'; ctx.fillRect(0, 0, cw, ch);
    }
  };

  const drawPersonFallback = (ctx: CanvasRenderingContext2D, cw: number, ch: number, soft: number) => {
    if (!img) return;
    const personOff = document.createElement('canvas');
    personOff.width = cw; personOff.height = ch;
    const poc = personOff.getContext('2d')!;
    poc.drawImage(img, 0, 0, cw, ch);

    const maskOff = document.createElement('canvas');
    maskOff.width = cw; maskOff.height = ch;
    const moc = maskOff.getContext('2d')!;
    const cx = cw / 2, cy = ch / 2, rx = cw * 0.44, ry = ch * 0.47;
    const s = Math.max(2, soft * 3 + 8);
    for (let i = s; i >= 0; i--) {
      moc.globalAlpha = (1 - i / s) / (s * 0.4);
      moc.beginPath(); moc.ellipse(cx, cy, rx + i * 2, ry + i * 2, 0, 0, Math.PI * 2);
      moc.fillStyle = 'white'; moc.fill();
    }
    moc.globalAlpha = 1;
    moc.beginPath(); moc.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    moc.fillStyle = 'white'; moc.fill();

    poc.globalCompositeOperation = 'destination-in';
    poc.drawImage(maskOff, 0, 0);
    ctx.drawImage(personOff, 0, 0);
  };

  const drawDropShadow = (ctx: CanvasRenderingContext2D, cw: number, ch: number) => {
    const footY = ch * 0.93;
    const footX = cw / 2;
    ctx.save();
    ctx.scale(1, 0.25);
    const sg = ctx.createRadialGradient(footX, footY / 0.25, 0, footX, footY / 0.25, cw * 0.4);
    sg.addColorStop(0, 'rgba(0,0,0,0.35)');
    sg.addColorStop(0.6, 'rgba(0,0,0,0.1)');
    sg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sg;
    ctx.beginPath(); ctx.arc(footX, footY / 0.25, cw * 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  };

  const drawGlowCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, opacity: number, glow: number) => {
    if (r <= 0) return;
    const outerR = r + glow;
    const og = ctx.createRadialGradient(x, y, 0, x, y, outerR);
    og.addColorStop(0, `rgba(255,255,255,${opacity})`);
    og.addColorStop(0.6, `rgba(255,255,255,${opacity * 0.5})`);
    og.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = og;
    ctx.beginPath(); ctx.arc(x, y, outerR, 0, Math.PI * 2); ctx.fill();

    const ig = ctx.createRadialGradient(x, y, 0, x, y, r);
    ig.addColorStop(0, `rgba(255,255,255,${Math.min(1, opacity + 0.15)})`);
    ig.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = ig;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  };

  const drawGlowRect = (ctx: CanvasRenderingContext2D, x1: number, y1: number, w: number, h: number, opacity: number, glow: number) => {
    const ax = Math.min(x1, x1+w), ay = Math.min(y1, y1+h);
    const aw = Math.abs(w), ah = Math.abs(h);
    const mx = ax + aw/2, my = ay + ah/2;
    const maxR = Math.sqrt(aw*aw + ah*ah) / 1.5 + glow;
    
    ctx.save();
    const og = ctx.createRadialGradient(mx, my, 0, mx, my, maxR);
    og.addColorStop(0, `rgba(255,255,255,${opacity})`);
    og.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = og; 
    ctx.fillRect(ax - glow, ay - glow, aw + glow*2, ah + glow*2);
    
    ctx.fillStyle = `rgba(255,255,255,${Math.min(1, opacity + 0.1)})`; 
    ctx.fillRect(ax, ay, aw, ah);
    ctx.restore();
  };

  // ─── INTERACTION ─────────────────────────────────────────

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!img) return;
    const pos = getPos(e);
    setDragStart(pos);

    // 1. Try selecting existing shape first
    const hitId = hitTest(pos);
    if (hitId) {
      setSelectedLayerId(hitId);
      setIsDraggingLayer(true);
      const layer = mosLayers.find(l => l.id === hitId)!;
      setDragOffset({ x: pos.x - layer.cx, y: pos.y - layer.cy });
      setIsDragging(true);
      return;
    }

    // 2. Otherwise start drawing if not selecting
    setIsDragging(true);
    setIsDraggingLayer(false);
    setSelectedLayerId(null);
    
    if (mosMode === 'brush') {
      const next: MosLayer = { id: uuidv4(), type: 'path', points: [pos], cx: pos.x, cy: pos.y, size: mosSize, opacity: mosOpacity / 100, glow: mosGlow };
      setCurrentPath(next);
      setMosLayers(prev => [...prev, next]);
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !img) return;
    const pos = getPos(e);

    if (isDraggingLayer && selectedLayerId) {
      // Move selected layer
      updateSelectedLayer({ cx: pos.x - dragOffset.x, cy: pos.y - dragOffset.y });
      render();
    } else if (mosMode === 'brush' && currentPath) {
      currentPath.points?.push(pos);
      render();
    } else if (dragStart) {
      render(); // Ghost drawing
      const ctx = canvasRef.current!.getContext('2d')!;
      const dx = pos.x - dragStart.x, dy = pos.y - dragStart.y;
      if (mosMode === 'circle') drawGlowCircle(ctx, dragStart.x, dragStart.y, Math.sqrt(dx*dx+dy*dy), mosOpacity/100, mosGlow);
      else if (mosMode === 'rect') drawGlowRect(ctx, dragStart.x, dragStart.y, dx, dy, mosOpacity/100, mosGlow);
    }
  };

  const handleEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const pos = getPos(e);

    if (!isDraggingLayer && dragStart && (mosMode === 'circle' || mosMode === 'rect')) {
      const dx = pos.x - dragStart.x, dy = pos.y - dragStart.y;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        const next: MosLayer = {
          id: uuidv4(),
          type: mosMode,
          cx: dragStart.x, cy: dragStart.y,
          r: mosMode === 'circle' ? Math.sqrt(dx*dx+dy*dy) : undefined,
          w: mosMode === 'rect' ? dx : undefined,
          h: mosMode === 'rect' ? dy : undefined,
          size: mosSize, opacity: mosOpacity / 100, glow: mosGlow
        };
        setMosLayers(prev => [...prev, next]);
        setSelectedLayerId(next.id);
      }
    }
    
    setIsDraggingLayer(false);
    setCurrentPath(null);
    render();
  };

  const hitTest = (pos: { x: number; y: number }) => {
    // Reverse order for top-most selection
    for (let i = mosLayers.length - 1; i >= 0; i--) {
      const l = mosLayers[i];
      if (l.type === 'circle' && l.r) {
        const d = Math.sqrt((pos.x - l.cx)**2 + (pos.y - l.cy)**2);
        if (d <= l.r + (l.glow * 0.8)) return l.id;
      } else if (l.type === 'rect' && l.w && l.h) {
        const minX = Math.min(l.cx, l.cx + l.w), maxX = Math.max(l.cx, l.cx + l.w);
        const minY = Math.min(l.cy, l.cy + l.h), maxY = Math.max(l.cy, l.cy + l.h);
        const g = l.glow * 0.8;
        if (pos.x >= minX - g && pos.x <= maxX + g && pos.y >= minY - g && pos.y <= maxY + g) return l.id;
      } else if (l.type === 'path' && l.points) {
        // Simple bounding box hit test for path
        const xs = l.points.map(p => p.x), ys = l.points.map(p => p.y);
        const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
        const g = l.glow * 0.8;
        if (pos.x >= minX - g && pos.x <= maxX + g && pos.y >= minY - g && pos.y <= maxY + g) return l.id;
      }
    }
    return null;
  };

  const getPos = (e: any) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * (canvasRef.current.width / rect.width),
      y: (src.clientY - rect.top) * (canvasRef.current.height / rect.height)
    };
  };

  // ─── ACTIONS ─────────────────────────────────────────────

  const handleApply = async () => {
    if (!canvasRef.current || !img) return;
    const hc = document.createElement('canvas');
    hc.width = img.width; hc.height = img.height;
    const hctx = hc.getContext('2d')!;
    const scale = img.width / canvasRef.current.width;
    renderTo(hctx, hc.width, hc.height, scale, false);
    hc.toBlob((blob) => { if (blob) onApply(blob); }, 'image/webp', 0.88);
  };

  const addPreset = (type: 'face' | 'mouth' | 'eye' | 'full') => {
    if (!canvasRef.current) return;
    const cw = canvasRef.current.width, ch = canvasRef.current.height;
    
    // Improved face detection center adjustment
    const baseFcyOffset = type === 'face' ? 0 : type === 'mouth' ? 0.68 : type === 'eye' ? -0.12 : 0.45;
    const baseRScale = type === 'face' ? 1.05 : type === 'mouth' ? 0.52 : type === 'eye' ? 0.58 : 1.9;
    
    const fcx = cw * faceCenter.x / 100;
    const fcy = ch * faceCenter.y / 100;
    const faceR = Math.min(cw, ch) * 0.135;
    const p = { size: mosSize, opacity: mosOpacity / 100, glow: mosGlow };

    const next: MosLayer = {
      id: uuidv4(),
      type: 'circle',
      cx: fcx,
      cy: fcy + (faceR * baseFcyOffset),
      r: faceR * baseRScale,
      ...p
    };

    setMosLayers(prev => [...prev, next]);
    setSelectedLayerId(next.id);
    render();
  };

  // Handle Canvas Resize
  useEffect(() => {
    if (!img || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const box = canvas.parentElement;
    if (!box) return;

    const boxW = box.clientWidth;
    const ratio = img.width / img.height;
    const maxH = window.innerHeight * 0.65;
    let cw = boxW, ch = boxW / ratio;
    if (ch > maxH) { ch = maxH; cw = ch * ratio; }
    
    canvas.width = cw;
    canvas.height = ch;
    render();
  }, [img, bgMode, blurAmt, edgeSoft, mosLayers, personMask, segState, selectedLayerId]);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js"
        onLoad={() => { if (img) { initMediaPipe(); runSegmentation(img); } }}
      />

      <Dialog.Root open={isOpen} onOpenChange={onClose}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/85 backdrop-blur animate-in fade-in duration-300" />
          <Dialog.Content className="fixed inset-0 z-[101] flex flex-col md:inset-6 md:rounded-3xl bg-[#0b0c0e] text-[#e8eaf0] border border-[#2a2f3a] overflow-hidden animate-in zoom-in-95 duration-300 shadow-2xl">
            
            {/* Header */}
            <header className="flex items-center justify-between border-b border-[#2a2f3a] bg-[#121418] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 p-2 shadow-lg">
                  <Camera className="text-white" size={18} />
                </div>
                <div>
                  <h2 className="text-base font-black tracking-tight text-white uppercase italic">Portrait Master</h2>
                  <p className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">AI写真加工・修正ツール</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="rounded-full bg-[#1e2129] p-2 text-gray-400 transition hover:bg-rose-500 hover:text-white shadow-inner"
              >
                <X size={20} />
              </button>
            </header>

            {/* Main Content */}
            <main className="flex flex-1 flex-col gap-0 overflow-hidden lg:flex-row bg-[#0b0c0e]">
              
              {/* Canvas Area */}
              <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6 bg-[#060708]">
                <div className="relative flex-1 flex items-center justify-center rounded-2xl bg-black border border-[#1e2129] overflow-hidden shadow-2xl group">
                  <div className="absolute inset-0 bg-[radial-gradient(#1e1f26_1px,transparent_1.5px)] [background-size:24px_24px] opacity-20" />
                  <canvas 
                    ref={canvasRef}
                    onMouseDown={handleStart}
                    onMouseMove={handleMove}
                    onMouseUp={handleEnd}
                    onTouchStart={handleStart}
                    onTouchMove={handleMove}
                    onTouchEnd={handleEnd}
                    className="relative z-10 max-h-full max-w-full touch-none shadow-2xl"
                    style={{ cursor: isDraggingLayer ? 'move' : (mosMode === 'brush' ? 'crosshair' : 'default') }}
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 gap-5 backdrop-blur-sm">
                      <div className="relative">
                        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500/10 border-t-blue-500" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Sparkles className="text-blue-400 animate-pulse" size={24} />
                        </div>
                      </div>
                      <p className="text-xs font-black tracking-[0.2em] text-blue-400 animate-pulse uppercase">AIが人物を解析中...</p>
                    </div>
                  )}
                  
                  {/* Active Tool Label */}
                  <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-md border border-white/5 pointer-events-none">
                    <MousePointer2 size={12} className="text-blue-400" />
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                      {selectedLayerId ? 'アイテム選択中' : `ツール: ${mosMode}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="w-full lg:w-[340px] flex flex-col gap-4 p-4 lg:p-6 bg-[#121418] border-l border-[#2a2f3a] overflow-y-auto">
                
                {/* Background Group */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                      <ImageIcon size={14} className="text-blue-400" /> 背景処理
                    </h3>
                    {bgMode !== 'none' && (
                      <span className="text-[10px] font-bold text-blue-400 animate-pulse">補正適用中</span>
                    )}
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {(['none', 'blur', 'studio', 'white', 'gray'] as BgMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setBgMode(mode)}
                        className={`group relative flex flex-col items-center justify-center rounded-xl p-2 gap-1.5 transition-all overflow-hidden ${
                          bgMode === mode 
                          ? 'bg-blue-600/20 border-blue-500 shadow-lg ring-1 ring-blue-500/50' 
                          : 'bg-[#1e2129] border-[#2a2f3a] hover:bg-[#2a2f3a]'
                        } border`}
                      >
                        <div className={`h-1.5 w-full rounded-full ${
                          mode === 'none' ? 'bg-gray-600' : mode === 'blur' ? 'bg-blue-400' : mode === 'studio' ? 'bg-purple-400' : mode === 'white' ? 'bg-white' : 'bg-gray-400'
                        }`} />
                        <span className={`text-[9px] font-black uppercase tracking-tighter ${bgMode === mode ? 'text-blue-400' : 'text-gray-500'}`}>
                          {mode === 'none' ? 'なし' : mode === 'blur' ? 'ボケ' : mode === 'studio' ? 'スタジオ' : mode === 'white' ? '白背景' : 'グレー'}
                        </span>
                      </button>
                    ))}
                  </div>
                  {bgMode === 'blur' && (
                    <div className="rounded-2xl bg-[#0b0c0e] p-4 space-y-4 border border-[#1e2129]">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">ボケ強度</label>
                          <span className="text-[10px] font-mono text-blue-400">{blurAmt}px</span>
                        </div>
                        <input 
                          type="range" min="2" max="50" value={blurAmt} 
                          onChange={(e) => setBlurAmt(+e.target.value)}
                          className="w-full h-1 rounded-full accent-blue-500 bg-[#2a2f3a] appearance-none"
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">輪郭の柔らかさ</label>
                          <span className="text-[10px] font-mono text-blue-400">{edgeSoft}px</span>
                        </div>
                        <input 
                          type="range" min="0" max="20" value={edgeSoft} 
                          onChange={(e) => setEdgeSoft(+e.target.value)}
                          className="w-full h-1 rounded-full accent-blue-500 bg-[#2a2f3a] appearance-none"
                        />
                      </div>
                    </div>
                  )}
                </section>

                <div className="h-[1px] bg-gradient-to-r from-transparent via-[#2a2f3a] to-transparent my-2" />

                {/* Privacy/Mosaic Group */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                      <Sparkles size={14} className="text-purple-400" /> モザイク加工
                    </h3>
                  </div>
                  
                  {/* Preset Targets */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['face', 'mouth', 'eye', 'full'] as const).map(type => (
                      <button 
                        key={type}
                        onClick={() => addPreset(type)}
                        className="group relative rounded-xl bg-purple-500/10 border border-purple-500/20 py-2.5 transition active:scale-95 flex flex-col items-center gap-1 hover:bg-purple-500/20 hover:border-purple-500/40"
                      >
                        <span className={`text-[9px] font-black uppercase tracking-tighter text-purple-300`}>
                          {type === 'face' ? '顔全体' : type === 'mouth' ? '口元' : type === 'eye' ? '目元' : '全身'}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Manual Shape Tool */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['brush', 'circle', 'rect'] as MosMode[]).map(mode => (
                      <button
                        key={mode}
                        onClick={() => { setMosMode(mode); setSelectedLayerId(null); }}
                        className={`flex flex-col items-center justify-center rounded-xl p-2.5 gap-1 transition-all ${
                          mosMode === mode && !selectedLayerId 
                          ? 'bg-purple-600/20 border-purple-500 shadow-lg ring-1 ring-purple-500/50' 
                          : 'bg-[#1e2129] border-[#2a2f3a] hover:bg-[#2a2f3a]'
                        } border`}
                      >
                        <span className={`text-[10px] font-black uppercase tracking-tight ${mosMode === mode && !selectedLayerId ? 'text-purple-400' : 'text-gray-500'}`}>
                          {mode === 'brush' ? 'ブラシ' : mode === 'circle' ? '円形' : '矩形'}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Property Adjusters (Selected or Default) */}
                  <div className="rounded-2xl bg-[#0b0c0e] p-4 space-y-4 border border-[#1e2129]">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">サイズ</label>
                        <span className="text-[10px] font-mono text-purple-400">{mosSize}px</span>
                      </div>
                      <input 
                        type="range" min="10" max="360" value={mosSize} 
                        onChange={(e) => handleMosSizeChange(+e.target.value)}
                        className="w-full h-1 rounded-full accent-purple-500 bg-[#2a2f3a] appearance-none"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">不透明度</label>
                        <span className="text-[10px] font-mono text-purple-400">{mosOpacity}%</span>
                      </div>
                      <input 
                        type="range" min="5" max="100" value={mosOpacity} 
                        onChange={(e) => handleMosOpacityChange(+e.target.value)}
                        className="w-full h-1 rounded-full accent-purple-500 bg-[#2a2f3a] appearance-none"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">発光（白）</label>
                        <span className="text-[10px] font-mono text-purple-400">{mosGlow}pt</span>
                      </div>
                      <input 
                        type="range" min="0" max="200" value={mosGlow} 
                        onChange={(e) => handleMosGlowChange(+e.target.value)}
                        className="w-full h-1 rounded-full accent-purple-500 bg-[#2a2f3a] appearance-none"
                      />
                    </div>
                  </div>
                </section>

                {/* Footer Actions */}
                <div className="mt-auto flex flex-col gap-2 pt-4">
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => {
                        if (selectedLayerId) {
                          setMosLayers(prev => prev.filter(l => l.id !== selectedLayerId));
                          setSelectedLayerId(null);
                        } else {
                          setMosLayers(prev => prev.slice(0, -1));
                        }
                      }}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#1e2129] border border-[#2a2f3a] py-3 text-[10px] font-black text-gray-400 transition hover:bg-rose-500/10 hover:text-rose-400 uppercase tracking-tighter"
                    >
                      <RotateCcw size={12} /> {selectedLayerId ? 'レイヤーを削除' : 'ひとつ戻す'}
                    </button>
                    <button 
                      onClick={() => { setMosLayers([]); setSelectedLayerId(null); }}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#1e2129] border border-[#2a2f3a] py-3 text-[10px] font-black text-gray-400 transition hover:bg-rose-500/20 hover:text-rose-400 uppercase tracking-tighter"
                    >
                      <Trash2 size={12} /> すべて消す
                    </button>
                  </div>
                  <button 
                    onClick={handleApply}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 py-4 text-xs font-black text-white shadow-xl shadow-pink-500/20 transition active:scale-[0.98] hover:shadow-pink-500/30 uppercase tracking-[0.2em] italic"
                  >
                    <Check size={18} strokeWidth={3} /> 加工を完了して保存
                  </button>
                </div>
              </div>
            </main>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
