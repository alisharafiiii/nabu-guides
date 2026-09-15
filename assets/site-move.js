(() => {
  'use strict';
  const oldHost = 'alisharafiiii.github.io';
  const oldPath = '/nabu-guides/';
  if (location.hostname !== oldHost) return;
  if (location.pathname !== '/nabu-guides' && !location.pathname.startsWith(oldPath)) return;

  let path = location.pathname === '/nabu-guides' ? '' : location.pathname.slice(oldPath.length);
  if (path === 'index.html') path = '';
  const destination = 'https://www.nabulines.com/nabuguides/' + path + location.search + location.hash;

  // Keep an existing watchlist accessible on the origin where the reader saved it.
  if (path === 'articles/arc-launch-fa.html') {
    let savedPlan = false;
    try { savedPlan = Boolean(localStorage.getItem('nabu.arc-launch.plan.v1')); } catch { /* Storage is optional. */ }
    if (savedPlan) {
      document.addEventListener('DOMContentLoaded', () => {
        const note = document.createElement('aside');
        note.setAttribute('role', 'note');
        note.setAttribute('dir', 'rtl');
        note.style.cssText = 'max-width:1100px;margin:18px auto;padding:16px 22px;border:1px solid #c7d8cd;border-radius:16px;background:#fffbed;color:#173b2b;font:inherit;line-height:1.9';
        note.append('این راهنما به آدرس جدید رفته. فهرست قبلی‌ات هنوز همین‌جاست؛ قبل از رفتن، از بخش واچ‌لیست دانلودش کن. ');
        const saved = document.createElement('a');
        saved.href = '#watchlist';
        saved.textContent = 'رفتن به فهرست قبلی';
        const moved = document.createElement('a');
        moved.href = destination;
        moved.textContent = 'بازکردن آدرس جدید';
        note.append(saved, ' · ', moved);
        document.body.prepend(note);
      }, { once: true });
      return;
    }
  }

  location.replace(destination);
})();
