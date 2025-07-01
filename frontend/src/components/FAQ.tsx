"use client";
import { useState } from "react";

interface FAQProps {
  faq: Array<{ question: string; answer: string }>;
}

export default function FAQ({ faq }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number): void => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white">
      <div className="container max-w-4xl  md:px-0 px-6    mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 lg:text-3xl">
          Frequently Asked Questions
        </h2>

        <div className="mt-8 space-y-8">
          {faq.map((faqItem, index) => (
            <div key={index} className="border-2 border-gray-100 rounded-lg">
              <button
                className="flex items-center justify-between w-full p-6"
                onClick={() => toggleFAQ(index)}
              >
                <p className="font-semibold text-gray-700">{faqItem.question}</p>

                <span className="text-gray-700 bg-gray-200 rounded-full p-2">
                  {openIndex === index ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M18 12H6"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  )}
                </span>
              </button>

              {openIndex === index && (
                <p className="p-6 text-sm text-gray-500">{faqItem.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}