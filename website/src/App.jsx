import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './Navbar'
import ChooseUs from './ChooseUs'
import HeroSection from './HeroSection'
import About from './About'
import FAQ from './FAQ'
import DownloadApp from './DownloadApp'
import Footer from './Footer'
import ServicesSection from './ServicesSection'
import PaymentMethods from './PaymentMethods'
import RivalrySection from './RivalrySection'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <HeroSection />
      <About />
      <ChooseUs />
     <ServicesSection/>
     <PaymentMethods/>
      <DownloadApp/>
      <RivalrySection/>
      <FAQ/>
      <Footer/>
    </>
  )
}

export default App
