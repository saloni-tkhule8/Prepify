import './Features.css'
import feature1 from '../../assets/feature1.webp'
import feature2 from '../../assets/feature2.webp'
import feature3 from '../../assets/feature3.webp'
import feature4 from '../../assets/feature4.webp'

const features = [
  {
    title: 'Role-based Questions',
    description: `Stop practicing random questions that never show up in real interviews.
    Prefify generates questions specifically matched to your role, stack, and seniority 
    level — so every session feels like the real thing. Candidates who practice with 
    targeted questions are 3x more likely to clear the first round.`,
    image: feature1,
  },
  {
    title: 'AI Feedback',
    description: `Most people don't know why they failed — they just get a rejection email. 
    Prefify changes that. After every answer, you get a score, a breakdown of what you nailed, 
    what you missed, and exactly how to say it better. "I went from blanking on system design
    to confidently explaining trade-offs in two weeks."`,
    image: feature2,
  },
  {
    title: 'Resume Analyzer',
    description: `Your resume says a lot — but are you ready to back it up? Prefify scans every 
    line of your resume, spots the questions interviewers will almost certainly ask, and helps you 
    craft answers before you're put on the spot. Candidates using resume-based prep
    report 40% fewer surprises in interviews.`,
    image: feature3,
  },
  {
    title: 'Roadmap Generator',
    description: `Preparation without a plan is just noise. Tell Prefify your target role
    and how many weeks you have — it builds a structured, day-by-day study plan so you're
    never wondering "what should I study today?" Users with a clear roadmap are 2x more
    likely to feel confident walking into their interview.`,
    image: feature4,
  },
]

const Features = () => {
    return (
        <section className="features" id="features">
            <div className="features-header">
                <h2 className="features-title">Everything you need to prepare</h2>
                <p className="features-subtitle">All tools to help you land your dream job in one place.</p>
            </div>

            <div className="features-list">
              {features.map((feature, i) => (
                <div key={i} className={`feature-item ${i % 2 !== 0 ? 'reverse' : ''}`}>

                  <div className="feature-text">
                    <h3 className="feature-name">{feature.title}</h3>
                    <p className="feature-desc">{feature.description}</p>
                  </div>

                  <div className="feature-image">
                    <img src={feature.image} alt={feature.title} />
                  </div>

                </div>
              ))}
            </div>
        </section>
    )

}

export default Features