import './ContactUs.css'

const ContactUs = () => {
  return (
    <section className="contact-us" id="contact-us">
      <div className="contact-inner">
        <div className="contact-left">
          <span className="contact-tag">Get In Touch</span>
          <h2>We'd love to<br />hear from you</h2>
          <p>
            Have a question, feedback, or just want to say hello?
            Reach out directly and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="contact-right">
          <div className="contact-email-card">
            <span className="contact-email-icon">✉</span>
            <h3>Drop us an email</h3>
            <p>We typically respond within 24 hours.</p>
            <a href="mailto:support@prepify.com" className="contact-email-btn">
              support@prepify.com
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactUs;
