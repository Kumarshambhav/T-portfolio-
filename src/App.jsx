import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Html } from "@react-three/drei";
import { motion } from "framer-motion";
import clsx from "clsx";

// -----------------------------
// DATA — filled from resume
// -----------------------------
const DATA = {
  name: "Shriyati Verma",
  title: "Civil Engineering Student | Aspiring Engineer",
  location: "Gorakhpur, India",
  email: "shriyativerma1503@gmail.com",
  phone: "+91 8009768320",
  github: "https://github.com/Shriverma",
  linkedin: "https://www.linkedin.com/in/shriyati-verma-6b69982a1",
  summary:
    "I am a dedicated Civil Engineering student at MMMUT, Gorakhpur with strong technical skills in AutoCAD, C, C++, and Python. I have hands-on experience through internships at PWD in road construction and maintenance, as well as academic projects in sustainable building design and pavement life cycle assessment. I’m passionate about construction, geotechnical testing, and innovative engineering solutions.",

  skills: [
    { id: "python", name: "Python", type: "sphere", color: "#3776ab" },
    { id: "c", name: "C", type: "box", color: "#A8B9CC" },
    { id: "cpp", name: "C++", type: "icosa", color: "#00599C" },
    { id: "autocad", name: "AutoCAD", type: "torus", color: "#E34F26" },
    { id: "office", name: "MS Office", type: "cylinder", color: "#0078D4" },
    { id: "photoshop", name: "Adobe Photoshop", type: "plane", color: "#31A8FF" },
    { id: "canva", name: "Canva", type: "sphere", color: "#00C4CC" }
  ],

  projects: [
    {
      name: "Planning and Designing of 4-Storey Building",
      desc: "Designed and planned a 4-storey earthquake-resistant, east-facing building emphasizing safety, sustainability, Vaastu Shastra principles, and modern construction practices.",
      tags: ["Building Design", "Safety", "Vaastu", "Civil Engineering"]
    },
    {
      name: "Life Cycle Assessment of FDR Pavement",
      desc: "Conducted a life cycle assessment on Full-Depth Reclamation (FDR) pavement using cement and powder-based additives under the guidance of Dr. Govind Pandey.",
      tags: ["Pavement", "FDR", "Civil Engineering"]
    }
  ],

  experience: [
    {
      company: "PWD (Public Works Department), Gorakhpur",
      role: "Engineer Trainee",
      date: "Jun 2023 – Aug 2023",
      bullets: [
        "Assisted with site inspections, ensured design adherence, and supported quality control.",
        "Contributed to documentation including detailed reports and plan preparation."
      ]
    },
    {
      company: "PWD (Public Works Department), Gorakhpur",
      role: "Summer Trainee",
      date: "Jun 2024 – Jul 2024",
      bullets: [
        "Hands-on participation in ongoing construction projects, learning fieldwork and admin processes."
      ]
    }
  ],

  education: [
    {
      school: "Madan Mohan Malaviya University of Technology, Gorakhpur",
      degree: "B.Tech in Civil Engineering",
      cgpa: "7.37/10.0",
      year: "2021–2025"
    },
    {
      school: "St. Xavier’s School, Salempur",
      degree: "Class XII (CBSE, PCM)",
      cgpa: "90.40%",
      year: "2021"
    },
    {
      school: "St. Xavier’s School, Salempur",
      degree: "Class X (CBSE)",
      cgpa: "94.80%",
      year: "2019"
    }
  ],

  achievements: [
    "Secured 6th Rank in High School Examination (CBSE), St. Xavier’s School, Salempur",
    "NPTEL: 73% Municipal Solid Waste Management",
    "NPTEL: 77% Remote Sensing Essentials",
    "NPTEL: 70% Geosynthetics and Reinforced Soil Structures"
  ],

  extracurriculars: [
    "Class Representative (2018–2021)",
    "Captain — Kho-Kho and Kabaddi teams"
  ],

  interests: [
    "Road Construction and Material Testing",
    "Geotechnical Field Tests",
    "Concrete Lab Tests",
    "Building Drawing and Planning",
    "Estimation and Costing"
  ],

  certificates: [
    "Merit Certificate",
    "AutoCAD Workshop (Participant)",
    "Viksit Bharat — Participation"
  ]
};

