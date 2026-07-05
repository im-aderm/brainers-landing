import { BrainMark } from "../ui/BrainMark";

const COLUMNS = [
  {
    title: "Product",
    links: ["How it works", "Knowledge Graph", "Enterprise Search", "Dashboard"],
  },
  {
    title: "Company",
    links: ["About Brainers Labs", "Careers", "Newsroom", "Contact"],
  },
  {
    title: "Trust",
    links: ["Security", "Privacy", "Compliance", "Status"],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-edge">
      <div className="hairline-gradient absolute inset-x-0 top-0" />
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <BrainMark size={30} />
            <span className="text-[15px] font-semibold tracking-tight">BrainersOS</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-muted">
            The AI operating system that turns everything your company knows
            into answers your teams can trust.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    data-cursor="hover"
                    className="text-sm text-text-secondary transition-colors hover:text-white"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-edge">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Brainers Labs. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(24,201,100,0.8)]" />
            All systems operational
          </p>
        </div>
      </div>
    </footer>
  );
}
