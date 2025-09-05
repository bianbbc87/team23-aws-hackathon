// 6개 MCP 도메인 테스트
const { NativeAISystem } = require('./dist/main');

async function test6Domains() {
  try {
    console.log('🚀 6개 MCP 도메인 테스트');
    
    const aiSystem = new NativeAISystem();
    await aiSystem.initialize();
    
    // 시스템 상태 확인
    console.log('\n📊 MCP 도메인 상태:');
    const status = aiSystem.getStatus();
    console.log(`  도메인: ${status.mcp.domains.join(', ')}`);
    console.log(`  총 도구: ${status.mcp.totalTools}개`);
    
    // 사용 가능한 도구 확인
    console.log('\n🔧 사용 가능한 도구:');
    const tools = aiSystem.getAvailableTools();
    const toolsByDomain = {};
    tools.forEach(tool => {
      const [domain, toolName] = tool.split('.');
      if (!toolsByDomain[domain]) toolsByDomain[domain] = [];
      toolsByDomain[domain].push(toolName);
    });
    
    Object.entries(toolsByDomain).forEach(([domain, domainTools]) => {
      console.log(`  ${domain}: ${domainTools.length}개 도구`);
    });
    
    // 고급 테스트 케이스들
    const advancedTestCases = [
      "카카오톡 켜서 이도형 채팅방 들어가",
      "이도형이 마지막으로 보낸 채팅은 무슨 의미야?",
      "AWS Developers 채널 찾아서 들어가.",
      "aws-cloud-club으로 시작하는 채널로 들어가.",
      "9월 2일 이후부터 온 메시지들 중, 나영 밀러 원이 보낸 메시지들만 읽어서 요약해줘.",
      "중요한 내용이 있어? 있으면 메모장 켜서 정리해줘.",
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
          const status = res.result?.success !== false ? '✅' : '❌';
          console.log(`  ${idx + 1}. ${status} ${res.action}`);
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
    
    console.log('\n🎉 6개 도메인 테스트 완료');
    console.log(`📊 전체 결과: ${successCount}/${advancedTestCases.length} 성공 (${successRate}%)`);
    
    console.log('\n🏗️ MCP 6개 도메인 아키텍처:');
    console.log('  1️⃣ Screen Analysis MCP: 화면 분석, UI 요소 감지');
    console.log('  2️⃣ Action Execution MCP: 클릭, 타이핑, 스크롤');
    console.log('  3️⃣ AI Planning MCP: 의도 파싱, 계획 생성, 의미 분석');
    console.log('  4️⃣ App-Specific MCPs: 카카오톡, 슬랙, 지메일 특화');
    console.log('  5️⃣ AWS Integration MCP: Bedrock, Rekognition, Polly');
    console.log('  6️⃣ Workflow MCP: 워크플로우 실행, 최적화');
    
    if (successCount === advancedTestCases.length) {
      console.log('\n🏆 완벽한 성공! 모든 고급 기능 동작');
    } else {
      console.log(`\n⚠️ 성공률: ${successRate}% (목표: 100%)`);
    }
    
  } catch (error) {
    console.error('❌ 6개 도메인 테스트 실패:', error);
  }
}

test6Domains();
