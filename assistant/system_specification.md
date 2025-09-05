# Q Screen Automation System Specification

## 📋 System Overview

**Project Name:** Amazon Q Screen Automation  
**Version:** 1.0.0  
**Architecture:** Hybrid (Local + Cloud)  
**Target Platform:** macOS  
**Primary Language:** TypeScript  

## 🎯 Requirements Analysis

### 1. Functional Requirements

#### FR-001: Voice Command Processing
- **Description:** 사용자 음성 명령을 자연어로 인식하고 처리
- **Input:** 음성 데이터 (Speech Framework)
- **Output:** 구조화된 명령 객체
- **Priority:** High
- **Dependencies:** macOS Speech Framework, Amazon Bedrock

#### FR-002: Screen Analysis & Understanding
- **Description:** 현재 화면 상태를 분석하고 UI 요소를 인식
- **Input:** 스크린샷 이미지
- **Output:** UI 요소 맵, 텍스트 정보, 상호작용 가능 영역
- **Priority:** Critical
- **Dependencies:** AWS Rekognition, macOS Vision Framework

#### FR-003: Intelligent Action Planning
- **Description:** 사용자 목표를 달성하기 위한 액션 시퀀스 계획
- **Input:** 사용자 의도, 현재 화면 상태
- **Output:** 실행 가능한 액션 플랜
- **Priority:** High
- **Dependencies:** Amazon Bedrock Claude

#### FR-004: Cross-Application Automation
- **Description:** 여러 애플리케이션 간 자동화 워크플로우 실행
- **Input:** 액션 플랜
- **Output:** 실행 결과, 성공/실패 상태
- **Priority:** Critical
- **Dependencies:** macOS Accessibility API, IOKit

#### FR-005: Error Recovery & Adaptation
- **Description:** 실행 중 오류 발생 시 자동 복구 및 대안 제시
- **Input:** 오류 상태, 컨텍스트 정보
- **Output:** 복구 액션 또는 사용자 알림
- **Priority:** Medium
- **Dependencies:** AI Planning Engine

### 2. Non-Functional Requirements

#### NFR-001: Performance
- **Response Time:** 단순 액션 < 500ms, 복잡한 분석 < 3s
- **Throughput:** 동시 10개 워크플로우 처리
- **Resource Usage:** CPU < 20%, Memory < 512MB

#### NFR-002: Reliability
- **Availability:** 99.5% 로컬 시스템 가용성
- **Error Rate:** < 5% 액션 실패율
- **Recovery Time:** 자동 복구 < 10s

#### NFR-003: Security
- **Data Protection:** 스크린샷 로컬 암호화
- **Privacy:** 민감 정보 AWS 전송 금지
- **Authentication:** AWS IAM 기반 인증

#### NFR-004: Maintainability
- **Code Coverage:** > 80% 테스트 커버리지
- **Documentation:** 모든 공개 API 문서화
- **Modularity:** MCP 기반 플러그인 아키텍처

#### NFR-005: Usability
- **Learning Curve:** 5분 내 기본 사용법 습득
- **Error Messages:** 명확하고 실행 가능한 오류 메시지
- **Accessibility:** macOS 접근성 표준 준수

## 🏗️ System Architecture Design

### 1. Layered Architecture

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │  ← Voice/CLI Interface
├─────────────────────────────────────────┤
│            Application Layer            │  ← Business Logic
├─────────────────────────────────────────┤
│             Domain Layer                │  ← Core Models
├─────────────────────────────────────────┤
│          Infrastructure Layer           │  ← External Services
└─────────────────────────────────────────┘
```

### 2. Component Diagram

```typescript
// Core Domain Models
interface WorkflowEngine {
  execute(plan: ActionPlan): Promise<ExecutionResult>;
  pause(): void;
  resume(): void;
  cancel(): void;
}

interface ScreenAnalyzer {
  analyze(image: ScreenImage): Promise<ScreenContext>;
  detectElements(image: ScreenImage): Promise<UIElement[]>;
  extractText(image: ScreenImage): Promise<TextRegion[]>;
}

