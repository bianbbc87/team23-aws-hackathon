// AssistantQ Popup Script
console.log('AssistantQ Popup 로드됨');

const statusDiv = document.getElementById('status');

// 초기 상태 확인
checkApiStatus();

// 기능 버튼들에 이벤트 리스너 추가
document.querySelectorAll('.feature-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        statusDiv.textContent = '웹페이지에서 🎯 버튼을 클릭하세요!';
        statusDiv.style.color = '#667eea';
    });
});

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
