"use client";

import type { ReportDateFilter } from "@/lib/reports";

const RANGE_PRESETS = [
  { value: "LAST_7_DAYS" as const, label: "7 days" },
  { value: "LAST_30_DAYS" as const, label: "30 days" },
  { value: "MONTH" as const, label: "Monthly" },
  { value: "YEAR" as const, label: "Yearly" },
];

type ReportDateFilterProps = {
  filter: ReportDateFilter;
  onChange: (filter: ReportDateFilter) => void;
};

export function ReportDateFilter({ filter, onChange }: ReportDateFilterProps) {
  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface p-4">
      <div className="flex flex-wrap gap-2">
        {(["single", "range", "custom"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onChange({ ...filter, mode })}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              filter.mode === mode ? "bg-brand text-white" : "bg-paper text-ink hover:bg-border/40"
            }`}
          >
            {mode === "single" ? "Single date" : mode === "range" ? "Date range" : "Custom range"}
          </button>
        ))}
      </div>

      {filter.mode === "single" ? (
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-ink">Date</span>
          <input
            type="date"
            value={filter.singleDate}
            onChange={(e) => onChange({ ...filter, singleDate: e.target.value })}
            className="h-11 w-full max-w-xs rounded-xl border border-border bg-paper px-3 text-sm"
          />
        </label>
      ) : null}

      {filter.mode === "range" ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {RANGE_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => onChange({ ...filter, rangePreset: preset.value })}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  filter.rangePreset === preset.value
                    ? "bg-brand text-white"
                    : "border border-border bg-paper text-ink hover:bg-border/40"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          {filter.rangePreset === "MONTH" ? (
            <input
              type="month"
              value={filter.monthInput}
              onChange={(e) => onChange({ ...filter, monthInput: e.target.value })}
              className="h-11 rounded-xl border border-border bg-paper px-3 text-sm"
            />
          ) : null}
          {filter.rangePreset === "YEAR" ? (
            <input
              type="number"
              min={2020}
              max={2100}
              value={filter.yearInput}
              onChange={(e) => onChange({ ...filter, yearInput: Number(e.target.value) })}
              className="h-11 w-32 rounded-xl border border-border bg-paper px-3 text-sm"
            />
          ) : null}
        </div>
      ) : null}

      {filter.mode === "custom" ? (
        <div className="flex flex-wrap gap-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ink">From</span>
            <input
              type="date"
              value={filter.fromDate}
              onChange={(e) => onChange({ ...filter, fromDate: e.target.value })}
              className="h-11 rounded-xl border border-border bg-paper px-3 text-sm"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ink">To</span>
            <input
              type="date"
              value={filter.toDate}
              onChange={(e) => onChange({ ...filter, toDate: e.target.value })}
              className="h-11 rounded-xl border border-border bg-paper px-3 text-sm"
            />
          </label>
        </div>
      ) : null}
    </div>
  );
}
