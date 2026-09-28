/**
 * playground.js — "Try it" 코드 실행 기능
 *
 * .playground 요소를 찾아 다음을 수행합니다:
 *  1. 코드를 textarea로 만들어 편집 가능하게
 *  2. "실행" 버튼 추가
 *  3. console.log, console.error 등을 가로채 결과 표시
 *  4. 에러 메시지를 읽기 쉽게 표시
 */

(function () {
  'use strict';

  /**
   * .playground 요소를 찾아 실행 가능한 코드 블록으로 변환합니다.
   * HTML 구조:
   *   <div class="playground">
   *     <pre><code>// 초기 코드</code></pre>
   *     <div class="playground-output"></div>  <!-- 결과가 여기 출력됨 -->
   *   </div>
   */
  function initPlaygrounds() {
    var playgrounds = document.querySelectorAll('.playground');

    playgrounds.forEach(function (playground, index) {
      var codeBlock = playground.querySelector('pre code');
      if (!codeBlock) return;

      var initialCode = codeBlock.textContent;
      var outputContainer = playground.querySelector('.playground-output') ||
                           document.createElement('div');

      // 출력 영역이 없으면 생성
      if (!playground.querySelector('.playground-output')) {
        outputContainer.className = 'playground-output';
        playground.appendChild(outputContainer);
      }

      // HTML 구조 재구성
      var wrapper = document.createElement('div');
      wrapper.className = 'playground-editor';

      // 텍스트 에어리어 (편집 가능)
      var textarea = document.createElement('textarea');
      textarea.className = 'playground-code';
      textarea.value = initialCode;
      textarea.spellcheck = false;
      textarea.setAttribute('data-playground-' + index, '');

      // 컨트롤 버튼 영역
      var controls = document.createElement('div');
      controls.className = 'playground-controls';

      var runButton = document.createElement('button');
      runButton.className = 'playground-run-btn';
      runButton.textContent = '▶ 실행';
      runButton.type = 'button';

      var resetButton = document.createElement('button');
      resetButton.className = 'playground-reset-btn';
      resetButton.textContent = '↻ 초기화';
      resetButton.type = 'button';

      controls.appendChild(runButton);
      controls.appendChild(resetButton);

      wrapper.appendChild(textarea);
      wrapper.appendChild(controls);

      // 기존 내용 제거하고 새 구조로 교체
      playground.innerHTML = '';
      playground.appendChild(wrapper);
      playground.appendChild(outputContainer);

      // 실행 버튼 클릭 핸들러
      runButton.addEventListener('click', function () {
        executeCode(textarea.value, outputContainer);
      });

      // 초기화 버튼 클릭 핸들러
      resetButton.addEventListener('click', function () {
        textarea.value = initialCode;
        outputContainer.innerHTML = '';
      });

      // Enter + Ctrl/Cmd로도 실행 가능
      textarea.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          executeCode(textarea.value, outputContainer);
        }
      });
    });
  }

  /**
   * 주어진 코드를 실행하고 결과를 outputContainer에 출력합니다.
   */
  function executeCode(code, outputContainer) {
    var logs = [];
    var errors = [];

    // console.log, console.error 등을 가로채기
    var originalLog = console.log;
    var originalError = console.error;
    var originalWarn = console.warn;

    console.log = function () {
      logs.push(Array.from(arguments)
        .map(function (arg) {
          return formatValue(arg);
        })
        .join(' '));
    };

    console.error = function () {
      errors.push(Array.from(arguments)
        .map(function (arg) {
          return formatValue(arg);
        })
        .join(' '));
    };

    console.warn = function () {
      logs.push('[경고] ' + Array.from(arguments)
        .map(function (arg) {
          return formatValue(arg);
        })
        .join(' '));
    };

    try {
      // 사용자 코드 실행
      // eslint-disable-next-line no-eval
      eval(code);

      // 결과 표시
      outputContainer.innerHTML = '';

      if (logs.length > 0) {
        var logDiv = document.createElement('div');
        logDiv.className = 'playground-log';
        logs.forEach(function (log) {
          var line = document.createElement('div');
          line.textContent = log;
          logDiv.appendChild(line);
        });
        outputContainer.appendChild(logDiv);
      }

      if (errors.length > 0) {
        var errorDiv = document.createElement('div');
        errorDiv.className = 'playground-error';
        errors.forEach(function (error) {
          var line = document.createElement('div');
          line.textContent = error;
          errorDiv.appendChild(line);
        });
        outputContainer.appendChild(errorDiv);
      }

      if (logs.length === 0 && errors.length === 0) {
        outputContainer.innerHTML = '<div class="playground-empty">출력이 없습니다</div>';
      }
    } catch (e) {
      // 에러 발생
      outputContainer.innerHTML =
        '<div class="playground-error">' +
        '<strong>❌ 에러:</strong> ' + e.message +
        '</div>';
    } finally {
      // console 복원
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    }
  }

  /**
   * 값을 문자열로 포맷합니다.
   */
  function formatValue(value) {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value, null, 2);
      } catch (e) {
        return Object.prototype.toString.call(value);
      }
    }
    return String(value);
  }

  // DOM 로드 후 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlaygrounds);
  } else {
    initPlaygrounds();
  }
})();