interface ActionExecutor {
  click(target: UIElement): Promise<boolean>;
  type(text: string, target?: UIElement): Promise<boolean>;
  scroll(direction: Direction, amount: number): Promise<boolean>;
}

interface AIPlanner {
  createPlan(intent: UserIntent, context: ScreenContext): Promise<ActionPlan>;
  adaptPlan(plan: ActionPlan, error: ExecutionError): Promise<ActionPlan>;
  suggestNext(context: ScreenContext): Promise<Suggestion[]>;
}
```

## 🔧 Detailed Design

### 1. Core Domain Models

```typescript
// src/domain/models/core.ts
export class UserIntent {
  constructor(
    public readonly id: string,
    public readonly description: string,
    public readonly parameters: Map<string, any>,
    public readonly priority: Priority = Priority.NORMAL
  ) {}

  static fromVoiceCommand(command: string): UserIntent {
    // Natural language processing logic
  }
}

export class ScreenContext {
  constructor(
    public readonly timestamp: Date,
    public readonly applicationName: string,
    public readonly elements: UIElement[],
    public readonly textRegions: TextRegion[],
    public readonly screenshot: ScreenImage
  ) {}

  findElement(selector: ElementSelector): UIElement | null {
    return this.elements.find(element => selector.matches(element)) || null;
  }

  getClickableElements(): UIElement[] {
    return this.elements.filter(element => element.isClickable);
  }
}

export class ActionPlan {
  constructor(
    public readonly id: string,
    public readonly steps: ActionStep[],
    public readonly estimatedDuration: number,
    public readonly confidence: number
  ) {}

  getNextStep(): ActionStep | null {
    return this.steps.find(step => step.status === StepStatus.PENDING) || null;
  }

  markStepCompleted(stepId: string): void {
    const step = this.steps.find(s => s.id === stepId);
    if (step) step.status = StepStatus.COMPLETED;
  }
}
```

### 2. Application Services

```typescript
// src/application/services/WorkflowService.ts
export class WorkflowService {
  constructor(
    private screenAnalyzer: ScreenAnalyzer,
    private aiPlanner: AIPlanner,
    private actionExecutor: ActionExecutor,
    private logger: Logger
  ) {}

  async executeWorkflow(intent: UserIntent): Promise<WorkflowResult> {
    try {
      // 1. Analyze current screen
      const context = await this.analyzeCurrentScreen();
      
      // 2. Create execution plan
      const plan = await this.aiPlanner.createPlan(intent, context);
      
      // 3. Execute plan with error handling
      return await this.executePlanWithRecovery(plan);
      
    } catch (error) {
      this.logger.error('Workflow execution failed', { intent, error });
      throw new WorkflowExecutionError(error.message, intent);
    }
  }

  private async executePlanWithRecovery(plan: ActionPlan): Promise<WorkflowResult> {
    const results: StepResult[] = [];
    
    for (const step of plan.steps) {
      try {
        const result = await this.executeStep(step);
        results.push(result);
        
        if (!result.success) {
          // Attempt recovery
          const recoveredPlan = await this.aiPlanner.adaptPlan(plan, result.error);
          return await this.executePlanWithRecovery(recoveredPlan);
        }
        
      } catch (error) {
        return WorkflowResult.failure(results, error);
      }
    }
    
    return WorkflowResult.success(results);
  }
}
```

### 3. Infrastructure Layer

```typescript
// src/infrastructure/mcp/MCPServerManager.ts
export class MCPServerManager {
  private servers = new Map<string, MCPServer>();
  private healthChecker: HealthChecker;

  constructor(private config: MCPConfiguration) {
    this.healthChecker = new HealthChecker(this.servers);
  }

  async registerServer(name: string, server: MCPServer): Promise<void> {
    await server.initialize();
    this.servers.set(name, server);
    
    // Start health monitoring
    this.healthChecker.monitor(name, server);
    
    this.logger.info(`MCP Server registered: ${name}`);
  }

  async callTool<T>(serverName: string, toolName: string, params: any): Promise<T> {
    const server = this.servers.get(serverName);
    if (!server) {
      throw new MCPServerNotFoundError(serverName);
    }

    if (!server.isHealthy()) {
      await this.restartServer(serverName);
    }

    return await server.callTool<T>(toolName, params);
  }

