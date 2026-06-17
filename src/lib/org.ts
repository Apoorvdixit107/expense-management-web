const CURRENT_ORG_KEY = "ems_current_org_id";
const REMEMBER_ORG_KEY = "ems_remember_org_choice";

export function getCurrentOrgId(): number | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(CURRENT_ORG_KEY);
  if (!raw) return null;
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}

export function setCurrentOrgId(id: number) {
  localStorage.setItem(CURRENT_ORG_KEY, String(id));
}

export function clearCurrentOrgId() {
  localStorage.removeItem(CURRENT_ORG_KEY);
}

export function getRememberOrgChoice(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(REMEMBER_ORG_KEY) === "true";
}

export function setRememberOrgChoice(remember: boolean) {
  localStorage.setItem(REMEMBER_ORG_KEY, remember ? "true" : "false");
}
