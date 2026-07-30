import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Cloud,
  Code2,
  Cpu,
  Database,
  Layers3,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";
import { HeroScene } from "../../components/3d/HeroScene";
import { useSettings } from "../../context/SettingsContext";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const services = [
  {
    icon: Code2,
    number: "01",
    title: "Software Engineering",
    description:
      "High-performance web, desktop and mobile systems engineered for real-world scale.",
    tags: ["React", "Node.js", "APIs"],
  },
  {
    icon: Bot,
    number: "02",
    title: "AI & Intelligent Systems",
    description:
      "AI assistants, automation, agents and LLM-powered workflows built around your business.",
    tags: ["Agents", "LLMs", "Automation"],
  },
  {
    icon: Cloud,
    number: "03",
    title: "Cloud & Infrastructure",
    description:
      "Secure cloud architecture, deployments and production infrastructure designed to grow.",
    tags: ["Cloud", "DevOps", "Security"],
  },
];

const strengths = [
  { icon: Zap, title: "Built for speed", text: "Fast interfaces and efficient systems." },
  { icon: ShieldCheck, title: "Secure by design", text: "Security considered from day one." },
  { icon: Layers3, title: "Ready to scale", text: "Architecture that grows with you." },
  { icon: Sparkles, title: "Crafted experience", text: "Every interaction feels intentional." },
];