  private async restartServer(serverName: string): Promise<void> {
    const server = this.servers.get(serverName);
    if (server) {
      await server.restart();
      this.logger.warn(`MCP Server restarted: ${serverName}`);
    }
  }
}
```

### 4. Error Handling Strategy

```typescript
// src/domain/errors/SystemErrors.ts
export abstract class SystemError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: any
  ) {
    super(message);
    this.name = this.constructor.name;
  }

  abstract isRecoverable(): boolean;
  abstract getSuggestion(): string;
}

export class ScreenAnalysisError extends SystemError {
  constructor(message: string, context?: any) {
    super(message, 'SCREEN_ANALYSIS_ERROR', context);
  }

  isRecoverable(): boolean {
    return true; // Can retry with different parameters
  }

  getSuggestion(): string {
    return 'Try taking a new screenshot or adjusting screen resolution';
  }
}

export class ActionExecutionError extends SystemError {
  constructor(message: string, public readonly action: ActionStep, context?: any) {
    super(message, 'ACTION_EXECUTION_ERROR', context);
  }

  isRecoverable(): boolean {
    return this.action.retryCount < 3;
  }

  getSuggestion(): string {
    return `Failed to execute ${this.action.type}. Trying alternative approach.`;
  }
}
```

### 5. Configuration Management

```typescript
// src/infrastructure/config/ConfigurationManager.ts
export class ConfigurationManager {
  private config: SystemConfiguration;
  private watchers = new Map<string, ConfigWatcher>();

  constructor(private configPath: string) {
    this.loadConfiguration();
    this.setupConfigWatching();
  }

  get<T>(key: string, defaultValue?: T): T {
    return this.config.get(key) ?? defaultValue;
  }

  async update(key: string, value: any): Promise<void> {
    this.config.set(key, value);
    await this.saveConfiguration();
    this.notifyWatchers(key, value);
  }

  watch(key: string, callback: (value: any) => void): void {
    if (!this.watchers.has(key)) {
      this.watchers.set(key, new ConfigWatcher());
    }
    this.watchers.get(key)!.addCallback(callback);
  }

  private loadConfiguration(): void {
    try {
      const configData = fs.readFileSync(this.configPath, 'utf-8');
      this.config = new SystemConfiguration(JSON.parse(configData));
    } catch (error) {
      this.config = SystemConfiguration.createDefault();
      this.saveConfiguration();
    }
  }
}
```

## 🧪 Testing Strategy

### 1. Test Pyramid

```typescript
// Unit Tests (70%)
describe('WorkflowService', () => {
  let service: WorkflowService;
  let mockScreenAnalyzer: jest.Mocked<ScreenAnalyzer>;
  let mockAIPlanner: jest.Mocked<AIPlanner>;

  beforeEach(() => {
    mockScreenAnalyzer = createMockScreenAnalyzer();
    mockAIPlanner = createMockAIPlanner();
    service = new WorkflowService(mockScreenAnalyzer, mockAIPlanner, ...);
  });

  it('should execute simple workflow successfully', async () => {
    // Given
    const intent = UserIntent.fromVoiceCommand('Click the send button');
    mockScreenAnalyzer.analyze.mockResolvedValue(mockScreenContext);
    mockAIPlanner.createPlan.mockResolvedValue(mockActionPlan);

    // When
    const result = await service.executeWorkflow(intent);

    // Then
    expect(result.success).toBe(true);
    expect(mockScreenAnalyzer.analyze).toHaveBeenCalledOnce();
  });
});

// Integration Tests (20%)
describe('MCP Integration', () => {
  it('should communicate between screen analysis and action execution', async () => {
    const screenMCP = new ScreenAnalysisMCP();
    const actionMCP = new ActionExecutionMCP();
    
    const analysis = await screenMCP.analyze(testImage);
    const result = await actionMCP.click(analysis.elements[0]);
    
    expect(result).toBe(true);
  });
});

