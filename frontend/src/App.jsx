import CTA from './Homepage/CTA';
import Footer from './Homepage/footer';
import Hero from './Homepage/Hero';
import { Routes, Route } from "react-router-dom";
import HowItWorks from './Homepage/HowItWorks';
import KeyFeatures from './Homepage/KeyFeatures';
import Navbar from './Homepage/Navbar';
import Specialties from './Homepage/Specialties';
import DoctorForm from "./Doctor-Ui/Pages/DoctorForm";
import DoctorDashboard from "./Doctor-Ui/pages/DoctorDashboard";

function App() {
  return (
    <>
    <Routes>
        <Route path="/doc" element={<DoctorForm />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
      </Routes>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Specialties />
      <KeyFeatures />
      <CTA />
      <Footer />
    </>
  );
}

export default App;