export type Role = "platform_admin" | "facility_viewer";

export function isPlatformAdmin(role: string | undefined): boolean {
  return role === "platform_admin";
}

export function isFacilityViewer(role: string | undefined): boolean {
  return role === "facility_viewer";
}

/** Check if user can access the given facility */
export function canAccessFacility(
  userRole: string,
  userFacilityId: string | null | undefined,
  targetFacilityId: string
): boolean {
  if (userRole === "platform_admin") return true;
  if (userRole === "facility_viewer" && userFacilityId === targetFacilityId) return true;
  return false;
}
