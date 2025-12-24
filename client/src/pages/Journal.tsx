import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function Journal() {
  const { user, isAuthenticated } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [newEntry, setNewEntry] = useState("");

  // Fetch journal entries
  const { data: entries, isLoading, refetch } = trpc.journal.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Create entry mutation
  const createMutation = trpc.journal.create.useMutation({
    onSuccess: () => {
      setNewEntry("");
      setIsCreating(false);
      refetch();
      toast.success("Journal entry saved");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save entry");
    },
  });

  const handleSave = () => {
    if (!newEntry.trim()) {
      toast.error("Please write something first");
      return;
    }
    createMutation.mutate({ content: newEntry });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Please sign in to access your journal</p>
        <a href={getLoginUrl()}>
          <Button>Sign In</Button>
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-border px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-serif font-medium text-xl text-foreground">Journal</h1>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-muted"
            onClick={() => setIsCreating(!isCreating)}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 pt-24 pb-12">
        {/* Create New Entry */}
        {isCreating && (
          <div className="mb-8 bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="font-serif text-lg font-medium">New Entry</h2>
            <Textarea
              placeholder="Write your thoughts, reflections, or prayers..."
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              className="min-h-[200px] resize-none"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setNewEntry("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Entry"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Entries List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : entries && entries.length > 0 ? (
          <div className="space-y-6">
            {entries.map((entry) => (
              <article
                key={entry.id}
                className="bg-card border border-border rounded-lg p-6 space-y-3"
              >
                <time className="text-sm text-muted-foreground">
                  {new Date(entry.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
                <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {entry.content}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <p className="text-muted-foreground">No journal entries yet</p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Entry
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
