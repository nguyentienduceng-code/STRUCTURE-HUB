export default function CompassRulerIcon({ size = 24, color = "currentColor", className = "" }) {
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
      {/* A stylized compass / ruler combo for Engineering Foundations */}
      <path d="M12 3l-8 15h16z" />
      <circle cx="12" cy="7" r="2" />
      <path d="M8 15v3" />
      <path d="M16 15v3" />
      <path d="M12 18v3" />
      <line x1="9" y1="10" x2="15" y2="10" />
    </svg>
  );
}
