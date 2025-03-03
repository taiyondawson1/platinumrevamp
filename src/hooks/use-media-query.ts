
import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // Check if window is defined (for SSR)
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query);
      
      // Set initial value
      setMatches(media.matches);
      
      // Define listener function
      const updateMatches = (e: MediaQueryListEvent) => {
        setMatches(e.matches);
      };
      
      // Add listener for changes
      media.addEventListener("change", updateMatches);
      
      // Clean up
      return () => {
        media.removeEventListener("change", updateMatches);
      };
    }
    
    // Default to false when window is not available
    return () => {};
  }, [query]);

  return matches;
}
