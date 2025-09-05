// 완전한 AWS + MCP 시스템 테스트
const { NativeAISystem } = require('./dist/main');

async function testCompleteSystem() {
  try {
    console.log('🚀 완전한 AWS + MCP 시스템 테스트');
    
    const aiSystem = new NativeAISystem();
    await aiSystem.initialize();
    
    // 시스템 상태 확인
    console.log('\n📊 시스템 상태:');
    const status = aiSystem.getStatus();
    console.log(`  MCP 서버: ${status.mcp.servers.join(', ')}`);
    console.log(`  총 도구: ${status.mcp.totalTools}개`);
    
    // 성공해야 하는 테스트 명령들
    const testCommands = [
      "카카오톡 켜서 이도형 채팅방 들어가",
      "이도형이 마지막으로 보낸 채팅은 무슨 의미야 ?",
      "AWS Developers 채널 찾아서 들어가.",
      "aws-cloud-club으로 시작하는 채널로 들어가.",
      "9월 2일 이후부터 온 메시지들 중, 나영 밀러 원이 보낸 메시지들만 읽어서 요약해줘.",
      "중요한 내용이 있어 ? 있으면 메모장 켜서 정리해줘.",
      "지메일 켜줘. 그리고 내가 지금 사용할 수 있는 크롬 익스텐션이 뭔지 말해줘.",
      "Talend API 익스텐션으로 들어가.",
      "지금 창에서 Send 버튼 눌러줘.",
    ];
    
    console.log('\n🎯 핵심 테스트 시작 (모두 성공해야 함)');
    
    let allSuccess = true;
    
    for (let i = 0; i < testCommands.length; i++) {
      const command = testCommands[i];
      console.log(`\n📝 테스트 ${i + 1}/3: "${command}"`);
      
      const startTime = Date.now();
      const result = await aiSystem.processCommand(command);
      const executionTime = Date.now() - startTime;
      
      console.log(`✅ 결과: ${result.message}`);
      console.log(`📊 성공: ${result.success ? '✅ YES' : '❌ NO'}`);
      console.log(`⏱️ 실행시간: ${executionTime}ms`);
      console.log(`🎯 의도: ${result.intent?.type || 'N/A'}`);
      
      if (result.steps && result.steps.length > 0) {
        console.log(`🔄 실행 단계: ${result.steps.length}개`);
        result.steps.forEach((step, idx) => {
          const status = step.success ? '✅' : '❌';
          console.log(`  ${idx + 1}. ${status} 단계 ${step.step}`);
        });
      }
      
      if (!result.success) {
        allSuccess = false;
        console.log(`❌ 테스트 ${i + 1} 실패!`);
      } else {
        console.log(`✅ 테스트 ${i + 1} 성공!`);
      }
      
      // 테스트 간 대기
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n🎉 테스트 완료');
    console.log(`📊 전체 결과: ${allSuccess ? '✅ 모든 테스트 성공!' : '❌ 일부 테스트 실패'}`);
    
    if (allSuccess) {
      console.log('\n🏆 성공 요인:');
      console.log('✅ MCP 서버 기반 모듈화');
      console.log('✅ 앱별 특화 도구');
      console.log('✅ 지능적 의도 파싱');
      console.log('✅ 복합 워크플로우 실행');
      console.log('✅ AppleScript 기반 실제 앱 조작');
      console.log('✅ 에러 처리 및 복구');
    }
    
    console.log('\n📋 지원하는 앱:');
    console.log('  📱 카카오톡: 채팅방 검색, 메시지 전송');
    console.log('  💬 슬랙: 채널 입장, 메시지 전송');
    console.log('  📧 지메일: 이메일 관리, 웹 기반 접근');
    console.log('  🌐 크롬: 웹 서비스 접근');
    
  } catch (error) {
    console.error('❌ 시스템 테스트 실패:', error);
  }
}

testCompleteSystem();
