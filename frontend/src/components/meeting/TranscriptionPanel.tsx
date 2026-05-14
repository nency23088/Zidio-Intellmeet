import { useState } from "react";
import { Bot, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TranscriptLine {
  id: string;
  speaker: string;
  text: string;
  timestamp: string;
}

interface TranscriptionPanelProps {
  lines: TranscriptLine[];
  isLive: boolean;
}

export default function TranscriptionPanel({
  lines,
  isLive,
}: TranscriptionPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="absolute bottom-24 left-4 w-96 bg-[#0d0e14]/95 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/3 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-white">
            Live Transcription
          </span>
          {isLive && (
            <div className="flex items-center gap-1 bg-red-500/15 border border-red-500/20 rounded-full px-2 py-0.5">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-red-400">LIVE</span>
            </div>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        )}
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="max-h-48 overflow-y-auto px-4 pb-4 space-y-3">
          {lines.length === 0 ? (
            <div className="flex items-center gap-2 text-gray-500 py-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span className="text-xs">Waiting for speech...</span>
            </div>
          ) : (
            lines.map((line) => (
              <div key={line.id} className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-indigo-400">
                    {line.speaker}
                  </span>
                  <span className="text-[10px] text-gray-600">
                    {line.timestamp}
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {line.text}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}