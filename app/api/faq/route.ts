import { NextResponse } from "next/server";
import { matchFaq } from "@/lib/faq";
import { isInScope, BLOCKED_MESSAGE } from "@/lib/scope";

// GET /api/faq?q=수강
// 1) 학사 관련 키워드 FAQ 매칭을 먼저 시도합니다.
// 2) 매칭이 없으면 학사 관련 키워드(lib/scope.ts)가 하나라도 있는지 확인합니다.
//    하나도 없으면(날씨, 야구, 잡담 등 학교와 무관한 모든 질문) blocked=true를 내려서
//    Gemini를 아예 호출하지 않고 고정 문구만 보여주도록 합니다.
// 학사 관련 키워드가 있을 때만 /api/chat(Gemini)으로 넘어갑니다.
// 이 엔드포인트 자체는 LLM을 호출하지 않는 100% 결정적인 엔드포인트입니다.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  const matches = matchFaq(q).map((item) => ({
    id: item.id,
    question: item.question,
  }));

  const blocked = matches.length === 0 ? !isInScope(q) : false;

  return NextResponse.json({
    query: q,
    matches,
    blocked,
    blockedMessage: blocked ? BLOCKED_MESSAGE : null,
  });
}
