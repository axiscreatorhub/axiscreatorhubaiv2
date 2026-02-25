import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Footer from '@/components/Footer'
import ContentSection from '@/components/ContentSection'
import CreatorStudio from '@/components/CreatorStudio'
import CoursePortal from '@/components/CoursePortal'
import IntelligenceLab from '@/components/IntelligenceLab'
import VSL from '@/components/VSL'
import Proof from '@/components/Proof'
import FAQ from '@/components/FAQ'
import VideoTestimonials from '@/components/VideoTestimonials'

import Checkout from '@/components/Checkout'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#020617]">
      <Navbar />
      <Hero />
      <VSL />
      <ContentSection 
        id="content-factory"
        title="The Content Factory"
        subtitle="Automate your production with elite AI workflows."
        imageSrc="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop"
        imagePosition="right"
        theme="dark"
        points={[
          { title: "Trend Identification", description: "Spot viral opportunities before they peak." },
          { title: "Asset Generation", description: "Create high-fidelity visuals and videos in seconds." },
          { title: "Multi-Platform Sync", description: "Optimize content for TikTok, Reels, and Shorts automatically." }
        ]}
      />
      <CreatorStudio />
      <CoursePortal />
      <IntelligenceLab />
      <Proof />
      <VideoTestimonials />
      <Checkout selectedCourse={null} />
      <FAQ />
      <Footer />
    </main>
  )
}
