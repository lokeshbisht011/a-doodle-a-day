import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_DATA = [
  {
    question: "What is A-Doodle-A-Day?",
    answer:
      "A-Doodle-A-Day is a web app designed to help you build a consistent creative habit. We provide a new, inspiring prompt every day to spark your imagination and a community to share your creations with.",
  },
  {
    question: "Do I have to be an artist to join?",
    answer:
      "Absolutely not! Our community is for everyone, from complete beginners to seasoned artists. The goal is to build a fun, low-pressure habit, not to create a masterpiece. Your doodle can be as simple as a line or a shape.",
  },
  {
    question: "How do I participate in the daily prompt?",
    answer:
      "Every day at midnight, a new prompt becomes available. You can use our in-app editor or any other tool you like. Once you're done, simply upload your doodle to share it with the community.",
  },
  {
    question: "What are streaks and badges?",
    answer:
      "Streaks are a way to track your consistency. The more consecutive days you doodle, the longer your streak. Badges are achievements you unlock by reaching certain milestones, like creating your first doodle or receiving a certain number of likes.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-20 gradient-soft">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Got a question? We have answers. If you can't find what you're
            looking for, feel free to reach out to our community.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {FAQ_DATA.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
