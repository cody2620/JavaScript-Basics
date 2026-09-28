# 🎓 JavaScript 기초 - 완전 초보자 가이드

완전 초보자를 위한 **무료 JavaScript 입문 튜토리얼**입니다. 
브라우저만으로 바로 시작할 수 있으며, 각 단원마다 직접 코드를 작성하고 실행해볼 수 있습니다.

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![HTML5](https://img.shields.io/badge/HTML-5-orange)
![CSS3](https://img.shields.io/badge/CSS-3-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ 주요 특징

🎯 **Try it 에디터** - 코드를 직접 수정하고 실행  
⚡ **실시간 피드백** - console.log 결과를 즉시 표시  
❌ **에러 표시** - 코드 오류를 읽기 쉽게 출력  
🌙 **다크/라이트 모드** - 테마 선택 (localStorage 저장)  
📱 **반응형 디자인** - 모바일/태블릿/데스크톱 모두 지원  
📖 **접근성** - 키보드 네비게이션, 스크린리더 지원  

## 📚 학습 내용 (11개 단원)

| # | 단원 | 개요 |
|---|------|------|
| 01 | **자바스크립트 소개** | 자바스크립트가 무엇이고 어디서 실행하는지 |
| 02 | **변수와 상수** | let, const, var의 차이와 올바른 사용법 |
| 03 | **자료형** | 숫자, 문자, 불리언, null, undefined |
| 04 | **연산자** | 산술, 비교(== vs ===), 논리, 삼항 연산자 |
| 05 | **조건문** | if/else/else if, switch 문 |
| 06 | **반복문** | for, while, do...while, for...of |
| 07 | **함수** | 선언식, 표현식, 화살표 함수 |
| 08 | **배열** | 배열 메서드, map/filter/reduce |
| 09 | **객체** | 속성, 메서드, 구조 분해, JSON |
| 10 | **DOM 조작** | 요소 선택, 내용/스타일 변경, 생성/삭제 |
| 11 | **이벤트** | addEventListener, 이벤트 종류, preventDefault |

## 🚀 시작하기

### 웹 서버로 실행

```bash
# 프로젝트 폴더로 이동
cd /Users/aever1443475/Desktop/javaScript-basics

# Python 웹 서버 실행
python3 -m http.server 8000

# 브라우저에서 열기
# http://localhost:8000
```

## 📁 프로젝트 구조

```
javaScript-basics/
├── index.html              # 메인 페이지 (학습 목차)
├── README.md              # 프로젝트 설명 (이 파일)
│
├── pages/                 # 11개 단원 페이지
│   ├── 01-intro.html      # 자바스크립트 소개
│   ├── 02-variables.html  # 변수와 상수
│   ├── 03-types.html      # 자료형
│   ├── 04-operators.html  # 연산자
│   ├── 05-conditionals.html # 조건문
│   ├── 06-loops.html      # 반복문
│   ├── 07-functions.html  # 함수
│   ├── 08-arrays.html     # 배열
│   ├── 09-objects.html    # 객체
│   ├── 10-dom.html        # DOM 조작
│   └── 11-events.html     # 이벤트
│
├── css/
│   ├── style.css          # 공통 스타일 (레이아웃, 컴포넌트)
│   └── code.css           # 코드 블록 스타일
│
├── js/
│   ├── main.js            # 공통 스크립트 (네비게이션, 테마)
│   └── playground.js      # Try it 에디터 기능
│
└── assets/                # 정적 파일
    └── README.md          # 프로젝트 상세 설명
```

## 🛠 기술 스택

### Frontend
- **HTML5** - 시맨틱 태그, 접근성
- **CSS3** - CSS 변수, Flexbox, 다크 모드 지원
- **Vanilla JavaScript** - 프레임워크 없음

### 특징
- 📦 의존성 없음 (순수 HTML/CSS/JS)
- 🎯 프레임워크/빌드 도구 불필요
- 📱 모바일 반응형
- ♿ WCAG 접근성 준수

## 🎨 UI/UX

### 공통 컴포넌트
- ✅ 상단 헤더 (로고, 메뉴, 테마 토글)
- ✅ 좌측 사이드바 (학습 목차, 현재 위치 하이라이트)
- ✅ Try it 에디터 (실시간 코드 실행)
- ✅ 이전/다음 네비게이션
- ✅ 반응형 모바일 메뉴

### Try it 에디터 기능
- 📝 textarea에서 실시간 코드 편집
- ▶️ "실행" 버튼으로 코드 실행
- ↻ "초기화" 버튼으로 원래 코드 복원
- 🖥️ console.log 결과를 화면에 표시
- ❌ 에러 메시지 자동 표시
- 💾 각 playground 독립적으로 작동

## 🌐 브라우저 지원

| 브라우저 | 지원 |
|---------|------|
| Chrome/Chromium | ✅ |
| Firefox | ✅ |
| Safari | ✅ |
| Edge | ✅ |
| IE | ❌ |

## 🔐 보안

- ✅ 클라이언트 사이드만 사용 (서버 불필요)
- ✅ 입력 데이터 검증 (XSS 방지)
- ✅ localStorage만 사용 (개인정보 미수집)
- ✅ 외부 API 호출 없음

## 📖 각 단원의 구조

```
각 단원 페이지
├── 제목 및 설명
├── 학습 목표 (Callout)
├── 개념 설명
│   ├── 텍스트
│   └── 코드 예제 (pre/code)
├── Try it 에디터 (3~5개)
│   ├── 편집 가능한 textarea
│   ├── "실행", "초기화" 버튼
│   └── 결과 출력 영역
├── 자주하는 실수 섹션
├── 연습 문제 (2~3개)
│   ├── 문제 설명
│   ├── Try it 에디터
│   └── 토글식 정답
└── 이전/다음 단원 버튼
```

**Happy Learning!** 🎉

```javascript
console.log("JavaScript 배우기 시작! 🎓");
```

