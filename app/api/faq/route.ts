import { NextResponse } from "next/server";
import { matchFaq } from "@/lib/faq";
import {
  isInScope,
  hasOffTopicInjection,
  BLOCKED_MESSAGE,
  INJECTION_BLOCKED_MESSAGE,
} from "@/lib/scope";

// GET /api/faq?q=수강&prev=직전질문
// 0) 문장에 학사와 무관한 키워드(날씨/스포츠/연예인 등)가 섞여 있으면 다른 걸
//    다 따지기 전에 그 자리에서 바로 차단합니다("장학금 궁금한데 오늘 날씨는
//    어때?" 같은 화이트리스트 우회 시도 방지, 아래 프롬프트 인젝션 방지 섹션 참고).
// 1) 학사 관련 키워드 FAQ 매칭을 먼저 시도합니다.
// 2) 매칭이 없으면 학사 관련 키워드(lib/scope.ts)가 하나라도 있는지 확인합니다.
//    하나도 없으면 그 자리에서 차단합니다.
// 이 엔드포인트는 LLM을 호출하지 않는 100% 결정적인 엔드포인트입니다.
//
// ─ (도입했다가 되돌린 것) 경계선 질문 Gemini 판단 ───────────────────────
// 한때 화이트리스트에 없는 "경계선" 질문(예: "동아리 어떻게 가입해요?")을
// Gemini에게 관련 여부만 짧게 물어보고 통과시키는 단계(lib/scope.ts의
// isRelatedToSchoolByAI)를 넣었었습니다. 그런데 실제 사용 중인 Gemini 3.7
// Flash 무료 티어가 분당 5회·일일 20회로 한도가 매우 빠듯하다는 걸 확인한
// 뒤 다시 뺐습니다. 이 한도는 진짜 답변을 만드는 /api/chat 호출과 공유되는
// 예산이라, 판단 호출 하나하나가 그 얼마 안 되는 하루 20회를 갉아먹어서
// 정작 실제 AI 답변이 필요한 순간에 쓸 예산이 없어질 위험이 더 큽니다.
// 그래서 화이트리스트에 없는 경계선 질문은 다시 결정적으로 차단하고, 자주
// 나올 법한 항목(동아리/기숙사/축제 등)은 IN_SCOPE_KEYWORDS에 직접 등록해서
// LLM 호출 없이 커버합니다. isRelatedToSchoolByAI 함수 자체는 lib/scope.ts에
// 그대로 남겨뒀으니, 나중에 유료 티어로 올리거나 한도가 넉넉한 모델로 바꾸면
// 이 파일에서 다시 불러오기만 하면 됩니다.
//
// ─ 프롬프트 인젝션(화이트리스트 우회) 방지 ─────────────────────────────
// "장학금 궁금한데 오늘 날씨는 어때?"처럼 화이트리스트 키워드("장학")와 학사와
// 전혀 무관한 요청(날씨)이 한 문장에 섞이면, 원래는 "장학"이라는 키워드 때문에
// 화이트리스트를 통과해서 Gemini까지 넘어갔습니다. 그 이후엔 시스템 프롬프트의
// 지시(무관한 내용은 답하지 말 것)에만 기대게 되는데, 이는 100% 확정적인 방어가
// 아닙니다. 그래서 이제는 lib/scope.ts의 OFF_TOPIC_INJECTION_KEYWORDS(날씨/
// 스포츠/연예인/시사 등 명백히 무관한 키워드 목록)에 하나라도 걸리면, 화이트
// 리스트 통과 여부·FAQ 매칭 여부와 무관하게 이 자리에서 바로 차단합니다(Gemini
// 호출 자체를 안 함). 목록에 없는 새로운 우회 시도까지 전부 막지는 못하지만,
// 데모에서 나왔던 패턴과 비슷한 시도들은 결정적으로 막아주는 안전장치입니다.
// ─ 직전 질문과 이어지는 후속 질문 처리 ─────────────────────────────────
// 사용자는 "이어서 질문할게요" 같은 사족 없이 그냥 "온라인으로 무료로 받고
// 싶은데 방법 있어?"처럼 물어봅니다. 이 문장만 보면 학사 키워드가 하나도
// 없어서 원래는 그 자리에서 차단됐습니다(예: 직전에 "졸업증명서 발급방법"을
// 물어본 맥락이 이 문장 자체엔 없음). 그래서 이번 질문 단독으로 막힐 때만,
// 프론트가 같이 보내주는 직전 질문(prev)과 합쳐서 한 번 더 판단합니다.
// 합친 문장이 학사 범위로 인정되면 usedContext=true로 표시하고, 그 합친
// 문장을 그대로 Gemini에게 넘겨서(자유 질문 단계) 맥락이 살아있는 채로
// 답하게 합니다. 전체 대화 기록을 기억하는 게 아니라, 바로 직전 한 턴만
// 필요할 때 이어붙이는 가벼운 방식이라 환각/스코프 이탈 위험이 크게 늘지
// 않습니다.
//
// 이 경우 일부러 FAQ 재매칭을 하지 않습니다. 직전 질문의 키워드(예: "증명서")가
// 합쳐진 문장에 그대로 남아있어서, 후속 질문이 실제로 물어본 더 구체적인
// 내용(예: "온라인으로 무료로 되는지")과 무관하게 직전과 같은 FAQ 목록만
// 반복 노출되는 문제가 있었습니다. FAQ는 정확한 방법/개요는 잘 알려주지만
// "무료 여부"처럼 세부적인 후속 질문에는 답하지 못하는 경우가 많으므로,
// 이런 맥락 이어붙이기 상황에서는 바로 Gemini 자유 답변 단계로 넘겨서
// 갖고 있는 지식 안에서 구체적으로 답하게 합니다(정보가 없으면 없다고
// 정직하게 답하도록 시스템 프롬프트에서 이미 강제하고 있음).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const prev = (searchParams.get("prev") || "").trim();

  // 0) 프롬프트 인젝션(화이트리스트 우회) 방지: FAQ 매칭이나 스코프 체크보다
  //    먼저 확인해서, "장학금 궁금한데 오늘 날씨는 어때?" 같은 문장이 FAQ나
  //    Gemini까지 넘어가지 못하게 이 자리에서 끊습니다.
  if (hasOffTopicInjection(q)) {
    return NextResponse.json({
      query: q,
      effectiveQuery: q,
      usedContext: false,
      matches: [],
      blocked: true,
      blockedMessage: INJECTION_BLOCKED_MESSAGE,
    });
  }

  let matches = matchFaq(q);
  let effectiveQuery = q;
  let usedContext = false;

  if (matches.length === 0 && !isInScope(q) && prev) {
    const combined = `${prev} ${q}`.trim();
    if (isInScope(combined)) {
      effectiveQuery = combined;
      usedContext = true;
      // matches는 일부러 비워둠 → 프론트에서 자동으로 Gemini 자유 답변으로 진행됨
    }
  }

  const mappedMatches = matches.map((item) => ({
    id: item.id,
    question: item.question,
  }));

  const blocked = mappedMatches.length === 0 ? !isInScope(effectiveQuery) : false;

  return NextResponse.json({
    query: q,
    effectiveQuery,
    usedContext,
    matches: mappedMatches,
    blocked,
    blockedMessage: blocked ? BLOCKED_MESSAGE : null,
  });
}