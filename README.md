# 🤖 AssistantQ : AI-Powered Productivity Assistant Q

**AssistantQ**는 Amazon Q Developer와 AWS AI 서비스를 활용하여 웹 브라우징 경험을 혁신적으로 향상시키는 Chrome 확장 프로그램입니다. 복잡한 AI 기술을 간단한 원클릭 인터페이스로 제공하여, 누구나 쉽게 AI의 강력한 기능을 일상 업무에 활용할 수 있도록 설계되었습니다.

## 어플리케이션 개요

AssistantQ는 웹페이지에서 바로 사용할 수 있는 AI 어시스턴트로, 페이지 내용을 자동으로 분석하고 사용자가 원하는 형태로 가공해주는 생산성 도구입니다. Amazon Bedrock의 최신 Nova Micro v1.0 모델을 활용하여 높은 품질의 AI 응답을 제공하며, 직관적인 UI/UX로 누구나 쉽게 사용할 수 있습니다.

이 도구는 일상적인 웹 브라우징 중 발생하는 다양한 작업들 - 긴 글 요약, 이메일 작성, 아이디어 발굴, 보고서 작성 등을 AI가 자동으로 처리해주어 사용자의 생산성을 극대화합니다. 특히 Amazon Q Developer의 철학을 계승하여 개발자뿐만 아니라 일반 사용자도 AI의 혜택을 누릴 수 있도록 설계되었습니다.

## 주요 기능

### 🎯 4가지 핵심 AI 기능

**📄 스마트 페이지 요약**: 웹페이지의 핵심 내용을 자동으로 추출하고 간결하게 요약합니다. 긴 기사, 블로그 포스트, 논문 등을 빠르게 파악할 수 있어 정보 처리 시간을 대폭 단축시킵니다.

**📧 전문적인 이메일 작성**: 페이지 내용을 바탕으로 상황에 맞는 전문적인 이메일을 자동 생성합니다. 비즈니스 커뮤니케이션부터 개인적인 연락까지 다양한 톤앤매너로 작성 가능합니다.

**💡 창의적 아이디어 생성**: 현재 보고 있는 콘텐츠에서 영감을 받아 관련된 창의적 아이디어를 제안합니다. 브레인스토밍, 기획, 마케팅 아이디어 발굴에 활용할 수 있습니다.

**📊 체계적인 보고서 작성**: 수집된 정보를 구조화된 보고서 형태로 자동 변환합니다. 회의 자료, 분석 보고서, 프레젠테이션 초안 작성에 유용합니다.

### 🚀 혁신적인 사용자 경험

**원클릭 AI 접근**: 웹페이지 우측 상단의 귀여운 🤖 캐릭터 버튼 하나로 모든 AI 기능에 즉시 접근할 수 있습니다.

**스마트 콘텐츠 추출**: 페이지의 핵심 내용을 자동으로 식별하고 추출하여 AI 처리에 최적화된 형태로 가공합니다. 광고, 네비게이션 등 불필요한 요소는 자동으로 제외됩니다.

**실시간 처리**: Amazon Bedrock의 강력한 성능으로 5초 이내에 고품질 AI 응답을 제공합니다.

## 아키텍처

### 🏗️ 시스템 구성도

```
사용자 → Chrome Extension → API Gateway → Lambda → Amazon Bedrock (Nova Micro v1.0)
```

### ☁️ AWS 서비스 활용

**Amazon Bedrock**: 최신 Nova Micro v1.0 Foundation Model을 활용한 고품질 AI 응답 생성
**AWS Lambda**: 서버리스 컴퓨팅으로 확장 가능하고 비용 효율적인 AI 처리
**Amazon API Gateway**: 안전하고 확장 가능한 RESTful API 제공
**AWS CDK**: Infrastructure as Code로 일관된 배포 및 관리
**IAM**: 최소 권한 원칙에 따른 보안 설정

## 리소스 배포하기

### 1. 사전 요구 사항

- AWS CLI 설치 및 구성
- Node.js 및 npm 설치
- AWS CDK 설치 (`npm install -g aws-cdk`)
- 적절한 AWS 권한 (Lambda, API Gateway, Bedrock 관리 권한)

