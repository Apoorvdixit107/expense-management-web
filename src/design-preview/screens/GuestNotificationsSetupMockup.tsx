import { MockBtn, MockCard, MockGuestShell, MockInput } from "../primitives";
import { brand } from "../tokens";

export function GuestNotificationsSetupMockup() {
  return (
    <MockGuestShell active="notifications" daysLeft={5}>
      <div className="mx-auto max-w-lg space-y-6">
        <div className="text-center">
          <h1 className="text-[28px] font-bold" style={{ color: brand.ink }}>
            Enable notifications
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Add your email and mobile to receive activity alerts — expense added, trial reminders, and weekly summaries.
            No account required yet.
          </p>
        </div>

        <MockCard>
          <MockInput label="Email" placeholder="you@example.com" hint="For email alerts and trial reminders" />
          <div className="mt-4">
            <MockInput label="Mobile number" placeholder="+91 98765 43210" hint="For SMS alerts (optional)" />
          </div>
          <div className="mt-6">
            <MockBtn className="w-full">Save & view activity</MockBtn>
          </div>
        </MockCard>

        <p className="text-center text-xs text-slate-500">
          We only use this to send your activity updates. You can change it anytime after creating an account.
        </p>
      </div>
    </MockGuestShell>
  );
}