// E2E Tests (10%)
describe('End-to-End Workflows', () => {
  it('should complete Gmail email composition workflow', async () => {
    const workflow = new WorkflowService(...);
    const intent = UserIntent.fromVoiceCommand(
      'Compose email to john@example.com with subject "Meeting" and body "Let\'s meet tomorrow"'
    );
    
    const result = await workflow.executeWorkflow(intent);
    
    expect(result.success).toBe(true);
    expect(result.steps).toHaveLength(5); // Open Gmail, click compose, fill fields, send
  });
});
```

### 2. Mock Strategy

```typescript
// tests/mocks/MockFactories.ts
export class MockFactories {
  static createScreenContext(overrides?: Partial<ScreenContext>): ScreenContext {
    return new ScreenContext(
      new Date(),
      'Gmail',
      [MockFactories.createUIElement()],
      [MockFactories.createTextRegion()],
      MockFactories.createScreenImage(),
      ...overrides
    );
  }

  static createUIElement(overrides?: Partial<UIElement>): UIElement {
    return new UIElement(
      'button-send',
      ElementType.BUTTON,
      new Rectangle(100, 200, 80, 30),
      true, // isClickable
      'Send',
      ...overrides
    );
  }
}
```

## 📊 Performance Monitoring

### 1. Metrics Collection

```typescript
// src/infrastructure/monitoring/MetricsCollector.ts
export class MetricsCollector {
  private metrics = new Map<string, Metric>();

  recordExecutionTime(operation: string, duration: number): void {
    const metric = this.getOrCreateMetric(operation);
    metric.addSample(duration);
  }

  recordSuccess(operation: string): void {
    this.recordOutcome(operation, 'success');
  }

  recordFailure(operation: string, error: Error): void {
    this.recordOutcome(operation, 'failure');
    this.recordError(operation, error);
  }

  getMetrics(): MetricsSnapshot {
    return new MetricsSnapshot(
      Array.from(this.metrics.values()),
      new Date()
    );
  }
}
```

### 2. Health Checks

```typescript
// src/infrastructure/health/HealthChecker.ts
export class HealthChecker {
  async checkSystemHealth(): Promise<HealthReport> {
    const checks = await Promise.allSettled([
      this.checkMCPServers(),
      this.checkAWSConnectivity(),
      this.checkLocalResources(),
      this.checkPermissions()
    ]);

    return new HealthReport(
      checks.map((result, index) => ({
        name: this.checkNames[index],
        status: result.status === 'fulfilled' ? 'healthy' : 'unhealthy',
        details: result.status === 'fulfilled' ? result.value : result.reason
      }))
    );
  }
}
```

## 🔄 Deployment Strategy

### 1. Local Development

```bash
# Development setup
npm run dev:setup          # Install dependencies, configure permissions
npm run dev:start          # Start all MCP servers in development mode
npm run dev:test:watch     # Run tests in watch mode
```

### 2. Production Build

```bash
# Production build
npm run build              # Compile TypeScript, bundle assets
npm run package            # Create macOS app bundle
npm run sign               # Code signing for distribution
```

### 3. Update Mechanism

```typescript
// src/infrastructure/updates/UpdateManager.ts
export class UpdateManager {
  async checkForUpdates(): Promise<UpdateInfo | null> {
    const currentVersion = this.getCurrentVersion();
    const latestVersion = await this.fetchLatestVersion();
    
    if (this.isNewerVersion(latestVersion, currentVersion)) {
      return new UpdateInfo(latestVersion, this.getUpdateDetails(latestVersion));
    }
    
    return null;
  }

  async downloadAndInstallUpdate(updateInfo: UpdateInfo): Promise<void> {
    // Download update package
    const updatePackage = await this.downloadUpdate(updateInfo);
    
    // Verify signature
    await this.verifyUpdateSignature(updatePackage);
    
    // Install update
    await this.installUpdate(updatePackage);
    
    // Restart application
    this.scheduleRestart();
  }
}
```

이 설계는 유지보수성, 가독성, 확장성을 모두 고려한 엔터프라이즈급 아키텍처입니다. 각 레이어가 명확히 분리되어 있고, 의존성 주입과 인터페이스를 통한 추상화로 테스트와 확장이 용이합니다.
