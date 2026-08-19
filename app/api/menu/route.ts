import { NextResponse } from "next/server";
import { MENU_NODES, DEFAULT_NODE_ID, type MenuNode } from "@/lib/menu";
import { getFaqItem } from "@/lib/faq";

const FAQ_PREFIX = "faq-";

// GET /api/menu?nodeId=scholarship            → 정적 메뉴 화면
// GET /api/menu?nodeId=faq-course-period       → FAQ 답변을 메뉴 화면 형태로 변환해서 반환
// 두 경우 모두 LLM을 호출하지 않는 100% 결정적인(deterministic) 엔드포인트입니다.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const nodeId = searchParams.get("nodeId") || DEFAULT_NODE_ID;

  if (nodeId.startsWith(FAQ_PREFIX)) {
    const faqId = nodeId.slice(FAQ_PREFIX.length);
    const faqItem = getFaqItem(faqId);
    if (!faqItem) {
      return NextResponse.json(
        { error: `존재하지 않는 FAQ입니다: ${faqId}` },
        { status: 404 }
      );
    }

    const node: MenuNode = {
      id: nodeId,
      intro: `Q. ${faqItem.question}`,
      cards: [
        {
          title: "답변",
          body: faqItem.answer,
          link: faqItem.link,
        },
      ],
      quickReplies: [
        { label: "다른 질문 더보기", targetId: "faq" },
        { label: "처음으로", targetId: "root" },
      ],
    };
    return NextResponse.json(node);
  }

  const node = MENU_NODES[nodeId];
  if (!node) {
    return NextResponse.json(
      { error: `존재하지 않는 메뉴입니다: ${nodeId}` },
      { status: 404 }
    );
  }

  return NextResponse.json(node);
}
