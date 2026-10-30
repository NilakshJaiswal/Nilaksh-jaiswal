import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "../components/Navbar";
import { TypewriterText } from "../components/TypewriterText";
import { ContactButton } from "../components/ContactButton";
import { Magnet } from "../components/Magnet";
import { useReducedMotionPreference } from "../hooks/useReducedMotionPreference";
import type { SettingsContent } from "../types";

interface HeroSectionProps {
  settings: SettingsContent | null;
}

const SENSITIVITY = 0.8;
const FALLBACK_VIDEO_BG =
  "radial-gradient(circle at 70% 50%, rgba(100,105,115,0.35), rgba(12,12,12,1) 70%)";

const DEFAULT_ACTIONS = [
  { label: "Explore Projects", link: "#projects" },
  { label: "About Me", link: "#about" },
  { label: "View Resume", link: "/resume.pdf" },
  { label: "Contact Me", link: "#contact" },
];

export function HeroSection({ settings }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const reduced = useReducedMotionPreference();

  const targetTimeRef = useRef(0);
  const seekPendingRef = useRef(false);
  const prevXRef = useRef<number | null>(null);

  const videoUrl = settings?.backgroundVideoUrl;
  const actions = settings?.heroActions?.length ? settings.heroActions : DEFAULT_ACTIONS;
  const headingText = settings?.heroHeading || "HI, I'M NILAKSH";

  // Action buttons appear 400ms after mount, independent of the typewriter.
  useEffect(() => {
    const t = setTimeout(() => setButtonsVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  // Mouse-scrub video control.
  useEffect(() => {
    if (reduced || !videoUrl || videoFailed) return;
    const video = videoRef.current;
    if (!video || !videoReady) return;

    function seekToTarget() {
      if (!video) return;
      const duration = video.duration;
      if (!isFinite(duration) || duration <= 0) return;
      if (seekPendingRef.current) return;
      seekPendingRef.current = true;
      video.currentTime = targetTimeRef.current;
    }

    function handleSeeked() {
      seekPendingRef.current = false;
      if (video && Math.abs(video.currentTime - targetTimeRef.current) > 0.05) {
        seekToTarget();
      }
    }

    function handlePointerMove(e: PointerEvent) {
      if (!video) return;
      const duration = video.duration;
      if (!isFinite(duration) || duration <= 0) return;

      if (prevXRef.current === null) {
        prevXRef.current = e.clientX;
        return;
      }
      const delta = e.clientX - prevXRef.current;
      prevXRef.current = e.clientX;

      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * duration;
      let next = targetTimeRef.current + timeOffset;
      next = Math.max(0, Math.min(duration, next));
      targetTimeRef.current = next;

      seekToTarget();
    }

    // Touch fallback: a gentle automatic drift instead of requiring mouse movement.
    let touchInterval: ReturnType<typeof setInterval> | undefined;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) {
      touchInterval = setInterval(() => {
        const duration = video.duration;
        if (!isFinite(duration) || duration <= 0) return;
        targetTimeRef.current = (targetTimeRef.current + 0.5) % duration;
        seekToTarget();
      }, 500);
    } else {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
    }

    video.addEventListener("seeked", handleSeeked);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      video.removeEventListener("seeked", handleSeeked);
      if (touchInterval) clearInterval(touchInterval);
    };
  }, [videoReady, videoFailed, reduced, videoUrl]);

  return (
    // `isolate` keeps the fixed video below in this section's own stacking
    // context, so later sections (at z-10) paint over it instead of behind it.
    <section id="top" className="relative isolate h-screen flex flex-col overflow-hidden">
      {videoUrl && !videoFailed ? (
        <video
          ref={videoRef}
          src={videoUrl}
          muted
          playsInline
          preload="auto"
          className="fixed inset-0 w-full h-full object-cover z-0"
          style={{ objectPosition: "70% center" }}
          onLoadedMetadata={() => setVideoReady(true)}
          onError={() => setVideoFailed(true)}
        />
      ) : (
        <div className="fixed inset-0 z-0" style={{ background: FALLBACK_VIDEO_BG }} />
      )}
      <div className="fixed inset-0 z-0 bg-black/30" />

      <Navbar settings={settings} />

      <div className="relative z-10 flex-1 flex flex-col justify-center px-5 sm:px-8 md:px-10">
        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="hero-heading heading-xl font-black uppercase tracking-tight max-w-[60rem]"
        >
          {headingText}
        </motion.h1>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="uppercase tracking-widest text-mist/70 text-sm md:text-base mt-3"
        >
          {settings?.heroRoleLabel || "DEVELOPER"}
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-4 mb-6 min-h-[1.5em]"
        >
          <TypewriterText
            text={settings?.heroTypewriterText || "I bring your imagination to life on screen"}
            className="text-white text-lg sm:text-xl md:text-2xl font-light"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={buttonsVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-wrap gap-3"
        >
          {actions.map((action) => (
            <a
              key={action.label}
              href={action.link}
              {...(action.link.startsWith("/") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-5 py-2 hover:bg-black hover:text-white transition-colors duration-200"
            >
              {action.label}
            </a>
          ))}
          <ContactButton href="#contact" className="!px-6 !py-2 !text-xs" />
        </motion.div>
      </div>

      <Magnet
        padding={150}
        strength={3}
        activeTransition="transform 0.3s ease-out"
        inactiveTransition="transform 0.6s ease-in-out"
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 z-[5] top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-[-10%] w-[220px] sm:w-[300px] md:w-[380px] opacity-30"
      >
        <div
          aria-hidden="true"
          className="w-full aspect-square rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(187,204,215,0.25) 0%, rgba(100,105,115,0.08) 60%, transparent 100%)",
          }}
        />
      </Magnet>
    </section>
  );
}
