import React, { useEffect } from 'react';

export default function LazyImages() {
  useEffect(() => {
    function setLazy(img: HTMLImageElement) {
      try {
        if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
      } catch {}
    }

    function process(root: ParentNode | Element = document) {
      const imgs = root.querySelectorAll('img');
      imgs.forEach(img => setLazy(img as HTMLImageElement));
    }

    process(document);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach(n => {
          if (n.nodeType !== Node.ELEMENT_NODE) return;
          const el = n as Element;
          if (el.tagName.toLowerCase() === 'img') {
            setLazy(el as HTMLImageElement);
          } else {
            process(el);
          }
        });
      }
    });

    if (document.body) mo.observe(document.body, { childList: true, subtree: true });

    return () => mo.disconnect();
  }, []);

  return null;
}