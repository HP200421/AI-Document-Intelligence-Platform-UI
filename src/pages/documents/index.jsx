import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import Icon from "@/components/ui/Icon";
import { toast } from "react-toastify";
import { getUserDisplayName } from "@/pages/auth/common/store";
import {
  askDocument,
  extractAnswer,
  getStoredDocuments,
  storeDocuments,
  uploadDocument,
} from "@/services/documents";

const formatDate = (value) => {
  if (!value) return "";
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

const Documents = () => {
  const user = useSelector((state) => state.auth.user);
  const userName = getUserDisplayName(user);
  const [documents, setDocuments] = useState(getStoredDocuments);
  const [selectedId, setSelectedId] = useState(documents[0]?.id || null);
  const [uploading, setUploading] = useState(false);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [threads, setThreads] = useState({});
  const bottomRef = useRef(null);

  const selected = useMemo(
    () => documents.find((doc) => doc.id === selectedId) || null,
    [documents, selectedId]
  );

  const messages = threads[selectedId] || [];

  useEffect(() => {
    storeDocuments(documents);
  }, [documents]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, asking]);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await uploadDocument(file);

      if (!response.success) {
        const detail = response.error?.detail;
        const message = Array.isArray(detail)
          ? detail.map((item) => item.msg).filter(Boolean).join(". ")
          : detail;
        toast.error(message || "Upload failed");
        return;
      }

      const uploaded = response.data;
      setDocuments((prev) => {
        const next = [uploaded, ...prev.filter((doc) => doc.id !== uploaded.id)];
        return next;
      });
      setSelectedId(uploaded.id);
      toast.success(`${uploaded.filename || file.name} is ready`);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    disabled: uploading,
  });

  const handleAsk = async (event) => {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || !selectedId || asking) return;

    setAsking(true);
    setQuestion("");
    setThreads((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), { role: "user", text: trimmed }],
    }));

    try {
      const response = await askDocument(selectedId, trimmed);
      const detail = response.error?.detail;
      const errorMessage = Array.isArray(detail)
        ? detail.map((item) => item.msg).filter(Boolean).join(". ")
        : detail;

      setThreads((prev) => ({
        ...prev,
        [selectedId]: [
          ...(prev[selectedId] || []),
          {
            role: "assistant",
            text: response.success
              ? extractAnswer(response.data)
              : errorMessage || "Could not answer that question.",
          },
        ],
      }));
      if (!response.success) {
        toast.error(errorMessage || "Could not answer that question.");
      }
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 pb-8">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary-700">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
            Welcome back, {userName}
          </div>
          <h1 className="text-2xl font-semibold tracking-[-0.035em] text-slate-900 dark:text-white sm:text-3xl">
            Document intelligence
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Add a document, then ask natural-language questions to uncover the
            details inside.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-medium text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-900/20 dark:text-emerald-300">
          <Icon icon="heroicons-outline:sparkles" />
          AI workspace ready
        </div>
      </header>

      <div className="grid min-h-[620px] grid-cols-1 gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="flex flex-col rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.28)] dark:border-slate-700 dark:bg-slate-800 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                Your library
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {documents.length} {documents.length === 1 ? "document" : "documents"}
              </p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary-50 text-lg text-primary-700 dark:bg-primary-400/10 dark:text-primary-300">
              <Icon icon="heroicons-outline:collection" />
            </span>
          </div>

          <div
            {...getRootProps()}
            className={`group relative mb-6 cursor-pointer overflow-hidden rounded-2xl border border-dashed px-4 py-6 text-center transition duration-200 ${
              isDragActive
                ? "border-primary-400 bg-primary-50 dark:bg-primary-400/10"
                : "border-primary-200 bg-primary-50/40 hover:border-primary-400 hover:bg-primary-50 dark:border-slate-600 dark:bg-slate-700/30 dark:hover:bg-slate-700/60"
            } ${uploading ? "pointer-events-none opacity-65" : ""}`}
          >
            <input {...getInputProps()} />
            <span className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-white text-xl text-primary-700 shadow-sm dark:bg-slate-700 dark:text-primary-300">
              {uploading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
              ) : (
                <Icon icon="heroicons-outline:cloud-upload" />
              )}
            </span>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {uploading
                ? "Uploading your file…"
                : isDragActive
                  ? "Drop your document here"
                  : "Drop a file or browse"}
            </p>
            <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Securely upload a document to start asking questions.
            </p>
            <span className="mt-4 inline-flex rounded-lg border border-primary-100 bg-white px-3 py-1.5 text-xs font-semibold text-primary-700 shadow-sm dark:border-slate-600 dark:bg-slate-700 dark:text-primary-200">
              Choose a file
            </span>
          </div>

          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Recent documents
            </p>
            {documents.length > 0 && (
              <span className="text-xs text-slate-400">{documents.length} total</span>
            )}
          </div>

          <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto">
            {documents.length === 0 ? (
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-6 text-center dark:border-slate-700 dark:bg-slate-700/30">
                <span className="mx-auto mb-2 grid h-9 w-9 place-items-center rounded-xl bg-white text-slate-400 shadow-sm dark:bg-slate-700">
                  <Icon icon="heroicons-outline:document" />
                </span>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Your library is waiting
                </p>
                <p className="mt-1 text-[11px] leading-4 text-slate-400">
                  Uploaded files will appear here.
                </p>
              </div>
            ) : (
              documents.map((doc) => {
                const active = doc.id === selectedId;
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setSelectedId(doc.id)}
                    aria-current={active ? "true" : undefined}
                    className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                      active
                        ? "bg-[#292723] text-white shadow-md shadow-slate-900/10 dark:bg-primary-700"
                        : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700/60"
                    }`}
                  >
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-base ${
                        active
                          ? "bg-white/10 text-primary-100"
                          : "bg-primary-50 text-primary-700 dark:bg-primary-400/10 dark:text-primary-300"
                      }`}
                    >
                      <Icon icon="heroicons-outline:document-text" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {doc.filename}
                      </span>
                      <span
                        className={`mt-1 block text-[11px] ${
                          active ? "text-white/60" : "text-slate-400"
                        }`}
                      >
                        {formatDate(doc.created_at) || "Recently added"}
                      </span>
                    </span>
                    <Icon
                      icon="heroicons-outline:chevron-right"
                      className={`text-sm ${
                        active
                          ? "text-white/60"
                          : "text-slate-300 group-hover:text-slate-500"
                      }`}
                    />
                  </button>
                );
              })
            )}
          </div>

          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3 dark:border-slate-700 dark:bg-slate-700/30">
            <Icon
              icon="heroicons-outline:lock-closed"
              className="mt-0.5 shrink-0 text-sm text-slate-400"
            />
            <p className="text-[11px] leading-4 text-slate-500 dark:text-slate-400">
              Your documents stay in your private workspace.
            </p>
          </div>
        </aside>

        <section className="flex min-h-[560px] flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_12px_40px_-28px_rgba(15,23,42,0.28)] dark:border-slate-700 dark:bg-slate-800">
          {!selected ? (
            <div className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-14 text-center sm:px-12">
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-100/50 blur-3xl dark:bg-primary-500/10" />
              <div className="relative max-w-md">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-[22px] bg-gradient-to-br from-primary-500 to-primary-700 text-2xl text-white shadow-xl shadow-primary-500/20">
                  <Icon icon="heroicons-outline:sparkles" />
                </span>
                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-primary-700 dark:text-primary-300">
                  Your AI reading room
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-slate-900 dark:text-white sm:text-3xl">
                  Turn pages into progress.
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Upload a document from your library. Get a clear starting
                  point, then explore the details with your own questions.
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-2">
                  {["Summarize the key points", "Find dates and figures", "Explain a section"].map(
                    (prompt) => (
                      <span
                        key={prompt}
                        className="rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {prompt}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              <header className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 dark:border-slate-700 sm:px-7">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary-50 text-lg text-primary-700 dark:bg-primary-400/10 dark:text-primary-300">
                    <Icon icon="heroicons-outline:document-text" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                      Exploring document
                    </p>
                    <h2 className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
                      {selected.filename}
                    </h2>
                  </div>
                </div>
                <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300 sm:inline-flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Ready to answer
                </span>
              </header>

              <div className="flex flex-1 flex-col overflow-y-auto bg-[radial-gradient(ellipse_at_top,rgba(238,242,255,0.65),transparent_50%)] px-4 py-5 dark:bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_50%)] sm:px-7 sm:py-7">
                {messages.length === 0 && !asking && (
                  <div className="m-auto w-full max-w-lg py-6 text-center">
                    <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-xl text-primary-700 shadow-sm dark:bg-slate-700 dark:text-primary-300">
                      <Icon icon="heroicons-outline:chat-alt-2" />
                    </span>
                    <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
                      Start a conversation
                    </h3>
                    <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                      Ask about anything in this document.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                      {[
                        "What is this document about?",
                        "Summarize the key points",
                        "What should I pay attention to?",
                      ].map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => setQuestion(prompt)}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 transition hover:border-primary-200 hover:text-primary-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-primary-500 dark:hover:text-primary-300"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-5">
                  {messages.map((item, index) => (
                    <div
                      key={`${item.role}-${index}`}
                      className={`flex items-end gap-2.5 ${
                        item.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {item.role === "assistant" && (
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-[10px] font-bold text-white">
                          AI
                        </span>
                      )}
                      <div
                        className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[78%] ${
                          item.role === "user"
                            ? "rounded-br-md bg-[#292723] text-white shadow-md shadow-slate-900/10 dark:bg-primary-700"
                            : "rounded-bl-md border border-slate-100 bg-white text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-700 dark:text-slate-100"
                        }`}
                      >
                        {item.text}
                      </div>
                    </div>
                  ))}
                  {asking && (
                    <div className="flex items-end gap-2.5">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-[10px] font-bold text-white">
                        AI
                      </span>
                      <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-100 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-700 dark:text-slate-300">
                        <span className="flex gap-1">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-400 [animation-delay:-0.2s]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-400 [animation-delay:-0.1s]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-400" />
                        </span>
                        Finding an answer
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>
              </div>

              <form
                onSubmit={handleAsk}
                className="border-t border-slate-100 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:px-7 sm:py-5"
              >
                <div className="flex items-end gap-3 rounded-2xl border border-slate-200 bg-[#f8f5ef] p-2 transition focus-within:border-primary-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-50 dark:border-slate-600 dark:bg-slate-900 dark:focus-within:border-primary-500 dark:focus-within:ring-primary-500/10">
                  <textarea
                    rows={1}
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder="Ask a question about this document…"
                    aria-label="Ask a question about this document"
                    className="max-h-32 min-h-10 flex-1 resize-y bg-transparent px-2 py-2 text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        handleAsk(event);
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!question.trim() || asking}
                    aria-label="Send question"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-600 text-lg text-white shadow-md shadow-primary-600/20 transition hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Icon icon="heroicons-outline:paper-airplane" />
                  </button>
                </div>
                <p className="mt-2 text-center text-[10px] text-slate-400">
                  Answers are generated from the selected document. Press Enter
                  to send.
                </p>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Documents;
