import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Bell, Clock } from "lucide-react";

export function NotificationSettings() {
  const { data: settings, isLoading } = trpc.notifications.getSettings.useQuery();
  const updateMutation = trpc.notifications.updateSettings.useMutation({
    onSuccess: () => {
      toast.success("Notification settings updated");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update settings");
    },
  });

  const [enabled, setEnabled] = useState(settings?.enabled ?? false);
  const [time, setTime] = useState(settings?.time ?? "08:00");

  const handleSave = () => {
    updateMutation.mutate({
      enabled,
      time,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-card rounded-lg border border-border">
      <div className="flex items-center gap-3">
        <Bell className="h-5 w-5 text-primary" />
        <div>
          <h3 className="text-lg font-medium">Daily Prayer Reminders</h3>
          <p className="text-sm text-muted-foreground">
            Receive your daily prayer via email
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifications" className="text-base">
            Enable email notifications
          </Label>
          <Switch
            id="email-notifications"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </div>

        {enabled && (
          <div className="space-y-2 pl-4 border-l-2 border-primary/20">
            <Label htmlFor="notification-time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Delivery time
            </Label>
            <input
              id="notification-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground">
              Your daily prayer will be sent at this time (your local timezone)
            </p>
          </div>
        )}
      </div>

      <Button
        onClick={handleSave}
        disabled={updateMutation.isPending}
        className="w-full"
      >
        {updateMutation.isPending ? "Saving..." : "Save Settings"}
      </Button>
    </div>
  );
}
