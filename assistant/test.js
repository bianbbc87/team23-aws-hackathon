// 도메인별 분리된 시스템 테스트
const { NativeAISystem } = require('./dist/main');

async function testCleanArchitecture() {
  try {
    console.log('🧪 도메인별 분리된 시스템 테스트');
    
    const aiSystem = new NativeAISystem();
    await aiSystem.initialize();
    
    const testCommands = [
      "카카오톡 켜서 이도형 채팅방 들어가",
      "이도형이 마지막으로 보낸 채팅은 무슨 의미야 ?",
      "AWS Developers 채널 찾아서 들어가.",
      "aws-cloud-club으로 시작하는 워크스페이스로 들어가.",
      "9월 2일 이후부터 온 메시지들 중, 나영 밀러 원이 보낸 메시지들만 읽어서 요약해줘.",
      "중요한 내용이 있어 ? 있으면 메모장 켜서 정리해줘.",
      "지메일 켜줘. 그리고 내가 지금 사용할 수 있는 크롬 익스텐션이 뭔지 말해줘.",
      "Talend API 익스텐션으로 들어가.",
      "지금 창에서 Send 버튼 눌러줘.",
    ];
    
    for (const command of testCommands) {
      console.log(`\n📝 테스트: "${command}"`);
      const result = await aiSystem.processVoiceCommand(command);
      console.log(`✅ 결과: ${result.message}`);
      console.log(`🎯 의도: ${result.intent}`);
      console.log(`🔧 방법: ${result.method}`);
    }
    
    console.log('\n🎉 도메인 분리 테스트 완료');
    console.log('\n📁 새로운 구조:');
    console.log('├── orchestration/ (오케스트레이션)');
    console.log('├── execution/ (명령 실행)');
    console.log('├── analysis/ (의도 분석)');
    console.log('├── context/ (컨텍스트 관리)');
    console.log('├── ui/ (사용자 인터페이스)');
    console.log('└── utils/ (유틸리티)');
    
  } catch (error) {
    console.error('❌ 테스트 실패:', error);
  }
}

testCleanArchitecture();