export default function HomePage() {
  const { general } = useSettings();

  return (
    <div className="home-page bg-background text-foreground overflow-hidden">
      <SEO
        title={general?.companyName || "TERQIVO"}
        description={general?.description}
      />

      <section className="hero-shell relative min-h-[760px] h-[100svh] max-h-[980px] flex items-center overflow-hidden border-b border-white/[0.07]">
        <div className="absolute inset-0 pointer-events-none">
          <HeroScene />
          <div className="absolute inset-0 hero-vignette" />
          <div className="absolute inset-0 hero-grid" />
          <div className="absolute left-[8%] top-[17%] w-72 h-72 rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute right-[5%] bottom-[5%] w-96 h-96 rounded-full bg-primary/10 blur-[150px]" />
        </div>

        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 pt-28 pb-16 relative z-10 w-full">
          <div className="grid lg:grid-cols-[1.12fr_.88fr] gap-12 xl:gap-20 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.1 }}
              className="max-w-4xl"
            >
              <motion.div variants={reveal} className="hero-eyebrow mb-8">
                <span className="hero-eyebrow-dot" />
                TECHNOLOGY, ENGINEERED FOR TOMORROW
              </motion.div>

              <motion.h1
                variants={reveal}
                className="text-[clamp(4.1rem,9.5vw,9.2rem)] font-semibold tracking-[-0.072em] leading-[0.82] mb-9"
              >
                We build
                <span className="block hero-outline-text">what&apos;s next.</span>
              </motion.h1>

              <motion.p
                variants={reveal}
                className="text-base md:text-xl text-white/58 leading-relaxed max-w-2xl mb-10"
              >
                {general?.description ||
                  "Terqivo engineers intelligent software, AI systems and digital products that turn ambitious ideas into powerful technology."}
              </motion.p>

              <motion.div
                variants={reveal}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <Link to="/contact" className="hero-primary-button group">
                  Start your project
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link to="/products" className="hero-secondary-button group">
                  Explore products
                  <ArrowUpRight size={17} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </motion.div>

              <motion.div variants={reveal} className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/42">
                {["Custom software", "AI products", "Enterprise systems"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-primary" /> {item}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.25, ease }}
              className="hidden lg:block relative"
            >
              <div className="hero-console relative ml-auto max-w-[520px]">
                <div className="hero-console-top">
                  <div className="flex gap-2">
                    <span /><span /><span />
                  </div>
                  <span className="text-[10px] tracking-[0.24em] text-white/35">TERQIVO / SYSTEM</span>
                  <div className="w-10" />
                </div>
                <div className="p-7 xl:p-9">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-xs text-white/35 tracking-[0.18em] mb-2">DIGITAL CORE</p>
                      <h3 className="text-2xl font-medium tracking-tight">Future-ready systems</h3>
                    </div>
                    <div className="relative w-12 h-12 rounded-2xl border border-primary/30 bg-primary/10 flex items-center justify-center">
                      <Cpu size={22} className="text-primary" />
                      <span className="absolute inset-0 rounded-2xl animate-ping border border-primary/15" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { icon: TerminalSquare, label: "Software architecture", value: "ACTIVE", percent: 92 },
                      { icon: Bot, label: "AI intelligence layer", value: "ONLINE", percent: 84 },
                      { icon: Database, label: "Cloud data systems", value: "SYNCED", percent: 96 },
                    ].map((row) => (
                      <div key={row.label} className="hero-system-row">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="hero-system-icon"><row.icon size={16} /></span>
                          <div className="min-w-0">
                            <p className="text-sm text-white/80 truncate">{row.label}</p>
                            <div className="mt-2 h-[2px] bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${row.percent}%` }}
                                transition={{ duration: 1.2, delay: 0.7, ease }}
                                className="h-full bg-primary"
                              />
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] tracking-[0.16em] text-primary">{row.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-7">
                    {[
                      ["24/7", "SYSTEM"],
                      ["99.9%", "UPTIME"],
                      ["GLOBAL", "SCALE"],
                    ].map(([value, label]) => (
                      <div key={label} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                        <p className="text-lg font-semibold">{value}</p>
                        <p className="mt-1 text-[9px] tracking-[0.18em] text-white/30">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -right-7 -bottom-8 w-40 h-40 border border-primary/15 rounded-full" />
              <div className="absolute -right-2 -bottom-3 w-24 h-24 border border-white/10 rounded-full" />
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/[0.06] bg-black/35 backdrop-blur-xl">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 h-16 flex items-center justify-between text-[10px] md:text-xs tracking-[0.18em] text-white/28">
            <span>TERQIVO TECHNOLOGY COMPANY</span>
            <span className="hidden md:inline">SCROLL TO DISCOVER</span>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-b border-white/[0.06] relative">
        <div className="absolute inset-0 section-radial pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid lg:grid-cols-[.8fr_1.2fr] gap-12 lg:gap-20 items-end mb-16 md:mb-24"
          >
            <motion.div variants={reveal}>
              <span className="section-kicker">WHAT WE ENGINEER</span>
              <h2 className="section-title mt-5">Technology with real impact.</h2>
            </motion.div>
            <motion.p variants={reveal} className="text-lg md:text-xl text-white/45 leading-relaxed max-w-2xl lg:ml-auto">
              We combine product thinking, engineering excellence and intelligent technology to create systems people can rely on.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 border border-white/[0.07] rounded-[2rem] overflow-hidden bg-white/[0.015]">
            {services.map((service, index) => (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: index * 0.1, ease }}
                className="service-panel group"
              >
                <div className="flex justify-between items-start mb-16">
                  <span className="service-icon"><service.icon size={24} /></span>
                  <span className="text-xs tracking-[0.2em] text-white/20">{service.number}</span>
                </div>
                <h3 className="text-2xl md:text-[1.7rem] font-medium tracking-tight mb-4">{service.title}</h3>
                <p className="text-white/42 leading-relaxed mb-10">{service.description}</p>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => <span className="service-tag" key={tag}>{tag}</span>)}
                </div>
                <ArrowUpRight className="absolute right-7 bottom-7 text-white/15 group-hover:text-primary transition-all group-hover:-translate-y-1 group-hover:translate-x-1" size={22} />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-36 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease }}
              className="product-card product-card-primary"
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <span className="section-kicker text-white/55">FLAGSHIP PRODUCT</span>
                  <Link to="/products" className="round-link"><ArrowUpRight size={20} /></Link>
                </div>
                <div className="mt-auto pt-28">
                  <p className="text-sm text-white/45 mb-3">AI Desktop Intelligence</p>
                  <h3 className="text-5xl md:text-7xl font-semibold tracking-[-0.055em] leading-none mb-6">Manos AI</h3>
                  <p className="text-lg text-white/55 max-w-lg leading-relaxed">
                    A powerful AI assistant designed to make computers more intelligent, useful and human.
                  </p>
                </div>
              </div>
              <div className="product-orbit" />
              <div className="absolute right-[-10%] top-[12%] opacity-30"><Cpu size={260} strokeWidth={0.35} /></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.12, ease }}
              className="product-card bg-card border border-border"
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <span className="section-kicker">COMPANY PLATFORM</span>
                  <Link to="/about" className="round-link"><ArrowUpRight size={20} /></Link>
                </div>
                <div className="mt-auto pt-28">
                  <p className="text-sm text-white/35 mb-3">Building beyond software</p>
                  <h3 className="text-5xl md:text-7xl font-semibold tracking-[-0.055em] leading-none mb-6">Terqivo</h3>
                  <p className="text-lg text-white/45 max-w-lg leading-relaxed">
                    A technology company creating software, AI products and platforms for the next generation.
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 product-grid opacity-50" />
              <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full border border-primary/15" />
              <div className="absolute -right-4 -top-4 w-44 h-44 rounded-full border border-white/[0.06]" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 border-y border-white/[0.06] bg-white/[0.012]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.07] border border-white/[0.07] rounded-[1.75rem] overflow-hidden">
            {strengths.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card p-8 md:p-10"
              >
                <item.icon size={22} className="text-primary mb-8" />
                <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-white/35 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 md:py-40 relative overflow-hidden">
        <div className="absolute inset-0 cta-glow pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease }}
          className="max-w-5xl mx-auto px-6 text-center relative z-10"
        >
          <span className="section-kicker">YOUR NEXT IDEA STARTS HERE</span>
          <h2 className="text-5xl md:text-8xl font-semibold tracking-[-0.06em] leading-[0.94] mt-7 mb-9">
            Let&apos;s build something <span className="text-primary">remarkable.</span>
          </h2>
          <p className="text-lg md:text-xl text-white/42 max-w-2xl mx-auto mb-11 leading-relaxed">
            Partner with Terqivo to transform your idea into a product built for the future.
          </p>
          <Link to="/contact" className="hero-primary-button inline-flex group">
            Talk to Terqivo
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
