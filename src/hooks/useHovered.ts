import { useState, useRef, useEffect } from "react";

function useHovered() {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<Element | null>(null);

  useEffect(() => {
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const node = ref.current;
    if (node) {
      node.addEventListener("mouseenter", handleMouseEnter);
      node.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (node) {
        node.removeEventListener("mouseenter", handleMouseEnter);
        node.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return [ref, isHovered];
}

export default useHovered;
