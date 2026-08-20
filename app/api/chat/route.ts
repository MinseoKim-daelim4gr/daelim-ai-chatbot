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
    // "gemini-2.5-flash"처럼 버전을 직접 못 박으면, 구글이 그 버전을 신규
    // 사용자에게 막아버리는 순간(실제로 이번에 발생) 발표 직전에 API가 통째로
    // 죽어버릴 수 있음. 대신 구글이 공식 제공하는 "최신 flash 모델"로 항상
    // 자동으로 갈아타는 별칭(alias)을 사용해서, 특정 버전이 나중에 또
    // 막히더라도 코드 수정 없이 계속 동작하게 함
    // (※ 무료 티어 요청 한도가 넉넉한 gemini-3.1-flash-lite로 바꿔봤었는데,
    // 실제 동작 확인이 안 된 상태라 확실히 검증된 이 별칭으로 되돌림.
    // 요청 한도가 부족하면 발표 끝난 뒤 다시 검토해도 늦지 않음)
    model: google("gemini-flash-latest"),
    system: buildSystemPrompt(),
    prompt: message,
    // 구글 서버가 일시적으로 혼잡(503)할 때 SDK 기본값(2회 재시도)은 한 번
    // 실패할 때마다 수십 초씩 걸려서 사용자를 오래 기다리게 함. 재시도 횟수를
    // 줄여서 빨리 포기시키고, 대신 화면의 "다시 시도" 버튼으로 사용자가
    // 원할 때 바로 다시 요청하게 함 (무한정 기다리는 것보다 나은 경험)
    maxRetries: 1,
    onError: ({ error }) => {
      // AI SDK 기본 동작은 이 에러를 콘솔에 아주 길게 통째로 찍는데, 대부분은
      // 구글 서버 쪽 일시 장애(고트래픽 503 등)라 우리 코드 버그가 아님.
      // 로그를 짧게 남겨서 실제 코드 문제와 구분하기 쉽게 함
      console.error("[/api/chat] Gemini 호출 실패:", error);
    },
  });

  return result.toTextStreamResponse();
}