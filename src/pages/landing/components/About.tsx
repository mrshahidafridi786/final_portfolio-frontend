import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaBriefcase,
  FaDownload,
  FaInfoCircle,
} from "react-icons/fa";
import axios from "axios";
import shahidClose from "../../../assets/shahid_close.jpg";

export default function About() {
  const [aboutData, setAboutData] = useState({
    description:
      "Passionate MERN Stack Developer with expertise in building modern, responsive, and scalable web applications using MongoDB, Express.js, React.js, and Node.js. Experienced in developing clean, user-focused web solutions with practical knowledge of Mobile App Development. Dedicated to writing efficient, maintainable code and continuously learning emerging technologies to deliver high-quality digital products.",
    profileImage: "",
    statistics: [
      { label: "Years Learning & Coding", value: "1+" },
      { label: "Stack Projects Completed", value: "10+" },
      { label: "Target Countries", value: "10+" },
      { label: "Pixel-Perfect Delivery", value: "100%" },
    ],
  });

  const [experience, setExperience] = useState([
    {
      _id: "1",
      position: "Full Stack MERN Developer",
      company: "Independent Contractor",
      duration: "Present",
      description:
        "Engineering modern full-stack web applications for global startups and agencies. Specialize in high-frequency socket communication, Stripe payment engines, and optimized MongoDB databases.",
    },
    {
      _id: "2",
      position: "Frontend UI Developer",
      company: "Freelance & Open Source Projects",
      duration: "2025",
      description:
        "Developed premium React client interfaces. Focused on responsive layouts, CSS variables configurations, custom hooks optimization, and Framer Motion layout transitions.",
    },
  ]);

  const [education, setEducation] = useState([
    {
      _id: "1",
      degree: "Bachelor of Science in Computer Science",
      institution: "Agriculture University Peshawar",
      duration: "2024 - 2028",
      description:
        "Focusing on Software Engineering, Data Structures, Database Systems, and Modern Web Architectures.",
    },
  ]);

  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    const loadAboutData = async () => {
      try {
        const [aboutRes, expRes, eduRes, resumeRes] = await Promise.all([
          axios.get("/api/about"),
          axios.get("/api/experience"),
          axios.get("/api/education"),
          axios.get("/api/resume"),
        ]);

        if (aboutRes.data) setAboutData(aboutRes.data);
        if (expRes.data && expRes.data.length > 0) setExperience(expRes.data);
        if (eduRes.data && eduRes.data.length > 0) setEducation(eduRes.data);
        if (resumeRes.data && resumeRes.data.resumeUrl)
          setResumeUrl(resumeRes.data.resumeUrl);
      } catch (err) {
        console.log("Using default timeline and bio details.");
      }
    };

    loadAboutData();
  }, []);

  const handleResumeDownload = () => {
    if (resumeUrl) {
      window.open(resumeUrl, "_blank");
    } else {
      alert(
        "CV Document Integration: The CV download button triggers successfully! Once you upload your CV in the admin panel, it will download automatically.",
      );
    }
  };

  return (
    <section
      id="about"
      className="relative z-10 py-24 px-6 bg-primary-light/30"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="font-sans text-xs font-bold tracking-widest text-accent-cyan uppercase mb-3">
            About Me
          </h2>
          <h3 className="font-sans text-3xl font-extrabold tracking-tight sm:text-5xl">
            My Story & Experience
          </h3>
          <div className="mx-auto mt-4 h-1 w-20 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full" />
        </div>

        {/* Narrative & Stats */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-20 items-stretch">
          {/* Portrait Photo Card */}
          <div className="lg:col-span-1 flex justify-center items-center">
            <div className="glassmorphism rounded-3xl p-3 border border-white/10 bg-white/5 backdrop-blur-md shadow-glass-sm w-full max-w-[280px]">
              <div className="rounded-2xl overflow-hidden border border-white/5 h-[340px] w-full">
                <img
                  src={aboutData.profileImage || shahidClose}
                  alt="Shahid Afridi close-up portrait"
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="font-sans text-2xl font-bold text-white">
                Who is Shahid Afridi?
              </h4>
              <p className="font-sans text-sm leading-relaxed text-text-secondary whitespace-pre-line">
                {aboutData.description}
              </p>
            </div>

            {/* Core Mission */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <h5 className="font-sans text-sm font-bold text-white mb-1.5 flex items-center gap-2">
                <FaInfoCircle className="text-accent-cyan" />
                <span>My Mission Statement</span>
              </h5>
              <p className="font-sans text-[11px] italic text-text-secondary leading-relaxed">
                "To deliver fast, clean, and highly secure MERN & mobile
                applications that optimize workflows, scale seamlessly under
                heavy concurrent loads, and drive client revenue."
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4 h-fit">
            {aboutData.statistics.map((stat, i) => {
              const borderColors = [
                "hover:border-accent-blue/40",
                "hover:border-accent-purple/40",
                "hover:border-accent-blue/40",
                "hover:border-accent-cyan/40",
              ];
              const textColors = [
                "text-accent-cyan",
                "text-accent-purple",
                "text-white",
                "text-accent-cyan",
              ];
              return (
                <div
                  key={i}
                  className={`glassmorphism rounded-2xl p-6 text-center shadow-glass-sm border-white/10 ${borderColors[i % borderColors.length]} transition-colors`}
                >
                  <div
                    className={`font-sans text-4xl font-extrabold ${textColors[i % textColors.length]} mb-2`}
                  >
                    {stat.value}
                  </div>
                  <div className="font-sans text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timelines (Experience & Education) */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 mb-20">
          {/* Work Experience */}
          <div className="space-y-6">
            <h4 className="font-sans text-2xl font-bold text-white flex items-center gap-3">
              <FaBriefcase className="text-accent-blue" />
              <span>Experience</span>
            </h4>
            <div className="space-y-6 border-l-2 border-white/10 pl-6 ml-3">
              {experience.map((item) => (
                <div key={item._id} className="relative space-y-2">
                  <div className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full bg-accent-blue border-4 border-[#050816]" />
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <h5 className="font-sans text-lg font-bold text-white">
                      {item.position}
                    </h5>
                    <span className="rounded-full bg-accent-blue/15 px-3 py-1 text-xs font-semibold text-accent-blue">
                      {item.duration}
                    </span>
                  </div>
                  <div className="font-sans text-xs font-semibold text-accent-cyan uppercase">
                    {item.company}
                  </div>
                  <p className="font-sans text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-6">
            <h4 className="font-sans text-2xl font-bold text-white flex items-center gap-3">
              <FaGraduationCap className="text-accent-purple" />
              <span>Education</span>
            </h4>
            <div className="space-y-6 border-l-2 border-white/10 pl-6 ml-3">
              {education.map((item) => (
                <div key={item._id} className="relative space-y-2">
                  <div className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full bg-accent-purple border-4 border-[#050816]" />
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <h5 className="font-sans text-lg font-bold text-white">
                      {item.degree}
                    </h5>
                    <span className="rounded-full bg-accent-purple/15 px-3 py-1 text-xs font-semibold text-accent-purple">
                      {item.duration}
                    </span>
                  </div>
                  <div className="font-sans text-xs font-semibold text-accent-purple uppercase">
                    {item.institution}
                  </div>
                  <p className="font-sans text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Resume / CV Dedicated Section */}
        <div className="glassmorphism rounded-3xl p-8 border border-white/10 bg-gradient-to-r from-[#0B1120] to-[#050816] flex flex-col md:flex-row items-center justify-between gap-6 shadow-glass-md hover:border-white/20 transition-all">
          <div className="space-y-2">
            <h4 className="font-sans text-2xl font-extrabold text-white">
              Curriculum Vitae (CV) Section
            </h4>
            <p className="font-sans text-sm text-text-secondary max-w-xl">
              My comprehensive resume details academic training at the
              Agriculture University Peshawar, detailed stack proficiencies,
              completed projects registry, and engineering methodologies.
              Download the PDF for offline review.
            </p>
          </div>
          <motion.button
            onClick={handleResumeDownload}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-blue to-accent-cyan hover:shadow-glow-blue px-6 py-3.5 font-sans font-bold text-sm tracking-wider uppercase text-white transition-all transform hover:scale-105"
          >
            <FaDownload />
            <span>Download Resume PDF</span>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
