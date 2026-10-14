"use client";
import React, { useState } from "react";
import "./faqs.css";

export default function FaqAccordion({ faqData }) {
  // Track which accordion item is currently open (null = all closed)
  const [activeQuestionId, setActiveQuestionId] = useState(null);

  const toggleAccordion = (questionId) => {
    setActiveQuestionId((prev) => (prev === questionId ? null : questionId));
  };

  if (!faqData || faqData.length === 0) {
    return (
      <section className="faq-section pt-lg-2 pt-md-5 pb-lg-5 pb-md-5 pb-3 pt-0">
        <div className="container">
          <div className="text-center py-5">
            <p className="text-muted">No FAQs available.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="faq-section pt-lg-2 pt-md-5 pb-lg-5 pb-md-5 pb-3 pt-0">
      <div className="container">
        <div className="accordion" id="faqAccordion">
          {faqData.map((section, sectionIndex) => (
            <div key={section._id || section.sectionName}>
              {/* Category Header */}
              <h3 className="mt-4 mb-3 text-dark">{section.sectionName}</h3>

              {/* Questions within the Category */}
              {section.questions.map((item, questionIndex) => {
                const isExpanded = activeQuestionId === item._id;
                // Generate a unique ID format matching the old layout if necessary,
                // though React state handles the actual logic now.
                const itemId = `faq-${section.sectionName.replace(/\s+/g, "-").toLowerCase()}-${sectionIndex}-${questionIndex}`;

                return (
                  <div
                    key={item._id}
                    className="accordion-item mb-3 border rounded"
                  >
                    <h2 className="accordion-header" id={`${itemId}-heading`}>
                      <button
                        className={`accordion-button ${isExpanded ? "" : "collapsed"}`}
                        onClick={() => toggleAccordion(item._id)}
                        type="button"
                        aria-expanded={isExpanded}
                      >
                        {item.question}
                      </button>
                    </h2>

                    {/* Collapsible Answer Body */}
                    <div
                      id={`${itemId}-collapse`}
                      className={`accordion-collapse collapse ${isExpanded ? "show" : ""}`}
                      aria-labelledby={`${itemId}-heading`}
                    >
                      <div
                        className="accordion-body faq-answer-content ql-content"
                        dangerouslySetInnerHTML={{ 
                          __html: item.answer.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ') 
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
