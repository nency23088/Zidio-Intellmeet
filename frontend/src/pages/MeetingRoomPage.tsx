import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import MeetingControls from "@/components/meeting/MeetingControls";
import VideoTile from "@/components/meeting/VideoTile";
import ChatPanel from "@/components/meeting/ChatPanel";
import ParticipantsPanel from "@/components/meeting/ParticipantsPanel";
import TranscriptionPanel from "@/components/meeting/TranscriptionPanel";
import { Message } from "@/types";
import { Bot, Clock, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock participants
const mockParticipants = [
  { id: "u1", name: "Joel Thomas", isMuted: false, isVideoOff: false, isHost: true, isSpeaking: true },
  { id: "u2", name: "Sarah Connor", isMuted: true, isVideoOff: false, isHost: false, isSpeaking: false },
  { id: "u3", name: "Mike Ross", isMuted: false, isVideoOff: true, isHost: false, isSpeaking: false },
  { id: "u4", name: "Anna Lee", isMuted: true, isVideoOff: true, isHost: false, isSpeaking: false },
];

// Mock transcription
const mockTranscript = [
  { id: "t1", speaker: "Joel Thomas", text: "Let's start with the sprint goals for this week.", timestamp: "5:17 PM" },
  { id: "t2", speaker: "Sarah Connor", text: "I've completed the authentication module and started on the dashboard.", timestamp: "5:18 PM" },
  { id: "t3", speaker: "Mike Ross", text: "Working on the API integration, should be done by tomorrow.", timestamp: "5:18 PM" },
];

// Mock messages
const mockMessages: Message[] = [
  {
    _id: "m1",
    senderId: "u2",
    senderName: "Sarah Connor",
    text: "Can everyone see my screen?",
    timestamp: new Date(Date.now() - 180000).toISOString(),
  },
  {
    _id: "m2",
    senderId: "u3",
    senderName: "Mike Ross",
    text: "Yes! Looks good 👍",
    timestamp: new Date(Date.now() - 120000).toISOString(),
  },
];

export default function MeetingRoomPage() {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Controls state
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [duration, setDuration] = useState(0);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    toast.info(isMuted ? "Microphone on" : "Microphone muted");
  };

  const handleToggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    toast.info(isVideoOff ? "Camera on" : "Camera off");
  };

  const handleToggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast.info(isScreenSharing ? "Screen sharing stopped" : "Screen sharing started");
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    toast.info(isRecording ? "Recording stopped" : "Recording started");
  };

  const handleSendMessage = (text: string) => {
    const newMsg: Message = {
      _id: Date.now().toString(),
      senderId: user?._id || "local",
      senderName: user?.name || "You",
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleLeave = () => {
    toast.info("Leaving meeting...");
    setTimeout(() => navigate(`/meeting/${meetingId}/post`), 500);
  };

  return (
    <div className="h-screen bg-[#0a0b0f] flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="h-14 bg-[#0d0e14]/95 border-b border-white/5 flex items-center justify-between px-6 flex-shrink-0">
        {/* Left - Meeting Info */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-sm font-semibold text-white">
              Sprint Planning — Week 19
            </h1>
            <p className="text-xs text-gray-500">ID: {meetingId}</p>
          </div>
        </div>

        {/* Center - Timer */}
        <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-sm font-mono text-white">
            {formatDuration(duration)}
          </span>
        </div>

        {/* Right - Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <Wifi className="w-3.5 h-3.5" />
            <span>Good connection</span>
          </div>
          <div className="flex items-center gap-1.5 bg-indigo-500/15 border border-indigo-500/20 rounded-lg px-2.5 py-1">
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs text-indigo-300 font-medium">
              AI Active
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid */}
        <div className="flex-1 p-4 relative overflow-hidden">
          {/* Grid Layout */}
          <div
            className={cn(
              "h-full grid gap-3",
              mockParticipants.length === 1 && "grid-cols-1",
              mockParticipants.length === 2 && "grid-cols-2",
              mockParticipants.length === 3 && "grid-cols-2 grid-rows-2",
              mockParticipants.length === 4 && "grid-cols-2 grid-rows-2",
              mockParticipants.length > 4 && "grid-cols-3"
            )}
          >
            {mockParticipants.map((participant, index) => (
              <VideoTile
                key={participant.id}
                name={participant.name}
                isMuted={participant.isMuted}
                isVideoOff={participant.isVideoOff}
                isSpeaking={participant.isSpeaking}
                isLocal={index === 0}
              />
            ))}
          </div>

          {/* Live Transcription Overlay */}
          <TranscriptionPanel
            lines={mockTranscript}
            isLive={true}
          />
        </div>

        {/* Side Panels */}
        {isParticipantsOpen && (
          <ParticipantsPanel
            participants={mockParticipants}
            onClose={() => setIsParticipantsOpen(false)}
          />
        )}
        {isChatOpen && (
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            onClose={() => setIsChatOpen(false)}
          />
        )}
      </div>

      {/* Controls */}
      <MeetingControls
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isScreenSharing={isScreenSharing}
        isRecording={isRecording}
        isChatOpen={isChatOpen}
        isParticipantsOpen={isParticipantsOpen}
        onToggleMute={handleToggleMute}
        onToggleVideo={handleToggleVideo}
        onToggleScreenShare={handleToggleScreenShare}
        onToggleRecording={handleToggleRecording}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        onToggleParticipants={() => setIsParticipantsOpen(!isParticipantsOpen)}
        onLeave={handleLeave}
      />
    </div>
  );
}