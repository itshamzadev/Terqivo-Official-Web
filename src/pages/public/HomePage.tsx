import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  Code2,
  Cloud,
  Cpu,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";
import { useSettings } from "../../context/SettingsContext";

const services = [
  {
    icon: Code2,
    tone: "blue",
    title: "Software products",
    text: "Web platforms, business systems and desktop software designed around real operations.",
  },
  {
    icon: Cpu,
    tone: "mint",
    title: "Applied AI",
    text: "Useful assistants, automation and intelligent features built for real work, not demos.",
  },
  {
    icon: Cloud,
    tone: "violet",
    title: "Cloud & backend",
    text: "APIs, databases, deployment and infrastructure foundations that stay dependable as you grow.",
  },
  {
    icon: Smartphone,
    tone: "coral",
    title: "Digital experiences",
    text: "Clear, fast interfaces across web and mobile with careful attention to every small detail.",
  },
];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function HomePage() {
  const { general } = useSettings();

  return (
    <div className="tq-home">
      <SEO title={general?.companyName || "TERQIVO"} description={general?.description} />

      <section className="tq-hero">
        <div className="tq-shell tq-hero-grid">
          <motion.div
            className="tq-hero-copy"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.68, ease }}
          >
            <p className="tq-eyebrow"><span /> Independent software company · Pakistan</p>
            <h1>We design and build software people <em>enjoy using.</em></h1>
            <p className="tq-lead">
              {general?.description ||
                "Terqivo works with ambitious teams to turn ideas, operations and opportunities into thoughtful digital products."}
            </p>

            <div className="tq-actions">
              <Link to="/contact" className="tq-btn tq-btn-primary">Discuss a project <ArrowUpRight size={17} /></Link>
              <Link to="/products" className="tq-btn tq-btn-secondary">See our products <ArrowUpRight size={17} /></Link>
            </div>

            <div className="tq-trust-row">
              <span><Check size={16} /> Currently taking projects</span>
              <span><Clock3 size={16} /> Reply within 1 business day</span>
              <span><ShieldCheck size={16} /> Confidential & secure</span>
            </div>
          </motion.div>

          <motion.div
            className="tq-hero-visual"
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.78, delay: 0.08, ease }}
          >
            <img
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=88"
              alt="Modern software team workspace"
            />
            <div className="tq-dot-pattern" aria-hidden="true" />
            <div className="tq-image-card">
              <span className="tq-image-card-icon"><Cpu size={19} /></span>
              <span><strong>From idea to release</strong><small>Strategy · Design · Engineering</small></span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="tq-stack-strip">
        <div className="tq-shell">
          <p>Built with modern, proven technology</p>
          <div className="tq-stack-list">
            <span>React</span><span>Node.js</span><span>MongoDB</span><span>TypeScript</span><span>Python</span><span>Docker</span><span>AWS</span>
          </div>
        </div>
      </section>

      <section className="tq-section tq-services">
        <div className="tq-shell">
          <div className="tq-section-head">
            <div><p className="tq-kicker">What we do</p><h2>Good software starts with understanding the problem.</h2></div>
            <p>We keep the process direct: learn the business, make the right decisions, build carefully, and improve with real feedback.</p>
          </div>

          <div className="tq-service-grid">
            {services.map((service, index) => (
              <motion.div key={service.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.5, delay: index * 0.06, ease }}>
                <Link to="/services" className="tq-service-card">
                  <span className={`tq-service-icon tq-service-icon--${service.tone}`}><service.icon size={22} /></span>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                  <span className="tq-learn">Learn more <ArrowUpRight size={15} /></span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="tq-section tq-process">
        <div className="tq-shell tq-process-grid">
          <div className="tq-process-copy">
            <p className="tq-kicker">How we work</p>
            <h2>Small team. Clear communication. Serious craft.</h2>
            <p>You work directly with the people responsible for the outcome. No unnecessary layers, no vague handoffs, and no hidden progress.</p>
            <ul>
              <li><Check size={18} /> Practical scope before development</li>
              <li><Check size={18} /> Visible progress throughout the project</li>
              <li><Check size={18} /> Clean handover and ongoing support</li>
            </ul>
            <Link to="/about" className="tq-inline-link">Learn about Terqivo <ArrowRight size={16} /></Link>
          </div>
          <div className="tq-process-image">
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1500&q=88" alt="Team planning a digital product" />
          </div>
        </div>
      </section>

      <section className="tq-section tq-product">
        <div className="tq-shell tq-product-panel">
          <div className="tq-product-copy">
            <p className="tq-kicker tq-kicker-light">A product by Terqivo</p>
            <h2>Manos AI</h2>
            <p>An intelligent desktop assistant designed to make everyday computer work simpler, faster and more natural.</p>
            <Link to="/products" className="tq-btn tq-btn-white">Explore Manos AI <ArrowRight size={17} /></Link>
          </div>
          <div className="tq-product-image">
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=88" alt="Manos AI product workspace" />
          </div>
        </div>
      </section>

      <section className="tq-final-cta">
        <div className="tq-shell">
          <div><p className="tq-kicker">Have something in mind?</p><h2>Let’s make it useful, clear and built to last.</h2></div>
          <Link to="/contact" className="tq-btn tq-btn-primary">Start a conversation <ArrowRight size={17} /></Link>
        </div>
      </section>
    </div>
  );
}
