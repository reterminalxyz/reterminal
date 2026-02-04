export function GridBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Clean minimal grid only - no scan lines or messy elements */}
      <svg className="w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="gridClean" width="50" height="50" patternUnits="userSpaceOnUse">
            <path 
              d="M 50 0 L 0 0 0 50" 
              fill="none" 
              stroke="#B87333" 
              strokeWidth="0.5" 
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gridClean)" />
      </svg>
      
      {/* Subtle corner accents only */}
      <div className="absolute top-4 left-4 w-6 h-6 border-l border-t border-[#B87333]/15" />
      <div className="absolute top-4 right-4 w-6 h-6 border-r border-t border-[#B87333]/15" />
      <div className="absolute bottom-20 left-4 w-6 h-6 border-l border-b border-[#B87333]/15" />
      <div className="absolute bottom-20 right-4 w-6 h-6 border-r border-b border-[#B87333]/15" />
    </div>
  );
}
