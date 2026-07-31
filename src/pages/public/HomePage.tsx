import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Cloud,
  Code2,
  Database,
  Layers3,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { useSettings } from '../../context/SettingsContext';

const services = [
  { icon: Code2, title: 'Custom software', text: 'Business platforms, internal tools and desktop systems designed around how your team actually works.' },
  { icon: Bot, title: 'Applied AI', text: 'Practical assistants, automation and intelligent features that improve real workflows.' },
  { icon: Cloud, title: 'Cloud & backend', text: 'Secure APIs, databases, deployment and infrastructure built for dependable growth.' },
  { icon: Smartphone, title: 'Web & mobile', text: 'Fast, accessible interfaces for websites, SaaS products and mobile applications.' },
];

const steps = [
  ['01', 'Understand', 'We clarify the business goal, users, constraints and success criteria.'],
  ['02', 'Plan', 'We define the product structure, technical approach and delivery roadmap.'],
  ['03', 'Build', 'We ship visible progress in focused stages with direct communication.'],
  ['04', 'Launch', 'We deploy carefully, support the handover and improve from real feedback.'],
];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function HomePage() {
  const { general } = useSettings();

  return (
    <div className="vault-home">
      <SEO title={general?.companyName || 'TERQIVO'} description={general?.description || 'Terqivo builds dependable software, AI products and digital systems.'} />

      <section className="vault-hero">
        <div className="vault-shell vault-hero-grid">
          <motion.div className="vault-hero-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, ease }}>
            <div className="vault-eyebrow"><Sparkles size={15}/> Independent software company · Pakistan</div>
            <h1>Build your digital future <span>with confidence.</span></h1>
            <p>{general?.description || 'Terqivo designs and engineers dependable software, AI products, cloud systems and digital experiences for ambitious teams.'}</p>
            <div className="vault-actions">
              <Link to="/contact" className="vault-btn vault-btn-gold">Start a project <ArrowRight size={18}/></Link>
              <Link to="/products" className="vault-btn vault-btn-outline">Explore products <ArrowUpRight size={17}/></Link>
            </div>
            <div className="vault-trust">
              <span><CheckCircle2 size={16}/> Selected new projects</span>
              <span><ShieldCheck size={16}/> Confidential by default</span>
              <span><Workflow size={16}/> Clear delivery process</span>
            </div>
          </motion.div>

          <motion.div className="vault-hero-media" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .75, delay: .1, ease }}>
            <img src="/images/agentai/operations-management.jpg" alt="Software team collaborating on a digital product" />
            <div className="vault-return-card"><span><ArrowUpRight size={23}/></span><div><strong>From idea to release</strong><small>Strategy · Design · Engineering</small></div></div>
            <div className="vault-mini-card"><Database size={19}/><div><strong>Scalable systems</strong><small>Cloud-ready foundations</small></div></div>
          </motion.div>
        </div>
      </section>

      <section className="vault-metrics">
        <div className="vault-shell vault-metrics-grid">
          <div><strong>Full-stack</strong><span>Product engineering</span></div>
          <div><strong>AI-ready</strong><span>Intelligent workflows</span></div>
          <div><strong>Cloud-first</strong><span>Reliable deployment</span></div>
          <div><strong>Direct</strong><span>Founder-led communication</span></div>
        </div>
      </section>

      <section className="vault-section vault-section-light">
        <div className="vault-shell">
          <div className="vault-heading-row"><div><p className="vault-kicker">What we build</p><h2>Software that solves real business problems.</h2></div><p>We choose technology after understanding the problem, not before. Every solution is designed to remain clear, maintainable and useful after launch.</p></div>
          <div className="vault-service-grid">
            {services.map((item, index) => (
              <motion.article key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .06 }}>
                <span className="vault-service-icon"><item.icon size={23}/></span>
                <h3>{item.title}</h3><p>{item.text}</p>
                <Link to="/services">View services <ArrowUpRight size={15}/></Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="vault-section vault-story">
        <div className="vault-shell vault-story-grid">
          <motion.div className="vault-story-image" initial={{ opacity: 0, x: -25 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}><img src="/images/agentai/customer-service.jpg" alt="Technology team reviewing software work" /></motion.div>
          <motion.div className="vault-story-copy" initial={{ opacity: 0, x: 25 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="vault-kicker">How we work</p><h2>Serious engineering without unnecessary complexity.</h2>
            <p>You work directly with the people responsible for the outcome. We keep the process visible, communication honest and technical decisions practical.</p>
            <ul><li><CheckCircle2 size={18}/> Clear scope before development</li><li><CheckCircle2 size={18}/> Working releases instead of vague updates</li><li><CheckCircle2 size={18}/> Clean handover and continued support</li></ul>
            <Link to="/about" className="vault-text-link">Learn about Terqivo <ArrowRight size={16}/></Link>
          </motion.div>
        </div>
      </section>

      <section className="vault-section vault-section-light">
        <div className="vault-shell">
          <div className="vault-heading-row vault-heading-row-compact"><div><p className="vault-kicker">Our process</p><h2>A dependable path from idea to launch.</h2></div></div>
          <div className="vault-process-grid">{steps.map(([n,title,text]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        </div>
      </section>

      <section className="vault-section">
        <div className="vault-shell vault-product">
          <div className="vault-product-copy"><p className="vault-kicker vault-kicker-gold">A Terqivo product</p><h2>Manos AI</h2><p>An intelligent desktop assistant being developed to make everyday computer work simpler, faster and more natural.</p><Link to="/products" className="vault-btn vault-btn-gold">Explore Manos AI <ArrowRight size={17}/></Link></div>
          <div className="vault-product-image"><img src="/images/agentai/data-analysis.jpg" alt="Manos AI software workspace" /></div>
        </div>
      </section>

      <section className="vault-cta"><div className="vault-shell"><div><p className="vault-kicker vault-kicker-gold">Have a project in mind?</p><h2>Let’s build software your team can rely on.</h2></div><Link to="/contact" className="vault-btn vault-btn-gold">Start a conversation <ArrowRight size={18}/></Link></div></section>
    </div>
  );
}
