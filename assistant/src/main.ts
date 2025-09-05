import { MCPManager } from './orchestration/mcp_manager';
import { VoiceAssistant } from './ui/voice_assistant';

export class NativeAISystem {
  private mcpManager: MCPManager;
  private voiceAssistant: VoiceAssistant;

  constructor() {
    this.mcpManager = new MCPManager();
    this.voiceAssistant = new VoiceAssistant();
  }

  async initialize(): Promise<void> {
    console.log('🚀 Native AI System 초기화 (6개 MCP 도메인)');
    await this.mcpManager.initialize();
    await this.voiceAssistant.initialize();
    console.log('✅ 초기화 완료');
  }

  async processCommand(command: string): Promise<any> {
    return this.processVoiceCommand(command);
  }

  async processVoiceCommand(command: string): Promise<any> {
    console.log(`👤 사용자: ${command}`);
    
    try {
      // 1. AI Planning으로 의도 파싱
      const intent = await this.mcpManager.callTool('ai_planning', 'parse_intent', { command });
      
      // 2. Workflow MCP로 고급 워크플로우 실행
      const result = await this.mcpManager.callTool('workflow', 'execute_advanced_workflow', { intent });
      
      return {
        success: true,
        message: result.message || `명령 "${command}" 처리 완료`,
        intent: intent.intent || command,
        method: result.method || 'MCP 워크플로우',
        results: result.results || []
      };
      
    } catch (error: any) {
      console.error('❌ 명령 처리 오류:', error);
      
      return {
        success: false,
        message: `명령 "${command}" 처리 중 오류가 발생했습니다.`,
        intent: command,
        method: 'Error Handler',
        error: error.message || error
      };
    }
  }

  async startVoiceMode(): Promise<void> {
    await this.voiceAssistant.startListening();
  }

  async stopVoiceMode(): Promise<void> {
    await this.voiceAssistant.stopListening();
  }

  getStatus(): any {
    return {
      mcp: this.mcpManager.getStatus(),
      voice: this.voiceAssistant.isCurrentlyListening()
    };
  }

  getAvailableTools(): string[] {
    return this.mcpManager.getAvailableTools();
  }
}

// 기본 내보내기
export { MCPManager } from './orchestration/mcp_manager';
export { VoiceAssistant } from './ui/voice_assistant';
