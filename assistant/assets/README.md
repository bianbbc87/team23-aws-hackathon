# 🎨 Assets - AI Generated Icons

이 폴더는 AWS Bedrock의 Stability AI를 사용하여 생성된 앱 아이콘들을 포함합니다.

## 🤖 생성 방법

```bash
# 아이콘 생성
node generate-icons.js
```

## 🎯 사용법

### Electron 앱에서 사용
```javascript
// main.js에서
const iconPath = path.join(__dirname, '../assets/image.png');
const mainWindow = new BrowserWindow({
  icon: iconPath,
  // ...
});
```

### 메뉴바 트레이에서 사용
```javascript
// 메뉴바 트레이 아이콘
const trayIconPath = path.join(__dirname, '../assets/image.png');
const tray = new Tray(trayIconPath);
```

## 🎨 디자인 특징

### 앱 아이콘
- 모던하고 미니멀한 디자인
- AI 음성 비서를 상징하는 마이크와 음파
- 블루-퍼플 그라데이션
- 3D 효과와 깊이감

### 메뉴바 아이콘
- 단색 실루엣 디자인
- macOS 스타일에 맞는 미니멀함
- 16x16 픽셀에 최적화
- 투명 배경

## 🔧 AWS 설정

이 아이콘들은 AWS Bedrock의 Stability AI (stable-diffusion-xl-v1) 모델을 사용하여 생성되었습니다.

```bash
# AWS 프로필 설정 필요
aws configure --profile {name}
```
