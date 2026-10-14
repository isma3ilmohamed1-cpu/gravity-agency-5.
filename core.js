/* منطق مشترك بين الموقع ولوحة الإدارة: التحميل والحفظ والرفع والتسجيل وحسابات العروض */
(function () {
  const C = window.GRAVITY_CONFIG || {};
  const remote = !!(C.SUPABASE_URL && C.SUPABASE_ANON_KEY);
  const LS = 'gravity_content_v1', SS = 'gravity_session_v1';
  const clone = o => JSON.parse(JSON.stringify(o));
  const H = (x = {}) => Object.assign({ apikey: C.SUPABASE_ANON_KEY, 'Content-Type': 'application/json' }, x);
  let session = null;
  try { session = JSON.parse(localStorage.getItem(SS)); } catch (e) {}

  async function load() {
    let d = null;
    if (remote) {
      try {
        const r = await fetch(C.SUPABASE_URL + '/rest/v1/site_data?key=eq.content&select=value', { headers: H() });
        const j = await r.json(); if (Array.isArray(j) && j[0]) d = j[0].value;
      } catch (e) { console.warn('تعذر تحميل البيانات من Supabase', e); }
    } else {
      try { d = JSON.parse(localStorage.getItem(LS)); } catch (e) {}
    }
    return Object.assign(clone(window.DEFAULT_DATA), d || {});
  }
  function setSession(j) {
    session = { access_token: j.access_token, refresh_token: j.refresh_token, expires_at: Date.now() + (j.expires_in - 60) * 1000, email: (j.user && j.user.email) || (session && session.email) };
    localStorage.setItem(SS, JSON.stringify(session));
  }
  async function login(email, password) {
    const r = await fetch(C.SUPABASE_URL + '/auth/v1/token?grant_type=password', { method: 'POST', headers: H(), body: JSON.stringify({ email, password }) });
    const j = await r.json();
    if (!r.ok) throw new Error('بيانات الدخول غير صحيحة');
    setSession(j);
  }
  function logout() { session = null; localStorage.removeItem(SS); }
  async function token() {
    if (!session) return null;
    if (Date.now() > session.expires_at) {
      const r = await fetch(C.SUPABASE_URL + '/auth/v1/token?grant_type=refresh_token', { method: 'POST', headers: H(), body: JSON.stringify({ refresh_token: session.refresh_token }) });
      if (!r.ok) { logout(); return null; }
      setSession(await r.json());
    }
    return session.access_token;
  }
  async function save(data) {
    if (!remote) { localStorage.setItem(LS, JSON.stringify(data)); return; }
    const t = await token(); if (!t) throw new Error('انتهت الجلسة، سجّل الدخول مجددًا');
    const r = await fetch(C.SUPABASE_URL + '/rest/v1/site_data', {
      method: 'POST', headers: H({ Authorization: 'Bearer ' + t, Prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify({ key: 'content', value: data })
    });
    if (!r.ok) throw new Error('تعذر الحفظ (تأكد أن بريدك مُضاف في admin_emails): ' + (await r.text()).slice(0, 120));
  }
  function toDataURL(file) {
    return new Promise((res, rej) => {
      if (!file.type.startsWith('image/')) return rej(new Error('في النسخة المحلية يمكن رفع الصور فقط. للفيديو استخدم رابطًا (YouTube أو غيره).'));
      const fr = new FileReader();
      fr.onload = () => {
        const img = new Image();
        img.onload = () => {
          const s = Math.min(1, 900 / Math.max(img.width, img.height)), c = document.createElement('canvas');
          c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          res(c.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', .82));
        };
        img.onerror = () => rej(new Error('ملف الصورة غير صالح')); img.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  }
  async function upload(file) {
    if (!remote) return toDataURL(file);
    const t = await token(); if (!t) throw new Error('انتهت الجلسة، سجّل الدخول مجددًا');
    const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
    const name = Date.now() + '-' + Math.random().toString(36).slice(2, 7) + '.' + ext;
    const r = await fetch(C.SUPABASE_URL + '/storage/v1/object/media/' + name, {
      method: 'POST', headers: { apikey: C.SUPABASE_ANON_KEY, Authorization: 'Bearer ' + t, 'Content-Type': file.type || 'application/octet-stream' }, body: file
    });
    if (!r.ok) throw new Error('فشل رفع الملف (راجع bucket باسم media وسياساته)');
    return C.SUPABASE_URL + '/storage/v1/object/public/media/' + name;
  }
  // حساب العرض: السعر الأصلي + النسبة => السعر النهائي. وإلا تُشتق النسبة من السعرين.
  function offerCalc(o) {
    const old = +o.oldPrice || 0, pct = +o.discount || 0; let price = +o.price || 0, d = 0, err = '';
    if (pct < 0 || pct > 100) err = 'نسبة الخصم يجب أن تكون بين 0 و100';
    if (old > 0 && pct > 0) { price = Math.round(old * (1 - pct / 100) * 100) / 100; d = pct; }
    else if (old > 0 && price > 0) { if (price >= old) err = 'السعر بعد الخصم يجب أن يكون أقل من السعر الأصلي'; else d = Math.round((1 - price / old) * 100); }
    return { old, price, pct: d, err };
  }
  function offerState(o) {
    const now = new Date(), s = o.start ? new Date(o.start + 'T00:00:00') : null, e = o.end ? new Date(o.end + 'T23:59:59') : null;
    if (s && now < s) return 'upcoming'; if (e && now > e) return 'expired'; return 'live';
  }
  window.Core = { remote, load, save, upload, login, logout, offerCalc, offerState, clone,
    loggedIn: () => !!session, email: () => session && session.email,
    resetLocal: () => localStorage.removeItem(LS) };
})();
