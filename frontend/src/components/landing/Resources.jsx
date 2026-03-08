import './Resources.css'

const resources = [
  {
    category: 'System Design',
    items: [
      { title: 'System Design Primer', desc: 'A comprehensive guide to system design concepts and patterns.', url: 'https://github.com/donnemartin/system-design-primer' },
      { title: 'Designing Data-Intensive Applications', desc: 'The definitive book on building reliable and scalable systems.', url: 'https://dataintensive.net/' },
    ]
  },
  {
    category: 'Data Structures & Algorithms',
    items: [
      { title: 'LeetCode', desc: 'Practice coding problems used in real technical interviews.', url: 'https://leetcode.com' },
      { title: 'NeetCode', desc: 'Structured roadmap and video explanations for DSA problems.', url: 'https://neetcode.io' },
    ]
  },
  {
    category: 'Interview Preparation',
    items: [
      { title: 'Cracking the Coding Interview', desc: 'The most popular book for software engineering interview prep.', url: 'https://www.crackingthecodinginterview.com/' },
      { title: 'Tech Interview Handbook', desc: 'Free curated interview preparation materials for engineers.', url: 'https://www.techinterviewhandbook.org/' },
    ]
  },
  {
    category: 'Behavioral Interviews',
    items: [
      { title: 'STAR Method Guide', desc: 'Learn to structure compelling answers using Situation, Task, Action, Result.', url: 'https://www.themuse.com/advice/star-interview-method' },
      { title: 'Glassdoor', desc: 'Real interview questions and reviews from candidates at top companies.', url: 'https://www.glassdoor.com' },
    ]
  },
]

const Resources = () => {
  return (
    <section className="resources" id="resources">
      <div className="resources-header">
        <span className="resources-tag">Free Resources</span>
        <h2>Learn & Prepare</h2>
        <p>Handpicked resources to complement your Prepify practice sessions.</p>
      </div>

      <div className="resources-grid">
        {resources.map((group, i) => (
          <div className="resource-group" key={i}>
            <h3 className="resource-category">{group.category}</h3>
            <div className="resource-items">
              {group.items.map((item, j) => (
                <a
                  key={j}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-card"
                >
                  <div className="resource-card-top">
                    <span className="resource-title">{item.title}</span>
                    <span className="resource-arrow">↗</span>
                  </div>
                  <p className="resource-desc">{item.desc}</p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Resources;
