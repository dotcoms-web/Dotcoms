import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollProgress } from '@/components/ScrollProgress';
import { CustomCursor } from '@/components/CustomCursor';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { Showcase } from '@/components/sections/Showcase';
import { CaseStudies } from '@/components/sections/CaseStudies';
import { ROICalculator } from '@/components/sections/ROICalculator';
import { Process } from '@/components/sections/Process';
import { Testimonials } from '@/components/sections/Testimonials';
import { Technology } from '@/components/sections/Technology';
import { FAQ } from '@/components/sections/FAQ';
import { Contact } from '@/components/sections/Contact';

export function LandingPage() {
  return (
    <>
      <LoadingScreen />
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <WhyChooseUs />
        <Showcase />
        <CaseStudies />
        <ROICalculator />
        <Process />
        <Testimonials />
        <Technology />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
