import { MockAppShell, MockBtn } from "../primitives";
import { brand } from "../tokens";

const items = [
  {
    title: "High spend alert",
    message: "Travel expense of ₹1,200 recorded today.",
    time: "17 Jun 2026, 9:20 AM",
    unread: true,
  },
  {
    title: "Weekly summary",
    message: "You spent ₹8,420 across 12 transactions.",
    time: "16 Jun 2026, 8:00 AM",
    unread: false,
  },
];

export function NotificationsMockup() {
  return (
    <MockAppShell active="notifications">
      <div className="space-y-8">
        <div>
          <h1 className="text-[28px] font-bold" style={{ color: brand.ink }}>
            Notifications
          </h1>
          <p className="mt-1 text-sm text-slate-500">Subscriber alerts · email & SMS enabled</p>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border p-5"
              style={{
                borderColor: brand.border,
                background: item.unread ? brand.light : "white",
              }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold" style={{ color: brand.ink }}>
                    {item.title}
                  </p>
                  <p className="mt-1.5 text-sm text-slate-600">{item.message}</p>
                  <p className="mt-3 text-xs text-slate-400">{item.time}</p>
                </div>
                {item.unread ? <MockBtn variant="secondary">Mark read</MockBtn> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MockAppShell>
  );
}
