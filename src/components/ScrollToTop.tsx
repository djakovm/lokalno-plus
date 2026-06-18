import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { hash, pathname, search } = useLocation();

  useLayoutEffect(() => {
    if (hash) {
      return;
    }

    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;

    root.style.scrollBehavior = "auto";
    window.scrollTo({ left: 0, top: 0, behavior: "auto" });

    const frameId = window.requestAnimationFrame(() => {
      window.scrollTo({ left: 0, top: 0, behavior: "auto" });
      root.style.scrollBehavior = previousScrollBehavior;
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      root.style.scrollBehavior = previousScrollBehavior;
    };
  }, [hash, pathname, search]);

  return null;
};
