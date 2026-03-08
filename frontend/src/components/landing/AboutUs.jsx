import './AboutUs.css'

const AboutUs = () => {
  return (
    <section className="about-us" id="about-us">
      <div className="about-inner">
        <div className="about-left">
          <span className="about-tag">Our Story</span>
          <h2>Built by developers,<br />for developers</h2>
          <p>
            Prepify was born out of frustration. Too many talented engineers were failing interviews
            not because they lacked skills — but because they lacked practice with the right questions
            and feedback that actually helps.
          </p>
          <p>
            We built Prepify to change that. Our AI-powered platform simulates real interview conditions,
            gives you honest feedback on every answer, and helps you build the confidence to walk into
            any interview room ready to perform at your best.
          </p>
          <p>
            Whether you're a fresh graduate targeting your first role or a senior engineer aiming for
            a FAANG offer, Prepify adapts to your level and goals.
          </p>
        </div>

        <div className="about-right">
          <div className="about-stat-grid">
            {[
              { value: '1000+', label: 'Questions Generated' },
              { value: '4', label: 'Experience Levels' },
              { value: '10+', label: 'Topic Categories' },
              { value: '100%', label: 'AI Powered' },
            ].map((stat, i) => (
              <div className="about-stat" key={i}>
                <span className="about-stat-value">{stat.value}</span>
                <span className="about-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="about-mission">
            <h3>Our Mission</h3>
            <p>
              To make high-quality interview preparation accessible to every developer,
              regardless of background or resources.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs;
