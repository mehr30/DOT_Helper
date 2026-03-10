// DOT Compliance Form Definitions
// Each form contains sections, fields, validation rules, and help text

export interface FormField {
    id: string;
    label: string;
    type: "text" | "date" | "select" | "checkbox" | "textarea" | "email" | "tel" | "number" | "ssn" | "signature";
    placeholder?: string;
    helpText?: string;
    required?: boolean;
    options?: { value: string; label: string }[];
    halfWidth?: boolean;
}

export interface FormSection {
    id: string;
    title: string;
    description?: string;
    fields: FormField[];
}

export interface DOTForm {
    id: string;
    title: string;
    shortTitle: string;
    cfrReference: string;
    category: "driver" | "vehicle" | "company" | "safety";
    description: string;
    estimatedTime: string;
    sections: FormSection[];
    /** Instructions shown after saving — tells the user what to do with this form next */
    filingInstructions?: string;
    /** External URL where this form needs to be filed (if applicable) */
    filingUrl?: string;
    /** Label for the filing URL link */
    filingUrlLabel?: string;
}

// ─── Assessment Questions ────────────────────────────────────────

export interface AssessmentQuestion {
    id: string;
    question: string;
    description: string;
    type: "single" | "multi" | "number";
    options?: { value: string; label: string; icon?: string }[];
}

export const assessmentQuestions: AssessmentQuestion[] = [
    {
        id: "businessType",
        question: "What type of business do you operate?",
        description: "This determines which DOT requirements apply to you",
        type: "single",
        options: [
            { value: "trucking", label: "Trucking / Freight", icon: "🚛" },
            { value: "hvac", label: "HVAC / Heating & Cooling", icon: "❄️" },
            { value: "plumbing", label: "Plumbing", icon: "🔧" },
            { value: "electrical", label: "Electrical", icon: "⚡" },
            { value: "landscaping", label: "Landscaping / Lawn Care", icon: "🌿" },
            { value: "construction", label: "Construction / General Contractor", icon: "🏗️" },
            { value: "pest", label: "Pest Control", icon: "🐛" },
            { value: "moving", label: "Moving / Delivery", icon: "📦" },
            { value: "other", label: "Other Service Business", icon: "🏢" },
        ],
    },
    {
        id: "vehicleWeight",
        question: "What's the heaviest vehicle in your fleet (GVWR)?",
        description: "GVWR means Gross Vehicle Weight Rating — the max weight your vehicle is designed for. Check the sticker inside the driver's side door.",
        type: "single",
        options: [
            { value: "under10k", label: "Under 10,001 lbs", icon: "🚗" },
            { value: "10k-26k", label: "10,001 – 26,000 lbs (DOT rules apply, no CDL needed)", icon: "🚐" },
            { value: "over26k", label: "Over 26,001 lbs (CDL required)", icon: "🚛" },
            { value: "unsure", label: "Not sure", icon: "❓" },
        ],
    },
    {
        id: "towsTrailer",
        question: "Do any of your vehicles tow trailers?",
        description: "Important: The DOT counts your truck's GVWR + your trailer's GVWR as the combined weight (GCWR). For example, a pickup rated at 7,000 lbs pulling a trailer rated at 5,000 lbs = 12,000 lbs combined — that puts you over the 10,001 lb DOT threshold, even if neither vehicle is heavy on its own.",
        type: "single",
        options: [
            { value: "noTrailer", label: "No trailers", icon: "🚐" },
            { value: "lightTrailer", label: "Yes, combined weight still under 10,001 lbs", icon: "🏋️" },
            { value: "medTrailer", label: "Yes, combined weight 10,001 – 26,000 lbs", icon: "⚖️" },
            { value: "heavyTrailer", label: "Yes, combined weight over 26,000 lbs", icon: "🚛" },
            { value: "unsureTrailer", label: "Not sure of combined weight", icon: "❓" },
        ],
    },
    {
        id: "crewTransport",
        question: "Do any of your vehicles carry crew members or employees to job sites?",
        description: "This is critical — if a crew leader drives employees in a van or truck with 9+ seats, special license requirements may apply, even if you're just going to a job site and back.",
        type: "single",
        options: [
            { value: "noCrew", label: "No — drivers go alone or take personal vehicles", icon: "👤" },
            { value: "smallCrew", label: "Yes, but 8 or fewer people total (driver included)", icon: "👥" },
            { value: "medCrew", label: "Yes, 9–15 people total (driver included)", icon: "🚐" },
            { value: "largeCrew", label: "Yes, 16+ people total (driver included)", icon: "🚌" },
        ],
    },
    {
        id: "state",
        question: "What state is your business based in?",
        description: "State regulations vary significantly. Some states have stricter weight thresholds or additional requirements.",
        type: "single",
        options: [
            { value: "AL", label: "Alabama" }, { value: "AK", label: "Alaska" },
            { value: "AZ", label: "Arizona" }, { value: "AR", label: "Arkansas" },
            { value: "CA", label: "California" }, { value: "CO", label: "Colorado" },
            { value: "CT", label: "Connecticut" }, { value: "DE", label: "Delaware" },
            { value: "FL", label: "Florida" }, { value: "GA", label: "Georgia" },
            { value: "HI", label: "Hawaii" }, { value: "ID", label: "Idaho" },
            { value: "IL", label: "Illinois" }, { value: "IN", label: "Indiana" },
            { value: "IA", label: "Iowa" }, { value: "KS", label: "Kansas" },
            { value: "KY", label: "Kentucky" }, { value: "LA", label: "Louisiana" },
            { value: "ME", label: "Maine" }, { value: "MD", label: "Maryland" },
            { value: "MA", label: "Massachusetts" }, { value: "MI", label: "Michigan" },
            { value: "MN", label: "Minnesota" }, { value: "MS", label: "Mississippi" },
            { value: "MO", label: "Missouri" }, { value: "MT", label: "Montana" },
            { value: "NE", label: "Nebraska" }, { value: "NV", label: "Nevada" },
            { value: "NH", label: "New Hampshire" }, { value: "NJ", label: "New Jersey" },
            { value: "NM", label: "New Mexico" }, { value: "NY", label: "New York" },
            { value: "NC", label: "North Carolina" }, { value: "ND", label: "North Dakota" },
            { value: "OH", label: "Ohio" }, { value: "OK", label: "Oklahoma" },
            { value: "OR", label: "Oregon" }, { value: "PA", label: "Pennsylvania" },
            { value: "RI", label: "Rhode Island" }, { value: "SC", label: "South Carolina" },
            { value: "SD", label: "South Dakota" }, { value: "TN", label: "Tennessee" },
            { value: "TX", label: "Texas" }, { value: "UT", label: "Utah" },
            { value: "VT", label: "Vermont" }, { value: "VA", label: "Virginia" },
            { value: "WA", label: "Washington" }, { value: "WV", label: "West Virginia" },
            { value: "WI", label: "Wisconsin" }, { value: "WY", label: "Wyoming" },
            { value: "DC", label: "Washington D.C." },
        ],
    },
    {
        id: "operations",
        question: "Do your vehicles cross state lines?",
        description: "If any of your vehicles ever cross into another state — even occasionally — that counts as interstate commerce and triggers federal DOT regulations.",
        type: "single",
        options: [
            { value: "interstate", label: "Yes, we cross state lines", icon: "🗺️" },
            { value: "intrastate", label: "No — we stay within one state", icon: "📍" },
            { value: "both", label: "Sometimes — mostly one state but occasionally cross", icon: "🔄" },
        ],
    },
    {
        id: "fleetSize",
        question: "How many commercial vehicles do you operate?",
        description: "Count all vehicles used for business that are over 10,001 lbs (by themselves or with a trailer). Include vans, trucks, and any vehicle with a USDOT number.",
        type: "single",
        options: [
            { value: "1-5", label: "1–5 vehicles", icon: "1️⃣" },
            { value: "6-15", label: "6–15 vehicles", icon: "🔢" },
            { value: "16-50", label: "16–50 vehicles", icon: "📊" },
            { value: "50+", label: "50+ vehicles", icon: "🏭" },
        ],
    },
    {
        id: "hazmat",
        question: "Do any of these apply to your operations?",
        description: "Select all that apply — these trigger additional compliance requirements. Note: fuel inside your equipment (skid steers, excavators, generators, etc.) does not count as hazardous materials.",
        type: "multi",
        options: [
            { value: "hazmat", label: "Transport hazardous materials (chemicals, propane, etc.)", icon: "☢️" },
            { value: "cdlDrivers", label: "Any driver has a CDL — even just one (triggers drug testing and other requirements)", icon: "🪪" },
            { value: "crossBorder", label: "Cross international borders (Canada/Mexico)", icon: "🌎" },
            { value: "none", label: "None of the above", icon: "✅" },
        ],
    },
];

