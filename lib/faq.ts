// =========================================================================
// 키워드 매칭 FAQ (고려대 KUChat처럼 "수강"이라고 치면 관련 질문들이 목록으로
// 나오고, 그중 하나를 선택하면 미리 작성된 답변이 나오는 방식)
// -------------------------------------------------------------------------
// LLM을 거치지 않기 때문에 100% 정확하고 빠릅니다. 시연 때 가장 믿을 수 있는
// 부분이니 keywords와 answer를 최대한 채워주세요. 같은 주제라도 다양한 표현
// (예: "수강신청", "강의 신청", "과목 신청")을 keywords에 함께 넣어두면
// 학생들이 어떻게 입력하든 잘 잡힙니다.
// =========================================================================

import { OFFICIAL_LINKS } from "./links";
import type { LinkButton } from "./menu";

export type FaqItem = {
  id: string;
  // 사용자가 입력한 문장에 이 키워드들 중 하나라도 포함되면(또는 이 키워드가
  // 사용자의 짧은 입력을 포함하면) 이 항목이 추천 목록에 뜹니다.
  keywords: string[];
  // 추천 목록에 보여줄 질문 문구 (KUChat의 "교양 과목 수강 안내해주세요" 같은 것)
  question: string;
  // 선택했을 때 바로 보여줄 답변
  answer: string;
  link?: LinkButton;
};

