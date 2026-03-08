import './HowToUse.css'

const steps = [
  {
    number: '1',
    title: 'Create Your Account',
    description: 'Sign up in seconds using your email, Google, or GitHub account. No credit card required to get started.'
  },
  {
    number: '2',
    title: 'Set Your Target',
    description: 'Enter your target role, experience level, and optionally the company you\'re interviewing at. Add specific topics to focus on.'
  },
  {
    number: '3',
    title: 'Practice Questions',
    description: 'Prepify generates tailored interview questions using AI. Answer them at your own pace, just like a real interview.'
  },
  {
    number: '4',
    title: 'Get Instant Feedback',
    description: 'Receive a detailed score, strengths, and areas to improve for every answer. Understand exactly what interviewers look for.'
  },
  {
    number: '5',
    title: 'Track Your Progress',
    description: 'Review your session history, monitor your average scores over time, and see how far you\'ve come.'
  }
]

const HowToUse = () => {
  return (
    <section className="how-to-use" id="how-to-use">
      <div className="how-header">
        <span className="how-tag">Simple Process</span>
        <h2>How Prepify Works</h2>
        <p>From signup to your dream job offer — here's your path.</p>
      </div>

      <div className="how-steps">
        {steps.map((step, i) => (
          <div className="how-step" key={i}>
            <div className="how-step-number">{step.number}</div>
            <div className="how-step-content">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
            {i < steps.length - 1 && <div className="how-step-connector" />}
          </div>
        ))}
      </div>
    </section>
  )
}

export default HowToUse;
