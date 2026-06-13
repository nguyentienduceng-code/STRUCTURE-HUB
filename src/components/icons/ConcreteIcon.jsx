export default function ConcreteIcon({ size = 24, color = "currentColor", className = "" }) {
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
      {/* Column outline */}
      <rect x="6" y="3" width="12" height="18" rx="1" />
      {/* Rebar lines inside */}
      <line x1="10" y1="3" x2="10" y2="21" strokeDasharray="2 2" />
      <line x1="14" y1="3" x2="14" y2="21" strokeDasharray="2 2" />
      {/* Tie bars */}
      <line x1="6" y1="7" x2="18" y2="7" />
      <line x1="6" y1="12" x2="18" y2="12" />
      <line x1="6" y1="17" x2="18" y2="17" />
    </svg>
  );
}
