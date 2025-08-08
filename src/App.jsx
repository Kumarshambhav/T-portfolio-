/*
WorldsBestPortfolio.jsx
A single-file React + Tailwind + Framer Motion + @react-three/fiber portfolio template
Instructions:
1. Create a Vite React project (recommended) or Next.js app.
2. Install dependencies:
   npm install react react-dom framer-motion clsx three @react-three/fiber @react-three/drei
   (Also set up Tailwind CSS per tailwind docs)
3. Drop this file into src/components/WorldsBestPortfolio.jsx and import it in App.jsx
4. Tailwind and dark mode must be enabled in tailwind.config.js (class strategy).

This component is pre-filled with the information from the uploaded PDF (Shambhav Kumar Rao).
It includes:
 - Hero with 3D scene (react-three/fiber)
 - Scroll-triggered animations using Framer Motion
 - Section reveal on scroll
 - Projects / Experience / Skills / Contact
 - Light & Dark mode toggle with persistent preference
 - Clean responsive UI using Tailwind

Note: tweak assets (images, links) and project details to your liking.
*/

import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, useGLTF, Float } from "@react-three/drei";
import { motion } from "framer-motion";
import clsx from "clsx";

// ---------- 3D Model (simple shader-safe geometry) ----------
function FloatingMesh() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh castShadow receiveShadow scale={1.2}>
        <icosahedronGeometry args={[1.6, 2]} />
        <meshStandardMaterial metalness={0.6} roughness={0.2} envMapIntensity={0.8} />
      </mesh>
    </Float>
  );
}

// ---------- Data from PDF (populated) ----------
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
    "MERN (MongoDB, Express.js, React.js, Node.js)",
    "GenAI, LangChain, FastAPI, Conversational AI",
    "Python, C++, JavaScript, SQL, HTML, CSS",
    "Tailwind CSS, JWT, WebSockets, Firebase",
    "Git, GitHub, VS Code, Figma (Basic)"
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

// ---------- Reusable small components ----------
function Tag({ children }) {
  return (
    <span className="px-2 py-1 rounded-full text-xs bg-white/8 dark:bg-black/20 backdrop-blur-sm">
      {children}
    </span>
  );
}

const sectionVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function WorldsBestPortfolio() {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem("theme") === "dark";
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch (e) {}
  }, [isDark]);

  return (
    <div className={clsx("min-h-screen font-sans bg-gradient-to-b from-slate-50 to-white dark:from-[#05060a] dark:to-[#071019] text-slate-900 dark:text-slate-100 transition-colors duration-300")}>
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
          <button
            aria-label="Toggle theme"
            onClick={() => setIsDark((s) => !s)}
            className="rounded-full p-2 bg-white/8 dark:bg-black/20 backdrop-blur-md"
          >
            {isDark ? "🌙" : "☀️"}
          </button>
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
                {DATA.skills.slice(0, 5).map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>

              <div className="mt-6 flex gap-3 items-center">
                <a href={`mailto:${DATA.email}`} className="px-4 py-2 rounded-lg bg-sky-600 text-white font-medium">Contact</a>
                <a href={DATA.github} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg border">View Code</a>
              </div>

              <div className="mt-5 text-xs opacity-70">Phone: {DATA.phone} · Email: {DATA.email}</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="rounded-3xl overflow-hidden h-96 bg-gradient-to-br from-white to-slate-100 dark:from-[#071019] dark:to-[#06101a] shadow-2xl">
              <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 5, 5]} intensity={0.8} />
                <FloatingMesh />
                <OrbitControls enableZoom={false} enablePan={false} autoRotate={true} autoRotateSpeed={0.8} />
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

        {/* SKILLS */}
        <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-16">
          <h2 className="text-2xl font-bold">Skills</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {DATA.skills.map((s) => (<Tag key={s}>{s}</Tag>))}
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
