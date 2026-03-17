export function PoweredByBadge({ className = "" }: { className?: string }) {
  const BASE = import.meta.env.BASE_URL;
  return (
    <a
      href="https://fortunedesign.co.za"
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group ${className}`}
    >
      <img
        src={`${BASE}images/fortune-design-logo.png`}
        alt="Fortune Design"
        className="h-9 w-9 object-contain shrink-0"
      />
      <span className="text-[12px] font-semibold text-gray-500 group-hover:text-gray-700 transition-colors whitespace-nowrap">
        Powered by <span className="text-gray-800 font-bold">Fortune Design</span>
      </span>
    </a>
  );
}
