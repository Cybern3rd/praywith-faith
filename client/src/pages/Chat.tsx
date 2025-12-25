import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Send, Loader2, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/lib/translations";

export default function Chat() {
  const { user, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chat sessions
  const { data: sessions, refetch: refetchSessions } = trpc.chat.sessions.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Fetch messages for selected session
  const { data: messages, refetch: refetchMessages } = trpc.chat.messages.useQuery(
    { sessionId: selectedSessionId! },
    { enabled: !!selectedSessionId }
  );

  // Create session mutation
  const createSessionMutation = trpc.chat.createSession.useMutation({
    onSuccess: (data) => {
      setSelectedSessionId(data.id);
      refetchSessions();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create chat session");
    },
  });

  // Send message mutation
  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: () => {
      setMessage("");
      refetchMessages();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send message");
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Create initial session if none exists
  useEffect(() => {
    if (isAuthenticated && sessions && sessions.length === 0 && !selectedSessionId) {
      createSessionMutation.mutate({ title: "New Conversation" });
    } else if (sessions && sessions.length > 0 && !selectedSessionId) {
      setSelectedSessionId(sessions[0].id);
    }
  }, [sessions, isAuthenticated, selectedSessionId]);

  const handleSend = () => {
    if (!message.trim() || !selectedSessionId) return;
    sendMessageMutation.mutate({
      sessionId: selectedSessionId,
      content: message,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">{t.signInToChat}</p>
        <a href={getLoginUrl()}>
          <Button>{t.signIn}</Button>
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-serif font-medium text-xl text-foreground">{t.spiritualChat}</h1>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-muted"
            onClick={() => createSessionMutation.mutate({ title: "New Conversation" })}
            disabled={createSessionMutation.isPending}
          >
            <MessageCircle className="w-5 h-5" />
          </Button>
        </div>
      </nav>

      {/* Chat Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 pt-24 pb-32 flex flex-col">
        {/* Messages */}
        <div className="flex-1 space-y-6 overflow-y-auto mb-6">
          {messages && messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  <time className="text-xs opacity-70 mt-2 block">
                    {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
              <MessageCircle className="w-12 h-12 text-muted-foreground/50" />
              <div>
                <p className="text-lg font-serif text-foreground mb-2">
                  {t.welcomeToChat}
                </p>
                <p className="text-sm text-muted-foreground max-w-md">
                  {t.chatDescription}
                </p>
              </div>
            </div>
          )}
          
          {sendMessageMutation.isPending && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-3">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-border p-6">
          <div className="max-w-4xl mx-auto flex gap-3">
            <Input
              placeholder={t.typeMessage}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sendMessageMutation.isPending || !selectedSessionId}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!message.trim() || sendMessageMutation.isPending || !selectedSessionId}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
