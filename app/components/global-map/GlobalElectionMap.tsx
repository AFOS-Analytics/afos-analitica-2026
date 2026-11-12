'use client';

import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { useLocale, useTranslation } from '../../i18n/context';
import type { CountryMarketSummary, MapTooltipData } from '../../types/global-map';
import { NUMERIC_TO_ISO3 } from '../../types/global-map';
import { MAP_TOKENS, getCountryColor, getCountryOpacity } from '../../lib/map-colors';
import { GlobalMapTooltip } from './GlobalMapTooltip';
import { GlobalMapLegend } from './GlobalMapLegend';
import { GlobalCountryDrawer } from './GlobalCountryDrawer';

interface Props {
  countries: CountryMarketSummary[];
}

export const GlobalElectionMap = memo(function GlobalElectionMap({ countries }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<MapTooltipData | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryMarketSummary | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const locale = useLocale();
  const { t } = useTranslation();
  const loadingLabel = locale === 'pt-BR' ? 'Carregando mapa...' : locale === 'es' ? 'Cargando mapa...' : 'Loading map...';

  // Build lookup: ISO3 → country data
  const countryLookup = useRef<Map<string, CountryMarketSummary>>(new Map());
  useEffect(() => {
    const map = new Map<string, CountryMarketSummary>();
    countries.forEach(c => map.set(c.iso3, c));
    countryLookup.current = map;
  }, [countries]);

  const handleCountryHover = useCallback((event: MouseEvent, iso3: string) => {
    const c = countryLookup.current.get(iso3);
    if (c) {
      setTooltip({ x: event.clientX, y: event.clientY, country: c });
    }
  }, []);

  const handleCountryClick = useCallback((iso3: string) => {
    const c = countryLookup.current.get(iso3);
    if (c) {
      setSelectedCountry(c);
      setTooltip(null);
    }
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    let selectFn: typeof import('d3-selection').select | undefined;

    const renderMap = async () => {
      // Dynamic imports, only loaded on client, never in server bundle.
      // Só os submódulos usados, e não o pacote `d3` inteiro: import dinâmico
      // consumido como objeto não permite tree-shaking. `d3-transition` entra
      // pelo efeito colateral: é ele que dá `.transition()` à seleção (pulso).
      const [d3Selection, d3Geo, d3Zoom, topojson] = await Promise.all([
        import('d3-selection'),
        import('d3-geo'),
        import('d3-zoom'),
        import('topojson-client'),
        import('d3-transition'),
      ]);
      const d3 = {
        select: d3Selection.select,
        geoNaturalEarth1: d3Geo.geoNaturalEarth1,
        geoPath: d3Geo.geoPath,
        zoom: d3Zoom.zoom,
      };
      selectFn = d3Selection.select;

      // Load TopoJSON
      const worldData = await fetch('/geo/world-110m.json').then(r => (r.ok ? r.json() : null)) as any;
      if (!worldData?.objects?.countries) return;

      const countriesGeo = topojson.feature(worldData, worldData.objects.countries) as any;
      const borders = topojson.mesh(worldData, worldData.objects.countries, (a: any, b: any) => a !== b);

      // Clear previous render
      d3.select(svg).selectAll('*').remove();

      // Dimensions
      const width = 960;
      const height = 500;

      // Projection: Natural Earth for aesthetics
      const projection = d3.geoNaturalEarth1()
        .scale(155)
        .translate([width / 2, height / 2]);

      const path = d3.geoPath().projection(projection);

      const svgEl = d3.select(svg)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');

      // Defs for glow filter
      const defs = svgEl.append('defs');
      const filter = defs.append('filter').attr('id', 'country-glow');
      filter.append('feGaussianBlur').attr('stdDeviation', '2').attr('result', 'coloredBlur');
      const feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode').attr('in', 'coloredBlur');
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

      // Zoom behavior
      const g = svgEl.append('g');

      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([1, 8])
        .on('zoom', (event) => {
          g.attr('transform', event.transform.toString());
        });

      svgEl.call(zoom);

      // Ocean background
      g.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', MAP_TOKENS.ocean);

      // Country paths
      g.selectAll<SVGPathElement, any>('path.country')
        .data(countriesGeo.features)
        .enter()
        .append('path')
        .attr('class', 'country')
        .attr('d', path as any)
        .attr('fill', (d: any) => {
          const numId = String(d.id).padStart(3, '0');
          const iso3 = NUMERIC_TO_ISO3[numId];
          const c = iso3 ? countryLookup.current.get(iso3) : undefined;
          if (c) return getCountryColor(c.probability, c.status);
          return MAP_TOKENS.countryDefault;
        })
        .attr('fill-opacity', (d: any) => {
          const numId = String(d.id).padStart(3, '0');
          const iso3 = NUMERIC_TO_ISO3[numId];
          const c = iso3 ? countryLookup.current.get(iso3) : undefined;
          return c ? getCountryOpacity(c.volumeUsd) : 0.3;
        })
        .attr('stroke', MAP_TOKENS.countryStroke)
        .attr('stroke-width', 0.5)
        .style('cursor', (d: any) => {
          const numId = String(d.id).padStart(3, '0');
          const iso3 = NUMERIC_TO_ISO3[numId];
          return countryLookup.current.has(iso3 || '') ? 'pointer' : 'default';
        })
        .style('transition', 'fill 0.2s ease, fill-opacity 0.2s ease')
        .on('mouseenter', function (event: MouseEvent, d: any) {
          const numId = String(d.id).padStart(3, '0');
          const iso3 = NUMERIC_TO_ISO3[numId];
          if (!iso3 || !countryLookup.current.has(iso3)) return;

          d3.select(this)
            .attr('fill', MAP_TOKENS.countryHover)
            .attr('fill-opacity', 1)
            .attr('stroke', MAP_TOKENS.primarySoft)
            .attr('stroke-width', 1.5)
            .attr('filter', 'url(#country-glow)');

          handleCountryHover(event, iso3);
        })
        .on('mousemove', function (event: MouseEvent, d: any) {
          const numId = String(d.id).padStart(3, '0');
          const iso3 = NUMERIC_TO_ISO3[numId];
          if (iso3) handleCountryHover(event, iso3);
        })
        .on('mouseleave', function (_: MouseEvent, d: any) {
          const numId = String(d.id).padStart(3, '0');
          const iso3 = NUMERIC_TO_ISO3[numId];
          const c = iso3 ? countryLookup.current.get(iso3) : undefined;

          d3.select(this)
            .attr('fill', c ? getCountryColor(c.probability, c.status) : MAP_TOKENS.countryDefault)
            .attr('fill-opacity', c ? getCountryOpacity(c.volumeUsd) : 0.3)
            .attr('stroke', MAP_TOKENS.countryStroke)
            .attr('stroke-width', 0.5)
            .attr('filter', null);

          setTooltip(null);
        })
        .on('click', function (_: MouseEvent, d: any) {
          const numId = String(d.id).padStart(3, '0');
          const iso3 = NUMERIC_TO_ISO3[numId];
          if (iso3) handleCountryClick(iso3);
        });

      // Borders mesh
      g.append('path')
        .datum(borders)
        .attr('fill', 'none')
        .attr('stroke', MAP_TOKENS.countryStroke)
        .attr('stroke-width', 0.3)
        .attr('d', path as any);

      // Pulsing markers for live elections
      countries.filter(c => c.status === 'live' && c.probability > 0).forEach(c => {
        // Find centroid of the country
        const feature = countriesGeo.features.find((f: any) => {
          const numId = String(f.id).padStart(3, '0');
          return NUMERIC_TO_ISO3[numId] === c.iso3;
        });
        if (!feature) return;

        const centroid = path.centroid(feature);
        if (!centroid || isNaN(centroid[0])) return;

        // Pulse circle
        g.append('circle')
          .attr('cx', centroid[0])
          .attr('cy', centroid[1])
          .attr('r', 3)
          .attr('fill', MAP_TOKENS.primary)
          .attr('opacity', 0.8)
          .style('pointer-events', 'none');

        // Animated ring
        const ring = g.append('circle')
          .attr('cx', centroid[0])
          .attr('cy', centroid[1])
          .attr('r', 3)
          .attr('fill', 'none')
          .attr('stroke', MAP_TOKENS.primarySoft)
          .attr('stroke-width', 1)
          .attr('opacity', 0.6)
          .style('pointer-events', 'none');

        // Quem pede movimento reduzido vê o anel parado, sem o pulso infinito.
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

        function pulse() {
          ring
            .attr('r', 3)
            .attr('opacity', 0.6)
            .transition()
            .duration(2000)
            .attr('r', 12)
            .attr('opacity', 0)
            .on('end', pulse);
        }
        pulse();
      });

      setMapReady(true);
    };

    renderMap().catch((e) => {
      // async throw inside renderMap can't be caught by an error boundary;
      // clear the loading skeleton so it doesn't hang forever on a render failure.
      console.error('GlobalElectionMap render failed', e);
      setMapReady(true);
    });

    // Cleanup
    return () => {
      if (selectFn && svg) {
        selectFn(svg).selectAll('*').remove();
      }
    };
  }, [countries, handleCountryHover, handleCountryClick]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Loading skeleton */}
      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: MAP_TOKENS.bg }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto mb-3" style={{ borderColor: MAP_TOKENS.primary }} />
            <p className="text-sm" style={{ color: MAP_TOKENS.textMuted }}>{loadingLabel}</p>
          </div>
        </div>
      )}

      {/* SVG Map */}
      <svg
        ref={svgRef}
        role="img"
        aria-label={t('modal.globalTitle')}
        className="w-full h-full"
        style={{ background: MAP_TOKENS.bg, opacity: mapReady ? 1 : 0, transition: 'opacity 0.5s ease' }}
      />

      {/* Legend */}
      <GlobalMapLegend />

      {/* Tooltip */}
      <GlobalMapTooltip data={tooltip} />

      {/* Country Drawer */}
      <GlobalCountryDrawer country={selectedCountry} onClose={() => setSelectedCountry(null)} />
    </div>
  );
});
