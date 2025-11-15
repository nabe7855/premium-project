// hooks/useSticky.ts
import { useEffect, useState } from "react";

export const useSticky = (id: string) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 1.0 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [id]);

  return isSticky;
};

