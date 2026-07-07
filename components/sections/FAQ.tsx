"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle, Code, Shield } from "lucide-react";
import { useState } from "react";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

type FAQCategory = "general" | "tech" | "security";

const CATEGORIES: Array<{ id: FAQCategory; label: string; icon: any }> = [
  { id: "general", label: "General", icon: HelpCircle },
  { id: "tech", label: "Capabilities & Tech", icon: Code },
  { id: "security", label: "Security & Deploy", icon: Shield },
];

const FAQS = [
  // General Category
  {
    category: "general" as FAQCategory,
    q: "Does BrainersOS replace ChatGPT?",
    a: "No. BrainersOS is an enterprise intelligence operating system — it connects to your organization's data and provides answers grounded in your documents, policies, and conversations. ChatGPT is a general-purpose chatbot. They serve different purposes, and BrainersOS can actually be used alongside LLMs like GPT.",
  },
  {
    category: "general" as FAQCategory,
    q: "What's the difference between Search and BrainersOS?",
    a: "Search returns links. BrainersOS returns answers — with reasoning, sources, confidence scores, and evidence. It understands what your documents mean, not just what words they contain.",
  },
  {
    category: "general" as FAQCategory,
    q: "How long does integration take?",
    a: "Most organizations connect their first data source in under 15 minutes. A full deployment with multiple connectors, custom ontologies, and user provisioning typically takes 1-2 weeks.",
  },
  {
    category: "general" as FAQCategory,
    q: "Does BrainersOS support multiple languages?",
    a: "Yes. BrainersOS understands and processes content in 50+ languages. Answers are returned in the same language as the question, using sources in any language.",
  },

  // Capabilities & Tech Category
  {
    category: "tech" as FAQCategory,
    q: "Does it support MCP?",
    a: "Yes. BrainersOS is MCP-native. Our server implements the Model Context Protocol, allowing any MCP-compatible client to query your organizational knowledge graph.",
  },
  {
    category: "tech" as FAQCategory,
    q: "How does memory work?",
    a: "BrainersOS has six memory layers: working, long-term, organizational, conversational, decision, and execution memory. Each layer persists different types of context, enabling the system to remember, reason, and learn over time.",
  },
  {
    category: "tech" as FAQCategory,
    q: "Can I build custom plugins?",
    a: "Yes. BrainersOS has a Plugin Platform with a public SDK. Build custom connectors, data transformers, workflow actions, and UI extensions using TypeScript or Go.",
  },
  {
    category: "tech" as FAQCategory,
    q: "Can we bring our own models?",
    a: "Yes. BrainersOS supports BYOM (Bring Your Own Model). Connect your existing LLM infrastructure — whether it's OpenAI, Anthropic, open-source models, or your own fine-tuned models.",
  },
  {
    category: "tech" as FAQCategory,
    q: "How is trust calculated?",
    a: "Every answer includes a confidence score based on source relevance, consistency across multiple documents, recency, and grounding verification. You can always drill down to the exact source and page.",
  },

  // Security & Deploy Category
  {
    category: "security" as FAQCategory,
    q: "Is our data private?",
    a: "Absolutely. Your data is encrypted in transit and at rest. We offer multi-tenant isolation, and each organization's knowledge graph is completely separate. We never train on your data.",
  },
  {
    category: "security" as FAQCategory,
    q: "Can we deploy on-premises?",
    a: "Yes. BrainersOS Enterprise supports on-premises deployment in your own cloud or data center, with full control over your data and infrastructure.",
  },
  {
    category: "security" as FAQCategory,
    q: "Can it connect to Slack?",
    a: "Yes. BrainersOS has a native Slack connector that indexes messages, threads, and files from channels your team uses — while respecting access controls.",
  },
  {
    category: "security" as FAQCategory,
    q: "Does it work offline?",
    a: "On-premises deployments can operate fully offline. Cloud deployments require an internet connection, but cached knowledge graphs support degraded-mode queries even during interruptions.",
  },
  {
    category: "security" as FAQCategory,
    q: "What happens to deleted data?",
    a: "When a source document is deleted from its original system, BrainersOS removes it from the knowledge graph within the next sync cycle. Audit trails of what was removed are retained.",
  },
];

export function FAQ() {
  const [activeCat, setActiveCat] = useState<FAQCategory>("general");
  const [open, setOpen] = useState<string | null>(null);

  const filteredFaqs = FAQS.filter((f) => f.category === activeCat);

  return (
    <section className="relative overflow-hidden py-32 sm:py-44">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-full max-w-7xl -translate-x-1/2 hairline-gradient" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions."
          subtitle="Everything you need to know about BrainersOS."
        />

        {/* Tab Filters */}
        <Reveal className="mt-16 flex flex-wrap justify-center gap-3" y={15}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCat === cat.id;
            const CatIcon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCat(cat.id);
                  setOpen(null);
                }}
                className={`glass flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-tight transition-all duration-300 ${
                  isActive
                    ? "border-accent/40 bg-accent/15 text-white shadow-[0_0_24px_rgba(59,130,246,0.15)]"
                    : "border-edge text-text-secondary hover:border-white/20 hover:text-white"
                }`}
                data-cursor="hover"
              >
                <CatIcon size={14} className={isActive ? "text-accent" : "text-white/40"} />
                {cat.label}
              </button>
            );
          })}
        </Reveal>

        {/* FAQ grid (2-column layout to reduce vertical scroll length) */}
        <div className="mt-12 mx-auto max-w-5xl">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start"
          >
            <AnimatePresence mode="popLayout">
              {filteredFaqs.map((faq) => {
                const isOpen = open === faq.q;
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    key={faq.q}
                    className={`glass rounded-2xl border transition-all duration-500 overflow-hidden ${
                      isOpen ? "border-white/15 bg-white/[0.03]" : "border-edge hover:border-edge-strong bg-[#05070a]/40"
                    }`}
                  >
                    <button
                      onClick={() => setOpen(isOpen ? null : faq.q)}
                      className="flex w-full items-center justify-between px-6 py-5 text-left"
                      data-cursor="hover"
                    >
                      <span className="text-sm font-semibold text-white/90 group-hover:text-white">
                        {faq.q}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="ml-4 shrink-0"
                      >
                        <ChevronDown size={15} className="text-text-muted" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <p className="border-t border-edge px-6 pb-5 pt-4 text-xs leading-relaxed text-text-secondary">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      {/* FAQ background glow */}
      <div className="pointer-events-none absolute right-[10%] top-1/2 z-0 h-[450px] w-[450px] -translate-y-1/2 rounded-full bg-violet/4 blur-[130px]" />
    </section>
  );
}
