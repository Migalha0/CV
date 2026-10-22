import { useEffect, type RefObject } from "react";

const MOBILE_QUERY = "(max-width: 767px)";
// Width of the toggle tab that stays on screen while the drawer is closed
const TAB_WIDTH = 40;
// Movement needed before deciding whether a gesture is a swipe or a scroll
const AXIS_LOCK = 10;
// px/ms; a faster release snaps in the swipe's direction regardless of position
const FLICK_VELOCITY = 0.4;

interface Options {
  open: boolean;
  setOpen: (open: boolean) => void;
  drawerRef: RefObject<HTMLElement | null>;
  backdropRef: RefObject<HTMLElement | null>;
}

// Touch-only drawer swipe: the drawer follows the finger, then snaps open or
// closed on release. Mouse and pen input is ignored, as are desktop widths.
export default function useSwipeDrawer({ open, setOpen, drawerRef, backdropRef }: Options) {
  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);

    let tracking = false;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastTime = 0;
    let velocity = 0;
    let position = 0;
    let frame = 0;

    const closedOffset = () => -((drawerRef.current?.offsetWidth ?? 0) - TAB_WIDTH);

    // Written straight to the DOM so dragging doesn't re-render React every move
    const paint = () => {
      frame = 0;

      const drawer = drawerRef.current;
      if (drawer) {
        drawer.style.transition = "none";
        drawer.style.transform = `translateX(${position}px)`;
      }

      const backdrop = backdropRef.current;
      if (backdrop) {
        backdrop.style.transition = "none";
        backdrop.style.visibility = "visible";
        backdrop.style.opacity = String(1 - position / closedOffset());
      }
    };

    // Hand control back to the CSS classes, which animate to the resting state
    const release = () => {
      cancelAnimationFrame(frame);
      frame = 0;

      for (const element of [drawerRef.current, backdropRef.current]) {
        element?.style.removeProperty("transition");
        element?.style.removeProperty("transform");
        element?.style.removeProperty("visibility");
        element?.style.removeProperty("opacity");
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch" || !mediaQuery.matches) return;

      tracking = true;
      dragging = false;
      startX = lastX = e.clientX;
      startY = e.clientY;
      lastTime = e.timeStamp;
      velocity = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!tracking) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (!dragging) {
        if (Math.hypot(dx, dy) < AXIS_LOCK) return;

        // Mostly vertical: it's a scroll, leave it to the browser
        if (Math.abs(dy) > Math.abs(dx)) {
          tracking = false;
          return;
        }

        dragging = true;
      }

      const closed = closedOffset();
      const base = open ? 0 : closed;
      position = Math.min(0, Math.max(closed, base + dx));

      const elapsed = e.timeStamp - lastTime;
      if (elapsed > 0) velocity = (e.clientX - lastX) / elapsed;
      lastX = e.clientX;
      lastTime = e.timeStamp;

      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onPointerEnd = () => {
      const wasDragging = dragging;
      tracking = false;
      dragging = false;

      if (!wasDragging) return;

      const shouldOpen =
        Math.abs(velocity) > FLICK_VELOCITY
          ? velocity > 0
          : position > closedOffset() / 2;

      release();
      setOpen(shouldOpen);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerEnd);
    document.addEventListener("pointercancel", onPointerEnd);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerEnd);
      document.removeEventListener("pointercancel", onPointerEnd);
      release();
    };
  }, [open, setOpen, drawerRef, backdropRef]);
}