// ─── State-Specific Regulation Data ──────────────────────────────

export interface StateRegInfo {
    state: string;
    requiresIntrastateDOT: boolean;
    weightThreshold: number; // lbs for intrastate DOT
    passengerNotes: string;
    specialNotes: string[];
}

export const stateRegulations: Record<string, StateRegInfo> = {
    AL: { state: "Alabama", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal 16+ passenger CDL rule", specialNotes: [] },
    AK: { state: "Alaska", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal 16+ passenger CDL rule", specialNotes: ["Seasonal weight restrictions on many roads"] },
    AZ: { state: "Arizona", requiresIntrastateDOT: true, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: ["State requires own ADOT number for intrastate"] },
    AR: { state: "Arkansas", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: [] },
    CA: { state: "California", requiresIntrastateDOT: true, weightThreshold: 10001, passengerNotes: "CA requires BIT inspections for ALL fleets", specialNotes: ["Must register with CA MCP (Motor Carrier Permit)", "BIT (Basic Inspection of Terminal) program applies to all intrastate carriers", "CARB compliance for diesel vehicles", "Stricter emissions and idling rules"] },
    CO: { state: "Colorado", requiresIntrastateDOT: true, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: ["Intrastate USDOT number required", "CO PUC authority may be needed"] },
    CT: { state: "Connecticut", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: [] },
    DE: { state: "Delaware", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: [] },
    FL: { state: "Florida", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: ["Intrastate commercial vehicles must comply with FHP regulations"] },
    GA: { state: "Georgia", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: ["GA PSC registration may be required for for-hire carriers"] },
    HI: { state: "Hawaii", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: ["No interstate commerce (islands) — state rules dominate"] },
    ID: { state: "Idaho", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: [] },
    IL: { state: "Illinois", requiresIntrastateDOT: true, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: ["State requires USDOT for intrastate vehicles over 10,001 lbs"] },
    IN: { state: "Indiana", requiresIntrastateDOT: true, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: ["Must comply with Indiana Motor Carrier regulations"] },
    IA: { state: "Iowa", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: [] },
    KS: { state: "Kansas", requiresIntrastateDOT: true, weightThreshold: 10001, passengerNotes: "KHP enforces passenger transport rules strictly. If a crew vehicle is designed for 16+ passengers (including driver), a CDL with P endorsement is required — even for transporting your own employees.", specialNotes: ["Kansas Highway Patrol actively enforces DOT rules on service vehicles", "Crew transport in passenger-capacity vehicles requires proper licensing", "KCC authority may be needed for for-hire operations"] },
    KY: { state: "Kentucky", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: [] },
    LA: { state: "Louisiana", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: [] },
    ME: { state: "Maine", requiresIntrastateDOT: true, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: ["State requires intrastate USDOT"] },
    MD: { state: "Maryland", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: [] },
    MA: { state: "Massachusetts", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: [] },
    MI: { state: "Michigan", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: ["Michigan has unique axle weight rules"] },
    MN: { state: "Minnesota", requiresIntrastateDOT: true, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: ["MN requires intrastate USDOT for vehicles over 10,001 lbs"] },
    MS: { state: "Mississippi", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: [] },
    MO: { state: "Missouri", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: [] },
    MT: { state: "Montana", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: [] },
    NE: { state: "Nebraska", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: [] },
    NV: { state: "Nevada", requiresIntrastateDOT: true, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: ["NV requires intrastate USDOT"] },
    NH: { state: "New Hampshire", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: [] },
    NJ: { state: "New Jersey", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: [] },
    NM: { state: "New Mexico", requiresIntrastateDOT: true, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: ["NM requires USDOT for intrastate carriers"] },
    NY: { state: "New York", requiresIntrastateDOT: true, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: ["NY requires USDOT for intrastate carriers", "NYC has additional commercial vehicle restrictions"] },
    NC: { state: "North Carolina", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: [] },
    ND: { state: "North Dakota", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: [] },
    OH: { state: "Ohio", requiresIntrastateDOT: true, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: ["OH PUCO registration may be required"] },
    OK: { state: "Oklahoma", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: [] },
    OR: { state: "Oregon", requiresIntrastateDOT: true, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: ["Oregon requires weight-mile tax for vehicles over 26,001 lbs", "Must register with ODOT"] },
    PA: { state: "Pennsylvania", requiresIntrastateDOT: true, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: ["PA requires intrastate USDOT"] },
    RI: { state: "Rhode Island", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: [] },
    SC: { state: "South Carolina", requiresIntrastateDOT: true, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: ["SC requires intrastate USDOT"] },
    SD: { state: "South Dakota", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: [] },
    TN: { state: "Tennessee", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: [] },
    TX: { state: "Texas", requiresIntrastateDOT: true, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: ["TX requires USDOT and TxDMV registration for intrastate hauling", "Texas has its own drug testing random rate requirements"] },
    UT: { state: "Utah", requiresIntrastateDOT: true, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: ["UT requires intrastate USDOT"] },
    VT: { state: "Vermont", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: [] },
    VA: { state: "Virginia", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: [] },
    WA: { state: "Washington", requiresIntrastateDOT: true, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: ["WUTC registration may be required", "WA has strict logging truck regulations"] },
    WV: { state: "West Virginia", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: [] },
    WI: { state: "Wisconsin", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: [] },
    WY: { state: "Wyoming", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: [] },
    DC: { state: "Washington D.C.", requiresIntrastateDOT: false, weightThreshold: 10001, passengerNotes: "Follows federal rules", specialNotes: ["Strict commercial vehicle restrictions in DC"] },
};

// ─── Shared Options ─────────────────────────────────────────────

export const US_STATE_OPTIONS = [
    { value: "", label: "Select state..." },
    { value: "AL", label: "Alabama" }, { value: "AK", label: "Alaska" },
    { value: "AZ", label: "Arizona" }, { value: "AR", label: "Arkansas" },
    { value: "CA", label: "California" }, { value: "CO", label: "Colorado" },
    { value: "CT", label: "Connecticut" }, { value: "DE", label: "Delaware" },
    { value: "FL", label: "Florida" }, { value: "GA", label: "Georgia" },
    { value: "HI", label: "Hawaii" }, { value: "ID", label: "Idaho" },
    { value: "IL", label: "Illinois" }, { value: "IN", label: "Indiana" },
    { value: "IA", label: "Iowa" }, { value: "KS", label: "Kansas" },
    { value: "KY", label: "Kentucky" }, { value: "LA", label: "Louisiana" },
    { value: "ME", label: "Maine" }, { value: "MD", label: "Maryland" },
    { value: "MA", label: "Massachusetts" }, { value: "MI", label: "Michigan" },
    { value: "MN", label: "Minnesota" }, { value: "MS", label: "Mississippi" },
    { value: "MO", label: "Missouri" }, { value: "MT", label: "Montana" },
    { value: "NE", label: "Nebraska" }, { value: "NV", label: "Nevada" },
    { value: "NH", label: "New Hampshire" }, { value: "NJ", label: "New Jersey" },
    { value: "NM", label: "New Mexico" }, { value: "NY", label: "New York" },
    { value: "NC", label: "North Carolina" }, { value: "ND", label: "North Dakota" },
    { value: "OH", label: "Ohio" }, { value: "OK", label: "Oklahoma" },
    { value: "OR", label: "Oregon" }, { value: "PA", label: "Pennsylvania" },
    { value: "RI", label: "Rhode Island" }, { value: "SC", label: "South Carolina" },
    { value: "SD", label: "South Dakota" }, { value: "TN", label: "Tennessee" },
    { value: "TX", label: "Texas" }, { value: "UT", label: "Utah" },
    { value: "VT", label: "Vermont" }, { value: "VA", label: "Virginia" },
    { value: "WA", label: "Washington" }, { value: "WV", label: "West Virginia" },
    { value: "WI", label: "Wisconsin" }, { value: "WY", label: "Wyoming" },
    { value: "DC", label: "Washington D.C." },
];

// ─── Form Definitions ────────────────────────────────────────────

export const dotForms: DOTForm[] = [
    {
        id: "mcs150",
        title: "Federal Business Update (MCS-150)",
        shortTitle: "Federal Business Update",
        cfrReference: "49 CFR §390.19",
        category: "company",
        description: "Every 2 years, you must update your business info with the federal government. Fill this out here, then submit it on the FMCSA website (login.fmcsa.dot.gov) or mail it in. We'll help you prepare the information — you just need to file it.",
        estimatedTime: "15 min",
        filingInstructions: "You've prepared your MCS-150 information. Now you need to file it with FMCSA. You can do this online (fastest) or by mail:\n\n1. Go to the FMCSA portal and log in with your USDOT PIN\n2. Select \"Update MCS-150\" from the menu\n3. Enter the information you prepared here\n4. Submit — you'll get a confirmation number\n\nIf you don't have your PIN, call FMCSA at 1-800-832-5660 to request one. Keep a copy of the confirmation for your records.",
        filingUrl: "https://login.fmcsa.dot.gov",
        filingUrlLabel: "Go to FMCSA Portal",
        sections: [
            {
                id: "companyInfo",
                title: "Company Information",
                fields: [
                    { id: "legalName", label: "Legal Business Name", type: "text", required: true, placeholder: "As registered with FMCSA" },
                    { id: "dba", label: "DBA Name (if different)", type: "text", placeholder: "Doing business as" },
                    { id: "usdotNumber", label: "USDOT Number", type: "text", required: true, placeholder: "e.g., 1234567" },
                    { id: "ein", label: "EIN / Tax ID", type: "text", required: true, placeholder: "XX-XXXXXXX", halfWidth: true },
                    {
                        id: "entityType", label: "Entity Type", type: "select", required: true, options: [
                            { value: "", label: "Select..." },
                            { value: "individual", label: "Individual" },
                            { value: "partnership", label: "Partnership" },
                            { value: "corporation", label: "Corporation" },
                            { value: "llc", label: "LLC" },
                            { value: "other", label: "Other" },
                        ], halfWidth: true
                    },
                ],
            },
            {
                id: "address",
                title: "Principal Business Address",
                fields: [
                    { id: "street", label: "Street Address", type: "text", required: true },
                    { id: "city", label: "City", type: "text", required: true, halfWidth: true },
                    { id: "state", label: "State", type: "select", required: true, halfWidth: true, options: US_STATE_OPTIONS },
                    { id: "zip", label: "ZIP Code", type: "text", required: true, halfWidth: true },
                    { id: "phone", label: "Phone", type: "tel", required: true, halfWidth: true },
                    { id: "email", label: "Email", type: "email", required: true },
                ],
            },
            {
                id: "operations",
                title: "Operations Information",
                fields: [
                    {
                        id: "operationType", label: "Operation Classification", type: "select", required: true,
                        helpText: "For-Hire = you haul other people's goods/passengers for pay. Private = you only haul your own company's goods or employees. Exempt = agricultural or other federally exempt hauling.",
                        options: [
                            { value: "", label: "Select..." },
                            { value: "authCarrier", label: "For-Hire (you haul for customers)" },
                            { value: "exemptCarrier", label: "For-Hire Exempt (farm/ag hauling)" },
                            { value: "privateProperty", label: "Private — hauling your own goods" },
                            { value: "privatePassenger", label: "Private — transporting your own employees" },
                        ]
                    },
                    { id: "cargoTypes", label: "Types of Cargo Carried", type: "textarea", placeholder: "e.g., General freight, building materials, HVAC equipment" },
                    { id: "totalDrivers", label: "Total Number of Drivers", type: "number", required: true, halfWidth: true },
                    { id: "totalVehicles", label: "Total Vehicles (trucks, trailers, vans)", type: "number", required: true, halfWidth: true, helpText: "Count every commercial vehicle your company operates, including trailers" },
                    { id: "interstate", label: "Do you operate across state lines?", type: "checkbox" },
                ],
            },
        ],
    },
    {
        id: "driverApp",
        title: "Driver Employment Application",
        shortTitle: "Driver Application (391.21)",
        cfrReference: "49 CFR §391.21",
        category: "driver",
        description: "Required for every driver of a commercial motor vehicle. Must be filled out before employment and kept on file for the duration of employment plus 3 years.",
        estimatedTime: "20 min",
        sections: [
            {
                id: "personalInfo",
                title: "Applicant Information",
                fields: [
                    { id: "firstName", label: "First Name", type: "text", required: true, halfWidth: true },
                    { id: "lastName", label: "Last Name", type: "text", required: true, halfWidth: true },
                    { id: "middleName", label: "Middle Name", type: "text", halfWidth: true },
                    { id: "dob", label: "Date of Birth", type: "date", required: true, halfWidth: true },
                    { id: "ssn", label: "Social Security Number", type: "ssn", required: true, helpText: "Stored securely — required per FMCSA regulations" },
                    { id: "phone", label: "Phone Number", type: "tel", required: true, halfWidth: true },
                    { id: "email", label: "Email Address", type: "email", halfWidth: true },
                ],
            },
            {
                id: "address",
                title: "Current Address",
                description: "List all addresses for the past 3 years",
                fields: [
                    { id: "street", label: "Street Address", type: "text", required: true },
                    { id: "city", label: "City", type: "text", required: true, halfWidth: true },
                    { id: "state", label: "State", type: "select", required: true, halfWidth: true, options: US_STATE_OPTIONS },
                    { id: "zip", label: "ZIP Code", type: "text", required: true, halfWidth: true },
                    { id: "yearsAtAddress", label: "Years at Address", type: "number", required: true, halfWidth: true },
                ],
            },
            {
                id: "prevAddress",
                title: "Previous Address (if less than 3 years at current)",
                description: "FMCSA requires address history for the past 3 years. Add your previous address if you've been at your current one for less than 3 years.",
                fields: [
                    { id: "prevStreet", label: "Previous Street Address", type: "text" },
                    { id: "prevCity", label: "City", type: "text", halfWidth: true },
                    { id: "prevState", label: "State", type: "select", halfWidth: true, options: US_STATE_OPTIONS },
                    { id: "prevZip", label: "ZIP Code", type: "text", halfWidth: true },
                    { id: "prevYearsAtAddress", label: "Years at This Address", type: "number", halfWidth: true },
                ],
            },
            {
                id: "prevAddress2",
                title: "Additional Previous Address (if needed)",
                description: "If you still haven't covered 3 years of address history, add another previous address.",
                fields: [
                    { id: "prev2Street", label: "Street Address", type: "text" },
                    { id: "prev2City", label: "City", type: "text", halfWidth: true },
                    { id: "prev2State", label: "State", type: "select", halfWidth: true, options: US_STATE_OPTIONS },
                    { id: "prev2Zip", label: "ZIP Code", type: "text", halfWidth: true },
                    { id: "prev2YearsAtAddress", label: "Years at This Address", type: "number", halfWidth: true },
                ],
            },
            {
                id: "license",
                title: "License Information",
                fields: [
                    { id: "licenseNumber", label: "Driver's License Number", type: "text", required: true },
                    { id: "licenseState", label: "Issuing State", type: "select", required: true, halfWidth: true, options: US_STATE_OPTIONS },
                    {
                        id: "licenseClass", label: "License Class", type: "select", required: true, halfWidth: true, options: [
                            { value: "", label: "Select..." },
                            { value: "A", label: "Class A (CDL)" },
                            { value: "B", label: "Class B (CDL)" },
                            { value: "C", label: "Class C" },
                            { value: "D", label: "Class D (Standard)" },
                        ]
                    },
                    { id: "licenseExpiry", label: "Expiration Date", type: "date", required: true },
                    { id: "endorsements", label: "Endorsements", type: "text", placeholder: "e.g., H, N, P, T, X" },
                    { id: "restrictions", label: "Restrictions", type: "text", placeholder: "Any restrictions on license" },
                ],
            },
            {
                id: "experience",
                title: "Driving Experience",
                fields: [
                    { id: "yearsExperience", label: "Years of CMV Driving Experience", type: "number", required: true },
                    { id: "vehicleTypes", label: "Types of Equipment Operated", type: "textarea", placeholder: "e.g., Straight truck, tractor-trailer, service van, box truck" },
                    {
                        id: "accidents", label: "Any accidents in the past 3 years?", type: "select", required: true, options: [
                            { value: "", label: "Select..." },
                            { value: "none", label: "No accidents" },
                            { value: "1", label: "1 accident" },
                            { value: "2", label: "2 accidents" },
                            { value: "3plus", label: "3 or more" },
                        ]
                    },
                    {
                        id: "violations", label: "Any traffic violations in the past 3 years?", type: "select", required: true, options: [
                            { value: "", label: "Select..." },
                            { value: "none", label: "No violations" },
                            { value: "1", label: "1 violation" },
                            { value: "2", label: "2 violations" },
                            { value: "3plus", label: "3 or more" },
                        ]
                    },
                ],
            },
            {
                id: "certification",
                title: "Certification & Signature",
                fields: [
                    { id: "certify", label: "I certify that the information provided is true and complete to the best of my knowledge", type: "checkbox", required: true },
                    { id: "signDate", label: "Date", type: "date", required: true },
                    { id: "applicantSignature", label: "Applicant Signature", type: "signature", required: true },
                ],
            },
        ],
    },
    {
        id: "annualCertViolations",
        title: "Annual Certificate of Violations",
        shortTitle: "Certificate of Violations",
        cfrReference: "49 CFR §391.27",
        category: "driver",
        description: "Every driver must complete this form annually, listing all motor vehicle violations received in the previous 12 months, or certifying that none occurred.",
        estimatedTime: "5 min",
        sections: [
            {
                id: "driverInfo",
                title: "Driver Information",
                fields: [
                    { id: "driverName", label: "Driver Name", type: "text", required: true },
                    { id: "employeeId", label: "Employee ID", type: "text", halfWidth: true },
                    { id: "ssn", label: "Last 4 of SSN", type: "text", halfWidth: true, placeholder: "XXXX" },
                ],
            },
            {
                id: "certPeriod",
                title: "Certification Period",
                fields: [
                    { id: "periodStart", label: "Period Start", type: "date", required: true, halfWidth: true },
                    { id: "periodEnd", label: "Period End", type: "date", required: true, halfWidth: true },
                ],
            },
            {
                id: "violations",
                title: "Violations",
                description: "List all motor vehicle violations in the past 12 months. If none, check the box below.",
                fields: [
                    { id: "noViolations", label: "I certify that I have NOT been convicted of any motor vehicle violations during the above period", type: "checkbox" },
                    { id: "violationDetails", label: "Violation Details (if any)", type: "textarea", placeholder: "Date, location, charge, and vehicle type for each violation" },
                ],
            },
            {
                id: "signature",
                title: "Driver Signature",
                fields: [
                    { id: "signDate", label: "Date Signed", type: "date", required: true },
                    { id: "certify", label: "I certify this information is true and complete", type: "checkbox", required: true },
                    { id: "driverSignature", label: "Driver Signature", type: "signature", required: true },
                ],
            },
        ],
    },
    {
        id: "dvir",
        title: "Driver Vehicle Inspection Report (DVIR)",
        shortTitle: "DVIR — Pre/Post Trip",
        cfrReference: "49 CFR §396.11–13",
        category: "vehicle",
        description: "Required before and after each trip. Drivers must inspect and report the condition of key vehicle components. Defects must be noted and repaired.",
        estimatedTime: "10 min",
        sections: [
            {
                id: "tripInfo",
                title: "Trip Information",
                fields: [
                    { id: "driverName", label: "Driver Name", type: "text", required: true, halfWidth: true },
                    { id: "date", label: "Date", type: "date", required: true, halfWidth: true },
                    { id: "vehicle", label: "Vehicle / Unit Number", type: "text", required: true, halfWidth: true },
                    { id: "odometer", label: "Odometer Reading", type: "number", required: true, halfWidth: true },
                    {
                        id: "inspectionType", label: "Inspection Type", type: "select", required: true, options: [
                            { value: "", label: "Select..." },
                            { value: "preTrip", label: "Pre-Trip" },
                            { value: "postTrip", label: "Post-Trip" },
                        ]
                    },
                ],
            },
            {
                id: "vehicleCondition",
                title: "Vehicle Condition",
                description: "Check each area and note any defects",
                fields: [
                    { id: "airCompressor", label: "Air compressor — satisfactory", type: "checkbox" },
                    { id: "airLines", label: "Air lines — satisfactory", type: "checkbox" },
                    { id: "battery", label: "Battery — satisfactory", type: "checkbox" },
                    { id: "brakeAccessories", label: "Brake accessories — satisfactory", type: "checkbox" },
                    { id: "brakes", label: "Brakes, parking — satisfactory", type: "checkbox" },
                    { id: "clutch", label: "Clutch — satisfactory", type: "checkbox" },
                    { id: "defroster", label: "Defroster/heater — satisfactory", type: "checkbox" },
                    { id: "driveShaft", label: "Drive line — satisfactory", type: "checkbox" },
                    { id: "engine", label: "Engine — satisfactory", type: "checkbox" },
                    { id: "exhaust", label: "Exhaust — satisfactory", type: "checkbox" },
                    { id: "fluidLevels", label: "Fluid levels — satisfactory", type: "checkbox" },
                    { id: "horn", label: "Horn — satisfactory", type: "checkbox" },
                    { id: "lights", label: "Lights (all) — satisfactory", type: "checkbox" },
                    { id: "mirrors", label: "Mirrors — satisfactory", type: "checkbox" },
                    { id: "steering", label: "Steering — satisfactory", type: "checkbox" },
                    { id: "suspension", label: "Suspension — satisfactory", type: "checkbox" },
                    { id: "tires", label: "Tires — satisfactory", type: "checkbox" },
                    { id: "wheels", label: "Wheels and rims — satisfactory", type: "checkbox" },
                    { id: "windows", label: "Windows — satisfactory", type: "checkbox" },
                    { id: "windshieldWipers", label: "Windshield wipers — satisfactory", type: "checkbox" },
                    { id: "emergencyEquip", label: "Emergency equipment (triangles, fire ext.) — satisfactory", type: "checkbox" },
                ],
            },
            {
                id: "defects",
                title: "Defects Noted",
                fields: [
                    { id: "defectsNoted", label: "Describe any defects found", type: "textarea", placeholder: "Describe defect(s), location on vehicle, and severity" },
                    { id: "vehicleSafe", label: "Vehicle is safe to operate (with or without noted defects)", type: "checkbox", required: true },
                ],
            },
            {
                id: "signature",
                title: "Driver Certification",
                fields: [
                    { id: "certify", label: "I have conducted an inspection and reported all defects", type: "checkbox", required: true },
                    { id: "signDate", label: "Date/Time", type: "date", required: true },
                    { id: "driverSignature", label: "Driver Signature", type: "signature", required: true },
                ],
            },
        ],
    },
    {
        id: "accidentRegister",
        title: "Accident Register",
        shortTitle: "DOT Accident Register",
        cfrReference: "49 CFR §390.15",
        category: "safety",
        description: "Motor carriers must maintain a register of all accidents involving their vehicles for 3 years. A DOT-recordable accident involves a fatality, bodily injury requiring medical treatment, or disabling vehicle damage.",
        estimatedTime: "10 min",
        sections: [
            {
                id: "accidentInfo",
                title: "Accident Information",
                fields: [
                    { id: "accidentDate", label: "Date of Accident", type: "date", required: true, halfWidth: true },
                    { id: "accidentTime", label: "Approximate Time", type: "text", required: true, halfWidth: true, placeholder: "e.g., 2:30 PM" },
                    { id: "location", label: "Location (City, State, Highway)", type: "text", required: true },
                    { id: "driverName", label: "Driver Name", type: "text", required: true },
                ],
            },
            {
                id: "vehicleInfo",
                title: "Vehicle Information",
                fields: [
                    { id: "vehicleUnit", label: "Vehicle/Unit Number", type: "text", required: true, halfWidth: true },
                    { id: "vehicleYear", label: "Vehicle Year", type: "text", halfWidth: true },
                    { id: "vehicleMake", label: "Vehicle Make/Model", type: "text" },
                ],
            },
            {
                id: "details",
                title: "Accident Details",
                fields: [
                    { id: "fatalities", label: "Number of Fatalities", type: "number", required: true, halfWidth: true },
                    { id: "injuries", label: "Number of Injuries", type: "number", required: true, halfWidth: true },
                    { id: "hazmatSpill", label: "Hazardous materials release?", type: "checkbox" },
                    { id: "towAway", label: "Vehicle towed from scene?", type: "checkbox" },
                    { id: "description", label: "Brief Description", type: "textarea", required: true, placeholder: "Describe the accident circumstances" },
                ],
            },
        ],
    },
    {
        id: "drugAlcoholPolicy",
        title: "Drug & Alcohol Policy Acknowledgment",
        shortTitle: "D&A Policy Acknowledgment",
        cfrReference: "49 CFR §382.601",
        category: "safety",
        description: "Every driver must receive a copy of the company's drug and alcohol policy and sign an acknowledgment. Must be completed before operating a CMV.",
        estimatedTime: "5 min",
        sections: [
            {
                id: "employeeInfo",
                title: "Employee Information",
                fields: [
                    { id: "employeeName", label: "Employee Name", type: "text", required: true },
                    { id: "employeeId", label: "Employee ID", type: "text", halfWidth: true },
                    { id: "position", label: "Position/Title", type: "text", halfWidth: true },
                    { id: "hireDate", label: "Date of Hire", type: "date", required: true },
                ],
            },
            {
                id: "acknowledgments",
                title: "Acknowledgments",
                description: "By checking each box, the employee confirms the following:",
                fields: [
                    { id: "receivedPolicy", label: "I have received a copy of the company's drug and alcohol testing policy", type: "checkbox", required: true },
                    { id: "understoodPolicy", label: "I understand the requirements of 49 CFR Part 382 regarding prohibited drug and alcohol use", type: "checkbox", required: true },
                    { id: "consentToTest", label: "I consent to pre-employment, random, reasonable suspicion, post-accident, return-to-duty, and follow-up testing as required", type: "checkbox", required: true },
                    { id: "understandConsequences", label: "I understand the consequences of violating the drug and alcohol policy, including removal from safety-sensitive functions", type: "checkbox", required: true },
                    { id: "receivedEducation", label: "I have received educational materials about drug and alcohol abuse and available assistance resources", type: "checkbox", required: true },
                ],
            },
            {
                id: "signature",
                title: "Employee Signature",
                fields: [
                    { id: "signDate", label: "Date Signed", type: "date", required: true },
                    { id: "certify", label: "I certify I have read and understand the above acknowledgments", type: "checkbox", required: true },
                    { id: "employeeSignature", label: "Employee Signature", type: "signature", required: true },
                ],
            },
        ],
    },
    {
        id: "roadTestCert",
        title: "Road Test Certificate",
        shortTitle: "Road Test Certificate (391.31)",
        cfrReference: "49 CFR §391.31",
        category: "driver",
        description: "A motor carrier shall not require or permit a person to drive a commercial motor vehicle unless that person has successfully completed a road test and has been issued a certificate.",
        estimatedTime: "10 min",
        sections: [
            {
                id: "driverInfo",
                title: "Driver Information",
                fields: [
                    { id: "driverName", label: "Driver Name", type: "text", required: true },
                    { id: "ssn", label: "Last 4 of SSN", type: "text", halfWidth: true },
                    { id: "licenseNumber", label: "CDL/License Number", type: "text", required: true, halfWidth: true },
                    { id: "licenseState", label: "License State", type: "select", halfWidth: true, options: US_STATE_OPTIONS },
                ],
            },
            {
                id: "testDetails",
                title: "Road Test Details",
                fields: [
                    { id: "testDate", label: "Date of Road Test", type: "date", required: true },
                    { id: "vehicleType", label: "Type of Vehicle Used", type: "text", required: true, placeholder: "e.g., Straight truck, service van, tractor-trailer" },
                    { id: "preTrip", label: "Pre-trip inspection performed satisfactorily", type: "checkbox", required: true },
                    { id: "coupling", label: "Coupling/uncoupling (if applicable) — satisfactory", type: "checkbox" },
                    { id: "placingInMotion", label: "Placing vehicle in motion — satisfactory", type: "checkbox", required: true },
                    { id: "turningRight", label: "Right and left turns — satisfactory", type: "checkbox", required: true },
                    { id: "backing", label: "Backing — satisfactory", type: "checkbox", required: true },
                    { id: "braking", label: "Braking/slowing — satisfactory", type: "checkbox", required: true },
                    { id: "parking", label: "Parking — satisfactory", type: "checkbox", required: true },
                ],
            },
            {
                id: "certification",
                title: "Examiner Certification",
                fields: [
                    { id: "examinerName", label: "Examiner Name", type: "text", required: true },
                    { id: "examinerTitle", label: "Examiner Title", type: "text", required: true },
                    { id: "passed", label: "Driver has passed the road test and is qualified to operate the type of vehicle tested", type: "checkbox", required: true },
                    { id: "certDate", label: "Date of Certification", type: "date", required: true },
                    { id: "examinerSignature", label: "Examiner Signature", type: "signature", required: true },
                ],
            },
        ],
    },
    {
        id: "annualMVRReview",
        title: "Annual Review of Driving Record",
        shortTitle: "Annual MVR Review",
        cfrReference: "49 CFR §391.25",
        category: "driver",
        description: "Every year you must pull each driver's MVR (their official driving record from the state DMV) and check it for problems. This form walks you through exactly what to look for — just check each box as you go.",
        estimatedTime: "5 min",
        sections: [
            {
                id: "driverInfo",
                title: "Driver Information",
                fields: [
                    { id: "driverName", label: "Driver Name", type: "text", required: true },
                    { id: "licenseNumber", label: "CDL/License Number", type: "text", required: true, halfWidth: true },
                    { id: "licenseState", label: "License State", type: "select", required: true, halfWidth: true, options: US_STATE_OPTIONS },
                ],
            },
            {
                id: "mvrSource",
                title: "Where Did You Get the MVR?",
                description: "An MVR (Motor Vehicle Record) is your driver's official driving history from the state. You can order one from your state's DMV website — usually $5-15 and takes minutes. Search for \"[your state] DMV driving record request\" or try services like DMV.org, BackgroundChecks.com, or SambaSafety that pull MVRs from all 50 states.",
                fields: [
                    { id: "reviewDate", label: "Today's Date (Date of This Review)", type: "date", required: true, halfWidth: true },
                    { id: "mvrObtainedDate", label: "Date You Pulled the MVR", type: "date", required: true, halfWidth: true, helpText: "When did you actually order/download the MVR from the DMV?" },
                ],
            },
            {
                id: "disqualifying",
                title: "Check the MVR for These Red Flags",
                description: "Go through the MVR line by line. Check each box ONLY if that item is clear. If you find a problem, leave that box unchecked — you'll document it in the Determination section below.",
                fields: [
                    { id: "noDUI", label: "Clear — No DUI / DWI on the MVR", type: "checkbox", helpText: "Look for: DUI, DWI, OUI, OWI, or any alcohol/drug-related driving charge. For commercial drivers, the legal limit is 0.04% BAC (half the normal limit)." },
                    { id: "noHitAndRun", label: "Clear — No hit-and-run or leaving the scene of an accident", type: "checkbox", helpText: "Look for: \"leaving the scene,\" \"hit and run,\" or \"failure to stop after accident.\"" },
                    { id: "noFelony", label: "Clear — No felony involving a motor vehicle", type: "checkbox", helpText: "Look for any felony conviction that involved driving — vehicular manslaughter, using a vehicle in a crime, etc." },
                    { id: "noSuspension", label: "Clear — License is valid (not suspended, revoked, or canceled)", type: "checkbox", helpText: "The MVR status section should say \"VALID\" or \"ACTIVE.\" If it says suspended, revoked, or canceled — leave unchecked." },
                    { id: "noFatality", label: "Clear — No fatality caused by negligent driving", type: "checkbox", helpText: "Look for any charge related to causing a death while operating a vehicle." },
                    { id: "noMultipleSerious", label: "Clear — No two or more serious violations in the past 3 years", type: "checkbox", helpText: "\"Serious\" means: speeding 15+ mph over the limit, reckless driving, improper/erratic lane change, following too closely, texting while driving. One is okay (note it below). Two or more in 3 years = disqualifying." },
                ],
            },
            {
                id: "minorViolations",
                title: "Any Minor Violations?",
                description: "Regular speeding tickets (under 15 mph over), parking tickets, or minor infractions do NOT disqualify the driver — but you should still note them here for your records. If the MVR is totally clean, just skip this section.",
                fields: [
                    { id: "hasMinorViolations", label: "Were there any minor (non-disqualifying) violations?", type: "select", options: [
                        { value: "", label: "Select..." },
                        { value: "none", label: "No — MVR is clean, no violations at all" },
                        { value: "yes", label: "Yes — minor stuff (listed below)" },
                    ]},
                    { id: "minorViolationDetails", label: "List any minor violations", type: "textarea", placeholder: "Example:\n- Speeding 10 mph over, March 15 2025, $150 fine\n- Expired registration, Jan 2025, dismissed" },
                    { id: "correctiveAction", label: "Any corrective action? (optional)", type: "textarea", placeholder: "Example: Reminded driver about company speed policy" },
                ],
            },
            {
                id: "determination",
                title: "Your Determination",
                description: "Based on your review above, does this driver pass or fail? You MUST complete this section either way — even a failed review needs to be documented and signed.",
                fields: [
                    { id: "determination", label: "Result of this MVR review", type: "select", required: true, options: [
                        { value: "", label: "Select one..." },
                        { value: "PASS", label: "PASS — No disqualifying offenses found, driver can continue driving" },
                        { value: "FAIL", label: "FAIL — Disqualifying offense(s) found, driver must be pulled from duty" },
                    ]},
                    { id: "failureDetails", label: "What disqualifying offense was found? (required if FAIL)", type: "textarea", placeholder: "Example:\n- DWI conviction on 06/12/2024\n- License currently suspended as of 01/15/2025", helpText: "Describe exactly what you found on the MVR. Be specific — dates, charges, etc. This becomes part of the driver's file." },
                    { id: "failureAction", label: "What action did you take? (required if FAIL)", type: "textarea", placeholder: "Example:\n- Driver removed from driving duties effective today\n- Driver notified in writing of findings\n- Consulting with DOT compliance attorney on next steps", helpText: "Document what you did after discovering the issue. At minimum: remove the driver from driving duties immediately." },
                    { id: "reviewerName", label: "Your Name (Reviewer)", type: "text", required: true, halfWidth: true },
                    { id: "reviewerTitle", label: "Your Title", type: "text", required: true, halfWidth: true, placeholder: "e.g., Owner, Safety Manager, Fleet Manager" },
                    { id: "certDate", label: "Date", type: "date", required: true, halfWidth: true },
                    { id: "reviewerSignature", label: "Your Signature", type: "signature", required: true },
                ],
            },
        ],
    },
    {
        id: "vehicleMaintenance",
        title: "Vehicle Maintenance Record",
        shortTitle: "Maintenance Record",
        cfrReference: "49 CFR §396.3",
        category: "vehicle",
        description: "Every motor carrier must keep a record of all inspections, repairs, and maintenance for each vehicle. Records must be retained for 1 year and for 6 months after the vehicle leaves service.",
        estimatedTime: "10 min",
        sections: [
            {
                id: "vehicleInfo",
                title: "Vehicle Information",
                fields: [
                    { id: "unitNumber", label: "Vehicle/Unit Number", type: "text", required: true, halfWidth: true },
                    { id: "vin", label: "VIN", type: "text", required: true, halfWidth: true },
                    { id: "year", label: "Year", type: "text", halfWidth: true },
                    { id: "make", label: "Make/Model", type: "text", halfWidth: true },
                    { id: "licensePlate", label: "License Plate", type: "text", halfWidth: true },
                    { id: "odometer", label: "Current Odometer", type: "number", halfWidth: true },
                ],
            },
            {
                id: "serviceDetails",
                title: "Service / Repair Details",
                fields: [
                    { id: "serviceDate", label: "Date of Service", type: "date", required: true },
                    {
                        id: "serviceType", label: "Service Type", type: "select", required: true, options: [
                            { value: "", label: "Select..." },
                            { value: "pm", label: "Preventive Maintenance" },
                            { value: "repair", label: "Repair" },
                            { value: "inspection", label: "Inspection" },
                            { value: "tires", label: "Tires / Wheels" },
                            { value: "brakes", label: "Brakes" },
                            { value: "other", label: "Other" },
                        ]
                    },
                    { id: "description", label: "Description of Work Performed", type: "textarea", required: true },
                    { id: "partsUsed", label: "Parts Used", type: "textarea", placeholder: "List parts replaced or installed" },
                    { id: "technician", label: "Technician / Mechanic Name", type: "text", required: true },
                    { id: "shopName", label: "Shop / Facility Name", type: "text" },
                    { id: "cost", label: "Total Cost ($)", type: "number" },
                ],
            },
            {
                id: "nextService",
                title: "Next Scheduled Service",
                fields: [
                    { id: "nextServiceDate", label: "Next Service Due Date", type: "date" },
                    { id: "nextServiceMiles", label: "Next Service Due (Mileage)", type: "number" },
                    { id: "nextServiceDesc", label: "Scheduled Work", type: "text", placeholder: "e.g., Oil change, brake inspection" },
                ],
            },
        ],
    },
    {
        id: "boc3",
        title: "BOC-3 — Designation of Process Agents",
        shortTitle: "BOC-3 Process Agent",
        cfrReference: "49 CFR §366",
        category: "company",
        description: "Required for all interstate motor carriers to designate a process agent in each state where they operate, plus Washington D.C. Most carriers use a filing service.",
        estimatedTime: "5 min",
        sections: [
            {
                id: "carrierInfo",
                title: "Motor Carrier Information",
                fields: [
                    { id: "carrierName", label: "Motor Carrier Legal Name", type: "text", required: true },
                    { id: "usdotNumber", label: "USDOT Number", type: "text", required: true, halfWidth: true },
                    { id: "mcNumber", label: "MC/MX/FF Number", type: "text", halfWidth: true },
                    { id: "businessAddress", label: "Principal Business Address", type: "text", required: true },
                    { id: "city", label: "City", type: "text", required: true, halfWidth: true },
                    { id: "state", label: "State", type: "select", required: true, halfWidth: true, options: US_STATE_OPTIONS },
                    { id: "zip", label: "ZIP Code", type: "text", required: true },
                ],
            },
            {
                id: "processAgent",
                title: "Process Agent Information",
                description: "Usually a BOC-3 filing service handles this for all states",
                fields: [
                    { id: "agentName", label: "Process Agent / Filing Service Name", type: "text", required: true },
                    { id: "agentAddress", label: "Agent Address", type: "text", required: true },
                    { id: "agentPhone", label: "Agent Phone", type: "tel" },
                    { id: "filingDate", label: "Filing Date", type: "date", required: true },
                ],
            },
        ],
    },
];

// ─── Recommendation Engine ──────────────────────────────────────

export interface ComplianceResult {
    forms: DOTForm[];
    alerts: ComplianceAlert[];
    stateInfo: StateRegInfo | null;
}

export interface ComplianceAlert {
    type: "warning" | "info" | "danger";
    title: string;
    description: string;
}

export function getRecommendedForms(answers: Record<string, string | string[]>): ComplianceResult {
    const recommended: Set<string> = new Set();
    const alerts: ComplianceAlert[] = [];
    const stateInfo = stateRegulations[answers.state as string] || null;

    // Determine effective weight class (account for trailers)
    let effectiveWeight = answers.vehicleWeight as string;
    const towsTrailer = answers.towsTrailer as string;

    // If they tow a trailer, the combined weight may push them into a higher class
    if (towsTrailer === "heavyTrailer") {
        effectiveWeight = "over26k";
        alerts.push({
            type: "warning",
            title: "Combined Weight Over 26,000 lbs — CDL Required",
            description: "Your truck + trailer combined weight rating (GCWR) exceeds 26,001 lbs, which means any driver operating that combination needs a CDL. One option: if you can pair the trailer with a lighter truck so the combined GCWR stays under 26,001 lbs, a CDL wouldn't be required for that combination. The CDL requirement is based on the specific truck-trailer pairing, not just the trailer alone.",
        });
    } else if (towsTrailer === "medTrailer" && effectiveWeight === "under10k") {
        effectiveWeight = "10k-26k";
        alerts.push({
            type: "warning",
            title: "Trailer Pushes You Over the DOT Threshold",
            description: "Your vehicle alone is under 10,001 lbs, but when you add the trailer, the combined weight (called GCWR — Gross Combined Weight Rating) puts you over 10,001 lbs. This means DOT regulations apply to you. You'll need a USDOT number, medical cards for drivers, vehicle inspections, and more.",
        });
    } else if (towsTrailer === "unsureTrailer") {
        alerts.push({
            type: "info",
            title: "Check Your Combined Weight",
            description: "Add your truck's GVWR (on the driver's door sticker) + your trailer's GVWR (on the trailer's VIN plate). If the total is over 10,001 lbs, DOT regulations apply. If over 26,001 lbs, a CDL is required — but you may be able to avoid the CDL by pairing the trailer with a lighter truck to keep the combined total under 26,001 lbs.",
        });
    }

    if (answers.vehicleWeight === "unsure") {
        alerts.push({
            type: "info",
            title: "How to Find Your Vehicle's Weight Rating",
            description: "Open the driver's side door and look for a sticker or plate. It lists the GVWR (Gross Vehicle Weight Rating). Common examples: Ford F-150 = ~6,500 lbs, Ford F-350 = ~10,000-14,000 lbs, Ford E-350 Van = ~10,200 lbs. If your GVWR is 10,001+ lbs, DOT rules apply.",
        });
    }

    // Crew transport alerts
    const crewTransport = answers.crewTransport as string;
    if (crewTransport === "largeCrew") {
        alerts.push({
            type: "danger",
            title: "CDL with Passenger Endorsement Required",
            description: "Federal law requires a CDL with a Passenger (P) endorsement for any vehicle designed to carry 16+ people (including the driver). This applies to transporting your own employees to job sites — not just paid passenger services. The driver must also pass a skills test in a passenger vehicle and complete FMCSA-approved training.",
        });
        recommended.add("roadTestCert");
        recommended.add("drugAlcoholPolicy");
    } else if (crewTransport === "medCrew") {
        alerts.push({
            type: "warning",
            title: "Watch Out: 9–15 Passenger Transport Rules",
            description: "Vehicles designed to carry 9-15 passengers (including the driver) have special federal and state requirements. If used for compensation (even indirectly — like you're paying the crew leader to drive), a CDL may be required. Even without a CDL, these vehicles must comply with FMCSA safety rules, and drivers need DOT medical cards.",
        });
    }

    // State-specific alerts
    if (stateInfo) {
        if (stateInfo.requiresIntrastateDOT && (answers.operations === "intrastate")) {
            alerts.push({
                type: "info",
                title: `${stateInfo.state} Requires USDOT for Intrastate Carriers`,
                description: `Even though you only operate within ${stateInfo.state}, your state requires a USDOT number for intrastate commercial vehicles. You must register with FMCSA and display your USDOT number on all qualifying vehicles.`,
            });
        }
        if (stateInfo.passengerNotes !== "Follows federal rules" && (crewTransport === "medCrew" || crewTransport === "largeCrew")) {
            alerts.push({
                type: "warning",
                title: `${stateInfo.state} — Special Passenger Transport Rules`,
                description: stateInfo.passengerNotes,
            });
        }
        stateInfo.specialNotes
            .filter(note => {
                // Only show passenger-related notes if user transports 9+ people
                const isPassengerNote = /passenger|crew transport/i.test(note);
                if (isPassengerNote && crewTransport !== "medCrew" && crewTransport !== "largeCrew") {
                    return false;
                }
                return true;
            })
            .forEach(note => {
                alerts.push({
                    type: "info",
                    title: `${stateInfo.state} Regulation`,
                    description: note,
                });
            });
    }

    // Everyone with qualifying vehicles needs these
    if (effectiveWeight !== "under10k" || towsTrailer === "medTrailer" || towsTrailer === "heavyTrailer") {
        recommended.add("mcs150");
        recommended.add("driverApp");
        recommended.add("annualCertViolations");
        recommended.add("dvir");
        recommended.add("vehicleMaintenance");
        recommended.add("accidentRegister");
    }

    // Interstate operations need BOC-3
    if (answers.operations === "interstate" || answers.operations === "both") {
        recommended.add("boc3");
    }

    // CDL drivers need road test cert and MVR review
    const hazmatAnswers = answers.hazmat as string[] | undefined;
    if (hazmatAnswers?.includes("cdlDrivers") || effectiveWeight === "over26k") {
        recommended.add("roadTestCert");
        recommended.add("annualMVRReview");
        recommended.add("drugAlcoholPolicy");
    }

    // If truly under threshold and no trailers, give them a clean bill
    if (effectiveWeight === "under10k" && towsTrailer !== "medTrailer" && towsTrailer !== "heavyTrailer" && towsTrailer !== "unsureTrailer") {
        if (crewTransport !== "largeCrew" && crewTransport !== "medCrew") {
            alerts.push({
                type: "info",
                title: "You May Not Need Federal DOT Compliance",
                description: "Based on your answers, your vehicles are under 10,001 lbs and you don't tow heavy trailers or carry large crews. Federal DOT regulations likely don't apply to you. However, check your state's requirements — some states have additional rules. If your situation changes (heavier vehicle, new trailer, etc.), re-take this assessment.",
            });
        }
    }

    return {
        forms: dotForms.filter(f => recommended.has(f.id)),
        alerts,
        stateInfo,
    };
}
