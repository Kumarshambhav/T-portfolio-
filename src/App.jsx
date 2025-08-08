/*
WorldsBestPortfolio.jsx
Complete React + Tailwind + Framer Motion + @react-three/fiber portfolio component
Features added in this version:
 - Full 3D scene showing *skill icons* as distinct 3D meshes (no external models required)
 - Each skill appears as a floating, interactive 3D icon with an HTML label
 - Icons respond to hover (scale) and rotate using useFrame
 - Distinct visual themes for Light and Dark mode (scene colors, materials)
 - All sections present: Hero, Projects, Experience, Education, Skills, Contact
 - Theme toggle persists to localStorage

Install (if not already):
npm install react react-dom framer-motion clsx three @react-three/fiber @react-three/drei

Drop this file into src/components/WorldsBestPortfolio.jsx and import into your App.
*/

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Html, Text } from "@react-three/drei";
import { motion } from "framer-motion";
import clsx from "clsx";

// ---------- Data (from PDF) ----------
const DATA = {
  name: "Shambhav Kumar Rao",
  title: "MERN developer | AI developer | GenAi",
  location: "Gorakhpur, India",
  email: "rshambhavkumar@gmail.com",
  phone: "+91 8881969955",
  github: "https://github.com/kumarshambhav/",
  linkedin: "https://www.linkedin.com/in/shambhav-kumar-rao-a62749241/",
  summary:
    "I’m a dedicated and creative developer with strong skills in C++, Python, and JavaScript, and hands-on experience in full-stack development using the MERN stack. I’ve developed multiple web applications, used AI tools for code quality, and built IoT & ML projects.",
  skills: [
    { id: "react", name: "React", type: "torus", color: "#61dafb" },
    { id: "node", name: "Node.js", type: "box", color: "#68a063" },
    { id: "python", name: "Python", type: "sphere", color: "#3776ab" },
    { id: "js", name: "JavaScript", type: "icosa", color: "#f7df1e" },
    { id: "mongo", name: "MongoDB", type: "cylinder", color: "#4db33d" },
    { id: "tailwind", name: "Tailwind", type: "plane", color: "#06b6d4" },
   { id: "LangChain", name: "icosa", type: "plane", color: "#06b6d4" },
  ],
  projects: [
    {
      name: "Real Estate Platform",
      desc:
        "Designed and developed a full-stack real estate platform enabling browsing, filtering, and contacting listings with real-time responsiveness. Built with MERN, JWT auth, interactive map views, and admin panel.",
      tags: ["MERN", "Maps", "JWT", "Tailwind"]
    },
    {
      name: "Smart Home Automation",
      desc:
        "System that controls appliances using IoT sensors and real-time data. Implemented energy monitoring and ML-based consumption prediction.",
      tags: ["Python", "IoT", "ML"]
    },
    {
      name: "StartUpNest — Co-Living Platform",
      desc:
        "A platform to filter rooms and rank hostels based on startup performance, featuring real-time updates of active projects.",
      tags: ["React", "Realtime", "Tailwind"]
    },
    {
      name: "CodeReview (GenAI Integration)",
      desc:
        "Frontend that communicates with Gemini API for real-time code analysis, automating detection of bugs and smells and improving developer workflows.",
      tags: ["GenAI", "React", "API"]
    }
  ],
  experience: [
    { company: "Proptecher", role: "Full-Stack Developer Intern", date: "Oct 2024 — Dec 2024" },
    { company: "Infosys Springboard", role: "AI Intern", date: "Feb 2025 — May 2025" }
  ],
  education: [
    { school: "Madan Mohan Malaviya University of Technology, Gorakhpur", degree: "B.Tech in ECE", cgpa: "6.69" },
    { school: "ABC Public School", degree: "Senior Secondary (PCM)", cgpa: "70.8%" }
  ]
};

