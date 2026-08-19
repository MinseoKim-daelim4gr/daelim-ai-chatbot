// =========================================================================
// 버튼 기반 메뉴 트리 (고려대 챗봇 'KUChat'처럼 카드/버튼으로 이동하는 구조)
// -------------------------------------------------------------------------
// LLM 없이도 100% 정확하게 동작하는 부분입니다. 발표 시연에서 가장 안정적으로
// 보여줄 수 있는 핵심 기능이니, [실제 정보로 교체] 표시된 곳을 꼭 채워주세요.
//
// 구조: MenuNode 하나 = 챗봇이 보여주는 화면 한 장.
//   - intro: 상단 안내 문구
//   - topLink: intro 아래 큰 바로가기 버튼 (선택)
//   - cards: 가로로 나열되는 정보 카드들 (제목 + 본문 + 상세 링크 버튼)
//   - quickReplies: 하단에 나열되는 버튼들. 다른 메뉴로 이동(targetId) 하거나,
//     자유 질문 채팅으로 그대로 전송(askText) 할 수 있음.
// =========================================================================

import { OFFICIAL_LINKS } from "./links";

export type LinkButton = {
  label: string;
  url: string;
};

export type InfoCard = {
  title: string;
  body: string;
  link?: LinkButton;
};

export type QuickReply =
  | { label: string; targetId: string; askText?: undefined }
  | { label: string; askText: string; targetId?: undefined };

export type MenuNode = {
  id: string;
  intro: string;
  topLink?: LinkButton;
  cards?: InfoCard[];
  quickReplies?: QuickReply[];
};

