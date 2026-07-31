import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Cloud,
  Code2,
  Database,
  Layers3,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { useSettings } from '../../context/SettingsContext';

const capabilities = [
  {
    icon: Code2,
    title: 'Custom software',
    text: 'Business platforms, internal systems and desktop software built around real workflows.',
  },
  {
    icon: BrainCircuit,
    title: 'Applied AI',
    text: 'AI assistants, automation and intelligent product features designed for useful daily work.',
  },
  {
    icon: Cloud,
    title: 'Cloud & backend',
    text: 'Secure APIs, databases, deployment pipelines and infrastructure designed for dependable growth.',
  },
  {
    icon: Layers3,
    title: 'Web & mobile products',
    text: 'Fast, accessible interfaces for SaaS platforms, company websites and mobile applications.',
  },
];

const process = [
  ['01', 'Discover', 'We learn the problem, users, constraints and the commercial goal before writing code.'],
  ['02', 'Design', 'We shape the product structure, interface and technical plan around what matters most.'],
  ['03', 'Build', 'We develop in visible stages with frequent reviews, reliable engineering and clear communication.'],
  ['04', 'Launch & improve', 'We support deployment, measure feedback and continue improving what creates value.'],
];

const tech = ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Python', 'Docker', 'Cloud'];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function HomePage() {
  const { general } = useSettings();

  return (
    <div className="agent-home">
      <SEO
        title={general?.companyName || 'TERQIVO'}
        description={general?.description || 'Terqivo builds software, AI products and dependable digital systems.'}
      />

      <section className="agent-hero">
        <div className="agent-container agent-hero__grid">
          <motion.div
            className="agent-hero__copy"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease }}
          >
            <div className="agent-pill"><Sparkles size={15} /> Software, AI and digital products</div>
            <h1>Technology that <span>works for people.</span></h1>
            <p>
              {general?.description || 'Terqivo designs and engineers dependable web platforms, business software, AI tools and digital products for ambitious teams.'}
            </p>
            <div className="agent-hero__actions">
              <Link to="/contact" className="agent-button agent-button--primary">Start a project <ArrowRight size={18} /></Link>
              <Link to="/products" className="agent-button agent-button--secondary">Explore our products <ArrowUpRight size={17} /></Link>
            </div>
            <div className="agent-trust-row">
              <span><CheckCircle2 size={16} /> Selected new projects</span>
              <span><Zap size={16} /> Clear, fast communication</span>
              <span><ShieldCheck size={16} /> Confidential by default</span>
            </div>
          </motion.div>

          <motion.div
            className="agent-hero__visual"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.12, ease }}
          >
            <div className="agent-orb agent-orb--one" />
            <div className="agent-orb agent-orb--two" />
            <div className="agent-workflow-card">
              <div className="agent-workflow-card__top">
                <div className="agent-logo-box"><Bot size={22} /></div>
                <div><strong>Terqivo Intelligence</strong><span>Product workflow</span></div>
                <span className="agent-status">ACTIVE</span>
              </div>
              <div className="agent-message agent-message--user">Build a reliable customer portal for our growing business.</div>
              <div className="agent-message agent-message--assistant">
                <strong>Preparing the product plan</strong>
                <span><CheckCircle2 size={15} /> Understanding users and workflows</span>
                <span><CheckCircle2 size={15} /> Designing the system architecture</span>
                <span><CheckCircle2 size={15} /> Planning security and deployment</span>
                <span><Workflow size={15} /> Creating the delivery roadmap</span>
              </div>
              <div className="agent-mini-grid">
                <div><Database size={18} /><strong>Secure data</strong><span>Structured foundations</span></div>
                <div><Cloud size={18} /><strong>Cloud ready</strong><span>Built for growth</span></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="agent-tech-strip">
        <div className="agent-container">
          <p>Technology we work with</p>
          <div>{tech.map((item) => <span key={item}>{item}</span>)}</div>
        </div>
      </section>

      <section className="agent-section agent-section--soft">
        <div className="agent-container">
          <div className="agent-section-head">
            <div><p className="agent-kicker">Capabilities</p><h2>Engineering that starts with the problem—not the trend.</h2></div>
            <p>We choose technology only after understanding the business, the users and what the product must achieve.</p>
          </div>
          <div className="agent-capability-grid">
            {capabilities.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                className="agent-capability-card"
              >
                <div className="agent-capability-icon"><item.icon size={22} /></div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <Link to="/services">View services <ArrowUpRight size={15} /></Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="agent-section">
        <div className="agent-container agent-split">
          <motion.div className="agent-photo-card" initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <img src="/images/agentai/operations-management.jpg" alt="Software team managing a digital product" />
            <div><span>Direct collaboration</span><strong>Strategy, design and engineering in one focused team.</strong></div>
          </motion.div>
          <motion.div className="agent-split__copy" initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="agent-kicker">How we work</p>
            <h2>Clear decisions. Visible progress. No theatre.</h2>
            <p>You work directly with the people responsible for the outcome. We keep communication practical and make progress easy to understand.</p>
            <ul>
              <li><CheckCircle2 size={18} /> Scope and priorities agreed before development</li>
              <li><CheckCircle2 size={18} /> Regular working releases instead of vague updates</li>
              <li><CheckCircle2 size={18} /> Clean documentation, handover and continued support</li>
            </ul>
            <Link to="/about" className="agent-inline-link">Learn about Terqivo <ArrowRight size={16} /></Link>
          </motion.div>
        </div>
      </section>

      <section className="agent-section agent-section--soft">
        <div className="agent-container">
          <div className="agent-section-head agent-section-head--compact">
            <div><p className="agent-kicker">Our process</p><h2>A practical path from idea to dependable software.</h2></div>
          </div>
          <div className="agent-process-grid">
            {process.map(([n, title, text]) => (
              <article key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="agent-section">
        <div className="agent-container agent-product-banner">
          <div className="agent-product-banner__copy">
            <p className="agent-kicker agent-kicker--light">A Terqivo product</p>
            <h2>Manos AI</h2>
            <p>An intelligent desktop assistant being developed to make everyday computer work simpler, faster and more natural.</p>
            <Link to="/products" className="agent-button agent-button--light">Explore the product <ArrowRight size={17} /></Link>
          </div>
          <div className="agent-product-banner__image">
            <img src="/images/agentai/data-analysis.jpg" alt="AI and software product interface" />
          </div>
        </div>
      </section>

      <section className="agent-section agent-cta-section">
        <div className="agent-container agent-cta-box">
          <div><p className="agent-kicker">Have a project in mind?</p><h2>Let’s turn it into software people can rely on.</h2></div>
          <Link to="/contact" className="agent-button agent-button--primary">Start a conversation <ArrowRight size={18} /></Link>
        </div>
      </section>
    </div>
  );
}
