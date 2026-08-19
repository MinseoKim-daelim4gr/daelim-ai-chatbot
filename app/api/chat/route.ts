import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { buildSystemPrompt } from "@/lib/knowledge";

// 버튼 메뉴 / 키워드 FAQ / 무관 질문 리다이렉트에 하나도 안 걸렸을 때만 호출되는
// 안전망 API. lib/knowledge.ts의 시스템 프롬프트 규칙대로 "이전 대화를 기억하지
// 못한다"는 설계를 그대로 따라서, 매 요청마다 이전 맥락 없이 이번 질문 하나만
// 독립적으로 처리합니다 (환각/스코프 이탈 위험을 줄이기 위한 의도적인 선택).
export async function POST(req: Request) {
  const { message }: { message: string } = await req.json();

  const result = streamText({
    // Gemini 무료 티어에서 쓰기 좋은 모델. 더 가벼운 게 필요하면
    // "gemini-2.5-flash-lite"로 바꿔도 됩니다.
    model: google("gemini-2.5-flash"),
    system: buildSystemPrompt(),
    prompt: message,
  });

  return result.toTextStreamResponse();
}
