import React from "react";
import Icon from "@/components/ui/Icon";

const AuthLayout = ({ eyebrow, title, description, children, footer }) => {
  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#292723] lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#292723] px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-16 xl:py-12">
        <div className="pointer-events-none absolute -left-32 -top-36 h-[30rem] w-[30rem] rounded-full bg-[#c06a48]/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-44 -right-24 h-[32rem] w-[32rem] rounded-full bg-[#e4bca4]/10 blur-[110px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(255,255,255,0.08),transparent_25%),linear-gradient(135deg,transparent_55%,rgba(192,106,72,0.12))]" />

        <div className="relative z-10 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#d97757] text-sm font-bold tracking-tight text-white shadow-lg shadow-black/20">
            AI
          </span>
          <span className="text-sm font-semibold tracking-wide text-white/90">
            Document Intelligence
          </span>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-xl py-16">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-xs font-medium tracking-wide text-[#f4d4c5]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e7a180] shadow-[0_0_12px_rgba(231,161,128,0.8)]" />
            YOUR KNOWLEDGE, UNLOCKED
          </div>
          <h1 className="max-w-lg text-5xl font-semibold leading-[1.08] tracking-[-0.045em] xl:text-6xl">
            Every document has{" "}
            <span className="relative inline-block bg-gradient-to-r from-[#f0c7ae] via-[#e7a180] to-[#d97757] bg-clip-text font-serif italic text-transparent after:absolute after:-bottom-1 after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-gradient-to-r after:from-[#d97757]/0 after:via-[#d97757]/80 after:to-[#d97757]/0">
              more to say.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-300/80">
            Bring your files together, find the details that matter, and move
            from reading to understanding in seconds.
          </p>

          <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#d97757]/15 text-[#f0c7ae]">
                  <Icon icon="heroicons-outline:document-text" />
                </span>
                <div>
                  <p className="text-sm font-medium text-white">Quarterly report.pdf</p>
                  <p className="mt-0.5 text-xs text-slate-400">Ready to explore</p>
                </div>
              </div>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[11px] font-medium text-emerald-200">
                PROCESSED
              </span>
            </div>
            <div className="mt-4 flex gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#d97757]/20 text-xs font-semibold text-[#f0c7ae]">
                AI
              </span>
              <div className="rounded-2xl rounded-tl-md bg-white/[0.08] px-4 py-3">
                <p className="text-xs leading-5 text-slate-200">
                  Ask a question and get a clear answer grounded in your
                  document.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-[#0c1423]/70 px-3.5 py-3 text-xs text-slate-400">
              <Icon icon="heroicons-outline:sparkles" />
              <span>What are the key takeaways?</span>
              <span className="ml-auto grid h-7 w-7 place-items-center rounded-lg bg-[#d97757] text-white">
                <Icon icon="heroicons-outline:arrow-up" />
              </span>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-300/70">
            <span className="inline-flex items-center gap-2">
              <Icon icon="heroicons-outline:shield-check" />
              Your files, kept secure
            </span>
            <span className="inline-flex items-center gap-2">
              <Icon icon="heroicons-outline:bolt" />
              Answers in moments
            </span>
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-400/70">
          A smarter way to work with information.
        </p>
      </section>

      <section className="flex min-h-screen flex-col px-5 py-7 sm:px-10 sm:py-10 lg:px-12 xl:px-20">
        <div className="flex items-center gap-3 lg:hidden">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#d97757] text-sm font-bold text-white">
            AI
          </span>
          <span className="text-sm font-semibold text-slate-800">
            Document Intelligence
          </span>
        </div>

        <div className="my-auto flex w-full justify-center py-12 lg:py-16">
          <div className="w-full max-w-[430px]">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">
              {eyebrow}
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#292723] sm:text-[2.15rem]">
              {title}
            </h2>
            <p className="mt-2.5 text-sm leading-6 text-slate-500">
              {description}
            </p>
            <div className="mt-8">{children}</div>
            {footer && (
              <div className="mt-7 border-t border-[#e8e1d7] pt-6 text-sm text-slate-500">
                {footer}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 text-xs text-slate-400">
          <span>© {year} AI Document Intelligence</span>
          <span className="inline-flex items-center gap-1.5">
            <Icon icon="heroicons-outline:lock-closed" />
            Secure workspace
          </span>
        </div>
      </section>
    </main>
  );
};

export default AuthLayout;