export const MENU_NODES: Record<string, MenuNode> = {
  root: {
    id: "root",
    intro: "안녕하세요! 대림대학교 안내 챗봇이에요 🙂\n아래에서 궁금한 주제를 선택해주세요.",
    quickReplies: [
      { label: "🎓 장학금", targetId: "scholarship" },
      { label: "💳 등록", targetId: "tuition" },
      { label: "📝 수강신청", targetId: "course" },
      { label: "📊 성적", targetId: "grades" },
      { label: "☎️ 교내 연락처", targetId: "contacts" },
      { label: "❓ 자주 묻는 질문", targetId: "faq" },
    ],
  },

  // ----- 장학금 -----
  scholarship: {
    id: "scholarship",
    intro: "장학금 안내해드릴게요! 아래에서 궁금한 내용을 선택해주세요.",
    topLink: { label: "🔍 학부 장학안내 바로가기", url: OFFICIAL_LINKS.scholarship },
    quickReplies: [
      { label: "교내장학금", targetId: "scholarship-internal" },
      { label: "국가장학금", targetId: "scholarship-national" },
      { label: "신청 방법", targetId: "scholarship-apply" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "scholarship-internal": {
    id: "scholarship-internal",
    intro: "대림대학교 교내장학금 종류예요.",
    cards: [
      {
        title: "성적우수장학금",
        body: "[실제 정보로 교체] 직전 학기 평점 3.5 이상, 취득학점 15학점 이상 등 선발기준을 충족한 학생에게 수업료 일부 또는 전액 지급",
        link: { label: "상세안내 바로가기", url: OFFICIAL_LINKS.scholarship },
      },
      {
        title: "근로장학금",
        body: "[실제 정보로 교체] 교내 근로에 참여하는 학생에게 근로 시간에 따라 장학금 지급",
        link: { label: "상세안내 바로가기", url: OFFICIAL_LINKS.scholarship },
      },
      {
        title: "특별장학금",
        body: "[실제 정보로 교체] 자격증 취득, 봉사활동, 어학성적 등 특정 조건 충족 시 지급",
        link: { label: "상세안내 바로가기", url: OFFICIAL_LINKS.scholarship },
      },
    ],
    quickReplies: [
      { label: "장학 메뉴로", targetId: "scholarship" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "scholarship-national": {
    id: "scholarship-national",
    intro: "국가장학금은 대림대가 아닌 한국장학재단을 통해 신청해요.",
    cards: [
      {
        title: "국가장학금 1유형 / 2유형",
        body: "[실제 정보로 교체] 소득분위에 따라 차등 지급되는 1유형과, 대학 자체 노력에 따라 지급되는 2유형이 있음. 매 학기 한국장학재단 홈페이지에서 신청",
        link: { label: "한국장학재단 바로가기", url: OFFICIAL_LINKS.kosaf },
      },
    ],
    quickReplies: [
      { label: "장학 메뉴로", targetId: "scholarship" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "scholarship-apply": {
    id: "scholarship-apply",
    intro: "장학금 신청 방법을 안내해드릴게요.",
    cards: [
      {
        title: "교내장학금 신청",
        body: "[실제 정보로 교체] 대림대 포털 로그인 → 장학금 메뉴에서 학기 초 공지된 기간 내 신청",
        link: { label: "포털 바로가기", url: OFFICIAL_LINKS.portal },
      },
    ],
    quickReplies: [
      { label: "장학 메뉴로", targetId: "scholarship" },
      { label: "처음으로", targetId: "root" },
    ],
  },

  // ----- 등록 -----
  tuition: {
    id: "tuition",
    intro: "등록 관련 안내해드릴게요.",
    topLink: { label: "📅 학사일정 바로가기", url: OFFICIAL_LINKS.academicCalendar },
    quickReplies: [
      { label: "등록 기간·방법", targetId: "tuition-period" },
      { label: "분할납부", targetId: "tuition-installment" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "tuition-period": {
    id: "tuition-period",
    intro: "등록 기간과 납부 방법이에요.",
    cards: [
      {
        title: "등록 기간 · 납부 방법",
        body: "[실제 정보로 교체] 매 학기 초 지정된 기간 내 가상계좌 입금 또는 카드 납부. 정확한 일정은 학사일정 공지 참고",
        link: { label: "포털에서 등록금 확인", url: OFFICIAL_LINKS.portal },
      },
    ],
    quickReplies: [
      { label: "등록 메뉴로", targetId: "tuition" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "tuition-installment": {
    id: "tuition-installment",
    intro: "등록금 분할납부 안내예요.",
    cards: [
      {
        title: "분할납부 신청",
        body: "[실제 정보로 교체] 신청 대상, 신청 기간, 분할 횟수 등을 안내",
        link: { label: "포털 바로가기", url: OFFICIAL_LINKS.portal },
      },
    ],
    quickReplies: [
      { label: "등록 메뉴로", targetId: "tuition" },
      { label: "처음으로", targetId: "root" },
    ],
  },

  // ----- 수강신청 -----
  course: {
    id: "course",
    intro: "수강신청 관련 안내해드릴게요.",
    topLink: { label: "📅 학사일정 바로가기", url: OFFICIAL_LINKS.academicCalendar },
    quickReplies: [
      { label: "수강신청 기간", targetId: "course-period" },
      { label: "정정·재수강", targetId: "course-retake" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "course-period": {
    id: "course-period",
    intro: "수강신청 기간이에요.",
    cards: [
      {
        title: "수강신청 기간",
        body: "[실제 정보로 교체] 매 학기 개강 전 지정된 기간에 진행 (학년별 신청 시간 분산 여부 기입)",
        link: { label: "포털에서 수강신청", url: OFFICIAL_LINKS.portal },
      },
    ],
    quickReplies: [
      { label: "수강신청 메뉴로", targetId: "course" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "course-retake": {
    id: "course-retake",
    intro: "수강신청 정정기간과 재수강 안내예요.",
    cards: [
      {
        title: "정정기간 · 재수강",
        body: "[실제 정보로 교체] 개강 후 지정된 정정기간 내 변경 가능. 재수강은 별도 조건 확인 필요",
        link: { label: "포털 바로가기", url: OFFICIAL_LINKS.portal },
      },
    ],
    quickReplies: [
      { label: "수강신청 메뉴로", targetId: "course" },
      { label: "처음으로", targetId: "root" },
    ],
  },

  // ----- 성적 -----
  grades: {
    id: "grades",
    intro: "성적 관련 안내해드릴게요.",
    quickReplies: [
      { label: "성적 조회 방법", targetId: "grades-check" },
      { label: "성적 이의신청", targetId: "grades-appeal" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "grades-check": {
    id: "grades-check",
    intro: "성적 조회 방법이에요.",
    cards: [
      {
        title: "성적 조회",
        body: "[실제 정보로 교체] 포털 로그인 → 성적 조회 메뉴에서 확인. 매 학기 종료 후 지정된 일자에 공개",
        link: { label: "포털에서 성적 조회", url: OFFICIAL_LINKS.portal },
      },
    ],
    quickReplies: [
      { label: "성적 메뉴로", targetId: "grades" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "grades-appeal": {
    id: "grades-appeal",
    intro: "성적 이의신청 안내예요.",
    cards: [
      {
        title: "성적 이의신청",
        body: "[실제 정보로 교체] 성적 공개 후 지정된 기간 내 담당 교수 또는 학사지원팀에 이의신청",
        link: { label: "포털 바로가기", url: OFFICIAL_LINKS.portal },
      },
    ],
    quickReplies: [
      { label: "성적 메뉴로", targetId: "grades" },
      { label: "처음으로", targetId: "root" },
    ],
  },

  // ----- 교내 연락처 -----
  contacts: {
    id: "contacts",
    intro: "자주 찾는 교내 연락처예요.",
    topLink: { label: "📖 주요 사이트/연락처 전체보기", url: OFFICIAL_LINKS.studentSupportSites },
    cards: [
      { title: "학사지원팀", body: "[실제 전화번호로 교체] 000-0000-0000" },
      { title: "장학팀(학생지원팀)", body: "[실제 전화번호로 교체] 000-0000-0000" },
      { title: "재무팀(등록금)", body: "[실제 전화번호로 교체] 000-0000-0000" },
      { title: "기숙사(생활관)", body: "[실제 전화번호로 교체] 000-0000-0000" },
      { title: "총학생회", body: "[실제 전화번호로 교체] 000-0000-0000" },
    ],
    quickReplies: [{ label: "처음으로", targetId: "root" }],
  },

  // ----- 자주 묻는 질문 (버튼을 누르면 미리 작성된 답변 화면으로 바로 이동, LLM 호출 없음) -----
  faq: {
    id: "faq",
    intro: "최근 학생들이 많이 물어본 질문이에요. 눌러보면 바로 답을 볼 수 있어요.",
    quickReplies: [
      { label: "수강신청 기간이 언제야?", targetId: "faq-course-period" },
      { label: "성적 조회는 어디서 해?", targetId: "faq-grades-check" },
      { label: "장학금 종류 알려줘", targetId: "faq-scholarship-types" },
      { label: "등록금 분할납부 가능해?", targetId: "faq-tuition-installment" },
      { label: "학사지원팀 연락처 알려줘", targetId: "faq-contact-academic" },
      { label: "처음으로", targetId: "root" },
    ],
  },
};

export const DEFAULT_NODE_ID = "root";
