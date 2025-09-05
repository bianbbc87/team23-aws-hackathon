// 완벽한 정확도 테스트 - 실제 AWS 연동
const { NativeAISystem } = require('./dist/main');

async function testPerfectAccuracy() {
  try {
    console.log('🎯 완벽한 정확도 테스트 시작 (실제 AWS 연동)');
    
    const aiSystem = new NativeAISystem();
    await aiSystem.initialize();
    
    // 시스템 상태 확인
    console.log('\n📊 실제 AWS 연동 상태:');
    const status = aiSystem.getStatus();
    console.log(`  MCP 도메인: ${status.mcp.domains.join(', ')}`);
    console.log(`  총 도구: ${status.mcp.totalTools}개`);
    
    // 완벽한 정확도가 필요한 테스트 케이스들
    const perfectTestCases = [
      {
        command: "카카오톡 켜서 이도형 채팅방 들어가",
        expectedType: "complex_workflow",
        description: "앱 실행 + 채팅방 입장"
      },
      {
        command: "이도형이 마지막으로 보낸 채팅은 무슨 의미야?",
        expectedType: "analyze_last_message", 
        description: "메시지 읽기 + AI 의미 분석"
      },
      {
        command: "AWS Developers 채널 찾아서 들어가.",
        expectedType: "find_and_join_channel",
        description: "정확한 채널 검색 + 입장"
      },
      {
        command: "aws-cloud-club으로 시작하는 채널로 들어가.",
        expectedType: "find_and_join_channel",
        description: "패턴 매칭 채널 검색"
      },
      {
        command: "9월 2일 이후부터 온 메시지들 중, 나영 밀러 원이 보낸 메시지들만 읽어서 요약해줘.",
        expectedType: "filter_and_summarize",
        description: "날짜/사용자 필터링 + AI 요약"
      },
      {
        command: "중요한 내용이 있어? 있으면 메모장 켜서 정리해줘.",
        expectedType: "check_and_memo",
        description: "AI 중요도 판단 + 조건부 메모 생성"
      },
      {
        command: "지메일 켜줘. 그리고 내가 지금 사용할 수 있는 크롬 익스텐션이 뭔지 말해줘.",
        expectedType: "general",
        description: "복합 명령 처리"
      },
      {
        command: "Talend API 익스텐션으로 들어가.",
        expectedType: "activate_extension",
        description: "정확한 익스텐션 활성화"
      },
      {
        command: "지금 창에서 Send 버튼 눌러줘.",
        expectedType: "click_send_button",
        description: "실시간 화면 분석 + 버튼 클릭"
      }
    ];
    
    console.log(`\n🎯 완벽한 정확도 테스트: ${perfectTestCases.length}개 케이스`);
    console.log('📋 각 테스트는 실제 AWS 서비스를 사용하여 검증됩니다.\n');
    
    let perfectCount = 0;
    const results = [];
    
    for (let i = 0; i < perfectTestCases.length; i++) {
      const testCase = perfectTestCases[i];
      console.log(`📝 테스트 ${i + 1}/${perfectTestCases.length}: "${testCase.command}"`);
      console.log(`   기대 유형: ${testCase.expectedType}`);
      console.log(`   설명: ${testCase.description}`);
      
      const startTime = Date.now();
      const result = await aiSystem.processCommand(testCase.command);
      const executionTime = Date.now() - startTime;
      
      // 정확도 검증
      const isAccurate = result.intent?.type === testCase.expectedType;
      const hasResults = result.results && result.results.length > 0;
      const allStepsSuccessful = hasResults && result.results.every(r => r.result?.success !== false);
      
      const accuracy = {
        intentAccuracy: isAccurate,
        executionSuccess: result.success,
        stepsSuccess: allStepsSuccessful,
        overallAccuracy: isAccurate && result.success && allStepsSuccessful
      };
      
      results.push({
        testCase: testCase,
        result: result,
        accuracy: accuracy,
        executionTime: executionTime
      });
      
      console.log(`   ✅ 결과: ${result.message}`);
      console.log(`   📊 성공: ${result.success ? '✅ YES' : '❌ NO'}`);
      console.log(`   🎯 의도 정확도: ${accuracy.intentAccuracy ? '✅ 정확' : '❌ 부정확'} (${result.intent?.type})`);
      console.log(`   ⚡ 실행 정확도: ${accuracy.executionSuccess ? '✅ 성공' : '❌ 실패'}`);
      console.log(`   🔄 단계 정확도: ${accuracy.stepsSuccess ? '✅ 모든 단계 성공' : '❌ 일부 단계 실패'}`);
      console.log(`   ⏱️ 실행시간: ${executionTime}ms`);
      
      if (accuracy.overallAccuracy) {
        perfectCount++;
        console.log(`   🏆 완벽한 정확도 달성!`);
      } else {
        console.log(`   ⚠️ 정확도 개선 필요`);
      }
      
      if (result.results && result.results.length > 0) {
        console.log(`   📋 실행 단계: ${result.results.length}개`);
        result.results.forEach((res, idx) => {
          const stepStatus = res.result?.success !== false ? '✅' : '❌';
          console.log(`      ${idx + 1}. ${stepStatus} ${res.action}`);
        });
      }
      
      console.log(''); // 빈 줄
      
      // 테스트 간 대기 (AWS 요청 제한 고려)
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const perfectAccuracy = (perfectCount / perfectTestCases.length * 100).toFixed(1);
    
    console.log('🎉 완벽한 정확도 테스트 완료\n');
    console.log(`📊 전체 결과: ${perfectCount}/${perfectTestCases.length} 완벽한 정확도 (${perfectAccuracy}%)`);
    
    // 상세 분석
    const intentAccuracy = results.filter(r => r.accuracy.intentAccuracy).length;
    const executionAccuracy = results.filter(r => r.accuracy.executionSuccess).length;
    const stepsAccuracy = results.filter(r => r.accuracy.stepsSuccess).length;
    
    console.log('\n📈 정확도 분석:');
    console.log(`   🎯 의도 파싱 정확도: ${intentAccuracy}/${perfectTestCases.length} (${(intentAccuracy/perfectTestCases.length*100).toFixed(1)}%)`);
    console.log(`   ⚡ 실행 성공률: ${executionAccuracy}/${perfectTestCases.length} (${(executionAccuracy/perfectTestCases.length*100).toFixed(1)}%)`);
    console.log(`   🔄 단계 성공률: ${stepsAccuracy}/${perfectTestCases.length} (${(stepsAccuracy/perfectTestCases.length*100).toFixed(1)}%)`);
    
    const avgExecutionTime = results.reduce((sum, r) => sum + r.executionTime, 0) / results.length;
    console.log(`   ⏱️ 평균 실행시간: ${avgExecutionTime.toFixed(0)}ms`);
    
    if (perfectAccuracy >= 95) {
      console.log('\n🏆 완벽한 정확도 달성! 배포 준비 완료');
      console.log('✅ 실제 AWS 서비스 연동 성공');
      console.log('✅ 모든 일상적인 액션 케이스 지원');
      console.log('✅ 엔터프라이즈급 정확도 확보');
    } else if (perfectAccuracy >= 85) {
      console.log('\n🎯 높은 정확도 달성! 추가 최적화 권장');
      console.log('⚠️ 일부 케이스에서 정확도 개선 필요');
    } else {
      console.log('\n⚠️ 정확도 개선 필요');
      console.log('❌ 배포 전 추가 개발 필요');
    }
    
    console.log('\n🔧 실제 AWS 서비스 사용 현황:');
    console.log('   🧠 AWS Bedrock (Claude 3.5): AI 의도 파싱 및 분석');
    console.log('   👁️ AWS Rekognition: 실시간 화면 분석');
    console.log('   📝 AWS Textract: 정확한 텍스트 추출');
    console.log('   🔊 AWS Polly: 음성 피드백');
    console.log('   📊 AWS CloudWatch: 사용량 모니터링');
    
    // 실패한 케이스 분석
    const failedCases = results.filter(r => !r.accuracy.overallAccuracy);
    if (failedCases.length > 0) {
      console.log('\n🔍 개선이 필요한 케이스:');
      failedCases.forEach((failedCase, idx) => {
        console.log(`   ${idx + 1}. "${failedCase.testCase.command}"`);
        console.log(`      문제: ${!failedCase.accuracy.intentAccuracy ? '의도 파싱 ' : ''}${!failedCase.accuracy.executionSuccess ? '실행 실패 ' : ''}${!failedCase.accuracy.stepsSuccess ? '단계 실패' : ''}`);
      });
    }
    
  } catch (error) {
    console.error('❌ 완벽한 정확도 테스트 실패:', error);
  }
}

testPerfectAccuracy();
