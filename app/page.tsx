"use client";

import { useEffect, useRef, useState } from "react";
import type { MenuNode, QuickReply } from "@/lib/menu";

type FaqMatch = { id: string; question: string };

type Turn =
  | { id: string; role: "user"; text: string; time: number }
  | { id: string; role: "bot"; kind: "menu"; node: MenuNode; time: number }
  | { id: string; role: "bot"; kind: "faq-suggest"; matches: FaqMatch[]; time: number }
  | { id: string; role: "bot"; kind: "blocked"; message: string; time: number }
  | {
      id: string;
      role: "bot";
      kind: "text";
      text: string;
      streaming: boolean;
      time: number;
      // Gemini 호출이 실패했을 때(구글 서버 과부하 등) "다시 시도" 버튼을 보여주기
      // 위해, 원래 질문(query)과 실패 여부(failed)를 함께 들고 있음
      query: string;
      failed?: boolean;
    }
  | { id: string; role: "bot"; kind: "loading" };

const REPLY_DELAY_MIN_MS = 500;
const REPLY_DELAY_MAX_MS = 1000;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const randomReplyDelay = () =>
  REPLY_DELAY_MIN_MS + Math.random() * (REPLY_DELAY_MAX_MS - REPLY_DELAY_MIN_MS);

// 메시지 전송 시각을 "오후 3:42" 형태로 표시
function formatTime(ms: number) {
  return new Date(ms).toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit" });
}

// Gemini 답변 텍스트에 학교 페이지 URL이 그대로 섞여 나올 때(마크다운이 아닌
// 순수 텍스트라 링크가 안 눌리는 문제), URL만 찾아서 실제로 클릭 가능한
// 링크로 바꿔줌. URL 문자 집합만 매칭해서 뒤에 붙는 한글 조사(예: "...해서")나
// 문장부호가 링크에 딸려 들어가지 않게 함
const URL_PATTERN = /(https?:\/\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]+)/g;

function linkifyText(text: string) {
  const parts = text.split(URL_PATTERN);
  return parts.map((part, i) => {
    if (!part.startsWith("http")) return part;
    // 문장 끝의 마침표/쉼표/괄호 등은 URL이 아니라 문장부호일 가능성이 높아서 분리
    const trailingPunct = part.match(/[).,!?;:]+$/)?.[0] ?? "";
    const url = trailingPunct ? part.slice(0, -trailingPunct.length) : part;
    return (
      <span key={i}>
        <a href={url} target="_blank" rel="noopener noreferrer" className="answer-link">
          {url}
        </a>
        {trailingPunct}
      </span>
    );
  });
}

