import { motion } from 'motion/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/src/components/ui/accordion';

export function CareersFAQ() {
  const faqs = [
    {
      question: "How do I apply for a position?",
      answer: "When a role is open, you can apply through the 'View Position' button on the listing. Follow the instructions to submit your profile and any required materials."
    },
    {
      question: "Can I submit my profile without an open role?",
      answer: "Yes. You can use the General Interest section to share your profile. We review these submissions as new roles and requirements emerge."
    },
    {
      question: "Are remote opportunities available?",
      answer: "Availability depends on the requirements of each published opportunity. Specific work modes (remote, hybrid, or on-site) are clearly stated on each job listing."
    },
    {
      question: "What happens after I apply?",
      answer: "Our team reviews submissions for relevant skills and experience. If there is a potential fit, we will contact you to discuss the next steps."
    },
    {
      question: "Does Terqivo offer internships?",
      answer: "Availability depends on the requirements of each published opportunity. Any active internship programs will be listed in the open positions section."
    }
  ];

  return (
    <section className="py-24 bg-background border-b">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-heading font-bold"
          >
            Frequently asked questions
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-heading font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
