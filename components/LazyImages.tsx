import React, { useEffect } from 'react';
 
export default function LazyImages() {
  useEffect(() => {
    function setLazy(img: HTMLImageElement) {
      try {
        // ensure native lazy loading
        if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
 
        // Only create captions for images that live inside the main content area.
        // This covers common containers used by document markdown: <main>, <article>
        // and common classes like .content, .docs, .markdown, .page, .post.
        // Also include rspress doc containers (explicit classes or generated classnames).
        const inContent = !!img.closest(
          'main, article, .content, .docs, .markdown, .doc, .page, .post, .rspress-doc, .rspress-doc-container, [class*="rspress-doc"]'
        );
 
        // If image has alt text and is not already wrapped in a figure, wrap it
        // but only when it's inside the content area.
        if (inContent && img.alt && !img.closest('figure')) {
          // create figure and caption
          const figure = document.createElement('figure');
          figure.className = 'rehype-figure';
          const caption = document.createElement('figcaption');
          caption.className = 'rehype-figure__caption';
          caption.textContent = img.alt;
 
          // Move the image into the figure, preserving its current parent.
          // If the parent is a <p>, replace the <p> with the <figure> to avoid invalid nesting.
          const parent = img.parentNode as Element | null;
          if (parent) {
            const parentTag = (parent as Element).tagName
              ? (parent as Element).tagName.toLowerCase()
              : '';
 
            if (parentTag === 'p') {
              const grand = parent.parentNode;
              if (grand) {
                // insert figure before the paragraph, then move all children into figure
                grand.insertBefore(figure, parent);
                while (parent.firstChild) {
                  figure.appendChild(parent.firstChild);
                }
                // append caption after moving content
                figure.appendChild(caption);
                // remove the old paragraph
                grand.removeChild(parent);
              } else {
                // fallback: insert before img if no grandparent
                parent.insertBefore(figure, img);
                figure.appendChild(img);
                figure.appendChild(caption);
              }
            } else {
              parent.insertBefore(figure, img);
              figure.appendChild(img);
              figure.appendChild(caption);
            }
          }
        }
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