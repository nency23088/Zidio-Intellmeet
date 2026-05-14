export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 10l5-5-5-5" />
          <path d="M20 5H9a4 4 0 0 0-4 4v2" />
          <path d="M9 14l-5 5 5 5" />
          <path d="M4 19h11a4 4 0 0 0 4-4v-2" />
        </svg>
      </div>
      <span className="text-xl font-bold text-white tracking-tight">
        Intell<span className="text-indigo-400">Meet</span>
      </span>
    </div>
  );
}