// ---------- 3D Skill Icon component ----------
function SkillIcon({ skill, position = [0, 0, 0], isDark }) {
  const ref = useRef();
  const hoverRef = useRef(false);

  // simple bobbing + rotation animation
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.6;
    ref.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() + position[0]) * 0.12;
    const targetScale = hoverRef.current ? 1.25 : 1;
    ref.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale }, 0.1);
  });

  const commonMat = useMemo(() => ({ metalness: 0.4, roughness: 0.25 }), []);

  const color = isDark ? skill.color : skill.color;
  // geometry selection
  let geometry = null;
  switch (skill.type) {
    case "torus":
      geometry = <torusGeometry args={[0.6, 0.18, 16, 60]} />;
      break;
    case "box":
      geometry = <boxGeometry args={[1.1, 1.1, 1.1]} />;
      break;
    case "sphere":
      geometry = <sphereGeometry args={[0.75, 32, 32]} />;
      break;
    case "icosa":
      geometry = <icosahedronGeometry args={[0.9, 1]} />;
      break;
    case "cylinder":
      geometry = <cylinderGeometry args={[0.5, 0.5, 1.2, 32]} />;
      break;
    case "plane":
      geometry = <planeGeometry args={[1.2, 0.7]} />;
      break;
    default:
      geometry = <sphereGeometry args={[0.6, 24, 24]} />;
  }

  return (
    <group position={position}>
      <mesh
        ref={ref}
        onPointerOver={() => (hoverRef.current = true)}
        onPointerOut={() => (hoverRef.current = false)}
        castShadow
        receiveShadow
      >
        {geometry}
        <meshStandardMaterial color={color} {...commonMat} />
      </mesh>

      {/* HTML label that faces camera */}
      <Html distanceFactor={6} className="pointer-events-none">
        <div className={clsx("whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium shadow-md", isDark ? "bg-white/8 text-white" : "bg-black/6 text-black")}>
          {skill.name}
        </div>
      </Html>
    </group>
  );
}

