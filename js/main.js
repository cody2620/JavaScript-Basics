/**
 * main.js — 모든 페이지가 공유하는 공통 스크립트
 *
 * 역할
 *  1. 단원 목록(CHAPTERS)을 한 곳에서 관리
 *  2. 상단 헤더(로고, 메뉴, 테마 토글) 렌더링
 *  3. 좌측 사이드바 목차 렌더링 + 현재 페이지 하이라이트
 *  4. 이전/다음 단원 버튼 렌더링
 *  5. 다크/라이트 테마 전환 및 localStorage 저장
 *  6. 모바일에서 사이드바 드로어 열기/닫기
 *
 * 각 HTML 페이지는 <body>에 두 가지 data 속성을 가집니다.
 *  - data-page : 현재 페이지 id (index.html은 "home", 단원은 CHAPTERS의 id)
 *  - data-root : 사이트 루트까지의 상대 경로 (index.html은 "./", pages/*.html은 "../")
 *
 * 브라우저에서 파일을 직접 열어도(file://) 동작하도록 fetch 없이
 * JS로 DOM을 직접 만들어 넣는 방식을 사용합니다.
 */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
   * 1. 단원 목록 — 단원을 추가/수정할 때는 이 배열만 고치면 됩니다.
   *    순서가 곧 학습 순서이며, 이전/다음 버튼도 이 순서를 따릅니다.
   * ------------------------------------------------------------------ */
  var CHAPTERS = [
    { id: '01-intro',        title: '자바스크립트 소개',  desc: '자바스크립트가 무엇이고, 어디서 어떻게 실행하는지 알아봅니다.' },
    { id: '02-variables',    title: '변수와 상수',        desc: 'let과 const로 값을 저장하고 이름 붙이는 법을 배웁니다.' },
    { id: '03-types',        title: '자료형',             desc: '문자열, 숫자, 불리언, null, undefined 등 값의 종류를 살펴봅니다.' },
    { id: '04-operators',    title: '연산자',             desc: '산술, 비교, 논리 연산자로 값을 계산하고 비교합니다.' },
    { id: '05-conditionals', title: '조건문',             desc: 'if, else, switch로 상황에 따라 다른 코드를 실행합니다.' },
    { id: '06-loops',        title: '반복문',             desc: 'for, while로 같은 작업을 여러 번 반복합니다.' },
    { id: '07-functions',    title: '함수',               desc: '코드를 묶어 재사용하는 함수와 화살표 함수를 배웁니다.' },
    { id: '08-arrays',       title: '배열',               desc: '여러 값을 순서대로 담는 배열과 주요 메서드를 다룹니다.' },
    { id: '09-objects',      title: '객체',               desc: '이름(키)과 값의 쌍으로 데이터를 표현하는 객체를 배웁니다.' },
    { id: '10-dom',          title: 'DOM 조작 기초',      desc: '자바스크립트로 HTML 요소를 찾고 바꾸는 법을 익힙니다.' },
    { id: '11-events',       title: '이벤트',             desc: '클릭, 입력 같은 사용자 동작에 반응하는 코드를 작성합니다.' }
  ];

  // localStorage에 테마를 저장할 때 쓰는 키 (<head>의 인라인 스크립트와 같아야 함)
  var THEME_KEY = 'jsb-theme';

  // 현재 페이지 정보
  var body = document.body;
  var currentPage = body.dataset.page || 'home';
  var root = body.dataset.root || './';

  /** 단원 id로 해당 HTML 파일의 경로를 만듭니다. */
  function chapterHref(id) {
    return root + 'pages/' + id + '.html';
  }

  /** 두 자리 번호 문자열을 만듭니다. (0 → "01") */
  function chapterNumber(index) {
    return String(index + 1).padStart(2, '0');
  }

  /** 짧은 HTML 문자열을 DOM 요소로 바꿉니다. */
  function createElement(html) {
    var template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
  }

  /* ------------------------------------------------------------------
   * 2. 테마 (다크/라이트)
   *    실제 초기 적용은 깜빡임을 막기 위해 <head>의 인라인 스크립트가 먼저 합니다.
   *    여기서는 버튼 클릭 시 전환과 저장만 담당합니다.
   * ------------------------------------------------------------------ */
  function getTheme() {
    return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      // 사생활 보호 모드 등에서 저장이 막혀도 전환 자체는 동작하도록 무시합니다.
    }
    updateThemeButton();
  }

  /** 테마 버튼의 아이콘과 스크린리더용 라벨을 현재 테마에 맞게 갱신합니다. */
  function updateThemeButton() {
    var button = document.getElementById('theme-toggle');
    if (!button) return;
    var isDark = getTheme() === 'dark';
    var label = isDark ? '라이트 모드로 전환' : '다크 모드로 전환';
    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
    // 다크일 때는 해 아이콘(→ 라이트로), 라이트일 때는 달 아이콘(→ 다크로)
    button.innerHTML = isDark ? ICON_SUN : ICON_MOON;
  }

  // 아이콘은 장식용이므로 aria-hidden 처리 (의미는 버튼의 aria-label이 전달)
  var ICON_SUN =
    '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
    '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var ICON_MOON =
    '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  var ICON_MENU =
    '<svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
    '<path d="M4 6h16M4 12h16M4 18h16"/></svg>';

  /* ------------------------------------------------------------------
   * 3. 상단 헤더
   * ------------------------------------------------------------------ */
  function renderHeader() {
    var header = document.getElementById('site-header');
    if (!header) return;

    var firstChapter = chapterHref(CHAPTERS[0].id);
    var isHome = currentPage === 'home';

    // 검색창 (홈페이지에서만 표시)
    var searchHTML = isHome ?
      '<div class="header-search">' +
      '  <input type="text" id="searchInput" class="search-input" ' +
      '    placeholder="🔍 배우고 싶은 주제를 검색하세요... (예: 함수, 배열, DOM)" ' +
      '    aria-label="단원 검색">' +
      '  <div id="searchResults" class="search-results"></div>' +
      '</div>' : '';

    header.innerHTML =
      // 모바일에서만 보이는 사이드바 열기 버튼
      '<button type="button" class="icon-button menu-toggle" id="menu-toggle"' +
      ' aria-controls="sidebar" aria-expanded="false" aria-label="학습 목차 열기">' + ICON_MENU + '</button>' +

      '<a class="brand" href="' + root + 'index.html">' +
      '  <span class="brand-logo" aria-hidden="true">JS</span>' +
      '  <span class="brand-text">자바스크립트 기초</span>' +
      '</a>' +

      searchHTML +

      '<nav class="top-nav" aria-label="주 메뉴">' +
      '  <ul>' +
      '    <li><a href="' + root + 'index.html"' + (isHome ? ' aria-current="page"' : '') + '>홈</a></li>' +
      '    <li><a href="' + firstChapter + '">학습 시작</a></li>' +
      '    <li><a href="https://developer.mozilla.org/ko/docs/Web/JavaScript" target="_blank" rel="noopener noreferrer">MDN 문서<span class="sr-only"> (새 창)</span></a></li>' +
      '  </ul>' +
      '</nav>' +

      '<button type="button" class="icon-button theme-toggle" id="theme-toggle"></button>';

    document.getElementById('theme-toggle').addEventListener('click', function () {
      setTheme(getTheme() === 'dark' ? 'light' : 'dark');
    });
    updateThemeButton();
  }

  /* ------------------------------------------------------------------
   * 4. 좌측 사이드바 목차
   * ------------------------------------------------------------------ */
  function renderSidebar() {
    var sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    var items = CHAPTERS.map(function (chapter, index) {
      var isCurrent = chapter.id === currentPage;
      return (
        '<li>' +
        '  <a href="' + chapterHref(chapter.id) + '"' + (isCurrent ? ' aria-current="page"' : '') + '>' +
        '    <span class="toc-num" aria-hidden="true">' + chapterNumber(index) + '</span>' +
        '    <span class="toc-title">' + chapter.title + '</span>' +
        '  </a>' +
        '</li>'
      );
    }).join('');

    sidebar.innerHTML =
      '<p class="sidebar-heading" id="sidebar-heading">학습 목차</p>' +
      '<nav aria-labelledby="sidebar-heading">' +
      '  <ol class="toc">' + items + '</ol>' +
      '</nav>';
  }

  /* ------------------------------------------------------------------
   * 5. 이전/다음 단원 버튼
   *    단원 페이지에 <nav id="pager"></nav>가 있으면 채워 넣습니다.
   * ------------------------------------------------------------------ */
  function renderPager() {
    var pager = document.getElementById('pager');
    if (!pager) return;

    var index = CHAPTERS.findIndex(function (c) { return c.id === currentPage; });
    if (index === -1) return;

    var prev = CHAPTERS[index - 1];
    var next = CHAPTERS[index + 1];

    // 이전 단원이 없으면(첫 단원) 홈으로, 다음 단원이 없으면(마지막 단원) 홈으로 안내
    var prevHtml = prev
      ? '<a class="pager-link prev" href="' + chapterHref(prev.id) + '" rel="prev">' +
        '<span class="pager-label">← 이전 단원</span><span class="pager-title">' + prev.title + '</span></a>'
      : '<a class="pager-link prev" href="' + root + 'index.html">' +
        '<span class="pager-label">← 처음으로</span><span class="pager-title">홈</span></a>';

    var nextHtml = next
      ? '<a class="pager-link next" href="' + chapterHref(next.id) + '" rel="next">' +
        '<span class="pager-label">다음 단원 →</span><span class="pager-title">' + next.title + '</span></a>'
      : '<a class="pager-link next" href="' + root + 'index.html">' +
        '<span class="pager-label">모두 마쳤어요 →</span><span class="pager-title">홈으로</span></a>';

    pager.innerHTML = prevHtml + nextHtml;
  }

  /* ------------------------------------------------------------------
   * 6. 홈 화면의 단원 카드 목록
   *    index.html에 <ol id="chapter-list"></ol>이 있으면 채워 넣습니다.
   * ------------------------------------------------------------------ */
  function renderChapterList() {
    var list = document.getElementById('chapter-list');
    if (!list) return;

    list.innerHTML = CHAPTERS.map(function (chapter, index) {
      return (
        '<li>' +
        '  <a class="chapter-card" href="' + chapterHref(chapter.id) + '">' +
        '    <span class="chapter-num">' + chapterNumber(index) + '</span>' +
        '    <span class="chapter-title">' + chapter.title + '</span>' +
        '    <span class="chapter-desc">' + chapter.desc + '</span>' +
        '  </a>' +
        '</li>'
      );
    }).join('');
  }

  /* ------------------------------------------------------------------
   * 7. 모바일 사이드바 드로어
   *    화면이 좁을 때 햄버거 버튼으로 사이드바를 열고 닫습니다.
   * ------------------------------------------------------------------ */
  function setupDrawer() {
    var menuButton = document.getElementById('menu-toggle');
    var sidebar = document.getElementById('sidebar');
    var layout = document.querySelector('.layout');
    if (!sidebar || !layout) return;

    var isDesktop = window.matchMedia('(min-width: 900px)').matches;

    // 데스크톱: 사이드바 옆에 토글 버튼 생성
    var sidebarToggle = null;
    if (isDesktop) {
      sidebarToggle = createElement('<button class="sidebar-toggle" aria-label="사이드바 토글">◀</button>');
      document.body.appendChild(sidebarToggle);
    }

    // 사이드바 뒤를 덮는 반투명 배경 (모바일에서만 사용)
    var backdrop = createElement('<div class="sidebar-backdrop" hidden></div>');
    document.body.appendChild(backdrop);

    function toggle() {
      if (isDesktop && sidebarToggle) {
        // 데스크톱: sidebar와 layout 클래스 토글, 화살표 방향 변경
        var isHidden = sidebar.classList.contains('hidden');
        sidebar.classList.toggle('hidden');
        layout.classList.toggle('sidebar-hidden');
        sidebarToggle.textContent = isHidden ? '◀' : '▶';
        sidebarToggle.setAttribute('aria-label', isHidden ? '사이드바 닫기' : '사이드바 열기');
      } else if (!isDesktop) {
        // 모바일: body의 sidebar-open 상태 확인
        var isOpen = body.classList.contains('sidebar-open');
        if (isOpen) close(true);
        else open();
      }
    }

    function open() {
      body.classList.add('sidebar-open');
      if (menuButton) {
        menuButton.setAttribute('aria-expanded', 'true');
        menuButton.setAttribute('aria-label', '학습 목차 닫기');
      }
      backdrop.hidden = false;
      var target = sidebar.querySelector('[aria-current="page"]') || sidebar.querySelector('a');
      if (target) target.focus();
    }

    function close(returnFocus) {
      body.classList.remove('sidebar-open');
      if (menuButton) {
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', '학습 목차 열기');
      }
      backdrop.hidden = true;
      if (returnFocus && menuButton) menuButton.focus();
    }

    // 버튼 클릭
    if (isDesktop && sidebarToggle) {
      sidebarToggle.addEventListener('click', toggle);
    } else if (menuButton) {
      menuButton.addEventListener('click', toggle);
    }

    // 백드롭 클릭 (모바일)
    backdrop.addEventListener('click', function () { close(true); });

    // Esc 키
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        if (window.matchMedia('(min-width: 900px)').matches) {
          sidebar.classList.add('hidden');
          layout.classList.add('sidebar-hidden');
        } else if (body.classList.contains('sidebar-open')) {
          close(true);
        }
      }
    });

    // 화면 크기 변경 감지
    window.matchMedia('(min-width: 900px)').addEventListener('change', function (e) {
      if (e.matches) {
        // 데스크톱으로 변경되면 사이드바 초기화
        sidebar.classList.remove('hidden');
        layout.classList.remove('sidebar-hidden');
        body.classList.remove('sidebar-open');
        backdrop.hidden = true;
      }
    });
  }

  /* ------------------------------------------------------------------
   * 8. 검색 기능 (홈페이지에서만)
   * ------------------------------------------------------------------ */
  function setupSearch() {
    var searchInput = document.getElementById('searchInput');
    var searchResults = document.getElementById('searchResults');
    if (!searchInput) return;

    searchInput.addEventListener('input', function () {
      var query = searchInput.value.toLowerCase().trim();

      if (query.length === 0) {
        searchResults.innerHTML = '';
        searchResults.classList.remove('active');
        return;
      }

      var results = CHAPTERS.filter(function (chapter) {
        return (
          chapter.title.toLowerCase().includes(query) ||
          chapter.desc.toLowerCase().includes(query)
        );
      });

      if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">검색 결과가 없습니다.</div>';
        searchResults.classList.add('active');
        return;
      }

      var html = results.map(function (chapter, index) {
        var num = String(CHAPTERS.indexOf(chapter) + 1).padStart(2, '0');
        return (
          '<a class="search-result-item" href="' + chapterHref(chapter.id) + '">' +
          '  <span class="search-result-num">' + num + '</span>' +
          '  <span class="search-result-title">' + chapter.title + '</span>' +
          '</a>'
        );
      }).join('');

      searchResults.innerHTML = html;
      searchResults.classList.add('active');
    });

    // ESC 키로 검색 닫기
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        searchInput.value = '';
        searchResults.innerHTML = '';
        searchResults.classList.remove('active');
      }
    });
  }

  /* ------------------------------------------------------------------
   * 실행 — 스크립트는 <body> 끝에서 로드되므로 DOM이 준비된 상태입니다.
   * ------------------------------------------------------------------ */
  renderHeader();
  renderSidebar();
  renderPager();
  renderChapterList();
  setupDrawer();
  setupSearch();

  // 다른 스크립트(playground.js 등)에서도 단원 정보를 쓸 수 있도록 공개
  window.JSB = { chapters: CHAPTERS };
})();
