'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Camera, Undo, Trash2, Download, Check, Sparkles, User, Image as ImageIcon, Info } from 'lucide-react';
import Script from 'next/script';

interface PortraitEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (blob: Blob) => void;
  initialImage: File | string;
}

type BgMode = 'none' | 'blur' | 'studio' | 'white' | 'gray';
type MosMode = 'brush' | 'circle' | 'rect';

interface MosLayer {
  type: MosMode | 'path';
  points?: { x: number; y: number }[];
  cx?: number;
  cy?: number;
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [segState, setSegState] = useState<'none' | 'loading' | 'ready'>('none');
  const [personMask, setPersonMask] = useState<HTMLCanvasElement | null>(null);
  const [faceCenter, setFaceCenter] = useState({ x: 50, y: 30 }); // %

  // Params
  const [blurAmt, setBlurAmt] = useState(20);
  const [edgeSoft, setEdgeSoft] = useState(3);
  const [mosSize, setMosSize] = useState(90);
  const [mosOpacity, setMosOpacity] = useState(92);
  const [mosGlow, setMosGlow] = useState(45);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
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
    
    // Create a temporary canvas to send image data
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
        // Wait for MediaPipe if needed
        if ((window as any).SelfieSegmentation) {
          initMediaPipe();
          setTimeout(() => runSegmentation(image), 500);
        }
      };
      image.src = src;
    };

    load();
  }, [isOpen, initialImage, initMediaPipe, runSegmentation]);

  // Handle Canvas Resize & Initial Render
  useEffect(() => {
    if (!img || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const box = canvas.parentElement;
    if (!box) return;

    const boxW = box.clientWidth;
    const ratio = img.width / img.height;
    const maxH = window.innerHeight * 0.6;
    let cw = boxW, ch = boxW / ratio;
    if (ch > maxH) { ch = maxH; cw = ch * ratio; }
    
    canvas.width = cw;
    canvas.height = ch;
    render();
  }, [img, bgMode, blurAmt, edgeSoft, mosLayers, personMask, segState]);

  // Estimation of face from mask (helper)
  useEffect(() => {
    if (!personMask) return;
    const mc = personMask.width, mh = personMask.height;
    const tc = document.createElement('canvas');
    tc.width = mc; tc.height = mh;
    const tctx = tc.getContext('2d');
    if (!tctx) return;
    tctx.drawImage(personMask, 0, 0);
    const data = tctx.getImageData(0, 0, mc, mh).data;

    let minY = mh, maxY = 0, sumX = 0, count = 0;
    for (let y = 0; y < mh; y++) {
      for (let x = 0; x < mc; x++) {
        const idx = (y * mc + x) * 4;
        if (data[idx] > 128) {
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          sumX += x; count++;
        }
      }
    }
    if (count > 0) {
      const cx = sumX / count / mc * 100;
      const headY = (minY + (maxY - minY) * 0.2) / mh * 100;
      setFaceCenter({ x: cx, y: headY });
    }
  }, [personMask]);

  // ─── RENDER LOGIC ─────────────────────────────────────────

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderTo(ctx, canvas.width, canvas.height, 1);
  }, [img, bgMode, blurAmt, edgeSoft, mosLayers, personMask, segState]);

  const renderTo = (ctx: CanvasRenderingContext2D, cw: number, ch: number, scale: number) => {
    ctx.clearRect(0, 0, cw, ch);
    if (!img) return;

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

      if (bgMode === 'studio') {
        drawDropShadow(ctx, cw, ch);
      }
    }

    // Mosaic Layers
    mosLayers.forEach(layer => {
      if (layer.type === 'path' && layer.points) {
        layer.points.forEach(pt => {
          drawGlowCircle(ctx, pt.x * cw / canvasRef.current!.width, pt.y * ch / canvasRef.current!.height, layer.size * scale, layer.opacity, layer.glow * scale);
        });
      } else if (layer.type === 'circle' && layer.cx !== undefined && layer.cy !== undefined && layer.r !== undefined) {
        drawGlowCircle(ctx, layer.cx * cw / canvasRef.current!.width, layer.cy * ch / canvasRef.current!.height, layer.r * scale, layer.opacity, layer.glow * scale);
      } else if (layer.type === 'rect' && layer.cx !== undefined && layer.cy !== undefined && layer.w !== undefined && layer.h !== undefined) {
        drawGlowRect(ctx, layer.cx * cw / canvasRef.current!.width, layer.cy * ch / canvasRef.current!.height, layer.w * cw / canvasRef.current!.width, layer.h * ch / canvasRef.current!.height, layer.opacity, layer.glow * scale);
      }
    });
  };

  const drawBackground = (ctx: CanvasRenderingContext2D, cw: number, ch: number, blur: number) => {
    if (!img) return;
    if (bgMode === 'blur') {
      const off = document.createElement('canvas');
      off.width = cw; off.height = ch;
      const oc = off.getContext('2d')!;
      oc.filter = `blur(${blur}px)`;
      oc.drawImage(img, 0, 0, cw, ch);
      ctx.drawImage(off, 0, 0);
      
      const vg = ctx.createRadialGradient(cw/2, ch/2, cw*0.2, cw/2, ch/2, cw*0.8);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,0,0.4)');
      ctx.fillStyle = vg; ctx.fillRect(0, 0, cw, ch);
    } else if (bgMode === 'studio') {
      const bg = ctx.createLinearGradient(0, 0, 0, ch);
      bg.addColorStop(0, '#ebebeb'); bg.addColorStop(0.5, '#e4e4e4');
      bg.addColorStop(0.65, '#dedede'); bg.addColorStop(1, '#d4d4d4');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, cw, ch);
      
      const hg = ctx.createRadialGradient(cw/2, ch*0.62, 0, cw/2, ch*0.62, cw*0.7);
      hg.addColorStop(0, 'rgba(255,255,255,0.55)');
      hg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = hg; ctx.fillRect(0, 0, cw, ch);
    } else if (bgMode === 'white') {
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, cw, ch);
    } else if (bgMode === 'gray') {
      ctx.fillStyle = '#d2d2d2'; ctx.fillRect(0, 0, cw, ch);
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
    const s = Math.max(2, soft * 3 + 6);
    for (let i = s; i >= 0; i--) {
      moc.globalAlpha = (1 - i / s) / (s * 0.5);
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
    const footY = ch * 0.92;
    const footX = cw / 2;
    ctx.save();
    ctx.scale(1, 0.28);
    const sg = ctx.createRadialGradient(footX, footY / 0.28, 0, footX, footY / 0.28, cw * 0.38);
    sg.addColorStop(0, 'rgba(0,0,0,0.32)');
    sg.addColorStop(0.55, 'rgba(0,0,0,0.12)');
    sg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sg;
    ctx.beginPath(); ctx.arc(footX, footY / 0.28, cw * 0.38, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  };

  const drawGlowCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, opacity: number, glow: number) => {
    if (r <= 0) return;
    const outerR = r + glow;
    const og = ctx.createRadialGradient(x, y, 0, x, y, outerR);
    og.addColorStop(0, `rgba(255,255,255,${opacity})`);
    og.addColorStop(0.55, `rgba(255,255,255,${opacity * 0.55})`);
    og.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = og;
    ctx.beginPath(); ctx.arc(x, y, outerR, 0, Math.PI * 2); ctx.fill();

    const ig = ctx.createRadialGradient(x, y, 0, x, y, r);
    ig.addColorStop(0, `rgba(255,255,255,${Math.min(1, opacity + 0.07)})`);
    ig.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = ig;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  };

  const drawGlowRect = (ctx: CanvasRenderingContext2D, x1: number, y1: number, w: number, h: number, opacity: number, glow: number) => {
    const ax = Math.min(x1, x1+w), ay = Math.min(y1, y1+h);
    const aw = Math.abs(w), ah = Math.abs(h);
    const mx = ax + aw/2, my = ay + ah/2;
    const maxR = Math.sqrt(aw*aw + ah*ah) / 2 + glow;
    const og = ctx.createRadialGradient(mx, my, 0, mx, my, maxR);
    og.addColorStop(0, `rgba(255,255,255,${opacity})`);
    og.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = og; ctx.fillRect(ax - glow, ay - glow, aw + glow*2, ah + glow*2);
    ctx.fillStyle = `rgba(255,255,255,${opacity})`; ctx.fillRect(ax, ay, aw, ah);
  };

  // ─── POINTER EVENTS ─────────────────────────────────────

  const getPos = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const src = (e as any).touches ? (e as any).touches[0] : e;
    return {
      x: (src.clientX - rect.left) * (canvasRef.current.width / rect.width),
      y: (src.clientY - rect.top) * (canvasRef.current.height / rect.height)
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!img) return;
    const pos = getPos(e);
    setIsDragging(true);
    if (mosMode === 'brush') {
      const next: MosLayer = { type: 'path', points: [pos], size: mosSize, opacity: mosOpacity / 100, glow: mosGlow };
      setCurrentPath(next);
      setMosLayers(prev => [...prev, next]);
    } else {
      setDragStart(pos);
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !img) return;
    const pos = getPos(e);
    if (mosMode === 'brush' && currentPath) {
      currentPath.points?.push(pos);
      render();
    } else if (dragStart) {
      render(); // Clear move ghosts
      const ctx = canvasRef.current!.getContext('2d')!;
      const dx = pos.x - dragStart.x, dy = pos.y - dragStart.y;
      if (mosMode === 'circle') drawGlowCircle(ctx, dragStart.x, dragStart.y, Math.sqrt(dx*dx+dy*dy), mosOpacity/100, mosGlow);
      else drawGlowRect(ctx, dragStart.x, dragStart.y, dx, dy, mosOpacity/100, mosGlow);
    }
  };

  const handleEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragStart && (mosMode === 'circle' || mosMode === 'rect')) {
      const pos = getPos(e);
      const dx = pos.x - dragStart.x, dy = pos.y - dragStart.y;
      const next: MosLayer = {
        type: mosMode,
        cx: dragStart.x, cy: dragStart.y,
        r: mosMode === 'circle' ? Math.sqrt(dx*dx+dy*dy) : undefined,
        w: mosMode === 'rect' ? dx : undefined,
        h: mosMode === 'rect' ? dy : undefined,
        size: mosSize, opacity: mosOpacity / 100, glow: mosGlow
      };
      setMosLayers(prev => [...prev, next]);
      setDragStart(null);
    }
    setCurrentPath(null);
    render();
  };

  // ─── ACTIONS ─────────────────────────────────────────────

  const handleApply = async () => {
    if (!canvasRef.current || !img) return;
    
    // Create high-res output
    const hc = document.createElement('canvas');
    hc.width = img.width;
    hc.height = img.height;
    const hctx = hc.getContext('2d')!;
    const scale = img.width / canvasRef.current.width;
    
    renderTo(hctx, hc.width, hc.height, scale);
    
    hc.toBlob((blob) => {
      if (blob) onApply(blob);
    }, 'image/webp', 0.85);
  };

  const addPreset = (type: 'face' | 'mouth' | 'eye' | 'full') => {
    if (!canvasRef.current) return;
    const cw = canvasRef.current.width, ch = canvasRef.current.height;
    const fcx = cw * faceCenter.x / 100;
    const fcy = ch * faceCenter.y / 100;
    const faceR = Math.min(cw, ch) * 0.14;
    const p = { size: mosSize, opacity: mosOpacity / 100, glow: mosGlow };

    let next: MosLayer | null = null;
    if (type === 'face') next = { type: 'circle', cx: fcx, cy: fcy, r: faceR * 1.1, ...p };
    if (type === 'mouth') next = { type: 'circle', cx: fcx, cy: fcy + faceR * 0.65, r: faceR * 0.55, ...p };
    if (type === 'eye') next = { type: 'circle', cx: fcx, cy: fcy - faceR * 0.15, r: faceR * 0.6, ...p };
    if (type === 'full') next = { type: 'circle', cx: fcx, cy: fcy + faceR * 0.5, r: faceR * 2.0, ...p };

    if (next) setMosLayers(prev => [...prev, next!]);
  };

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js"
        onLoad={() => {
          if (img) {
            initMediaPipe();
            runSegmentation(img);
          }
        }}
      />

      <Dialog.Root open={isOpen} onOpenChange={onClose}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" />
          <Dialog.Content className="fixed inset-0 z-[101] flex flex-col md:inset-4 md:rounded-3xl bg-[#0e1012] text-[#e8eaf0] overflow-hidden animate-in zoom-in-95 duration-300">
            
            {/* Header */}
            <header className="flex items-center justify-between border-bottom border-[#2a2f3a] bg-[#17191e] px-6 py-4">
              <div className="flex items-center gap-3">
                <Camera className="text-pink-400" size={20} />
                <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ポートレート加工
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="rounded-full p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
              >
                <X size={24} />
              </button>
            </header>

            {/* Main Content */}
            <main className="flex flex-1 flex-col gap-6 p-6 overflow-y-auto lg:flex-row">
              
              {/* Canvas Area */}
              <div className="flex flex-1 flex-col gap-4">
                <div className="relative flex-1 flex items-center justify-center rounded-2xl bg-[#060809] border border-[#2a2f3a] overflow-hidden min-h-[300px]">
                  <canvas 
                    ref={canvasRef}
                    onMouseDown={handleStart}
                    onMouseMove={handleMove}
                    onMouseUp={handleEnd}
                    onMouseLeave={handleEnd}
                    onTouchStart={handleStart}
                    onTouchMove={handleMove}
                    onTouchEnd={handleEnd}
                    className="max-h-full max-w-full touch-none"
                    style={{ cursor: mosMode === 'brush' ? 'crosshair' : 'default' }}
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 gap-4">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-400/20 border-t-blue-500" />
                      <p className="text-sm font-bold text-blue-100">AIが人物を解析中...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="w-full lg:w-80 flex flex-col gap-4">
                
                {/* Background Group */}
                <section className="rounded-2xl border border-[#2a2f3a] bg-[#17191e] p-4">
                  <h3 className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-gray-400">
                    <ImageIcon size={14} /> 背景処理
                  </h3>
                  <div className="grid grid-cols-5 gap-1 mb-4">
                    {(['none', 'blur', 'studio', 'white', 'gray'] as BgMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setBgMode(mode)}
                        className={`rounded-lg py-2 text-[10px] font-bold transition ${
                          bgMode === mode ? 'bg-blue-500 text-white shadow-md' : 'bg-[#1e2129] text-gray-400 border border-[#2a2f3a]'
                        }`}
                      >
                        {mode === 'none' ? 'なし' : mode === 'blur' ? 'ボケ' : mode === 'studio' ? 'スタジオ' : mode === 'white' ? '白' : '灰'}
                      </button>
                    ))}
                  </div>
                  {bgMode === 'blur' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <label className="text-[10px] font-bold text-gray-500 min-w-[60px]">ボケ強度</label>
                        <input 
                          type="range" min="2" max="50" value={blurAmt} 
                          onChange={(e) => setBlurAmt(+e.target.value)}
                          className="flex-1 h-1 rounded-full accent-blue-500 bg-[#2a2f3a]"
                        />
                        <span className="text-[10px] font-mono text-gray-300 min-w-[20px]">{blurAmt}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-[10px] font-bold text-gray-500 min-w-[60px]">輪郭柔さ</label>
                        <input 
                          type="range" min="0" max="20" value={edgeSoft} 
                          onChange={(e) => setEdgeSoft(+e.target.value)}
                          className="flex-1 h-1 rounded-full accent-blue-500 bg-[#2a2f3a]"
                        />
                        <span className="text-[10px] font-mono text-gray-300 min-w-[20px]">{edgeSoft}</span>
                      </div>
                    </div>
                  )}
                </section>

                {/* Mosaic Group */}
                <section className="rounded-2xl border border-[#2a2f3a] bg-[#17191e] p-4">
                  <h3 className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-gray-400">
                    <Sparkles size={14} /> モザイク
                  </h3>
                  
                  <div className="grid grid-cols-4 gap-1 mb-4">
                    {(['face', 'mouth', 'eye', 'full'] as const).map(type => (
                      <button 
                        key={type}
                        onClick={() => addPreset(type)}
                        className="rounded-lg bg-purple-500/10 border border-purple-500/30 py-2 text-[10px] font-bold text-purple-300 transition hover:bg-purple-500/20"
                      >
                        {type === 'face' ? '顔' : type === 'mouth' ? '口' : type === 'eye' ? '目' : '全身'}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-1 mb-4">
                    {(['brush', 'circle', 'rect'] as MosMode[]).map(mode => (
                      <button
                        key={mode}
                        onClick={() => setMosMode(mode)}
                        className={`rounded-lg py-2 text-[10px] font-bold transition ${
                          mosMode === mode ? 'bg-purple-500 text-white shadow-md' : 'bg-[#1e2129] text-gray-400 border border-[#2a2f3a]'
                        }`}
                      >
                        {mode === 'brush' ? 'ブラシ' : mode === 'circle' ? '円' : '四角'}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="text-[10px] font-bold text-gray-500 min-w-[60px]">サイズ</label>
                      <input 
                        type="range" min="10" max="300" value={mosSize} 
                        onChange={(e) => setMosSize(+e.target.value)}
                        className="flex-1 h-1 rounded-full accent-purple-500 bg-[#2a2f3a]"
                      />
                      <span className="text-[10px] font-mono text-gray-300 min-w-[20px]">{mosSize}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-[10px] font-bold text-gray-500 min-w-[60px]">不透明度</label>
                      <input 
                        type="range" min="10" max="100" value={mosOpacity} 
                        onChange={(e) => setMosOpacity(+e.target.value)}
                        className="flex-1 h-1 rounded-full accent-purple-500 bg-[#2a2f3a]"
                      />
                      <span className="text-[10px] font-mono text-gray-300 min-w-[20px]">{mosOpacity}%</span>
                    </div>
                  </div>
                </section>

                <div className="mt-auto flex flex-col gap-2">
                  <button 
                    onClick={() => setMosLayers(prev => prev.slice(0, -1))}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1e2129] border border-[#2a2f3a] py-3 text-xs font-bold text-gray-400 transition hover:bg-[#2a2f3a] hover:text-white"
                  >
                    <Undo size={14} /> ↩ ひとつ戻す
                  </button>
                  <button 
                    onClick={() => setMosLayers([])}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 py-3 text-xs font-bold text-rose-400 transition hover:bg-rose-500/20"
                  >
                    <Trash2 size={14} /> 🗑 すべて消す
                  </button>
                  <button 
                    onClick={handleApply}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 py-4 text-sm font-black text-white shadow-lg shadow-pink-500/20 transition active:scale-95"
                  >
                    <Check size={18} /> 加工を完了して戻る
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
