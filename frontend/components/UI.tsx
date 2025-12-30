
import React from 'react';
import { TOKENS, COLORS } from '../constants';
import { Step, SavedWork, Evidence } from '../types';

// 进度指示器组件
export const ProgressIndicator: React.FC<{ currentStep: Step }> = ({ currentStep }) => {
  const steps = [
    { id: 'upload', label: '上传', step: Step.HOME },
    { id: 'analyze', label: '分析', step: Step.SCAN },
    { id: 'select', label: '选择', step: Step.RECOMMEND },
    { id: 'adjust', label: '调整', step: Step.DIRECT },
    { id: 'generate', label: '生成', step: Step.REVEAL },
  ];

  const getStepIndex = (step: Step): number => {
    const stepMap: Record<Step, number> = {
      [Step.HOME]: 0,
      [Step.CAPTURE]: 0,
      [Step.SCAN]: 1,
      [Step.RECOMMEND]: 2,
      [Step.INJECT]: 2,
      [Step.DIRECT]: 3,
      [Step.REVEAL]: 4,
      [Step.CORE]: 4,
      [Step.SHARE]: 4,
      [Step.MUSEUM]: -1,
      [Step.LIBRARY]: -1,
      [Step.SHARE_LANDING]: -1,
    };
    return stepMap[step] ?? -1;
  };

  const currentIndex = getStepIndex(currentStep);
  if (currentIndex < 0) return null;

  return (
    <div className="flex items-center justify-center gap-1 py-3">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold transition-all ${
                  isCompleted 
                    ? 'bg-white/20 text-white' 
                    : isCurrent 
                      ? 'bg-white text-black' 
                      : 'bg-white/5 text-white/30'
                }`}
              >
                {isCompleted ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span className={`text-[8px] mt-1 tracking-wider ${
                isCurrent ? 'opacity-80' : 'opacity-30'
              }`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div 
                className={`w-6 h-px mx-1 ${
                  index < currentIndex ? 'bg-white/40' : 'bg-white/10'
                }`} 
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const HeaderStrip: React.FC<{ left?: React.ReactNode; right?: React.ReactNode; title?: string; step?: string; showProgress?: boolean; currentStep?: Step }> = ({ left, right, title, step, showProgress, currentStep }) => (
  <header className={`${TOKENS.HeaderHeight} ${TOKENS.PagePadding} flex flex-col sticky top-0 z-50 bg-black/80 backdrop-blur-md`}>
    <div className="flex items-center justify-between flex-1">
      <div className="w-16 flex justify-start">{left}</div>
      <div className="flex-1 text-center">
        {step && <p className="text-[10px] mono uppercase tracking-widest opacity-40 leading-none mb-0.5">{step}</p>}
        {title && <h1 className="text-xs font-bold tracking-widest uppercase">{title}</h1>}
      </div>
      <div className="w-16 flex justify-end">{right}</div>
    </div>
    {showProgress && currentStep && <ProgressIndicator currentStep={currentStep} />}
  </header>
);

export const BottomNav: React.FC<{ active: Step; onNav: (s: Step) => void }> = ({ active, onNav }) => (
  <nav className="fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-around z-50 px-6">
    {[
      { id: Step.HOME, label: '创作', icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z' },
      { id: Step.MUSEUM, label: '档案馆', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
      { id: Step.LIBRARY, label: '能力库', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' }
    ].map(item => (
      <button key={item.id} onClick={() => onNav(item.id)} className={`flex flex-col items-center gap-1 transition-all ${active === item.id || (active === Step.CAPTURE && item.id === Step.HOME) ? 'text-white' : 'text-white/30'}`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon}/></svg>
        <span className="text-[10px] font-bold tracking-wider">{item.label}</span>
      </button>
    ))}
  </nav>
);

export const WorkCard: React.FC<{ work: SavedWork; onClick: () => void }> = ({ work, onClick }) => (
  <div onClick={onClick} className="flex flex-col bg-white/5 rounded-2xl overflow-hidden border border-white/5 transition-all active:scale-95 shadow-lg group">
    <div className="aspect-square bg-neutral-900 relative overflow-hidden">
      <img src={work.generatedImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={work.output.title} />
      <div className="absolute top-2 right-2 flex gap-1">
        {work.isJoker && <Stamp type="Joker" />}
      </div>
    </div>
    <div className="p-3 bg-white text-black">
      <h4 className="text-[11px] font-black truncate uppercase tracking-tighter">{work.output.title}</h4>
      <p className="text-[9px] opacity-40 mt-0.5 line-clamp-1 mono">{work.output.selectedCore}</p>
    </div>
  </div>
);

export const CapsuleCTA: React.FC<{ variant?: 'primary' | 'secondary' | 'danger'; children: React.ReactNode; onClick?: () => void; disabled?: boolean; className?: string }> = ({ variant = 'primary', children, onClick, disabled, className }) => {
  const styles = { 
    primary: COLORS.Primary, 
    secondary: 'bg-black text-white border border-white/20', 
    danger: COLORS.Danger 
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`h-14 px-8 ${TOKENS.RadiusButton} font-bold text-sm tracking-widest uppercase transition-all active:scale-95 disabled:opacity-30 ${styles[variant]} ${className}`}>{children}</button>
  );
};

export const Stamp: React.FC<{ type: 'Deck' | 'Joker' | 'Stylized' | 'Safety'; label?: string }> = ({ type, label }) => {
  const config = { 
    Deck: 'border-white/40 text-white', 
    Joker: 'border-red-500 text-red-500 bg-red-500/10', 
    Stylized: 'border-white/20 text-white/60', 
    Safety: 'border-yellow-500/50 text-yellow-500' 
  };
  return <span className={`inline-flex items-center px-1.5 py-0.5 border text-[9px] mono uppercase tracking-tighter ${config[type]} rounded-sm`}>{label || type}</span>;
};

export const EvidenceList: React.FC<{ items: Evidence[], expanded?: boolean }> = ({ items, expanded }) => (
  <div className={`space-y-1 ${expanded ? 'mt-4' : ''} border-l border-black/5 pl-3`}>
    {items.map((item, i) => (
      <div key={i} className="flex items-baseline gap-2">
        <span className="mono text-[9px] opacity-30 shrink-0 uppercase tracking-tighter">{item.type}</span>
        <span className="text-[10px] font-medium opacity-60 italic">{item.value}</span>
      </div>
    ))}
  </div>
);

export const LoadingDots: React.FC<{ label?: string; dark?: boolean }> = ({ label, dark }) => (
  <div className="flex flex-col items-center gap-4">
    <div className="flex gap-1.5">
      {[0,1,2].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full ${dark ? 'bg-black' : 'bg-white'} animate-pulse`} style={{ animationDelay: `${i * 0.2}s` }} />)}
    </div>
    {label && <p className={`text-[10px] mono uppercase tracking-[0.2em] ${dark ? 'opacity-40 text-black' : 'opacity-40 text-white'}`}>{label}</p>}
  </div>
);

