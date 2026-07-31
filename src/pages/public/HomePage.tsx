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
  Building2,
  Rocket,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";
import { useSettings } from "../../context/SettingsContext";

const services = [
  { icon: Code2, tone: "blue", title: "Custom software", text: "Business platforms, internal systems and desktop software shaped around real workflows." },
  { icon: Cpu, tone: "mint", title: "Applied AI", text: "Practical assistants, automation and AI features that save time and improve everyday work." },
  { icon: Cloud, tone: "violet", title: "Cloud & backend", text: "Secure APIs, databases, deployment pipelines and infrastructure designed for dependable growth." },
  { icon: Smartphone, tone: "coral", title: "Web & mobile", text: "Fast, accessible interfaces for websites, SaaS products and mobile applications." },
];

const audiences = [
  { icon: Rocket, title: "Startups", text: "Move from idea to a credible first release without building unnecessary complexity." },
  { icon: Building2, title: "Growing businesses", text: "Replace manual processes and disconnected tools with software that fits the operation." },
  { icon: Workflow, title: "Product teams", text: "Add focused engineering capacity for new features, integrations and technical improvements." },
];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function HomePage() {
  const { general } = useSettings();

  return (
    <div className="tq-home">
      <SEO title={general?.companyName || "TERQIVO"} description={general?.description} />

      <section className="tq-hero">
        <div className="tq-shell tq-hero-grid">
          <motion.div className="tq-hero-copy" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.66, ease }}>
            <p className="tq-eyebrow"><span /> Independent software company · Pakistan</p>
            <h1>Software built for <em>real work.</em></h1>
            <p className="tq-lead">
              {general?.description || "Terqivo designs and engineers dependable web platforms, business software, AI tools and digital products for ambitious teams."}
            </p>
            <div className="tq-actions">
              <Link to="/contact" className="tq-btn tq-btn-primary">Discuss a project <ArrowUpRight size={17} /></Link>
              <Link to="/products" className="tq-btn tq-btn-secondary">Explore our products <ArrowRight size={17} /></Link>
            </div>
            <div className="tq-trust-row">
              <span><Check size={16} /> Selected new projects</span>
              <span><Clock3 size={16} /> Reply within one business day</span>
              <span><ShieldCheck size={16} /> Confidential by default</span>
            </div>
          </motion.div>

          <motion.div className="tq-hero-visual" initial={{ opacity: 0, x: 26 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.76, delay: 0.08, ease }}>
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1800&q=90" alt="Software development team collaborating in a modern workspace" />
            <div className="tq-image-card">
              <span className="tq-image-card-icon"><Cpu size={19} /></span>
              <span><strong>From idea to dependable release</strong><small>Product thinking · Design · Engineering</small></span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="tq-stack-strip">
        <div className="tq-shell">
          <p>Technology we work with</p>
          <div className="tq-stack-list"><span>React</span><span>Node.js</span><span>MongoDB</span><span>TypeScript</span><span>Python</span><span>Docker</span><span>Cloud</span></div>
        </div>
      </section>

      <section className="tq-section tq-services">
        <div className="tq-shell">
          <div className="tq-section-head">
            <div><p className="tq-kicker">Capabilities</p><h2>Engineering that starts with the problem—not the trend.</h2></div>
            <p>We clarify what matters, choose a sensible technical direction and build software that is maintainable after launch.</p>
          </div>
          <div className="tq-service-grid">
            {services.map((service, index) => (
              <motion.div key={service.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.48, delay: index * 0.05, ease }}>
                <Link to="/services" className="tq-service-card">
                  <span className={`tq-service-icon tq-service-icon--${service.tone}`}><service.icon size={22} /></span>
                  <h3>{service.title}</h3><p>{service.text}</p><span className="tq-learn">View services <ArrowUpRight size={15} /></span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="tq-section tq-process">
        <div className="tq-shell tq-process-grid">
          <div className="tq-process-image"><img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1700&q=90" alt="Product and engineering team discussing software requirements" /></div>
          <div className="tq-process-copy">
            <p className="tq-kicker">How we work</p><h2>Clear decisions. Visible progress. No theatre.</h2>
            <p>You work directly with the people responsible for the outcome. We keep communication practical and make progress easy to understand.</p>
            <ul><li><Check size={18} /> Scope and priorities agreed before development</li><li><Check size={18} /> Regular working releases instead of vague updates</li><li><Check size={18} /> Clean documentation, handover and continued support</li></ul>
            <Link to="/about" className="tq-inline-link">Learn about Terqivo <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="tq-section tq-audience">
        <div className="tq-shell">
          <div className="tq-section-head tq-section-head--compact"><div><p className="tq-kicker">Who we work with</p><h2>Useful technology for teams at different stages.</h2></div></div>
          <div className="tq-audience-grid">
            {audiences.map((item) => <article key={item.title} className="tq-audience-card"><item.icon size={24}/><h3>{item.title}</h3><p>{item.text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="tq-section tq-product">
        <div className="tq-shell tq-product-panel">
          <div className="tq-product-copy"><p className="tq-kicker tq-kicker-light">A Terqivo product</p><h2>Manos AI</h2><p>An intelligent desktop assistant being developed to make everyday computer work simpler, faster and more natural.</p><Link to="/products" className="tq-btn tq-btn-white">Explore the product <ArrowRight size={17} /></Link></div>
          <div className="tq-product-image"><img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1700&q=90" alt="Developer using a laptop with software tools" /></div>
        </div>
      </section>

      <section className="tq-final-cta"><div className="tq-shell"><div><p className="tq-kicker">Have a project in mind?</p><h2>Let’s turn it into software people can rely on.</h2></div><Link to="/contact" className="tq-btn tq-btn-primary">Start a conversation <ArrowRight size={17} /></Link></div></section>
    </div>
  );
}
