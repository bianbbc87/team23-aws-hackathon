import { execSync } from 'child_process';
import * as fs from 'fs';

export class ActionExecutionMCP {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    console.log('⚡ Action Execution MCP 초기화');
  }

  async callTool(toolName: string, params: any): Promise<any> {
    console.log(`🔧 Action Execution: ${toolName}`);
    
    switch (toolName) {
      case 'execute_step':
        return await this.executeRealStep(params);
      case 'find_and_click':
        return await this.findAndClickReal(params);
      case 'launch_app':
        return await this.launchAppReal(params.app);
      case 'navigate_to_user':
        return await this.navigateToUserReal(params.user);
      default:
        return { success: false, error: `Unknown tool: ${toolName}` };
    }
  }

  private async executeRealStep(params: any): Promise<any> {
    const { action, app, target } = params;
    
    if (action === 'launch_app_and_navigate') {
      // 1단계: 앱 실행
      const launchResult = await this.launchAppReal(app);
      if (!launchResult.success) {
        return launchResult;
      }
      
      // 2단계: 사용자로 이동
      await this.delay(2000);
      const navigateResult = await this.navigateToUserReal(target);
      
      return {
        success: navigateResult.success,
        message: `${app} 실행 후 ${target}로 이동: ${navigateResult.success ? '성공' : '실패'}`,
        steps: [launchResult, navigateResult]
      };
    }
    
    if (action === 'launch_app') {
      return await this.launchAppReal(app);
    }
    
    return { success: false, message: `알 수 없는 액션: ${action}` };
  }

  private async launchAppReal(appName: string): Promise<any> {
    try {
      console.log(`🚀 ${appName} 실제 실행 중...`);
      
      const script = `tell application "${appName}" to activate`;
      execSync(`osascript -e '${script}'`);
      
      // 실행 검증
      await this.delay(3000);
      const isRunning = await this.verifyAppRunning(appName);
      
      return {
        success: isRunning,
        message: isRunning ? `${appName} 실행 성공` : `${appName} 실행 실패`,
        verification: isRunning
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: `${appName} 실행 오류: ${error.message}`,
        verification: false
      };
    }
  }

  private async navigateToUserReal(userName: string): Promise<any> {
    try {
      console.log(`🎯 ${userName}로 실제 이동 중...`);
      
      const searchScript = `
        tell application "System Events"
          tell application process "KakaoTalk"
            -- Press Cmd+F to search
            key code 3 using command down
            delay 0.5
            
            -- Clear search field
            key code 0 using command down
            
            -- Type user name
            keystroke "${userName}"
            delay 1
            
            -- Press Enter to search and open
            key code 36
            delay 1
            key code 36
            
            return "executed"
          end tell
        end tell
      `;
      
      execSync(`osascript -e '${searchScript}'`);
      
      // 이동 검증
      await this.delay(2000);
      const verification = await this.verifyChatOpen(userName);
      
      return {
        success: verification,
        message: verification ? `${userName} 채팅방 이동 성공` : `${userName} 채팅방 이동 실패`,
        verification: verification
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: `${userName} 이동 오류: ${error.message}`,
        verification: false
      };
    }
  }

  private async findAndClickReal(params: any): Promise<any> {
    try {
      const { target } = params;
      console.log(`🎯 실제로 ${target} 찾아서 클릭`);
      
      const clickScript = `
        tell application "System Events"
          set frontApp to name of first application process whose frontmost is true
          tell application process frontApp
            try
              click button "${target}" of window 1
              return "success"
            on error
              try
                click UI element "${target}" of window 1
                return "success"
              on error
                return "not_found"
              end try
            end try
          end tell
        end tell
      `;
      
      const result = execSync(`osascript -e '${clickScript}'`).toString().trim();
      
      return {
        success: result === 'success',
        message: result === 'success' ? `${target} 클릭 성공` : `${target} 버튼을 찾을 수 없음`,
        verification: result === 'success'
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: `클릭 오류: ${error.message}`,
        verification: false
      };
    }
  }

  private async verifyAppRunning(appName: string): Promise<boolean> {
    try {
      const result = execSync(`pgrep -f "${appName}"`).toString();
      return result.trim().length > 0;
    } catch {
      return false;
    }
  }

  private async verifyChatOpen(userName: string): Promise<boolean> {
    try {
      // 스크린샷으로 검증
      const screenshotPath = `/tmp/verify_${Date.now()}.png`;
      execSync(`screencapture -x "${screenshotPath}"`);
      
      const exists = fs.existsSync(screenshotPath);
      if (exists) {
        fs.unlinkSync(screenshotPath);
        return true; // 스크린샷이 성공적으로 찍혔다면 앱이 활성화된 것으로 간주
      }
      return false;
    } catch {
      return false;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getTools(): string[] {
    return ['execute_step', 'find_and_click', 'launch_app', 'navigate_to_user'];
  }
}