// ---------- Full 3D Scene with skill icons ----------
function SkillsScene({ isDark }) {
  // positions arranged in a semicircle
  const baseY = 0;
  const positions = [
    [-2.2, baseY, 0],
    [-1, baseY + 0.2, -0.6],
    [0, baseY - 0.1, 0],
    [1, baseY + 0.15, -0.4],
    [2.2, baseY, 0],
    [0, baseY + 0.9, 1.4]
  ];

  return (
    <>
      <color attach="background" args={[isDark ? "#05060a" : "#f5f7fa"]} />

      <ambientLight intensity={isDark ? 0.6 : 0.9} />
      <directionalLight position={[5, 5, 5]} intensity={isDark ? 1.0 : 0.8} />
      <directionalLight position={[-5, -3, -5]} intensity={0.35} />

      {/* subtle floor reflection using a large, low-opacity plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={isDark ? "#0b1220" : "#ffffff"} metalness={0.1} roughness={1} transparent opacity={0.6} />
      </mesh>

      <Float floatIntensity={1.2} rotationIntensity={0.7} speed={1}>
        {DATA.skills.map((s, i) => (
          <SkillIcon key={s.id} skill={s} position={positions[i] || [i - 2, 0, 0]} isDark={isDark} />
        ))}
      </Float>

      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.6} />
    </>
  );
}

// ---------- UI small components ----------
function Tag({ children }) {
  return (
    <span className="px-2 py-1 rounded-full text-xs bg-white/8 dark:bg-black/20 backdrop-blur-sm">{children}</span>
  );
}

const sectionVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// ---------- Main component ----------
export default function WorldsBestPortfolio() {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem("theme") === "dark";
    } catch (e) {
      return true; // default dark
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    try { localStorage.setItem("theme", isDark ? "dark" : "light"); } catch (e) {}
  }, [isDark]);

  return (
    <div className={clsx("min-h-screen font-sans transition-colors duration-300", isDark ? "bg-gradient-to-b from-[#05060a] to-[#071019] text-slate-100" : "bg-gradient-to-b from-[#f5f7fa] to-[#e4ebf5] text-slate-900")}>
      <header className="fixed inset-x-0 top-4 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="rounded-lg p-2 bg-white/60 dark:bg-black/40 backdrop-blur-md">
            <div className="font-semibold">{DATA.name.split(" ")[0]}</div>
            <div className="text-xs opacity-70">{DATA.title}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a href={DATA.github} target="_blank" rel="noreferrer" className="text-sm opacity-80 hover:opacity-100">GitHub</a>
          <a href={DATA.linkedin} target="_blank" rel="noreferrer" className="text-sm opacity-80 hover:opacity-100">LinkedIn</a>
          <button aria-label="Toggle theme" onClick={() => setIsDark((s) => !s)} className="rounded-full p-2 bg-white/8 dark:bg-black/20 backdrop-blur-md">{isDark ? "🌙" : "☀️"}</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-28 pb-24">
        {/* HERO */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="rounded-2xl p-8 bg-white/60 dark:bg-black/40 backdrop-blur-sm shadow-lg">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{DATA.name}</h1>
              <p className="mt-3 text-lg opacity-80">{DATA.title} — {DATA.location}</p>
              <p className="mt-6 text-sm leading-relaxed opacity-85">{DATA.summary}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                {DATA.skills.slice(0, 5).map((s) => (<Tag key={s.id}>{s.name}</Tag>))}
              </div>

              <div className="mt-6 flex gap-3 items-center">
                <a href={`mailto:${DATA.email}`} className="px-4 py-2 rounded-lg bg-sky-600 text-white font-medium">Contact</a>
                <a href={DATA.github} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg border">View Code</a>
              </div>

              <div className="mt-5 text-xs opacity-70">Phone: {DATA.phone} · Email: {DATA.email}</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="rounded-3xl overflow-hidden h-96 shadow-2xl bg-gradient-to-br from-white to-slate-100 dark:from-[#071019] dark:to-[#06101a]">
              <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                <SkillsScene isDark={isDark} />
              </Canvas>
            </div>
          </motion.div>
        </section>

        {/* PROJECTS */}
        <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-16">
          <h2 className="text-2xl font-bold">Projects</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {DATA.projects.map((p) => (
              <motion.article key={p.name} whileHover={{ scale: 1.02 }} className="p-6 rounded-2xl bg-white/60 dark:bg-black/30 backdrop-blur-md shadow-md">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  <div className="flex gap-2">{p.tags.map((t) => (<Tag key={t}>{t}</Tag>))}</div>
                </div>
                <p className="mt-3 text-sm opacity-85">{p.desc}</p>
                <div className="mt-4 text-xs opacity-60">Tech: {p.tags.join(", ")}</div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        {/* EXPERIENCE & EDUCATION */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-2xl font-bold">Experience</h2>
            <div className="mt-4 space-y-4">
              {DATA.experience.map((e) => (
                <div key={e.company} className="p-4 rounded-lg bg-white/50 dark:bg-black/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{e.role}</div>
                      <div className="text-sm opacity-80">{e.company}</div>
                    </div>
                    <div className="text-sm opacity-70">{e.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-2xl font-bold">Education</h2>
            <div className="mt-4 space-y-4">
              {DATA.education.map((ed) => (
                <div key={ed.school} className="p-4 rounded-lg bg-white/50 dark:bg-black/20">
                  <div className="font-semibold">{ed.school}</div>
                  <div className="text-sm opacity-80">{ed.degree} · {ed.cgpa}</div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* SKILLS - static fallback list */}
        <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-16">
          <h2 className="text-2xl font-bold">Skills</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {DATA.skills.map((s) => (<Tag key={s.id}>{s.name}</Tag>))}
          </div>
        </motion.section>

        {/* CONTACT */}
        <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-16">
          <h2 className="text-2xl font-bold">Contact</h2>
          <div className="mt-6 rounded-2xl p-6 bg-white/60 dark:bg-black/30 backdrop-blur-md shadow-md">
            <p className="text-sm">Interested in working together? Reach out via email or phone — or check my GitHub/LinkedIn for code & projects.</p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <a href={`mailto:${DATA.email}`} className="px-4 py-2 rounded-lg bg-sky-600 text-white">Email Me</a>
              <a href={DATA.github} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg border">GitHub</a>
            </div>
            <div className="mt-3 text-xs opacity-70">{DATA.phone} · {DATA.location}</div>
          </div>
        </motion.section>

        <footer className="mt-16 text-center text-xs opacity-60">© {new Date().getFullYear()} {DATA.name}. Built with ❤️ and modern web tech.</footer>
      </main>
    </div>
  );
}
