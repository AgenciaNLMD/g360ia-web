/**
 * SidebarNav — Navegación lateral con menú radial tipo red neuronal
 * Compatible con Babel-standalone (sin módulos ES).
 * Dependencias globales: React, Motion (framer-motion@10 UMD), Tailwind Play CDN.
 * Iconos: SVG inline (estilo Lucide, sin dependencia externa).
 * Uso en app.jsx: <SidebarNav onNavigate={(id) => onNav(id)} />
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════
// ICONOS SVG INLINE (estilo Lucide — viewBox 24x24, stroke)
// ═══════════════════════════════════════════════════════════════
function Svg({ size = 18, sw = 1.8, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >{children}</svg>
  );
}

const IcoHome = ({ size, strokeWidth: sw }) => (
  <Svg size={size} sw={sw}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </Svg>
);
const IcoGrid = ({ size, strokeWidth: sw }) => (
  <Svg size={size} sw={sw}>
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
  </Svg>
);
const IcoFolder = ({ size, strokeWidth: sw }) => (
  <Svg size={size} sw={sw}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </Svg>
);
const IcoMail = ({ size, strokeWidth: sw }) => (
  <Svg size={size} sw={sw}>
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <polyline points="22,4 12,13 2,4"/>
  </Svg>
);
const IcoMenu = ({ size, strokeWidth: sw }) => (
  <Svg size={size} sw={sw}>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </Svg>
);
const IcoX = ({ size, strokeWidth: sw }) => (
  <Svg size={size} sw={sw}>
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </Svg>
);
const IcoGlobe = ({ size, strokeWidth: sw }) => (
  <Svg size={size} sw={sw}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </Svg>
);
const IcoPhone = ({ size, strokeWidth: sw }) => (
  <Svg size={size} sw={sw}>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
    <line x1="12" y1="18" x2="12.01" y2="18"/>
  </Svg>
);
const IcoChat = ({ size, strokeWidth: sw }) => (
  <Svg size={size} sw={sw}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </Svg>
);
const IcoLayers = ({ size, strokeWidth: sw }) => (
  <Svg size={size} sw={sw}>
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 17 12 22 22 17"/>
    <polyline points="2 12 12 17 22 12"/>
  </Svg>
);
const IcoCloud = ({ size, strokeWidth: sw }) => (
  <Svg size={size} sw={sw}>
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
  </Svg>
);

// ═══════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════

const RADIAL_RADIUS = 115;

const NAV_ITEMS = [
  { id: 'servicios', label: 'Servicios', icon: IcoGrid,   hasRadial: true },
  { id: 'proyectos', label: 'Proyectos', icon: IcoFolder },
  { id: 'contacto',  label: 'Contacto',  icon: IcoMail },
];

const SERVICE_NODES = [
  { id: 'web',        label: 'Desarrollo Web', icon: IcoGlobe  },
  { id: 'mobile',     label: 'Apps Móviles',   icon: IcoPhone  },
  { id: 'consulting', label: 'Consultoría',     icon: IcoChat   },
  { id: 'design',     label: 'Diseño UI',       icon: IcoLayers },
  { id: 'cloud',      label: 'Cloud',           icon: IcoCloud  },
];

// Semicírculo hacia la izquierda (90° → 270°)
function getRadialPositions(n, radius) {
  const startAngle = Math.PI * 0.5;
  const endAngle   = Math.PI * 1.5;
  return Array.from({ length: n }, (_, i) => {
    const angle = startAngle + (i / (n - 1)) * (endAngle - startAngle);
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  });
}

const NODE_POSITIONS = getRadialPositions(SERVICE_NODES.length, RADIAL_RADIUS);

// ═══════════════════════════════════════════════════════════════
// TOOLTIP
// ═══════════════════════════════════════════════════════════════
function Tooltip({ label }) {
  return (
    <motion.div
      role="tooltip"
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ duration: 0.13 }}
      className="
        absolute right-full mr-3 top-1/2 -translate-y-1/2
        px-2.5 py-1 rounded-lg
        text-[11px] font-semibold tracking-wide text-gray-100
        bg-gray-900/95 border border-white/10
        whitespace-nowrap pointer-events-none backdrop-blur-sm shadow-xl
      "
    >
      {label}
      <span className="
        absolute left-full top-1/2 -translate-y-1/2
        border-[5px] border-transparent border-l-gray-900/95
      " />
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MENÚ RADIAL
// ═══════════════════════════════════════════════════════════════
function RadialMenu({ center, onNodeClick, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 z-[68]" onClick={onClose} aria-hidden="true" />

      <div
        className="fixed z-[69] pointer-events-none"
        style={{ left: center.x, top: center.y }}
      >
        {/* Líneas SVG animadas */}
        <svg
          aria-hidden="true"
          className="absolute overflow-visible pointer-events-none"
          style={{ width: 0, height: 0 }}
        >
          {NODE_POSITIONS.map((pos, i) => (
            <motion.path
              key={i}
              d={`M 0 0 L ${pos.x} ${pos.y}`}
              stroke="rgba(96,165,250,0.20)"
              strokeWidth="1"
              strokeDasharray="3 4"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.40, delay: i * 0.055 }}
            />
          ))}
        </svg>

        {/* Nodos radiales */}
        {SERVICE_NODES.map((node, i) => {
          const pos     = NODE_POSITIONS[i];
          const NodeIco = node.icon;
          return (
            <motion.div
              key={node.id}
              className="absolute pointer-events-auto"
              style={{ left: pos.x, top: pos.y }}
              initial={{ x: -pos.x, y: -pos.y, scale: 0, opacity: 0 }}
              animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              exit={{
                x: -pos.x, y: -pos.y, scale: 0, opacity: 0,
                transition: { duration: 0.22, delay: (SERVICE_NODES.length - 1 - i) * 0.04 },
              }}
              transition={{ type: 'spring', stiffness: 290, damping: 22, delay: i * 0.07 }}
            >
              <motion.button
                aria-label={node.label}
                onClick={() => onNodeClick(node.id)}
                animate={{ y: [0, -5, 0, 5, 0] }}
                transition={{ duration: 2.6 + i * 0.40, repeat: Infinity, ease: 'easeInOut', delay: i * 0.28 }}
                whileHover={{ scale: 1.22 }}
                whileTap={{ scale: 0.84 }}
                className="
                  relative -translate-x-1/2 -translate-y-1/2
                  w-10 h-10 rounded-full
                  flex items-center justify-center
                  bg-gray-950/90 border border-blue-400/40
                  text-blue-300 cursor-pointer
                "
                style={{ boxShadow: '0 0 10px rgba(96,165,250,0.50), 0 0 28px rgba(96,165,250,0.18)' }}
              >
                <NodeIco size={15} strokeWidth={1.8} />
                <span className="
                  absolute top-full left-1/2 -translate-x-1/2 mt-1.5
                  text-[9px] font-semibold text-blue-300/75
                  whitespace-nowrap pointer-events-none
                ">
                  {node.label}
                </span>
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// ÍTEM DE NAVEGACIÓN
// ═══════════════════════════════════════════════════════════════
function NavItem({ item, index, onNavClick, radialOpen, onToggleRadial }) {
  const [hovered, setHovered] = useState(false);
  const btnRef  = useRef(null);
  const NavIco  = item.icon;
  const isActive = item.hasRadial && radialOpen;

  const handleClick = () => {
    if (item.hasRadial) {
      const rect = btnRef.current?.getBoundingClientRect();
      onToggleRadial(rect
        ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        : null
      );
    } else {
      onNavClick(item.id);
    }
  };

  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 300, damping: 26 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.button
        ref={btnRef}
        aria-label={item.label}
        aria-pressed={isActive}
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.90 }}
        className={`
          w-10 h-10 rounded-xl flex items-center justify-center
          border transition-colors duration-150 cursor-pointer
          ${isActive
            ? 'bg-blue-500/20 border-blue-400/55 text-blue-300'
            : 'bg-white/5 border-white/8 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/18'
          }
        `}
        style={isActive ? { boxShadow: '0 0 20px rgba(96,165,250,0.32)' } : undefined}
      >
        <NavIco size={18} strokeWidth={1.8} />
      </motion.button>

      {!item.hasRadial && (
        <AnimatePresence>
          {hovered && <Tooltip label={item.label} />}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SIDEBAR PRINCIPAL
// ═══════════════════════════════════════════════════════════════
function SidebarNav({ onNavigate = () => {} }) {
  const [radialOpen, setRadialOpen] = useState(false);
  const [center,     setCenter]     = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && radialOpen) setRadialOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [radialOpen]);

  const handleToggleRadial = (pos) => {
    if (pos) setCenter(pos);
    setRadialOpen(o => !o);
  };

  return (
    <>
      {/* ── SIDEBAR — siempre visible, centrado en desktop, top-right en mobile ── */}
      <div className="fixed right-3 z-[65] top-20 md:top-1/2 md:-translate-y-1/2">
        <nav
          aria-label="Navegación lateral"
          className="
            flex flex-col items-center gap-2
            py-4 px-2
            bg-gray-950/55 border border-white/[0.08]
            rounded-2xl backdrop-blur-xl
          "
          style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.55)' }}
        >
          {NAV_ITEMS.map((item, i) => (
            <NavItem
              key={item.id}
              item={item}
              index={i}
              onNavClick={onNavigate}
              radialOpen={radialOpen}
              onToggleRadial={handleToggleRadial}
            />
          ))}
        </nav>
      </div>

      {/* ── MENÚ RADIAL ── */}
      <AnimatePresence>
        {radialOpen && (
          <RadialMenu
            center={center}
            onNodeClick={(id) => { onNavigate(id); setRadialOpen(false); }}
            onClose={() => setRadialOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export { SidebarNav };