// -----------------------------
// 3D Skill Icons
// -----------------------------
function SkillIcon({ skill, position = [0, 0, 0], isDark }) {
  const ref = useRef();
  const hoverRef = useRef(false);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.6;
    ref.current.position.y =
      position[1] + Math.sin(state.clock.getElapsedTime() + position[0]) * 0.12;
    const targetScale = hoverRef.current ? 1.25 : 1;
    ref.current.scale.lerp(
      { x: targetScale, y: targetScale, z: targetScale },
      0.1
    );
  });

  const commonMat = useMemo(() => ({ metalness: 0.4, roughness: 0.25 }), []);

  const geom = (t) => {
    switch (t) {
      case "torus":
        return <torusGeometry args={[0.6, 0.18, 16, 60]} />;
      case "box":
        return <boxGeometry args={[1.1, 1.1, 1.1]} />;
      case "sphere":
        return <sphereGeometry args={[0.75, 32, 32]} />;
      case "icosa":
        return <icosahedronGeometry args={[0.9, 1]} />;
      case "cylinder":
        return <cylinderGeometry args={[0.5, 0.5, 1.2, 32]} />;
      case "plane":
        return <planeGeometry args={[1.2, 0.7]} />;
      default:
        return <sphereGeometry args={[0.6, 24, 24]} />;
    }
  };

  return (
    <group position={position}>
      <mesh
        ref={ref}
        onPointerOver={() => (hoverRef.current = true)}
        onPointerOut={() => (hoverRef.current = false)}
        castShadow
        receiveShadow
      >
        {geom(skill.type)}
        <meshStandardMaterial color={skill.color} {...commonMat} />
      </mesh>
      <Html distanceFactor={6} className="pointer-events-none">
        <div
          className={clsx(
            "whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium shadow-md",
            isDark ? "bg-white/10 text-white" : "bg-black/10 text-black"
          )}
        >
          {skill.name}
        </div>
      </Html>
    </group>
  );
}

function SkillsScene({ isDark }) {
  const baseY = 0;
  const positions = [
    [-2.2, baseY, 0],
    [-1, baseY + 0.2, -0.6],
    [0, baseY - 0.1, 0],
    [1, baseY + 0.15, -0.4],
    [2.2, baseY, 0],
    [0, baseY + 0.9, 1.4],
    [0, baseY - 0.8, -1.2]
  ];

  return (
    <>
      <color attach="background" args={[isDark ? "#05060a" : "#f5f7fa"]} />
      <ambientLight intensity={isDark ? 0.6 : 0.9} />
      <directionalLight position={[5, 5, 5]} intensity={isDark ? 1.0 : 0.8} />
      <directionalLight position={[-5, -3, -5]} intensity={0.35} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color={isDark ? "#0b1220" : "#ffffff"
          }
          metalness={0.1}
          roughness={1}
          transparent
          opacity={0.6}
        />
      </mesh>

      <Float floatIntensity={1.2} rotationIntensity={0.7} speed={1}>
        {DATA.skills.map((s, i) => (
          <SkillIcon
            key={s.id}
            skill={s}
            position={positions[i] || [i - 2, 0, 0]}
            isDark={isDark}
          />
        ))}
      </Float>

      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.6} />
    </>
  );
}

// -----------------------------
// UI Helpers
// -----------------------------
function Tag({ children }) {
  return (
    <span className="px-2 py-1 rounded-full text-xs bg-white/10 dark:bg-black/20 backdrop-blur-sm">
      {children}
    </span>
  );
}

const sectionVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// -----------------------------
// Main Component
// -----------------------------
export default function WorldsBestPortfolio() {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem("theme") === "dark";
    } catch (e) {
      return true;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch (e) {}
  }, [isDark]);

  return (
    <div
      className={clsx(
        "min-h-screen font-sans transition-colors duration-300",
        isDark
          ? "bg-gradient-to-b from-[#05060a] to-[#071019] text-slate-100"
          : "bg-gradient-to-b from-[#f5f7fa] to-[#e4ebf5] text-slate-900"
      )}
    >
      {/* Header */}
      <header className="fixed inset-x-0 top-4 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="rounded-lg p-2 bg-white/60 dark:bg-black/40 backdrop-blur-md">
            <div className="font-semibold">{DATA.name.split(" ")[0]}</div>
            <div className="text-xs opacity-70">{DATA.title}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href={DATA.github} target="_blank" rel="noreferrer" className="text-sm opacity-80 hover:opacity-100">
            GitHub
          </a>
          <a href={DATA.linkedin} target="_blank" rel="noreferrer" className="text-sm opacity-80 hover:opacity-100">
            LinkedIn
          </a>
          <button
            aria-label="Toggle theme"
            onClick={() => setIsDark((s) => !s)}
            className="rounded-full p-2 bg-white/10 dark:bg-black/20 backdrop-blur-md"
            title="Toggle theme"
          >
            {isDark ? "🌙" : "☀️"}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-28 pb-24">
        {/* Hero */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="rounded-2xl p-8 bg-white/60 dark:bg-black/40 backdrop-blur-sm shadow-lg">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{DATA.name}</h1>
              <p className="mt-3 text-lg opacity-80">
                {DATA.title} — {DATA.location}
              </p>
              <p className="mt-6 text-sm leading-relaxed opacity-85">{DATA.summary}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                {DATA.skills.slice(0, 5).map((s) => (
                  <Tag key={s.id}>{s.name}</Tag>
                ))}
              </div>

              <div className="mt-6 flex gap-3 items-center">
                <a href={`mailto:${DATA.email}`} className="px-4 py-2 rounded-lg bg-sky-600 text-white font-medium">
                  Contact
                </a>
                <a href={DATA.github} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg border">
                  View Code
                </a>
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

        {/* Projects */}
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
                <div className="mt-4 text-xs opacity-60">Tags: {p.tags.join(", ")}</div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        {/* Experience + Education */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-2xl font-bold">Experience</h2>
            <div className="mt-4 space-y-4">
              {DATA.experience.map((e) => (
                <div key={`${e.company}-${e.date}`} className="p-4 rounded-lg bg-white/50 dark:bg-black/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{e.role}</div>
                      <div className="text-sm opacity-80">{e.company}</div>
                    </div>
                    <div className="text-sm opacity-70">{e.date}</div>
                  </div>
                  {e.bullets && e.bullets.length > 0 && (
                    <ul className="mt-2 list-disc list-inside text-sm opacity-85 space-y-1">
                      {e.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-2xl font-bold">Education</h2>
            <div className="mt-4 space-y-4">
              {DATA.education.map((ed) => (
                <div key={`${ed.school}-${ed.year}`} className="p-4 rounded-lg bg-white/50 dark:bg-black/20">
                  <div className="font-semibold">{ed.school}</div>
                  <div className="text-sm opacity-80">{ed.degree} · {ed.cgpa} · {ed.year}</div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Skills */}
        <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-16">
          <h2 className="text-2xl font-bold">Skills</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {DATA.skills.map((s) => (
              <Tag key={s.id}>{s.name}</Tag>
            ))}
          </div>
        </motion.section>

        {/* Achievements */}
        <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-16">
          <h2 className="text-2xl font-bold">Achievements</h2>
          <ul className="mt-4 list-disc list-inside space-y-2 text-sm opacity-85">
            {DATA.achievements.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </motion.section>

        {/* Extracurriculars & Interests */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-2xl font-bold">Extracurriculars</h2>
            <ul className="mt-4 list-disc list-inside space-y-2 text-sm opacity-85">
              {DATA.extracurriculars.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </motion.section>

          <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-2xl font-bold">Interests</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {DATA.interests.map((it) => (
                <Tag key={it}>{it}</Tag>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Certificates */}
        <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-16">
          <h2 className="text-2xl font-bold">Certificates</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {DATA.certificates.map((c) => (
              <Tag key={c}>{c}</Tag>
            ))}
          </div>
        </motion.section>

        {/* Contact */}
        <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-16">
          <h2 className="text-2xl font-bold">Contact</h2>
          <div className="mt-6 rounded-2xl p-6 bg-white/60 dark:bg-black/30 backdrop-blur-md shadow-md">
            <p className="text-sm">Interested in working together? Reach out via email or phone — or check my GitHub/LinkedIn for projects.</p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <a href={`mailto:${DATA.email}`} className="px-4 py-2 rounded-lg bg-sky-600 text-white">Email Me</a>
              <a href={DATA.github} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg border">GitHub</a>
              <a href={DATA.linkedin} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg border">LinkedIn</a>
            </div>
            <div className="mt-3 text-xs opacity-70">{DATA.phone} · {DATA.location}</div>
          </div>
        </motion.section>

        <footer className="mt-16 text-center text-xs opacity-60">© {new Date().getFullYear()} {DATA.name}. Built with ❤️ and modern web tech.</footer>
      </main>
    </div>
  );
}

