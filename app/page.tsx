"use client";

import { useEffect, useRef, useState } from "react";
import type { MenuNode } from "@/lib/menu";

type FaqMatch = { id: string; question: string };

type Turn =
  | { id: string; role: "user"; text: string; time: number }
  | { id: string; role: "bot"; kind: "menu"; node: MenuNode; time: number }
  | { id: string; role: "bot"; kind: "faq-suggest"; matches: FaqMatch[]; time: number }
  | { id: string; role: "bot"; kind: "text"; text: string; streaming: boolean; time: number };

// 메시지 전송 시각을 "오후 3:42" 형태로 표시
function formatTime(ms: number) {
  return new Date(ms).toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit" });
}

export default function Chat() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const idRef = useRef(0);
  const nextId = () => `t${++idRef.current}`;

  const bottomRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  // 첫 화면 진입 시 인사말 + 메인 메뉴를 봇의 첫 메시지로 띄움
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    fetch("/api/menu?nodeId=root")
      .then((res) => res.json())
      .then((node: MenuNode) => {
        setTurns([{ id: nextId(), role: "bot", kind: "menu", node, time: Date.now() }]);
      });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns]);

  function pushTurn(turn: Turn) {
    setTurns((prev) => [...prev, turn]);
  }

  function updateTurnText(id: string, text: string, streaming: boolean) {
    setTurns((prev) =>
      prev.map((t) =>
        t.id === id && t.role === "bot" && t.kind === "text"
          ? { ...t, text, streaming }
          : t
      )
    );
  }

  // 버튼(퀵리플라이) 클릭 → 클릭한 버튼 문구를 "내가 보낸 말"처럼 오른쪽에 표시하고,
  // 해당 메뉴 화면을 봇의 답으로 이어붙임 (카카오톡 챗봇 버튼과 동일한 느낌)
  async function goTo(targetId: string, label: string) {
    if (busy) return;
    setBusy(true);
    pushTurn({ id: nextId(), role: "user", text: label, time: Date.now() });
    try {
      const res = await fetch(`/api/menu?nodeId=${encodeURIComponent(targetId)}`);
      const node: MenuNode = await res.json();
      pushTurn({ id: nextId(), role: "bot", kind: "menu", node, time: Date.now() });
    } finally {
      setBusy(false);
    }
  }

  function pickFaq(id: string, label: string) {
    goTo(`faq-${id}`, label);
  }

  // 직접 입력한 질문 → ① 키워드 FAQ → ② 학사 관련 키워드가 하나도 없으면
  // 차단(Gemini 미호출) → ③ Gemini 자유 답변(안전망)
  async function submitQuery(text: string) {
    const query = text.trim();
    if (!query || busy) return;

    setInput("");
    pushTurn({ id: nextId(), role: "user", text: query, time: Date.now() });
    setBusy(true);

    try {
      const res = await fetch(`/api/faq?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      const matches: FaqMatch[] = data.matches || [];

      if (matches.length > 0) {
        pushTurn({ id: nextId(), role: "bot", kind: "faq-suggest", matches, time: Date.now() });
      } else if (data.blocked) {
        // 학사 관련 키워드가 하나도 없음 → Gemini를 아예 호출하지 않고 고정 문구만 표시
        pushTurn({
          id: nextId(),
          role: "bot",
          kind: "text",
          text: data.blockedMessage,
          streaming: false,
          time: Date.now(),
        });
      } else {
        const botId = nextId();
        pushTurn({ id: botId, role: "bot", kind: "text", text: "", streaming: true, time: Date.now() });
        await streamGeminiReply(query, botId);
      }
    } finally {
      setBusy(false);
    }
  }

  async function streamGeminiReply(query: string, botId: string) {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      if (!res.body) {
        updateTurnText(botId, "답변을 가져오지 못했어요. 다시 시도해주세요.", false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        updateTurnText(botId, acc, true);
      }
      updateTurnText(
        botId,
        acc || "답변을 가져오지 못했어요. API 키 설정을 확인하거나 잠시 후 다시 시도해주세요.",
        false
      );
    } catch {
      updateTurnText(botId, "답변을 가져오지 못했어요. 다시 시도해주세요.", false);
    }
  }

  return (
    <div className="page">
      <header className="header">
        <div className="header-inner">
          <h1>대림대학교 AI 챗봇</h1>
          <p>장학 · 등록 · 수강신청 · 성적 · 교내 연락처 안내</p>
        </div>
      </header>

      <div className="chat-scroll">
        <div className="chat-inner">
          {turns.map((turn) => (
            <TurnView
              key={turn.id}
              turn={turn}
              onGoTo={goTo}
              onPickFaq={pickFaq}
            />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      <form
        className="input-form"
        onSubmit={(e) => {
          e.preventDefault();
          submitQuery(input);
        }}
      >
        <div className="input-form-inner">
          <input
            value={input}
            placeholder="질문을 입력하세요 (예: 수강, 장학금)"
            onChange={(e) => setInput(e.currentTarget.value)}
            disabled={busy}
          />
          <button type="submit" disabled={busy}>
            전송
          </button>
        </div>
      </form>
    </div>
  );
}

function TurnView({
  turn,
  onGoTo,
  onPickFaq,
}: {
  turn: Turn;
  onGoTo: (targetId: string, label: string) => void;
  onPickFaq: (id: string, label: string) => void;
}) {
  if (turn.role === "user") {
    return (
      <div className="bubble-row user">
        <div className="bubble-col user">
          <div className="bubble user">{turn.text}</div>
          <span className="bubble-time">{formatTime(turn.time)}</span>
        </div>
      </div>
    );
  }

  // ----- 봇: 버튼 메뉴 / FAQ 답변 화면 -----
  if (turn.kind === "menu") {
    const node = turn.node;
    return (
      <div className="bubble-row">
        <div className="bot-block">
          <div className="bubble assistant">{node.intro}</div>
          <span className="bubble-time">{formatTime(turn.time)}</span>

          {node.topLink && (
            <a
              className="top-link-btn"
              href={node.topLink.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {node.topLink.label}
            </a>
          )}

          {node.cards && node.cards.length > 0 && (
            <div className="card-row">
              {node.cards.map((card, i) => (
                <div className="info-card" key={i}>
                  <div className="info-card-title">{card.title}</div>
                  <div className="info-card-body">{card.body}</div>
                  {card.link && (
                    <a
                      className="card-link-btn"
                      href={card.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {card.link.label}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {node.quickReplies && node.quickReplies.length > 0 && (
            <div className="quick-replies">
              {node.quickReplies.map((qr, i) =>
                "targetId" in qr && qr.targetId ? (
                  <button
                    key={i}
                    className="quick-reply-btn"
                    onClick={() => onGoTo(qr.targetId!, qr.label)}
                  >
                    {qr.label}
                  </button>
                ) : (
                  <button
                    key={i}
                    className="quick-reply-btn"
                    onClick={() => onGoTo(qr.askText!, qr.label)}
                  >
                    {qr.label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ----- 봇: 키워드 FAQ 추천 목록 -----
  if (turn.kind === "faq-suggest") {
    return (
      <div className="bubble-row">
        <div className="bot-block">
          <div className="bubble assistant">🔎 이런 내용을 찾고 계신가요?</div>
          <span className="bubble-time">{formatTime(turn.time)}</span>
          <div className="quick-replies">
            {turn.matches.map((m) => (
              <button
                key={m.id}
                className="quick-reply-btn"
                onClick={() => onPickFaq(m.id, m.question)}
              >
                {m.question}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ----- 봇: Gemini 자유 답변(안전망) -----
  return (
    <div className="bubble-row">
      <div className="bubble-col">
        <div className="bubble assistant">
          {turn.text || (turn.streaming ? "답변 작성 중..." : "")}
        </div>
        <span className="bubble-time">{formatTime(turn.time)}</span>
      </div>
    </div>
  );
}
