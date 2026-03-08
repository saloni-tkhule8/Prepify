import './LandingPage.css'
import Navbar from "../components/landing/Navbar"
import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import HowToUse from '../components/landing/HowToUse'
import Resources from '../components/landing/Resources'
import AboutUs from '../components/landing/AboutUs'
import ContactUs from '../components/landing/ContactUs'
import Footer from '../components/landing/Footer'

const LandingPage = () => {
    return (
        <>
          <Navbar/>
          <Hero/>
          <Features/>
          <HowToUse/>
          <Resources/>
          <AboutUs/>
          <ContactUs/>
          <Footer/>
        </>
    )
}

export default LandingPage