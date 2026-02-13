import React from 'react'
import NavBar from '../components/navBar'
import Hero from '../components/hero'
import Info from '../components/info'
import Steps from '../components/steps'
import KeyFeatures from '@/components/KeyFeatures'

const home = () => {
  return (
    <div>
      <NavBar />
      <Hero />
      <Info />
      <Steps />
      <KeyFeatures />
    </div>
  )
}

export default home
