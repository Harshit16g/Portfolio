import { HeroSection } from "@/components/hero-section"
import { FeaturedProjects } from "@/components/featured-projects"
import { TechStack } from "@/components/tech-stack"
import { PersonStructuredData, WebsiteStructuredData } from "@/components/seo/structured-data"

export default function HomePage() {
  return (
    <>
      <PersonStructuredData
        name="Harshit Lodhi"
        jobTitle="Full-Stack Developer"
        description="Full-Stack Developer specializing in React, Next.js, and AI/ML. Building smart and scalable applications."
        url="https://oeeez.online"
        email="harshitlodhi220593@acropolis.in"
        location="Indore, India"
        sameAs={[
          "https://github.com/harshit16g",
          "https://www.linkedin.com/in/harshit-lodhi-5575b8314?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
        ]}
      />
      <WebsiteStructuredData
        url="https://oeeez.online"
        name="Harshit Lodhi Portfolio"
        description="Full-Stack Developer Portfolio showcasing projects and expertise in modern web technologies."
      />

      <div className="container mx-auto px-4 py-8 md:px-6">
        <HeroSection />
        <FeaturedProjects />
        <TechStack />

        <section className="py-12 md:py-24 lg:py-32 bg-muted dark:bg-background">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">Let&apos;s Connect!</h2>
            <p className="mt-3 max-w-xl mx-auto text-muted-foreground md:text-lg">
              Interested in working together or have a question? Feel free to reach out.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
