(async function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  const getp = (o, p) => p.split('.').reduce((a, k) => a == null ? a : a[k], o);
  const setp = (o, p, v) => { const ks = p.split('.'), l = ks.pop(); ks.reduce((a, k) => a[k] = a[k] || {}, o)[l] = v; };
  const F = (k, l, t = 'text', x = {}) => Object.assign({ k, l, t }, x);
  let D, tab = 0, tt; const flt = {};
  function toast(m, bad) { const t = $('#toast'); t.textContent = m; t.className = 'on' + (bad ? ' bad' : ''); clearTimeout(tt); tt = setTimeout(() => t.className = '', 3200); }

  const FONTS = ['Readex Pro', 'Cairo', 'Tajawal', 'IBM Plex Sans Arabic', 'Almarai', 'El Messiri', 'Noto Kufi Arabic'].map(x => [x, x]);
  const catOpts = () => D.categories.map(c => [c.id, c.name]);
  const secOpts = () => D.sections.map(s => [s.id, s.title]);
  const colorF = [['brown', 'البني الأساسي'], ['brownDark', 'البني الداكن'], ['beige', 'البيج'], ['sand', 'البيج الغامق'], ['accent', 'لون التمييز'], ['white', 'الأبيض / المحايد']].map(a => F('colors.' + a[0], a[1], 'color'));

  const B = {
    settings: { t: 'obj', title: 'الإعدادات العامة والهوية', path: 'settings', fields: [F('name', 'اسم الوكالة'), F('logo', 'اللوجو (الهيدر)', 'image'), F('footerLogo', 'لوجو الفوتر (اختياري، وإلا يُستخدم نفس اللوجو)', 'image'), F('placeholder', 'صورة بديلة عند غياب الصورة (اختياري)', 'image'),
      F('whatsapp', 'رقم واتساب بصيغة دولية بدون + أو أصفار (مثال: 201001234567)'), F('currency', 'العملة'), F('font', 'الخط', 'select', { opts: FONTS }), ...colorF, F('seoTitle', 'عنوان الصفحة (SEO)'), F('seoDesc', 'وصف الموقع (SEO)', 'textarea')] },
    hero: { t: 'obj', title: 'القسم الرئيسي (Hero)', path: 'hero', fields: [F('title', 'العنوان'), F('text', 'الوصف', 'textarea'), F('btn1Text', 'نص الزر الرئيسي'), F('btn1Link', 'رابط الزر الرئيسي (اتركه فارغًا ليفتح واتساب)'), F('btn2Text', 'نص الزر الثانوي'), F('btn2Link', 'رابط الزر الثانوي'), F('image', 'صورة الـ Hero (اتركها فارغة لعرض اللوجو)', 'image')] },
    navCta: { t: 'obj', title: 'زر القائمة العلوية', path: 'navCta', fields: [F('text', 'نص الزر'), F('link', 'الرابط (فارغ = واتساب)')] },
    nav: { t: 'list', title: 'روابط القائمة الرئيسية', path: 'nav', toggle: 'visible', req: 'label', name: 'label', label: x => x.label, sub: x => x.href, blank: () => ({ label: '', href: '#', visible: true, dropdown: '' }),
      fields: [F('label', 'اسم الرابط'), F('href', 'الوجهة (مثال: #services أو رابط كامل)'), F('dropdown', 'قائمة منسدلة', 'select', { opts: [['', 'بدون'], ['categories', 'تصنيفات الأعمال']] }), F('visible', 'ظاهر', 'bool')] },
    sections: { t: 'list', fixed: 1, title: 'أقسام الصفحة (الترتيب والإظهار والعناوين)', path: 'sections', toggle: 'visible', req: 'title', label: x => x.title, sub: x => x.id,
      fields: [F('title', 'عنوان القسم'), F('subtitle', 'الوصف تحت العنوان', 'textarea'), F('visible', 'ظاهر', 'bool')] },
    categories: { t: 'list', title: 'تصنيفات معرض الأعمال', path: 'categories', toggle: 'visible', req: 'name', name: 'name', label: x => x.name, sub: x => 'نسبة العرض ' + x.ratio, blank: () => ({ id: uid('c'), name: '', visible: true, ratio: '4/3', fit: 'cover' }),
      fields: [F('name', 'اسم التصنيف'), F('ratio', 'نسبة أبعاد الصور', 'select', { opts: ['1/1', '4/3', '16/10', '16/9', '3/4', '9/16'].map(x => [x, x]) }), F('fit', 'طريقة العرض', 'select', { opts: [['cover', 'ملء الإطار (قد يقص الأطراف)'], ['contain', 'عرض كامل بدون قص']] }), F('visible', 'ظاهر', 'bool')] },
    projects: { t: 'list', title: 'المشاريع', path: 'projects', toggle: 'visible', req: 'title', name: 'title', fkey: 'cat', img: 'image', label: x => (x.featured ? '★ ' : '') + x.title, sub: x => ((D.categories.find(c => c.id === x.cat) || {}).name || '—') + (x.client ? ' — ' + x.client : ''),
      blank: () => ({ id: uid('p'), cat: flt.projects || (D.categories[0] || {}).id, title: '', client: '', desc: '', image: '', gallery: [], video: '', link: '', featured: false, visible: true }),
      fields: [F('cat', 'التصنيف', 'select', { opts: catOpts }), F('title', 'اسم المشروع'), F('client', 'اسم العميل'), F('desc', 'وصف مختصر', 'textarea'), F('image', 'الصورة الرئيسية / الغلاف / الثمنيل', 'image'), F('gallery', 'صور إضافية', 'images'),
        F('video', 'فيديو: رابط يوتيوب/فيميو/ملف أو ارفع فيديو', 'media'), F('link', 'رابط خارجي (مشاهدة / زيارة المنصة / الصفحة)'), F('featured', 'مشروع مميز', 'bool'), F('visible', 'ظاهر', 'bool')] },
    services: { t: 'list', title: 'الخدمات', path: 'services', toggle: 'active', req: 'title', name: 'title', img: 'image', label: x => x.icon + ' ' + x.title, sub: x => +x.price > 0 ? x.price + ' ' + x.unit : 'حسب الطلب', blank: () => ({ id: uid('s'), icon: '✨', title: '', desc: '', price: 0, unit: '', image: '', btnText: 'اطلب الخدمة', link: '', active: true }),
      fields: [F('icon', 'أيقونة (إيموجي)'), F('title', 'اسم الخدمة'), F('desc', 'الوصف', 'textarea'), F('image', 'صورة (بديلة عن الأيقونة)', 'image'), F('price', 'السعر (0 = حسب الطلب)', 'number'), F('unit', 'وحدة السعر (مثال: شهريًا)'), F('btnText', 'نص الزر'), F('link', 'رابط الطلب (فارغ = واتساب)'), F('active', 'مفعّلة', 'bool')] },
    packages: { t: 'list', title: 'الباقات', path: 'packages', toggle: 'active', req: 'name', name: 'name', img: 'image', label: x => (x.popular ? '🔥 ' : '') + x.name, sub: x => x.price + ' ' + (x.period || ''), blank: () => ({ id: uid('k'), name: '', desc: '', price: 0, oldPrice: 0, period: 'شهريًا', features: [], image: '', btnText: 'اطلب الباقة', link: '', popular: false, active: true }),
      fields: [F('name', 'اسم الباقة'), F('desc', 'الوصف', 'textarea'), F('price', 'السعر الحالي', 'number'), F('oldPrice', 'السعر قبل الخصم (0 = بدون)', 'number'), F('period', 'الفترة (مثال: شهريًا)'), F('features', 'المميزات (كل ميزة في سطر)', 'lines'), F('image', 'صورة اختيارية', 'image'), F('btnText', 'نص زر الطلب'), F('link', 'رابط الطلب (فارغ = رسالة واتساب)'), F('popular', 'الأكثر طلبًا', 'bool'), F('active', 'مفعّلة', 'bool')] },
    builder: { t: 'list', title: 'خدمات أداة «خصص باقتك»', path: 'builder', toggle: 'active', req: 'name', name: 'name', label: x => x.name, sub: x => (+x.price > 0 ? x.price : 'يُتفق عليه') + ' / ' + x.unitLabel, blank: () => ({ id: uid('b'), name: '', desc: '', price: 0, unitLabel: 'تصميم', mode: 'qty', min: 1, max: 50, active: true }),
      fields: [F('name', 'اسم الخدمة'), F('desc', 'الوصف', 'textarea'), F('price', 'سعر الوحدة (0 = يُتفق عليه)', 'number'), F('unitLabel', 'وحدة التسعير (تصميم، ريل، ساعة، شهر، مجموعة 10 تصميمات…)'), F('mode', 'نوع الاختيار', 'select', { opts: [['qty', 'كمية قابلة للتغيير'], ['fixed', 'سعر ثابت (اختيار فقط)']] }), F('min', 'أقل كمية', 'number'), F('max', 'أكبر كمية', 'number'), F('active', 'مفعّلة', 'bool')] },
    offers: { t: 'list', title: 'العروض', path: 'offers', toggle: 'active', req: 'title', name: 'title', img: 'image', label: x => x.title, sub: x => ({ live: 'ساري', upcoming: 'لم يبدأ', expired: 'منتهٍ' })[Core.offerState(x)] + ' — ' + x.price,
      blank: () => ({ id: uid('o'), title: '', desc: '', image: '', oldPrice: 0, discount: 0, price: 0, start: '', end: '', packageIds: [], serviceIds: [], btnText: 'احصل على العرض', link: '', active: true, visible: true }),
      check: o => { const k = Core.offerCalc(o); if (k.err) return k.err; if (o.start && o.end && o.end < o.start) return 'تاريخ النهاية قبل تاريخ البداية'; o.price = k.price; o.discount = k.pct; },
      fields: [F('title', 'اسم العرض'), F('desc', 'الوصف', 'textarea'), F('image', 'صورة العرض', 'image'), F('oldPrice', 'السعر قبل الخصم', 'number'), F('discount', 'نسبة الخصم %', 'number'), F('price', 'السعر بعد الخصم (يُحسب تلقائيًا إذا حددت السعر الأصلي والنسبة)', 'number'),
        F('start', 'تاريخ البداية', 'date'), F('end', 'تاريخ النهاية (يُحتسب اليوم كاملًا)', 'date'), F('packageIds', 'الباقات المرتبطة', 'multi', { opts: () => D.packages.map(p => [p.id, p.name]) }), F('serviceIds', 'الخدمات المرتبطة', 'multi', { opts: () => D.services.map(p => [p.id, p.title]) }),
        F('btnText', 'نص الزر'), F('link', 'رابط الطلب (فارغ = واتساب)'), F('active', 'مفعّل', 'bool'), F('visible', 'ظاهر', 'bool')] },
    about: { t: 'obj', title: 'من نحن', path: 'about', fields: [F('title', 'العنوان'), F('text', 'نبذة', 'textarea'), F('vision', 'رؤيتنا', 'textarea'), F('mission', 'رسالتنا', 'textarea'), F('features', 'ما يميز خدماتنا (سطر لكل نقطة)', 'lines'), F('audience', 'الفئات التي نخدمها (سطر لكل فئة)', 'lines'), F('image', 'صورة', 'image'), F('ctaText', 'نص زر الدعوة'), F('ctaLink', 'رابطه (فارغ = واتساب)')] },
    testimonials: { t: 'list', title: 'آراء العملاء (فارغ حاليًا، أضف تقييمات حقيقية فقط)', path: 'testimonials', toggle: 'active', req: 'name', name: 'name', img: 'image', label: x => x.name, sub: x => x.service, blank: () => ({ name: '', service: '', text: '', image: '', proof: '', proofLink: '', active: true }),
      fields: [F('name', 'اسم العميل'), F('service', 'الخدمة'), F('text', 'نص التقييم', 'textarea'), F('image', 'صورة العميل (اختياري)', 'image'), F('proof', 'صورة إثبات (اختياري)', 'image'), F('proofLink', 'رابط الإثبات (اختياري)'), F('active', 'ظاهر', 'bool')] },
    faq: { t: 'list', title: 'الأسئلة الشائعة', path: 'faq', toggle: 'visible', req: 'q', name: 'q', label: x => x.q, sub: x => '', blank: () => ({ q: '', a: '', visible: true }), fields: [F('q', 'السؤال'), F('a', 'الإجابة', 'textarea'), F('visible', 'ظاهر', 'bool')] },
    contact: { t: 'obj', title: 'قسم التواصل', path: 'contact', fields: [F('title', 'العنوان'), F('text', 'النص', 'textarea'), F('email', 'البريد الإلكتروني (اختياري)'), F('formEnabled', 'إظهار نموذج التواصل (يرسل عبر واتساب)', 'bool')] },
    socials: { t: 'list', title: 'روابط السوشيال ميديا (تظهر فقط عند وجود رابط)', path: 'contact.socials', toggle: 'active', req: 'label', name: 'label', label: x => x.label, sub: x => x.url || 'بدون رابط', blank: () => ({ label: '', url: '', active: true }), fields: [F('label', 'الاسم'), F('url', 'الرابط'), F('active', 'ظاهر', 'bool')] },
    footer: { t: 'obj', title: 'الفوتر', path: 'footer', fields: [F('text', 'نص تعريفي', 'textarea'), F('copyright', 'حقوق النشر')] }
  };
  const TABS = [['إعدادات الموقع', ['settings']], ['الواجهة والقائمة', ['hero', 'navCta', 'nav', 'sections']], ['أعمالنا', ['categories', 'projects']], ['الخدمات', ['services']], ['الباقات', ['packages']], ['تخصيص الباقات', ['builder']], ['العروض', ['offers']], ['من نحن', ['about']], ['آراء العملاء', ['testimonials']], ['الأسئلة الشائعة', ['faq']], ['التواصل والفوتر', ['contact', 'socials', 'footer']]];

  /* ---------- حقول النماذج ---------- */
  function fld(f, obj) {
    const v = getp(obj, f.k), k = `data-k="${f.k}"`, L = `<label>${f.l}</label>`;
    const opts = typeof f.opts === 'function' ? f.opts() : f.opts;
    switch (f.t) {
      case 'bool': return `<label class="chk"><input type="checkbox" ${k} ${v ? 'checked' : ''}> ${f.l}</label>`;
      case 'textarea': return `<div class="fl">${L}<textarea ${k} rows="3">${esc(v)}</textarea></div>`;
      case 'lines': return `<div class="fl">${L}<textarea ${k} rows="5">${esc((v || []).join('\n'))}</textarea></div>`;
      case 'number': return `<div class="fl">${L}<input type="number" step="any" ${k} value="${esc(v == null ? 0 : v)}"></div>`;
      case 'date': return `<div class="fl">${L}<input type="date" ${k} value="${esc(v)}"></div>`;
      case 'color': return `<div class="fl">${L}<input type="color" ${k} value="${esc(v || '#000000')}"></div>`;
      case 'select': return `<div class="fl">${L}<select ${k}>${opts.map(o => `<option value="${esc(o[0])}" ${String(o[0]) === String(v) ? 'selected' : ''}>${esc(o[1])}</option>`).join('')}</select></div>`;
      case 'multi': return `<div class="fl">${L}<div class="multi">${opts.map(o => `<label class="chk"><input type="checkbox" ${k} value="${esc(o[0])}" ${(v || []).includes(o[0]) ? 'checked' : ''}> ${esc(o[1])}</label>`).join('') || '<small>لا توجد عناصر</small>'}</div></div>`;
      case 'images': return `<div class="fl">${L}<div class="media"><textarea ${k} rows="3" placeholder="رابط في كل سطر">${esc((v || []).join('\n'))}</textarea><label class="upl">رفع صور<input type="file" accept="image/*" multiple hidden data-up="add"></label></div></div>`;
      case 'image': case 'media': return `<div class="fl">${L}<div class="media"><input type="text" ${k} value="${esc(v)}" placeholder="رابط أو ارفع ملفًا">${v && f.t === 'image' ? `<img class="pv" src="${esc(v)}" alt="">` : ''}<label class="upl">رفع<input type="file" hidden accept="${f.t === 'image' ? 'image/*' : 'video/*,image/*'}" data-up="set"></label></div></div>`;
      default: return `<div class="fl">${L}<input type="text" ${k} value="${esc(v)}"></div>`;
    }
  }
  function read(root, fields, target) {
    fields.forEach(f => {
      const els = $$(`[data-k="${f.k}"]`, root); if (!els.length) return; const e = els[0]; let v;
      if (f.t === 'bool') v = e.checked; else if (f.t === 'number') v = e.value === '' ? 0 : +e.value;
      else if (f.t === 'lines' || f.t === 'images') v = e.value.split('\n').map(s => s.trim()).filter(Boolean);
      else if (f.t === 'multi') v = els.filter(x => x.checked).map(x => x.value); else v = e.value.trim();
      setp(target, f.k, v);
    });
  }
  async function commit(msg) { try { await Core.save(D); toast(msg || 'تم الحفظ'); return true; } catch (e) { toast(e.message, 1); return false; } }

  /* ---------- العرض ---------- */
  function render() {
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    $('#nav').innerHTML = TABS.map((t, i) => `<button class="${i === tab ? 'on' : ''}" data-t="${i}">${t[0]}</button>`).join('');
    $('#main').innerHTML = TABS[tab][1].map(blk).join('');
  }
  function blk(n) {
    const b = B[n];
    if (b.t === 'obj') return `<section class="blk" data-b="${n}"><h2>${b.title}</h2>${b.fields.map(f => fld(f, getp(D, b.path))).join('')}<div class="btns"><button class="btn" data-a="saveobj">حفظ</button><button class="btn ghost" data-a="cancel">إلغاء</button></div></section>`;
    const arr = getp(D, b.path) || []; let items = arr.map((x, i) => [x, i]);
    if (b.fkey && flt[n]) items = items.filter(([x]) => x[b.fkey] === flt[n]);
    const bar = `<div class="bar2">${b.fkey ? `<select data-a="filter"><option value="">كل التصنيفات</option>${catOpts().map(o => `<option value="${esc(o[0])}" ${flt[n] === o[0] ? 'selected' : ''}>${esc(o[1])}</option>`).join('')}</select>` : ''}
      ${b.fixed ? '' : '<button class="btn sm" data-a="add">+ إضافة</button>'}${n === 'projects' ? '<label class="btn ghost sm">رفع صور متعددة كمشاريع<input type="file" accept="image/*" multiple hidden data-up="bulk"></label>' : ''}</div>`;
    return `<section class="blk" data-b="${n}"><h2>${b.title} <small>(${items.length})</small></h2>${bar}${n === 'projects' ? '<p class="hint">الرفع المتعدد يُنشئ مشروعًا لكل صورة داخل التصنيف المحدد في القائمة (أو الأول إن لم تحدد).</p>' : ''}
      ${items.map(([x, i]) => `<div class="row ${b.toggle && x[b.toggle] === false || b.toggle && !x[b.toggle] ? 'off' : ''}" data-i="${i}">${b.img ? (x[b.img] ? `<img src="${esc(x[b.img])}" alt="">` : '<span class="ph"></span>') : ''}
      <div class="ri"><b>${esc(b.label(x))}</b><small>${esc(b.sub(x))}</small></div><div class="ctl"><button data-a="up" title="أعلى">▲</button><button data-a="down" title="أسفل">▼</button><button data-a="edit">تعديل</button>
      ${b.toggle ? `<button data-a="tog">${x[b.toggle] ? 'إخفاء/إيقاف' : 'إظهار/تفعيل'}</button>` : ''}${b.fixed ? '' : '<button data-a="dup">نسخ</button><button data-a="del">حذف</button>'}</div></div>`).join('') || '<p class="hint">لا توجد عناصر.</p>'}</section>`;
  }

  /* ---------- نافذة التعديل ---------- */
  function openForm(n, idx) {
    const b = B[n], arr = getp(D, b.path), isNew = idx == null, item = isNew ? b.blank() : JSON.parse(JSON.stringify(arr[idx])), md = $('#md');
    md.innerHTML = `<h2>${isNew ? 'إضافة' : 'تعديل'}: ${b.title}</h2><form id="mf">${b.fields.map(f => fld(f, item)).join('')}</form><div class="btns"><button class="btn" id="msave">حفظ</button><button class="btn ghost" id="mcancel">إلغاء</button></div>`;
    md.showModal();
    $('#mcancel').onclick = () => md.close();
    $('#msave').onclick = async () => {
      read(md, b.fields, item);
      if (!String(item[b.req] || '').trim()) return toast('الحقل الأساسي مطلوب: ' + b.fields.find(f => f.k === b.req).l, 1);
      const err = b.check && b.check(item); if (err) return toast(err, 1);
      if (isNew) arr.push(item); else arr[idx] = item;
      if (await commit()) { md.close(); render(); }
    };
  }

  /* ---------- الأحداث ---------- */
  $('#main').addEventListener('click', async e => {
    const a = e.target.closest('[data-a]'); if (!a || a.tagName === 'SELECT') return; const sec = a.closest('[data-b]'), n = sec.dataset.b, b = B[n], act = a.dataset.a;
    if (act === 'cancel') return render();
    if (act === 'saveobj') { read(sec, b.fields, getp(D, b.path)); if (await commit()) render(); return; }
    if (act === 'add') return openForm(n);
    const row = a.closest('.row'), i = +row.dataset.i, arr = getp(D, b.path);
    if (act === 'edit') return openForm(n, i);
    if (act === 'tog') { arr[i][b.toggle] = !arr[i][b.toggle]; }
    else if (act === 'dup') { const c = JSON.parse(JSON.stringify(arr[i])); if (c.id) c.id = uid(c.id[0]); if (b.name) c[b.name] += ' (نسخة)'; arr.splice(i + 1, 0, c); }
    else if (act === 'del') {
      if (n === 'categories' && D.projects.some(p => p.cat === arr[i].id)) return toast('انقل مشاريع هذا التصنيف أو احذفها أولًا', 1);
      if (!confirm('حذف هذا العنصر نهائيًا؟')) return; arr.splice(i, 1);
    } else if (act === 'up' || act === 'down') {
      const vis = $$('.row', sec).map(r => +r.dataset.i), p = vis.indexOf(i), j = vis[act === 'up' ? p - 1 : p + 1]; if (j == null) return;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    if (await commit()) render();
  });
  $('#main').addEventListener('change', async e => {
    const t = e.target;
    if (t.dataset.a === 'filter') { flt[t.closest('[data-b]').dataset.b] = t.value; return render(); }
    if (!t.dataset.up || !t.files.length) return;
    toast('جارٍ الرفع…');
    try {
      if (t.dataset.up === 'bulk') {
        const cat = flt.projects || (D.categories[0] || {}).id;
        for (const f of t.files) { const u = await Core.upload(f); D.projects.push({ id: uid('p'), cat, title: f.name.replace(/\.[^.]+$/, ''), client: '', desc: '', image: u, gallery: [], video: '', link: '', featured: false, visible: true }); }
        if (await commit('تمت إضافة ' + t.files.length + ' مشروع')) render();
      }
    } catch (er) { toast(er.message, 1); }
  });
  $('#md').addEventListener('change', async e => {
    const t = e.target; if (!t.dataset.up || !t.files.length) return; const box = t.closest('.media'), el = $('[data-k]', box); toast('جارٍ الرفع…');
    try {
      if (t.dataset.up === 'set') { el.value = await Core.upload(t.files[0]); }
      else { const urls = []; for (const f of t.files) urls.push(await Core.upload(f)); el.value = (el.value.trim() ? el.value.trim() + '\n' : '') + urls.join('\n'); }
      toast('تم الرفع، اضغط حفظ لتثبيته');
    } catch (er) { toast(er.message, 1); }
  });
  $('#nav').addEventListener('click', e => { const b = e.target.closest('[data-t]'); if (b) { tab = +b.dataset.t; render(); scrollTo(0, 0); } });
  $('#md').addEventListener('click', e => { if (e.target === $('#md')) $('#md').close(); });
  // رفع الملفات داخل نماذج الإعدادات (obj) أيضًا
  $('#main').addEventListener('change', async e => {
    const t = e.target; if (t.dataset.up !== 'set' && t.dataset.up !== 'add') return; if (!t.files.length) return; const box = t.closest('.media'), el = $('[data-k]', box); toast('جارٍ الرفع…');
    try { if (t.dataset.up === 'set') el.value = await Core.upload(t.files[0]); else { const u = []; for (const f of t.files) u.push(await Core.upload(f)); el.value = (el.value.trim() ? el.value.trim() + '\n' : '') + u.join('\n'); } toast('تم الرفع، اضغط حفظ لتثبيته'); } catch (er) { toast(er.message, 1); }
  });

  /* ---------- البدء ---------- */
  async function start() {
    $('#login').hidden = true; $('#shell').hidden = false; D = await Core.load();
    $('#mode').textContent = Core.remote ? 'Supabase — حفظ دائم' : 'نسخة محلية';
    $('#lo').hidden = !Core.remote; $('#lo').onclick = () => { Core.logout(); location.reload(); };
    const notes = [];
    if (!Core.remote) notes.push(['<b>النسخة المحلية:</b> التعديلات تُحفظ في هذا المتصفح فقط ولا يراها زوار الموقع. لنشر التعديلات للجميع فعّل Supabase (راجع README). <button class="btn sm ghost" id="rl">مسح التعديلات المحلية</button>', 1]);
    if (!D.settings.whatsapp) notes.push(['رقم واتساب غير مضبوط، أضفه من «إعدادات الموقع» وإلا لن تصل الطلبات إليك.', 1]);
    if (D.meta && D.meta.demo) notes.push(['البيانات الحالية (الأسعار والباقات والعروض والمشاريع) <b>تجريبية</b>، استبدلها قبل النشر. <button class="btn sm ghost" id="dm">تم استبدالها</button>']);
    $('#notes').innerHTML = notes.map(n => `<div class="note ${n[1] ? 'bad' : ''}">${n[0]}</div>`).join('');
    if ($('#rl')) $('#rl').onclick = () => { if (confirm('مسح كل التعديلات المحلية؟')) { Core.resetLocal(); location.reload(); } };
    if ($('#dm')) $('#dm').onclick = async () => { D.meta = { demo: false }; if (await commit()) $('#dm').closest('.note').remove(); };
    render();
  }
  if (Core.remote && !Core.loggedIn()) {
    $('#login').hidden = false;
    $('#lf').onsubmit = async e => { e.preventDefault(); $('#lerr').textContent = ''; try { await Core.login($('#le').value.trim(), $('#lp').value); start(); } catch (er) { $('#lerr').textContent = er.message; } };
  } else start();
})();