export const JokerGate: React.FC<{ onConfirm: () => void, onCancel: () => void }> = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[100] flex flex-col items-center justify-center p-8 text-center animate-fade-in">
    <div className="w-16 h-16 rounded-full border-2 border-red-500 flex items-center justify-center mb-6"><span className="text-red-500 text-3xl font-black">!</span></div>
    <h2 className="text-2xl font-black mb-2 uppercase text-red-500 tracking-tighter">进入危险槽</h2>
    <p className="text-sm opacity-60 mb-10 max-w-[280px] leading-relaxed">讽刺性观察仅针对社会机制。启用此序列意味着您接受其可能产生的尖锐立场。</p>
    <div className="flex flex-col w-full gap-4">
      <CapsuleCTA variant="danger" onClick={onConfirm} className="w-full">继续注入</CapsuleCTA>
      <button onClick={onCancel} className="text-sm opacity-40 underline underline-offset-8 uppercase font-bold tracking-widest">更换普通能力</button>
    </div>
  </div>
);

export const Toast: React.FC<{ message: string, visible: boolean }> = ({ message, visible }) => (
  <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 bg-white text-black rounded-full font-bold text-xs tracking-widest shadow-2xl transition-all duration-500 ${visible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
    {message.toUpperCase()}
  </div>
);

// Added missing ErrorState component
export const ErrorState: React.FC<{ title: string; sub: string; onRetry: () => void }> = ({ title, sub, onRetry }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-white">
    <div className="w-16 h-16 rounded-full border border-red-500/20 flex items-center justify-center mb-6 text-red-500">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
    </div>
    <h3 className="text-xl font-bold mb-2 uppercase tracking-tighter">{title}</h3>
    <p className="text-xs opacity-40 mb-8 max-w-[200px] leading-relaxed">{sub}</p>
    <CapsuleCTA variant="secondary" onClick={onRetry} className="w-full">重新开始</CapsuleCTA>
  </div>
);

// 卡片详情组件 - 用于生成过程中展示
export const CardDetailPanel: React.FC<{ card: { creator?: string; title: string; bias: string; deckName?: string } | null }> = ({ card }) => {
  if (!card) return null;
  
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 animate-fade-in">
      <div className="space-y-4">
        <div>
          <p className="text-[10px] mono opacity-30 uppercase tracking-widest mb-1">当前艺术家</p>
          <p className="text-xl font-black">{card.creator || 'Unknown'}</p>
        </div>
        <div>
          <p className="text-[10px] mono opacity-30 uppercase tracking-widest mb-1">方法论</p>
          <p className="text-sm opacity-70 font-medium">{card.title}</p>
        </div>
        {card.deckName && (
          <div>
            <p className="text-[10px] mono opacity-30 uppercase tracking-widest mb-1">系列</p>
            <p className="text-xs opacity-50">{card.deckName}</p>
          </div>
        )}
        <div className="h-px bg-white/10" />
        <div>
          <p className="text-[10px] mono opacity-30 uppercase tracking-widest mb-2">创作理念</p>
          <p className="text-xs opacity-50 leading-relaxed">{card.bias}</p>
        </div>
      </div>
    </div>
  );
};
