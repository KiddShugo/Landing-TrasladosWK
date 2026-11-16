// Traslados WK: comportamiento de la página (sin dependencias).
import { SITE } from './site-config.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- datos de contacto (solo los que existen en site-config.js) ---------- */
const wa = SITE.whatsapp ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(SITE.whatsappMessage || '')}` : null;
const contact = {
  phone: SITE.phone && SITE.phoneHref ? { text: SITE.phone, href: `tel:${SITE.phoneHref}` } : null,
  whatsapp: wa ? { href: wa } : null,
  email: SITE.email ? { text: SITE.email, href: `mailto:${SITE.email}` } : null,
  address: SITE.address ? { text: SITE.address } : null,
};
$$('[data-contact]').forEach(el => {
  const c = contact[el.dataset.contact];
  if (!c) return;
  const link = el.matches('[data-contact-link]') ? el : $('[data-contact-link]', el);
  if (link && c.href) link.href = c.href;
  const text = $('[data-contact-text]', el);
  if (text && c.text) text.textContent = c.text;
  el.hidden = false;
});
if (wa) {
  const second = $('[data-cta-secondary]');
  if (second) { second.href = wa; second.target = '_blank'; second.rel = 'noopener'; second.textContent = 'Escribir por WhatsApp'; }
}
$$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

/* ---------- header: transparente sobre el hero, sólido al hacer scroll ---------- */
const header = $('#header');
const onScroll = () => header.classList.toggle('is-solid', scrollY > 24);
onScroll();
addEventListener('scroll', onScroll, { passive: true });

/* ---------- menú móvil ---------- */
const menuBtn = $('.menu-btn');
const sheet = $('#sheet');
const setMenu = open => {
  document.documentElement.classList.toggle('menu-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  document.body.style.overflow = open ? 'hidden' : '';
  sheet.inert = !open;
  if (open) $('a', sheet)?.focus({ preventScroll: true });
};
sheet.inert = true;
menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
$$('a', sheet).forEach(a => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', e => {
  if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); }
});
matchMedia('(min-width: 1024px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

/* ---------- sección activa en el menú ---------- */
const navLinks = $$('.nav a[href^="#"]');
const sections = navLinks.map(a => $(a.getAttribute('href'))).filter(Boolean);
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(a => {
      const on = a.getAttribute('href') === `#${e.target.id}`;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => spy.observe(s));

/* ---------- aparición al hacer scroll (una vez) ---------- */
const revealables = $$('.reveal, [data-observe]');
if (reduced || !('IntersectionObserver' in window)) {
  revealables.forEach(el => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  revealables.forEach(el => io.observe(el));
}

/* ---------- contadores de la sección capacidad ---------- */
const counters = $$('[data-count]');
if (!reduced && counters.length) {
  const run = el => {
    const to = Number(el.dataset.count); const t0 = performance.now(); const dur = 1300;
    const step = now => {
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    el.textContent = '0';
    requestAnimationFrame(step);
  };
  const co = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { $$('[data-count]', e.target).forEach(run); co.unobserve(e.target); } });
  }, { threshold: 0.4 });
  co.observe($('.stats'));
}

/* ---------- mapa de cobertura: chip y punto se resaltan juntos ---------- */
const map = $('.map');
let pinned = null;
const light = (key, on) => $$(`[data-zone="${key}"]`).forEach(el => {
  el.classList.toggle('is-on', on);
  if (el.matches('button')) el.setAttribute('aria-pressed', String(on));
});
$$('.chip').forEach(chip => {
  chip.setAttribute('aria-pressed', 'false');
  const key = chip.dataset.zone;
  chip.addEventListener('pointerenter', () => light(key, true));
  chip.addEventListener('pointerleave', () => { if (pinned !== key) light(key, false); });
  chip.addEventListener('focus', () => light(key, true));
  chip.addEventListener('blur', () => { if (pinned !== key) light(key, false); });
  chip.addEventListener('click', () => {
    if (pinned && pinned !== key) light(pinned, false);
    pinned = pinned === key ? null : key;
    light(key, pinned === key);
  });
});
$$('.pt', map).forEach(pt => {
  const key = pt.dataset.zone;
  pt.addEventListener('pointerenter', () => light(key, true));
  pt.addEventListener('pointerleave', () => { if (pinned !== key) light(key, false); });
});

/* ---------- formulario ---------- */
const form = $('#contact-form');
const status = $('.form__status', form);
const submit = $('button[type="submit"]', form);
const rules = {
  nombre: v => v.trim().length >= 3,
  empresa: v => v.trim().length >= 2,
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
  telefono: v => (v.match(/\d/g) || []).length >= 8 && /^[\d\s()+-]+$/.test(v.trim()),
  mensaje: v => v.trim().length >= 10,
};
const checkField = input => {
  const ok = rules[input.name] ? rules[input.name](input.value) : input.checkValidity();
  const field = input.closest('.field');
  field.classList.toggle('is-invalid', !ok);
  field.classList.toggle('is-valid', ok);
  input.setAttribute('aria-invalid', String(!ok));
  return ok;
};
const say = (text, kind) => { status.textContent = text; status.className = `form__status is-${kind}`; };
$$('input, textarea', form).forEach(input => {
  input.addEventListener('blur', () => { if (input.value) checkField(input); });
  input.addEventListener('input', () => { if (input.closest('.field').classList.contains('is-invalid')) checkField(input); });
});
form.addEventListener('submit', async e => {
  e.preventDefault();
  const inputs = $$('input, textarea', form);
  const bad = inputs.filter(i => !checkField(i));
  if (bad.length) {
    say(bad.length === 1 ? 'Revisá el campo marcado.' : `Revisá los ${bad.length} campos marcados.`, 'error');
    bad[0].focus();
    return;
  }
  const data = new FormData(form);
  if (SITE.formEndpoint) {
    submit.disabled = true; submit.classList.add('is-loading'); say('Enviando…', 'info');
    try {
      const res = await fetch(SITE.formEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(String(res.status));
      form.reset(); $$('.field', form).forEach(f => f.classList.remove('is-valid'));
      say('¡Gracias! Recibimos tu consulta y te vamos a responder a la brevedad.', 'ok');
    } catch {
      say('No pudimos enviar la consulta. Revisá tu conexión e intentá de nuevo; tus datos siguen cargados.', 'error');
    } finally { submit.disabled = false; submit.classList.remove('is-loading'); }
    return;
  }
  if (SITE.email) {
    const body = [...data].map(([k, v]) => `${k}: ${v}`).join('\n');
    location.href = `mailto:${SITE.email}?subject=${encodeURIComponent('Consulta desde la web: ' + data.get('empresa'))}&body=${encodeURIComponent(body)}`;
    say('Se abrió tu programa de correo con la consulta lista para enviar.', 'info');
    return;
  }
  // Sin endpoint ni correo configurados: no se simula un envío.
  say('El envío en línea todavía no está habilitado. Pronto vas a poder contactarnos por este medio.', 'info');
  console.info('Formulario: configurá formEndpoint o email en assets/js/site-config.js');
});
