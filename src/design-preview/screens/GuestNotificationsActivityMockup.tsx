import { MockGuestShell } from "../primitives";
import { brand } from "../tokens";

const activity = [
  {
    title: "Expense added",
    message: "Food · ₹450 recorded",
    time: "Today, 1:32 PM",
    fresh: true,
  },
  {
    title: "Trial reminder",
    message: "5 days left in your free trial. Subscribe to keep your data.",
    time: "Today, 9:00 AM",
    fresh: true,
  },
  {
    title: "Expense added",
    message: "Travel · ₹1,200 recorded",
    time: "Yesterday, 9:18 AM",
    fresh: false,
  },
  {
    title: "Weekly summary",
    message: "You tracked ₹2,549 across 3 expenses this week.",
    time: "Mon, 8:00 AM",
    fresh: false,
  },
];

export function GuestNotificationsActivityMockup() {
  return (
    <MockGuestShell active="notifications" daysLeft={5}>
      <div className="space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold" style={{ color: brand.ink }}>
              Your activity
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Alerts sent to you@example.com · +91 98765 43210
            </p>
          </div>
          <span className="text-sm font-medium" style={{ color: brand.primary }}>
            Edit contact
          </span>
        </div>

        <div className="space-y-3">
          {activity.map((item) => (
            <div
              key={item.time + item.title}
              className="rounded-2xl border p-5 shadow-[0_1px_3px_rgba(232,93,4,0.08)]"
              style={{
                borderColor: brand.border,
                background: item.fresh ? brand.light : "white",
              }}
            >
              <p className="font-semibold" style={{ color: brand.ink }}>
                {item.title}
              </p>
              <p className="mt-1.5 text-sm text-slate-600">{item.message}</p>
              <p className="mt-3 text-xs text-slate-400">{item.time}</p>
            </div>
          ))}
        </div>
      </div>
    </MockGuestShell>
  );
}
