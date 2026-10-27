// ============================================================
// GSAP Configuration & Reusable Animation Utilities
// ============================================================
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Default easing
export const EASE = {
  smooth: 'power2.out',
  enter: 'power3.out',
  exit: 'power2.in',
  bounce: 'back.out(1.4)',
};

// Default durations
export const DURATION = {
  fast: 0.25,
  normal: 0.4,
  slow: 0.6,
  entrance: 0.7,
};

// Stagger KPI cards entrance
export function animateKpiCards(containerRef) {
  if (!containerRef?.current) return;
  const cards = containerRef.current.querySelectorAll('.kpi-card');
  if (!cards.length) return;

  gsap.fromTo(
    cards,
    { opacity: 0, y: 24 },
    {
      opacity: 1,
      y: 0,
      duration: DURATION.normal,
      stagger: 0.1,
      ease: EASE.enter,
    }
  );
}

// Animate a counter from 0 to target
export function animateCounter(element, target, options = {}) {
  if (!element) return;
  const { duration = 1.2, prefix = '', suffix = '', formatter } = options;
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration,
    ease: 'power1.out',
    onUpdate: () => {
      const formatted = formatter ? formatter(Math.round(obj.val)) : Math.round(obj.val).toLocaleString('en-IN');
      element.textContent = `${prefix}${formatted}${suffix}`;
    },
  });
}

// Page entrance animation
export function animatePageEntrance(containerRef) {
  if (!containerRef?.current) return;
  gsap.fromTo(
    containerRef.current,
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: DURATION.normal, ease: EASE.enter }
  );
}

// Stagger children
export function staggerChildren(parentRef, selector, options = {}) {
  if (!parentRef?.current) return;
  const children = parentRef.current.querySelectorAll(selector);
  if (!children.length) return;
  gsap.fromTo(
    children,
    { opacity: 0, y: options.y || 16 },
    {
      opacity: 1,
      y: 0,
      duration: options.duration || DURATION.normal,
      stagger: options.stagger || 0.08,
      ease: options.ease || EASE.enter,
      delay: options.delay || 0,
    }
  );
}

// Modal enter
export function animateModalEnter(backdropRef, contentRef) {
  const tl = gsap.timeline();
  if (backdropRef?.current) {
    tl.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
  }
  if (contentRef?.current) {
    tl.fromTo(
      contentRef.current,
      { opacity: 0, scale: 0.96, y: 8 },
      { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: EASE.enter },
      '-=0.1'
    );
  }
  return tl;
}

// Modal exit
export function animateModalExit(backdropRef, contentRef, onComplete) {
  const tl = gsap.timeline({ onComplete });
  if (contentRef?.current) {
    tl.to(contentRef.current, { opacity: 0, scale: 0.96, y: 8, duration: 0.2, ease: EASE.exit });
  }
  if (backdropRef?.current) {
    tl.to(backdropRef.current, { opacity: 0, duration: 0.15 }, '-=0.1');
  }
  return tl;
}

// Drawer slide in from right
export function animateDrawerEnter(backdropRef, drawerRef) {
  const tl = gsap.timeline();
  if (backdropRef?.current) {
    tl.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
  }
  if (drawerRef?.current) {
    tl.fromTo(
      drawerRef.current,
      { x: '100%' },
      { x: '0%', duration: 0.35, ease: EASE.enter },
      '-=0.15'
    );
  }
  return tl;
}

// Drawer slide out
export function animateDrawerExit(backdropRef, drawerRef, onComplete) {
  const tl = gsap.timeline({ onComplete });
  if (drawerRef?.current) {
    tl.to(drawerRef.current, { x: '100%', duration: 0.25, ease: EASE.exit });
  }
  if (backdropRef?.current) {
    tl.to(backdropRef.current, { opacity: 0, duration: 0.15 }, '-=0.1');
  }
  return tl;
}

// Sidebar expand / collapse
export function animateSidebar(sidebarRef, expanded, isMobile) {
  if (!sidebarRef?.current) return;
  if (isMobile) {
    gsap.to(sidebarRef.current, {
      x: expanded ? 0 : '-100%',
      duration: 0.35,
      ease: EASE.enter,
    });
  } else {
    gsap.to(sidebarRef.current, {
      width: expanded ? 260 : 72,
      duration: 0.35,
      ease: EASE.smooth,
    });
  }
}

// Hover lift
export function addHoverLift(element) {
  if (!element) return;
  const enter = () => {
    gsap.to(element, { y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', duration: 0.2, ease: EASE.smooth });
  };
  const leave = () => {
    gsap.to(element, { y: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', duration: 0.2, ease: EASE.smooth });
  };
  element.addEventListener('mouseenter', enter);
  element.addEventListener('mouseleave', leave);
  return () => {
    element.removeEventListener('mouseenter', enter);
    element.removeEventListener('mouseleave', leave);
  };
}

// Respect reduced motion
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export { gsap, ScrollTrigger };
