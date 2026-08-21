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
  // ----- 장학금 (2026학년도 2학기 국가장학금/국가근로장학금/우선감면/주거안정장학금 공지 기준) -----
  {
    id: "scholarship-types",
    keywords: ["장학금 종류", "장학금", "장학"],
    question: "장학금 종류가 궁금해요",
    answer:
      "교내장학금(산업체위탁·전공심화·성적우수·입학우수·외국인유학생·국가유공자·보훈대상자 등), 국가장학금, 국가근로장학금, 주거안정장학금, 교외장학금이 있어요.",
    link: { label: "장학 안내 페이지로 이동", url: OFFICIAL_LINKS.scholarship },
  },
  {
    id: "scholarship-apply",
    keywords: ["장학금 신청", "장학 신청", "신청 방법"],
    question: "장학금은 어떻게 신청하나요?",
    answer:
      "교내장학금은 대림대 포털에서 학기 초 공지된 기간 내 신청해요. 국가장학금·국가근로장학금·주거안정장학금은 대림대 포털이 아니라 한국장학재단 홈페이지/모바일 앱에서 신청해야 해요.",
    link: { label: "포털 바로가기", url: OFFICIAL_LINKS.portal },
  },
  {
    id: "scholarship-national",
    keywords: ["국가장학금"],
    question: "국가장학금은 어떻게 신청하나요?",
    answer:
      "한국장학재단 홈페이지/모바일 앱에서 2026.8.12(수) 9시~9.9(수) 18시에 신청하고, 서류제출·가구원 동의는 9.16(수) 18시까지 완료해야 해요. 재학생·편입생·복학생·재입학생 모두 신청 대상이에요.",
    link: { label: "한국장학재단 바로가기", url: OFFICIAL_LINKS.kosaf },
  },
  {
    id: "scholarship-criteria",
    keywords: ["성적 장학금", "성적우수", "장학금 기준", "장학금 조건"],
    question: "성적장학금 선발 기준이 궁금해요",
    answer:
      "성적 A·B·C 장학은 학과 추천을 받은 성적우수자, 성적 D 장학은 산업체위탁·전공심화 학생 중 학과 추천을 받은 성적우수자예요. 입학우수장학(전체수석)은 12학점 이상·평점평균 4.0 이상 유지 시 계속 지원돼요.",
    link: { label: "장학 안내 페이지로 이동", url: OFFICIAL_LINKS.scholarship },
  },
  {
    id: "scholarship-work-study",
    keywords: ["국가근로장학금", "근로장학금"],
    question: "국가근로장학금은 어떻게 신청하나요?",
    answer:
      "학자금 지원구간 9구간 이하, 직전학기 성적 70점(C학점) 이상이면 신청할 수 있어요. 신청기간은 2026.8.12(수) 9시~9.9(수) 18시고, 한국장학재단에서 신청 후 희망근로지를 선택해야 배정 대상에 포함돼요. 시급은 교내근로 10,320원, 교외근로 12,790원이에요.",
    link: { label: "한국장학재단 바로가기", url: OFFICIAL_LINKS.kosaf },
  },
  {
    id: "scholarship-housing",
    keywords: ["주거안정장학금"],
    question: "주거안정장학금은 누가 신청할 수 있나요?",
    answer:
      "원거리 대학에 진학한 기초생활수급자·차상위계층 학생 중 만 39세 이하(미혼)이면 신청할 수 있어요(대학원생 제외). 신청기간은 2026.8.12(수)~9.9(수) 18시, 서류제출·가구원 동의는 9.16(수) 18시까지예요. 구체적인 신청 절차는 공지의 붙임파일을 꼭 확인하세요.",
    link: { label: "주거안정장학금 공지 보기", url: OFFICIAL_LINKS.scholarshipHousingNotice },
  },
  {
    id: "scholarship-priority",
    keywords: ["우선감면", "0원 등록", "장학금 감면"],
    question: "장학금 우선감면은 어떻게 처리되나요?",
    answer:
      "전액 장학생(등록금 0원)은 반드시 '0원' 등록을 해야 해요(안 하면 미등록 제적). 장학 내역은 등록금고지서에서 8.24(월)부터 조회 가능하고, 국가장학금은 8.3까지 승인 시 고지서 감면, 8.4 이후 승인 시 10~12월 중 학생계좌 지급 또는 대출 상환돼요.",
    link: { label: "우선감면 안내 공지 보기", url: OFFICIAL_LINKS.scholarshipPriorityNotice },
  },
  {
    id: "scholarship-external-sejong",
    keywords: ["세종이도인재장학금", "세종이도"],
    question: "세종이도인재장학금은 어떤 장학금인가요?",
    answer: "세종이도인재장학금 장학생 모집 안내예요. 자세한 대상·조건은 공지 원문을 확인해주세요.",
    link: { label: "공지 보러가기", url: OFFICIAL_LINKS.scholarshipExternal1 },
  },
  {
    id: "scholarship-external-seoul",
    keywords: ["서울인재대학장학금", "서울시미래인재재단"],
    question: "서울인재대학장학금은 어떤 장학금인가요?",
    answer:
      "[서울시미래인재재단] 2026년 하반기 서울인재대학장학금 장학생 선발 공고예요. 자세한 대상·조건은 공지 원문을 확인해주세요.",
    link: { label: "공지 보러가기", url: OFFICIAL_LINKS.scholarshipExternal2 },
  },
  {
    id: "scholarship-external-anyang",
    keywords: ["ESG 행복 장학생", "안양시인재육성재단"],
    question: "ESG 행복 장학생은 어떤 장학금인가요?",
    answer:
      "[안양시인재육성재단] 2026 ESG 행복 장학생 선발 안내예요. 자세한 대상·조건은 공지 원문을 확인해주세요.",
    link: { label: "공지 보러가기", url: OFFICIAL_LINKS.scholarshipExternal3 },
  },

  // ----- 등록 -----
  {
    id: "tuition-period",
    keywords: ["등록금 납부", "등록 기간", "등록금", "등록"],
    question: "등록금 납부 기간이 언제인가요?",
    answer:
      "2026.8.24(월) 9:00 ~ 8.28(금) 16:00이에요. 은행 업무시간(오전 9시~오후 4시)에만 가능하고, 공휴일(토·일 포함)은 납부할 수 없어요. 휴학(예정)생은 납부하면 안 돼요.",
    link: { label: "학사일정 확인", url: OFFICIAL_LINKS.academicCalendar },
  },
  {
    id: "tuition-installment",
    keywords: ["분할납부", "등록금 분할"],
    question: "등록금 분할납부가 가능한가요?",
    answer:
      "네, 가능해요. 신청기간은 2026.8.24(월)~9.16(수) 16:00까지고, 1회분(~9.17), 2회분(~10.29), 3회분(~11.26)으로 나눠 납부해요(모두 16:00까지). 단 신입생·재입학생·편입생 첫 학기, 학비감면 총액이 등록금의 75% 이상인 학생, 신청학점 7학점 미만 수업연한초과자는 신청이 제한돼요.",
    link: { label: "포털 바로가기", url: OFFICIAL_LINKS.portal },
  },
  {
    id: "tuition-refund",
    keywords: ["등록금 반환", "등록금 환불", "등록금 반환기준"],
    question: "등록금 반환 기준이 어떻게 되나요?",
    answer:
      "학기개시일(9.1) 전일까지(2주까지 인정, ~9.14 16:00 최종승인): 전액반환 / 30일까지(~9.30 16:00): 5/6 반환 / 30일 초과~60일까지(~10.30 14:00): 2/3 반환 / 60일 초과~90일까지(~11.27 14:00): 1/2 반환 / 91일 이후: 반환없음. 개강일 이전 휴학은 전액 반환, 개강일 이후는 차감 반환되고, 군입대·질병 등 부득이한 사유는 전액 반환돼요.",
    link: { label: "학사일정 확인", url: OFFICIAL_LINKS.academicCalendar },
  },
  {
    id: "tuition-contact",
    keywords: ["등록금 문의", "등록금 문의처"],
    question: "등록금 관련 문의는 어디로 하나요?",
    answer:
      "과오납·카드납부는 031-467-4754·9, 고지서 출력·전액장학생등록·이월/환불은 031-467-4713, 등록금 우선감면(장학금·학자금대출)은 031-467-4721~3, 학생회비·졸업가운비는 031-467-4725로 문의하세요.",
  },
  // ----- 휴학 (2026학년도 2학기 휴학 신청 안내 공지 기준) -----
  {
    id: "leave-basic",
    keywords: ["휴학", "휴학 신청", "휴학 방법", "휴학 종류"],
    question: "휴학은 어떻게 신청하나요?",
    answer:
      "학생포털 → 학생이력관리시스템 → 학생메뉴 → 휴학신청에서 온라인으로 신청해요(별도 휴학원서 불필요). 휴학 종류는 일반(가사)휴학과 질병휴학·군휴학이 있고, 휴학 면담은 대면 진행이 원칙이에요.",
    link: { label: "휴학 기본사항 안내 보기", url: OFFICIAL_LINKS.leaveOfAbsenceInfo },
  },
  {
    id: "leave-general-period",
    keywords: ["일반휴학", "가사휴학", "휴학 신청기간", "휴학 기간"],
    question: "일반(가사)휴학 신청 기간이 언제인가요?",
    answer:
      "2026. 7. 13.(월) ~ 11. 27.(금) 13:00까지 신청할 수 있어요. 다만 학기개시일 기준 경과 일수에 따라 최종승인 마감일과 등록금 반환 비율이 달라지니 꼭 확인하세요.",
    link: { label: "휴학 기본사항 안내 보기", url: OFFICIAL_LINKS.leaveOfAbsenceInfo },
  },
  {
    id: "leave-refund",
    keywords: ["휴학 등록금", "등록금 반환", "휴학하면 등록금"],
    question: "휴학하면 등록금은 얼마나 돌려받나요?",
    answer:
      "학기개시일 전일까지(2주까지 인정, ~9.14 16:00 최종승인): 전액반환 / 학기개시일부터 30일까지(~9.30 16:00): 5/6 반환 / 30일 초과~60일까지(~10.30 13:00): 2/3 반환 / 60일 초과~90일까지(~11.27 13:00): 1/2 반환 / 91일 이후: 일반휴학 신청 종료, 반환없음. ※ 2026.1.1.부터는 등록금 납부 후 휴학하더라도 등록금이 반환돼요.",
    link: { label: "휴학 기본사항 안내 보기", url: OFFICIAL_LINKS.leaveOfAbsenceInfo },
  },
  {
    id: "leave-illness-military",
    keywords: ["질병휴학", "군휴학", "군입대 휴학", "입대 휴학"],
    question: "질병휴학·군휴학은 언제까지 신청하나요?",
    answer:
      "학기개시일 90일 이전이면 2026.7.13.~11.27.(금) 13:00까지 최종승인 완료해야 하고 성적은 미인정, 등록금은 전액 반환돼요. 90일 이후(입대일·진단일이 91일차~기말고사 종료일 사이)면 성적은 인정되지만 등록금은 소멸(해당 학기 이수 처리)돼요. 군휴학은 확정 입영일자가 적힌 입영통지서, 질병휴학은 4주 이상 학업 불가 소견의 진단서가 필요해요.",
    link: { label: "휴학 기본사항 안내 보기", url: OFFICIAL_LINKS.leaveOfAbsenceInfo },
  },
  {
    id: "leave-procedure",
    keywords: ["휴학 신청 절차", "휴학 신청 순서", "휴학 승인"],
    question: "휴학 신청 절차가 어떻게 되나요?",
    answer:
      "① 지도교수 면담신청(학생포털) → ② 면담 및 휴학 원서 작성 승인 → ③ 휴학신청서 접수 + 구비서류 업로드(PDF) → ④ 학부(과)장 승인 → ⑤ 교육행정팀(대학본부 1층) 접수 완료 순서예요.",
    link: { label: "휴학 기본사항 안내 보기", url: OFFICIAL_LINKS.leaveOfAbsenceInfo },
  },
  {
    id: "leave-contact",
    keywords: ["휴학 문의", "휴학 문의처", "휴학 상담"],
    question: "휴학 관련 문의는 어디로 하나요?",
    answer: "교육행정팀(031-467-4713) 또는 소속 학과사무실로 문의하시면 돼요.",
    link: { label: "학과사무실 연락처 보기", url: OFFICIAL_LINKS.departmentOffices },
  },

  // ----- 복학 (2026학년도 2학기 복학신청 안내 공지 기준) -----
  {
    id: "return-period",
    keywords: ["복학", "복학신청", "복학 기간", "복학 신청기간"],
    question: "복학은 언제, 어떻게 신청하나요?",
    answer:
      "복학신청 기간은 2026. 7. 13.(월) ~ 7. 24.(금) 9:00~15:00이에요. 휴학생은 먼저 복학승인을 받은 후에 전과신청이 가능해요. 온라인은 학생포털시스템 → 학생이력관리시스템 → 학생메뉴 → 복학신청(승인 1~2일 소요)이고, 방문 접수는 복학원서 작성 후 학과사무실 반편성을 거쳐 교육행정팀에 제출하는 방식이에요.",
    link: { label: "복학신청 안내 공지 보기", url: OFFICIAL_LINKS.returnToSchoolNotice },
  },
  {
    id: "return-method",
    keywords: ["복학 온라인", "복학 방문", "복학 접수방법", "온라인 복학", "방문 복학"],
    question: "제 학과는 온라인 복학이 되나요, 방문해야 하나요?",
    answer:
      "건축과·실내디자인과·소방안전설비과·소프트웨어학부(컴퓨터정보학부·응용SW전공 포함)·스마트팩토리과·전자·통신과·호텔조리과·응급구조과는 방문 접수만 가능해요. 그 외 학과는 온라인 접수가 가능하지만, 건설환경공학과(토목환경과 3년제)·기계공학과(기계과 3년제)·사무행정학과(비서사무행정과 3년제)·전기공학과(전기과 3년제 입학생)는 3년제 학생만 예외적으로 방문 접수예요.",
    link: { label: "복학신청 안내 공지 보기", url: OFFICIAL_LINKS.returnToSchoolNotice },
  },
  {
    id: "return-industry",
    keywords: ["산업체위탁 복학", "산업체위탁교육생 복학"],
    question: "산업체위탁교육생은 복학할 때 뭐가 필요한가요?",
    answer:
      "방문 접수만 가능해요. 재직 확인 서류(산업체위탁교육 계약서 + 재직자는 재직증명서·4대보험 가입증명서·원천징수영수증, 사업자는 사업자등록증명·납부내역증명, 접수일 기준 15일 이내 발급분만 인정)를 준비해서 교육행정팀 담당자에게 제출하고, 소속 학과사무실에서 반 편성을 받은 뒤 복학신청이 접수돼요.",
    link: { label: "복학신청 안내 공지 보기", url: OFFICIAL_LINKS.returnToSchoolNotice },
  },
  {
    id: "return-abolished",
    keywords: ["폐과 복학", "폐지학과 복학", "폐지학과 전과"],
    question: "폐지된 학과(폐과) 학생은 어떻게 복학하나요?",
    answer:
      "산업경영과·해군기술부사관학과·전자·통신과·스마트팩토리과 학생은 복학 신청/승인과 동시에 전과가 진행돼요. 전과 접수일은 2026. 7. 13.(월) ~ 7. 16.(목) 10:00~15:00이고, 학생포털시스템 → 학생이력관리시스템 → 학생메뉴 → 전과신청에서 접수해요(승인 1~2일 소요). 방문 접수만 가능해요.",
    link: { label: "복학신청 안내 공지 보기", url: OFFICIAL_LINKS.returnToSchoolNotice },
  },
  {
    id: "return-early",
    keywords: ["조기복학"],
    question: "조기복학은 어떻게 신청하나요?",
    answer:
      "예정보다 일찍 복학을 희망하는 휴학생을 위한 절차예요. 복학원서를 수기로 작성하고 학과(부)사무실에서 예비졸업사정·반 편성·전공 점검을 거쳐 교육행정팀에 제출해요(방문 접수만 가능). 복학 직전 학기 평점평균이 1.6 미만이면 학칙 제17조의1(학기취소)에 따라 해당 학기를 취소하고 복학 학기를 조정할 수 있고, 교육과정 미이수로 졸업이 어려울 수 있으니 반드시 학과 상담 후 신청하세요.",
    link: { label: "복학신청 안내 공지 보기", url: OFFICIAL_LINKS.returnToSchoolNotice },
  },
  {
    id: "return-after",
    keywords: ["복학 후", "복학하면 등록금", "복학 등록금", "복학 수강신청"],
    question: "복학 승인 후에는 뭘 해야 하나요?",
    answer:
      "학생포털시스템에서 고지서를 출력해 등록금을 납부하고, 수강신청시스템에서 수강신청을 하면 돼요. 수업연한초과자·수업연한변경자는 수강신청 기간 종료 후 수강 학점 구간에 따른 등록금을 납부해요. 복학 기간 내에 휴학연장이나 복학신청을 하지 않으면 학칙에 따라 제적되니 주의하세요.",
    link: { label: "복학신청 안내 공지 보기", url: OFFICIAL_LINKS.returnToSchoolNotice },
  },
  {
    id: "return-contact",
    keywords: ["복학 문의", "복학 문의처"],
    question: "복학 관련 문의는 어디로 하나요?",
    answer:
      "복학·휴학연장·전과·등록금납부는 교육행정팀 031-467-4713, 수강신청·성적은 031-467-4714, 산업체위탁생 복학서류·증명서는 031-467-4715로 문의하세요.",
    link: { label: "복학신청 안내 공지 보기", url: OFFICIAL_LINKS.returnToSchoolNotice },
  },

  // ----- 전과 (2026학년도 2학기 전과 신청 안내 공지 기준) -----
  {
    id: "transfer-schedule",
    keywords: ["전과 신청기간", "전과 일정", "전과 접수기간", "전과 발표"],
    question: "전과 전형일정이 어떻게 되나요?",
    answer:
      "원서 접수는 2026. 7. 13.(월)~7. 16.(목) 10:00~15:00, 전입 학과(부) 면접전형 심사는 7. 20.(월)~7. 23.(목), 합격자 발표는 7. 24.(금) 13:00 이후, 기존취득 성적/학점 인정 입력은 8. 3.(월)~8. 7.(금)이에요.",
    link: { label: "전과 신청 안내 공지 보기", url: OFFICIAL_LINKS.majorTransferNotice },
  },
  {
    id: "transfer-eligibility",
    keywords: ["전과 대상", "전과 신청 자격", "전과 절차", "전과 신청 방법"],
    question: "전과 신청 대상과 절차가 어떻게 되나요?",
    answer:
      "2년제 학과로 전과 희망 시 1학년 2학기~2학년 1학기 재학(복학) 예정생, 3년제 학과는 1학년 2학기~3학년 1학기 재학(복학) 예정생, 그리고 폐지 학과로 복학 예정인 학생이 대상이에요. 학생포털시스템 → 학생이력관리시스템 → 학생메뉴 → 전과신청에서 신청하며(승인 1~2일 소요), 현 소속학과 지도교수·학과장 상담 및 승인이 필요해요. 휴학생은 기존 소속학과로 먼저 복학한 뒤 전과 신청이 가능해요.",
    link: { label: "전과 신청 안내 공지 보기", url: OFFICIAL_LINKS.majorTransferNotice },
  },
  {
    id: "transfer-restriction",
    keywords: ["전과 제한", "전과 안되는", "전과 불가"],
    question: "전과를 신청할 수 없는 경우가 있나요?",
    answer:
      "예체능 특기자로 입학한 학생, 산업체 위탁 과정으로 입학한 학생, 전문계 고교와의 연계 교육으로 입학한 학생, 학사학위 전공심화 과정으로 입학한 학생, 편입학한 학생은 전과를 신청할 수 없어요.",
    link: { label: "전과 신청 안내 공지 보기", url: OFFICIAL_LINKS.majorTransferNotice },
  },
  {
    id: "transfer-limit-count",
    keywords: ["전과 몇 번", "전과 횟수", "전과 재도전"],
    question: "전과는 몇 번까지 할 수 있나요?",
    answer:
      "계열 구분 없이 전과가 허용되고, 재학 기간 중 총 2회까지만 가능해요. 3학년 재학 중인 학생은 2년제 학과로는 전과할 수 없고, 2년제에서 3년제로 전과하면 수업연한이 3년제로 연장된 것으로 봐요.",
    link: { label: "전과 신청 안내 공지 보기", url: OFFICIAL_LINKS.majorTransferNotice },
  },
  {
    id: "transfer-credit",
    keywords: ["전과 학점인정", "전과 최소전공학점", "전과 후 학점"],
    question: "전과하면 기존에 딴 학점은 어떻게 되나요?",
    answer:
      "기존 학과(부)에서 취득한 교양학점 및 P/F학점은 모두 인정돼요. 폐과(부) 사유로 전과하는 경우엔 이수한 모든 학점이 인정돼요. 다만 전입 학과의 최소 전공학점 이상은 새로 이수해야 해요(2019학번부터 2년제 51학점/3년제 76학점, 2025학번부터 2년제 45학점/3년제 67학점). 전공학점 부족으로 일반적인 수업연한 내 졸업이 어려울 수 있고, 전과 합격자는 합격 학기에 일반휴학이 불가해요(군휴학은 가능).",
    link: { label: "전과 신청 안내 공지 보기", url: OFFICIAL_LINKS.majorTransferNotice },
  },
  {
    id: "transfer-contact",
    keywords: ["전과 문의", "전과 문의처"],
    question: "전과 관련 문의는 어디로 하나요?",
    answer: "교육행정팀(031-467-4713) 또는 소속 학과사무실로 문의하시면 돼요.",
    link: { label: "학과사무실 연락처 보기", url: OFFICIAL_LINKS.departmentOffices },
  },

  // ----- 통학버스 (안양역/범계역 통학버스 안내 페이지 기준) -----
  {
    id: "shuttle-general",
    keywords: ["통학버스", "셔틀버스", "셔틀"],
    question: "통학버스는 언제, 어디서 타나요?",
    answer:
      "안양역·범계역에서 무료로 운행해요(월~금요일만, 주말·공휴일·방학 기간은 운행하지 않아요). 정류장 위치와 시간표는 역마다 달라서, 챗봇의 '통학버스' 메뉴에서 안양역/범계역을 선택해서 확인해주세요.",
    link: { label: "통학버스 안내 페이지 보기", url: OFFICIAL_LINKS.shuttleBusNotice },
  },
  {
    id: "shuttle-anyang",
    keywords: ["안양역 통학버스", "안양역 셔틀"],
    question: "안양역 통학버스는 언제 다니나요?",
    answer:
      "안양역 2번 출구에서 안양1동 행정복지센터 방향 250m 지점이 정류장이에요(약 7분 소요). 오전엔 안양역에서 08:10~11:00 약 10분 간격으로 순환하고, 오후엔 학교에서 13:00~14:00(약 10~15분 간격)과 15:30~19:00(약 10분 간격)에 순환해요. 야간엔 학교에서 19:00부터 22:30까지 30분 간격으로 정시 출발해요.",
    link: { label: "통학버스 안내 페이지 보기", url: OFFICIAL_LINKS.shuttleBusNotice },
  },
  {
    id: "shuttle-beomgye",
    keywords: ["범계역 통학버스", "범계역 셔틀"],
    question: "범계역 통학버스는 언제 다니나요?",
    answer:
      "범계역 8번 출구 길 건너 종로귀금속 평촌타운 상가 앞이 정류장이에요(약 10분 소요). 학교 출발은 오전 8:45/9:15/9:45/10:15, 오후 15:30~18:00(30분 간격)이고, 범계역 출발은 오전 8:15~10:30, 오후 15:45~18:15(모두 30분 간격, 정시 출발)이에요.",
    link: { label: "통학버스 안내 페이지 보기", url: OFFICIAL_LINKS.shuttleBusNotice },
  },

  // ----- 수강신청 (2026학년도 2학기 수강신청/교양 수강신청 안내 공지 기준) -----
  {
    id: "course-period",
    keywords: ["수강신청 기간", "수강신청", "강의 신청", "과목 신청", "수강"],
    question: "수강신청 기간이 언제인가요?",
    answer:
      "1학년 중점교양 신청: 8.17(월) 10:00~8.19(수) 09:59 / 전체 수강신청(타수강 포함): 8.19(수) 10:00~8.21(금) 15:00 / 수강신청 정정기간: 8.24(월) 10:00~8.28(금) 17:00 / 개강(학기개시일): 9.1(화). 개강 후 별도 정정 기간은 없어요.",
    link: { label: "학사일정 확인", url: OFFICIAL_LINKS.academicCalendar },
  },
  {
    id: "course-correction",
    keywords: ["수강정정", "정정기간", "수강 변경"],
    question: "수강정정 기간은 언제인가요?",
    answer:
      "8.24(월) 10:00 ~ 8.28(금) 17:00이에요. 학과·행정실 방문 없이 학생 본인이 포털에서 직접 정정하면 되고, 개강(9.1) 후에는 별도 정정 기간이 없어요.",
    link: { label: "포털 바로가기", url: OFFICIAL_LINKS.portal },
  },
  {
    id: "course-retake",
    keywords: ["재수강"],
    question: "재수강은 어떻게 신청하나요?",
    answer:
      "기 취득 학점이 C+ 이하인 교과목만 재수강할 수 있어요. 재수강 학점은 해당 학기 수강신청 학점 범위 내에서 신청해야 하고, 별도 메뉴 없이 기존 수강신청 화면에서 신청하면 돼요.",
    link: { label: "포털 바로가기", url: OFFICIAL_LINKS.portal },
  },
  {
    id: "course-liberal-arts",
    keywords: ["교양", "교양 과목", "교양 수강"],
    question: "교양 과목 수강신청은 어떻게 하나요?",
    answer:
      "학부(과)별 요일제로 진행돼요. 1학년은 8.17(월) 10:00~8.19(수) 09:59에 요일제로 배정된 중점교양 2과목을 신청하고(월/수요일 학과: AI와사회변화·자기이해와진로설계, 화/목요일 학과: 인문학과인성·실용영어), 8.19(수) 10:00부터는 전 학년이 신청할 수 있어요(타수강은 승인 필요). 문의: 교양학사 031-467-4552, 교양수업 031-467-4553",
    link: { label: "포털 바로가기", url: OFFICIAL_LINKS.portal },
  },
  {
    id: "course-eligibility",
    keywords: ["수강대상", "수강 가능", "수강대상 확인"],
    question: "수강대상 확인은 어떻게 하나요?",
    answer:
      "수강신청 대상은 신입생과 재학생(복학생·재입학생·전공심화·수업연한초과자 포함)이에요. 기간 내 신청하지 않으면 수강을 포기한 것으로 처리되니, 등록금 납부 여부와 무관하게 꼭 신청해야 해요. 휴학예정자도 신청 기간 내 신청해야 합니다.",
    link: { label: "포털 바로가기", url: OFFICIAL_LINKS.portal },
  },
  {
    id: "course-restriction",
    keywords: ["수강신청 제한", "타수강 제한", "상위학년 수강"],
    question: "수강신청에 제한이 있나요?",
    answer:
      "신입생 1학년 1학기 교과목은 타수강이 제한돼요(전과 시 1학년 1학기 전공교과목은 전공학점 미인정, 자유전공학과·소단위전공 제외). 상위 학년 교과목 수강도 제한돼요(1학년→2·3학년, 2학년→3학년, 학사학위 3학년→4학년 불가).",
    link: { label: "포털 바로가기", url: OFFICIAL_LINKS.portal },
  },
  {
    id: "course-drop",
    keywords: ["수강포기", "수강신청 포기", "수강 취소"],
    question: "수강신청 포기는 어떻게 하나요?",
    answer:
      "9.1(화) ~ 9.28(월) 14:00까지 가능해요(이후 포기 불가, 최소 수강학점 초과분만 가능). 절차: 학과 상담(변경·포기원 작성) → 담당교수 → 지도교수 → 학과(부)장 → 교육행정팀 방문 신청",
    link: { label: "포털 바로가기", url: OFFICIAL_LINKS.portal },
  },
  {
    id: "course-overyear",
    keywords: ["수업연한 초과", "졸업유보", "초과자 등록금"],
    question: "수업연한 초과자(졸업유보) 등록금은 어떻게 되나요?",
    answer:
      "등록금 고지서 조회·납부는 9.8(화) 10:00 예정부터 등록금 납부기한까지예요. 고지서 생성 후에는 수강포기가 안 되고, 비교과(P/F) 과목도 수강할 수 없어요. 학자금대출도 9.8(화) 예정부터 가능해요.",
  },
  {
    id: "course-early-employment",
    keywords: ["조기취업", "조기취업 출석"],
    question: "조기취업하면 출석은 어떻게 인정되나요?",
    answer:
      "마지막 학기 또는 수업연한 초과자 중 졸업사정 이후 처음 조기취업한 경우에만 대상이에요(산업체위탁, P-Tech 제외). 대면 수업만 출석이 인정되고, 원격(온라인) 수업은 인정되지 않아요.",
  },
  {
    id: "course-beace",
    keywords: ["BeACE", "비에이스", "직업세계와 자기계발"],
    question: "BeACE P/F 1학점은 어떻게 받나요?",
    answer:
      "별도 수강신청 없이 BeACE 이수 기준을 충족하면 취업팀에서 자동으로 부여해요(수업연한 초과자는 제외). 성적열람 기간에 확인할 수 있어요.",
  },
  {
    id: "course-military-credit",
    keywords: ["군 학점인정", "군학점"],
    question: "군 학점인정은 언제, 어떻게 신청하나요?",
    answer:
      "접수기간은 2026.9.28(월) 10:00~10.2(금) 14:00이에요(기간이 지나면 2027학년도 1학기에 신청 가능). 학생포털 학생이력관리시스템에서 온라인으로 신청하고 증빙서류를 PDF로 업로드하면, 담당자 확인 후 최종 심사를 거쳐 ~10.30(금) 예정으로 P/F 학점이 부여돼요.",
    link: { label: "군 학점인정 공지 보기", url: OFFICIAL_LINKS.militaryCreditNotice },
  },
  {
    id: "course-military-credit-eligibility",
    keywords: ["군 학점인정 대상", "군 복무경험 학점"],
    question: "군 학점인정은 누가, 얼마나 받을 수 있나요?",
    answer:
      "군 복무 중 사회봉사·인성교육·리더십·기초체육 등 활동에 참여한 경우에 한해 선별적으로 인정돼요. 1학점은 교육/봉사시간 45시간 이하 또는 이수 1건, 2학점은 46시간 이상 또는 이수 3건 이상이에요. 군 교육훈련기관 취득 학점도 별도 인정돼요. 단, 군 복무 완료 후 입학자, 학사학위 전공심화과정, 수업연한초과자는 제외돼요.",
    link: { label: "군 학점인정 공지 보기", url: OFFICIAL_LINKS.militaryCreditNotice },
  },
  {
    id: "course-military-credit-docs",
    keywords: ["군 학점인정 서류", "군 교육훈련 학점인정서"],
    question: "군 학점인정 제출 서류는 무엇인가요?",
    answer:
      "전역증(군 경력증명서), 사회복무요원 경력증명서, 군 교육훈련 학점인정서(최근 60일 이내 발급) 중 해당 서류를 출력 후 스캔한 PDF로 제출해요. 사진 촬영본은 미제출로 처리되니 주의하세요.",
    link: { label: "군 학점인정 공지 보기", url: OFFICIAL_LINKS.militaryCreditNotice },
  },
  {
    id: "course-pf-limit",
    keywords: ["P/F 학점", "PF 과목", "패스페일"],
    question: "P/F 과목은 졸업학점에 어떻게 반영되나요?",
    answer:
      "졸업학점에는 포함되지만 평점에는 반영되지 않아요. 재학 중 최대 6학점까지만 인정돼요.",
  },
  {
    id: "course-minor",
    keywords: ["소단위전공"],
    question: "소단위전공은 어떻게 신청하나요?",
    answer:
      "학과형 소단위전공은 해당 학과 사무실로 문의하세요. 혁신융합대학사업(미래자동차공학부 031-467-4640~2), 신산업특화선도전문대학사업(반도체학과 031-467-4457), 첨단산업인재양성부트캠프사업(반도체학과 031-467-4891) 관련 문의도 각 학과로 하시면 돼요. 사업별 상세 링크는 챗봇의 '수강신청 → 기타 안내' 메뉴에서 확인할 수 있어요.",
    link: { label: "학과형 소단위전공 안내", url: OFFICIAL_LINKS.minorProgramGeneral },
  },

  // ----- 성적 (성적평가/성적산출 방법 및 성적 열람/정정 안내 공지 기준) -----
  {
    id: "grades-check",
    keywords: ["성적 조회", "성적", "학점 조회"],
    question: "성적 조회는 어디서 하나요?",
    answer:
      "학생포털시스템 → 학생이력 → \"금학기성적조회\"에서 열람해요. 성적열람 및 수정기간에는 금학기성적조회로, 그 기간이 지난 평상시(학기 중)에는 전체학기성적조회로 확인할 수 있어요. 단, 교과목별 사후평가(031-467-4551)·강의평가(031-467-4712)·지도교수 상담평가(031-467-4726)를 모두 완료해야 열람 가능해요.",
    link: { label: "포털 바로가기", url: OFFICIAL_LINKS.portal },
  },
  {
    id: "grades-appeal",
    keywords: ["성적 이의신청", "이의신청", "성적 정정"],
    question: "성적 이의신청은 어떻게 하나요?",
    answer:
      "성적 조회 화면의 '성적이의 신청란' 또는 면담을 통해 이의제기·수정이 가능해요(면담 시 담당교수 연락처는 강의계획서 참조 또는 학과사무실 문의). 정정기간 이후라도 정당한 사유가 있으면 성적정정원과 증빙자료를 담당교수가 전자결재로 제출할 수 있어요.",
    link: { label: "학과별 연락처 보기", url: OFFICIAL_LINKS.departmentOffices },
  },
  {
    id: "grades-retake",
    keywords: ["재수강 성적", "성적 반영", "재수강 학점"],
    question: "재수강하면 성적이 어떻게 반영되나요?",
    answer:
      "재수강으로 새 성적을 취득하면 이전에 취득한 성적은 성적표에서 삭제되고, 그 성적을 받았던 학기의 평점평균 계산에서도 제외돼요. 즉 최신 재수강 성적으로 대체돼요. 단, 기 취득 학점이 C+ 이하인 교과목만 재수강할 수 있어요.",
  },
  {
    id: "grades-relative",
    keywords: ["상대평가", "절대평가"],
    question: "성적은 상대평가인가요 절대평가인가요?",
    answer:
      "원칙적으로 상대평가예요(A등급 최대 35%, A~B등급 최대 75%). 현장실습·졸업작품(유사교과목)·PF과목·수강인원 10명 이하 과목은 절대평가로 성취수준에 따라 부여돼요.",
    link: { label: "성적평가 안내 페이지 보기", url: OFFICIAL_LINKS.gradesEvaluationNotice },
  },
  {
    id: "grades-scale",
    keywords: ["평점 환산", "성적 등급", "학점 평점"],
    question: "성적 등급별 평점이 어떻게 되나요?",
    answer: "A+ 4.5, Ao 4.0, B+ 3.5, Bo 3.0, C+ 2.5, Co 2.0, D+ 1.5, Do 1.0, F 0점이에요.",
    link: { label: "성적평가 안내 페이지 보기", url: OFFICIAL_LINKS.gradesEvaluationNotice },
  },
  {
    id: "grades-calculation",
    keywords: ["평균평점 계산", "평점 계산", "평점 평균"],
    question: "평균평점은 어떻게 계산하나요?",
    answer:
      "평점계(교과목학점×교과목평점의 합)를 신청학점으로 나눠서 계산해요. 단, PF 과목은 학점엔 포함되지만 평점 계산에서는 제외돼요(신청학점에서 PF 학점을 뺀 값으로 나눔). 2024학년도 2학기부터는 소수점 이하 3자리에서 반올림해요.",
    link: { label: "성적평가 안내 페이지 보기", url: OFFICIAL_LINKS.gradesEvaluationNotice },
  },
  {
    id: "grades-warning",
    keywords: ["학사경고"],
    question: "학사경고 기준이 어떻게 되나요?",
    answer: "매 학기 평균평점이 1.0 미만이면 학사경고를 받아요.",
  },
  {
    id: "grades-certificate",
    keywords: ["성적증명서"],
    question: "성적증명서는 어떻게 발급받나요?",
    answer:
      "우편 발송은 하지 않아요. 대학홈페이지 맨 하단의 \"증명서발급\" 메뉴 또는 학교 내 자동증명발급기에서 발급받을 수 있어요.",
  },
  {
    id: "grades-missing",
    keywords: ["성적 없음", "점수 없음", "성적 미입력"],
    question: "성적확인 기간인데 점수가 안 보여요",
    answer: "담당교수가 기간 내 점수를 입력하지 않은 경우예요. 해당 과목 교수님께 직접 문의해주세요.",
  },

  // ----- 교내 연락처 -----
  {
    id: "contact-academic",
    keywords: ["학사지원팀", "학사 문의", "학사팀", "교육행정팀"],
    question: "교육행정팀 연락처가 궁금해요",
    answer:
      "교육행정팀장 031-467-4710 / 학적(휴학·복학·전과) 담당 031-467-4713 / 수강·성적 담당 031-467-4714로 연락하시면 돼요.",
  },
  {
    id: "contact-registration",
    keywords: ["휴학 문의", "복학 문의", "전과 문의", "학적 문의"],
    question: "휴학·복학·전과 문의는 어디로 하나요?",
    answer: "학적(휴학·복학·전과) 관련 문의는 교육행정팀 031-467-4713으로 연락하세요.",
  },
  {
    id: "contact-course-grades",
    keywords: ["수강 문의", "성적 문의", "수강신청 문의"],
    question: "수강·성적 문의는 어디로 하나요?",
    answer: "수강·성적 관련 문의는 교육행정팀 031-467-4714로 연락하세요.",
  },
  {
    id: "contact-foreign-admission",
    keywords: ["외국인 유학생 입학", "유학생 홍보", "외국인 신입생"],
    question: "외국인 유학생 입학·홍보 문의는 어디로 하나요?",
    answer: "외국인 유학생 입학·홍보 관련 문의는 031-467-4592로 연락하세요.",
  },
  {
    id: "contact-foreign-visa",
    keywords: ["외국인 유학생 비자", "유학생 비자", "비자 문의"],
    question: "외국인 유학생 비자·행사 문의는 어디로 하나요?",
    answer: "외국인 유학생 비자·행사 관련 문의는 031-467-4585로 연락하세요.",
  },
  {
    id: "contact-foreign-support",
    keywords: ["외국인 유학생 기숙사", "재직자반", "사회통합프로그램"],
    question: "외국인 유학생 기숙사·재직자반·사회통합프로그램 문의는 어디로 하나요?",
    answer: "외국인 유학생 기숙사·재직자반·사회통합프로그램 관련 문의는 031-467-4980으로 연락하세요.",
  },
  {
    id: "contact-dorm",
    keywords: ["기숙사", "생활관"],
    question: "기숙사 관련 문의는 어디로 하나요?",
    answer:
      "기숙사(생활관) 연락처는 부서별 연락처 페이지에서 확인할 수 있어요. 정확한 전화번호는 아래 링크를 참고해주세요.",
    link: { label: "부서별 연락처 보기", url: OFFICIAL_LINKS.officeContacts },
  },
  {
    id: "contact-council",
    keywords: ["총학생회"],
    question: "총학생회 연락처를 알고 싶어요",
    answer: "총학생회 연락처는 031-467-4725예요.",
  },
  {
    id: "contact-liberal-academic",
    keywords: ["교양학사"],
    question: "교양학사 문의는 어디로 하나요?",
    answer: "교양학사 관련 문의는 031-467-4552로 연락하세요.",
  },
  {
    id: "contact-liberal-class",
    keywords: ["교양수업"],
    question: "교양수업 문의는 어디로 하나요?",
    answer: "교양수업 관련 문의는 031-467-4553으로 연락하세요.",
  },
  {
    id: "contact-department",
    keywords: ["학과별 연락처", "학과 전화번호", "학과 연락처"],
    question: "학과 사무실 연락처는 어디서 확인하나요?",
    answer: "학과별 연락처 페이지에서 학과 사무실 전화번호를 확인할 수 있어요.",
    link: { label: "학과별 연락처 보기", url: OFFICIAL_LINKS.departmentOffices },
  },
  {
    id: "contact-office",
    keywords: ["부서별 연락처", "부서 전화번호", "행정부서 연락처"],
    question: "행정부서 연락처는 어디서 확인하나요?",
    answer: "부서별 연락처 페이지에서 행정부서 전화번호를 확인할 수 있어요.",
    link: { label: "부서별 연락처 보기", url: OFFICIAL_LINKS.officeContacts },
  },

  // ----- 증명서 발급 (증명서발급 공지 기준) -----
  {
    id: "certificate-types",
    keywords: ["증명서 종류", "재학증명서", "졸업증명서", "교육비납입증명서", "증명서"],
    question: "증명서 종류에는 어떤 게 있나요?",
    answer:
      "국문 증명서는 재학·졸업·졸업예정·성적·휴학·제적·교육비 납입 증명서가 있고, 영문 증명서는 졸업·성적 증명서만 발급돼요. 전문학사·학사학위 전공심화·전문기술석사 등 과정별로 각각 별도 신청해야 하고, 성적증명서의 평점평균은 소수점 3자리에서 반올림해 2자리까지 표기돼요.",
    link: { label: "증명서발급 안내 보기", url: OFFICIAL_LINKS.certificateNotice },
  },
  {
    id: "certificate-issue",
    keywords: ["증명서 발급", "증명서 발급방법", "자동발급기", "인터넷 증명발급", "증명발급센터"],
    question: "증명서는 어디서 발급받나요?",
    answer:
      "학교 자동발급기(홍지관 2층 카페앞, 대학본부 1층, 율곡관 3층 자판기옆), 가까운 시·군·구청·행정복지센터의 FAX민원 발급, 인터넷증명발급센터(회원가입 필요) 중에서 선택할 수 있어요. 자동발급기는 재학생은 포털과 동일한 학번/비밀번호로, 졸업생은 PASS·카카오·토스 등 본인인증으로 로그인해요.",
    link: { label: "인터넷 증명발급센터 바로가기", url: OFFICIAL_LINKS.certificateIssueCenter },
  },

  // ----- 계절학기 (계절학기 개설 안내 공지 기준) -----
  {
    id: "seasonal-open",
    keywords: ["계절학기 개설", "계절학기", "여름계절학기", "겨울계절학기"],
    question: "계절학기는 언제, 어떤 과목이 개설되나요?",
    answer:
      "동·하계 방학을 이용해 개설되고, 수강신청 후 3주(15일)간 편성돼요. 전공 또는 교양과목이 열리고, 수강신청 인원이 10명 이하인 과목은 폐강될 수 있어요. 개설기간 중 현장실습을 진행해야 하면 계절학기를 수강할 수 없어요.",
    link: { label: "계절학기 안내 보기", url: OFFICIAL_LINKS.seasonalSemesterNotice },
  },
  {
    id: "seasonal-apply",
    keywords: ["계절학기 수강신청", "계절학기 신청", "계절학기 대상", "계절학기 학점"],
    question: "계절학기 수강신청은 어떻게 하나요?",
    answer:
      "6월·12월 종강 후 지정된 일자에 신청해요(세부 일정은 별도 공지). 정규학기(2년제 4학기, 3년제 6학기)를 모두 이수한 학생만 신청할 수 있고, 최대 9학점까지 수강할 수 있어요. 절차는 교육행정팀의 수강신청서 교부 → 신청서 작성·확인 → 교육행정팀 수강신청 → 수강료 납부 순이에요.",
    link: { label: "계절학기 안내 보기", url: OFFICIAL_LINKS.seasonalSemesterNotice },
  },
  {
    id: "seasonal-fee",
    keywords: ["계절학기 수강료", "계절학기 성적"],
    question: "계절학기 수강료와 성적은 어떻게 되나요?",
    answer:
      "수강료는 학점단위로 부과돼요(1학점당 8만원 — 3학점 24만원, 6학점 48만원, 9학점 72만원). 감면·면제는 되지 않아요. 이수 학점은 졸업이수학점에 포함되지만 해당 학기 성적에서는 제외되고, 출결·시험·평가는 정규학기와 동일하게 운영돼요.",
    link: { label: "계절학기 안내 보기", url: OFFICIAL_LINKS.seasonalSemesterNotice },
  },

  // ----- 조기취업 -----
  {
    id: "early-employment-detail",
    keywords: ["조기취업", "조기취업 출석", "조기취업 대상"],
    question: "조기취업하면 출석은 어떻게 인정되나요?",
    answer:
      "마지막 학기(1년제 2학기[전공심화], 2년제 4학기, 3년제 6학기) 또는 수업연한 초과자 중, 졸업사정 이후 처음 조기취업한 학생만 대상이에요(산업체위탁, P-Tech 제외). 대면 수업만 출석이 인정되고, 원격(온라인) 수업은 인정되지 않아요. 추가 문의는 학과 또는 학교 홈페이지를 확인해주세요.",
  },

  // ----- P/F 과목 -----
  {
    id: "pf-beace",
    keywords: ["BeACE", "비에이스", "직업세계와 자기계발"],
    question: "BeACE P/F 1학점은 어떻게 받나요?",
    answer:
      "2024학년도 2학기부터 별도 수강신청 없이, BeACE 이수 기준을 충족하면 취업팀에서 자동으로 \"직업세계와 자기계발 P/F 1학점\"을 부여해요(수업연한 초과자는 제외). 성적열람 기간에 확인할 수 있고, 이수 기준 충족 여부는 취업팀에서 확인할 수 있어요.",
  },
  {
    id: "pf-limit-detail",
    keywords: ["P/F 학점 한도", "PF 학점", "패스페일 학점", "P/F 과목"],
    question: "P/F 과목은 몇 학점까지 인정되나요?",
    answer:
      "P/F 과목은 졸업학점에는 포함되지만 평점에는 반영되지 않아요. 재학 중 최대 6학점까지만 인정되고, BeACE·어학·봉사·창업·군 학점인정·각 사업단 P/F 교과목이 모두 여기 포함돼요.",
  },
  {
    id: "pf-two-credits",
    keywords: ["P/F 2학점", "한 학기 P/F", "PF 2학점"],
    question: "한 학기에 P/F 2학점까지 수강할 수 있나요?",
    answer:
      "죄송해요, 이 부분은 저희가 확인한 학교 측 공식 답변이 없어요. 최근 관련 Q&A가 있었던 만큼, 아래 Q&A 게시판이나 교육행정팀(031-467-4714)에 직접 문의해서 정확한 답변을 확인해주세요.",
    link: { label: "Q&A 게시판 바로가기", url: OFFICIAL_LINKS.qnaBoard },
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