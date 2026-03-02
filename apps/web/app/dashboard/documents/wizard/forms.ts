// DOT Compliance Form Definitions
// Each form contains sections, fields, validation rules, and help text

export interface FormField {
    id: string;
    label: string;
    type: "text" | "date" | "select" | "checkbox" | "textarea" | "email" | "tel" | "number" | "ssn";
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
        description: "Gross Vehicle Weight Rating — found on the driver's door sticker",
        type: "single",
        options: [
            { value: "under10k", label: "Under 10,001 lbs", icon: "🚗" },
            { value: "10k-26k", label: "10,001 – 26,000 lbs", icon: "🚐" },
            { value: "over26k", label: "Over 26,000 lbs (CDL required)", icon: "🚛" },
            { value: "combination", label: "Combination > 26,000 lbs", icon: "🚚" },
        ],
    },
    {
        id: "operations",
        question: "What type of operations do you run?",
        description: "This affects which federal and state regulations apply",
        type: "single",
        options: [
            { value: "interstate", label: "Interstate (crosses state lines)", icon: "🗺️" },
            { value: "intrastate", label: "Intrastate only (one state)", icon: "📍" },
            { value: "both", label: "Both interstate and intrastate", icon: "🔄" },
        ],
    },
    {
        id: "fleetSize",
        question: "How many commercial vehicles do you operate?",
        description: "Include all vehicles over 10,001 lbs GVWR",
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
        question: "Which of these apply to your operations?",
        description: "Select all that apply to determine additional requirements",
        type: "multi",
        options: [
            { value: "hazmat", label: "Transport hazardous materials", icon: "☢️" },
            { value: "passengers", label: "Transport passengers (9+)", icon: "🚌" },
            { value: "cdlDrivers", label: "Drivers have CDLs", icon: "🪪" },
            { value: "crossBorder", label: "Cross international borders", icon: "🌎" },
            { value: "none", label: "None of the above", icon: "✅" },
        ],
    },
];

// ─── Form Definitions ────────────────────────────────────────────

