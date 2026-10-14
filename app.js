(async function () {
  const D = await Core.load(), S = D.settings, C = S.colors || {};
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const url = u => /^\s*(javascript|data|vbscript):/i.test(u || '') ? '#' : esc(u || '');
  const tgt = u => /^https?:/i.test(u || '') ? ' target="_blank" rel="noopener"' : '';
  const num = n => Number(n || 0).toLocaleString('en-US');
  const money = n => num(n) + ' ' + (S.currency || '');
  const waNum = (S.whatsapp || '').replace(/\D/g, '');
  const wa = t => 'https://wa.me/' + waNum + '?text=' + encodeURIComponent(t);
  const order = (link, txt) => link || wa(txt);
  const ph = () => S.placeholder || ('data:image/svg+xml;utf8,' + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='#e6d8c0'/><text x='200' y='158' font-size='26' text-anchor='middle' fill='#3b2a20' font-family='sans-serif'>GRAVITY</text></svg>"));
  const img = (src, alt = '', cls = '') => `<img ${cls ? `class="${cls}" ` : ''}src="${esc(src || ph())}" alt="${esc(alt)}" loading="lazy">`;

  /* الثيم والخط والـ SEO */
  const rs = document.documentElement.style;
  [['brown', '--brown'], ['brownDark', '--brown-d'], ['beige', '--beige'], ['sand', '--sand'], ['accent', '--accent'], ['white', '--white']].forEach(([k, v]) => C[k] && rs.setProperty(v, C[k]));
  if (S.font) {
    rs.setProperty('--font', "'" + S.font + "'");
    const l = document.createElement('link'); l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=' + S.font.replace(/ /g, '+') + ':wght@400;700&display=swap'; document.head.appendChild(l);
  }
  document.title = S.seoTitle || S.name; $('meta[name=description]').content = S.seoDesc || '';

  const cats = D.categories.filter(c => c.visible !== false), catMap = Object.fromEntries(D.categories.map(c => [c.id, c]));
  const projects = D.projects.filter(p => p.visible !== false && cats.some(c => c.id === p.cat));
  const liveOffers = () => D.offers.filter(o => o.active !== false && o.visible !== false && Core.offerState(o) === 'live');
  const offerFor = (kind, id) => liveOffers().find(o => (o[kind] || []).includes(id));
  const defaultMsg = 'مرحبًا ' + S.name + '، أرغب في الاستفسار عن خدماتكم.';

  function embed(u) {
    let m = u.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
    if (m) return { t: 'iframe', src: 'https://www.youtube-nocookie.com/embed/' + m[1] + '?autoplay=1&rel=0', thumb: 'https://img.youtube.com/vi/' + m[1] + '/hqdefault.jpg' };
    m = u.match(/vimeo\.com\/(\d+)/); if (m) return { t: 'iframe', src: 'https://player.vimeo.com/video/' + m[1] + '?autoplay=1' };
    if (/\.(mp4|webm|ogg)(\?|$)/i.test(u) || u.includes('/storage/v1/object/public/')) return { t: 'video', src: u };
    return { t: 'ext' };
  }

  /* الهيدر */
  $('#hdr').innerHTML = `<div class="wrap bar"><a class="brand" href="#hero">${img(S.logo, S.name)}<span>${esc(S.name)}</span></a>
    <button class="burger" aria-label="القائمة" aria-expanded="false"><i></i></button>
    <nav id="nav"><ul>${D.nav.filter(n => n.visible !== false).map(n => `<li class="${n.dropdown ? 'has-dd' : ''}"><a href="${url(n.href)}">${esc(n.label)}</a>${n.dropdown === 'categories' ? `<ul class="dd">${cats.map(c => `<li><a href="#portfolio" data-cat="${esc(c.id)}">${esc(c.name)}</a></li>`).join('')}</ul>` : ''}</li>`).join('')}</ul>
    <a class="btn sm" href="${url(order(D.navCta.link, defaultMsg))}"${tgt(order(D.navCta.link, defaultMsg))}>${esc(D.navCta.text)}</a></nav></div>`;

  const R = {};
  R.hero = s => { const h = D.hero; return `<section id="hero" class="hero"><div class="wrap hero-g">
    <div class="hero-t"><h1>${esc(h.title)}</h1><p>${esc(h.text)}</p><div class="cta">
      <a class="btn" href="${url(order(h.btn1Link, defaultMsg))}"${tgt(order(h.btn1Link, defaultMsg))}>${esc(h.btn1Text)}</a>
      <a class="btn ghost" href="${url(h.btn2Link)}"${tgt(h.btn2Link)}>${esc(h.btn2Text)}</a></div></div>
    <div class="hero-v"><div class="bubble">${h.image ? img(h.image, S.name) : img(S.logo, S.name, 'lg')}</div></div></div></section>`; };

  R.portfolio = () => {
    if (!projects.length) return '<p class="empty">لا توجد أعمال معروضة بعد.</p>';
    const tabs = [['all', 'كل الأعمال']].concat(cats.map(c => [c.id, c.name]));
    return `<div class="tabs" role="tablist">${tabs.map((t, i) => `<button role="tab" class="tab${i ? '' : ' on'}" data-f="${esc(t[0])}">${esc(t[1])}</button>`).join('')}</div>
    <div class="pgrid">${projects.map(p => {
      const c = catMap[p.cat], ev = p.video ? embed(p.video) : null, thumb = p.image || (ev && ev.thumb) || '';
      const media = `${img(thumb, p.title)}${ev ? '<span class="play">▶</span>' : ''}`;
      const m = ev && ev.t === 'ext' ? `<a class="pj-m" href="${url(p.video)}" target="_blank" rel="noopener" aria-label="مشاهدة">${media}</a>` : `<button class="pj-m" data-open="${esc(p.id)}" aria-label="فتح ${esc(p.title)}">${media}</button>`;
      return `<article class="card pj" data-cat="${esc(p.cat)}" style="--ratio:${esc(c.ratio || '4/3')};--fit:${esc(c.fit || 'cover')}">${m}
        <div class="pj-b">${p.featured ? '<span class="star">★ مميز</span>' : ''}<small>${esc(c.name)}</small><h3>${esc(p.title)}</h3>${p.client ? `<p class="cl">${esc(p.client)}</p>` : ''}${p.desc ? `<p>${esc(p.desc)}</p>` : ''}
        ${p.link ? `<a class="lnk" href="${url(p.link)}"${tgt(p.link)}>${ev ? 'رابط المشاهدة' : 'زيارة المشروع'} ←</a>` : ''}</div></article>`;
    }).join('')}</div><p class="empty" id="pempty" hidden>لا توجد أعمال في هذا التصنيف بعد.</p>`;
  };

  R.services = () => {
    const list = D.services.filter(x => x.active !== false); if (!list.length) return '';
    return `<div class="grid">${list.map(x => { const o = offerFor('serviceIds', x.id); return `<article class="card sv">
      ${x.image ? img(x.image, x.title, 'sv-i') : `<span class="ico">${esc(x.icon || '✨')}</span>`}${o ? `<span class="badge">عرض: ${esc(o.title)}</span>` : ''}
      <h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p>
      <div class="pr">${+x.price > 0 ? `<b>${money(x.price)}</b> <small>${esc(x.unit)}</small>` : '<small>السعر حسب الطلب</small>'}</div>
      <a class="btn sm" href="${url(order(x.link, 'مرحبًا ' + S.name + '، أرغب في طلب خدمة: ' + x.title))}"${tgt(order(x.link, ''))}>${esc(x.btnText || 'اطلب الخدمة')}</a></article>`; }).join('')}</div>`;
  };

  R.packages = () => {
    const list = D.packages.filter(x => x.active !== false); if (!list.length) return '';
    return `<div class="grid pk-g">${list.map(p => { const o = offerFor('packageIds', p.id), sv = +p.oldPrice > +p.price && +p.price > 0 ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
      return `<article class="card pk${p.popular ? ' pop' : ''}">${p.popular ? '<span class="badge">الأكثر طلبًا</span>' : ''}${o ? `<span class="badge b2">عرض: ${esc(o.title)}</span>` : ''}
      ${p.image ? img(p.image, p.name, 'pk-i') : ''}<h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p>
      <div class="pk-p">${+p.price > 0 ? `<b>${money(p.price)}</b> <small>${esc(p.period)}</small>` : '<small>تواصل معنا للسعر</small>'}${sv ? `<div><s>${money(p.oldPrice)}</s> <em>وفّر ${sv}%</em></div>` : ''}</div>
      <ul class="ck">${(p.features || []).map(f => `<li>${esc(f)}</li>`).join('')}</ul>
      <a class="btn" href="${url(order(p.link, 'مرحبًا ' + S.name + '، أرغب في الاشتراك في باقة: ' + p.name))}"${tgt(order(p.link, ''))}>${esc(p.btnText || 'اطلب الباقة')}</a></article>`; }).join('')}</div>`;
  };

  const bItems = D.builder.filter(b => b.active !== false);
  R.builder = () => !bItems.length ? '' : `<div class="bld"><div class="bld-l">${bItems.map(b => `<div class="card bi" data-id="${esc(b.id)}"><div><h3>${esc(b.name)}</h3><p>${esc(b.desc)}</p>
      <div class="pr">${+b.price > 0 ? `<b>${money(b.price)}</b> <small>/ ${esc(b.unitLabel)}</small>` : '<small>السعر يُتفق عليه</small>'}</div></div><div class="bi-c"></div></div>`).join('')}</div>
    <aside class="card bld-s"><h3>باقتك</h3><div id="lines"></div><div class="tot"><span>الإجمالي</span><b id="total">${money(0)}</b></div><p class="note" id="tnote" hidden>الإجمالي لا يشمل البنود التي يُتفق على سعرها.</p>
      <input id="cn" placeholder="الاسم" autocomplete="name"><input id="cp" placeholder="رقم التواصل" inputmode="tel" autocomplete="tel"><textarea id="cm" rows="3" placeholder="ملاحظات إضافية"></textarea>
      <button class="btn" id="bsend" disabled>اطلب باقتك</button><p class="note">يفتح الزر رسالة واتساب جاهزة، وتُعد طلبًا مبدئيًا لا يتأكد إلا بعد تواصلنا معك.</p></aside></div>`;

  R.offers = () => {
    const list = liveOffers();
    if (!list.length) return '<p class="empty">لا توجد عروض فعّالة حاليًا. تابعنا لتصلك العروض القادمة.</p>';
    const nm = (arr, src) => (arr || []).map(id => (src.find(x => x.id === id) || {}).name || (src.find(x => x.id === id) || {}).title).filter(Boolean);
    return `<div class="grid">${list.map(o => { const k = Core.offerCalc(o), inc = nm(o.packageIds, D.packages).concat(nm(o.serviceIds, D.services));
      return `<article class="card of">${o.image ? img(o.image, o.title, 'of-i') : ''}${k.pct ? `<span class="badge">خصم ${k.pct}%</span>` : ''}<h3>${esc(o.title)}</h3><p>${esc(o.desc)}</p>
      ${inc.length ? `<p class="inc">يشمل: ${inc.map(esc).join('، ')}</p>` : ''}
      <div class="pk-p"><b>${k.price > 0 ? money(k.price) : ''}</b> ${k.old > k.price && k.price > 0 ? `<s>${money(k.old)}</s>` : ''}</div>
      ${o.end ? `<small>ينتهي العرض في ${new Date(o.end + 'T00:00:00').toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}</small>` : ''}
      <a class="btn sm" href="${url(order(o.link, 'مرحبًا ' + S.name + '، أرغب في الاستفادة من عرض: ' + o.title))}"${tgt(order(o.link, ''))}>${esc(o.btnText || 'احصل على العرض')}</a></article>`; }).join('')}</div>`;
  };

  R.about = () => { const a = D.about, li = arr => (arr || []).map(x => `<li>${esc(x)}</li>`).join('');
    return `<div class="ab"><div><h3 class="ab-t">${esc(a.title)}</h3><p>${esc(a.text)}</p>
      <div class="vm"><div class="card"><h4>رؤيتنا</h4><p>${esc(a.vision)}</p></div><div class="card"><h4>رسالتنا</h4><p>${esc(a.mission)}</p></div></div>
      <div class="two"><div><h4>ما يميز خدماتنا</h4><ul class="ck">${li(a.features)}</ul></div><div><h4>الفئات التي نخدمها</h4><ul class="ck">${li(a.audience)}</ul></div></div>
      <a class="btn" href="${url(order(a.ctaLink, defaultMsg))}"${tgt(order(a.ctaLink, ''))}>${esc(a.ctaText)}</a></div>
      ${a.image ? `<div class="ab-i">${img(a.image, a.title)}</div>` : ''}</div>`; };

  R.testimonials = () => { const list = D.testimonials.filter(t => t.active !== false); if (!list.length) return '';
    return `<div class="grid">${list.map(t => `<figure class="card ts">${t.proof ? `<button class="ts-p" data-img="${esc(t.proof)}">${img(t.proof, 'إثبات التقييم')}</button>` : ''}<blockquote>${esc(t.text)}</blockquote>
      <figcaption>${t.image ? img(t.image, t.name, 'av') : `<span class="av">${esc((t.name || '؟').trim().charAt(0))}</span>`}<span><b>${esc(t.name)}</b><small>${esc(t.service)}</small></span>${t.proofLink ? `<a class="lnk" href="${url(t.proofLink)}"${tgt(t.proofLink)}>المصدر</a>` : ''}</figcaption></figure>`).join('')}</div>`; };

  R.faq = () => { const list = D.faq.filter(f => f.visible !== false); if (!list.length) return '';
    return `<div class="faq">${list.map(f => `<details class="card"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div>`; };

  R.contact = () => { const c = D.contact, so = (c.socials || []).filter(x => x.active !== false && x.url);
    return `<div class="ct"><div><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p><div class="cta">
      <a class="btn" href="${url(wa(defaultMsg))}" target="_blank" rel="noopener">راسلنا على واتساب</a>${c.email ? `<a class="btn ghost" href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : ''}</div>
      ${so.length ? `<div class="soc">${so.map(x => `<a href="${url(x.url)}" target="_blank" rel="noopener">${esc(x.label)}</a>`).join('')}</div>` : ''}</div>
      ${c.formEnabled !== false ? `<form class="card" id="cf"><input name="n" placeholder="الاسم" required><input name="p" placeholder="رقم التواصل" inputmode="tel" required><textarea name="m" rows="4" placeholder="اكتب رسالتك" required></textarea><button class="btn">أرسل عبر واتساب</button></form>` : ''}</div>`; };

  let alt = false;
  $('#app').innerHTML = D.sections.filter(s => s.visible !== false).map(s => {
    const body = R[s.id] && R[s.id](s); if (!body) return '';
    if (s.id === 'hero') return body;
    const cls = ['offers', 'contact'].includes(s.id) ? 'dark' : ((alt = !alt) ? 'alt' : '');
    return `<section id="${s.id}" class="sec ${cls}"><div class="wrap"><div class="sh"><h2>${esc(s.title)}</h2>${s.subtitle ? `<p>${esc(s.subtitle)}</p>` : ''}</div>${body}</div></section>`;
  }).join('');

  /* الفوتر */
  const soc = (D.contact.socials || []).filter(x => x.active !== false && x.url);
  $('#ftr').innerHTML = `<div class="wrap fg"><div>${img(S.footerLogo || S.logo, S.name)}<p>${esc(D.footer.text)}</p></div>
    <div><h4>الأقسام</h4><ul>${D.nav.filter(n => n.visible !== false).map(n => `<li><a href="${url(n.href)}">${esc(n.label)}</a></li>`).join('')}</ul></div>
    <div><h4>تواصل</h4><ul><li><a href="${url(wa(defaultMsg))}" target="_blank" rel="noopener">واتساب</a></li>${D.contact.email ? `<li><a href="mailto:${esc(D.contact.email)}">${esc(D.contact.email)}</a></li>` : ''}${soc.map(x => `<li><a href="${url(x.url)}" target="_blank" rel="noopener">${esc(x.label)}</a></li>`).join('')}</ul></div></div>
    <p class="copy">${esc(D.footer.copyright)}</p>`;

  /* الهيدر: قائمة الموبايل */
  const nav = $('#nav'), bg = $('.burger');
  bg.onclick = () => { const o = nav.classList.toggle('open'); bg.setAttribute('aria-expanded', o); };
  nav.addEventListener('click', e => { if (e.target.closest('a')) { nav.classList.remove('open'); bg.setAttribute('aria-expanded', false); } });

  /* فلترة الأعمال */
  function setFilter(f) {
    $$('.tab').forEach(t => t.classList.toggle('on', t.dataset.f === f));
    let n = 0; $$('.pj').forEach(c => { const h = f !== 'all' && c.dataset.cat !== f; c.hidden = h; if (!h) n++; });
    const e = $('#pempty'); if (e) e.hidden = n > 0;
  }
  document.addEventListener('click', e => {
    const t = e.target.closest('.tab'); if (t) setFilter(t.dataset.f);
    const c = e.target.closest('a[data-cat]'); if (c) setFilter(c.dataset.cat);
    const o = e.target.closest('[data-open]'); if (o) openProject(o.dataset.open);
    const im = e.target.closest('[data-img]'); if (im) show(`<img class="big" src="${esc(im.dataset.img)}" alt="">`);
  });

  /* النافذة المنبثقة */
  const dlg = $('#dlg');
  function show(html) { dlg.innerHTML = `<button class="x" data-x aria-label="إغلاق">✕</button>${html}`; dlg.showModal ? dlg.showModal() : dlg.setAttribute('open', ''); }
  dlg.addEventListener('click', e => { if (e.target === dlg || e.target.closest('[data-x]')) dlg.close(); });
  dlg.addEventListener('close', () => setTimeout(() => { if (!dlg.open) dlg.innerHTML = ''; }, 0));
  function openProject(id) {
    const p = D.projects.find(x => x.id === id); if (!p) return;
    const cap = `<div class="cap"><h3>${esc(p.title)}</h3>${p.client ? `<p class="cl">${esc(p.client)}</p>` : ''}${p.desc ? `<p>${esc(p.desc)}</p>` : ''}${p.link ? `<a class="btn sm" href="${url(p.link)}"${tgt(p.link)}>${p.video ? 'رابط المشاهدة' : 'زيارة المشروع'}</a>` : ''}</div>`;
    const ev = p.video ? embed(p.video) : null;
    if (ev && ev.t === 'iframe') return show(`<div class="vid"><iframe src="${esc(ev.src)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="${esc(p.title)}"></iframe></div>${cap}`);
    if (ev && ev.t === 'video') return show(`<video class="vid-f" src="${esc(ev.src)}" controls autoplay playsinline poster="${esc(p.image || '')}"></video>${cap}`);
    const imgs = [p.image].concat(p.gallery || []).filter(Boolean); if (!imgs.length) imgs.push(ph());
    let i = 0; show(`<div class="gal"><img class="big" id="gi" src="${esc(imgs[0])}" alt="${esc(p.title)}">${imgs.length > 1 ? '<button class="gn gp" data-g="1" aria-label="التالي">›</button><button class="gn gv" data-g="-1" aria-label="السابق">‹</button>' : ''}</div>${cap}`);
    $$('[data-g]', dlg).forEach(b => b.onclick = () => { i = (i + +b.dataset.g + imgs.length) % imgs.length; $('#gi').src = imgs[i]; });
  }

  /* أداة تخصيص الباقة */
  const sel = {}, bm = Object.fromEntries(bItems.map(b => [b.id, b]));
  const clampQ = (b, q) => Math.max(+b.min || 1, Math.min(+b.max || 999, Math.round(+q) || (+b.min || 1)));
  function paint() {
    let total = 0, free = false, lines = '';
    const fa = document.activeElement, fk = fa && fa.closest && fa.closest('.bi-c') ? [fa.dataset.b || 'qty', fa.dataset.id] : null; if (fk) fa.blur();
    bItems.forEach(b => {
      const q = sel[b.id], box = $(`.bi[data-id="${b.id}"] .bi-c`); if (!box) return;
      $(`.bi[data-id="${b.id}"]`).classList.toggle('on', !!q);
      box.innerHTML = !q ? `<button class="btn sm" data-b="add" data-id="${esc(b.id)}">إضافة</button>`
        : b.mode === 'fixed' ? `<button class="btn sm ghost" data-b="rm" data-id="${esc(b.id)}">إزالة</button>`
          : `<div class="stp"><button data-b="dec" data-id="${esc(b.id)}" aria-label="إنقاص">−</button><input type="number" class="qty" data-id="${esc(b.id)}" value="${q}" min="${+b.min || 1}" max="${+b.max || 999}" aria-label="الكمية"><button data-b="inc" data-id="${esc(b.id)}" aria-label="زيادة">+</button></div>`;
      if (q) { const line = (+b.price || 0) * q; total += line; if (!(+b.price > 0)) free = true;
        lines += `<div class="ln"><span>${esc(b.name)}<small>${b.mode === 'fixed' ? '' : q + ' × ' + esc(b.unitLabel) + ' × ' + money(b.price)}</small></span><b>${+b.price > 0 ? money(line) : 'يُتفق عليه'}</b><button data-b="rm" data-id="${esc(b.id)}" aria-label="حذف">✕</button></div>`; }
    });
    $('#lines').innerHTML = lines || '<p class="empty sm">لم تختر أي خدمة بعد.</p>';
    if (fk) { const n = $(`[data-b="${fk[0]}"][data-id="${fk[1]}"]`) || $(`.qty[data-id="${fk[1]}"]`) || $(`[data-b="add"][data-id="${fk[1]}"]`); if (n) n.focus(); }
    $('#total').textContent = money(total); $('#tnote').hidden = !free; $('#bsend').disabled = !Object.keys(sel).length;
  }
  if (bItems.length && $('#builder')) {
    paint();
    const root = $('#builder');
    root.addEventListener('click', e => {
      const b = e.target.closest('[data-b]'); if (!b) return; const it = bm[b.dataset.id], a = b.dataset.b;
      if (a === 'add') sel[it.id] = clampQ(it, it.min || 1); else if (a === 'rm') delete sel[it.id];
      else if (a === 'inc') sel[it.id] = clampQ(it, sel[it.id] + 1); else if (a === 'dec') sel[it.id] = clampQ(it, sel[it.id] - 1);
      paint();
    });
    root.addEventListener('change', e => { if (e.target.classList.contains('qty')) { const it = bm[e.target.dataset.id]; sel[it.id] = clampQ(it, e.target.value); paint(); } });
    $('#bsend').onclick = () => {
      let total = 0, n = 0, t = `مرحبًا ${S.name} 👋\nأرغب في طلب باقة مخصصة:\n`;
      const name = $('#cn').value.trim(), ph2 = $('#cp').value.trim(), nt = $('#cm').value.trim();
      if (name) t += `\nالاسم: ${name}`; if (ph2) t += `\nرقم التواصل: ${ph2}`;
      t += '\n\nالخدمات المختارة:\n';
      bItems.forEach(b => { const q = sel[b.id]; if (!q) return; const line = (+b.price || 0) * q; total += line;
        t += `${++n}) ${b.name}\n   ${b.mode === 'fixed' ? '' : 'الكمية: ' + q + ' ' + b.unitLabel + ' × ' + money(b.price) + '\n   '}السعر: ${+b.price > 0 ? money(line) : 'يُتفق عليه'}\n`; });
      t += `\nالإجمالي النهائي: ${money(total)}`; if (nt) t += `\nملاحظات: ${nt}`;
      window.open(wa(t), '_blank', 'noopener');
    };
  }

  /* نموذج التواصل */
  const cf = $('#cf');
  if (cf) cf.onsubmit = e => { e.preventDefault(); const f = new FormData(cf);
    window.open(wa(`رسالة من موقع ${S.name}\nالاسم: ${f.get('n')}\nرقم التواصل: ${f.get('p')}\n\n${f.get('m')}`), '_blank', 'noopener'); };

  document.addEventListener('error', e => { const t = e.target; if (t.tagName === 'IMG' && !t.dataset.fb) { t.dataset.fb = 1; t.src = ph(); } }, true);
  if (location.hash) { const el = document.getElementById(location.hash.slice(1)); if (el) el.scrollIntoView(); }
})();
