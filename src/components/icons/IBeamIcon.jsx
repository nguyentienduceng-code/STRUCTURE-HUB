export default function IBeamIcon({ size = 24, color = "currentColor", className = "" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M4 4h16" />
      <path d="M4 20h16" />
      <path d="M12 4v16" />
      <path d="M10 4v2" />
      <path d="M14 4v2" />
      <path d="M10 20v-2" />
      <path d="M14 20v-2" />
    </svg>
  );
}
