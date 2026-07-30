import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Cloud,
  Code2,
  Layers3,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";
import { HeroScene } from "../../components/3d/HeroScene";
import { useSettings } from "../../context/SettingsContext";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];
const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const services = [
  { icon: Code2, title: "Custom software", text: "Web, desktop and mobile products designed around your real business workflows.", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=85" },
  { icon: Bot, title: "AI solutions", text: "Practical AI assistants, intelligent automation and agent-powered experiences.", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=85" },
  { icon: Cloud, title: "Cloud platforms", text: "Secure infrastructure, APIs and scalable systems ready for production growth.", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=85" },
];

const capabilities = [
  { icon: ShieldCheck, title: "Secure by design", text: "Security and privacy are built into architecture from the first decision." },
  { icon: Layers3, title: "Built to scale", text: "Clean systems that can grow without becoming fragile or expensive." },
  { icon: Workflow, title: "End-to-end delivery", text: "Strategy, design, engineering, deployment and long-term improvement." },
  { icon: Sparkles, title: "Thoughtful experience", text: "Clear interfaces that feel fast, polished and easy to use." },
];

export default function HomePage() {
  const { general } = useSettings();

  return (
    <div className="home-page bg-background text-foreground overflow-hidden">
      <SEO title={general?.companyName || "TERQIVO"} description={general?.description} />

      <section className="new-hero relative min-h-[820px] flex items-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-45"><HeroScene /></div>
        <div className="new-hero-overlay absolute inset-0 pointer-events-none" />
        <div className="max-w-[1380px] mx-auto px-6 md:px-10 lg:px-14 pt-32 pb-20 relative z-10 w-full">
          <div className="grid lg:grid-cols-[1.02fr_.98fr] gap-14 lg:gap-20 items-center">
            <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }}>
              <motion.div variants={reveal} className="brand-pill mb-7">
                <span className="brand-pill-dot" /> SOFTWARE • AI • CLOUD
              </motion.div>
              <motion.h1 variants={reveal} className="new-hero-title">
                We turn ambitious ideas into <span>remarkable technology.</span>
              </motion.h1>
              <motion.p variants={reveal} className="new-hero-copy">
                {general?.description || "Terqivo designs and engineers modern software, intelligent products and digital platforms that help businesses move forward."}
              </motion.p>
              <motion.div variants={reveal} className="flex flex-col sm:flex-row gap-4 mt-9">
                <Link to="/contact" className="new-primary-btn group">Start a project <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></Link>
                <Link to="/services" className="new-secondary-btn group">Explore our work <ArrowUpRight size={17} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" /></Link>
              </motion.div>
              <motion.div variants={reveal} className="hero-trust-row">
                {["Product strategy", "Senior engineering", "Production delivery"].map((item) => (
                  <span key={item}><CheckCircle2 size={16} /> {item}</span>
                ))}
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 45 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .9, delay: .2, ease }} className="relative">
              <div className="hero-image-frame">
                <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1500&q=88" alt="Software engineering team collaborating" className="hero-team-image" />
                <div className="hero-image-shade" />
                <div className="hero-image-caption">
                  <span>From first idea to production</span>
                  <strong>Design. Build. Scale.</strong>
                </div>
              </div>
              <div className="floating-proof floating-proof-one"><span>01</span><div><b>Product thinking</b><small>Built around real users</small></div></div>
              <div className="floating-proof floating-proof-two"><span>02</span><div><b>Modern engineering</b><small>Fast, secure and scalable</small></div></div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="logo-strip">
        <div className="max-w-[1380px] mx-auto px-6 md:px-10 lg:px-14">
          <p>Technology we work with</p>
          <div className="tech-wordmarks"><span>REACT</span><span>NODE.JS</span><span>MONGODB</span><span>PYTHON</span><span>DOCKER</span><span>GEMINI</span></div>
        </div>
      </section>

      <section className="section-space">
        <div className="max-w-[1380px] mx-auto px-6 md:px-10 lg:px-14">
          <div className="section-heading-grid">
            <div><span className="new-kicker">WHAT WE BUILD</span><h2>Technology that solves real problems.</h2></div>
            <p>We combine product strategy, thoughtful design and strong engineering to deliver software that is useful, reliable and ready to grow.</p>
          </div>
          <div className="service-image-grid">
            {services.map((service, index) => (
              <motion.article key={service.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .1 }} className="service-image-card group">
                <div className="service-image-wrap"><img src={service.image} alt={service.title} /><div className="service-image-overlay" /></div>
                <div className="service-image-content"><span className="service-card-icon"><service.icon size={21} /></span><h3>{service.title}</h3><p>{service.text}</p><Link to="/services">Learn more <ArrowUpRight size={16} /></Link></div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="feature-split-section">
        <div className="max-w-[1380px] mx-auto px-6 md:px-10 lg:px-14 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="feature-photo">
            <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=88" alt="Modern cloud infrastructure" />
            <div className="feature-photo-badge"><strong>Production ready</strong><span>Secure infrastructure and reliable delivery</span></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="new-kicker">WHY TERQIVO</span>
            <h2 className="feature-title">A technology partner, not just a code vendor.</h2>
            <p className="feature-copy">We care about the product after launch. Every decision is made for clarity, performance, maintainability and long-term business value.</p>
            <div className="capability-list">
              {capabilities.map((item) => <div key={item.title}><span><item.icon size={20} /></span><div><h3>{item.title}</h3><p>{item.text}</p></div></div>)}
            </div>
            <Link to="/about" className="text-link">Discover Terqivo <ArrowRight size={17} /></Link>
          </motion.div>
        </div>
      </section>

      <section className="product-showcase-section">
        <div className="max-w-[1380px] mx-auto px-6 md:px-10 lg:px-14">
          <div className="product-showcase-card">
            <div className="product-showcase-copy"><span className="new-kicker light">FLAGSHIP PRODUCT</span><h2>Manos AI</h2><p>An intelligent desktop assistant created to make everyday computer work faster, simpler and more natural.</p><Link to="/products" className="new-light-btn">Explore products <ArrowRight size={17} /></Link></div>
            <div className="product-showcase-image"><img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=88" alt="Advanced computer technology" /></div>
          </div>
        </div>
      </section>

      <section className="final-cta-section">
        <div className="max-w-4xl mx-auto px-6 text-center"><span className="new-kicker">LET'S CREATE SOMETHING VALUABLE</span><h2>Your next product can start today.</h2><p>Tell us what you want to build. We will help shape the idea, engineer the product and prepare it for the real world.</p><Link to="/contact" className="new-primary-btn inline-flex group">Talk to Terqivo <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></Link></div>
      </section>
    </div>
  );
}
