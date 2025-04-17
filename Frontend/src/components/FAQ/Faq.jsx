import "../../styles/faq.scss";
import { useState } from "react";
import faqs from "../../configs/faqs";
const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq">
      <h2 className="section-title title">Frequently Asked Questions</h2>
      <ul className="faq-list">
        {faqs.map((faq, index) => (
          <li
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">
              {faq.question}
              <span className="faq-toggle">
                {activeIndex === index ? "−" : "+"}
              </span>
            </div>
            {activeIndex === index && (
              <div className="faq-answer">{faq.answer}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default FAQ;
