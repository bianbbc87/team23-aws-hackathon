// AssistantQ - AI-Powered Productivity Assistant
console.log("🚀 AssistantQ AI Assistant 시작");

const API_URL =
  "https://2dqvsvxv1l.execute-api.us-east-1.amazonaws.com/prod/generate";
let isExpanded = false;
let assistantPanel = null;

setTimeout(() => {
  createAssistantQAssistant();
}, 2000);

function createAssistantQAssistant() {
  const toggleBtn = document.createElement("div");
  toggleBtn.id = "assistantq-toggle-btn";
  toggleBtn.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    width: 65px;
    height: 65px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    user-select: none;
  `;

  // AssistantQ 캐릭터 이미지 사용
  const assistantqImg = document.createElement("img");
  assistantqImg.src = chrome.runtime.getURL("assistantq-character.png");
  assistantqImg.style.cssText = `
    width: 65px;
    height: 65px;
    border-radius: 50%;
    object-fit: cover;
    transition: all 0.3s ease;
  `;

  // 이미지 로딩 오류 처리
  assistantqImg.onerror = () => {
    console.log("AssistantQ 캐릭터 이미지 로딩 실패, 기본 이모지 사용");
    toggleBtn.innerHTML = "🤖";
    toggleBtn.style.fontSize = "26px";
    toggleBtn.style.color = "white";
  };

  assistantqImg.onload = () => {
    console.log("AssistantQ 캐릭터 이미지 로딩 성공");
  };

  toggleBtn.appendChild(assistantqImg);

  // 호버 효과
  toggleBtn.onmouseover = () => {
    toggleBtn.style.transform = "scale(1.1)";
    toggleBtn.style.boxShadow = "0 8px 35px rgba(102, 126, 234, 0.6)";
  };

  toggleBtn.onmouseout = () => {
    toggleBtn.style.transform = "scale(1)";
    toggleBtn.style.boxShadow = "0 5px 25px rgba(102, 126, 234, 0.4)";
  };

  toggleBtn.onclick = toggleAssistant;
  document.body.appendChild(toggleBtn);

  createAssistantQPanel();
}

function createAssistantQPanel() {
  assistantPanel = document.createElement("div");
  assistantPanel.id = "assistantq-panel";
  assistantPanel.innerHTML = `
    <div style="padding: 22px; font-family: 'Google Sans', sans-serif;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <span style="font-weight: 700; color: #667eea; font-size: 17px; display: flex; align-items: center;">
          <img src="${chrome.runtime.getURL(
            "assistantq-character.png"
          )}" style="width: 18px; height: 18px; margin-right: 4px; border-radius: 50%; object-fit: cover;">
          AssistantQ
        </span>
        <span id="close-panel" style="cursor: pointer; color: #5f6368; font-size: 22px;">×</span>
      </div>
      
      <!-- 4가지 핵심 기능 -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
        <button id="page-summary" style="padding: 14px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border: none; border-radius: 10px; font-size: 12px; font-weight: 600; cursor: pointer;">
          📄 페이지 요약
        </button>
        <button id="email-reply" style="padding: 14px; background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; border: none; border-radius: 10px; font-size: 12px; font-weight: 600; cursor: pointer;">
          📧 이메일 작성
        </button>
        <button id="idea-generation" style="padding: 14px; background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); color: #333; border: none; border-radius: 10px; font-size: 12px; font-weight: 600; cursor: pointer;">
          💡 아이디어 생성
        </button>
        <button id="report-writing" style="padding: 14px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; font-size: 12px; font-weight: 600; cursor: pointer;">
          📊 보고서 작성
        </button>
      </div>
      
      <!-- 현재 모드 표시 -->
      <div id="current-mode" style="text-align: center; padding: 8px; background: #f0f4ff; border-radius: 8px; margin-bottom: 15px; font-size: 12px; color: #667eea; font-weight: 600;">
        기능을 선택해주세요
      </div>
      
      <!-- 입력창 -->
      <div style="position: relative; margin-bottom: 18px;">
        <textarea id="smart-input" placeholder="내용을 입력하거나 위 버튼으로 자동 추출..." style="width: 100%; height: 140px; padding: 15px; border: 2px solid #e1e5e9; border-radius: 10px; font-size: 13px; resize: none; font-family: inherit; line-height: 1.5; box-sizing: border-box;"></textarea>
        <div id="word-count" style="position: absolute; bottom: 10px; right: 10px; font-size: 10px; color: #999; background: rgba(255,255,255,0.9); padding: 3px 8px; border-radius: 12px;">0자</div>
      </div>
      
      <!-- AI 생성 버튼 -->
      <button id="generate-btn" style="width: 100%; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; margin-bottom: 15px; box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3); box-sizing: border-box;">
        ✨ AI 생성
      </button>
      
      <!-- 하단 도구들 -->
      <div style="display: flex; gap: 6px; margin-bottom: 15px;">
        <button id="copy-btn" style="flex: 1; padding: 8px; background: #1a73e8; color: white; border: none; border-radius: 6px; font-size: 10px; cursor: pointer; white-space: nowrap;">📋 복사</button>
        <button id="clear-btn" style="flex: 1; padding: 8px; background: #8e8e93; color: white; border: none; border-radius: 6px; font-size: 10px; cursor: pointer; white-space: nowrap;">🗑️ 지우기</button>
        <button id="extract-all-btn" style="flex: 1; padding: 8px; background: #34a853; color: white; border: none; border-radius: 6px; font-size: 10px; cursor: pointer; white-space: nowrap;">📄 전체추출</button>
      </div>
      
      <div id="status" style="text-align: center; font-size: 12px; color: #5f6368;">AssistantQ 준비됨</div>
    </div>
  `;

  assistantPanel.style.cssText = `
    position: fixed;
    top: 95px;
    right: 20px;
    z-index: 9999;
    width: 360px;
    background: linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%);
    border: 2px solid rgba(102, 126, 234, 0.2);
    border-radius: 18px;
    box-shadow: 0 12px 45px rgba(102, 126, 234, 0.25);
    display: none;
    animation: slideIn 0.4s ease;
    box-sizing: border-box;
  `;

  document.body.appendChild(assistantPanel);

  // 이벤트 리스너들
  document.getElementById("close-panel").onclick = toggleAssistant;
  document.getElementById("page-summary").onclick = () =>
    setMode("summary", "📄 페이지 요약");
  document.getElementById("email-reply").onclick = () =>
    setMode("email", "📧 이메일 작성");
  document.getElementById("idea-generation").onclick = () =>
    setMode("idea", "💡 아이디어 생성");
  document.getElementById("report-writing").onclick = () =>
    setMode("report", "📊 보고서 작성");
  document.getElementById("generate-btn").onclick = generateContent;
  document.getElementById("copy-btn").onclick = copyToClipboard;
  document.getElementById("clear-btn").onclick = clearContent;
  document.getElementById("extract-all-btn").onclick = extractAllPageContent;
  document.getElementById("smart-input").oninput = updateWordCount;
}

let currentMode = "";

function setMode(mode, title) {
  currentMode = mode;
  document.getElementById("current-mode").textContent = `현재 모드: ${title}`;

  const status = document.getElementById("status");
  const pageContent = extractCurrentPageContent();

  if (mode === "summary") {
    document.getElementById(
      "smart-input"
    ).value = `다음 페이지 내용을 요약해주세요:\n\n${pageContent}`;
    status.textContent = "페이지 요약 모드";
    status.style.color = "#4facfe";
  } else if (mode === "email") {
    document.getElementById(
      "smart-input"
    ).value = `다음 페이지 내용을 바탕으로 이메일을 작성해주세요:\n\n${pageContent}`;
    status.textContent = "이메일 작성 모드";
    status.style.color = "#fa709a";
  } else if (mode === "idea") {
    document.getElementById(
      "smart-input"
    ).value = `다음 페이지 내용을 바탕으로 관련 아이디어를 생성해주세요:\n\n${pageContent}`;
    status.textContent = "아이디어 생성 모드";
    status.style.color = "#a8edea";
  } else if (mode === "report") {
    document.getElementById(
      "smart-input"
    ).value = `다음 페이지 내용을 바탕으로 보고서를 작성해주세요:\n\n${pageContent}`;
    status.textContent = "보고서 작성 모드";
    status.style.color = "#667eea";
  }

  updateWordCount();
}

function extractCurrentPageContent() {
  try {
    let content = "";

    // 1. 페이지 제목
    const title = document.title || "";
    if (title && title.length > 3) {
      content += `📌 제목: ${title}\n\n`;
    }

    // 2. 선택된 텍스트 우선
    const selectedText = window.getSelection().toString().trim();
    if (selectedText && selectedText.length > 50) {
      content += `📝 선택된 내용:\n${selectedText}\n\n`;
      return content;
    }

    // 3. 전체 페이지 텍스트 추출 (개선된 버전)
    let pageText = "";

    // 불필요한 요소들 제외
    const excludeSelectors = [
      "script",
      "style",
      "nav",
      "header",
      "footer",
      ".advertisement",
      ".ads",
      ".sidebar",
      ".menu",
      '[role="navigation"]',
      '[role="banner"]',
      '[role="contentinfo"]',
    ];

    // 제외할 요소들을 임시로 숨김
    const excludedElements = [];
    excludeSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        excludedElements.push({ element: el, display: el.style.display });
        el.style.display = "none";
      });
    });

    // 메인 콘텐츠 우선 추출
    const mainSelectors = [
      "main",
      "article",
      '[role="main"]',
      ".content",
      ".post",
      ".article",
      ".entry",
      "#content",
      "#main",
      ".main-content",
    ];

    let foundMainContent = false;
    for (const selector of mainSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        const text = element.innerText || element.textContent || "";
        if (text.trim().length > 200) {
          pageText = text.trim();
          foundMainContent = true;
          break;
        }
      }
    }

    // 메인 콘텐츠를 찾지 못한 경우 body 전체에서 추출
    if (!foundMainContent) {
      pageText = document.body.innerText || document.body.textContent || "";
    }

    // 제외했던 요소들 복원
    excludedElements.forEach(({ element, display }) => {
      element.style.display = display;
    });

    // 텍스트 정리
    pageText = pageText
      .replace(/\s+/g, " ") // 연속된 공백을 하나로
      .replace(/\n\s*\n/g, "\n") // 연속된 줄바꿈을 하나로
      .trim();

    // 길이 제한 (10000자) - 긴 문서도 처리 가능
    if (pageText.length > 10000) {
      pageText =
        pageText.substring(0, 10000) +
        "\n\n... (텍스트가 길어서 일부만 표시됩니다)";
    }

    content += `📄 페이지 내용:\n${pageText}`;

    return (
      content ||
      "페이지 내용을 추출할 수 없습니다. 수동으로 내용을 입력해주세요."
    );
  } catch (error) {
    console.error("페이지 내용 추출 오류:", error);
    return "페이지 내용 추출 중 오류가 발생했습니다.";
  }
}

function toggleAssistant() {
  isExpanded = !isExpanded;

  if (isExpanded) {
    assistantPanel.style.display = "block";
  } else {
    assistantPanel.style.display = "none";
  }
}

async function generateContent() {
  const content = document.getElementById("smart-input").value.trim();
  const status = document.getElementById("status");

  if (!content) {
    status.textContent = "내용을 입력해주세요";
    status.style.color = "#ea4335";
    return;
  }

  if (!currentMode) {
    status.textContent = "기능을 먼저 선택해주세요";
    status.style.color = "#ea4335";
    return;
  }

  status.textContent = "AssistantQ AI 생성 중...";
  status.style.color = "#667eea";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        action: "generateContent",
        content: content,
        taskType: currentMode,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        showResult(result.result);
        status.textContent = "AssistantQ 생성 완료!";
        status.style.color = "#34a853";
      } else {
        status.textContent = result.error || "생성 실패";
        status.style.color = "#ea4335";
      }
    } else {
      status.textContent = `서버 오류 (${response.status})`;
      status.style.color = "#ea4335";
    }
  } catch (error) {
    status.textContent = "연결 실패";
    status.style.color = "#ea4335";
  }
}

function updateWordCount() {
  const input = document.getElementById("smart-input");
  const counter = document.getElementById("word-count");
  const count = input.value.length;
  counter.textContent = `${count}자`;

  if (count > 1000) {
    counter.style.color = "#ea4335";
  } else if (count > 500) {
    counter.style.color = "#fbbc04";
  } else {
    counter.style.color = "#999";
  }
}

function copyToClipboard() {
  const input = document.getElementById("smart-input");
  input.select();
  document.execCommand("copy");

  const status = document.getElementById("status");
  status.textContent = "복사 완료!";
  status.style.color = "#34a853";
}

function extractAllPageContent() {
  const status = document.getElementById("status");
  status.textContent = "전체 페이지 추출 중...";
  status.style.color = "#34a853";

  try {
    const fullContent = extractCurrentPageContent();
    document.getElementById("smart-input").value = fullContent;
    updateWordCount();

    status.textContent = "전체 페이지 추출 완료!";
    status.style.color = "#34a853";
  } catch (error) {
    status.textContent = "페이지 추출 실패";
    status.style.color = "#ea4335";
  }
}

function clearContent() {
  document.getElementById("smart-input").value = "";
  updateWordCount();

  const status = document.getElementById("status");
  status.textContent = "AssistantQ 준비됨";
  status.style.color = "#5f6368";
}

function showResult(result, title = "✨ AssistantQ 결과") {
  const resultWindow = document.createElement("div");
  resultWindow.innerHTML = `
    <div style="padding: 30px; font-family: 'Google Sans', sans-serif;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
        <h3 style="margin: 0; color: #667eea; font-size: 20px;">${title}</h3>
        <span id="close-result" style="cursor: pointer; color: #5f6368; font-size: 26px;">×</span>
      </div>
      <div style="background: linear-gradient(145deg, #f8f9ff 0%, #ffffff 100%); padding: 25px; border-radius: 15px; max-height: 500px; overflow-y: auto; white-space: pre-wrap; font-size: 15px; line-height: 1.6; margin-bottom: 25px; border: 1px solid #e1e5e9; color: #333333 !important;">${result}</div>
      <div style="display: flex; justify-content: center;">
        <button id="copy-result" style="padding: 15px 30px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;">📋 클립보드 복사</button>
      </div>
    </div>
  `;

  resultWindow.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10001;
    width: 700px;
    max-width: 90vw;
    background: white;
    border: 2px solid rgba(102, 126, 234, 0.2);
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
  `;

  document.body.appendChild(resultWindow);

  document.getElementById("close-result").onclick = () => resultWindow.remove();
  document.getElementById("copy-result").onclick = () => {
    navigator.clipboard.writeText(result);
    document.getElementById("status").textContent = "결과 복사됨!";
    resultWindow.remove();
  };
}

const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

console.log("✅ AssistantQ AI Assistant 준비 완료");
