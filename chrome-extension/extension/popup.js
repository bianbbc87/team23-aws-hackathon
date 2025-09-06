// AssistantQ Popup Script
console.log('AssistantQ Popup 로드됨');

const statusDiv = document.getElementById('status');

// 초기 상태 확인
checkApiStatus();

// 기능 버튼들에 이벤트 리스너 추가
document.querySelectorAll('.feature-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        const feature = e.target.dataset.feature;
        await processContent(feature);
    });
});

async function processContent(feature) {
    try {
        statusDiv.textContent = '페이지 내용을 분석 중...';
        statusDiv.style.color = '#667eea';

        // activeTab 권한으로 현재 탭의 콘텐츠 추출
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: extractPageContent
        });

        const pageContent = results[0].result;
        
        if (!pageContent || pageContent.trim().length === 0) {
            statusDiv.textContent = '페이지 내용을 찾을 수 없습니다.';
            statusDiv.style.color = '#ea4335';
            return;
        }

        // AI 처리 요청
        await sendToAI(pageContent, feature);

    } catch (error) {
        console.error('콘텐츠 처리 오류:', error);
        statusDiv.textContent = '처리 중 오류가 발생했습니다.';
        statusDiv.style.color = '#ea4335';
    }
}

// 페이지 콘텐츠 추출 함수 (탭에서 실행됨)
function extractPageContent() {
    // 불필요한 요소들 제거
    const elementsToRemove = ['script', 'style', 'nav', 'header', 'footer', '.ad', '.advertisement'];
    elementsToRemove.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.remove());
    });

    // 주요 콘텐츠 추출
    const contentSelectors = [
        'main', 'article', '.content', '.post', '.entry',
        'h1, h2, h3, h4, h5, h6', 'p', 'li'
    ];

    let content = '';
    contentSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            const text = el.innerText?.trim();
            if (text && text.length > 10) {
                content += text + '\n';
            }
        });
    });

    // 중복 제거 및 정리
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    const uniqueLines = [...new Set(lines)];
    
    return uniqueLines.join('\n').substring(0, 8000); // 8KB 제한
}

async function sendToAI(content, feature) {
    try {
        statusDiv.textContent = 'AI가 분석 중입니다...';
        
        const response = await fetch('https://2dqvsvxv1l.execute-api.us-east-1.amazonaws.com/prod/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: content,
                feature: feature
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // 결과를 새 탭에서 표시
        const resultWindow = window.open('', '_blank', 'width=800,height=600');
        resultWindow.document.write(`
            <html>
                <head>
                    <title>AssistantQ 결과</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
                        .result { background: #f5f5f5; padding: 15px; border-radius: 8px; }
                    </style>
                </head>
                <body>
                    <h2>🤖 AssistantQ 결과</h2>
                    <div class="result">${result.response || result.message}</div>
                </body>
            </html>
        `);

        statusDiv.innerHTML = `
            <div style="color: #34a853;">✅ 완료!</div>
            <div style="font-size: 10px; margin-top: 3px;">새 탭에서 결과 확인</div>
        `;

    } catch (error) {
        console.error('AI 처리 오류:', error);
        statusDiv.textContent = 'AI 처리 중 오류가 발생했습니다.';
        statusDiv.style.color = '#ea4335';
    }
}

async function checkApiStatus() {
    try {
        const response = await fetch('https://2dqvsvxv1l.execute-api.us-east-1.amazonaws.com/prod/generate', {
            method: 'OPTIONS'
        });
        
        if (response.ok) {
            statusDiv.innerHTML = `
                <div style="color: #34a853;">✅ AssistantQ 온라인</div>
                <div style="font-size: 10px; margin-top: 3px;">AWS AI 서비스 연결됨</div>
            `;
        } else {
            throw new Error('API 응답 없음');
        }
    } catch (error) {
        statusDiv.innerHTML = `
            <div style="color: #ea4335;">❌ 연결 확인 중</div>
            <div style="font-size: 10px; margin-top: 3px;">잠시 후 다시 시도</div>
        `;
    }
}