export const dotForms: DOTForm[] = [
    {
        id: "mcs150",
        title: "MCS-150 — Motor Carrier Identification Report",
        shortTitle: "MCS-150 Biennial Update",
        cfrReference: "49 CFR §390.19",
        category: "company",
        description: "Required every 24 months for all motor carriers. Updates your USDOT registration information including address, fleet size, and operation type.",
        estimatedTime: "15 min",
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
                    { id: "state", label: "State", type: "text", required: true, halfWidth: true },
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
                        id: "operationType", label: "Operation Classification", type: "select", required: true, options: [
                            { value: "", label: "Select..." },
                            { value: "authCarrier", label: "Authorized For-Hire Carrier" },
                            { value: "exemptCarrier", label: "Exempt For-Hire Carrier" },
                            { value: "privateProperty", label: "Private (Property)" },
                            { value: "privatePassenger", label: "Private (Passengers)" },
                        ]
                    },
                    { id: "cargoTypes", label: "Types of Cargo Carried", type: "textarea", placeholder: "e.g., General freight, building materials, HVAC equipment" },
                    { id: "totalDrivers", label: "Total Number of Drivers", type: "number", required: true, halfWidth: true },
                    { id: "totalVehicles", label: "Total Power Units", type: "number", required: true, halfWidth: true },
                    { id: "interstate", label: "Interstate operations?", type: "checkbox" },
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
                    { id: "state", label: "State", type: "text", required: true, halfWidth: true },
                    { id: "zip", label: "ZIP Code", type: "text", required: true, halfWidth: true },
                    { id: "yearsAtAddress", label: "Years at Address", type: "number", required: true, halfWidth: true },
                ],
            },
            {
                id: "license",
                title: "License Information",
                fields: [
                    { id: "licenseNumber", label: "Driver's License Number", type: "text", required: true },
                    { id: "licenseState", label: "Issuing State", type: "text", required: true, halfWidth: true },
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
                title: "Certification",
                fields: [
                    { id: "certify", label: "I certify that the information provided is true and complete to the best of my knowledge", type: "checkbox", required: true },
                    { id: "signDate", label: "Date", type: "date", required: true },
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
                title: "Signature",
                fields: [
                    { id: "signDate", label: "Date Signed", type: "date", required: true },
                    { id: "certify", label: "I certify this information is true and complete", type: "checkbox", required: true },
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
                title: "Signature",
                fields: [
                    { id: "signDate", label: "Date Signed", type: "date", required: true },
                    { id: "certify", label: "I certify I have read and understand the above acknowledgments", type: "checkbox", required: true },
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
                    { id: "licenseState", label: "License State", type: "text", halfWidth: true },
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
        description: "Each motor carrier must annually review the driving record (MVR) of each driver it employs and document whether the driver meets minimum requirements.",
        estimatedTime: "5 min",
        sections: [
            {
                id: "driverInfo",
                title: "Driver Information",
                fields: [
                    { id: "driverName", label: "Driver Name", type: "text", required: true },
                    { id: "licenseNumber", label: "CDL/License Number", type: "text", required: true, halfWidth: true },
                    { id: "licenseState", label: "License State", type: "text", required: true, halfWidth: true },
                ],
            },
            {
                id: "reviewDetails",
                title: "Review Details",
                fields: [
                    { id: "reviewDate", label: "Date of Review", type: "date", required: true },
                    { id: "mvrObtainedDate", label: "Date MVR Was Obtained", type: "date", required: true },
                    {
                        id: "violationsFound", label: "Were any violations found?", type: "select", required: true, options: [
                            { value: "", label: "Select..." },
                            { value: "no", label: "No violations found" },
                            { value: "minor", label: "Minor violations (not disqualifying)" },
                            { value: "major", label: "Major violations — review needed" },
                        ]
                    },
                    { id: "violationDetails", label: "Violation Details (if any)", type: "textarea", placeholder: "List any violations found on the MVR" },
                ],
            },
            {
                id: "determination",
                title: "Reviewer's Determination",
                fields: [
                    { id: "meetsRequirements", label: "Driver meets minimum requirements to operate a commercial motor vehicle per 49 CFR §391", type: "checkbox", required: true },
                    { id: "reviewerName", label: "Reviewer Name", type: "text", required: true },
                    { id: "reviewerTitle", label: "Reviewer Title", type: "text", required: true },
                    { id: "certDate", label: "Date", type: "date", required: true },
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
                    { id: "state", label: "State", type: "text", required: true, halfWidth: true },
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

export function getRecommendedForms(answers: Record<string, string | string[]>): DOTForm[] {
    const recommended: Set<string> = new Set();

    // Everyone needs these
    recommended.add("mcs150");
    recommended.add("driverApp");
    recommended.add("annualCertViolations");
    recommended.add("dvir");
    recommended.add("vehicleMaintenance");

    // Interstate operations need BOC-3
    if (answers.operations === "interstate" || answers.operations === "both") {
        recommended.add("boc3");
    }

    // CDL drivers need road test cert and MVR review
    const hazmatAnswers = answers.hazmat as string[] | undefined;
    if (hazmatAnswers?.includes("cdlDrivers") || answers.vehicleWeight === "over26k" || answers.vehicleWeight === "combination") {
        recommended.add("roadTestCert");
        recommended.add("annualMVRReview");
    }

    // Drug & Alcohol policy always needed for CDL drivers
    if (hazmatAnswers?.includes("cdlDrivers") || answers.vehicleWeight === "over26k" || answers.vehicleWeight === "combination") {
        recommended.add("drugAlcoholPolicy");
    }

    // Accident register is always recommended
    recommended.add("accidentRegister");

    return dotForms.filter(f => recommended.has(f.id));
}
