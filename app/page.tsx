import React from 'react'
import NavBar from "../components/navBar";
import Hero from "../components/hero";
import Info from "../components/info";
import Steps from "../components/steps";
import KeyFeatures from "@/components/KeyFeatures";
import ResidueRiskForm from "@/components/ResidueRiskForm";

const Home = () => {
  return (
    <div>
      <NavBar />
      <Hero />
      <Info />
      <Steps />
      <KeyFeatures />
      <ResidueRiskForm />
    </div>
  );
};

export default Home;
