
import React, { useState } from "react";
import "./Contact.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Icon = ({ name, size = 22 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const paths = {
    location: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),

    phone: (
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 8.9a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.8 2.1Z" />
    ),

    email: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),

    send: (
      <>
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSubmitted(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSubmitted(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send your message.");
      }

      setSubmitted(true);

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError("Unable to send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">

      {/* Shared Header */}
      <Header />

      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-overlay" />

        <div className="contact-hero-content">
          <h1>Contact Us</h1>

          <p>
            We would love to hear from you! Feel free to reach out to us
            for any queries, suggestions or collaboration opportunities.
          </p>

          <div className="contact-hero-divider">
            <span />
            <img src="/images/nss-emblem.png" alt="" />
            <span />
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <main className="contact-main">

        {/* Contact Information */}
        <section className="contact-information">

          {/* Address */}
          <div className="contact-info-item">
            <div className="contact-icon-circle">
              <Icon name="location" size={25} />
            </div>

            <div className="contact-info-text">
              <h3>Our Address</h3>
              <p>
                NSS Unit, RGUKT Basar
                <br />
                Nirmal District, Telangana - 504107
                <br />
                India
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="contact-info-item">
            <div className="contact-icon-circle">
              <Icon name="phone" size={24} />
            </div>

            <div className="contact-info-text">
              <h3>Phone</h3>
              <p>
                +91 98765 43210
                <br />
                (Mon – Fri, 9:00 AM – 5:00 PM)
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="contact-info-item">
            <div className="contact-icon-circle">
              <Icon name="email" size={24} />
            </div>

            <div className="contact-info-text">
              <h3>Email</h3>
              <p>
                <a href="mailto:nss@rgukt.ac.in">
                  nss@rgukt.ac.in
                </a>
                <br />
                (We usually respond within 1–2 working days)
              </p>
            </div>
          </div>

          {/* Find Us */}
          <div className="contact-info-item contact-find-us">
            <div className="contact-icon-circle">
              <Icon name="location" size={25} />
            </div>

            <div className="contact-info-text">
              <h3>Find Us</h3>
              <p>
                RGUKT Basar Campus
                <br />
                Nirmal District, Telangana - 504107
              </p>
            </div>
          </div>

          {/* Google Map */}
          <div className="contact-map">
            <iframe
              title="RGUKT Basar location map"
              src="https://maps.google.com/maps?q=RGUKT%20Basar&t=&z=14&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </section>

        {/* Contact Form */}
        <section className="contact-form-card">
          <h2>Send Us a Message</h2>

          <p className="contact-form-description">
            Your feedback, queries and suggestions are valuable to us.
          </p>

          <form onSubmit={handleSubmit}>

            {/* Name and Email */}
            <div className="contact-form-row">

              <div className="contact-form-group">
                <label htmlFor="contact-name">Name *</label>

                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="contact-email">Email *</label>

                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Subject */}
            <div className="contact-form-group">
              <label htmlFor="contact-subject">Subject *</label>

              <select
                id="contact-subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Select a subject</option>
                <option value="General Enquiry">General Enquiry</option>
                <option value="Volunteering">Volunteering</option>
                <option value="Events">Events</option>
                <option value="Community Service">
                  Community Service
                </option>
                <option value="Collaboration">Collaboration</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Message */}
            <div className="contact-form-group">
              <label htmlFor="contact-message">Message *</label>

              <textarea
                id="contact-message"
                name="message"
                placeholder="Type your message here..."
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="contact-submit-button"
              disabled={loading}
            >
              <Icon name="send" size={18} />

              <span>
                {loading ? "Sending..." : "Send Message"}
              </span>
            </button>

            {/* Success Message */}
            {submitted && (
              <p
                className="contact-success-message"
                role="status"
              >
                Thank you for contacting NSS RGUKT Basar!
                Your message has been successfully received.
              </p>
            )}

            {/* Error Message */}
            {error && (
              <p
                className="contact-error-message"
                role="alert"
              >
                {error}
              </p>
            )}
          </form>
        </section>
      </main>

      {/* Shared Footer */}
      <Footer />

    </div>
  );
}

