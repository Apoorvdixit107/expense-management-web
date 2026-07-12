"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { ProductIcon } from "@/components/marketing/ProductIcon";
import {
  PRODUCT_NAV_COLUMNS,
  PRODUCT_NAV_PLATFORM,
  type ProductNavItem,
} from "@/lib/product-nav";

type MarketingHeaderProps = {
  active?: "blog" | "products" | "pricing";
};

function ProductLink({
  item,
  onNavigate,
  clampDescription = false,
}: {
  item: ProductNavItem;
  onNavigate?: () => void;
  clampDescription?: boolean;
}) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className="group flex gap-3 rounded-lg px-3 py-2.5 transition hover:bg-[#fafafa]"
    >
      <span className="mt-0.5 shrink-0 text-[#212121]">
        <ProductIcon id={item.icon} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-[#212121]">{item.title}</span>
        <span
          className={`mt-0.5 block text-[13px] leading-snug text-[#6b6b6b] ${
            clampDescription ? "line-clamp-1" : ""
          }`}
        >
          {item.description}
        </span>
      </span>
    </Link>
  );
}

function MegaPanel({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="border-t border-[#ebebeb] bg-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {PRODUCT_NAV_COLUMNS.map((group) => (
            <div key={group.id}>
              <p className="px-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#9b9b9b]">
                {group.label}
              </p>
              <div className="mt-3 space-y-0.5">
                {group.items.map((item) => (
                  <ProductLink key={item.id} item={item} onNavigate={onNavigate} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-[#ebebeb] pt-6">
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#9b9b9b]">
            {PRODUCT_NAV_PLATFORM.label}
          </p>
          <div className="mt-3 grid gap-1 sm:grid-cols-3">
            {PRODUCT_NAV_PLATFORM.items.map((item) => (
              <ProductLink key={item.id} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileProductsAccordion({ onNavigate }: { onNavigate: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button
        type="button"
        className="flex w-full items-center justify-between py-2 text-sm font-semibold text-[#212121]"
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
      >
        Products
        <Chevron open={expanded} />
      </button>
      {expanded ? (
        <div className="space-y-5 pb-2">
          {[...PRODUCT_NAV_COLUMNS, PRODUCT_NAV_PLATFORM].map((group) => (
            <div key={group.id}>
              <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9b9b9b]">
                {group.label}
              </p>
              <div className="mt-1">
                {group.items.map((item) => (
                  <ProductLink
                    key={item.id}
                    item={item}
                    onNavigate={onNavigate}
                    clampDescription
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
    >
      <path
        d="M2.5 4.5 6 8l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MarketingHeader({ active }: MarketingHeaderProps) {
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuId = useId();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearCloseTimer() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function openProducts() {
    clearCloseTimer();
    setProductsOpen(true);
  }

  function scheduleCloseProducts() {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setProductsOpen(false), 120);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setProductsOpen(false);
        setMobileOpen(false);
      }
    }
    function onPointerDown(e: MouseEvent) {
      if (!headerRef.current?.contains(e.target as Node)) {
        setProductsOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointerDown);
      clearCloseTimer();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const productsActive = active === "products" || productsOpen;

  function closeMobile() {
    setMobileOpen(false);
    setProductsOpen(false);
  }

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-[#ebebeb] bg-white/95 backdrop-blur-sm"
      onMouseLeave={scheduleCloseProducts}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4 sm:h-16 sm:gap-3 sm:px-6">
        <span className="sm:hidden">
          <Logo href="/" height={32} />
        </span>
        <span className="hidden sm:inline-block">
          <Logo href="/" height={40} />
        </span>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <div onMouseEnter={openProducts}>
            <button
              type="button"
              className={`inline-flex items-center gap-1 transition hover:text-[#212121] ${
                productsActive ? "font-semibold text-[#212121]" : "text-[#6b6b6b]"
              }`}
              aria-expanded={productsOpen}
              aria-controls={menuId}
              onClick={() => setProductsOpen((v) => !v)}
              onFocus={openProducts}
            >
              Products
              <Chevron open={productsOpen} />
            </button>
          </div>
          <Link
            href="/pricing"
            className={`transition hover:text-[#212121] ${
              active === "pricing" ? "font-semibold text-[#212121]" : "text-[#6b6b6b]"
            }`}
          >
            Pricing
          </Link>
          <Link
            href="/blog"
            className={`transition hover:text-[#212121] ${
              active === "blog" ? "font-semibold text-[#212121]" : "text-[#6b6b6b]"
            }`}
          >
            Blog
          </Link>
          <Link href="/login" className="text-[#6b6b6b] transition hover:text-[#212121]">
            Sign in
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="hidden rounded-lg border border-[#d1d1d1] px-4 py-2 text-sm font-medium text-[#212121] transition hover:bg-[#fafafa] sm:inline-flex"
          >
            Contact sales
          </Link>
          <Link
            href="/register"
            className="inline-flex rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-hover sm:px-4"
          >
            <span className="sm:hidden">Try free</span>
            <span className="hidden sm:inline">Start free trial</span>
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#d1d1d1] text-[#212121] md:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path
                  d="M5 5l10 10M15 5 5 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path
                  d="M4 6h12M4 10h12M4 14h12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {productsOpen ? (
        <div
          id={menuId}
          role="region"
          aria-label="Products"
          className="hidden shadow-[0_16px_40px_rgba(33,33,33,0.08)] md:block"
          onMouseEnter={openProducts}
        >
          <MegaPanel onNavigate={() => setProductsOpen(false)} />
        </div>
      ) : null}

      {mobileOpen ? (
        <div className="flex max-h-[calc(100dvh-3.5rem)] flex-col border-t border-[#ebebeb] bg-white md:hidden sm:max-h-[calc(100dvh-4rem)]">
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
            <MobileProductsAccordion onNavigate={closeMobile} />
            <div className="mt-4 space-y-1 border-t border-[#ebebeb] pt-4 text-sm font-medium">
              <Link
                href="/pricing"
                className="block rounded-lg px-3 py-2.5 text-[#212121] hover:bg-[#fafafa]"
                onClick={closeMobile}
              >
                Pricing
              </Link>
              <Link
                href="/blog"
                className="block rounded-lg px-3 py-2.5 text-[#212121] hover:bg-[#fafafa]"
                onClick={closeMobile}
              >
                Blog
              </Link>
              <Link
                href="/login"
                className="block rounded-lg px-3 py-2.5 text-[#212121] hover:bg-[#fafafa]"
                onClick={closeMobile}
              >
                Sign in
              </Link>
            </div>
          </div>
          <div className="sticky bottom-0 space-y-2 border-t border-[#ebebeb] bg-white px-4 py-4 sm:px-6">
            <Link
              href="/register"
              className="flex w-full items-center justify-center rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover"
              onClick={closeMobile}
            >
              Start free trial
            </Link>
            <Link
              href="/login"
              className="flex w-full items-center justify-center rounded-lg border border-[#d1d1d1] px-4 py-3 text-sm font-medium text-[#212121] transition hover:bg-[#fafafa]"
              onClick={closeMobile}
            >
              Sign in
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
