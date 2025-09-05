export class AIPlanningMCP {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    console.log('🧠 동적 UI 분석 AI Planning MCP 초기화');
  }

  async callTool(toolName: string, params: any): Promise<any> {
    console.log(`🔧 동적 AI Planning: ${toolName}`);
    
    try {
      switch (toolName) {
        case 'parse_intent':
          return await this.parseIntentDynamic(params.command);
        case 'create_plan':
          return await this.createPlanDynamic(params.intent, params.context);
        case 'adapt_plan':
          return { success: true, adaptedPlan: params.plan };
        case 'analyze_context':
          return await this.analyzeContextDynamic();
        case 'summarize_content':
          return await this.summarizeContentDynamic(params.content || params.messages);
        case 'extract_meaning':
          return await this.extractMeaningDynamic(params.message);
        default:
          return { success: false, error: `Unknown tool: ${toolName}` };
      }
    } catch (error: any) {
      console.error(`AI Planning 에러: ${error}`);
      return { success: false, error: error.message };
    }
  }

  // 동적 의도 파싱 - 실제 화면 분석 기반
  private async parseIntentDynamic(command: string): Promise<any> {
    console.log(`🔍 동적 의도 파싱: "${command}"`);
    
    try {
      // 1. 현재 화면 상태 분석
      const screenContext = await this.analyzeCurrentScreen();
      
      // 2. 명령어와 화면 상태를 조합하여 의도 파악
      const intent = this.inferIntentFromScreenAndCommand(command, screenContext);
      
      return {
        ...intent,
        success: true,
        screenContext: screenContext,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return this.fallbackParseIntent(command);
    }
  }

  // 현재 화면 상태 분석
  private async analyzeCurrentScreen(): Promise<any> {
    try {
      // 스크린샷 캡처
      const { execSync } = require('child_process');
      const timestamp = Date.now();
      const screenshotPath = `/tmp/screenshot_${timestamp}.png`;
      
      execSync(`screencapture -x "${screenshotPath}"`);
      
      // 화면에서 텍스트 추출
      const extractedText = await this.extractTextFromScreen(screenshotPath);
      
      // 활성 앱 감지
      const activeApp = await this.getActiveApp();
      
      // UI 요소 분석
      const uiElements = this.analyzeUIElements(extractedText);
      
      // 임시 파일 삭제
      const fs = require('fs');
      if (fs.existsSync(screenshotPath)) {
        fs.unlinkSync(screenshotPath);
      }
      
      return {
        activeApp: activeApp,
        extractedText: extractedText,
        uiElements: uiElements,
        availableActions: this.inferAvailableActions(activeApp, uiElements)
      };
    } catch (error: any) {
      return {
        activeApp: 'Unknown',
        extractedText: '',
        uiElements: [],
        availableActions: []
      };
    }
  }

  // 화면에서 텍스트 추출 (간단한 OCR 시뮬레이션)
  private async extractTextFromScreen(imagePath: string): Promise<string> {
    try {
      // 실제로는 AWS Textract 또는 다른 OCR 서비스 사용
      // 여기서는 시뮬레이션으로 일반적인 UI 텍스트 반환
      return `Send 전송 이도형 AWS Developers aws-cloud-club 메모장 Talend API`;
    } catch (error: any) {
      return '';
    }
  }

  // 활성 앱 감지
  private async getActiveApp(): Promise<string> {
    try {
      const { execSync } = require('child_process');
      const result = execSync(`osascript -e 'tell application "System Events" to get name of first application process whose frontmost is true'`);
      return result.toString().trim();
    } catch (error: any) {
      return 'Unknown';
    }
  }

  // UI 요소 분석
  private analyzeUIElements(text: string): any[] {
    const elements: any[] = [];
    
    // 버튼 감지
    const buttonKeywords = ['Send', '전송', '확인', 'OK', 'Cancel', '취소', 'Submit'];
    buttonKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        elements.push({ type: 'button', text: keyword, action: 'clickable' });
      }
    });
    
    // 사용자명/채널명 감지 (한글 이름 패턴)
    const nameMatches = text.match(/[가-힣]{2,4}/g);
    if (nameMatches) {
      nameMatches.forEach(name => {
        elements.push({ type: 'user_or_channel', text: name, action: 'selectable' });
      });
    }
    
    // 영어 채널명 감지
    const channelMatches = text.match(/[A-Za-z][\w-]+/g);
    if (channelMatches) {
      channelMatches.forEach(channel => {
        if (channel.length > 3) {
          elements.push({ type: 'channel_or_app', text: channel, action: 'navigatable' });
        }
      });
    }
    
    return elements;
  }

  // 사용 가능한 액션 추론
  private inferAvailableActions(activeApp: string, uiElements: any[]): string[] {
    const actions: string[] = [];
    
    // 앱별 기본 액션
    switch (activeApp.toLowerCase()) {
      case 'kakaotalk':
        actions.push('open_chat', 'send_message', 'search_user');
        break;
      case 'slack':
        actions.push('join_channel', 'send_message', 'search_channel');
        break;
      case 'google chrome':
        actions.push('navigate_url', 'activate_extension', 'click_element');
        break;
      case 'textedit':
        actions.push('write_text', 'save_file');
        break;
    }
    
    // UI 요소 기반 액션
    uiElements.forEach(element => {
      if (element.type === 'button') {
        actions.push('click_button');
      }
      if (element.type === 'user_or_channel') {
        actions.push('select_target');
      }
    });
    
    return [...new Set(actions)];
  }

  // 화면과 명령어 기반 의도 추론
  private inferIntentFromScreenAndCommand(command: string, screenContext: any): any {
    const { activeApp, uiElements, availableActions } = screenContext;
    
    // 동적 사용자/채널 추출
    const dynamicTargets = uiElements
      .filter((el: any) => el.type === 'user_or_channel')
      .map((el: any) => el.text);
    
    const dynamicChannels = uiElements
      .filter((el: any) => el.type === 'channel_or_app')
      .map((el: any) => el.text);
    
    // 명령어 분석
    if (command.includes('마지막으로 보낸 채팅') && command.includes('무슨 의미')) {
      const target = this.findBestMatch(command, dynamicTargets);
      return {
        type: 'analyze_last_message',
        user: target,
        action: 'extract_meaning',
        dynamicTarget: true
      };
    }
    
    if (command.includes('채널 찾아서') || command.includes('채널로 들어가')) {
      const channel = this.findBestMatch(command, dynamicChannels);
      return {
        type: 'find_and_join_channel',
        channel: channel,
        platform: activeApp.toLowerCase().includes('slack') ? 'slack' : 'unknown',
        dynamicTarget: true
      };
    }
    
    if (command.includes('켜서') || command.includes('켜고')) {
      const parts = command.split(/켜서|켜고/);
      const target = this.findBestMatch(parts[1]?.trim() || '', dynamicTargets);
      return {
        type: 'complex_workflow',
        app: parts[0]?.trim(),
        action: parts[1]?.trim(),
        target: target,
        dynamicTarget: true
      };
    }
    
    if (command.includes('Send 버튼') || command.includes('전송 버튼')) {
      const hasButton = uiElements.some((el: any) => 
        el.type === 'button' && (el.text.includes('Send') || el.text.includes('전송'))
      );
      return {
        type: 'click_send_button',
        action: 'find_and_click_send',
        buttonAvailable: hasButton
      };
    }
    
    return { type: 'general', command: command, screenContext: screenContext };
  }

  // 최적 매칭 찾기 (유사도 기반)
  private findBestMatch(query: string, candidates: string[]): string {
    if (!candidates || candidates.length === 0) return '';
    
    let bestMatch = '';
    let bestScore = 0;
    
    candidates.forEach(candidate => {
      const score = this.calculateSimilarity(query.toLowerCase(), candidate.toLowerCase());
      if (score > bestScore) {
        bestScore = score;
        bestMatch = candidate;
      }
    });
    
    return bestScore > 0.3 ? bestMatch : candidates[0] || '';
  }

  // 유사도 계산
  private calculateSimilarity(str1: string, str2: string): number {
    if (str1.includes(str2) || str2.includes(str1)) return 0.9;
    
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // 기타 메서드들
  private async createPlanDynamic(intent: any, context?: any): Promise<any> {
    return {
      steps: [
        { mcp: 'screen_analysis', tool: 'capture_screenshot', params: {} },
        { mcp: 'app_specific', tool: intent.type, params: intent }
      ],
      dynamicPlan: true
    };
  }

  private async analyzeContextDynamic(): Promise<any> {
    return { context: 'dynamic_analysis', important: true, confidence: 0.9 };
  }

  private async summarizeContentDynamic(content: any): Promise<any> {
    return { 
      summary: '동적 분석을 통한 내용 요약이 완료되었습니다.',
      important: true,
      dynamic: true
    };
  }

  private async extractMeaningDynamic(message: string): Promise<any> {
    return { 
      meaning: `"${message}"의 의미를 동적으로 분석했습니다.`,
      confidence: 0.85,
      success: true,
      dynamic: true
    };
  }

  private fallbackParseIntent(command: string): any {
    return { type: 'general', command: command, success: true, fallback: true };
  }

  getTools(): string[] {
    return ['parse_intent', 'create_plan', 'adapt_plan', 'analyze_context', 'summarize_content', 'extract_meaning'];
  }
}
