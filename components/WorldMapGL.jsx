import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const ORIGIN = [-58.3816, -34.6037]; // Buenos Aires

const DESTINATIONS = [
  { id: 'nyc', coords: [-74.006,   40.7128] },
  { id: 'lon', coords: [-0.1276,   51.5074] },
  { id: 'mad', coords: [-3.7038,   40.4168] },
  { id: 'mex', coords: [-99.1332,  19.4326] },
  { id: 'tyo', coords: [139.6917,  35.6895] },
  { id: 'dxb', coords: [55.2708,   25.2048] },
  { id: 'syd', coords: [151.2093, -33.8688] },
  { id: 'mia', coords: [-80.1918,  25.7617] },
];

function bezierArc(from, to, curvature = 0.35, samples = 80) {
  const [x0, y0] = from;
  const [x2, y2] = to;
  const dx = x2 - x0, dy = y2 - y0;
  const dist = Math.hypot(dx, dy);
  if (dist === 0) return [from, to];
  const mx = (x0 + x2) / 2, my = (y0 + y2) / 2;
  const nx = -dy / dist, ny = dx / dist;
  const off = dist * curvature;
  const cx = mx + nx * off, cy = my + ny * off;
  const pts = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples, inv = 1 - t;
    pts.push([
      inv * inv * x0 + 2 * inv * t * cx + t * t * x2,
      inv * inv * y0 + 2 * inv * t * cy + t * t * y2,
    ]);
  }
  return pts;
}

// Pre-compute all arc coordinate arrays
const ARC_COORDS = DESTINATIONS.map(d => bezierArc(ORIGIN, d.coords));

// Each traveler has a different speed and phase offset
const TRAVELERS = DESTINATIONS.map((d, i) => ({
  id: d.id,
  arcIdx: i,
  speed: 0.0008 + i * 0.00012,   // units per ms — varies per arc
  phase: i * (1 / DESTINATIONS.length), // spread them out
}));

function interpolate(coords, t) {
  const n = coords.length - 1;
  const idx = Math.min(Math.floor(t * n), n - 1);
  const frac = t * n - idx;
  const a = coords[idx], b = coords[idx + 1];
  return [a[0] + (b[0] - a[0]) * frac, a[1] + (b[1] - a[1]) * frac];
}

