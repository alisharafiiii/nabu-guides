(() => {
  'use strict';
  const map = document.querySelector('.map-explorer');
  if (map) {
    const tools = {
      wallet: {
        title: 'کیف پول؛ ابزار کار با حسابت',
        intro: 'دارایی‌هات رو می‌بینی و کارهایی مثل انتقال یا مینت رو باهاش تأیید می‌کنی.',
        when: 'وقتی می‌خوای وارد یک برنامه بشی یا تراکنشی انجام بدی.',
        example: 'یک سایت ازت می‌خواد کیف پول رو وصل کنی. وصل‌شدن فقط قدم اوله؛ متن هر درخواست تأیید رو هم جدا می‌خونی.',
        link: 'https://ethereum.org/wallets/', label: 'راهنمای رسمی شناخت کیف پول'
      },
      bridge: {
        title: 'بریج؛ راه رسیدن از یک شبکه به شبکهٔ دیگه',
        intro: 'کمک می‌کنه دارایی رو بین شبکه‌های پشتیبانی‌شده منتقل کنی.',
        when: 'USDC روی یک شبکهٔ دیگه داری و می‌خوای روی آرک ازش استفاده کنی.',
        example: 'قبل از انتقال، مبدأ، مقصد، مبلغ دریافتی و هزینه رو می‌خونی. برای آرک باید مسیر رسمی مین‌نت فعال شده باشه.',
        link: 'https://developers.circle.com/cctp/concepts/supported-chains-and-domains', label: 'شبکه‌های پشتیبانی‌شدهٔ CCTP در مستندات Circle'
      },
      launchpad: {
        title: 'لانچ‌پد؛ جایی برای دیدن عرضه‌های تازه',
        intro: 'پروژه‌ها ممکنه توکن یا کالکشنشون رو از طریق یک لانچ‌پد عرضه کنن.',
        when: 'دنبال زمان عرضه، شرایط شرکت‌کردن یا قیمت اولیهٔ یک پروژه‌ای.',
        example: 'اسم یک کالکشن رو شنیدی؟ صفحهٔ عرضه رو پیدا می‌کنی و می‌بینی مینت چه زمانی و برای چه کسانی باز می‌شه.',
        link: 'https://www.arc.io/ecosystem', label: 'برای پیدا کردن ابزارها، فهرست رسمی اکوسیستم Arc رو ببین'
      },
      nft: {
        title: 'بازار NFT؛ ویترین و پیشنهادهای خرید',
        intro: 'آیتم‌ها، قیمت‌های فروش و پیشنهادهای خرید رو کنار هم می‌بینی.',
        when: 'می‌خوای یک کالکشن رو بررسی کنی یا بفهمی خریدوفروشش چه وضعی داره.',
        example: 'یکی آیتمش رو ۳۰ دلار قیمت گذاشته؛ این با اینکه خریداری حاضر باشه ۳۰ دلار بده فرق داره. پیشنهادها و معامله‌ها رو هم ببین.',
        link: 'https://www.arc.io/ecosystem', label: 'ابزارهای اکوسیستم رو از فهرست رسمی Arc پیدا کن'
      },
      explorer: {
        title: 'اکسپلورر؛ ببین روی شبکه چی ثبت شده',
        intro: 'با شناسهٔ تراکنش می‌تونی جزئیات و وضعیت ثبت‌شدهٔ اون رو پیدا کنی.',
        when: 'تراکنشی فرستادی و می‌خوای وضعیت یا آدرس مقصدش رو بررسی کنی.',
        example: 'یک انتقال منتظر مونده؟ شناسه‌اش رو روی اکسپلورر همون شبکه بررسی می‌کنی. اکسپلورر تست‌نت برای تراکنش واقعی مین‌نت نیست.',
        link: 'https://testnet.arcscan.app/', label: 'اکسپلورر تست‌نت Arc؛ محیط تمرین'
      }
    };
    const buttons = Array.from(document.querySelectorAll('[data-map]'));
    const panel = document.getElementById('map-detail');
    buttons.forEach(button => button.addEventListener('click', () => {
      const item = tools[button.dataset.map];
      if (!item) return;
      buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.map === button.dataset.map)));
      document.getElementById('map-detail-title').textContent = item.title;
      document.getElementById('map-detail-intro').textContent = item.intro;
      document.getElementById('map-detail-when').textContent = item.when;
      document.getElementById('map-detail-example').textContent = item.example;
      const link = document.getElementById('map-detail-link');
      link.href = item.link; link.textContent = item.label;
      document.getElementById('map-detail-content').hidden = false;
      document.getElementById('map-status').textContent = item.title + '. ' + item.when;
      if (button.classList.contains('map-pin')) {
        panel.focus({preventScroll: true});
        panel.scrollIntoView({block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
      }
    }));
    document.getElementById('map-instruction').hidden = false;
    document.querySelector('.map-hotspots').hidden = false;
    map.hidden = false;
  }

  const quiz = document.getElementById('mint-quiz');
  if (quiz) {
    const questions = [
      {
        text: 'آدرست توی لیسته، اما پروژه گفته فقط تا وقتی موجودی این مرحله باقی مونده می‌تونی مینت کنی. سهمیه‌ای برات کنار نذاشته. کدوم دره؟',
        answer: 'fcfs',
        explanation: 'این FCFSه: واجد شرایطی، ولی سهمیه رزرو نشده. اگر موجودی مرحله تموم بشه، بودن اسمت توی لیست کافی نیست.'
      },
      {
        text: 'پروژه یک آیتم برای آدرس تو کنار گذاشته، به شرطی که توی بازهٔ اعلام‌شده مینت کنی. این کدوم مرحله‌ست؟',
        answer: 'gtd',
        explanation: 'این GTDه: سهمیه برای یک بازهٔ مشخص کنار گذاشته شده. تضمین مربوط به همون سهمیه است؛ دربارهٔ سود یا قیمت بعدی چیزی نمی‌گه.'
      },
      {
        text: 'از ساعت مشخص، همه می‌تونن طبق محدودیت هر کیف پول وارد بشن و لازم نیست از قبل توی لیست باشن. کدوم در باز شده؟',
        answer: 'public',
        explanation: 'این Publicه: ورود عمومیه، ولی عرضه، زمان و محدودیت هر کیف پول هنوز پابرجاست. ورود عمومی سهمیهٔ قطعی نمی‌ده.'
      }
    ];
    const fa = new Intl.NumberFormat('fa-IR');
    const gates = Array.from(quiz.querySelectorAll('[data-mint-answer]'));
    const question = document.getElementById('quiz-question');
    const feedback = document.getElementById('quiz-feedback');
    const next = document.getElementById('quiz-next');
    const play = document.getElementById('quiz-play');
    const result = document.getElementById('quiz-result');
    let index = 0;
    let score = 0;
    let answered = false;
    function showQuestion(focus) {
      answered = false;
      play.hidden = false; result.hidden = true;
      document.getElementById('quiz-progress').textContent = `سؤال ${fa.format(index + 1)} از ${fa.format(questions.length)}`;
      question.textContent = questions[index].text;
      feedback.textContent = ''; feedback.hidden = true;
      next.hidden = true;
      gates.forEach(gate => {
        gate.disabled = false;
        gate.setAttribute('aria-pressed', 'false');
        gate.classList.remove('is-correct', 'is-incorrect');
        gate.querySelector('.gate-response').textContent = 'انتخاب این در';
      });
      if (focus) {
        question.focus({preventScroll: true});
        question.scrollIntoView({block: 'start', behavior: 'instant'});
      }
    }
    gates.forEach(gate => gate.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      const current = questions[index];
      const correct = gate.dataset.mintAnswer === current.answer;
      if (correct) score += 1;
      gates.forEach(button => {
        const isAnswer = button.dataset.mintAnswer === current.answer;
        const selected = button === gate;
        button.disabled = true;
        button.setAttribute('aria-pressed', String(selected));
        button.classList.toggle('is-correct', isAnswer);
        button.classList.toggle('is-incorrect', selected && !isAnswer);
        button.querySelector('.gate-response').textContent = isAnswer ? '✓ جواب درست' : selected ? 'انتخاب تو' : '—';
      });
      feedback.textContent = (correct ? 'درست گرفتی! ' : 'بیا این فرق رو ببینیم: ') + current.explanation;
      feedback.hidden = false;
      next.textContent = index < questions.length - 1 ? 'بریم سؤال بعد ←' : 'نتیجه‌م رو ببین ←';
      next.hidden = false;
      next.focus({preventScroll: true});
      feedback.scrollIntoView({block: 'nearest', behavior: 'instant'});
    }));
    next.addEventListener('click', () => {
      if (!answered) return;
      if (index < questions.length - 1) { index += 1; showQuestion(true); }
      else {
        play.hidden = true; result.hidden = false;
        document.getElementById('quiz-score').textContent = `${fa.format(score)} از ${fa.format(questions.length)} جواب رو بار اول درست انتخاب کردی.`;
        document.getElementById('quiz-result-title').focus({preventScroll: true});
        result.scrollIntoView({block: 'start', behavior: 'instant'});
      }
    });
    document.getElementById('quiz-restart').addEventListener('click', () => { index = 0; score = 0; showQuestion(true); });
    showQuestion(false);
    quiz.hidden = false;
  }
})();
