// 빈칸 작성 모드: 주소 뒤에 ?edit
if (new URLSearchParams(location.search).has('edit')) document.body.classList.add('edit');

// 목차 현재 위치 표시
const links = [...document.querySelectorAll('.toc a')];
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-30% 0px -60% 0px' });
document.querySelectorAll('main section').forEach(s => io.observe(s));

// 상세 창 탭
const selectTab = (dlg, i) => {
  dlg.querySelectorAll('[role=tab]').forEach((t, n) => {
    t.setAttribute('aria-selected', n === i);
    t.tabIndex = n === i ? 0 : -1;
  });
  dlg.querySelectorAll('.panel').forEach((p, n) => { p.hidden = n !== i; });
  dlg.querySelector('.panels').scrollTop = 0;
};

// 상세 창 열기: #logmile, #jeyun/2(세 번째 탭) 같은 주소로 바로 열 수 있음
const openFromHash = () => {
  const [id, tab] = location.hash.slice(1).split('/');
  const target = id && document.getElementById(id);
  document.querySelectorAll('dialog[open]').forEach(d => { if (d !== target) d.close(); });
  if (target && target.tagName === 'DIALOG') {
    selectTab(target, Number(tab) || 0);
    if (!target.open) target.showModal();
    document.documentElement.style.overflow = 'hidden';
  }
};
addEventListener('hashchange', openFromHash);

document.querySelectorAll('dialog').forEach(dlg => {
  const tabs = [...dlg.querySelectorAll('[role=tab]')];
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => selectTab(dlg, i));
    t.addEventListener('keydown', e => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!step) return;
      const n = (i + step + tabs.length) % tabs.length;
      selectTab(dlg, n);
      tabs[n].focus();
    });
  });
  dlg.querySelector('.close').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => {
    if (document.querySelector('dialog[open]')) return;
    document.documentElement.style.overflow = '';
    if (location.hash.slice(1).split('/')[0] === dlg.id) history.replaceState(null, '', location.pathname + location.search);
  });
});

// 화면 갤러리
document.querySelectorAll('.gallery').forEach(g => {
  const main = g.querySelector('figure img');
  const thumbs = [...g.querySelectorAll('.thumbs button')];
  thumbs.forEach(b => b.addEventListener('click', () => {
    main.src = b.dataset.src;
    main.alt = b.dataset.cap;
    thumbs.forEach(x => x.toggleAttribute('aria-current', x === b));
  }));
});

document.querySelector('.print').addEventListener('click', () => print());
openFromHash();
