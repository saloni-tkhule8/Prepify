import { useState, useEffect, useRef } from 'react'
import './Hero.css'
import image1 from '../../assets/hero1.webp'
import image2 from '../../assets/hero2.webp'
import image3 from '../../assets/hero3.webp'

const images = [image1, image2, image3]
const fullText = "Ace Your Interviews with Prefify"

const Hero = () => {
  const [displayed, setDisplayed] = useState('')
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef(null)

  // typewriter
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setDisplayed(fullText.slice(0, i + 1))
      i++
      if (i === fullText.length) clearInterval(interval)
    }, 80)
    return () => clearInterval(interval)
  }, [])

  // carousel
  useEffect(() => {
    if (paused) return
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length)
    }, 2500)
    return () => clearInterval(intervalRef.current)
  }, [paused])

  return (
    <section className="hero">
      <div className="hero-left">
        <h1 className="hero-title">
          {displayed}
          <span className="cursor">|</span>
        </h1>
        <p className="hero-subtitle">
          Practice real interview questions, get instant feedback,
          and land your dream job with Prefify.
        </p>
        <button className="hero-cta">Get Started</button>
      </div>

      <div className="hero-right">
        <div className="carousel">
          <img
            src={images[current]}
            alt={`slide-${current}`}
            className="carousel-image"
            onClick={() => setPaused(prev => !prev)}
          />
          <div className="carousel-dots">
            {images.map((_, i) => (
              <span
                key={i}
                className={`dot ${i === current ? 'active' : ''}`}
                onClick={() => { setCurrent(i); setPaused(true) }}
              />
            ))}
          </div>
          {paused && <div className="carousel-paused"></div>}
        </div>
      </div>
    </section>
  )
}

export default Hero