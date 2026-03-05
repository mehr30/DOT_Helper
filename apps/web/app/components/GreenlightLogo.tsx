interface GreenlightLogoProps {
  size?: number;
}

export default function GreenlightLogo({ size = 36 }: GreenlightLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="26" cy="26" r="26" fill="#2ECC71" />
      <circle cx="26" cy="26" r="22" fill="#0F2E1A" stroke="#0F2E1A" strokeWidth="1" />
      <path
        d="M16 27L22.5 33.5L36 19"
        stroke="#2ECC71"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
