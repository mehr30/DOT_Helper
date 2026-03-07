/**
 * Plain-English label mapping for DOT compliance jargon.
 * Use these throughout the UI to keep things human-readable.
 * CFR codes should only appear in exported reports or as small tooltips.
 */

export const labels: Record<string, string> = {
  // Acronyms & jargon → plain English
  CDL: "Commercial Driver's License",
  MVR: "Driving Record",
  "MCS-150 Biennial Update": "Federal Business Update (every 2 years)",
  "MCS-150": "Federal Business Update",
  "BOC-3 Process Agent": "Legal Agent Designation",
  "BOC-3 Process Agent Designation": "Legal Agent Designation",
  UCR: "Annual Federal Registration",
  "Unified Carrier Registration (UCR)": "Annual Federal Registration",
  IFTA: "Fuel Tax License",
  "IFTA License": "Fuel Tax License",
  "Drug & Alcohol": "Drug & Alcohol Testing",
  DVIR: "Vehicle Inspection Report",
  ELD: "Electronic Logbook (ELD)",
  "Clearinghouse Query": "Drug Testing Database Check",
  "Clearinghouse Consent": "Drug Testing Authorization",
  HOS: "Driver Hours",
  "Hours of Service": "Driver Hours",

  // HOS statuses
  "Sleeper Berth": "Resting",
  Sleeper: "Resting",
  "70-Hr Cycle Left": "Weekly Hours Remaining",
  "70-Hr": "Weekly Hours",

  // Navigation & headings
  Dashboard: "Home",
  "Compliance Dashboard": "Home",
  "Pending Actions": "To-Do Items",

  // Compliance categories → friendly names
  "Driver Qualification": "Driver Records",
  "Company & Authority": "Business Filings",
  "Safety Program": "Safety & Training",

  // Form labels
  "Annual MVR Review": "Annual Driving Record Review",
  "MVR on File": "Driving Record on File",

  // Compliance badges
  "Action Needed": "Needs Attention",
};

/**
 * Replace a label with its plain-English version.
 * Falls back to the original string if no mapping exists.
 */
export function humanize(text: string): string {
  return labels[text] ?? text;
}

/**
 * Hide CFR regulation codes from user-facing text.
 * Returns just the descriptive label or a tooltip-friendly format.
 *
 * Example:
 *   humanizeRegulation("49 CFR 391.11") → "Driver Qualifications"
 *   humanizeRegulation("49 CFR 396.17") → "Vehicle Inspections"
 */
export function humanizeRegulation(cfr: string): string {
  const map: Record<string, string> = {
    "49 CFR 391.11": "Driver Qualifications",
    "49 CFR 391.21": "Employment Records",
    "49 CFR 391.25": "Driving Records",
    "49 CFR 391.43": "Medical Requirements",
    "49 CFR 382.301": "Drug Testing",
    "49 CFR 382.701": "Clearinghouse",
    "49 CFR 382.703": "Clearinghouse Consent",
    "49 CFR 396.17": "Vehicle Inspections",
    "49 CFR 396.3": "Vehicle Maintenance",
    "49 CFR 365": "Operating Authority",
    "49 CFR 366": "Process Agent",
    "49 CFR 367": "Carrier Registration",
    "49 CFR 387": "Insurance Requirements",
    "49 CFR 390.19": "Federal Business Update",
    "49 CFR 391": "Driver Requirements",
    "49 CFR 396": "Vehicle Requirements",
    "49 CFR 382": "Drug & Alcohol",
    "IFTA Agreement": "Fuel Tax",
    "State Law": "State Requirement",
  };
  return map[cfr] ?? cfr;
}
