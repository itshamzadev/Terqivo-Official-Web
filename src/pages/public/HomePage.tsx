import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  Cloud,
  Cpu,
  Smartphone,
} from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";
import { useSettings } from "../../context/SettingsContext";

const services = [
  {
    n: "01",
    icon: Code2,
    title: "Software products",
    text: "Web platforms, business systems and desktop software made around the way your team actually works.",
  },
  {
    n: "02",
    icon: Cpu,
    title: "Applied AI",
    text: "Useful assistants, automation and intelligent features—designed for real tasks, not demos.",
  },
  {
    n: "03",
    icon: Cloud,
    title: "Cloud & backend",
    text: "APIs, databases, infrastructure and deployment foundations that stay dependable as you grow.",
  },
  {
    n: "04",
    icon: Smartphone,
    title: "Digital experiences",
    text: "Clear, fast interfaces across web and mobile with careful attention to the small details.",
  },
];

const ease = [0.22, 1, 0.36, 1] as [
  number,
  number,
  number,
  number,
];

export default function HomePage() {
  const { general } = useSettings();

  return (
    <div className="human-home">
      <SEO
        title={general?.companyName || "TERQIVO"}
        description={general?.description}
      />

      <section className="human-hero">
        <div className="human-container human-hero-grid">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease }}
          >
            <p className="human-overline">
              Independent software company · Pakistan
            </p>

            <h1>We design and build software people enjoy using.</h1>

            <p className="human-lead">
              {general?.description ||
                "Terqivo works with ambitious teams to turn ideas, operations and opportunities into thoughtful digital products."}
            </p>

            <div className="human-actions">
              <Link
                to="/contact"
                className="human-btn human-btn-dark"
              >
                Discuss a project
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/products"
                className="human-text-link"
              >
                See our products
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="human-note">
              <span>Currently taking selected projects</span>
              <span>Typical reply within 1 business day</span>
            </div>
          </motion.div>

          <motion.div
            className="human-collage"
            initial={{ opacity: 0, x: 34 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.85,
              delay: 0.12,
              ease,
            }}
          >
            <figure className="human-photo human-photo-main">
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1500&q=88"
                alt="Software team working together"
              />
            </figure>

            <figure className="human-photo human-photo-small">
              <img
                src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=88"
                alt="Modern technology workspace"
              />
            </figure>

            <div className="human-caption">
              <strong>From idea to release</strong>
              <span>Strategy · Design · Engineering</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="human-proof">
        <div className="human-container human-proof-grid">
          <p>Built with modern, proven technology</p>

          <div>
            <span>React</span>
            <span>Node.js</span>
            <span>MongoDB</span>
            <span>Python</span>
            <span>Docker</span>
          </div>
        </div>
      </section>

      <section className="human-section">
        <div className="human-container">
          <div className="human-section-intro">
            <p className="human-overline">What we do</p>

            <h2>
              Good software starts with understanding the problem.
            </h2>

            <p>
              We keep the process direct: learn the business, make the right
              decisions, build carefully, and improve with real feedback.
            </p>
          </div>

          <div className="human-service-list">
            {services.map((service) => (
              <Link
                to="/services"
                key={service.n}
                className="human-service-row"
              >
                <span className="human-index">{service.n}</span>

                <span className="human-service-icon">
                  <service.icon size={20} />
                </span>

                <div>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </div>

                <ArrowUpRight
                  className="human-row-arrow"
                  size={21}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="human-work-section">
        <div className="human-container human-work-grid">
          <div className="human-work-photo">
            <img
              src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1500&q=88"
              alt="Team reviewing a digital product"
            />
          </div>

          <div className="human-work-copy">
            <p className="human-overline">How we work</p>

            <h2>
              Small team. Clear communication. Serious craft.
            </h2>

            <p>
              There are no layers of account managers between you and the
              people making the product. You work directly with the team
              responsible for the outcome.
            </p>

            <ul>
              <li>
                <Check size={17} />
                Practical scope before development
              </li>

              <li>
                <Check size={17} />
                Visible progress throughout the project
              </li>

              <li>
                <Check size={17} />
                Clean handover and ongoing support
              </li>
            </ul>

            <Link
              to="/about"
              className="human-text-link"
            >
              Learn about Terqivo
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="human-product-section">
        <div className="human-container human-product-card">
          <div>
            <p className="human-overline">
              A product by Terqivo
            </p>

            <h2>Manos AI</h2>

            <p>
              An intelligent desktop assistant designed to make everyday
              computer work simpler, faster and more natural.
            </p>

            <Link
              to="/products"
              className="human-btn human-btn-light"
            >
              Explore Manos AI
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="human-product-image">
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=88"
              alt="Manos AI product workspace"
            />
          </div>
        </div>
      </section>

      <section className="human-cta">
        <div className="human-container">
          <p className="human-overline">
            Have something in mind?
          </p>

          <div>
            <h2>
              Let’s make it useful, clear and built to last.
            </h2>

            <Link
              to="/contact"
              className="human-btn human-btn-dark"
            >
              Start a conversation
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}