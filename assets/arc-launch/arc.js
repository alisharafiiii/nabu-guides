(() => {
  'use strict';
  const key = 'nabu.arc-launch.plan.v1';
  const fields = Array.from(document.querySelectorAll('[data-save]'));
  const fa = new Intl.NumberFormat('fa-IR');
  const storageNote = document.getElementById('storage-note');
  let canSave = true;
  function storageFailure() {
    canSave = false;
    storageNote.textContent = 'ذخیره روی این مرورگر در دسترس نیست؛ قبل از بستن صفحه، فایل فهرستت رو بگیر.';
  }
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      fields.forEach(field => {
        const value = saved[field.id];
        if (field.type === 'checkbox') field.checked = value === true;
        else if (typeof value === 'string') {
          const trimmed = value.slice(0, field.maxLength > 0 ? field.maxLength : 500);
          if (field.tagName !== 'SELECT' || Array.from(field.options).some(o => o.value === trimmed)) field.value = trimmed;
        }
      });
    }
    localStorage.setItem(key, JSON.stringify(Object.fromEntries(fields.map(f => [f.id, f.type === 'checkbox' ? f.checked : f.value]))));
  } catch { storageFailure(); }
  function updateProgress() {
    const checks = fields.filter(f => f.type === 'checkbox');
    const count = checks.filter(f => f.checked).length;
    document.getElementById('check-count').textContent = `${fa.format(count)} از ${fa.format(checks.length)} انجام شده`;
    document.getElementById('check-progress').value = count;
  }
  function save() {
    if (canSave) {
      try { localStorage.setItem(key, JSON.stringify(Object.fromEntries(fields.map(f => [f.id, f.type === 'checkbox' ? f.checked : f.value])))); }
      catch { storageFailure(); }
    }
    updateProgress();
  }
  fields.forEach(f => f.addEventListener(f.tagName === 'SELECT' || f.type === 'checkbox' ? 'change' : 'input', save));
  document.querySelector('.check-progress').hidden = false;
  updateProgress();
  const dayButtons = Array.from(document.querySelectorAll('[data-day]'));
  function setDay(day) {
    dayButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.day === day)));
    document.querySelectorAll('[data-day-panel]').forEach(p => { p.hidden = p.dataset.dayPanel !== day; });
  }
  document.querySelector('.day-switch').hidden = false;
  dayButtons.forEach(b => b.addEventListener('click', () => setDay(b.dataset.day)));
  setDay('0');
  const read = id => document.getElementById(id).value.trim() || '—';
  function planText() {
    const lines = ['فهرست من برای Arc', `هدف من: ${read('watch-goal')}`, ''];
    for (let i = 1; i <= 3; i++) {
      lines.push(`${fa.format(i)}. ${read(`watch-${i}-name`)}`, `دسته: ${read(`watch-${i}-category`)}`, `لینک: ${read(`watch-${i}-url`)}`, `وضعیت: ${read(`watch-${i}-status`)}`, `دلیل و قدم بعدی: ${read(`watch-${i}-note`)}`, '');
    }
    lines.push('چک‌لیست من:');
    document.querySelectorAll('.check-items input').forEach(c => lines.push(`${c.checked ? '[x]' : '[ ]'} ${c.nextElementSibling.textContent}`));
    lines.push('', 'برنامه: روز اول وضعیت ابزارها؛ روز دوم ادامهٔ فعالیت؛ روز سوم جمع‌بندی و اصلاح فهرست.', 'راهنما: Nabu Guides · نسخهٔ ۱۳ سپتامبر ۲۰۲۶');
    return lines.join('\n');
  }
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      const area = document.createElement('textarea');
      area.value = text; area.style.cssText = 'position:fixed;inset:0 auto auto -9999px';
      document.body.append(area); area.select();
      let success = false;
      try { success = document.execCommand('copy'); } catch { /* Show a manual-copy message below. */ }
      area.remove(); return success;
    }
  }
  const status = document.getElementById('watch-status');
  document.getElementById('copy-plan').addEventListener('click', async () => {
    status.textContent = await copyText(planText()) ? 'فهرست و چک‌لیستت کپی شد.' : 'کپی خودکار انجام نشد؛ از دکمهٔ گرفتن فایل استفاده کن.';
  });
  document.getElementById('download-plan').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob(['\uFEFF' + planText()], {type:'text/plain;charset=utf-8'}));
    const link = document.createElement('a'); link.href = url; link.download = 'my-arc-watchlist-fa.txt';
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = 'فایل فهرستت برای دانلود آماده شد.';
  });
  document.querySelectorAll('.js-actions').forEach(el => { el.hidden = false; });
  document.querySelectorAll('.promptbox .copy').forEach(b => b.addEventListener('click', async () => {
    const box = b.closest('.promptbox');
    box.querySelector('.copy-status').textContent = await copyText(box.querySelector('pre').innerText) ? 'پیام کپی شد؛ اسم‌ها و لینک‌های خودت رو جاش بذار.' : 'کپی خودکار انجام نشد؛ متن پیام رو انتخاب و کپی کن.';
  }));
  const progress = document.querySelector('.progress');
  function onScroll() {
    const total = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${total > 0 ? Math.min(1, scrollY / total) : 0})`;
  }
  addEventListener('scroll', onScroll, {passive:true}); addEventListener('resize', onScroll); onScroll();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.find(e => e.isIntersecting);
      if (visible) document.querySelectorAll('.toc a').forEach(a => a.classList.toggle('active', a.hash === '#' + visible.target.id));
    }, {rootMargin:'-10% 0px -70% 0px'});
    document.querySelectorAll('article>section').forEach(s => observer.observe(s));
  }
  document.getElementById('watch-editor').hidden = false;
})();
