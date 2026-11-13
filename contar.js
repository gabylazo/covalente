// Contador de visitas de covalente.eu, sin cookies ni almacenamiento. Solo manda qué pasa (alguien llega de fuera o pulsa WhatsApp), de dónde llega
// (la marca ?o= de cada red, o el tipo de sitio del que viene: buscador, directo u otra web) y en qué página. El servidor suma 1 al contador del día:
// no guarda la IP, la dirección de origen ni nada que identifique a nadie. No cuenta robots, ni las visitas con ?nc (las nuestras de prueba).
(() => {
  const q = new URLSearchParams(location.search);
  if (navigator.webdriver || q.has('nc') || /bot|crawl|spider|headless|lighthouse|preview/i.test(navigator.userAgent) || !navigator.sendBeacon) return;
  const local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const URL_C = local ? 'http://127.0.0.1:8795/api/visita' : 'https://covalente-gestion.covalente-gestion.workers.dev/api/visita';
  const caso = (location.pathname.match(/^\/casos\/([a-z-]+)\/?/) || [])[1];
  const pagina = /^\/(index\.html)?$/.test(location.pathname) ? 'portada' : ['nerea-nails', 'taberna-la-jarra', 'flores-santa-maria'].includes(caso) ? caso : null;
  if (!pagina) return;
  let ref = ''; try { ref = new URL(document.referrer).hostname; } catch (e) {}
  const interna = /(^|\.)covalente\.eu$|^gabylazo\.github\.io$/.test(ref) || (local && /^(localhost|127\.0\.0\.1)$/.test(ref));
  const o = q.get('o');
  const origen = ['ig', 'tt', 'pin', 'g', 'cartel'].includes(o) ? o : interna ? 'sin-saber' : !ref ? 'directo'
    : /(^|\.)instagram\.com$/.test(ref) ? 'ig' : /(^|\.)tiktok\.com$/.test(ref) ? 'tt' : /(^|\.)pinterest\./.test(ref) ? 'pin'
    : /(^|\.)(google|bing|duckduckgo|ecosia|yahoo|brave|qwant|yandex|startpage)\./.test(ref) ? 'busqueda' : 'otras';
  const manda = tipo => { try { navigator.sendBeacon(URL_C, new Blob([JSON.stringify({ tipo, origen, pagina })], { type: 'text/plain' })); } catch (e) {} };
  if (!interna) manda('entrada');
  document.addEventListener('click', ev => { if (ev.target.closest && ev.target.closest('a[href^="https://wa.me/"]')) manda('whatsapp'); }, true);
})();
