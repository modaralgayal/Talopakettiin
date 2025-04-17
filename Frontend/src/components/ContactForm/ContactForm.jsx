import { useState } from "react";
import "../../styles/contactForm.scss";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
const ContactForm = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    });
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // Fixed this line

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section name="contact" data-aos="fade-up" className="contact-section">
      <div className="heading-container">
        <div className="heading-container__content">
          <h2 className="heading-container__title title">Get in Touch</h2>
          <p className="heading-container__text">
            Have questions or want to discuss a project? Fill out the form below
            and we'll get back to you within 24 hours.
          </p>
        </div>
      </div>
      <div className="contact-container">
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group floating">
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder=" "
              required
            />
            <label htmlFor="name" className="form-label">
              Your Name
            </label>
            <div className="underline"></div>
          </div>

          <div className="form-group floating">
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder=" "
              required
            />
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div className="underline"></div>
          </div>

          <div className="form-group floating">
            <textarea
              id="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="form-textarea"
              placeholder=" "
              required
            ></textarea>
            <label htmlFor="message" className="form-label">
              Your Message
            </label>
            <div className="underline"></div>
          </div>

          <div className="form-footer">
            <button
              type="submit"
              className={`submit-button ${isSubmitting ? "submitting" : ""}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>

            {submitStatus === "success" && (
              <div className="status-message success">
                <svg viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
                Message sent successfully!
              </div>
            )}

            {submitStatus === "error" && (
              <div className="status-message error">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                Error sending message. Please try again.
              </div>
            )}
          </div>
        </form>
      </div>
      <div data-aos="fade-up" className="heading-container">
        <div className="heading-container__content">
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
              <h3 className="info-title">Email Us</h3>
              <p className="info-text">hello@example.com</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </div>
              <h3 className="info-title">Call Us</h3>
              <p className="info-text">+1 (555) 123-4567</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <h3 className="info-title">Visit Us</h3>
              <p className="info-text">
                123 Business Ave, Suite 400
                <br />
                San Francisco, CA 94107
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
