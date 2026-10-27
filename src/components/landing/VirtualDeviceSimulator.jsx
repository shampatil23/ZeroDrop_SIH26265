import React, { useState } from 'react';
import {
  Smartphone,
  Tablet,
  RotateCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  RefreshCw,
  Home,
  FileCheck,
  FolderOpen,
  ClipboardCheck,
  Compass,
} from 'lucide-react';

export default function VirtualDeviceSimulator({ initialUrl = '/overview' }) {
  const [deviceType, setDeviceType] = useState('iphone'); // 'iphone' | 'pixel' | 'tablet'
  const [orientation, setOrientation] = useState('portrait'); // 'portrait' | 'landscape'
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [scale, setScale] = useState(1);
  const [key, setKey] = useState(0); // for reload

  // Dimensions based on device
  const getDeviceDimensions = () => {
    if (deviceType === 'tablet') {
      return orientation === 'portrait'
        ? { width: 768, height: 960, screenW: 736, screenH: 920 }
        : { width: 960, height: 768, screenW: 920, screenH: 736 };
    }
    if (deviceType === 'pixel') {
      return orientation === 'portrait'
        ? { width: 400, height: 820, screenW: 380, screenH: 800 }
        : { width: 820, height: 400, screenW: 800, screenH: 380 };
    }
    // iphone
    return orientation === 'portrait'
      ? { width: 390, height: 810, screenW: 370, screenH: 785 }
      : { width: 810, height: 390, screenW: 785, screenH: 370 };
  };

  const dim = getDeviceDimensions();

  const quickLinks = [
    { label: 'Overview', path: '/overview', icon: Home },
    { label: 'Repository', path: '/fdr-repository', icon: FolderOpen },
    { label: 'Verification', path: '/verification', icon: FileCheck },
    { label: 'Approvals', path: '/approvals', icon: ClipboardCheck },
    { label: 'Renewals', path: '/renewals', icon: RefreshCw },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-4 lg:p-8 bg-slate-900/95 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden text-white w-full">
      {/* Simulator Control Toolbar */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="text-xs font-semibold text-slate-400 ml-2 uppercase tracking-wider">
            Zero Drop Virtual Hardware Simulator
          </span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setDeviceType('iphone')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              deviceType === 'iphone'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone size={14} /> iPhone 16 Pro
          </button>
          <button
            onClick={() => setDeviceType('pixel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              deviceType === 'pixel'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone size={14} /> Pixel 9 Pro
          </button>
          <button
            onClick={() => setDeviceType('tablet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              deviceType === 'tablet'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet size={14} /> iPad Mini
          </button>
        </div>

        {/* Orientation & Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOrientation((o) => (o === 'portrait' ? 'landscape' : 'portrait'))}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
            title="Toggle Orientation"
          >
            <RotateCw size={15} />
          </button>

          <button
            onClick={() => setKey((k) => k + 1)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
            title="Reload Screen"
          >
            <RefreshCw size={15} />
          </button>

          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <span>Open in Tab</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Quick Route Shortcuts for the Simulator */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        <span className="text-[11px] text-slate-400 mr-2">Quick Navigation:</span>
        {quickLinks.map((item) => {
          const Icon = item.icon;
          const isActive = currentUrl === item.path;
          return (
            <button
              key={item.path}
              onClick={() => setCurrentUrl(item.path)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/60'
              }`}
            >
              <Icon size={12} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Realistic Virtual Device Frame */}
      <div className="relative flex items-center justify-center py-4 w-full overflow-x-auto">
        <div
          className="relative transition-all duration-300 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]"
          style={{
            width: `${dim.width}px`,
            height: `${dim.height}px`,
          }}
        >
          {/* Titanium Outer Rim */}
          <div className="absolute inset-0 rounded-[50px] bg-gradient-to-tr from-slate-700 via-slate-600 to-slate-800 p-[3px] shadow-2xl">
            {/* Inner Black Bezel */}
            <div className="w-full h-full rounded-[47px] bg-black p-[12px] flex flex-col relative overflow-hidden">
              {/* Dynamic Island / Notch */}
              {deviceType === 'iphone' && orientation === 'portrait' && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-between px-2.5 shadow-md">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
                </div>
              )}

              {/* Pixel Front Camera Pin */}
              {deviceType === 'pixel' && orientation === 'portrait' && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full z-40 flex items-center justify-center border border-slate-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                </div>
              )}

              {/* Speaker Ear Piece */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-slate-800 rounded-full z-30" />

              {/* Device Screen (iframe container) */}
              <div className="flex-1 w-full h-full rounded-[38px] overflow-hidden bg-white relative">
                <iframe
                  key={key}
                  src={currentUrl}
                  title="Zero Drop Mobile Device View"
                  className="w-full h-full border-0 select-none"
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </div>

              {/* Home Indicator Bar */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400/80 rounded-full z-40 pointer-events-none" />
            </div>
          </div>

          {/* Realistic Hardware Side Buttons */}
          <div className="absolute -left-[5px] top-28 w-[3px] h-10 bg-slate-600 rounded-l-sm" />
          <div className="absolute -left-[5px] top-42 w-[3px] h-12 bg-slate-600 rounded-l-sm" />
          <div className="absolute -left-[5px] top-58 w-[3px] h-12 bg-slate-600 rounded-l-sm" />
          <div className="absolute -right-[5px] top-36 w-[3px] h-16 bg-slate-600 rounded-r-sm" />
        </div>
      </div>

      <div className="text-center mt-4 text-xs text-slate-400">
        Interactive live touch container • Rendered viewport size:{' '}
        <span className="font-mono text-emerald-400">{dim.screenW} × {dim.screenH}px</span>
      </div>
    </div>
  );
}
