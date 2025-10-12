import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Icon } from '@iconify/react';

export default function IconifyInline() {
  useEffect(() => {
    const containerSelectors = ['.rp-content', 'main', '#app', 'body'];
    const roots: Array<any> = [];

    function resolveIconToken(token: string): string | null {
      if (!token) return null;
      // Support both `prefix:icon` and `prefix-icon` tokens
      if (token.includes(':')) return token;
      const parts = token.split('-');
      if (parts.length < 2) return null;
      const prefix = parts.shift();
      const name = parts.join('-');
      return `${prefix}:${name}`;
    }

    function walk(node: Node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const regex = /:([a-z0-9][a-z0-9:\-]*[a-z0-9]):/gi;
        let match: RegExpExecArray | null;
        const parent = node.parentElement;
        if (!parent) return;
        // don't transform inside elements that are already icon spans
        if (parent.classList && parent.classList.contains('iconify-shortcode')) return;
        const frag = document.createDocumentFragment();
        let lastIndex = 0;
        const text = node.textContent || '';
        regex.lastIndex = 0;
        let any = false;
        while ((match = regex.exec(text)) !== null) {
          any = true;
          const matched = match[0];
          const token = match[1];
          const before = text.slice(lastIndex, match.index);
          if (before) frag.appendChild(document.createTextNode(before));
          const iconSpan = document.createElement('span');
          iconSpan.className = 'iconify-shortcode';
          const resolved = resolveIconToken(token);
          if (resolved) {
            iconSpan.setAttribute('data-icon', resolved);
          } else {
            iconSpan.textContent = matched;
          }
          frag.appendChild(iconSpan);
          lastIndex = match.index + matched.length;
        }
        if (any) {
          const after = text.slice(lastIndex);
          if (after) frag.appendChild(document.createTextNode(after));
          parent.replaceChild(frag, node);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element;
        const tag = el.tagName.toLowerCase();
        // Skip code blocks and other areas where replacements are not desired
        if (['code', 'pre', 'textarea', 'script', 'style', 'svg'].includes(tag)) return;
        for (let i = 0; i < node.childNodes.length; i++) {
          walk(node.childNodes[i]);
        }
      }
    }

    function renderIcons() {
      const spans = document.querySelectorAll('span.iconify-shortcode[data-icon]');
      spans.forEach(span => {
        if ((span as HTMLElement).dataset.rendered) return;
        const icon = span.getAttribute('data-icon')!;
        try {
          // Render Icon into the span using a dedicated root
          const root = createRoot(span);
          root.render(React.createElement(Icon, { icon, className: 'inline w-5 h-5 align-text-bottom mx-1' }));
          (span as HTMLElement).dataset.rendered = '1';
          roots.push(root);
        } catch (e) {
          // If rendering fails, leave the raw token text visible
          console.error('Iconify render error', e);
        }
      });
    }

    const observers: MutationObserver[] = [];
    const rootElements = containerSelectors.map(sel => document.querySelector(sel)).filter(Boolean) as Element[];
    if (rootElements.length === 0) rootElements.push(document.body);
    rootElements.forEach(rootEl => {
      walk(rootEl);
    });
    renderIcons();

    const mo = new MutationObserver(mutations => {
      mutations.forEach(m => {
        m.addedNodes.forEach(n => {
          walk(n);
        });
      });
      renderIcons();
    });
    observers.push(mo);
    rootElements.forEach(el => mo.observe(el, { childList: true, subtree: true }));

    return () => {
      observers.forEach(o => o.disconnect());
      roots.forEach(r => {
        try { r.unmount(); } catch {}
      });
    };
  }, []);

  return null;
}