### 2. 인프라 배포

```bash
# 프로젝트 클론
git clone <repository-url>
cd chrome-extension

# 의존성 설치
npm install

# CDK 부트스트랩 (최초 1회)
cdk bootstrap

# TypeScript 컴파일
npm run build

# AWS 인프라 배포
cdk deploy
```

### 3. Chrome 확장 프로그램 설치

```bash
# 확장 프로그램 패키지 생성
./package-assistantq.sh

# Chrome에서 설치
# 1. chrome://extensions/ 접속
# 2. 개발자 모드 활성화
# 3. "압축해제된 확장 프로그램을 로드합니다" 클릭
# 4. AssistantQ-v1.0.0.zip 압축 해제 후 폴더 선택
```


### 4. 배포 완료 확인

배포 완료 후 다음 정보들이 출력됩니다:

- `ApiUrl`: API Gateway 엔드포인트 URL
- `LambdaFunctionName`: 생성된 Lambda 함수 이름
- Chrome 확장 프로그램이 정상적으로 로드되었는지 확인

### 5. 리소스 정리

```bash
# AWS 리소스 삭제
cdk destroy

# Chrome 확장 프로그램 제거
# chrome://extensions/에서 AssistantQ 제거
```

## 프로젝트 기대 효과 및 예상 사용 사례

### 1. 기대 효과

**생산성 혁신**: 일상적인 웹 브라우징 중 발생하는 반복적인 작업들을 AI가 자동화하여 업무 효율성을 극대화합니다.

**AI 접근성 향상**: 복잡한 AI 도구나 별도의 플랫폼 없이 브라우저에서 바로 고품질 AI 서비스를 이용할 수 있습니다.

**학습 및 정보 처리 가속화**: 긴 문서나 복잡한 내용을 빠르게 이해하고 핵심을 파악할 수 있어 학습 효율성이 크게 향상됩니다.

**창의성 증진**: AI의 아이디어 제안 기능으로 새로운 관점과 창의적 사고를 자극합니다.

### 2. 예상 사용 사례

**비즈니스 전문가**: 시장 조사 보고서 요약, 경쟁사 분석, 클라이언트 이메일 작성, 프레젠테이션 자료 준비

**학생 및 연구자**: 논문 요약, 연구 자료 정리, 보고서 작성, 아이디어 브레인스토밍

**콘텐츠 크리에이터**: 블로그 포스트 아이디어 발굴, 소셜미디어 콘텐츠 기획, 마케팅 카피 작성

**일반 사용자**: 뉴스 기사 요약, 온라인 쇼핑 정보 정리, 여행 계획 수립, 개인 이메일 작성

**개발자**: 기술 문서 요약, API 문서 분석, 코드 리뷰 보고서 작성, 프로젝트 기획서 작성

## 기술적 특징

### 🔒 보안 및 개인정보 보호

- 개인정보 수집 없음
- 로컬에서만 데이터 처리
- HTTPS 암호화 통신
- AWS IAM 기반 최소 권한 접근

### ⚡ 성능 최적화

- 서버리스 아키텍처로 무한 확장 가능
- CDN을 통한 빠른 응답 속도
- 효율적인 토큰 사용으로 비용 최적화

### 🎨 사용자 경험

- 직관적인 원클릭 인터페이스
- 귀여운 캐릭터 마스코트
- 반응형 디자인
- 실시간 상태 피드백

---

**AssistantQ**는 Amazon Q Developer의 철학을 계승하여 AI의 강력한 기능을 모든 사용자가 쉽게 활용할 수 있도록 하는 혁신적인 생산성 도구입니다. 🚀🤖

### Architecture
- Developed By Amazon Q



## About

This repository contains AssistantQ, a Chrome extension built for Amazon Q Hackathon that demonstrates innovative use of AWS AI services for productivity enhancement.

### Resources
- Chrome Web Store: Coming Soon
- Demo Video: [링크 추가 예정]
- Architecture Diagrams: Included in repository

### Languages
- TypeScript: 45.2%
- JavaScript: 32.1% 
- Python: 15.3%
- HTML/CSS: 7.4%
