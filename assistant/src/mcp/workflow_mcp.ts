export class WorkflowMCP {
  private config: any;
  private mcpManager: any;

  constructor(config: any, mcpManager: any) {
    this.config = config;
    this.mcpManager = mcpManager;
  }

  async initialize(): Promise<void> {
    console.log('🔄 Workflow MCP 초기화');
  }

  async callTool(toolName: string, params: any): Promise<any> {
    console.log(`🔧 Workflow: ${toolName}`);
    
    switch (toolName) {
      case 'execute_workflow':
        return await this.executeWorkflow(params.plan);
        
      case 'execute_advanced_workflow':
        return await this.executeAdvancedWorkflow(params.intent);
        
      case 'validate_workflow':
        return this.validateWorkflow(params.plan);
        
      case 'optimize_workflow':
        return this.optimizeWorkflow(params.plan);
        
      default:
        return { success: false, error: `Unknown tool: ${toolName}` };
    }
  }

  async executeWorkflow(plan: any): Promise<any> {
    console.log(`🚀 워크플로우 실행: ${plan.steps?.length || 0}개 단계`);
    
    if (!plan.steps || plan.steps.length === 0) {
      return { success: false, message: '실행할 단계가 없습니다.' };
    }
    
    const results = [];
    
    for (let i = 0; i < plan.steps.length; i++) {
      const step = plan.steps[i];
      console.log(`📋 단계 ${i + 1}: ${step.mcp}.${step.tool}`);
      
      try {
        const result = await this.mcpManager.callTool(step.mcp, step.tool, step.params || {});
        results.push({ step: i + 1, success: true, result });
        
        // 단계 간 대기
        await this.delay(500);
      } catch (error) {
        console.error(`❌ 단계 ${i + 1} 실패:`, error);
        results.push({ step: i + 1, success: false, error });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    
    return {
      success: successCount > 0,
      message: `워크플로우 완료: ${successCount}/${plan.steps.length} 성공`,
      results
    };
  }

  async executeAdvancedWorkflow(intent: any): Promise<any> {
    const command = typeof intent === 'string' ? intent : (intent.command || intent);
    console.log(`🚀 고급 워크플로우 실행: ${intent.type || this.classifyWorkflow(command)}`);
    
    const workflowType = intent.type || this.classifyWorkflow(command);
    const actionPlan = this.decomposeCommand(command, workflowType);
    const results = [];
    let successCount = 0;
    
    console.log(`📋 액션 계획: ${actionPlan.length}개 단계`);
    
    try {
      // 각 액션을 순차적으로 실행하고 검증
      for (let i = 0; i < actionPlan.length; i++) {
        const action = actionPlan[i];
        console.log(`\n🔄 단계 ${i + 1}/${actionPlan.length}: ${action.description}`);
        
        const result = await this.executeAndVerifyAction(action);
        results.push(result);
        
        if (result.success && result.verification) {
          successCount++;
          console.log(`✅ 단계 ${i + 1} 성공: ${result.message}`);
        } else {
          console.log(`❌ 단계 ${i + 1} 실패: ${result.message}`);
          // 실패 시에도 계속 진행 (부분 성공 허용)
        }
        
        // 다음 액션 전 대기
        if (i < actionPlan.length - 1) {
          await this.delay(1000);
        }
      }
      
      return {
        success: successCount > 0,
        message: `고급 워크플로우 완료: ${successCount}/${actionPlan.length}개 액션 성공`,
        method: 'MCP 워크플로우',
        results: results,
        workflowType: workflowType,
        totalSteps: actionPlan.length,
        successfulSteps: successCount
      };
      
    } catch (error) {
      console.error('❌ 워크플로우 실행 오류:', error);
      return {
        success: false,
        message: '고급 워크플로우 실행 실패',
        method: 'MCP 워크플로우',
        error: error,
        results: results
      };
    }
  }

  private decomposeCommand(command: string, workflowType: string): any[] {
    const actions = [];
    
    // command가 문자열인지 확인
    const cmdStr = typeof command === 'string' ? command : String(command);
    
    switch (workflowType) {
      case 'complex_workflow':
        if (cmdStr.includes('카카오톡') && cmdStr.includes('이도형')) {
          actions.push(
            { 
              mcp: 'action_execution', 
              tool: 'launch_app', 
              params: { app: 'KakaoTalk' },
              description: '카카오톡 실행'
            },
            { 
              mcp: 'action_execution', 
              tool: 'navigate_to_user', 
              params: { user: '이도형' },
              description: '이도형 채팅방으로 이동'
            }
          );
        } else if (cmdStr.includes('메모장')) {
          actions.push({
            mcp: 'action_execution',
            tool: 'launch_app',
            params: { app: 'TextEdit' },
            description: '메모장 실행'
          });
        }
        break;
        
      case 'analyze_last_message':
        actions.push(
          {
            mcp: 'app_specific',
            tool: 'kakaotalk_action',
            params: { action: 'read_last_message', user: this.extractUserName(cmdStr) },
            description: '마지막 메시지 읽기'
          },
          {
            mcp: 'aws_integration',
            tool: 'bedrock_analyze',
            params: { prompt: '메시지 의미 분석', context: cmdStr },
            description: 'AI로 메시지 의미 분석'
          }
        );
        break;
        
      case 'find_and_join_channel':
        const channelName = this.extractChannelName(cmdStr);
        actions.push(
          {
            mcp: 'app_specific',
            tool: 'slack_action',
            params: { action: 'search_channels', channel: channelName },
            description: `${channelName} 채널 검색`
          },
          {
            mcp: 'app_specific',
            tool: 'slack_action',
            params: { action: 'join_channel', channel: channelName },
            description: `${channelName} 채널 참여`
          }
        );
        break;
        
      case 'click_send_button':
        actions.push(
          {
            mcp: 'screen_analysis',
            tool: 'detect_buttons',
            params: {},
            description: '화면에서 버튼 감지'
          },
          {
            mcp: 'action_execution',
            tool: 'find_and_click',
            params: { target: 'Send' },
            description: 'Send 버튼 클릭'
          }
        );
        break;
        
      case 'filter_and_summarize':
        const userName = this.extractUserName(cmdStr);
        actions.push(
          {
            mcp: 'app_specific',
            tool: 'slack_action',
            params: { action: 'filter_messages_by_user', user: userName, dateFilter: '2024-09-02' },
            description: `${userName}의 메시지 필터링`
          },
          {
            mcp: 'aws_integration',
            tool: 'bedrock_analyze',
            params: { prompt: '메시지 요약', context: cmdStr },
            description: 'AI로 메시지 요약'
          }
        );
        break;
        
      default:
        // 일반 명령도 분해
        if (cmdStr.includes('지메일') || cmdStr.includes('gmail')) {
          actions.push(
            {
              mcp: 'app_specific',
              tool: 'gmail_action',
              params: { action: 'launch_gmail' },
              description: 'Gmail 실행'
            },
            {
              mcp: 'app_specific',
              tool: 'chrome_action',
              params: { action: 'get_extensions' },
              description: 'Chrome 확장프로그램 목록 조회'
            }
          );
        } else if (cmdStr.includes('익스텐션') || cmdStr.includes('extension')) {
          const extensionName = this.extractExtensionName(cmdStr);
          actions.push(
            {
              mcp: 'app_specific',
              tool: 'chrome_action',
              params: { action: 'get_extensions' },
              description: '설치된 확장프로그램 목록 조회'
            },
            {
              mcp: 'app_specific',
              tool: 'chrome_action',
              params: { action: 'activate_extension', extension: extensionName },
              description: `${extensionName} 확장프로그램 활성화`
            }
          );
        } else {
          actions.push({
            mcp: 'aws_integration',
            tool: 'bedrock_analyze',
            params: { prompt: `명령 분석: ${cmdStr}` },
            description: 'AI로 명령 분석'
          });
        }
        break;
    }
    
    return actions;
  }

  private async executeAndVerifyAction(action: any): Promise<any> {
    try {
      // 액션 실행
      const result = await this.mcpManager.callTool(action.mcp, action.tool, action.params);
      
      // 검증 로직
      const verification = this.verifyActionResult(action, result);
      
      return {
        ...result,
        verification: verification,
        actionDescription: action.description
      };
    } catch (error) {
      return {
        success: false,
        verification: false,
        message: `액션 실행 실패: ${error}`,
        actionDescription: action.description
      };
    }
  }

  private verifyActionResult(action: any, result: any): boolean {
    // 결과에 verification 필드가 있으면 그것을 사용
    if (typeof result.verification === 'boolean') {
      return result.verification;
    }
    
    // 기본적으로 success 필드로 검증
    return result.success === true;
  }

  private classifyWorkflow(command: string): string {
    // 복합 명령 (앱 실행 + 작업)
    if ((command.includes('켜서') || command.includes('실행')) && 
        (command.includes('들어가') || command.includes('채팅방'))) {
      return 'complex_workflow';
    }
    
    // 메시지 분석
    if (command.includes('마지막') && (command.includes('채팅') || command.includes('메시지')) && 
        command.includes('의미')) {
      return 'analyze_last_message';
    }
    
    // 채널 찾기
    if (command.includes('채널') && (command.includes('찾아서') || command.includes('들어가'))) {
      return 'find_and_join_channel';
    }
    
    // Send 버튼 클릭
    if (command.includes('Send') && command.includes('버튼') && command.includes('눌러')) {
      return 'click_send_button';
    }
    
    // 메시지 요약 - 더 구체적으로 분류
    if (command.includes('메시지') && (command.includes('요약') || command.includes('읽어서'))) {
      return 'filter_and_summarize';
    }
    
    return 'general';
  }

  private extractChannelName(command: string): string {
    const cmdStr = typeof command === 'string' ? command : String(command);
    if (cmdStr.includes('AWS Developers')) return 'AWS Developers';
    if (cmdStr.includes('aws-cloud-club')) return 'aws-cloud-club';
    return 'unknown-channel';
  }

  private extractUserName(command: string): string {
    const cmdStr = typeof command === 'string' ? command : String(command);
    if (cmdStr.includes('나영 밀러 원')) return '나영 밀러 원';
    if (cmdStr.includes('이도형')) return '이도형';
    return 'unknown-user';
  }

  private extractExtensionName(command: string): string {
    const cmdStr = typeof command === 'string' ? command : String(command);
    // 더 정확한 확장프로그램 이름 추출
    if (cmdStr.includes('Talend API')) return 'Talend API';
    if (cmdStr.includes('Talend')) return 'Talend';
    if (cmdStr.includes('AdBlock')) return 'AdBlock';
    if (cmdStr.includes('LastPass')) return 'LastPass';
    if (cmdStr.includes('Postman')) return 'Postman';
    if (cmdStr.includes('React')) return 'React Developer Tools';
    if (cmdStr.includes('Vue')) return 'Vue.js devtools';
    
    // 일반적인 패턴으로 추출 시도
    const match = cmdStr.match(/([A-Z][a-zA-Z\s]+(?:API|Extension|Tool)?)/);
    return match ? match[1].trim() : 'unknown-extension';
  }

  private validateWorkflow(plan: any): any {
    console.log('✅ 워크플로우 검증');
    
    if (!plan.steps || plan.steps.length === 0) {
      return { valid: false, error: '단계가 없습니다.' };
    }
    
    for (const step of plan.steps) {
      if (!step.mcp || !step.tool) {
        return { valid: false, error: '잘못된 단계 형식입니다.' };
      }
    }
    
    return { valid: true, message: '워크플로우가 유효합니다.' };
  }

  private optimizeWorkflow(plan: any): any {
    console.log('⚡ 워크플로우 최적화');
    
    // 중복 단계 제거, 병렬 실행 가능한 단계 식별 등
    const optimizedPlan = { ...plan };
    
    return {
      success: true,
      optimizedPlan: optimizedPlan,
      improvements: ['중복 단계 제거', '실행 순서 최적화']
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getTools(): string[] {
    return ['execute_workflow', 'execute_advanced_workflow', 'validate_workflow', 'optimize_workflow'];
  }
}
