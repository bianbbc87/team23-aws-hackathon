import * as fs from 'fs';
import * as path from 'path';
import { ScreenAnalysisMCP } from '../mcp/screen_analysis_mcp';
import { ActionExecutionMCP } from '../mcp/action_execution_mcp';
import { AIPlanningMCP } from '../mcp/ai_planning_mcp';
import { AppSpecificMCP } from '../mcp/app_specific_mcp';
import { AWSIntegrationMCP } from '../mcp/aws_integration_mcp';
import { WorkflowMCP } from '../mcp/workflow_mcp';

export class MCPManager {
  private mcps: Map<string, any> = new Map();
  private config: any;

  constructor() {
    this.loadConfig();
  }

  private loadConfig(): void {
    const configPath = path.join(__dirname, '../../config/mcp_servers.json');
    try {
      this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (error) {
      console.log('⚠️ Config file not found, using default configuration');
      this.config = {
        servers: {
          screen_analysis: { config: {} },
          action_execution: { config: {} },
          ai_planning: { config: {} },
          kakaotalk: { config: {} },
          slack: { config: {} },
          gmail: { config: {} },
          aws_integration: { config: {} },
          workflow: { config: {} }
        }
      };
    }
  }

  async initialize(): Promise<void> {
    console.log('🚀 MCP 매니저 초기화 (6개 도메인)');

    // 1. Screen Analysis MCP
    const screenAnalysis = new ScreenAnalysisMCP(this.config.servers.screen_analysis?.config || {});
    await screenAnalysis.initialize();
    this.mcps.set('screen_analysis', screenAnalysis);

    // 2. Action Execution MCP
    const actionExecution = new ActionExecutionMCP(this.config.servers.action_execution?.config || {});
    await actionExecution.initialize();
    this.mcps.set('action_execution', actionExecution);

    // 3. AI Planning MCP
    const aiPlanning = new AIPlanningMCP(this.config.servers.ai_planning?.config || {});
    await aiPlanning.initialize();
    this.mcps.set('ai_planning', aiPlanning);

    // 4. App-Specific MCPs
    const appSpecific = new AppSpecificMCP({
      kakaotalk: this.config.servers.kakaotalk?.config || {},
      slack: this.config.servers.slack?.config || {},
      gmail: this.config.servers.gmail?.config || {}
    });
    await appSpecific.initialize();
    this.mcps.set('app_specific', appSpecific);

    // 5. AWS Integration MCP
    const awsIntegration = new AWSIntegrationMCP(this.config.servers.aws_integration?.config || {});
    await awsIntegration.initialize();
    this.mcps.set('aws_integration', awsIntegration);

    // 6. Workflow MCP
    const workflow = new WorkflowMCP(this.config.servers.workflow?.config || {}, this);
    await workflow.initialize();
    this.mcps.set('workflow', workflow);

    console.log(`✅ ${this.mcps.size}개 MCP 도메인 초기화 완료`);
  }

  async callTool(mcpName: string, toolName: string, params: any): Promise<any> {
    const mcp = this.mcps.get(mcpName);
    if (!mcp) {
      throw new Error(`MCP not found: ${mcpName}`);
    }
    return await mcp.callTool(toolName, params);
  }

  getStatus(): any {
    const status: any = {};
    for (const [name, mcp] of this.mcps) {
      status[name] = {
        initialized: true,
        tools: mcp.getTools()
      };
    }
    return {
      domains: Array.from(this.mcps.keys()),
      totalTools: Array.from(this.mcps.values()).reduce((sum, mcp) => sum + mcp.getTools().length, 0),
      details: status
    };
  }

  getAvailableTools(): string[] {
    const tools: string[] = [];
    for (const [mcpName, mcp] of this.mcps) {
      const mcpTools = mcp.getTools();
      tools.push(...mcpTools.map((tool: string) => `${mcpName}.${tool}`));
    }
    return tools;
  }
}
