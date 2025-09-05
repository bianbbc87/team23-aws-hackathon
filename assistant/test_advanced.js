// 고급 테스트 케이스 - 모든 복잡한 명령 성공
const { NativeAISystem } = require('./dist/main');

async function testAdvancedCases() {
  try {
    console.log('🚀 고급 테스트 케이스 시작');
    
    const aiSystem = new NativeAISystem();
    await aiSystem.initialize();
    
    // 고급 테스트 케이스들 (모두 성공해야 함)
    const advancedTestCases = [
      "카카오톡 켜서 이도형 채팅방 들어가",
      "이도형이 마지막으로 보낸 채팅은 무슨 의미야 ?",
      "AWS Developers 채널 찾아서 들어가.",
      "aws-cloud-club으로 시작하는 채널로 들어가.",
      "9월 2일 이후부터 온 메시지들 중, 나영 밀러 원이 보낸 메시지들만 읽어서 요약해줘.",
      "중요한 내용이 있어 ? 있으면 메모장 켜서 정리해줘.",
      "지메일 켜줘. 그리고 내가 지금 사용할 수 있는 크롬 익스텐션이 뭔지 말해줘.",
      "Talend API 익스텐션으로 들어가.",
      "지금 창에서 Send 버튼 눌러줘."
    ];
    
    console.log(`\n🎯 고급 테스트: ${advancedTestCases.length}개 케이스`);
    
    let successCount = 0;
    
    for (let i = 0; i < advancedTestCases.length; i++) {
      const command = advancedTestCases[i];
      console.log(`\n📝 테스트 ${i + 1}/${advancedTestCases.length}: "${command}"`);
      
      const startTime = Date.now();
      const result = await aiSystem.processCommand(command);
      const executionTime = Date.now() - startTime;
      
      console.log(`✅ 결과: ${result.message}`);
      console.log(`📊 성공: ${result.success ? '✅ YES' : '❌ NO'}`);
      console.log(`⏱️ 실행시간: ${executionTime}ms`);
      console.log(`🎯 의도: ${result.intent?.type || 'N/A'}`);
      
      if (result.results && result.results.length > 0) {
        console.log(`🔄 실행 결과: ${result.results.length}개`);
        result.results.forEach((res, idx) => {
          console.log(`  ${idx + 1}. ${res.action}: ${res.result.success ? '✅' : '❌'}`);
        });
      }
      
      if (result.success) {
        successCount++;
        console.log(`✅ 테스트 ${i + 1} 성공!`);
      } else {
        console.log(`❌ 테스트 ${i + 1} 실패!`);
      }
      
      // 테스트 간 대기
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    const successRate = (successCount / advancedTestCases.length * 100).toFixed(1);
    
    console.log('\n🎉 고급 테스트 완료');
    console.log(`📊 전체 결과: ${successCount}/${advancedTestCases.length} 성공 (${successRate}%)`);
    
    if (successCount === advancedTestCases.length) {
      console.log('\n🏆 완벽한 성공! 모든 고급 기능 동작');
      console.log('✅ 채팅 메시지 의미 분석');
      console.log('✅ 채널 검색 및 입장');
      console.log('✅ 날짜/사용자별 메시지 필터링');
      console.log('✅ AI 기반 내용 요약');
      console.log('✅ 조건부 메모 생성');
      console.log('✅ 크롬 익스텐션 관리');
      console.log('✅ 화면 요소 자동 감지 및 클릭');
    } else {
      console.log('\n⚠️ 일부 테스트 실패');
      console.log(`성공률: ${successRate}% (목표: 100%)`);
    }
    
    console.log('\n📋 지원하는 고급 기능:');
    console.log('  🧠 AI 기반 의미 분석');
    console.log('  🔍 지능적 채널/사용자 검색');
    console.log('  📅 날짜 기반 메시지 필터링');
    console.log('  📝 자동 요약 및 메모 생성');
    console.log('  🧩 브라우저 익스텐션 제어');
    console.log('  🎯 화면 요소 자동 감지');
    console.log('  💬 다중 플랫폼 메시징');
    
  } catch (error) {
    console.error('❌ 고급 테스트 실패:', error);
  }
}

testAdvancedCases();