export default function WorldMapGL({ layersEnabled = true }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const frameRef = useRef(null);
  const lastTimeRef = useRef(null);
  const progressRef = useRef(TRAVELERS.map(t => t.phase));

  useEffect(() => {
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [-20, 15],
      zoom: 1.05,
      interactive: false,
      attributionControl: false,
    });

    mapRef.current = map;

    if (!layersEnabled) {
      return () => { map.remove(); };
    }

    map.on('load', () => {
      // ── Static arc lines ──────────────────────────────────────────────
      const arcFeatures = DESTINATIONS.map((d, i) => ({
        type: 'Feature',
        properties: { id: d.id },
        geometry: { type: 'LineString', coordinates: ARC_COORDS[i] },
      }));

      map.addSource('arcs', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: arcFeatures },
      });

      map.addLayer({
        id: 'arcs-glow',
        type: 'line',
        source: 'arcs',
        paint: {
          'line-color': '#e6a532',
          'line-width': 3,
          'line-opacity': 0.08,
          'line-blur': 5,
        },
        layout: { 'line-join': 'round', 'line-cap': 'round' },
      });

      map.addLayer({
        id: 'arcs-line',
        type: 'line',
        source: 'arcs',
        paint: {
          'line-color': '#e6a532',
          'line-width': 0.8,
          'line-opacity': 0.25,
          'line-dasharray': [3, 5],
        },
        layout: { 'line-join': 'round', 'line-cap': 'round' },
      });

      // ── Destination dots ──────────────────────────────────────────────
      const nodeFc = {
        type: 'FeatureCollection',
        features: DESTINATIONS.map(d => ({
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: d.coords },
        })),
      };

      map.addSource('nodes', { type: 'geojson', data: nodeFc });
      map.addLayer({
        id: 'nodes-halo',
        type: 'circle',
        source: 'nodes',
        paint: { 'circle-radius': 6, 'circle-color': '#e6a532', 'circle-opacity': 0.12, 'circle-blur': 1 },
      });
      map.addLayer({
        id: 'nodes-dot',
        type: 'circle',
        source: 'nodes',
        paint: {
          'circle-radius': 2,
          'circle-color': '#e6a532',
          'circle-opacity': 0.8,
          'circle-stroke-width': 1,
          'circle-stroke-color': 'rgba(255,255,255,0.3)',
        },
      });

      // ── Origin (Buenos Aires) ─────────────────────────────────────────
      const originFc = {
        type: 'Feature',
        properties: {},
        geometry: { type: 'Point', coordinates: ORIGIN },
      };
      map.addSource('origin', { type: 'geojson', data: originFc });
      map.addLayer({
        id: 'origin-halo',
        type: 'circle',
        source: 'origin',
        paint: { 'circle-radius': 16, 'circle-color': '#e6a532', 'circle-opacity': 0.15, 'circle-blur': 1 },
      });
      map.addLayer({
        id: 'origin-ring',
        type: 'circle',
        source: 'origin',
        paint: {
          'circle-radius': 6,
          'circle-color': 'rgba(0,0,0,0)',
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#e6a532',
          'circle-stroke-opacity': 0.9,
        },
      });
      map.addLayer({
        id: 'origin-dot',
        type: 'circle',
        source: 'origin',
        paint: { 'circle-radius': 3, 'circle-color': '#e6a532' },
      });

      // ── Traveler dots (one point per arc, animated) ───────────────────
      const initialTravelerFc = {
        type: 'FeatureCollection',
        features: TRAVELERS.map((t, i) => ({
          type: 'Feature',
          properties: { id: t.id },
          geometry: { type: 'Point', coordinates: interpolate(ARC_COORDS[i], t.phase % 1) },
        })),
      };

      map.addSource('travelers', { type: 'geojson', data: initialTravelerFc });

      // Glow halo for travelers
      map.addLayer({
        id: 'travelers-glow',
        type: 'circle',
        source: 'travelers',
        paint: { 'circle-radius': 6, 'circle-color': '#e6a532', 'circle-opacity': 0.3, 'circle-blur': 3 },
      });
      // Main traveler dot
      map.addLayer({
        id: 'travelers-dot',
        type: 'circle',
        source: 'travelers',
        paint: {
          'circle-radius': 3,
          'circle-color': '#e6a532',
          'circle-opacity': 1,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
          'circle-stroke-opacity': 0.5,
        },
      });

      // ── Animation loop ────────────────────────────────────────────────
      const animate = (time) => {
        if (lastTimeRef.current === null) lastTimeRef.current = time;
        const dt = Math.min(time - lastTimeRef.current, 100); // cap at 100ms
        lastTimeRef.current = time;

        // Advance each traveler along its arc
        progressRef.current = progressRef.current.map((p, i) => {
          let next = p + TRAVELERS[i].speed * dt;
          if (next > 1) next = next - 1; // wrap
          return next;
        });

        // Build new traveler FeatureCollection
        const fc = {
          type: 'FeatureCollection',
          features: progressRef.current.map((p, i) => ({
            type: 'Feature',
            properties: {},
            geometry: { type: 'Point', coordinates: interpolate(ARC_COORDS[i], p) },
          })),
        };

        const source = map.getSource('travelers');
        if (source) source.setData(fc);

        frameRef.current = requestAnimationFrame(animate);
      };

      frameRef.current = requestAnimationFrame(animate);
    });

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      map.remove();
    };
  }, []);

  return (
    <>
      <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />
      <style>{`
        .maplibregl-ctrl-bottom-right,
        .maplibregl-ctrl-bottom-left { display: none !important; }
      `}</style>
    </>
  );
}
