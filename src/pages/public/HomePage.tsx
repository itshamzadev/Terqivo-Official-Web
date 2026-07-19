import { apiFetch } from '../../lib/api';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal, Cpu, Globe, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import { useSettings } from '../../context/SettingsContext';
import SEO from '../../components/SEO';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function HomePage() {
  const [content, setContent] = useState<any>(null);
  const { general } = useSettings();

  useEffect(() => {
    apiFetch('/api/public/page/home')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setContent(data))
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col bg-background selection:bg-primary selection:text-primary-foreground overflow-hidden">
      <SEO 
        title={content?.title || general?.companyName || 'TERQIVO'} 
        description={general?.description} 
      />
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex flex-col justify-center pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden border-b border-border/30">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none -translate-x-1/4 translate-y-1/3" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-5xl"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-border/60 bg-secondary/80 backdrop-blur-md text-xs font-medium text-foreground mb-10 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Engineering the future
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl lg:text-[10rem] font-semibold tracking-tighter leading-[0.95] mb-10 text-foreground">
              {content?.title ? (
                content.title
              ) : (
                <>
                  We build <br className="hidden md:block" />
                  <span className="text-muted-foreground/80">the future.</span>
                </>
              )}
            </motion.h1>
            
            <motion.div variants={itemVariants}>
              {content?.content ? (
                <div className="prose prose-invert max-w-2xl mb-14 text-muted-foreground text-xl md:text-2xl leading-relaxed">
                  <Markdown>{content.content}</Markdown>
                </div>
              ) : (
                <p className="text-xl md:text-3xl text-muted-foreground max-w-3xl mb-14 leading-relaxed font-light">
                  {general?.description ||
                    'TERQIVO is a technology company specializing in custom software architecture, artificial intelligence, and enterprise cloud solutions.'}
                </p>
              )}
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <Link
                to="/contact"
                className="group px-9 py-4 bg-primary text-primary-foreground rounded-full font-medium text-[15px] transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_35px_rgba(220,38,38,0.5)] flex items-center gap-2.5 active:scale-95"
              >
                Start a project
                <motion.span
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
                >
                  <ArrowRight size={18} />
                </motion.span>
              </Link>
              <Link
                to="/services"
                className="px-9 py-4 bg-transparent border border-border/80 text-foreground rounded-full font-medium text-[15px] hover:bg-secondary transition-all hover:border-border duration-300 active:scale-95"
              >
                Explore our services
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-32 bg-secondary/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="flex flex-col md:flex-row items-start md:items-end justify-between mb-24 gap-8"
          >
            <div>
              <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 text-foreground leading-[1.1]">Core Capabilities</h2>
              <p className="text-muted-foreground max-w-xl text-lg md:text-xl leading-relaxed">
                Comprehensive engineering solutions designed to scale. From infrastructure to user experience.
              </p>
            </div>
            <Link
              to="/services"
              className="group text-sm font-medium transition-colors flex items-center gap-2 border-b border-primary/30 hover:border-primary pb-1 text-muted-foreground hover:text-foreground"
            >
              View all services 
              <motion.span className="inline-block" whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                <ArrowRight size={16} />
              </motion.span>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: <Terminal size={26} strokeWidth={1.5} />,
                title: 'Custom Software',
                description: 'Full-stack web and mobile applications built with modern architectures like React, Node, and Go.',
              },
              {
                icon: <Cpu size={26} strokeWidth={1.5} />,
                title: 'AI Solutions',
                description: 'Integration of large language models, machine learning pipelines, and intelligent automation.',
              },
              {
                icon: <Globe size={26} strokeWidth={1.5} />,
                title: 'Cloud Infrastructure',
                description: 'Scalable cloud-native architectures on AWS and GCP with robust CI/CD pipelines.',
              },
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className="p-10 md:p-12 rounded-[2.5rem] bg-card/40 backdrop-blur-sm border border-border/60 hover:border-border transition-all duration-300 group hover:bg-card/80"
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary/80 flex items-center justify-center mb-10 text-foreground border border-border/50 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 shadow-sm group-hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-5 tracking-tight text-foreground">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products/Software */}
      <section className="py-32 relative border-t border-border/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-24 text-foreground leading-[1.1]">Featured Software</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="group rounded-[3rem] bg-card border border-border/60 overflow-hidden flex flex-col h-[600px] hover:border-border transition-colors relative"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 pointer-events-none z-10" />
              <div className="p-12 flex-1 relative z-20">
                <div className="flex justify-between items-start mb-8">
                  <h3 className="text-3xl lg:text-4xl font-semibold tracking-tight">Nexus Data</h3>
                  <Link
                    to="/products/nexus"
                    className="w-14 h-14 rounded-full bg-secondary/80 backdrop-blur-sm border border-border/60 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110 shadow-sm"
                  >
                    <ArrowUpRight size={26} strokeWidth={1.5} />
                  </Link>
                </div>
                <p className="text-muted-foreground mb-8 max-w-sm text-lg leading-relaxed">
                  High-performance data aggregation and analytics platform designed for real-time enterprise observability.
                </p>
              </div>
              <div className="h-[55%] bg-secondary/20 p-8 flex items-center justify-center relative overflow-hidden">
                {/* Abstract UI representation */}
                <motion.div
                  whileHover={{ rotate: 0, scale: 1.05 }}
                  className="w-full max-w-md bg-background border border-border/60 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] p-6 transform rotate-2 transition-all duration-500 z-0"
                >
                  <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                    <div className="w-3 h-3 rounded-full bg-border" />
                    <div className="w-3 h-3 rounded-full bg-border" />
                    <div className="w-3 h-3 rounded-full bg-border" />
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-secondary rounded-md w-3/4" />
                    <div className="h-4 bg-secondary rounded-md w-1/2" />
                    <div className="h-28 bg-secondary/40 rounded-xl border border-border/50 mt-8" />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="group rounded-[3rem] bg-card border border-border/60 overflow-hidden flex flex-col h-[600px] hover:border-border transition-colors relative"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 pointer-events-none z-10" />
              <div className="p-12 flex-1 relative z-20">
                <div className="flex justify-between items-start mb-8">
                  <h3 className="text-3xl lg:text-4xl font-semibold tracking-tight">TERQIVO ID</h3>
                  <Link
                    to="/products/identity"
                    className="w-14 h-14 rounded-full bg-secondary/80 backdrop-blur-sm border border-border/60 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110 shadow-sm"
                  >
                    <ArrowUpRight size={26} strokeWidth={1.5} />
                  </Link>
                </div>
                <p className="text-muted-foreground mb-8 max-w-sm text-lg leading-relaxed">
                  Secure, unified authentication and authorization service for distributed microservice architectures.
                </p>
              </div>
              <div className="h-[55%] bg-secondary/20 p-8 flex items-center justify-center relative overflow-hidden">
                {/* Abstract UI representation */}
                <motion.div
                  whileHover={{ rotate: 0, scale: 1.05 }}
                  className="w-full max-w-xs bg-background border border-border/60 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] p-8 transform -rotate-2 transition-all duration-500 z-0"
                >
                  <div className="h-14 bg-secondary/50 rounded-xl mb-8 flex items-center justify-center border border-border/50">
                    <div className="w-6 h-6 bg-primary rounded-md" />
                  </div>
                  <div className="space-y-5">
                    <div className="h-12 bg-card border border-border/60 rounded-xl" />
                    <div className="h-12 bg-card border border-border/60 rounded-xl" />
                    <div className="h-14 bg-primary rounded-xl mt-6 shadow-[0_0_20px_rgba(220,38,38,0.3)]" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Courses CTA */}
      <section className="py-32 lg:py-40 border-t border-border/30 relative overflow-hidden bg-secondary/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-8 text-foreground">Education & Training</h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
              We don't just build technology, we teach it. Explore professional courses in Software Engineering, AI, and System Architecture taught by our lead engineers.
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2.5 px-9 py-4 bg-secondary text-foreground border border-border/60 rounded-full hover:bg-secondary/80 transition-all hover:scale-105 active:scale-95 font-medium text-[15px]"
            >
              View available courses <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