export const FAQ_ITEMS: FaqItem[] = [
  // ----- 장학금 -----
  {
    id: "scholarship-types",
    keywords: ["장학금 종류", "장학금", "장학"],
    question: "장학금 종류가 궁금해요",
    answer:
      "[실제 정보로 교체] 대림대학교 장학금은 성적우수장학금, 국가장학금(1·2유형), 근로장학금, 특별장학금 등이 있어요.",
    link: { label: "장학 안내 페이지로 이동", url: OFFICIAL_LINKS.scholarship },
  },
  {
    id: "scholarship-apply",
    keywords: ["장학금 신청", "장학 신청", "신청 방법"],
    question: "장학금은 어떻게 신청하나요?",
    answer:
      "[실제 정보로 교체] 대림대 포털 로그인 → 장학금 메뉴에서 학기 초 공지된 기간 내 신청하면 됩니다.",
    link: { label: "포털 바로가기", url: OFFICIAL_LINKS.portal },
  },
  {
    id: "scholarship-national",
    keywords: ["국가장학금"],
    question: "국가장학금은 어떻게 신청하나요?",
    answer:
      "[실제 정보로 교체] 국가장학금은 한국장학재단 홈페이지에서 매 학기 별도로 신청해야 해요.",
    link: { label: "한국장학재단 바로가기", url: OFFICIAL_LINKS.kosaf },
  },
  {
    id: "scholarship-criteria",
    keywords: ["성적 장학금", "성적우수", "장학금 기준", "장학금 조건"],
    question: "성적장학금 선발 기준이 궁금해요",
    answer:
      "[실제 정보로 교체] 예) 직전 학기 평점 3.5 이상, 취득학점 15학점 이상 등 조건을 충족해야 합니다.",
    link: { label: "장학 안내 페이지로 이동", url: OFFICIAL_LINKS.scholarship },
  },

  // ----- 등록 -----
  {
    id: "tuition-period",
    keywords: ["등록금 납부", "등록 기간", "등록금", "등록"],
    question: "등록금 납부 기간이 언제인가요?",
    answer:
      "[실제 정보로 교체] 매 학기 초 지정된 기간 내 가상계좌 입금 또는 카드로 납부하면 됩니다. 정확한 일정은 학사일정을 확인하세요.",
    link: { label: "학사일정 확인", url: OFFICIAL_LINKS.academicCalendar },
  },
  {
    id: "tuition-installment",
    keywords: ["분할납부", "등록금 분할"],
    question: "등록금 분할납부가 가능한가요?",
    answer:
      "[실제 정보로 교체] 네, 신청 대상과 기간이 별도로 공지됩니다. 포털에서 분할납부를 신청할 수 있어요.",
    link: { label: "포털 바로가기", url: OFFICIAL_LINKS.portal },
  },
  {
    id: "tuition-leave",
    keywords: ["휴학 등록금", "휴학"],
    question: "휴학하면 등록금은 어떻게 되나요?",
    answer:
      "[실제 정보로 교체] 휴학 시기에 따라 등록금 반환/이월 규정이 다르게 적용됩니다.",
    link: { label: "포털 바로가기", url: OFFICIAL_LINKS.portal },
  },

  // ----- 수강신청 -----
  {
    id: "course-period",
    keywords: ["수강신청 기간", "수강신청", "강의 신청", "과목 신청", "수강"],
    question: "수강신청 기간이 언제인가요?",
    answer:
      "[실제 정보로 교체] 매 학기 개강 전 지정된 기간에 진행됩니다. 학년별로 신청 시간이 나뉠 수 있어요.",
    link: { label: "학사일정 확인", url: OFFICIAL_LINKS.academicCalendar },
  },
  {
    id: "course-correction",
    keywords: ["수강정정", "정정기간", "수강 변경"],
    question: "수강정정 기간은 언제인가요?",
    answer: "[실제 정보로 교체] 개강 후 지정된 정정기간 내에 포털에서 변경할 수 있어요.",
    link: { label: "포털 바로가기", url: OFFICIAL_LINKS.portal },
  },
  {
    id: "course-retake",
    keywords: ["재수강"],
    question: "재수강은 어떻게 신청하나요?",
    answer: "[실제 정보로 교체] 재수강은 별도 조건(성적 기준 등)을 확인한 뒤 수강신청 기간에 함께 신청합니다.",
    link: { label: "포털 바로가기", url: OFFICIAL_LINKS.portal },
  },
  {
    id: "course-liberal-arts",
    keywords: ["교양", "교양 과목", "교양 수강"],
    question: "교양 과목 수강신청은 어떻게 하나요?",
    answer: "[실제 정보로 교체] 교양 과목도 전공과 동일하게 포털의 수강신청 메뉴에서 신청하면 됩니다.",
    link: { label: "포털 바로가기", url: OFFICIAL_LINKS.portal },
  },
  {
    id: "course-eligibility",
    keywords: ["수강대상", "수강 가능", "수강대상 확인"],
    question: "수강대상 확인은 어떻게 하나요?",
    answer: "[실제 정보로 교체] 학년/학과별 수강 가능 과목은 포털의 강의계획서 또는 수강편람에서 확인할 수 있어요.",
    link: { label: "포털 바로가기", url: OFFICIAL_LINKS.portal },
  },

  // ----- 성적 -----
  {
    id: "grades-check",
    keywords: ["성적 조회", "성적", "학점 조회"],
    question: "성적 조회는 어디서 하나요?",
    answer: "[실제 정보로 교체] 포털 로그인 → 성적 조회 메뉴에서 확인할 수 있어요. 매 학기 종료 후 지정된 일자에 공개됩니다.",
    link: { label: "포털 바로가기", url: OFFICIAL_LINKS.portal },
  },
  {
    id: "grades-appeal",
    keywords: ["성적 이의신청", "이의신청", "성적 정정"],
    question: "성적 이의신청은 어떻게 하나요?",
    answer: "[실제 정보로 교체] 성적 공개 후 지정된 기간 내에 담당 교수 또는 학사지원팀에 이의신청할 수 있어요.",
    link: { label: "포털 바로가기", url: OFFICIAL_LINKS.portal },
  },
  {
    id: "grades-retake",
    keywords: ["재수강 성적", "성적 반영"],
    question: "재수강하면 성적이 어떻게 반영되나요?",
    answer: "[실제 정보로 교체] 재수강 시 성적 반영 규정(예: 최종 성적으로 대체 등)을 확인해야 합니다.",
  },

  // ----- 교내 연락처 -----
  {
    id: "contact-academic",
    keywords: ["학사지원팀", "학사 문의", "학사팀"],
    question: "학사지원팀 연락처가 궁금해요",
    answer: "[실제 전화번호로 교체] 학사지원팀: 000-0000-0000",
    link: { label: "주요 사이트/연락처 전체보기", url: OFFICIAL_LINKS.studentSupportSites },
  },
  {
    id: "contact-dorm",
    keywords: ["기숙사", "생활관"],
    question: "기숙사 관련 문의는 어디로 하나요?",
    answer: "[실제 전화번호로 교체] 기숙사(생활관): 000-0000-0000",
    link: { label: "주요 사이트/연락처 전체보기", url: OFFICIAL_LINKS.studentSupportSites },
  },
  {
    id: "contact-council",
    keywords: ["총학생회"],
    question: "총학생회 연락처를 알고 싶어요",
    answer: "[실제 전화번호로 교체] 총학생회: 000-0000-0000",
  },
];

// 사용자가 입력한 문장과 매칭되는 FAQ 항목을 찾습니다.
// - 입력이 keyword를 포함하거나(예: "수강신청 언제야" → "수강신청" 포함)
// - keyword가 입력을 포함하면(예: "수강" → "수강신청"이라는 keyword가 "수강"을 포함) 매칭됩니다.
// 짧은 키워드(예: "수강")로 검색하면 관련된 여러 항목이 함께 뜨는 게 자연스럽습니다.
export function matchFaq(rawQuery: string, limit = 6): FaqItem[] {
  const query = rawQuery.trim();
  if (!query) return [];

  const scored = FAQ_ITEMS.map((item) => {
    let score = 0;
    for (const keyword of item.keywords) {
      if (query.includes(keyword)) score = Math.max(score, keyword.length * 2); // 구체적인 키워드일수록 우선
      else if (keyword.includes(query)) score = Math.max(score, query.length);
    }
    return { item, score };
  }).filter((x) => x.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.item);
}

export function getFaqItem(id: string): FaqItem | undefined {
  return FAQ_ITEMS.find((item) => item.id === id);
}
