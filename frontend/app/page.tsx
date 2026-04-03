import '@/styles/responsive.css'
import '@/styles/chatbot.css'
import HeroSection from '@/components/HeroSection'
import SkillsSection from '@/components/SkillsSection'
import GitHistory from '@/components/GitHistory'
import EducationSection from '@/components/EducationSection'
import CertificationsSection from '@/components/CertificationsSection'
import ProjectsSection from '@/components/ProjectsSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import BlogSection from '@/components/BlogSection'
import TerminalSection from '@/components/TerminalSection'
import ContactSection from '@/components/ContactSection'
import AppContainer from '@/components/AppContainer'
import ChatBot from '@/components/ChatBot'
import Footer from '@/components/Footer'

export default async function Home() {
    return (
        <AppContainer>
            <HeroSection />
            <SkillsSection />
            <GitHistory />
            <EducationSection />
            <CertificationsSection />
            <ProjectsSection />
            <TestimonialsSection />
            <BlogSection />
            <TerminalSection />
            <ContactSection />
            <Footer />
            <ChatBot />
        </AppContainer>
    )
}
