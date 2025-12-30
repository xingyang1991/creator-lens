
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AppContext, Step, SavedWork, OutputContract, Card, Evidence } from './types';
import { HeaderStrip, CapsuleCTA, Stamp, EvidenceList, LoadingDots, JokerGate, ErrorState, BottomNav, WorkCard, Toast, ProgressIndicator, CardDetailPanel } from './components/UI';
import { TOKENS, COLORS, LIBRARY_DECKS } from './constants';
import { getDeckBySuitId, importCustomCardPack, clearCustomCardPacks } from './library';
import { aliyunService } from './services/aliyun';

// Extend window for AI Studio API
declare global {
  // Define AIStudio interface to avoid type mismatch and modifier errors
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    readonly aistudio: AIStudio;
  }
}

const App: React.FC = () => {
  const [ctx, setCtx] = useState<AppContext>({
    asset: null,
    scan: { verdict: '', evidence: [], signalTags: [] },
    reco: { deck: null, cards: [], joker: null },
    pick: { cardId: null, isJoker: false },
    direct: { answers: [] },
    output: null,
    core: { selected: 0 },
    safety: { mode: 'normal', flags: [] },
    rerunCount: 0,
    share: { assetReady: false, link: '' },
    stableHistory: [Step.HOME],
    pinnedCardId: null,
    activeWork: null,
    originStep: Step.HOME
  });

  const [currentStep, setCurrentStep] = useState<Step>(Step.HOME);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showJokerGate, setShowJokerGate] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [genError, setGenError] = useState<string | null>(null);
  const [savedWorks, setSavedWorks] = useState<SavedWork[]>([]);
  const [toast, setToast] = useState({ message: '', visible: false });
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const showToast = (msg: string) => {
    setToast({ message: msg, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2000);
  };

  // P0-1 Session Reset Logic
  const resetCreateSession = useCallback((overrides: Partial<AppContext> = {}) => {
    setCtx(prev => ({
      ...prev,
      asset: null,
      scan: { verdict: '', evidence: [], signalTags: [] },
      reco: { deck: null, cards: [], joker: null },
      pick: { cardId: null, isJoker: false },
      direct: { answers: [] },
      output: null,
      core: { selected: 0 },
      safety: { mode: 'normal', flags: [] },
      rerunCount: 0,
      share: { assetReady: false, link: '' },
      activeWork: null,
      stableHistory: [Step.HOME],
      ...overrides,
    }));
    setGeneratedImage(null);
    setGenError(null);
    setIsLoading(false);
    setShowJokerGate(false);
  }, []);

  useEffect(() => {
    const data = localStorage.getItem('archi_museum');
    if (data) setSavedWorks(JSON.parse(data));
    
    const params = new URLSearchParams(window.location.search);
    const workId = params.get('w');
    if (workId) {
      const works = JSON.parse(data || '[]');
      const work = works.find((w: SavedWork) => w.id === workId);
      if (work) {
        setCtx(p => ({ ...p, activeWork: work, originStep: Step.HOME }));
        setCurrentStep(Step.SHARE_LANDING);
      }
    }

    const checkKey = async () => {
      if (window.aistudio) {
        try {
          const has = await window.aistudio.hasSelectedApiKey();
          setHasApiKey(has);
        } catch (e) {
          setHasApiKey(false);
        }
      } else {
        setHasApiKey(true);
      }
    };
    checkKey();

    // Dev hook (no UI impact): allow importing custom card packs at runtime.
    // Usage in browser console:
    //   window.__CREATOR_LENS__.importCustomCardPack({...})
    (window as any).__CREATOR_LENS__ = {
      importCustomCardPack,
      clearCustomCardPacks,
    };
  }, []);

  const handleOpenKeyDialog = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const saveWorkToDB = (work: SavedWork) => {
    const updated = [work, ...savedWorks].slice(0, 50);
    setSavedWorks(updated);
    localStorage.setItem('archi_museum', JSON.stringify(updated));
  };

  // P0-2 Real Stack Navigation
  const navigateTo = useCallback((next: Step) => {
    setCurrentStep(next);
    setCtx(prev => {
      const isTransient = next === Step.INJECT || next === Step.DIRECT;
      if (isTransient) return prev;

      const h = prev.stableHistory;
      if (h[h.length - 1] === next) return prev; // Debounce same-step push
      return { ...prev, stableHistory: [...h, next] };
    });
  }, []);

  const handleBack = useCallback(() => {
    if (currentStep === Step.INJECT || currentStep === Step.DIRECT) {
      const h = ctx.stableHistory;
      setCurrentStep(h[h.length - 1] || Step.HOME);
      return;
    }
    if (currentStep === Step.SHARE_LANDING) {
      setCurrentStep(ctx.originStep || Step.HOME);
      return;
    }
    if (ctx.stableHistory.length <= 1) {
      setCurrentStep(Step.HOME);
      return;
    }
    const history = [...ctx.stableHistory];
    history.pop();
    const prevStep = history[history.length - 1];
    setCtx(p => ({ ...p, stableHistory: history }));
    setCurrentStep(prevStep || Step.HOME);
  }, [currentStep, ctx.stableHistory, ctx.originStep]);

  const handleRerun = useCallback(() => {
    if (ctx.rerunCount >= 1) return;
    setCtx(prev => ({
      ...prev,
      output: null,
      rerunCount: prev.rerunCount + 1
    }));
    setGeneratedImage(null);
  }, [ctx.rerunCount]);

  useEffect(() => {
    if (currentStep === Step.CAPTURE) {
      setCameraReady(false);
      // 检查浏览器是否支持 mediaDevices
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setGenError("CAMERA_DENIED");
        return;
      }
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
        .then(stream => { 
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraReady(true);
          }
        })
        .catch((err) => {
          console.error('Camera error:', err);
          setGenError("CAMERA_DENIED");
        });
    } else {
      setCameraReady(false);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    }
  }, [currentStep]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const v = videoRef.current; const c = canvasRef.current;
      c.width = v.videoWidth; c.height = v.videoHeight;
      const gc = c.getContext('2d');
      if (gc) {
        gc.drawImage(v, 0, 0, c.width, c.height);
        setCtx(p => ({ ...p, asset: c.toDataURL('image/jpeg') }));
        navigateTo(Step.SCAN);
      }
    }
  };

  // P0-4 Safety Logic integration
  useEffect(() => {
    if (currentStep === Step.SCAN && ctx.asset && !ctx.scan.verdict) {
      aliyunService.analyzeImage(ctx.asset).then(res => {
        // Rule: Risk flags drive softened mode
        const isHighRisk = res.safetyFlags.includes('minor_risk') || res.safetyFlags.includes('private_space');
        setCtx(p => ({ 
          ...p, 
          scan: { verdict: res.verdict, evidence: res.evidence, signalTags: res.signalTags }, 
          safety: { 
            mode: isHighRisk ? 'softened' : 'normal', 
            flags: res.safetyFlags as any 
          } 
        }));
        setTimeout(() => navigateTo(Step.RECOMMEND), 2500);
      }).catch(() => setGenError("SCAN_ERROR"));
    }
  }, [currentStep, ctx.asset, ctx.scan.verdict]);

  useEffect(() => {
    if (currentStep === Step.RECOMMEND && (!ctx.reco.cards || ctx.reco.cards.length === 0)) {
      if (ctx.pinnedCardId) {
        let pinned: Card | null = null;
        let pinnedDeck: any = null;
        LIBRARY_DECKS.forEach(d => {
          const c = d.cards.find(cc => cc.id === ctx.pinnedCardId) || (d.joker.id === ctx.pinnedCardId ? d.joker : null);
          if (c) { pinned = c; pinnedDeck = d; }
        });
        if (pinned) {
          setCtx(p => ({ 
            ...p, 
            reco: { deck: pinnedDeck, cards: [pinned!], joker: pinnedDeck.joker }, 
            pick: { cardId: pinned!.id, isJoker: pinned!.isJoker || false } 
          }));
          navigateTo(Step.INJECT);
          return;
        }
      }
      aliyunService.recommendDecks(ctx).then(res => setCtx(p => ({ ...p, reco: res })));
    }
  }, [currentStep, ctx.reco.cards.length, ctx.pinnedCardId]);

  useEffect(() => {
    if (currentStep === Step.INJECT) setTimeout(() => navigateTo(Step.DIRECT), 1200);
  }, [currentStep]);

  // --- Dynamic Direct (director_spec) ---
  // When entering DIRECT, prefill defaults for the chosen card's director_spec.
  useEffect(() => {
    if (currentStep !== Step.DIRECT) return;
    const selectedCard = ctx.pick.isJoker
      ? ctx.reco.joker
      : ctx.reco.cards.find(c => c.id === ctx.pick.cardId) || null;
    const spec = selectedCard?.directorSpec || [];
    if (spec.length === 0) {
      // keep legacy behavior: at least one intent string
      if (!ctx.direct.answers || ctx.direct.answers.length === 0) {
        setCtx(p => ({ ...p, direct: { answers: ['综合观察'] } }));
      }
      return;
    }

    // Only reset if it's empty or mismatched to avoid nuking user choices
    if (ctx.direct.answers?.length === spec.length) return;
    const defaults = spec.map(q => q.label ?? '');
    setCtx(p => ({ ...p, direct: { answers: defaults } }));
  }, [currentStep, ctx.pick.cardId, ctx.pick.isJoker, ctx.reco.cards, ctx.reco.joker, ctx.direct.answers]);

  // P0-3 Direct Intent Influence
  useEffect(() => {
    if (currentStep !== Step.REVEAL) return;
    const runRevealFlow = async () => {
      if (!ctx.output) {
        setIsLoading(true);
        setGenError(null);
        try {
          const textData = await aliyunService.generateOutput(ctx);
          setCtx(p => ({ ...p, output: textData }));
        } catch (e) {
          setGenError("TEXT_REVEAL_ERROR");
          setIsLoading(false);
          return;
        }
      }
      if (ctx.output && !generatedImage && ctx.asset) {
        setIsLoading(true);
        try {
          console.log('[Creator Lens] Starting image generation...');
          const art = await aliyunService.generateArtisticImage(ctx);
          if (art) {
            console.log('[Creator Lens] Image generated successfully');
            setGeneratedImage(`data:image/png;base64,${art}`);
          }
        } catch (e: any) {
          console.error('[Creator Lens] Image generation error:', e.message || e);
          if (e.message?.includes("Requested entity was not found")) {
            handleOpenKeyDialog();
          }
          // 图像生成失败时使用原图作为备用
          console.log('[Creator Lens] Falling back to original image');
        } finally {
          setIsLoading(false);
        }
      }
    };
    runRevealFlow();
  }, [currentStep, ctx.output, ctx.asset, generatedImage]);

  // P0-5 IDs and P0-6 Fallback image in save
  const handleFinalSave = () => {
    if (!ctx.output) return;
    const work: SavedWork = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      asset: ctx.asset!,
      generatedImage: generatedImage || ctx.asset!, // P0-6 Fallback
      output: { ...ctx.output, selectedCore: ctx.output.coreCandidates[ctx.core.selected] },
      deckId: ctx.reco.deck?.id || 'manual',
      cardId: (ctx.pick.isJoker ? ctx.reco.joker?.id : ctx.pick.cardId) || 'sample',
      deckName: ctx.reco.deck?.name || 'Archive',
      cardTitle: (ctx.pick.isJoker ? ctx.reco.joker?.title : ctx.reco.cards.find(c => c.id === ctx.pick.cardId)?.title) || 'Fragment',
      isJoker: ctx.pick.isJoker,
      evidence: ctx.scan.evidence,
      safetyMode: ctx.safety.mode
    };
    saveWorkToDB(work);
    setCtx(p => ({ ...p, activeWork: work, stableHistory: p.stableHistory.filter(s => s !== Step.CORE) }));
    navigateTo(Step.SHARE);
  };

  const handleExport = async () => {
    const activeImage = generatedImage || ctx.asset;
    if (!activeImage || !ctx.output) return;
    setIsExporting(true);
    try {
      const c = document.createElement('canvas');
      c.width = 1080; c.height = 1620;
      const g = c.getContext('2d'); if (!g) return;
      g.fillStyle = '#F2F2F2'; g.fillRect(0,0,1080,1620);
      const img = new Image(); await new Promise(r => { img.onload = r; img.src = activeImage; });
      g.drawImage(img, 0, 0, 1080, 1200);
      g.fillStyle = '#000'; g.font = 'bold 48px "IBM Plex Mono"'; g.fillText(ctx.output.title.toUpperCase(), 80, 1280);
      g.font = '500 24px Inter'; g.fillStyle = 'rgba(0,0,0,0.6)'; g.fillText(ctx.output.hook, 80, 1340);
      const url = c.toDataURL('image/png'); const link = document.createElement('a');
      link.download = `archi-${Date.now()}.png`; link.href = url; link.click();
      showToast('已保存档案');
    } finally { setIsExporting(false); }
  };

  const renderHome = () => (
    <div className="h-full flex flex-col bg-black overflow-hidden animate-fade-in relative">
      <HeaderStrip title="CAPTURE / 01" right={<button onClick={() => navigateTo(Step.LIBRARY)} className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center active:bg-white/10 transition-all"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 6h16M4 12h16M4 18h7"/></svg></button>} />
      
      {hasApiKey === false && (
        <div className="absolute inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-8 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20m10-10H2"/></svg>
          </div>
          <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter">需要计费 API KEY</h2>
          <p className="text-sm opacity-60 mb-8 max-w-[280px] leading-relaxed">图像显影功能需要已启用计费的 Google Cloud 项目 API Key。</p>
          <div className="flex flex-col w-full gap-4">
            <CapsuleCTA onClick={handleOpenKeyDialog} className="w-full">选择 API KEY</CapsuleCTA>
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-[10px] font-bold opacity-30 uppercase tracking-widest underline underline-offset-8">了解计费规则</a>
          </div>
        </div>
      )}

      <div className="flex-1 p-6 flex flex-col justify-center gap-12">
        <div className="space-y-4">
          <h2 className="text-5xl font-black tracking-tighter leading-[0.85] uppercase">图像<br/>创意工坊</h2>
          <p className="text-white/40 text-sm leading-relaxed">如果邀请一位当代艺术家来为你创作...</p>
        </div>
        <div className="pt-8">
          <CapsuleCTA onClick={() => { 
            resetCreateSession({ stableHistory: [Step.CAPTURE] });
            setCurrentStep(Step.CAPTURE);
          }} className="w-full">上传图片开始</CapsuleCTA>
        </div>
        {savedWorks.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <h3 className="mono text-[10px] uppercase opacity-30">最近归档</h3>
              <button onClick={() => navigateTo(Step.MUSEUM)} className="text-[10px] font-bold underline opacity-30 uppercase tracking-widest">进入档案馆</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {savedWorks.slice(0, 2).map(w => <WorkCard key={w.id} work={w} onClick={() => { setCtx(p => ({ ...p, activeWork: w, originStep: Step.HOME })); setCurrentStep(Step.SHARE_LANDING); }} />)}
            </div>
          </div>
        )}
      </div>
      <BottomNav active={Step.HOME} onNav={navigateTo} />
    </div>
  );

  const renderCapture = () => (
    <div className="h-full flex flex-col bg-black relative animate-fade-in">
      <HeaderStrip left={<button onClick={handleBack} className="text-xs font-bold opacity-40 uppercase tracking-widest">EXIT</button>} title="CAPTURE / 01" />
      <div className="flex-1 relative overflow-hidden mx-4 rounded-[40px] bg-neutral-900 shadow-2xl">
        {genError === "CAMERA_DENIED" ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40 mb-6">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
              <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <h3 className="text-xl font-bold mb-2 opacity-80">摄像头不可用</h3>
            <p className="text-sm opacity-40 mb-6 max-w-[280px]">请允许浏览器访问摄像头，或使用下方的图片上传功能</p>
            <button onClick={() => setGenError(null)} className="text-xs font-bold opacity-30 uppercase tracking-widest underline underline-offset-8">重试</button>
          </div>
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-0 border-[12px] border-black/20 rounded-[40px] pointer-events-none"></div>
            {/* 加载提示 - 当摄像头还未准备好时显示 */}
            {!cameraReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-neutral-900">
                <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mb-6"></div>
                <p className="text-sm opacity-40">正在请求摄像头权限...</p>
                <p className="text-xs opacity-20 mt-2">请在浏览器弹窗中允许访问</p>
              </div>
            )}
          </>
        )}
      </div>
      <div className="p-12 flex items-center justify-between px-16">
        <label className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center cursor-pointer active:bg-white/5 transition-all">
          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              const r = new FileReader(); r.onload = (re) => { resetCreateSession({ asset: re.target?.result as string, stableHistory: [Step.SCAN] }); setCurrentStep(Step.SCAN); };
              r.readAsDataURL(f);
            }
          }} />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </label>
        <button onClick={capturePhoto} className="w-20 h-20 rounded-full border-[6px] border-white flex items-center justify-center active:scale-90 transition-transform">
          <div className="w-16 h-16 rounded-full bg-white scale-90" />
        </button>
        <div className="w-12 h-12 rounded-2xl border border-white/5 bg-white/5 overflow-hidden active:scale-95 transition-all" onClick={() => navigateTo(Step.MUSEUM)}>
          {savedWorks.length > 0 && <img src={savedWorks[0].generatedImage} className="w-full h-full object-cover opacity-60" />}
        </div>
      </div>
    </div>
  );

  const renderScan = () => (
    <div className="h-full flex flex-col bg-black animate-fade-in relative overflow-hidden">
      <div className="flex-1 relative">
        {ctx.asset && <img src={ctx.asset} className="w-full h-full object-cover opacity-50 grayscale" />}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
           <div className="w-full h-px bg-white/20 relative overflow-hidden mb-8">
             <div className="absolute inset-0 bg-white animate-scan-line" />
           </div>
           <LoadingDots label={ctx.scan.verdict || "正在分析图片内容..."} />
           <p className="text-xs opacity-40 mt-4 text-center">识别图像中的符号、情绪与叙事线索</p>
           {ctx.scan.evidence.length > 0 && (
             <div className="mt-12 bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 w-full animate-slide-up">
               <EvidenceList items={ctx.scan.evidence} />
             </div>
           )}
        </div>
      </div>
    </div>
  );

  // 生成基于创作者名称的独特颜色
  const getCreatorColor = (name: string): string => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 30%, 15%)`;
  };

  // 长按显示卡片详情的状态
  const [pressedCardId, setPressedCardId] = useState<string | null>(null);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleCardPressStart = (cardId: string) => {
    pressTimerRef.current = setTimeout(() => {
      setPressedCardId(cardId);
    }, 500);
  };

  const handleCardPressEnd = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const renderRecommend = () => {
    // P0-4 Rule implementation
    const isSoftened = ctx.safety.mode === 'softened';
    return (
      <div className="h-full flex flex-col bg-black animate-fade-in overflow-hidden">
        <HeaderStrip left={<button onClick={handleBack} className="text-xs font-bold opacity-40">BACK</button>} showProgress currentStep={currentStep} />
        <div className="flex-1 p-8 flex flex-col justify-center gap-10 overflow-y-auto scrollbar-hide">
          <div className="space-y-2">
            <h2 className="text-4xl font-black uppercase tracking-tighter leading-[0.9]">匹配到的<br/>艺术家</h2>
            <p className="text-sm opacity-40 leading-relaxed">基于图像特征，为你推荐以下艺术家的方法论</p>
            <p className="text-xs opacity-30 mono uppercase tracking-widest mt-2">{ctx.reco.deck?.name} 系列</p>
            <p className="text-[10px] opacity-20 mt-1">长按卡片查看详情</p>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {ctx.reco.cards.map(card => (
              <div key={card.id} className="relative">
                <button
                  onClick={() => {
                    if (pressedCardId) {
                      setPressedCardId(null);
                      return;
                    }
                    const deck = getDeckBySuitId(card.suitId || ctx.reco.deck?.id || 'observatory');
                    setCtx(p => ({
                      ...p,
                      reco: { ...p.reco, deck, joker: deck.joker },
                      pick: { cardId: card.id, isJoker: false },
                    }));
                    navigateTo(Step.INJECT);
                  }}
                  onMouseDown={() => handleCardPressStart(card.id)}
                  onMouseUp={handleCardPressEnd}
                  onMouseLeave={handleCardPressEnd}
                  onTouchStart={() => handleCardPressStart(card.id)}
                  onTouchEnd={handleCardPressEnd}
                  className="w-full p-6 rounded-3xl border border-white/10 text-left active:scale-[0.98] transition-all flex justify-between items-center group relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${getCreatorColor(card.creator || 'default')} 0%, rgba(0,0,0,0.9) 100%)`
                  }}
                >
                  {/* 半透明遮罩 */}
                  <div className="absolute inset-0 bg-black/40" />
                  {/* 模糊边缘效果 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/60" />
                  
                  <div className="space-y-1 relative z-10">
                    <p className="text-xl font-black tracking-tight group-active:text-white">{card.creator || 'Unknown Creator'}</p>
                    <p className="text-xs opacity-70 font-medium">{card.title}</p>
                    <p className="text-[10px] mono opacity-40 mt-1 line-clamp-2">{card.deckName || card.suitName}</p>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-30 flex-shrink-0 relative z-10"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
                
                {/* 长按显示的详情浮层 */}
                {pressedCardId === card.id && (
                  <div 
                    className="absolute inset-0 z-20 bg-black/95 backdrop-blur-md rounded-3xl p-6 animate-fade-in border border-white/20"
                    onClick={() => setPressedCardId(null)}
                  >
                    <div className="h-full flex flex-col justify-between">
                      <div className="space-y-3">
                        <p className="text-lg font-black">{card.creator}</p>
                        <p className="text-sm opacity-60 font-medium">{card.title}</p>
                        <div className="h-px bg-white/10 my-2" />
                        <p className="text-xs opacity-50 leading-relaxed">{card.bias}</p>
                      </div>
                      <p className="text-[9px] opacity-30 text-center">点击任意位置关闭</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {ctx.reco.joker && (
              <button disabled={isSoftened} onClick={() => { setCtx(p => ({ ...p, pick: { cardId: ctx.reco.joker!.id, isJoker: true } })); setShowJokerGate(true); }} className={`p-6 rounded-3xl border text-left active:scale-95 transition-all flex justify-between items-center group mt-4 ${isSoftened ? 'opacity-20 grayscale cursor-not-allowed border-white/5' : 'bg-red-600/10 border-red-500/20'}`}>
                <div>
                  <p className={`text-lg font-black uppercase tracking-tight ${isSoftened ? 'text-white/40' : 'text-red-500'}`}>JOKER: {ctx.reco.joker.title}</p>
                  <p className="text-[10px] mono opacity-40 uppercase mt-0.5">{isSoftened ? '检测到敏感要素，已自动避开高风险序列' : ctx.reco.joker.bias}</p>
                </div>
                {!isSoftened && <Stamp type="Joker" />}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderDirect = () => {
    const isSoftened = ctx.safety.mode === 'softened';
    const selectedCard = ctx.pick.isJoker
      ? ctx.reco.joker
      : ctx.reco.cards.find(c => c.id === ctx.pick.cardId) || null;
    const spec = selectedCard?.directorSpec || [];
    const hasSpec = spec.length > 0;

    const applyDefaultAndGo = () => {
      if (hasSpec) {
        const defaults = spec.map(q => q.label ?? '').filter(Boolean);
        setCtx(p => ({ ...p, direct: { answers: defaults.length ? defaults : ['综合观察'] } }));
      } else {
        setCtx(p => ({ ...p, direct: { answers: ['综合观察'] } }));
      }
      navigateTo(Step.REVEAL);
    };

    return (
      <div className="p-8 h-full bg-black flex flex-col animate-fade-in overflow-hidden">
        <HeaderStrip left={<button onClick={handleBack} className="text-xs font-bold opacity-40">BACK</button>} showProgress currentStep={currentStep} />

        <div className="flex-1 flex flex-col justify-center gap-10 overflow-y-auto scrollbar-hide">
          <div className="space-y-2">
            <h2 className="text-4xl font-black uppercase tracking-tighter leading-[0.9]">设定<br/>创作方向</h2>
            <p className="text-sm opacity-40 leading-relaxed">每位艺术家的方法论都有多个切入角度</p>
            <p className="text-[11px] opacity-30 leading-relaxed mt-2">
              当前选择：<span className="font-bold opacity-80">{selectedCard?.creator || '—'}</span> · {selectedCard?.title || ''}
            </p>
          </div>

          {isSoftened && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 w-full">
              <div className="flex items-center gap-2 justify-start mb-2">
                <Stamp type="Safety" />
                <p className="text-xs font-bold text-yellow-500 uppercase tracking-widest">SAFE MODE</p>
              </div>
              <p className="text-[10px] mono opacity-60">检测到隐私/未成年风险，已锁定部分危险档位（Danger）选项</p>
            </div>
          )}

          {/* Dynamic director knobs */}
          {hasSpec ? (
            <div className="space-y-8">
              {spec.map((q, qi) => {
                // 获取可选项：优先使用 options 数组，否则回退到单个 label
                const optionsList = q.options && q.options.length > 0 ? q.options : [q.label];
                return (
                  <div key={`${q.id}-${qi}`} className="space-y-3">
                    <div className="flex items-end justify-between">
                      <p className="mono text-[10px] uppercase opacity-30 tracking-widest">{q.label}</p>
                      <p className="text-[10px] opacity-20 mono uppercase tracking-widest">{qi + 1}/{spec.length}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {optionsList.map((option) => (
                        <button
                          key={`${q.id}-${option}`}
                          onClick={() => {
                            setCtx(p => {
                              const next = [...(p.direct.answers || [])];
                              next[qi] = option;
                              return { ...p, direct: { answers: next } };
                            });
                          }}
                          className={
                            `px-5 py-3 rounded-2xl border transition-all text-sm font-bold tracking-wide ` +
                            (ctx.direct.answers?.[qi] === option
                              ? 'bg-white text-black border-white'
                              : 'border-white/10 text-white/40 hover:border-white/30') +
                            ' active:scale-95'
                          }
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {['综合观察', '机械记录', '批判视点'].map((o) => (
                <button
                  key={o}
                  onClick={() => setCtx(p => ({ ...p, direct: { answers: [o] } }))}
                  className={`px-5 py-3 rounded-2xl border transition-all text-sm font-bold tracking-wide ${ctx.direct.answers.includes(o) ? 'bg-white text-black border-white' : 'border-white/10 text-white/40 hover:border-white/30'} active:scale-95`}
                >
                  {o}
                </button>
              ))}
            </div>
          )}

          <div className="pt-2">
            <CapsuleCTA
              onClick={() => navigateTo(Step.REVEAL)}
              disabled={ctx.direct.answers.length === 0}
              className="w-full"
            >
              生成作品
            </CapsuleCTA>

            <button
              onClick={applyDefaultAndGo}
              className="w-full mt-6 text-[10px] font-bold opacity-30 uppercase tracking-[0.3em] text-center underline underline-offset-8"
            >
              使用默认路径（跳过调参）
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderReveal = () => (
    <div className="h-full flex flex-col bg-black overflow-y-auto scrollbar-hide pb-32 animate-fade-in">
      <HeaderStrip left={<button onClick={handleBack} className="text-xs font-bold opacity-40">BACK</button>} showProgress currentStep={currentStep} />
      {genError === "TEXT_REVEAL_ERROR" ? (
        <ErrorState title="生成失败" sub="网络波动，请稍后重试。" onRetry={() => { resetCreateSession({ stableHistory: [Step.CAPTURE] }); setCurrentStep(Step.CAPTURE); }} />
      ) : (
        <div className="p-6 space-y-12">
          {/* 图像展示区域 */}
          <div className="aspect-square rounded-[48px] overflow-hidden shadow-2xl bg-neutral-900 border border-white/5 flex items-center justify-center relative">
            {generatedImage ? (
              <img src={generatedImage} className="w-full h-full object-cover animate-fade-in" />
            ) : ctx.asset ? (
              <img src={ctx.asset} className="w-full h-full object-cover opacity-20 blur-sm grayscale" />
            ) : null}
            {isLoading && !generatedImage && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-8">
                <LoadingDots label="正在构建视觉叙事..." />
                <p className="text-xs opacity-50 mt-4 text-center">
                  用 {(ctx.pick.isJoker ? ctx.reco.joker : ctx.reco.cards.find(c=>c.id===ctx.pick.cardId))?.creator || '艺术家'} 的视角重新诠释
                </p>
              </div>
            )}
            {!isLoading && !generatedImage && (
              <div className="absolute bottom-6 px-10 text-center">
                <p className="text-[9px] mono opacity-40 tracking-widest">图像生成失败，已显示原图</p>
                <p className="text-[8px] opacity-30 mt-1">网络波动，请稍后重试</p>
              </div>
            )}
          </div>
          
          {/* 生成过程中展示卡片详情，减少等待时间的难熬 */}
          {isLoading && !ctx.output && (
            <CardDetailPanel 
              card={ctx.pick.isJoker 
                ? ctx.reco.joker 
                : ctx.reco.cards.find(c => c.id === ctx.pick.cardId) || null
              } 
            />
          )}
          {ctx.output && (
            <div className={`${COLORS.Paper} p-10 ${TOKENS.RadiusPanel} text-black space-y-10 animate-fade-in`}>
              <div className="space-y-4">
                 <h2 className="text-5xl font-black uppercase tracking-tighter leading-[0.85]">{ctx.output.title}</h2>
                 <p className="text-xl font-bold opacity-40 italic">"{ctx.output.hook}"</p>
                 <div className="flex gap-2 pt-2">
                    <Stamp type="Deck" label={ctx.reco.deck?.name} />
                    {ctx.pick.isJoker && <Stamp type="Joker" />}
                    {ctx.safety.mode === 'softened' && <Stamp type="Safety" label="安全归档" />}
                 </div>
              </div>
              <div className="space-y-8 border-t border-black/10 pt-10">
                 {/* 显示牌组信息 */}
                 {ctx.output.deckUi && (
                   <div className="space-y-2 pb-4 border-b border-black/5">
                     <p className="mono text-[9px] uppercase opacity-40 tracking-widest">牌组 / DECK</p>
                     <p className="text-sm font-bold">{ctx.output.deckUi}</p>
                   </div>
                 )}
                 {/* 模块化输出：优先使用 modules，否则回退到 sections */}
                 {(ctx.output.modules && ctx.output.modules.length > 0 ? ctx.output.modules : ctx.output.sections).map((item, i) => (
                   <div key={i} className="space-y-3">
                     <h4 className="mono text-[10px] uppercase opacity-30 tracking-widest">{'moduleId' in item ? item.title : item.title}</h4>
                     <p className="text-base leading-relaxed font-medium">{'moduleId' in item ? item.content : item.body}</p>
                   </div>
                 ))}
                 <div className="space-y-3 pt-4 border-t border-black/5">
                    <h4 className="mono text-[10px] uppercase opacity-30 tracking-widest">证据链路 / EVIDENCE</h4>
                    <EvidenceList items={ctx.scan.evidence} />
                 </div>
              </div>
            </div>
          )}
          {ctx.output && (
            <div className="px-2 space-y-6">
              <div className="flex items-center gap-4">
                 <button onClick={handleRerun} disabled={ctx.rerunCount >= 1} className={`flex-1 h-14 rounded-full border border-white/10 font-bold text-[10px] uppercase tracking-[0.2em] transition-all ${ctx.rerunCount >= 1 ? 'opacity-10 grayscale' : 'opacity-40 active:bg-white/5 underline underline-offset-8'}`}>重新生成</button>
                 <CapsuleCTA onClick={() => setCurrentStep(Step.CORE)} className="flex-[1.5]">确认为档案核心</CapsuleCTA>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderMuseum = () => (
    <div className="h-full flex flex-col bg-black animate-fade-in">
      <HeaderStrip title="ARCHIVE / 档案馆" />
      <div className="flex-1 p-6 overflow-y-auto pb-24 scrollbar-hide">
        {savedWorks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20"><span className="text-[10px] uppercase mono tracking-widest">暂无记录</span></div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {savedWorks.map(w => <WorkCard key={w.id} work={w} onClick={() => { setCtx(p => ({ ...p, activeWork: w, originStep: Step.MUSEUM })); setCurrentStep(Step.SHARE_LANDING); }} />)}
          </div>
        )}
      </div>
      <BottomNav active={Step.MUSEUM} onNav={navigateTo} />
    </div>
  );

  const renderLibrary = () => (
    <div className="h-full flex flex-col bg-black animate-fade-in overflow-hidden">
      <HeaderStrip title="LIBRARY / 能力库" left={<button onClick={handleBack} className="text-xs font-bold opacity-40">BACK</button>} />
      <div className="flex-1 p-6 overflow-y-auto pb-24 scrollbar-hide space-y-10">
        {LIBRARY_DECKS.map(deck => (
          <div key={deck.id} className="space-y-4">
            <h3 className="text-sm font-black uppercase border-b border-white/10 pb-2">{deck.name}</h3>
            <div className="grid grid-cols-1 gap-2">
              {deck.cards.map(card => (
                <button 
                  key={card.id} 
                  onClick={() => {
                    setCtx(p => ({ ...p, pinnedCardId: card.id }));
                    showToast(`能力已锁定: ${card.title}`);
                    setCurrentStep(Step.HOME);
                  }}
                  className={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all ${ctx.pinnedCardId === card.id ? 'bg-white text-black' : 'bg-white/5 border-white/5 opacity-60'}`}
                >
                  <div><p className="text-xs font-bold uppercase">{card.title}</p><p className="text-[9px] mono opacity-40 uppercase">{card.bias}</p></div>
                  {ctx.pinnedCardId === card.id && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <BottomNav active={Step.LIBRARY} onNav={navigateTo} />
    </div>
  );

  const renderShareLanding = () => {
    const w = ctx.activeWork; if (!w) return null;
    return (
      <div className="h-full flex flex-col bg-white text-black overflow-y-auto scrollbar-hide pb-32 animate-fade-in">
        <HeaderStrip left={<button onClick={handleBack} className="text-xs font-bold opacity-40">BACK</button>} title="SPECIMEN" />
        <div className="p-8 space-y-12">
          <div className="aspect-[4/5] rounded-[48px] overflow-hidden shadow-2xl relative">
            <img src={w.generatedImage} className="w-full h-full object-cover" />
            {w.safetyMode === 'softened' && <div className="absolute top-6 left-6"><Stamp type="Safety" label="安全归档" /></div>}
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl font-black uppercase leading-[0.85] tracking-tighter">{w.output.title}</h2>
            <p className="text-xl font-bold opacity-40 italic">"{w.output.hook}"</p>
          </div>
          <div className="pt-12 space-y-4">
            <CapsuleCTA onClick={() => { 
              resetCreateSession({ pinnedCardId: w.cardId, stableHistory: [Step.CAPTURE] }); 
              setCurrentStep(Step.CAPTURE); 
            }} className="w-full">用同样风格创作</CapsuleCTA>
            <button onClick={() => { 
              resetCreateSession({ asset: w.asset, stableHistory: [Step.SCAN], safety: { ...ctx.safety, mode: w.safetyMode } }); 
              setCurrentStep(Step.SCAN); 
            }} className="w-full py-4 text-[10px] font-bold underline underline-offset-8 opacity-40 uppercase tracking-widest text-center active:opacity-20 transition-all">用同一张图片再次创作</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="h-screen w-full max-w-md mx-auto relative overflow-hidden bg-black text-white">
      {currentStep === Step.HOME && renderHome()}
      {currentStep === Step.MUSEUM && renderMuseum()}
      {currentStep === Step.LIBRARY && renderLibrary()}
      {currentStep === Step.SHARE_LANDING && renderShareLanding()}
      {currentStep === Step.CAPTURE && renderCapture()}
      {currentStep === Step.SCAN && renderScan()}
      {currentStep === Step.RECOMMEND && renderRecommend()}
      {currentStep === Step.INJECT && (
        <div className={`flex flex-col h-full items-center justify-center ${ctx.pick.isJoker ? 'bg-red-600' : 'bg-white text-black'}`}>
          <LoadingDots label="序列合成中" dark={!ctx.pick.isJoker} />
          <h2 className="text-5xl font-black uppercase mt-10 tracking-tighter leading-none px-12 text-center animate-pulse">{(ctx.pick.isJoker ? ctx.reco.joker : ctx.reco.cards.find(c=>c.id===ctx.pick.cardId))?.title}</h2>
        </div>
      )}
      {currentStep === Step.DIRECT && renderDirect()}
      {currentStep === Step.REVEAL && renderReveal()}
      {currentStep === Step.CORE && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col justify-end">
           <div className={`${COLORS.Paper} text-black rounded-t-[48px] p-10 pb-16 shadow-2xl animate-slide-up`}>
              <div className="w-12 h-1.5 bg-black/10 rounded-full mx-auto mb-10" />
              <h2 className="text-2xl font-black uppercase mb-10 tracking-tighter">选择归档核心词</h2>
              {ctx.output?.coreCandidates && ctx.output.coreCandidates.length > 0 ? (
                <div className="space-y-3">
                  {ctx.output.coreCandidates.map((c: any, i: number) => {
                    // 支持两种格式：字符串或对象 {label, reason}
                    const label = typeof c === 'string' ? c : (c?.label || '');
                    const reason = typeof c === 'object' ? (c?.reason || '') : '';
                    return (
                      <button 
                        key={i} 
                        onClick={() => setCtx(p => ({ ...p, core: { selected: i } }))} 
                        className={`w-full p-6 text-left border-2 rounded-[24px] transition-all active:scale-[0.98] ${ctx.core.selected === i ? 'border-black bg-black text-white' : 'border-black/5 bg-black/5'}`}
                      >
                        <span className="font-black uppercase text-sm tracking-tight block">{label}</span>
                        {reason && <span className={`text-xs mt-2 block ${ctx.core.selected === i ? 'opacity-70' : 'opacity-50'}`}>{reason}</span>}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm opacity-50 mb-4">暂无可选的核心词</p>
                  <p className="text-xs opacity-30">文本生成可能未完成，请返回重试</p>
                </div>
              )}
              <CapsuleCTA 
                onClick={ctx.output?.coreCandidates?.length ? handleFinalSave : () => navigateTo(Step.REVEAL)} 
                className="w-full mt-12"
              >
                {ctx.output?.coreCandidates?.length ? '入馆归档' : '返回重试'}
              </CapsuleCTA>
           </div>
        </div>
      )}
      {currentStep === Step.SHARE && (
        <div className="h-full flex flex-col bg-white text-black animate-fade-in overflow-y-auto pb-32 scrollbar-hide">
          <HeaderStrip title="SUCCESS" />
          <div className="p-8 space-y-12">
             <div className="aspect-square rounded-[48px] overflow-hidden shadow-2xl relative">
                <img src={generatedImage || ctx.asset!} className="w-full h-full object-cover" />
                {ctx.safety.mode === 'softened' && <div className="absolute top-6 left-6"><Stamp type="Safety" label="安全归档" /></div>}
             </div>
             <div className="space-y-4">
               <h2 className="text-3xl font-black uppercase tracking-tighter leading-tight">{ctx.output?.title}</h2>
               <CapsuleCTA onClick={handleExport} disabled={isExporting} className="w-full">{isExporting ? '生成中...' : '保存至相册'}</CapsuleCTA>
               <button onClick={() => {
                 const url = window.location.origin + window.location.pathname + "?w=" + ctx.activeWork?.id;
                 navigator.clipboard.writeText(url);
                 showToast('链接已复制');
               }} className="w-full h-14 rounded-full border border-black/10 font-bold text-xs uppercase tracking-widest transition-all active:bg-black/5">复制分享链接</button>
               <button onClick={() => {
                 resetCreateSession({ stableHistory: [Step.CAPTURE] });
                 setCurrentStep(Step.HOME);
               }} className="w-full py-4 text-[10px] font-bold opacity-30 uppercase tracking-widest underline underline-offset-8 text-center active:opacity-10">返回档案馆首页</button>
             </div>
          </div>
        </div>
      )}
      {showJokerGate && <JokerGate onConfirm={() => { setShowJokerGate(false); navigateTo(Step.INJECT); }} onCancel={() => setShowJokerGate(false)} />}
      <Toast {...toast} />
      <style>{`
        .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.2, 0, 0.2, 1) forwards; }
        .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.2, 0, 0.2, 1) forwards; }
        .animate-scan-line { animation: scanLine 2s linear infinite; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes scanLine { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
};

export default App;
