document.querySelectorAll('.copy').forEach(button => {
  button.addEventListener('click', async () => {
    const box = button.closest('.codebox');
    const code = box.querySelector('pre code');
    const status = box.querySelector('.copy-status');
    try {
      await navigator.clipboard.writeText(code.textContent);
      button.textContent = 'کپی شد';
      status.textContent = 'پیام کپی شد؛ موضوع و زمانش رو برای خودت تنظیم کن.';
    } catch {
      const range = document.createRange(); range.selectNodeContents(code);
      const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
      button.textContent = 'متن انتخاب شد';
      status.textContent = 'متن انتخاب شده است؛ با فرمان کپی دستگاهت آن را بردار.';
    }
    setTimeout(() => { button.textContent = 'کپی پیام'; }, 3000);
  });
});
const modes = {
  before: ['چرا مهمه؟', 'این یک قابلیت جدید و کاربردیه که می‌تونه بهره‌وری رو بالا ببره.'],
  after: ['کجای کارم به درد می‌خوره؟', 'برای ویدیوهای آموزشی‌ام که وسط ضبط مکث می‌کنم، می‌تونم روی یک کلیپ کوتاه امتحانش کنم و ببینم حذف مکث‌ها، جمله‌هام رو ناقص نکرده باشه.']
};
document.querySelectorAll('[data-mode]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-mode]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const [label, text] = modes[button.dataset.mode];
    document.getElementById('why-label').textContent = label;
    document.getElementById('why-text').textContent = text;
  });
});
function updateProgress() {
  const total = document.documentElement.scrollHeight - innerHeight;
  document.querySelector('.progress').style.transform = `scaleX(${total > 0 ? Math.min(1, scrollY / total) : 0})`;
}
addEventListener('scroll', updateProgress, {passive:true});
addEventListener('resize', updateProgress); updateProgress();
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) document.querySelectorAll('.toc a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
    });
  }, {rootMargin:'-12% 0px -65% 0px'});
  document.querySelectorAll('article section[id]').forEach(section => observer.observe(section));
}

(() => {
  const calculator = document.getElementById('news-cost-calculator');
  if (!calculator) return;
  const fields = [
    document.getElementById('news-active-days'),
    document.getElementById('news-posts-per-run'),
    document.getElementById('news-post-rate')
  ];
  const cost = document.getElementById('news-monthly-cost');
  const runs = document.getElementById('news-monthly-runs');
  const posts = document.getElementById('news-monthly-posts');
  const formula = document.getElementById('news-cost-formula');
  const error = document.getElementById('calculator-error');
  const countFormat = new Intl.NumberFormat('fa-IR', {maximumFractionDigits: 0});
  const moneyFormat = new Intl.NumberFormat('fa-IR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  const rateFormat = new Intl.NumberFormat('fa-IR', {maximumFractionDigits: 3});
  function updateEstimate() {
    const selected = calculator.querySelector('input[name="news-frequency"]:checked');
    const perDay = selected ? Number(selected.value) : NaN;
    const values = fields.map(field => field.valueAsNumber);
    const validFields = fields.map((field, index) => {
      const valid = field.validity.valid && Number.isFinite(values[index]);
      field.setAttribute('aria-invalid', String(!valid));
      return valid;
    });
    const valid = validFields.every(Boolean) && [1, 2, 11, 24].includes(perDay);
    error.hidden = valid;
    if (!valid) {
      error.textContent = 'عددها رو کامل و در بازهٔ نوشته‌شده وارد کن؛ روزها و تعداد پست باید عدد صحیح باشن.';
      [cost, runs, posts].forEach(output => { output.textContent = '—'; });
      formula.textContent = 'بعد از اصلاح عددها، برآورد دوباره نمایش داده می‌شه.';
      return;
    }
    error.textContent = '';
    const [days, postsPerRun, rate] = values;
    const monthlyRuns = perDay * days;
    const monthlyPosts = monthlyRuns * postsPerRun;
    cost.textContent = moneyFormat.format(monthlyPosts * rate);
    runs.textContent = countFormat.format(monthlyRuns);
    posts.textContent = countFormat.format(monthlyPosts);
    formula.textContent = `${countFormat.format(perDay)} اجرا در روز × ${countFormat.format(days)} روز × ${countFormat.format(postsPerRun)} پست × ${rateFormat.format(rate)} دلار`;
  }
  calculator.addEventListener('input', updateEstimate);
  updateEstimate();
  calculator.hidden = false;
  const fallback = document.getElementById('news-cost-table-fallback');
  if (fallback) fallback.hidden = true;
})();
