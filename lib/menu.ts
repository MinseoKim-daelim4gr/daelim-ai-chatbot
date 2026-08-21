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
      { label: "☀️ 계절학기", targetId: "seasonal" },
      { label: "📊 성적", targetId: "grades" },
      { label: "📜 증명서 발급", targetId: "certificate" },
      { label: "🏫 휴학", targetId: "leave" },
      { label: "🔄 복학", targetId: "return" },
      { label: "🔀 전과", targetId: "transfer" },
      { label: "🎖️ 군 학점인정", targetId: "course-military-credit" },
      { label: "💼 조기취업", targetId: "early-employment" },
      { label: "✅ P/F 과목", targetId: "pf-course" },
      { label: "☎️ 교내 연락처", targetId: "contacts" },
      { label: "🚌 통학버스", targetId: "shuttle" },
      { label: "❓ 자주 묻는 질문", targetId: "faq" },
    ],
  },

  // ----- 장학금 (2026학년도 2학기 국가장학금/국가근로장학금/우선감면/주거안정장학금 공지 기준) -----
  scholarship: {
    id: "scholarship",
    intro: "장학금 안내해드릴게요! 아래에서 궁금한 내용을 선택해주세요.",
    topLink: { label: "🔍 학부 장학안내 바로가기", url: OFFICIAL_LINKS.scholarship },
    quickReplies: [
      { label: "교내장학금", targetId: "scholarship-internal" },
      { label: "국가장학금", targetId: "scholarship-national" },
      { label: "국가근로장학금", targetId: "scholarship-work-study" },
      { label: "주거안정장학금", targetId: "scholarship-housing" },
      { label: "우선감면 안내", targetId: "scholarship-priority" },
      { label: "교외장학", targetId: "scholarship-external" },
      { label: "신청 방법", targetId: "scholarship-apply" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "scholarship-internal": {
    id: "scholarship-internal",
    intro: "대림대학교 교내장학금 종류예요. (2026학년도 2학기 우선감면 공지 기준)",
    cards: [
      {
        title: "산업체위탁장학",
        body: "산업체위탁과정 학생, 12학점 이상, 평점평균 1.5 이상",
      },
      {
        title: "전공심화장학",
        body: "전공심화과정 학생, 10학점 이상, 평점평균 1.5 이상",
      },
      {
        title: "성적 A·B·C 장학",
        body: "학과의 추천을 받은 성적우수자",
      },
      {
        title: "성적 D 장학",
        body: "산업체위탁·전공심화 학생 성적우수자 중 학과의 추천을 받은 학생",
      },
      {
        title: "입학우수장학(전체수석) 계속지원",
        body: "입학성적 전형별 수석으로 입학하여 12학점 이상, 평점평균 4.0 이상 유지 시",
      },
      {
        title: "외국인유학생 성적장학",
        body: "국제교류원 추천을 받은 성적우수자",
      },
      {
        title: "국가유공자 장학",
        body: "국가유공자, 평균평점 1.5 이상",
      },
      {
        title: "보훈대상자 및 새터민 장학",
        body: "보훈대상자 및 새터민, 평균평점 1.5 이상",
      },
      {
        title: "유의사항",
        body: "2026.1.1.부터 등록금 납부 후 휴학 시 등록금이 반환되면, 우선감면된 교내장학금은 취소 처리돼요.",
      },
    ],
    quickReplies: [
      { label: "장학 메뉴로", targetId: "scholarship" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "scholarship-national": {
    id: "scholarship-national",
    intro: "국가장학금은 대림대가 아닌 한국장학재단을 통해 신청해요. (2026학년도 2학기 기준)",
    topLink: { label: "📋 국가장학금 신청일정 공지 보기", url: OFFICIAL_LINKS.scholarshipNationalNotice },
    cards: [
      {
        title: "신청기간",
        body: "2026.8.12(수) 9시 ~ 9.9(수) 18시\n주말·공휴일 포함 24시간 신청 가능, 마지막날은 18시 마감(마감일은 접속자 급증 대비 여유있게 신청 권장)",
        link: { label: "한국장학재단 신청하기", url: OFFICIAL_LINKS.kosaf },
      },
      {
        title: "서류제출 · 가구원 동의",
        body: "2026.8.12(수) 9시 ~ 9.16(수) 18시\n신청 + 서류확인(대상자에 한함) + 가구원 동의가 모두 완료돼야 수혜 가능해요.",
      },
      {
        title: "신청대상",
        body: "재학생, 편입생, 복학생, 재입학생 등 모든 재학생",
      },
      {
        title: "유의사항",
        body: "국가유공자 등 등록금 전액 지원 대상자는 원칙적으로 국가장학금 중복 불가해요(단, 학생 부담분이 발생한 경우는 가능).\n반드시 본인이 직접, 정확한 소속대학으로 신청해야 하고 신청완료 여부를 꼭 확인하세요.\n1학년 2학기·복학생은 학적을 '재학'으로 신청해야 해요(신입생으로 잘못 신청 시 수혜 불가할 수 있어요).",
      },
      {
        title: "문의처",
        body: "국가장학금 신청문의: 1599-2000(학생상담센터)\n대림대 국가장학 담당자: 031-467-4723",
      },
    ],
    quickReplies: [
      { label: "장학 메뉴로", targetId: "scholarship" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "scholarship-work-study": {
    id: "scholarship-work-study",
    intro: "2026학년도 2학기 2차 국가근로장학금 안내예요.",
    topLink: { label: "📋 국가근로장학금 공지 보기", url: OFFICIAL_LINKS.scholarshipWorkStudyNotice },
    cards: [
      {
        title: "신청대상 · 선발요건",
        body: "대한민국 국적의 국내 대학 재학생\n학자금 지원구간 9구간 이하, 직전학기 성적 70점(100점 만점, C학점) 이상",
      },
      {
        title: "신청기간",
        body: "2026.8.12(수) 9시 ~ 9.9(수) 18시 (주말·공휴일 포함 24시간 가능, 마감일은 18시 종료)",
        link: { label: "한국장학재단 신청하기", url: OFFICIAL_LINKS.kosaf },
      },
      {
        title: "서류제출 · 가구원 동의",
        body: '공지 원문에는 종료일이 "2026.3.16.(화)"로 되어 있는데, 다른 장학금 일정이 모두 9.16인 걸 보면 오탈자(9.16)일 가능성이 높아요. 정확한 날짜는 학생복지팀에 확인해주세요.',
      },
      {
        title: "근로장학생 배정",
        body: "2026.8.10(월)부터 순차 배정(희망근로지 기준)\n희망근로지를 선택하지 않으면 배정이 지연되거나 제외될 수 있어요. 배정 완료 시점은 학생마다 달라요.",
      },
      {
        title: "장학금 시급",
        body: "교내근로: 10,320원\n교외근로: 12,790원",
      },
    ],
    quickReplies: [
      { label: "장학 메뉴로", targetId: "scholarship" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "scholarship-housing": {
    id: "scholarship-housing",
    intro: "2026학년도 2학기 2차 주거안정장학금 안내예요.",
    topLink: { label: "📋 주거안정장학금 공지·붙임파일 보기", url: OFFICIAL_LINKS.scholarshipHousingNotice },
    cards: [
      {
        title: "신청대상",
        body: "원거리 대학에 진학한 기초생활수급자 또는 차상위계층 학생 중 만 39세 이하(미혼)이며 사업 참여대학 재학생(대학원생 제외)\n신입생·편입생·재학생 등 학적과 무관하게 신청 가능해요.",
      },
      {
        title: "신청기간",
        body: "2026.8.12(수) 9시 ~ 9.9(수) 18시",
        link: { label: "한국장학재단 신청하기", url: OFFICIAL_LINKS.kosaf },
      },
      {
        title: "서류제출 · 가구원 동의",
        body: "2026.8.12(수) 9시 ~ 9.16(수) 18시\n복지자격(기초·차상위) 보유자도 가구원 동의를 기간 내 반드시 완료해야 해요.",
      },
      {
        title: "신청방법 · 유의사항",
        body: "한국장학재단 홈페이지 또는 모바일 앱에서 신청해요. 구체적인 신청 절차는 위 공지 링크의 [붙임 1] 파일을 꼭 참고해주세요.\n소속대학·학사내용을 정확히 입력해야 하고, 신청 후 서류제출대상자 여부를 홈페이지에서 확인해야 해요.",
      },
    ],
    quickReplies: [
      { label: "장학 메뉴로", targetId: "scholarship" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "scholarship-priority": {
    id: "scholarship-priority",
    intro: "장학금 우선감면 안내예요. (2026학년도 2학기 기준)",
    topLink: { label: "📋 우선감면 안내 공지 보기", url: OFFICIAL_LINKS.scholarshipPriorityNotice },
    cards: [
      {
        title: "0원 등록 필수",
        body: "전액 장학생(납부대상 등록금액 0원)으로 선발된 경우 반드시 '0원' 등록을 해야 해요. 하지 않으면 미등록 제적 처리돼요.\n장학 내역·금액은 등록금고지서에서 8.24(월)부터 조회 가능해요.",
        link: { label: "고지서 조회(학생포털)", url: OFFICIAL_LINKS.portal },
      },
      {
        title: "국가장학금 지급 일정",
        body: "2026.8.3.까지 장학재단 승인자: 등록금고지서에서 감면 처리\n2026.8.4. 이후 승인자: 10~12월 중 학생계좌 지급 또는 학자금대출 상환 예정",
      },
      {
        title: "국가1유형 지원구간별 학기당 지원액",
        body: "1유형: 기초·차상위 전액, 1~3구간 300만원, 4~6구간 220만원, 7~8구간 180만원, 9구간 50만원, 10구간 미지원\n다자녀: 기초·차상위 전액, 1~3구간 305만원, 4~6구간 252.5만원, 7~8구간 232.5만원, 9구간 67.5만원, 10구간 미지원\n다자녀(셋째 이상): 기초·차상위~8구간 전액, 9구간 100만원, 10구간 미지원",
      },
      {
        title: "전액감면 대상 장학금",
        body: "① 희망사다리Ⅰ유형(중소기업취업연계) ② 희망사다리Ⅱ유형(고졸후학습자장학금) ③ 수암장학 ④ 농림축산식품부장학금\n위 4개 장학금의 계속 지급 대상자는 등록금 전액감면 처리돼요.",
      },
      {
        title: "문의처",
        body: "교내장학금: 031-467-4721\n국가1유형·희망사다리: 031-467-4723\n교외장학: 031-467-4722",
      },
    ],
    quickReplies: [
      { label: "장학 메뉴로", targetId: "scholarship" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "scholarship-external": {
    id: "scholarship-external",
    intro: "교외장학금 안내예요. 자세한 대상·조건은 링크를 눌러 공지 원문에서 확인해주세요.",
    cards: [
      {
        title: "세종이도인재장학금",
        body: "세종이도인재장학금 장학생 모집 안내. 자세한 대상·조건은 공지 원문을 확인해주세요.",
        link: { label: "공지 보러가기", url: OFFICIAL_LINKS.scholarshipExternal1 },
      },
      {
        title: "서울인재대학장학금",
        body: "[서울시미래인재재단] 2026년 하반기 서울인재대학장학금 장학생 선발 공고. 자세한 대상·조건은 공지 원문을 확인해주세요.",
        link: { label: "공지 보러가기", url: OFFICIAL_LINKS.scholarshipExternal2 },
      },
      {
        title: "ESG 행복 장학생 (안양시)",
        body: "[안양시인재육성재단] 2026 ESG 행복 장학생 선발 안내. 자세한 대상·조건은 공지 원문을 확인해주세요.",
        link: { label: "공지 보러가기", url: OFFICIAL_LINKS.scholarshipExternal3 },
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
      {
        title: "국가장학금 계열 신청",
        body: "국가장학금·국가근로장학금·주거안정장학금은 모두 한국장학재단 홈페이지 또는 모바일 앱에서 신청해요(대림대 포털이 아니에요).",
        link: { label: "한국장학재단 바로가기", url: OFFICIAL_LINKS.kosaf },
      },
    ],
    quickReplies: [
      { label: "장학 메뉴로", targetId: "scholarship" },
      { label: "처음으로", targetId: "root" },
    ],
  },

  // ----- 등록 (2026학년도 2학기 등록금 납부/분할납부 안내 공지 기준) -----
  tuition: {
    id: "tuition",
    intro: "등록 관련 안내해드릴게요.",
    topLink: { label: "📅 학사일정 바로가기", url: OFFICIAL_LINKS.academicCalendar },
    quickReplies: [
      { label: "등록 기간·방법", targetId: "tuition-period" },
      { label: "분할납부", targetId: "tuition-installment" },
      { label: "등록금 반환기준", targetId: "tuition-refund" },
      { label: "문의처", targetId: "tuition-contact" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "tuition-period": {
    id: "tuition-period",
    intro: "등록 기간과 납부 방법이에요. (2026학년도 2학기 기준)",
    cards: [
      {
        title: "납부기간",
        body: "2026.8.24(월) 9:00 ~ 8.28(금) 16:00\n은행 업무시간(오전 9시~오후 4시)에만 납부 가능하고, 업무시간 이후·공휴일(토·일 포함)은 납부할 수 없어요.",
      },
      {
        title: "납부 대상",
        body: "전문학사 / 학사학위 전공심화 / 석사학위 재학생·복학생\n휴학(예정)생은 등록금 납부 금지\n수업연한초과자는 수강신청 정정기간 종료 후 확정된 등록금 납부(9.1(화)부터 고지서 발행 및 납부)",
      },
      {
        title: "납부 방법",
        body: "고지서에 기재된 학생별 가상계좌로 이체(고지 금액을 한꺼번에 입금해야 해요)\n등록금 전액 감면 장학생은 별도로 0원 처리해야 해요.",
        link: { label: "고지서 출력(학생포털)", url: OFFICIAL_LINKS.portal },
      },
      {
        title: "고지서 출력 · 납부확인",
        body: "고지서 출력: 학생포털 → 학생이력관리시스템 → 학생 → 등록 → 고지서출력(학생용)\n납부확인(서): 납부 당일 19:00부터 홈페이지·학생이력관리시스템에서 확인/출력 가능",
        link: { label: "등록금납부확인서 페이지", url: OFFICIAL_LINKS.tuitionPaymentConfirm },
      },
    ],
    quickReplies: [
      { label: "등록 메뉴로", targetId: "tuition" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "tuition-refund": {
    id: "tuition-refund",
    intro: "등록금 반환 기준이에요. (2026학년도 2학기 학기개시일: 9.1(화))",
    cards: [
      {
        title: "학기개시일 전일까지 (2주까지 인정)",
        body: "최종승인: ~2026.9.14.(월) 16:00까지\n반환 비율: 전액반환",
      },
      {
        title: "학기개시일부터 30일까지",
        body: "최종승인: ~2026.9.30.(수) 16:00까지\n반환 비율: 5/6 반환",
      },
      {
        title: "학기개시일 30일 초과 ~ 60일까지",
        body: "최종승인: ~2026.10.30.(금) 14:00까지\n반환 비율: 2/3 반환",
      },
      {
        title: "학기개시일 60일 초과 ~ 90일까지",
        body: "최종승인: ~2026.11.27.(금) 14:00까지\n반환 비율: 1/2 반환",
      },
      {
        title: "학기개시일 91일 이후",
        body: "일반휴학 신청 종료\n반환 비율: 반환없음",
      },
      {
        title: "유의사항",
        body: "개강일 이전 휴학 시 등록금 전액 반환, 개강일 이후 휴학 시 차감 반환돼요.\n개강 이후 군입대·질병 등 증빙서류를 첨부하는 부득이한 휴학은 전액 반환돼요.\n최종승인일은 평일 기준으로 운영해요.",
      },
    ],
    quickReplies: [
      { label: "등록 메뉴로", targetId: "tuition" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "tuition-contact": {
    id: "tuition-contact",
    intro: "등록금 관련 문의처예요.",
    cards: [
      { title: "등록금 과오납 · 카드납부", body: "031-467-4754, 9" },
      { title: "고지서 출력 · 전액장학생등록 · 이월/환불", body: "031-467-4713" },
      { title: "등록금 우선감면 (장학금·학자금대출)", body: "031-467-4721~3" },
      { title: "학생회비 · 졸업가운비", body: "031-467-4725" },
    ],
    quickReplies: [
      { label: "등록 메뉴로", targetId: "tuition" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "tuition-installment": {
    id: "tuition-installment",
    intro: "등록금 분할납부 안내예요. (2026학년도 2학기 기준)",
    cards: [
      {
        title: "신청기간",
        body: "2026.8.24(월) ~ 9.16(수) 16:00까지\n※ 공지 원문에는 \"수업연한초과자·수업연한변경자는 3.3.(화) 이후 신청 가능\"이라고 되어 있는데, 2학기 다른 일정과 달리 3월 날짜라 오탈자일 가능성이 있어요. 정확한 날짜는 교육행정팀에 확인해주세요.",
      },
      {
        title: "신청방법",
        body: "학생포털시스템 → 학생이력 → 학생메뉴 → 등록 → 등록금분할납부 신청",
        link: { label: "포털 바로가기", url: OFFICIAL_LINKS.portal },
      },
      {
        title: "분할납부 회차별 기간",
        body: "1회분: 8.24(월) ~ 9.17(목) 16:00\n2회분: 9.18(금) ~ 10.29(목) 16:00\n3회분: 10.30(금) ~ 11.26(목) 16:00\n※ 안내된 기간 이후 추가 납부기간은 없어요.",
      },
      {
        title: "분할납부 고지서 출력",
        body: "학생포털시스템 → 학생이력 → 학생 → 등록 → 등록금분할납부 신청 → 분할납부 고지서 출력\n일반 전액 고지서와는 별개이며, 신청·승인 다음날(+1일)부터 확인할 수 있어요.",
      },
      {
        title: "신청 제한 대상",
        body: "신입생 · 재입학생 · 편입생 첫 학기\n장학금 포함 학비감면 총액이 등록금액의 75% 이상인 학생\n수업연한초과자 중 신청학점이 7학점 미만인 학생",
      },
      {
        title: "유의사항",
        body: "1회차 기간까지 미납하면 분할납부 신청이 취소되고 학칙 제27조에 따라 미등록 제적돼요.\n2·3회차도 기간 내 미납 시 동일하게 미등록 제적돼요.\n분할납부 등록금은 신용카드로 납부할 수 없고, 장학금·대출 실행 일정과 무관하게 분할납부 기한은 반드시 지켜야 해요.",
      },
      {
        title: "문의처",
        body: "분할납부 신청·취소·승인: 교육행정팀 031-467-4713\n장학금·학자금대출: 학생복지팀 031-467-4721~3\n기타경비: 학생복지팀 031-467-4725",
      },
    ],
    quickReplies: [
      { label: "등록 메뉴로", targetId: "tuition" },
      { label: "처음으로", targetId: "root" },
    ],
  },

  // ----- 수강신청 (2026학년도 2학기 수강신청/교양 수강신청 안내 공지 기준) -----
  course: {
    id: "course",
    intro: "수강신청 관련 안내해드릴게요.",
    topLink: { label: "📅 학사일정 바로가기", url: OFFICIAL_LINKS.academicCalendar },
    quickReplies: [
      { label: "수강신청 기간", targetId: "course-period" },
      { label: "교양 수강신청", targetId: "course-liberal" },
      { label: "정정·재수강", targetId: "course-retake" },
      { label: "유의사항·제한", targetId: "course-notice" },
      { label: "수강포기", targetId: "course-drop" },
      { label: "군 학점인정", targetId: "course-military-credit" },
      { label: "기타 안내(졸업유보 등)", targetId: "course-etc" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "course-period": {
    id: "course-period",
    intro: "수강신청 기간이에요. (2026학년도 2학기 기준)",
    cards: [
      {
        title: "1학년 중점교양 신청",
        body: "8.17(월) 10:00 ~ 8.19(수) 09:59\n1학년만 신청 가능, 요일제로 배정된 중점교양 2과목 신청",
      },
      {
        title: "전체 수강신청 (타수강 포함)",
        body: "8.19(수) 10:00 ~ 8.21(금) 15:00\n타수강은 승인이 필요해요",
        link: { label: "포털에서 수강신청", url: OFFICIAL_LINKS.portal },
      },
      {
        title: "수강신청 정정기간",
        body: "8.24(월) 10:00 ~ 8.28(금) 17:00\n학과·행정실 방문 없이 학생 본인이 직접 정정",
      },
      {
        title: "개강 (학기개시일)",
        body: "9.1(화)\n개강 후 별도 수강신청 정정 기간은 없어요",
      },
    ],
    quickReplies: [
      { label: "수강신청 메뉴로", targetId: "course" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "course-liberal": {
    id: "course-liberal",
    intro: "교양 수강신청 안내예요. (2026학년도 2학기 기준)\n학부(과)별 요일제로 진행돼요.",
    cards: [
      {
        title: "1학년 중점교양 (요일제)",
        body: "월/수요일 학과: AI와사회변화, 자기이해와진로설계\n화/목요일 학과: 인문학과인성, 실용영어(P/F)\n신청기간: 8.17(월) 10:00 ~ 8.19(수) 09:59 (1학년만 신청 가능)",
      },
      {
        title: "전체 교양 (타수강 포함)",
        body: "8.19(수) 10:00부터 수강신청 마감 시까지 전 학년 신청 가능\n타수강은 승인이 필요해요",
      },
      {
        title: "유의사항",
        body: "본과 학생이 우선 수강할 수 있도록 타학부(과) 학생의 타수강은 별도 기간 동안 엄격히 제한돼요.\n인기 강좌는 조기 마감될 수 있고, 마감 후에는 인원 증설·대리신청이 허용되지 않아요.",
      },
      {
        title: "문의처",
        body: "교양학사: 031-467-4552\n교양수업: 031-467-4553",
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
        title: "정정기간",
        body: "8.24(월) 10:00 ~ 8.28(금) 17:00\n학과·행정실 방문 없이 학생 본인이 직접 정정해요. 개강(9.1) 후 별도 정정 기간은 없어요.",
      },
      {
        title: "재수강 신청 조건",
        body: "기 취득 학점이 C+ 이하인 교과목만 재수강할 수 있어요.\n재수강 학점은 해당 학기 수강신청 학점 범위 내에서 신청해야 해요.\n별도 메뉴 없이 기존 수강신청 화면에서 재수강 과목을 신청하면 돼요.",
        link: { label: "포털 바로가기", url: OFFICIAL_LINKS.portal },
      },
      {
        title: "재수강 성적 반영",
        body: "재수강으로 새 성적을 취득하면 이전에 취득한 교과목 성적은 성적표에서 삭제되고, 그 성적을 받았던 학기의 평점평균 계산에서도 제외돼요(최신 재수강 성적으로 대체).",
      },
    ],
    quickReplies: [
      { label: "수강신청 메뉴로", targetId: "course" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "course-notice": {
    id: "course-notice",
    intro: "수강신청 유의사항과 제한 사항이에요.",
    cards: [
      {
        title: "수강신청 대상",
        body: "신입생, 재학생(복학생·재입학생·전공심화·수업연한초과자 포함)",
      },
      {
        title: "신청은 필수예요",
        body: "기간 내 미신청 시 수강을 포기한 것으로 봐요.\n등록금 납부 여부와 관계없이 신청 기간 내 신청해야 하고, 휴학예정자도 신청해야 해요(휴학을 번복하는 사례가 많아서예요).",
      },
      {
        title: "타수강 · 상위학년 제한",
        body: "신입생 1학년 1학기 교과목은 타수강이 제한돼요(전과 시 1학년 1학기 전공교과목은 전공학점 미인정, 자유전공학과·소단위전공은 제외).\n상위 학년 교과목 수강도 제한돼요(1학년→2·3학년, 2학년→3학년, 학사학위 3학년→4학년 불가).",
      },
      {
        title: "복학생 유의",
        body: "교과목명이 변경된 경우가 있으니 학과에서 수강 가능 과목을 확인한 뒤 신청하세요(중복수강 주의).",
      },
    ],
    quickReplies: [
      { label: "수강신청 메뉴로", targetId: "course" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "course-drop": {
    id: "course-drop",
    intro: "수강신청 포기 안내예요.",
    cards: [
      {
        title: "포기 가능 기간",
        body: "9.1(화) ~ 9.28(월) 14:00까지 (이후 포기 불가)\n최소 수강학점을 초과하는 범위에서만 가능해요.",
      },
      {
        title: "포기 절차",
        body: "학과 상담(수강신청 교과목 변경·포기원 작성) → 교과목 담당교수 → 지도교수 → 학과(부)장 → 교육행정팀 방문 신청",
      },
    ],
    quickReplies: [
      { label: "수강신청 메뉴로", targetId: "course" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "course-etc": {
    id: "course-etc",
    intro:
      "수업연한 초과자, 조기취업, BeACE, 소단위전공 등 해당하는 분들을 위한 개별 안내예요.\n군 학점인정은 아래 '군 학점인정' 버튼에서 자세히 확인할 수 있어요.",
    cards: [
      {
        title: "수업연한 초과자 (졸업유보)",
        body: "등록금 고지서 조회·납부: 9.8(화) 10:00 예정 ~ 등록금 납부기한까지\n고지서 생성 후에는 수강포기 불가, 비교과(P/F) 과목 수강 불가\n수강신청 정정기간 종료 후 확정된 등록금을 납부해요\n학자금대출도 9.8(화) 예정부터 가능해요(비교과 수강은 여전히 불가)",
      },
      {
        title: "조기취업 출석 인정",
        body: "마지막 학기(1년제 2학기[전공심화], 2년제 4학기, 3년제 6학기) 및 수업연한 초과자 중, 졸업사정 이후 처음 조기취업한 학생만 대상이에요(산업체위탁, P-Tech 제외).\n원격(온라인) 수업 출석은 인정하지 않고, 대면 수업만 출석 인정돼요.",
      },
      {
        title: "BeACE P/F 1학점",
        body: '"직업세계와 자기계발(BeACE) P/F 1학점"은 별도 수강신청 없이, BeACE 이수 기준을 충족하면 취업팀에서 자동으로 부여해요(수업연한 초과자는 제외).\n성적열람 기간에 확인 가능하고, 이수 기준 충족 여부는 취업팀에서 확인할 수 있어요.',
      },
      {
        title: "P/F 과목 인정 기준",
        body: "P/F 과목은 졸업학점에는 포함되지만 평점(학점)에는 반영되지 않아요.\n재학 중 최대 6학점까지만 인정돼요(BeACE, 어학, 봉사, 창업, 군 학점인정, 각 사업단 P/F 교과목 포함).",
      },
      {
        title: "소단위전공 - 학과형",
        body: "해당 학과 사무실로 문의하세요.",
        link: { label: "학과형 소단위전공 안내", url: OFFICIAL_LINKS.minorProgramGeneral },
      },
      {
        title: "소단위전공 - 혁신융합대학사업",
        body: "미래자동차공학부 031-467-4640~2",
        link: { label: "혁신융합대학사업 안내", url: OFFICIAL_LINKS.minorProgramInnovation },
      },
      {
        title: "소단위전공 - 신산업특화선도전문대학사업",
        body: "반도체학과 031-467-4457",
        link: { label: "신산업특화선도전문대학사업 안내", url: OFFICIAL_LINKS.minorProgramIndustry },
      },
      {
        title: "소단위전공 - 첨단산업인재양성부트캠프사업",
        body: "반도체학과 031-467-4891",
        link: { label: "첨단산업인재양성부트캠프사업 안내", url: OFFICIAL_LINKS.minorProgramBootcamp },
      },
    ],
    quickReplies: [
      { label: "수강신청 메뉴로", targetId: "course" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "course-military-credit": {
    id: "course-military-credit",
    intro: "군 학점인정(군 복무경험·군 교육훈련·사회복무요원) 안내예요. (2026학년도 2학기 기준)",
    topLink: { label: "📋 군 학점인정 공지 보기", url: OFFICIAL_LINKS.militaryCreditNotice },
    cards: [
      {
        title: "인정 대상",
        body: "군 복무경험(사회복무요원 포함) 및 군 교육훈련 학점을 인정받을 수 있어요.\n단, 군 복무 완료 후 입학한 경우, 학사학위 전공심화과정, 수업연한 초과자는 인정에서 제외돼요.\n모든 군 복무자에게 자동으로 부여되는 게 아니라, 관련 활동에 참여한 인원에 한해 선별적으로 부여돼요.",
      },
      {
        title: "군 복무경험 - 인정 학점",
        body: "군 복무 중 사회봉사·인성교육·리더십·기초체육 등 교육적 경험에 참여한 경우에 한해요.\n1학점: 교육/봉사시간 45시간 이하 또는 이수 1건\n2학점: 교육/봉사시간 46시간 이상 또는 이수 3건 이상\n제출서류: 전역증(군 경력증명서) 또는 사회복무요원 경력증명서",
      },
      {
        title: "군 교육훈련 - 인정 학점",
        body: "군 교육훈련기관에서 취득한 학점을 인정해요.\n제출서류: 군 교육훈련 학점인정서(최근 60일 이내 발급분)",
      },
      {
        title: "제출 서류 유의사항",
        body: "사진 촬영본은 미제출로 처리돼요. 반드시 출력 후 스캔한 PDF 파일로 첨부해야 해요.\n파일명 형식: 증빙서류명_학번_성명 (예: 군 교육훈련 학점인정서_202601000_홍길동)\n군 복무경험은 교육시간을 우선 인정하고, 시간이 안 나오는 경우만 이수 건수로 인정해요.\n우리 대학 입학 이후 이수 실적만 인정되고, 동일 건은 학기별 중복 신청할 수 없어요.\n사회복무요원 복무기본교육은 제외되고, 별도 신청하는 디딤과정 등은 인정돼요.",
      },
      {
        title: "P/F 학점 한도",
        body: "교내외 전체 P/F 학점은 최대 6학점까지만 인정돼요.\n(군 학점인정, 어학(국제교류원), 봉사(학생복지팀), BeACE(취업팀), 창업실습(창의창업교육센터), 사업단 P/F 등 포함)",
      },
      {
        title: "신청 방법·절차",
        body: "학생포털 학생이력관리시스템에서 온라인 신청 후 증빙서류를 업로드해요.\n절차: 신청(증빙서류 업로드) → 담당자 확인(승인/미승인) → 최종 심사 후 학점인정(성적부여, ~10.30(금) 예정)\n최종승인되면 졸업학점 P/F 학점으로 인정돼요.",
        link: { label: "학생포털 바로가기", url: OFFICIAL_LINKS.portal },
      },
      {
        title: "접수기간",
        body: "2026.9.28(월) 10:00 ~ 10.2(금) 14:00\n신청 기간이 지나면 2027학년도 1학기에 신청할 수 있어요.",
      },
      {
        title: "문의·유의사항",
        body: "문의: 교육행정팀(대학본부 1층)\n붙임 증빙서류(군 경력증명서, 군 교육훈련 학점인정서, 사회복무요원 경력증명서) 외 다른 서류는 인정되지 않아요.\n서류 허위기재·위변조 등 부정한 방법으로 학점을 인정받은 사실이 확인되면 졸업 후라도 학칙 제40조에 따라 학점인정이 취소되고, 학칙 제42조의2에 따라 졸업도 취소될 수 있어요.",
      },
    ],
    quickReplies: [
      { label: "수강신청 메뉴로", targetId: "course" },
      { label: "처음으로", targetId: "root" },
    ],
  },

  // ----- 성적 (성적평가/성적산출 방법 및 성적 열람/정정 안내 공지 기준) -----
  grades: {
    id: "grades",
    intro: "성적 관련 안내해드릴게요.",
    quickReplies: [
      { label: "성적 조회 방법", targetId: "grades-check" },
      { label: "성적 평가·산출 방법", targetId: "grades-evaluation" },
      { label: "학사경고", targetId: "grades-warning" },
      { label: "성적 정정·이의신청", targetId: "grades-appeal" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "grades-check": {
    id: "grades-check",
    intro: "성적 조회 방법이에요.",
    cards: [
      {
        title: "성적 열람 방법",
        body: '학생포털시스템 → 학생이력 → "금학기성적조회"에서 열람할 수 있어요.\n성적열람 및 수정기간에는 금학기성적조회로, 그 기간이 지난 평상시(학기 중)에는 전체학기성적조회로 확인할 수 있어요.',
        link: { label: "학생포털 바로가기", url: OFFICIAL_LINKS.portal },
      },
      {
        title: "열람 전 필수 완료 항목",
        body: "아래 3가지를 모두 완료해야 성적열람이 가능해요.\n교과목별 사후평가 문의: 031-467-4551\n강의평가 문의: 031-467-4712\n지도교수 상담평가 문의: 031-467-4726",
      },
      {
        title: "성적확인 기간에 점수가 없다면",
        body: "담당교수가 기간 내 점수를 입력하지 않은 경우예요. 해당 과목 교수님께 직접 문의해주세요.",
      },
      {
        title: "성적증명서 발급",
        body: '우편 발송은 하지 않아요. 대학홈페이지 맨 하단 "증명서발급" 메뉴 또는 학교 내 자동증명발급기에서 발급받을 수 있어요.',
      },
    ],
    quickReplies: [
      { label: "성적 메뉴로", targetId: "grades" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "grades-evaluation": {
    id: "grades-evaluation",
    intro: "성적평가 및 산출 방법이에요.",
    topLink: { label: "📋 성적평가 안내 페이지 보기", url: OFFICIAL_LINKS.gradesEvaluationNotice },
    cards: [
      {
        title: "상대평가 원칙",
        body: "학업성적은 상대평가가 원칙이에요.\nA등급: 최대 35% / A~B등급: 최대 75%",
      },
      {
        title: "절대평가 적용 과목",
        body: "현장실습(유사교과목), 졸업작품(유사교과목), PF과목, 수강인원 10명 이하 교과목은 성취 수준에 따라 절대평가로 부여돼요.",
      },
      {
        title: "등급별 평점",
        body: "A+ 4.5 / Ao 4.0 / B+ 3.5 / Bo 3.0 / C+ 2.5 / Co 2.0 / D+ 1.5 / Do 1.0 / F 0",
      },
      {
        title: "평균평점 계산 방법",
        body: "평점계(교과목학점 × 교과목평점의 합) ÷ 신청학점 = 평균평점\n단, PF 과목은 학점에는 포함되지만 평점 계산에서는 제외돼요(신청학점에서 PF 학점을 뺀 값으로 나눠요).",
      },
      {
        title: "소수점 반올림 자리수 변경",
        body: "2024학년도 2학기부터 평균평점을 소수점 이하 2자리에서 3자리로 반올림하도록 바뀌었어요(학사규정 제49조).\n예) 2023학년도 입학생은 23-1~24-1학기까지는 2자리, 24-2학기부터는 3자리 반올림 적용.",
      },
      {
        title: "백분위 환산",
        body: "평점평균 4.5는 100점, 0점은 0점에 대응하는 식으로 백분위로 환산돼요. 구간별 정확한 환산표는 아래 공지 원문에서 확인해주세요.",
        link: { label: "백분위 환산표 보기", url: OFFICIAL_LINKS.gradesEvaluationNotice },
      },
    ],
    quickReplies: [
      { label: "성적 메뉴로", targetId: "grades" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "grades-warning": {
    id: "grades-warning",
    intro: "학사경고 기준이에요.",
    cards: [
      {
        title: "학사경고 기준",
        body: "매 학기 평균평점이 1.0 미만이면 학사경고를 받아요.",
      },
    ],
    quickReplies: [
      { label: "성적 메뉴로", targetId: "grades" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "grades-appeal": {
    id: "grades-appeal",
    intro: "성적 정정·이의신청 절차예요.",
    cards: [
      {
        title: "이의신청 방법",
        body: '성적 조회 화면의 "성적이의 신청란" 또는 면담을 통해 이의제기 및 수정이 가능해요.\n면담 시 담당교수 연락처는 강의계획서를 참고하거나 학과사무실로 문의하세요.',
        link: { label: "학과별 연락처 보기", url: OFFICIAL_LINKS.departmentOffices },
      },
      {
        title: "정정기간 이후라면",
        body: '정당한 사유가 있는 경우 성적정정원과 증빙자료를 담당교수가 전자결재로 제출할 수 있어요. 처리 결과는 학생포털 "전체학기성적조회"에서 확인할 수 있어요.',
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
      {
        title: "학과별 연락처",
        body: "학과 사무실 전화번호를 학과별로 확인할 수 있어요.",
        link: { label: "학과별 연락처 보기", url: OFFICIAL_LINKS.departmentOffices },
      },
      {
        title: "부서별 연락처",
        body: "행정부서(기숙사 등 포함) 전화번호를 확인할 수 있어요.",
        link: { label: "부서별 연락처 보기", url: OFFICIAL_LINKS.officeContacts },
      },
      { title: "교육행정팀장", body: "031-467-4710" },
      { title: "교육행정팀 (학적: 휴학·복학·전과)", body: "031-467-4713" },
      { title: "교육행정팀 (수강·성적)", body: "031-467-4714" },
      { title: "학생복지팀 (장학금·학자금대출)", body: "031-467-4721~3" },
      { title: "등록금 과오납·카드납부", body: "031-467-4754, 9" },
      { title: "총학생회", body: "031-467-4725" },
      { title: "외국인 유학생 (입학·홍보)", body: "031-467-4592" },
      { title: "외국인 유학생 (비자·행사)", body: "031-467-4585" },
      { title: "외국인 유학생 (기숙사·재직자반·사회통합프로그램)", body: "031-467-4980" },
      { title: "교양학사", body: "031-467-4552" },
      { title: "교양수업", body: "031-467-4553" },
    ],
    quickReplies: [{ label: "처음으로", targetId: "root" }],
  },

  // ----- 휴학 (2026학년도 2학기 휴학 신청 안내 공지 기준) -----
  leave: {
    id: "leave",
    intro:
      "휴학 안내해드릴게요! 아래에서 궁금한 내용을 선택해주세요.\n(2026학년도 2학기 기준)",
    topLink: {
      label: "📋 휴학 기본사항 안내 바로가기 (휴학종류·신청방법·구비서류)",
      url: OFFICIAL_LINKS.leaveOfAbsenceInfo,
    },
    quickReplies: [
      { label: "일반(가사)휴학 신청기간·등록금반환", targetId: "leave-general" },
      { label: "질병휴학·군휴학", targetId: "leave-illness-military" },
      { label: "신청 절차", targetId: "leave-procedure" },
      { label: "일반휴학 제한 대상", targetId: "leave-limit" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "leave-general": {
    id: "leave-general",
    intro:
      "일반(가사)휴학 신청기간 및 등록금 반환 기준이에요.\n신청기간: 2026. 7. 13.(월) ~ 11. 27.(금) 13:00까지",
    cards: [
      {
        title: "학기개시일 전일까지 (2주까지 인정)",
        body: "최종승인: ~2026.9.14.(월) 16:00까지\n반환 비율: 전액반환",
      },
      {
        title: "학기개시일부터 30일까지",
        body: "최종승인: ~2026.9.30.(수) 16:00까지\n반환 비율: 5/6 반환",
      },
      {
        title: "학기개시일 30일 초과 ~ 60일까지",
        body: "최종승인: ~2026.10.30.(금) 13:00까지\n반환 비율: 2/3 반환",
      },
      {
        title: "학기개시일 60일 초과 ~ 90일까지",
        body: "최종승인: ~2026.11.27.(금) 13:00까지\n반환 비율: 1/2 반환",
      },
      {
        title: "학기개시일 91일 이후",
        body: "일반휴학 신청 종료\n반환 비율: 반환없음",
      },
      {
        title: "유의사항",
        body: "2026.1.1.부터는 등록금 납부 후 휴학하더라도 등록금이 반환돼요.\n2026학년도 1학기 휴학(예정)생은 등록금을 납부하지 마세요.\n휴학으로 예비군 동원·교육훈련 보류 사유가 해소되면 해소일로부터 14일 이내에 소속 예비군중대에 신고해야 해요(미신고 시 예비군법 제15조12항에 따라 처벌될 수 있어요).",
      },
    ],
    quickReplies: [
      { label: "휴학 메뉴로", targetId: "leave" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "leave-illness-military": {
    id: "leave-illness-military",
    intro: "질병휴학·군휴학 안내예요. (사유 발생 시 상시 신청 가능)",
    cards: [
      {
        title: "학기개시일 90일 이전 신청",
        body: "신청기간: 2026.7.13.(월) ~ 2026.11.27.(금) 13:00까지 최종승인 완료분\n성적인정: 미인정\n등록금: 해당 학기 납부한 등록금 전액 반환\n※ 군휴학은 11.27까지 입영일자가 포함된 입영통지서 또는 병적증명서 제출 필요(입영사실예정서·입영판정검사서 불가)",
      },
      {
        title: "학기개시일 90일 이후 신청",
        body: "신청기간: 군 입대일 또는 질병 진단일이 학기개시일 91일부터 기말고사 종료일 사이인 경우\n성적인정: 인정\n등록금: 소멸(해당 학기 이수 처리)",
      },
      {
        title: "구비서류",
        body: "군 입대휴학: 병무청장이 발행한, 확정된 입영일자가 기재된 '입영통지서' 사본(입영사실예정서·입영판정검사서 불가)\n질병휴학: 4주 이상 학업을 계속할 수 없다는 소견이 기재된 전문의료인(의사·한의사) 발행 '진단서'",
      },
    ],
    quickReplies: [
      { label: "휴학 메뉴로", targetId: "leave" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "leave-procedure": {
    id: "leave-procedure",
    intro:
      "휴학 신청 절차예요. (인터넷 온라인 신청, 별도 휴학원서 불필요 / 휴학 면담은 대면 원칙)",
    topLink: {
      label: "☎️ 학과사무실 연락처 보기",
      url: OFFICIAL_LINKS.departmentOffices,
    },
    cards: [
      { title: "STEP 1. 지도교수 면담신청", body: "학생포털 → 학생이력관리시스템에서 신청" },
      { title: "STEP 2. 면담 및 승인", body: "휴학 면담(대면 또는 유선) → 휴학 원서 작성 승인" },
      { title: "STEP 3. 휴학신청", body: "휴학신청서 접수 + 구비서류 업로드(PDF파일)" },
      { title: "STEP 4. 승인", body: "학부(과)장 승인 (필요 시 대면 또는 유선면담)" },
      {
        title: "STEP 5. 접수",
        body: "교육행정팀(대학본부 1층)에서 휴학신청 접수 완료",
      },
      {
        title: "문의",
        body: "교육행정팀 031-467-4713 또는 소속 학과사무실로 문의하세요.\n진행 경과는 학생포털에서 수시 확인 가능하고, 긴급 승인이 필요하면 지도교수님·학과장님께 직접 연락하세요.",
      },
    ],
    quickReplies: [
      { label: "휴학 메뉴로", targetId: "leave" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "leave-limit": {
    id: "leave-limit",
    intro:
      "아래 대상자는 일반휴학 신청에 제한이 있어요.\n· 신입생\n· 재입학생\n· 편입생\n· 전과생\n\n※ 세부 제한 사유·조건은 공지 원문에 표로 안내되어 있어, 정확한 내용은 아래 학과사무실로 꼭 문의해주세요.",
    topLink: {
      label: "☎️ 학과사무실 연락처 보기",
      url: OFFICIAL_LINKS.departmentOffices,
    },
    quickReplies: [
      { label: "휴학 메뉴로", targetId: "leave" },
      { label: "처음으로", targetId: "root" },
    ],
  },

  // ----- 복학 (2026학년도 2학기 복학신청 안내 공지 기준) -----
  return: {
    id: "return",
    intro: "복학 안내해드릴게요! 아래에서 궁금한 내용을 선택해주세요.\n(2026학년도 2학기 기준)",
    topLink: { label: "📋 복학신청 안내 공지 보기", url: OFFICIAL_LINKS.returnToSchoolNotice },
    quickReplies: [
      { label: "복학신청 기간·접수방법", targetId: "return-period" },
      { label: "산업체위탁교육생 복학", targetId: "return-industry" },
      { label: "폐지학과(폐과)·조기복학", targetId: "return-special" },
      { label: "복학 후 안내(등록금·수강신청 등)", targetId: "return-after" },
      { label: "문의처", targetId: "return-contact" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "return-period": {
    id: "return-period",
    intro: "복학신청 기간과 접수 방법이에요. (2026학년도 2학기 기준)",
    cards: [
      {
        title: "복학신청 기간",
        body: "2026. 7. 13.(월) ~ 7. 24.(금) 9:00~15:00\n※ 휴학생은 먼저 복학승인을 받은 후에 전과신청이 가능해요.",
      },
      {
        title: "온라인 접수 가능 학과",
        body: "AI시스템과 · 건설환경공학과(※토목환경과 3년제 학생은 방문) · 경영학과 · 기계공학과(※기계과 3년제 학생은 방문) · 도서관미디어정보과 · 메카트로닉스과(로봇자동화공학과 포함) · 미래자동차공학부 · 바이오헬스케어과(보건의료공학과·보건의료기기과 포함) · 반도체학과 · 방송음향기술과 · 보건안전학과 · 보건의료행정과 · 사무행정학과(※비서사무행정과 3년제 학생은 방문) · 사회복지학과 · 스포츠재활학부(스포츠학부 포함) · 언어치료학과 · 영상디자인과 · 유아교육과 · 전기공학과(※전기과 3년제 입학생은 방문) · 제과제빵과 · 항공호텔관광과(호텔관광학과·항공서비스과 포함)",
      },
      {
        title: "방문(오프라인) 접수만 가능한 학과",
        body: "건축과 · 실내디자인과 · 소방안전설비과 · 소프트웨어학부(컴퓨터정보학부·응용SW전공 포함) · 스마트팩토리과 · 전자·통신과 · 호텔조리과 · 응급구조과",
      },
      {
        title: "온라인(인터넷) 복학 절차",
        body: "학생포털시스템 → 로그인 → 학생이력관리시스템 → 학생메뉴 → 복학신청 (승인까지 1~2일 소요)",
      },
      {
        title: "오프라인(학교방문) 복학 절차",
        body: "복학원서 작성 → 학과(부)사무실에서 반 편성 및 전공 배정 → 교육행정팀에 복학원서 제출(복학신청)\n복학원서는 ① 공지 첨부파일(양식1) 출력, ② 대학본부 1층 비치, ③ 각 학과사무실 비치 중에서 받을 수 있어요.",
      },
    ],
    quickReplies: [
      { label: "복학 메뉴로", targetId: "return" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "return-industry": {
    id: "return-industry",
    intro: "산업체위탁교육생 복학 안내예요. (방문 접수만 가능)",
    cards: [
      {
        title: "재직 확인 서류 (접수일 기준 15일 이내 발급분만 인정)",
        body: "공통: 산업체위탁교육 계약서\n[재직자] ① 재직증명서 1부(직업군인은 복무확인서) ② 4대보험 가입증명서 각 1부(건강보험자격득실확인서·국민연금 가입자 가입증명서·고용보험 자격이력내역서·산재보험 자격이력내역서, 건설·설비업 산재보험 미가입 시 사업자등록증 사본 첨부) ③ 원천징수영수증(휴학 전년도)\n[사업자] ① 사업자등록증명 1부 ② 납부내역증명(납세사실증명)",
      },
      {
        title: "신청 절차",
        body: "① 복학 원서 작성(양식1) → ② 산업체위탁교육생 재직 확인 서류 작성(양식2) → ③ 교육행정팀 산업체위탁교육 담당자에게 재직 확인 서류 제출 → ④ 복학하는 소속학과사무실 방문(학년·반 편성 배정) → ⑤ 양식1·양식2 검토 완료 후 복학신청 접수",
      },
    ],
    quickReplies: [
      { label: "복학 메뉴로", targetId: "return" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "return-special": {
    id: "return-special",
    intro: "폐지된 학과(폐과) 복학과 조기복학 안내예요. (둘 다 방문 접수만 가능)",
    cards: [
      {
        title: "폐지학과(폐과) 복학",
        body: "폐지학과: 산업경영과, 해군기술부사관학과, 전자·통신과, 스마트팩토리과\n복학 신청/승인과 동시에 전과가 진행돼요.\n전과 접수일: 2026. 7. 13.(월) ~ 7. 16.(목) 10:00~15:00\n접수 방법: 학생포털시스템 → 로그인 → 학생이력관리시스템 → 학생메뉴 → 전과신청(승인 1~2일 소요)",
      },
      {
        title: "조기복학",
        body: "예정보다 일찍 복학을 희망하는 휴학생을 위한 절차예요(예: 2027년 1학기 복학 대상자가 2026년 2학기 복학을 희망하는 경우).\n방법: 복학원서 수기 작성 → 학과(부)사무실에서 예비졸업사정 → 반 편성 및 전공 점검 → 교육행정팀에 복학원서 제출\n유의사항: 복학 직전 학기 평점평균이 1.6 미만이면 학칙 제17조의1(학기취소)에 따라 해당 학기를 취소하고 복학 학기를 조정할 수 있어요. 정해진 교육과정을 다 이수하지 못해 졸업이 어려울 수 있으니 반드시 학과 상담 후 신청하세요.",
      },
    ],
    quickReplies: [
      { label: "전과 안내 보기", targetId: "transfer" },
      { label: "복학 메뉴로", targetId: "return" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "return-after": {
    id: "return-after",
    intro: "복학 승인 이후 안내사항이에요.",
    cards: [
      {
        title: "복학 승인 이후 절차",
        body: "등록금 납부: 학생포털시스템 로그인 → 학생이력 등록 → 고지서출력(학생용)\n수강신청: 학생포털시스템 메인화면 → 수강신청시스템",
      },
      {
        title: "수업연한초과자·수업연한변경자",
        body: "수강신청 기간 종료 후, 수강한 학점 구간에 따른 등록금액을 납부해요. (수업연한변경자 규정은 2026.1.1.부 시행)",
      },
      {
        title: "휴학 사유 변경·연장",
        body: '휴학 사유(종류) 변경 시: 휴학변경 신청 (예: 군휴학 → 일반휴학(가사))\n휴학 기간 연장 시: 휴학연장 신청 (예: 일반휴학(가사) → 일반휴학(가사))\n2024.1.1. 이후 일반휴학은 재학 중 2회로 제한돼요.\n2026.1.1.부터 등록금 (기)납부 후 당해학기를 이수하지 못하고 휴학하면 등록금이 반환돼요.\n복학 기간 내에 휴학연장 또는 복학신청을 하지 않으면 학칙에 따라 제적돼요.\n신청: 학생포털시스템 로그인 → 학생이력 → 학생메뉴 → 휴학신청(변경·연장 포함)',
      },
      {
        title: "기타 유의사항",
        body: "학과(부) 통폐합·분과·수업연한 변경·학과명 변경 등의 사유로 복학 시 소속학과(부)가 변경될 수 있어요.\n전자출결시스템이 도입되어 본인 소유 스마트폰으로 출석을 확인해요(다른 학생 기기 대여 시 대여자·피대여자 모두 전자출결이 일정 기간 제한돼요).\n주소·연락처가 바뀌면 학생포털시스템 → 학생이력 → 학생메뉴 → 학생카드관리에서 반드시 수정하세요(문의 031-467-4725~6).\n수업연한초과자는 예비군 보류자 신청 대상이 아니므로, 졸업식 이후 2주 이내에 소속 예비군 부대에 보류 해제 신고를 해야 해요.",
      },
    ],
    quickReplies: [
      { label: "복학 메뉴로", targetId: "return" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "return-contact": {
    id: "return-contact",
    intro: "복학 관련 문의처예요.",
    cards: [
      { title: "복학·휴학(연장)·전과·등록금납부", body: "교육행정팀 031-467-4713" },
      { title: "수강신청·성적", body: "교육행정팀 031-467-4714" },
      { title: "산업체위탁생 복학서류·증명서", body: "교육행정팀 031-467-4715" },
      {
        title: "장학금·대출",
        body: "학생복지팀 031-467-4721(교내장학·근로장학), 031-467-4722~3(국가장학·대출)",
      },
      { title: "예비군 신고", body: "주소지 관할 예비군 부대로 문의하세요." },
    ],
    quickReplies: [
      { label: "복학 메뉴로", targetId: "return" },
      { label: "처음으로", targetId: "root" },
    ],
  },

  // ----- 전과 (2026학년도 2학기 전과 신청 안내 공지 기준) -----
  transfer: {
    id: "transfer",
    intro: "전과(학과 변경) 안내해드릴게요! 아래에서 궁금한 내용을 선택해주세요.\n(2026학년도 2학기 기준)",
    topLink: { label: "📋 전과 신청 안내 공지 보기", url: OFFICIAL_LINKS.majorTransferNotice },
    quickReplies: [
      { label: "전형일정", targetId: "transfer-schedule" },
      { label: "신청대상·절차", targetId: "transfer-eligibility" },
      { label: "전과 제한 대상", targetId: "transfer-restriction" },
      { label: "신청 시 유의사항", targetId: "transfer-notice" },
      { label: "합격생 유의사항(최소전공학점)", targetId: "transfer-pass-notice" },
      { label: "문의처", targetId: "transfer-contact" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "transfer-schedule": {
    id: "transfer-schedule",
    intro: "전과 전형일정이에요. (2026학년도 2학기 기준)",
    cards: [
      { title: "전과 신청 원서 접수", body: "2026. 7. 13.(월) ~ 7. 16.(목) 10:00~15:00" },
      { title: "전입 학과(부) 면접전형 심사", body: "2026. 7. 20.(월) ~ 7. 23.(목)" },
      { title: "전과 합격자 발표", body: "2026. 7. 24.(금) 13:00 이후" },
      { title: "기존취득 성적/학점 인정 입력", body: "2026. 8. 3.(월) ~ 8. 7.(금)" },
    ],
    quickReplies: [
      { label: "전과 메뉴로", targetId: "transfer" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "transfer-eligibility": {
    id: "transfer-eligibility",
    intro: "전과신청 대상과 절차예요.",
    cards: [
      {
        title: "신청 대상",
        body: "2년제 학과로 전과 희망: 1학년 2학기 ~ 2학년 1학기 재학(복학) 예정생\n3년제 학과로 전과 희망: 1학년 2학기 ~ 3학년 1학기 재학(복학) 예정생\n폐지 학과로 복학 예정인 학생",
      },
      {
        title: "신청 절차",
        body: "학생포털시스템 → 로그인 → 학생이력관리시스템 → 학생메뉴 → 전과신청(승인 1~2일 소요)\n현 소속학과 지도교수·학과장 상담 및 승인 → 전과 사유 및 전입희망 학과 선택 → 진행 경과 확인\n휴학생은 기존 소속학과로 먼저 복학한 뒤 전과 신청이 가능해요.",
        link: { label: "학생포털 바로가기", url: OFFICIAL_LINKS.portal },
      },
      {
        title: "선발기준",
        body: "선발기준·절차는 학과(부)별로 다르며, 각 학과에서 정한 전형기준에 따라 선발해요. 정확한 기준은 전입 희망 학과사무실로 문의하세요.",
        link: { label: "학과사무실 연락처 보기", url: OFFICIAL_LINKS.departmentOffices },
      },
    ],
    quickReplies: [
      { label: "전과 메뉴로", targetId: "transfer" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "transfer-restriction": {
    id: "transfer-restriction",
    intro:
      "아래 대상자는 전과 신청이 제한돼요.\n· 예체능 특기자로 입학한 학생\n· 산업체 위탁 과정으로 입학한 학생\n· 전문계 고교와의 연계 교육으로 입학한 학생\n· 학사학위 전공심화 과정으로 입학한 학생\n· 편입학한 학생",
    quickReplies: [
      { label: "전과 메뉴로", targetId: "transfer" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "transfer-notice": {
    id: "transfer-notice",
    intro: "전과신청 시 유의사항이에요.",
    cards: [
      {
        title: "전과 범위·횟수",
        body: "계열 구분 없이 전과가 허용돼요.\n전과는 재학 기간 중 총 2회까지만 허용돼요.\n3학년 재학 중인 학생은 2년제 학과로 전과할 수 없어요.",
      },
      {
        title: "수업연한·등록금",
        body: "2년제 학과에서 3년제 학과로 전과하면 수업연한을 3년제로 연장한 것으로 봐요.\n전과 합격자는 전과 후 학과(부)의 등록금액을 납부해야 해요(기납입자는 납부 금액을 인정하고 차액은 별도 청구하지 않아요).",
      },
    ],
    quickReplies: [
      { label: "전과 메뉴로", targetId: "transfer" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "transfer-pass-notice": {
    id: "transfer-pass-notice",
    intro: "전과 합격생 유의사항이에요.",
    cards: [
      {
        title: "필수교과목·최소 전공학점",
        body: "전입 학과(부)의 교육과정에 따라 필수교과목과 최소 전공학점 이상을 이수해야 해요.\n2012~2018학번: 2년제 64학점 / 3년제 96학점\n2019학번부터: 2년제 51학점 / 3년제 76학점\n2025학번부터: 2년제 45학점 / 3년제 67학점",
      },
      {
        title: "기존 학점 인정",
        body: "기존 학과(부)에서 이미 취득한 교양학점 및 P/F학점은 모두 인정받을 수 있어요.\n폐과(부) 사유로 부득이 전과하는 경우에는 이수한 모든 학점을 인정받을 수 있어요(학사규정 제16조(학점인정 신청) 7항 3호).",
      },
      {
        title: "졸업·휴학 유의사항",
        body: "전입 학과의 전공학점 부족으로 일반적인 수업연한 내에 졸업하지 못할 수 있어요.\n전과 합격자는 합격한 해당 학기에 일반휴학을 할 수 없어요(군휴학은 가능해요).",
      },
    ],
    quickReplies: [
      { label: "전과 메뉴로", targetId: "transfer" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "transfer-contact": {
    id: "transfer-contact",
    intro: "전과 관련 문의처예요.",
    cards: [
      {
        title: "문의",
        body: "교육행정팀 031-467-4713 또는 소속 학과사무실로 문의하세요.",
        link: { label: "학과사무실 연락처 보기", url: OFFICIAL_LINKS.departmentOffices },
      },
    ],
    quickReplies: [
      { label: "전과 메뉴로", targetId: "transfer" },
      { label: "처음으로", targetId: "root" },
    ],
  },

  // ----- 통학버스 (안양역/범계역 통학버스 안내 페이지 기준) -----
  shuttle: {
    id: "shuttle",
    intro: "통학버스 안내해드릴게요! 정거장을 선택해주세요.\n(월~금요일만 운행하고, 주말·공휴일·방학 기간은 운행하지 않아요)",
    topLink: { label: "📋 통학버스 안내 페이지 보기", url: OFFICIAL_LINKS.shuttleBusNotice },
    quickReplies: [
      { label: "안양역 통학버스", targetId: "shuttle-anyang" },
      { label: "범계역 통학버스", targetId: "shuttle-beomgye" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "shuttle-anyang": {
    id: "shuttle-anyang",
    intro: "안양역 통학버스 안내예요. (월~금요일 운행, 주말·공휴일·방학 기간 운행하지 않아요)",
    cards: [
      {
        title: "정류장 위치",
        body: "안양역 2번 출구 → 안양1동 행정복지센터 방향 250m 지점\n무료, 약 7분 소요\n학교까지 도보로는 약 680m(도보 10분 내외)라서 혼잡한 시간대는 도보 이용도 추천해요.",
      },
      {
        title: "오전 (안양역 출발)",
        body: "08:10~11:00 순환 운행 (약 10분 간격)",
      },
      {
        title: "오후 (학교 출발)",
        body: "13:00~14:00 순환 운행 (약 10~15분 간격)\n15:30~19:00 순환 운행 (약 10분 간격)",
      },
      {
        title: "야간 (학교 출발, 정시 출발)",
        body: "19:00 / 19:30 / 20:00 / 20:30 / 21:00 / 21:30 / 22:00 / 22:30",
      },
      {
        title: "유의사항",
        body: "도로 상황·기상 조건에 따라 도착 시간이 달라질 수 있어요.\n스마트캠퍼스 앱에서 실시간 버스 위치를 확인할 수 있어요.",
      },
    ],
    quickReplies: [
      { label: "통학버스 메뉴로", targetId: "shuttle" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "shuttle-beomgye": {
    id: "shuttle-beomgye",
    intro: "범계역 통학버스 안내예요. (월~금요일 운행, 주말·공휴일·방학 기간 운행하지 않아요)",
    cards: [
      {
        title: "정류장 위치",
        body: "범계역 8번 출구 길 건너 종로귀금속 평촌타운 상가 앞\n무료, 약 10분 소요",
      },
      {
        title: "학교 출발",
        body: "오전: 8:45 / 9:15 / 9:45 / 10:15\n오후: 15:30 / 16:00 / 16:30 / 17:00 / 17:30 / 18:00\n(모두 정시 출발)",
      },
      {
        title: "범계역 출발",
        body: "오전: 8:15 / 8:30 / 9:00 / 9:30 / 10:00 / 10:30\n오후: 15:45 / 16:15 / 16:45 / 17:15 / 17:45 / 18:15\n(모두 정시 출발)",
      },
      {
        title: "유의사항",
        body: "도로 상황·기상 조건에 따라 도착 시간이 달라질 수 있어요.\n스마트캠퍼스 앱에서 실시간 버스 위치를 확인할 수 있어요.",
      },
    ],
    quickReplies: [
      { label: "통학버스 메뉴로", targetId: "shuttle" },
      { label: "처음으로", targetId: "root" },
    ],
  },

  // ----- 증명서 발급 (증명서발급 공지 기준) -----
  certificate: {
    id: "certificate",
    intro: "증명서 발급 안내해드릴게요! 아래에서 궁금한 내용을 선택해주세요.",
    topLink: { label: "📋 증명서발급 안내 공지 보기", url: OFFICIAL_LINKS.certificateNotice },
    quickReplies: [
      { label: "증명서 종류", targetId: "certificate-types" },
      { label: "발급 방법(자동발급기·인터넷·FAX)", targetId: "certificate-issue" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "certificate-types": {
    id: "certificate-types",
    intro: "증명서 종류예요.",
    cards: [
      {
        title: "국문 증명서",
        body: "재학, 졸업, 졸업예정, 성적, 휴학, 제적, 교육비 납입 증명서",
      },
      {
        title: "영문 증명서",
        body: "졸업, 성적 증명서",
      },
      {
        title: "유의사항",
        body: "증명서는 전문학사, 학사학위 전공심화, 전문기술석사 각 과정별로 별도로 신청해야 해요.\n성적증명서의 평점평균은 소수점 이하 3자리에서 반올림하여 2자리까지 표기돼요.",
      },
    ],
    quickReplies: [
      { label: "증명서 메뉴로", targetId: "certificate" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "certificate-issue": {
    id: "certificate-issue",
    intro: "증명서 발급절차예요. (학교 자동발급기 → FAX민원 발급 → 인터넷 증명발급 순서로 안내)",
    cards: [
      {
        title: "학교 자동발급기",
        body: "위치: 홍지관 2층(카페앞), 대학본부 1층, 율곡관 3층(자판기옆)\n재학생 로그인: 학생포털시스템과 동일(아이디: 학번, 비밀번호: 포털 비밀번호)\n졸업생 로그인: 본인인증로그인(PASS, 카카오, 토스 등)\n아이디·비밀번호가 기억나지 않으면 대학홈페이지 학생포털시스템에서 찾기 가능",
      },
      {
        title: "FAX민원 발급",
        body: "가까운 시·군·구청 또는 행정복지센터(주민센터)에서 신청할 수 있어요.",
      },
      {
        title: "인터넷 증명발급",
        body: "인터넷증명발급센터에서 회원가입 후 발급받을 수 있어요.",
        link: { label: "인터넷증명발급센터 바로가기", url: OFFICIAL_LINKS.certificateIssueCenter },
      },
      {
        title: "기타 문의",
        body: "교육행정팀 031-467-4715로 문의하시거나 업무시간 내 방문해주세요.",
      },
    ],
    quickReplies: [
      { label: "증명서 메뉴로", targetId: "certificate" },
      { label: "처음으로", targetId: "root" },
    ],
  },

  // ----- 계절학기 (계절학기 개설 안내 공지 기준) -----
  seasonal: {
    id: "seasonal",
    intro: "계절학기 안내해드릴게요! 아래에서 궁금한 내용을 선택해주세요.",
    topLink: { label: "📋 계절학기 개설 안내 공지 보기", url: OFFICIAL_LINKS.seasonalSemesterNotice },
    quickReplies: [
      { label: "개설 안내", targetId: "seasonal-open" },
      { label: "수강신청·수강절차", targetId: "seasonal-apply" },
      { label: "성적·수강료", targetId: "seasonal-fee" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "seasonal-open": {
    id: "seasonal-open",
    intro: "계절학기 개설 안내예요.",
    cards: [
      {
        title: "개설시기·개설기간",
        body: "동·하계 방학을 이용해 개설돼요.\n계절학기 수강신청 후 3주(15일)간 편성돼요(개설기간 내에 현장실습을 진행해야 하는 경우 계절학기 수강을 할 수 없어요).",
      },
      {
        title: "개설과목",
        body: "전공 또는 교양과목이 개설돼요.\n수강신청 인원이 10명 이하인 교과목은 폐강될 수 있어요.",
      },
    ],
    quickReplies: [
      { label: "계절학기 메뉴로", targetId: "seasonal" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "seasonal-apply": {
    id: "seasonal-apply",
    intro: "계절학기 수강신청과 수강절차예요.",
    cards: [
      {
        title: "수강신청 기간·대상",
        body: "신청기간: 6월, 12월 종강 후 지정된 일자(세부 일정은 별도 공지)\n신청대상: 정규학기(2년제 4학기, 3년제 6학기)를 모두 이수한 학생만 신청할 수 있어요.\n수강신청 인원은 강좌에 따라 제한될 수 있어요.",
      },
      {
        title: "수강신청 학점",
        body: "최대 9학점까지 신청할 수 있어요(계절학기로 취득할 수 있는 학점은 총 9학점이에요).",
      },
      {
        title: "수강절차",
        body: "STEP 1. 교육행정팀 - 수강 신청서 교부\nSTEP 2. 수강신청자 - 수강 신청서 작성 및 확인\nSTEP 3. 교육행정팀 - 계절학기 수강신청\nSTEP 4. 수강신청자 - 수강료 납부 후 수강",
      },
    ],
    quickReplies: [
      { label: "계절학기 메뉴로", targetId: "seasonal" },
      { label: "처음으로", targetId: "root" },
    ],
  },
  "seasonal-fee": {
    id: "seasonal-fee",
    intro: "계절학기 성적 처리와 수강료예요.",
    cards: [
      {
        title: "성적",
        body: "계절학기에서 이수한 학점은 졸업이수학점에 포함되지만 당해학기 성적에서는 제외돼요.\n출결, 시험, 평가 등의 성적평가는 정규학기와 동일하게 운영돼요.",
      },
      {
        title: "수강료 (감면·면제 없음)",
        body: "1학점당 8만원씩 부과돼요.\n3학점 신청: 24만원\n6학점 신청: 48만원\n9학점 신청: 72만원",
      },
    ],
    quickReplies: [
      { label: "계절학기 메뉴로", targetId: "seasonal" },
      { label: "처음으로", targetId: "root" },
    ],
  },

  // ----- 조기취업 -----
  "early-employment": {
    id: "early-employment",
    intro: "조기취업 시 출석 인정 안내예요.",
    cards: [
      {
        title: "대상",
        body: "마지막 학기(수업연한 1년제 2학기[전공심화], 2년제 4학기, 3년제 6학기)와 수업연한 초과자 중, 졸업사정 이후 최초(1개 학기)에 조기취업한 학생만 해당돼요(산업체위탁, P-Tech 제외).",
      },
      {
        title: "출석 인정 기준",
        body: "대면 수업만 출석이 인정되고, 원격(온라인) 수업의 출석은 인정되지 않아요.",
      },
      {
        title: "학과 문의",
        body: "세부 서류·신청 절차 등 더 궁금한 점은 소속 학과로 문의해주세요.",
        link: { label: "학과별 연락처 보기", url: OFFICIAL_LINKS.departmentOffices },
      },
      {
        title: "교육행정팀 문의",
        body: "교육행정팀 031-467-4714",
        link: { label: "부서별 연락처 보기", url: OFFICIAL_LINKS.officeContacts },
      },
    ],
    quickReplies: [
      { label: "처음으로", targetId: "root" },
    ],
  },

  // ----- P/F 과목 -----
  "pf-course": {
    id: "pf-course",
    intro: "P/F 과목 안내예요.",
    topLink: { label: "💬 궁금한 점은 Q&A 게시판에서 질문하기", url: OFFICIAL_LINKS.qnaBoard },
    cards: [
      {
        title: 'BeACE P/F 1학점',
        body: '"직업세계와 자기계발(BeACE) P/F 1학점"은 2024학년도 2학기부터 별도 수강신청 없이, BeACE 이수 기준을 충족하면 취업팀에서 자동으로 부여해요(수업연한 초과자는 제외).\nBeACE 1학점은 성적열람 기간에 확인 가능하며, 이수 기준 충족 여부는 취업팀에서 확인할 수 있어요.',
      },
      {
        title: "P/F 과목 인정 기준",
        body: "P/F 과목은 졸업학점에는 포함되지만 평점에는 반영되지 않아요.",
      },
      {
        title: "P/F 학점 한도",
        body: "재학 중 최대 6학점까지만 인정돼요(BeACE, 어학, 봉사, 창업, 군 학점인정, 각 사업단 P/F 교과목 포함).",
      },
      {
        title: "한 학기 P/F 2학점 수강 가능 여부",
        body: "죄송해요, 이 부분은 저희가 확인한 학교 측 공식 답변이 아직 없어요. 최근 관련 Q&A도 있었던 만큼, 아래 Q&A 게시판이나 교육행정팀(031-467-4714)에 직접 문의해서 정확히 확인해주세요.",
        link: { label: "Q&A 게시판 바로가기", url: OFFICIAL_LINKS.qnaBoard },
      },
      {
        title: "문의처",
        body: "교육행정팀 031-467-4714",
        link: { label: "부서별 연락처 보기", url: OFFICIAL_LINKS.officeContacts },
      },
    ],
    quickReplies: [
      { label: "처음으로", targetId: "root" },
    ],
  },

  // ----- 자주 묻는 질문 (버튼을 누르면 미리 작성된 답변 화면으로 바로 이동, LLM 호출 없음) -----
  faq: {
    id: "faq",
    intro: "최근 학생들이 많이 물어본 질문이에요. 눌러보면 바로 답을 볼 수 있어요.",
    quickReplies: [
      { label: "수강신청 기간이 언제야?", targetId: "faq-course-period" },
      { label: "수강신청 포기는 어떻게 해?", targetId: "faq-course-drop" },
      { label: "성적 조회는 어디서 해?", targetId: "faq-grades-check" },
      { label: "장학금 종류 알려줘", targetId: "faq-scholarship-types" },
      { label: "등록금 분할납부 가능해?", targetId: "faq-tuition-installment" },
      { label: "학사지원팀 연락처 알려줘", targetId: "faq-contact-academic" },
      { label: "휴학하면 등록금 어떻게 돼?", targetId: "faq-leave-refund" },
      { label: "복학은 언제 신청해?", targetId: "faq-return-period" },
      { label: "통학버스는 언제 다녀?", targetId: "faq-shuttle-general" },
      { label: "증명서는 어디서 발급받아?", targetId: "faq-certificate-issue" },
      { label: "계절학기 수강신청은 어떻게 해?", targetId: "faq-seasonal-apply" },
      { label: "조기취업하면 출석 어떻게 돼?", targetId: "faq-early-employment-detail" },
      { label: "P/F 과목은 몇 학점까지 인정돼?", targetId: "faq-pf-limit-detail" },
      { label: "처음으로", targetId: "root" },
    ],
  },
};

export const DEFAULT_NODE_ID = "root";