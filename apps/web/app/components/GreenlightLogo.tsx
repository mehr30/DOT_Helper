interface GreenlightLogoProps {
  size?: number;
}

export default function GreenlightLogo({ size = 36 }: GreenlightLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Rounded shield shape */}
      <path
        d="M24 2C24 2 6 8 6 22C6 36 24 46 24 46C24 46 42 36 42 22C42 8 24 2 24 2Z"
        fill="#0F2E1A"
        stroke="#1B5E35"
        strokeWidth="1.5"
      />
      {/* Inner glow ring */}
      <circle cx="24" cy="22" r="12" fill="#1B5E35" opacity="0.4" />
      {/* Green light circle */}
      <circle cx="24" cy="22" r="9" fill="#2ECC71" />
      {/* Light shine */}
      <ellipse cx="21.5" cy="19.5" rx="3" ry="2.5" fill="white" opacity="0.3" />
      {/* Checkmark */}
      <path
        d="M19 22.5L22.5 26L29.5 18.5"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
