#!/bin/bash
# AssistantQ Chrome Extension Packaging Script

echo "📦 Creating AssistantQ Chrome Extension Package..."

# 임시 디렉토리 생성
mkdir -p assistantq-extension

# extension 폴더 전체 복사
cp -r extension/* assistantq-extension/

# ZIP 파일 생성
cd assistantq-extension
zip -r ../AssistantQ-v1.0.0.zip .
cd ..

# 임시 디렉토리 정리
rm -rf assistantq-extension

echo "✅ AssistantQ Extension Package Created!"
echo "📁 File: AssistantQ-v1.0.0.zip"
echo ""
echo "🚀 크롬 웹스토어 심사 준비 완료!"
echo "📋 포함된 내용:"
echo "• manifest.json (v3)"
echo "• content.js (AI 기능)"
echo "• popup.html/js (UI)"
echo "• 캐릭터 이미지"
echo ""
echo "🎯 AssistantQ - AI-Powered Productivity Assistant"
