import { motion } from 'motion/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/src/components/ui/accordion';

export function CoursesFAQ() {
  const faqs = [
    {
      question: "How do I enroll in a course?",
      answer: "When a course is published and open for enrollment, you can click the 'View Course' button to see details and use the enrollment form provided on that page."
    },
    {
      question: "Are courses online or in person?",
      answer: "Delivery format is shown on each published course. Terqivo offers a range of formats depending on the subject matter and learning goals."
    },
    {
      question: "Are courses suitable for beginners?",
      answer: "The required experience level is clearly stated on each course listing. We provide courses ranging from foundational topics to advanced engineering concepts."
    },
    {
      question: "Will I receive a certificate?",
      answer: "Certificate availability depends on the specific course. Details regarding recognition or completion certificates are provided in the course description."
    },
    {
      question: "Are courses free or paid?",
      answer: "Pricing and access details are shown when a course is published. We offer both open educational resources and premium structured learning programs."
    },
    {
      question: "Can I access course material after completion?",
      answer: "Access policies depend on the specific course and its delivery format. This information will be clearly outlined prior to enrollment."
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