export default function Chat() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [lang, setLang] = useState<"ko" | "en">("ko");
  // 페이지에 처음 들어오면 사용방법 및 유의사항을 가장 먼저 보여주기 위해
  // 기본값을 true로 시작함(우측 상단 "?" 버튼으로 다시 열고 닫는 동작은 그대로 유지됨)
  const [showHelp, setShowHelp] = useState(true);
  const [suggestions, setSuggestions] = useState<FaqMatch[]>([]);
  // 직전에 직접 입력했던 질문(또는 그 질문이 그 이전 질문과 이어붙여진 결과).
  // "이어서 질문할게요" 같은 사족 없이 후속 질문을 해도 맥락이 이어지도록,
  // 이번 질문 단독으로 막힐 때만 이 값과 합쳐서 한 번 더 시도하는 데 씀
  // (완전한 대화 기록이 아니라 바로 직전 한 턴만 기억하는 가벼운 방식)
  const [lastFreeTextQuery, setLastFreeTextQuery] = useState("");

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
    bottomRef.current?.scrollIntoView({ behavior: "instant" as ScrollBehavior });
  }, [turns]);

  // 고려대 KUChat처럼, 입력창에 타이핑하는 동안 관련 FAQ 질문을 입력창 바로 위에
  // 실시간으로 보여줌 (Enter를 누르기 전에 미리 골라서 바로 답을 볼 수 있게).
  // 매 글자마다 요청을 보내지 않도록 200ms 정도 디바운스함
  useEffect(() => {
    const query = input.trim();
    if (!query || busy) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    const handle = setTimeout(async () => {
      try {
        const prevParam = lastFreeTextQuery
          ? `&prev=${encodeURIComponent(lastFreeTextQuery)}`
          : "";
        const res = await fetch(`/api/faq?q=${encodeURIComponent(query)}${prevParam}`);
        const data = await res.json();
        if (!cancelled) setSuggestions(data.matches || []);
      } catch {
        if (!cancelled) setSuggestions([]);
      }
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [input, busy, lastFreeTextQuery]);

  function pushTurn(turn: Turn) {
    setTurns((prev) => [...prev, turn]);
  }

  function replaceTurn(id: string, turn: Turn) {
    setTurns((prev) => prev.map((t) => (t.id === id ? turn : t)));
  }

  function updateTurnText(id: string, text: string, streaming: boolean, failed = false) {
    setTurns((prev) =>
      prev.map((t) =>
        t.id === id && t.role === "bot" && t.kind === "text"
          ? { ...t, text, streaming, failed }
          : t
      )
    );
  }

  // 버튼(퀵리플라이) 클릭 → 클릭한 버튼 문구를 "내가 보낸 말"처럼 오른쪽에 표시하고,
  // 해당 메뉴 화면을 봇의 답으로 이어붙임 (카카오톡 챗봇 버튼과 동일한 느낌)
  async function goTo(targetId: string, label: string) {
    if (busy) return;
    setBusy(true);
    // 버튼으로 다른 메뉴/주제로 명시적으로 이동한 거라, 이전에 직접 입력했던
    // 질문 맥락은 여기서 끊어서 다음 자유 질문이 엉뚱하게 이어붙지 않게 함
    setLastFreeTextQuery("");
    pushTurn({ id: nextId(), role: "user", text: label, time: Date.now() });
    const loadingId = nextId();
    pushTurn({ id: loadingId, role: "bot", kind: "loading" });
    try {
      const [res] = await Promise.all([
        fetch(`/api/menu?nodeId=${encodeURIComponent(targetId)}`),
        wait(randomReplyDelay()),
      ]);
      const node: MenuNode = await res.json();
      replaceTurn(loadingId, { id: loadingId, role: "bot", kind: "menu", node, time: Date.now() });
    } finally {
      setBusy(false);
    }
  }

  function pickFaq(id: string, label: string) {
    goTo(`faq-${id}`, label);
  }

  // 입력창 위 실시간 추천 목록에서 하나를 클릭했을 때: 타이핑 중이던 내용은
  // 지우고, 클릭한 질문으로 바로 이동
  function pickSuggestion(match: FaqMatch) {
    setInput("");
    setSuggestions([]);
    pickFaq(match.id, match.question);
  }

  // 직접 입력한 질문 → ① 키워드 FAQ → ② 학사 범위 밖 질문 차단 → ③ Gemini 자유 답변(안전망)
  async function submitQuery(text: string) {
    const query = text.trim();
    if (!query || busy) return;

    setInput("");
    pushTurn({ id: nextId(), role: "user", text: query, time: Date.now() });
    setBusy(true);

    try {
      const prevParam = lastFreeTextQuery
        ? `&prev=${encodeURIComponent(lastFreeTextQuery)}`
        : "";
      const res = await fetch(`/api/faq?q=${encodeURIComponent(query)}${prevParam}`);
      const data = await res.json();
      const matches: FaqMatch[] = data.matches || [];
      // 이번 질문 단독으로 막혀서 직전 질문과 합쳐진 경우, 그 합쳐진 문장을
      // 기준으로 FAQ를 찾거나 Gemini에게 물어봄(맥락이 살아있는 채로 답하기 위해)
      const effectiveQuery: string = data.effectiveQuery || query;

      if (matches.length > 0) {
        pushTurn({ id: nextId(), role: "bot", kind: "faq-suggest", matches, time: Date.now() });
        setLastFreeTextQuery(effectiveQuery);
      } else if (data.blocked) {
        pushTurn({
          id: nextId(),
          role: "bot",
          kind: "blocked",
          message: data.blockedMessage,
          time: Date.now(),
        });
        // 직전 질문과 합쳐도 여전히 막힌 거라, 여기서 맥락을 끊어서 다음
        // 질문이 엉뚱한 이전 화제와 잘못 이어붙지 않게 함
        setLastFreeTextQuery("");
      } else {
        const botId = nextId();
        pushTurn({
          id: botId,
          role: "bot",
          kind: "text",
          text: "",
          streaming: true,
          time: Date.now(),
          query: effectiveQuery,
        });
        setLastFreeTextQuery(effectiveQuery);
        await streamGeminiReply(effectiveQuery, botId);
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
        updateTurnText(botId, "답변을 가져오지 못했어요. 다시 시도해주세요.", false, true);
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
      if (acc) {
        updateTurnText(botId, acc, false);
      } else {
        // 구글 서버가 일시적으로 혼잡할 때(고트래픽 503 등) 응답이 아예 안 옴.
        // 우리 쪽 버그가 아니라 외부 API 일시 장애라서, 다시 시도 버튼만 보여줌
        updateTurnText(
          botId,
          "지금 AI 서버가 일시적으로 혼잡해서 답변을 만들지 못했어요. 아래 버튼으로 다시 시도해주세요.",
          false,
          true
        );
      }
    } catch {
      updateTurnText(botId, "답변을 가져오지 못했어요. 다시 시도해주세요.", false, true);
    }
  }

  // "다시 시도" 버튼: 질문을 새로 입력할 필요 없이, 같은 질문으로 Gemini 호출만
  // 다시 시도함 (구글 서버 일시 과부하처럼 우리 쪽 문제가 아닌 실패에 대한 복구용)
  async function retryGeminiReply(botId: string, query: string) {
    if (busy) return;
    setBusy(true);
    updateTurnText(botId, "", true);
    try {
      await streamGeminiReply(query, botId);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <header className="header">
        <div className="header-inner">
          <div className="header-top">
            <div className="lang-toggle">
              <button
                type="button"
                className={`lang-btn ${lang === "ko" ? "active" : ""}`}
                onClick={() => setLang("ko")}
              >
                KOR
              </button>
              <span className="lang-divider">|</span>
              <button
                type="button"
                className={`lang-btn ${lang === "en" ? "active" : ""}`}
                onClick={() => setLang("en")}
              >
                ENG
              </button>
            </div>
            <h1>디포레스트(DForest)</h1>
            <div className="header-spacer">
              <button
                type="button"
                className="help-btn"
                aria-label="유의사항 및 사용 방법"
                onClick={() => setShowHelp(true)}
              >
                ?
              </button>
            </div>
          </div>
        </div>
      </header>

      {showHelp && (
        <div className="help-overlay" onClick={() => setShowHelp(false)}>
          <div className="help-modal" onClick={(e) => e.stopPropagation()}>
            <div className="help-modal-header">
              <h2>유의사항 및 사용 방법</h2>
              <button
                type="button"
                className="help-close-btn"
                aria-label="닫기"
                onClick={() => setShowHelp(false)}
              >
                ✕
              </button>
            </div>
            <div className="help-modal-body">
              <section>
                <h3>사용 방법</h3>
                <p>
                  화면의 버튼을 눌러 원하는 메뉴로 이동하거나, 하단 입력창에
                  궁금한 내용을 자유롭게 입력해보세요. (예: 수강, 장학금)
                </p>
                <p>
                  질문을 입력하면 ① 관련 FAQ를 먼저 찾아 보여드리고, 없으면
                  ② 대림대학교 학사 안내와 관련된 질문인지 확인한 뒤, ③ AI가
                  답변을 생성해드려요.
                </p>
              </section>
              <section>
                <h3>안내 가능한 주제</h3>
                <p>
                  장학 · 등록 · 수강신청 · 계절학기 · 군 학점인정 · 성적 ·
                  증명서 발급 · 휴학 · 복학 · 전과 · 조기취업 · P/F 과목 ·
                  통학버스 · 교내 연락처
                </p>
              </section>
              <section>
                <h3>유의사항</h3>
                <p>
                  본 챗봇의 답변은 참고용 안내이며, 실제 학사 처리 기준은
                  변경될 수 있으니 반드시 학교 공식 공지사항이나 담당 부서를
                  통해 다시 한번 확인해주세요.
                </p>
              </section>
            </div>
          </div>
        </div>
      )}

      <div className="chat-scroll">
        <div className="chat-inner">
          <div className="hero">
            <img src="/daewoong.png" alt="대웅이" className="hero-img" />
            <p className="hero-greeting">
              안녕하세요?
              <br />
              저는 대웅이에요
              <br />
              무엇을 도와드릴까요?
            </p>
          </div>

          {turns.map((turn) => (
            <TurnView
              key={turn.id}
              turn={turn}
              onGoTo={goTo}
              onPickFaq={pickFaq}
              onRetry={retryGeminiReply}
            />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      <form
        className="input-form"
        onSubmit={(e) => {
          e.preventDefault();
          setSuggestions([]);
          submitQuery(input);
        }}
      >
        {suggestions.length > 0 && (
          <div className="suggest-dropdown">
            <div className="suggest-dropdown-inner">
              {suggestions.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className="suggest-item"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pickSuggestion(m)}
                >
                  {m.question}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="input-form-inner">
          <input
            value={input}
            placeholder="질문을 입력하세요 (예: 수강, 장학금)"
            onChange={(e) => setInput(e.currentTarget.value)}
            disabled={busy}
          />
          <button type="submit" className="send-btn" disabled={busy} aria-label="전송">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
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
  onRetry,
}: {
  turn: Turn;
  onGoTo: (targetId: string, label: string) => void;
  onPickFaq: (id: string, label: string) => void;
  onRetry: (botId: string, query: string) => void;
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
    const isRoot = node.id === "root";
    return (
      <div className="bubble-row">
        <div className="bot-block">
          {/* 이 답변이 Gemini가 즉석에서 만든 게 아니라, 학교 공식 공지사항을
              바탕으로 우리가 직접 수집·정리해둔 내용이라는 걸 한눈에 보여주는 배지.
              "즉시 답변 = AI를 안 쓴다"는 오해를 막기 위해 "우리가 직접 모아서
              정리해둔 것"이라는 뉘앙스를 문구에 명시적으로 넣음(아래 AI 배지와
              대비되도록). 루트 메뉴(첫 화면)는 "답변"이 아니라 그냥 초기 화면이라
              배지를 생략함 */}
          {!isRoot && <span className="answer-badge official">✅ 학교 공식 자료 수집·정리 기반</span>}
          {!isRoot && <div className="bubble assistant">{node.intro}</div>}

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
            isRoot ? (
              <MenuGrid quickReplies={node.quickReplies} onGoTo={onGoTo} />
            ) : node.id === "faq" ? (
              <FaqQuickReplies quickReplies={node.quickReplies} onGoTo={onGoTo} />
            ) : (
              <div className="quick-replies">
                {node.quickReplies.map((qr, i) => {
                  const label = qr.label;
                  const handleClick = () =>
                    "targetId" in qr && qr.targetId
                      ? onGoTo(qr.targetId, label)
                      : onGoTo(qr.askText!, label);
                  return (
                    <button
                      key={i}
                      className="quick-reply-btn"
                      onClick={handleClick}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )
          )}
          {/* 첫 화면 진입 시 자동으로 뜨는 루트 메뉴는 사용자의 어떤 행동에
              대한 "응답"이 아니라 그냥 초기 화면이므로 시각을 표시하지 않음 */}
          {!isRoot && <span className="bubble-time">{formatTime(turn.time)}</span>}
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
          <span className="bubble-time">{formatTime(turn.time)}</span>
        </div>
      </div>
    );
  }

  // ----- 봇: 메뉴/버튼 응답 대기 중 (전송 중 표시) -----
  if (turn.kind === "loading") {
    return (
      <div className="bubble-row">
        <div className="bubble assistant typing-bubble">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    );
  }

  // ----- 봇: 학사 범위 밖 질문 차단 (예: 날씨, 잡담) -----
  if (turn.kind === "blocked") {
    return (
      <div className="bubble-row">
        <div className="assistant-block">
          <div className="bubble assistant">{turn.message}</div>
          <span className="bubble-time">{formatTime(turn.time)}</span>
        </div>
      </div>
    );
  }

  // ----- 봇: Gemini 자유 답변(안전망) -----
  return (
    <div className="bubble-row">
      <div className="assistant-block">
        {/* FAQ에 없는 질문이라 Gemini가 직접 생성한 답변임을 명확히 표시.
            위의 "학교 공식 안내 기반" 배지와 대비돼서, 우리 챗봇이 어떤 답변은
            검증된 공식 정보로, 어떤 답변은 AI가 만든 참고용 정보로 구분해서
            보여준다는 걸 사용자가 바로 알 수 있게 함. 실패했을 때는 답변이
            아예 없는 상태라 배지를 보여주지 않음 */}
        {!turn.failed && <span className="answer-badge ai">🤖 AI 생성 답변 · 확인 필요</span>}
        <div className="bubble assistant">
          {turn.text
            ? linkifyText(turn.text)
            : turn.streaming
              ? "답변 작성 중..."
              : ""}
        </div>
        {/* 우리가 미리 준비해둔 14개 주제 밖의 질문일 수도 있는 답변이라,
            AI가 아무리 그럴듯하게 답해도 실제 학사 처리 기준과 다를 수 있음을
            매번 안내함. 스트리밍이 끝난 뒤에만 보여줘서 "작성 중..." 상태와
            겹치지 않게 함. (예전엔 이 아래에 Q&A 게시판/교내 연락처 버튼을
            항상 붙였는데, 로그인이 필요한 Q&A 게시판이나 뭉뚱그린 연락처
            안내가 모든 질문에 맞지는 않아서 뺐음 — 대신 시스템 프롬프트가
            상황에 맞는 실제 링크를 답변 안에 직접 골라 넣고, 위 linkifyText가
            그 링크를 눌러서 바로 이동 가능하게 바꿔줌) */}
        {!turn.streaming && turn.text && !turn.failed && (
          <p className="ai-disclaimer">
            ⚠️ 이 답변은 AI가 생성한 내용으로, 실제와 다르거나 잘못되었을 수
            있습니다. 자세한 내용은 학교 홈페이지나 관련 부서에 연락하여 다시
            확인해주세요.
          </p>
        )}
        {/* 구글 서버 일시 과부하처럼 우리 쪽 잘못이 아닌 실패는, 질문을 다시
            입력할 필요 없이 버튼 한 번으로 같은 질문을 재시도할 수 있게 함
            (발표 중 실시간 데모에서 이런 오류가 나도 바로 복구 가능) */}
        {turn.failed && (
          <button
            type="button"
            className="retry-btn"
            disabled={turn.streaming}
            onClick={() => onRetry(turn.id, turn.query)}
          >
            🔄 다시 시도
          </button>
        )}
        <span className="bubble-time">{formatTime(turn.time)}</span>
      </div>
    </div>
  );
}

// 첫 화면 메인 메뉴: 2행 그리드로 배치하고 다 못 담으면 옆으로 스크롤.
// ① 아래 화살표 버튼 클릭으로 한 화면씩 넘기기 ② 박스를 마우스로 누른 채
// 옆으로 드래그해도 스크롤되는 두 가지 방법을 모두 지원함
function MenuGrid({
  quickReplies,
  onGoTo,
}: {
  quickReplies: QuickReply[];
  onGoTo: (targetId: string, label: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, moved: false, startX: 0, startScrollLeft: 0 });

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const el = scrollRef.current;
    if (!el) return;
    drag.current = { down: true, moved: false, startX: e.clientX, startScrollLeft: el.scrollLeft };
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = scrollRef.current;
    if (!el || !drag.current.down) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 3) drag.current.moved = true;
    el.scrollLeft = drag.current.startScrollLeft - dx;
  }

  function handlePointerUp() {
    drag.current.down = false;
  }

  function handleItemClick(action: () => void) {
    if (drag.current.moved) {
      drag.current.moved = false;
      return;
    }
    action();
  }

  function scrollByPage(direction: 1 | -1) {
    const el = scrollRef.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>(".menu-grid-btn"));
    if (items.length < 2) return;
    // grid-auto-flow: column, 2행이라 짝수 인덱스가 각 열의 대표 아이템.
    // 계산으로 이동 거리를 어림하면 소수점 반올림 때문에 열이 살짝 잘려 보여서,
    // 실제 카드의 offsetLeft를 그대로 읽어와 정확히 그 위치로 맞춤
    const columns = items.filter((_, i) => i % 2 === 0);
    if (columns.length < 2) return;
    const stride = columns[1].offsetLeft - columns[0].offsetLeft;
    const visibleCount = Math.max(1, Math.round(el.clientWidth / stride));
    // 남은 열이 한 페이지(visibleCount)보다 적을 때 그 자리에서 그대로 스크롤하면
    // 브라우저가 끝까지 못 가게 막아서 맨 앞 열이 잘려 보이므로, 마지막에 보여줄 수
    // 있는 가장 뒤쪽 시작 열로 상한을 둬서 항상 열이 통째로 보이게 함.
    // ※ 예전에는 실제 버튼 개수만으로 이 상한을 계산해서, 총 개수가 한 페이지의
    // 배수가 아닐 때 상한이 "다음 페이지로 넘어가는 지점"보다 앞에 걸려버려
    // 이미 봤던 버튼이 다음 페이지에 다시 나타나는 중복 문제가 있었음.
    // 지금은 보이지 않는 필러 버튼(.menu-grid-filler)으로 열 개수를 항상
    // 한 페이지 단위(4열)의 배수로 맞춰두기 때문에, 이 상한이 정확히
    // "새 항목이 시작되는 다음 페이지 위치"와 일치해서 중복 없이 이동함
    const maxStartIndex = Math.max(0, columns.length - visibleCount);
    const currentIndex = columns.findIndex((c) => c.offsetLeft >= el.scrollLeft - 1);
    const fromIndex = currentIndex === -1 ? maxStartIndex : currentIndex;
    const targetIndex = Math.max(
      0,
      Math.min(maxStartIndex, fromIndex + direction * visibleCount)
    );
    el.scrollTo({ left: columns[targetIndex].offsetLeft, behavior: "smooth" });
  }

  // 한 화면에 보이는 열 개수(.menu-grid의 grid-auto-columns 계산식과 맞춰야 함).
  // 실제 버튼 개수가 "한 페이지(4열)의 배수"가 아니면, 보이지 않는 필러 버튼을
  // 뒤에 채워서 열 개수를 4의 배수로 맞춤 → scrollByPage가 마지막 페이지에서
  // 이미 봤던 앞쪽 버튼을 다시 끌어오지 않고, 새 항목만 정확히 보여줄 수 있음
  const MENU_GRID_VISIBLE_COLUMNS = 4;
  const MENU_GRID_ROWS = 2;
  const realColumns = Math.ceil(quickReplies.length / MENU_GRID_ROWS);
  const paddedColumns =
    Math.ceil(realColumns / MENU_GRID_VISIBLE_COLUMNS) * MENU_GRID_VISIBLE_COLUMNS;
  const fillerCount = paddedColumns * MENU_GRID_ROWS - quickReplies.length;

  return (
    <div className="menu-grid-wrap">
      <div
        className="menu-grid"
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {quickReplies.map((qr, i) => {
          const label = qr.label;
          const handleClick = () =>
            "targetId" in qr && qr.targetId
              ? onGoTo(qr.targetId, label)
              : onGoTo(qr.askText!, label);
          const [icon, ...rest] = label.split(" ");
          const text = rest.length ? rest.join(" ") : icon;
          return (
            <button
              key={i}
              className="menu-grid-btn"
              onClick={() => handleItemClick(handleClick)}
            >
              {rest.length > 0 && <span className="menu-grid-icon">{icon}</span>}
              <span className="menu-grid-label">{text}</span>
            </button>
          );
        })}
        {Array.from({ length: fillerCount }).map((_, i) => (
          <div
            key={`filler-${i}`}
            className="menu-grid-btn menu-grid-filler"
            aria-hidden="true"
          />
        ))}
      </div>
      <div className="menu-nav">
        <button
          type="button"
          className="menu-nav-btn"
          aria-label="이전"
          onClick={() => scrollByPage(-1)}
        >
          ‹
        </button>
        <button
          type="button"
          className="menu-nav-btn"
          aria-label="다음"
          onClick={() => scrollByPage(1)}
        >
          ›
        </button>
      </div>
    </div>
  );
}

// 자주 묻는 질문(faq 노드) 목록용 가로 스크롤 + ‹ › 페이지 이동 버튼.
// 루트 메뉴의 MenuGrid와 같은 드래그/페이지 이동 로직을 쓰되, 질문 버튼은
// 아이콘 없는 알약(pill) 모양 그대로 두기 위해 별도 컴포넌트로 둠
// (MenuGrid는 라벨 첫 단어를 이모지 아이콘으로 취급하는데, FAQ 질문 문장에는
// 이모지가 없어서 그대로 재사용하면 첫 단어가 아이콘 자리로 잘못 들어감)
// .quick-replies-2의 grid-template-rows와 반드시 같은 값으로 유지
const FAQ_ROWS = 3;

function FaqQuickReplies({
  quickReplies,
  onGoTo,
}: {
  quickReplies: QuickReply[];
  onGoTo: (targetId: string, label: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, moved: false, startX: 0, startScrollLeft: 0 });
  // 질문 개수가 적어서(현재 5칸 이하) 실제로 스크롤할 내용이 없으면 좌우 버튼을
  // 아예 숨김. 화면 폭에 따라 결과가 달라지므로 목록이 바뀔 때/창 크기가
  // 바뀔 때마다 다시 계산함
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    function checkOverflow() {
      const el = scrollRef.current;
      if (!el) return;
      setCanScroll(el.scrollWidth - el.clientWidth > 1);
    }
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [quickReplies]);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const el = scrollRef.current;
    if (!el) return;
    drag.current = { down: true, moved: false, startX: e.clientX, startScrollLeft: el.scrollLeft };
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = scrollRef.current;
    if (!el || !drag.current.down) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 3) drag.current.moved = true;
    el.scrollLeft = drag.current.startScrollLeft - dx;
  }

  function handlePointerUp() {
    drag.current.down = false;
  }

  function handleItemClick(action: () => void) {
    if (drag.current.moved) {
      drag.current.moved = false;
      return;
    }
    action();
  }

  // faq 목록은 항목 수가 고정돼 있지 않아(질문이 더 추가될 수 있음) MenuGrid처럼
  // 필러로 열 개수를 맞추지 않고, 버튼의 실제 위치(offsetLeft)를 그때그때 읽어서
  // 화면에 보이는 열 수만큼 이동함. FAQ_ROWS는 .quick-replies-2의
  // grid-template-rows 값과 항상 맞춰야 함(현재 3행)
  function scrollByPage(direction: 1 | -1) {
    const el = scrollRef.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>(".quick-reply-btn"));
    if (items.length < 2) return;
    const columns = items.filter((_, i) => i % FAQ_ROWS === 0);
    if (columns.length < 2) return;
    const stride = columns[1].offsetLeft - columns[0].offsetLeft;
    const visibleCount = Math.max(1, Math.round(el.clientWidth / stride));
    const maxStartIndex = Math.max(0, columns.length - visibleCount);
    const currentIndex = columns.findIndex((c) => c.offsetLeft >= el.scrollLeft - 1);
    const fromIndex = currentIndex === -1 ? maxStartIndex : currentIndex;
    const targetIndex = Math.max(
      0,
      Math.min(maxStartIndex, fromIndex + direction * visibleCount)
    );
    // 클릭했을 때 이동이 눈에 잘 띄도록 부드럽게 스크롤(즉시 점프하면 이동량이
    // 작을 때 버튼이 안 눌린 것처럼 보일 수 있음)
    el.scrollTo({ left: columns[targetIndex].offsetLeft, behavior: "smooth" });
  }

  return (
    <div className="menu-grid-wrap">
      <div
        className="quick-replies-2"
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {quickReplies.map((qr, i) => {
          const label = qr.label;
          const handleClick = () =>
            "targetId" in qr && qr.targetId
              ? onGoTo(qr.targetId, label)
              : onGoTo(qr.askText!, label);
          return (
            <button
              key={i}
              className="quick-reply-btn"
              onClick={() => handleItemClick(handleClick)}
            >
              {label}
            </button>
          );
        })}
      </div>
      {canScroll && (
        <div className="menu-nav">
          <button
            type="button"
            className="menu-nav-btn"
            aria-label="이전"
            onClick={() => scrollByPage(-1)}
          >
            ‹
          </button>
          <button
            type="button"
            className="menu-nav-btn"
            aria-label="다음"
            onClick={() => scrollByPage(1)}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
