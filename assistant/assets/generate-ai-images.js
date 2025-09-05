import AWS from "aws-sdk";
import fs from "fs";
import path from "path";

AWS.config.credentials = new AWS.SharedIniFileCredentials({
  profile: process.env.PROFILE,
});
AWS.config.region = process.env.AWS_REGION;

// Bedrock Runtime 클라이언트 생성
const bedrock = new AWS.BedrockRuntime();

// 아이콘 생성 함수
async function generateIcon(prompt, filename) {
  const params = {
    modelId: "stability.stable-diffusion-xl-v1", // 아이콘 생성에 적합한 모델
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      text_prompts: [{ text: prompt, weight: 1 }],
      cfg_scale: 10,
      seed: Math.floor(Math.random() * 1000000),
      steps: 50,
      width: 1024,
      height: 1024,
      samples: 1,
    }),
  };

  try {
    const response = await bedrock.invokeModel(params).promise();
    const responseBody = JSON.parse(response.body.toString());

    if (responseBody.artifacts && responseBody.artifacts[0]) {
      const imageData = responseBody.artifacts[0].base64;
      const buffer = Buffer.from(imageData, "base64");

      fs.writeFileSync(path.join(__dirname, filename), buffer);
    }
  } catch (error) {
    console.error(`❌ Error generating ${filename}:`, error.message);
  }
}

async function main() {
  const prompts = {
    prompt:
      "Your Prompt",
    filename: `created-ai-${Date.now()}.png`,
  };

  // 아이콘 생성
  await generateIcon(prompts.prompt, prompts.filename);
}

// 실행과 catch
main().catch(console.error);
