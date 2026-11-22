import HeroBoardFrame from "@/components/sections/hero/HeroBoardFrame";
import AboutStatementIconRow from "@/components/sections/about/AboutStatementIconRow";
import FeaturesStackingTilesMakro from "@/components/sections/features/FeaturesStackingTilesMakro";
import GalleryTiltCards from "@/components/sections/gallery/GalleryTiltCards";
import TestimonialSpotlightCarousel from "@/components/sections/testimonial/TestimonialSpotlightCarousel";
import FaqTrayAccordion from "@/components/sections/faq/FaqTrayAccordion";
import StatementDarkPanelBoard from "@/components/sections/statement/StatementDarkPanelBoard";
import ScrollToneBackdrop from "@/components/kit/ScrollToneBackdrop";
import LoaderChipFill from "@/components/loaders/LoaderChipFill";

export default function HomePage() {
  return (
    <>
      <ScrollToneBackdrop

      />

      <LoaderChipFill
        label="NoteAI"
      />

      <div id="home" data-webild-section="HeroBoardFrame" data-webild-section-id="HeroBoardFrame-1" data-section="home">
        <HeroBoardFrame
          className="bg-transparent"
          tag="Real-time AI note taking"
          title="Watch the lecture. Let AI write the notes."
          description="NoteAI captures audio, visual text, and slides automatically to generate clean, printable study notes."
          primaryButton={{
            text: "Get Started",
            href: "/app"
          }}
          imageSrc="https://img.b2bpic.net/free-photo/3d-futuristic-abstract-low-poly-design_1048-12155.jpg"
          imageAlt="abstract digital network design"
          introDelay={1.2}
          kpis={[
            {
              label: "Hours saved monthly",
              value: "15,000+",
              delta: "+24%",
              trend: [
                1200,
                1400,
                1350,
                1600,
                1800,
                2100,
                2500
              ]
            },
            {
              label: "Notes generated",
              value: "45,000+",
              delta: "+35%"
            },
            {
              label: "Active learners",
              value: "10,000+",
              trend: [
                500,
                650,
                720,
                850,
                920,
                1050
              ]
            }
          ]}
        />
      </div>

      <div id="about" data-webild-section="AboutStatementIconRow" data-webild-section-id="AboutStatementIconRow-1" data-section="about" data-tone="card">
        <AboutStatementIconRow
          className="bg-transparent"
          title="NoteAI captures audio, video visuals, and slides simultaneously so students can watch lectures without pausing to take manual notes."
          items={[
            {
              icon: "Video",
              title: "Multi-Stream Capture",
              description: "Processes video visuals, spoken audio, and slide presentations together in real time."
            },
            {
              icon: "BookOpen",
              title: "Instant Built-In Notes",
              description: "Generates structured, printable study notebooks automatically as you watch lectures."
            },
            {
              icon: "Clock",
              title: "Uninterrupted Focus",
              description: "Eliminates continuous pausing and typing, saving over 15,000 study hours monthly."
            }
          ]}
        />
      </div>

      <div id="product" data-webild-section="FeaturesStackingTilesMakro" data-webild-section-id="FeaturesStackingTilesMakro-1" data-section="product" data-tone="card">
        <FeaturesStackingTilesMakro
          items={[
            {
              tag: "Multi-Modal Capture",
              icon: "layers",
              title: "Comprehends speech, slides, and text",
              description: "Reads slides, on-screen text, and spoken speech simultaneously so no critical detail gets left out during lectures.",
              note: "Processes audio and visual feeds together",
              imageSrc: "https://img.b2bpic.net/free-photo/digital-dashboard_23-2151957114.jpg",
              imageAlt: "digital dashboard with data charts"
            },
            {
              tag: "Flexible Sources",
              icon: "play-circle",
              title: "Courses, playlists, and live meetings",
              description: "Generate comprehensive notes for a single lecture clip, a full playlist course, or live video calls like Zoom.",
              note: "Supports single videos or complete playlists",
              imageSrc: "https://img.b2bpic.net/free-photo/digital-tablet-pencil-notebook-marble-desk_9975-32983.jpg",
              imageAlt: "tablet on marble desk with notebook"
            },
            {
              tag: "Auto-Notebook",
              icon: "book-open",
              title: "Built-in automated digital notebook",
              description: "Saves every session automatically into your digital notebook, neatly organized and ready to print for exam revision.",
              note: "Print clean notes with zero reformatting",
              imageSrc: "https://img.b2bpic.net/free-photo/teenage-freelance-working-business-tablet_1388-308.jpg",
              imageAlt: "Teenage freelance working business on tablet."
            },
            {
              tag: "Real-Time Focus",
              icon: "zap",
              title: "Focus completely without pausing lectures",
              description: "Stop constantly pausing videos to copy slides manually. Concentrate on comprehending while notes generate automatically.",
              note: "Over 15,000 study hours saved monthly",
              imageSrc: "https://img.b2bpic.net/free-photo/overworked-businesswoman-typing-financial-statistics-laptop-sitting-desk-table-startup-company-office-late-night_482257-2324.jpg",
              imageAlt: "Overworked businesswoman typing financial statistics on laptop sitting at desk table in startup company office late at night"
            }
          ]}
        />
      </div>

      <div id="gallery-tilt-cards" data-webild-section="GalleryTiltCards" data-webild-section-id="GalleryTiltCards-1" data-section="gallery-tilt-cards">
        <GalleryTiltCards
          tag="Inside NoteAI"
          title="Designed for zero-distraction studying"
          description="Manage, organize, and print your auto-generated study guides in one clean interface."
          linkLabel="Explore Features"
          ariaLabel="NoteAI Interface Gallery"
          items={[
            {
              title: "Focus player view",
              tag: "Interface",
              date: "Mar 2026",
              description: "Watch your video uninterrupted while NoteAI runs quietly in the background.",
              href: "#product",
              imageSrc: "https://img.b2bpic.net/free-photo/flat-lay-tablet-notebook-pen-plants-cup-coffee-marble-surface_9975-32922.jpg",
              imageAlt: "Flat lay of a tablet notebook pen plants and a cup of coffee on a marble surface"
            },
            {
              title: "Real-time stream capture",
              tag: "Capture",
              date: "Mar 2026",
              description: "Select audio-only or full multi-modal visual transcription before hitting play.",
              href: "#product",
              imageSrc: "https://img.b2bpic.net/free-photo/flat-lay-desk-arrangement-with-tablet_23-2148128331.jpg",
              imageAlt: "tablet on a desk with stationery"
            },
            {
              title: "Central notebook library",
              tag: "Notebook",
              date: "Mar 2026",
              description: "All your generated notes organized by course subject or meeting topic.",
              href: "#product",
              imageSrc: "https://img.b2bpic.net/free-photo/computer-laptop-printer-desk_1232-915.jpg",
              imageAlt: "Computer, laptop and printer on a desk"
            },
            {
              title: "Markdown note editor",
              tag: "Editor",
              date: "Mar 2026",
              description: "Refine summary bullet points, highlight terms, or add manual inline thoughts.",
              href: "#product",
              imageSrc: "https://img.b2bpic.net/free-photo/people-hangout-together-coffee-shop_53876-163251.jpg",
              imageAlt: "People hangout together at coffee shop"
            },
            {
              title: "One-click PDF export",
              tag: "Export",
              date: "Mar 2026",
              description: "Format clean study guides ready for printing or offline paper reading.",
              href: "#product",
              imageSrc: "https://img.b2bpic.net/free-photo/close-up-hands-holding-tablet_23-2148738312.jpg",
              imageAlt: "Close-up hands holding tablet"
            },
            {
              title: "Playlist queue processor",
              tag: "Automation",
              date: "Mar 2026",
              description: "Set NoteAI to process consecutive lessons automatically across full courses.",
              href: "#product",
              imageSrc: "https://img.b2bpic.net/free-photo/working-table-with-computer_93675-133811.jpg",
              imageAlt: "desk with computer and camera"
            }
          ]}
        />
      </div>

      <div id="customers" data-webild-section="TestimonialSpotlightCarousel" data-webild-section-id="TestimonialSpotlightCarousel-1" data-section="customers">
        <TestimonialSpotlightCarousel
          tag="Student Spotlight"
          title="What students say"
          items={[
            {
              company: "Stanford Medicine",
              quote: "I watch two-hour medical lectures without stopping once. I print the generated notes right after and start memorizing immediately.",
              name: "Holly Henderson",
              role: "Medical Student",
              imageSrc: "https://img.b2bpic.net/free-photo/girls-are-taking-nap-while-reading-books_1150-17535.jpg",
              stats: [
                {
                  label: "Pause frequency",
                  value: "Zero pauses"
                },
                {
                  label: "Weekly time saved",
                  value: "12 hours"
                }
              ]
            },
            {
              company: "Code Academy",
              quote: "Capturing code snippets from slides while listening to the instructor's audio used to be impossible. NoteAI extracts both in real time.",
              name: "Ryan Shaw",
              role: "Engineering Student",
              imageSrc: "https://img.b2bpic.net/free-photo/happy-girl-is-working-laptop-girl-with-laptop-emotion-concept_169016-66073.jpg",
              stats: [
                {
                  label: "Code extraction",
                  value: "100% accurate"
                },
                {
                  label: "Note creation",
                  value: "Real-time"
                }
              ]
            },
            {
              company: "Online Learner",
              quote: "I ran NoteAI through an entire 12-video course playlist. It generated complete printable study guides without me touching a pen.",
              name: "Callum Fletcher",
              role: "Self-Paced Learner",
              imageSrc: "https://img.b2bpic.net/free-photo/serious-young-businessman-working-restaurant_1262-1596.jpg",
              stats: [
                {
                  label: "Playlist summary",
                  value: "12 videos done"
                },
                {
                  label: "Study efficiency",
                  value: "2x increase"
                }
              ]
            },
            {
              company: "Zoom Strategy",
              quote: "Great for live Zoom lectures and meetings. I get clean, structured notes saved to my notebook automatically while I listen.",
              name: "Olivia Ramirez",
              role: "Product Manager",
              imageSrc: "https://img.b2bpic.net/free-photo/invalid-photographer-working-with-graphic-tablet-stylus-computer-studio-photography-artist-with-handicap-retouching-pictures-touch-screen-sitting-wheelchair_482257-32949.jpg",
              stats: [
                {
                  label: "Meeting focus",
                  value: "100% engaged"
                },
                {
                  label: "Manual typing",
                  value: "0 minutes"
                }
              ]
            }
          ]}
        />
      </div>

      <div id="faq-tray-accordion-1" data-webild-section="FaqTrayAccordion" data-webild-section-id="FaqTrayAccordion-1" data-section="faq-tray-accordion-1">
        <FaqTrayAccordion
          tag="Questions"
          title="Before you"
          highlight="start"
          items={[
            {
              title: "Can I record live meetings as well as online videos?",
              description: "Yes. NoteAI works seamlessly with live online meetings on Zoom as well as pre-recorded video courses and playlists."
            },
            {
              title: "Can I choose between capturing audio or full visual slides?",
              description: "Yes. You can configure NoteAI to process just the audio track or combine audio, slide text, and visual presentation content."
            },
            {
              title: "Can I edit and print my generated notes?",
              description: "Yes. Every note automatically saves to your built-in notebook where you can edit text and print formatted PDFs immediately."
            },
            {
              title: "Is there a free trial available?",
              description: "Yes. NoteAI includes a 14-day free trial with complete access to real-time multi-modal note generation."
            },
            {
              title: "How are notes organized inside the built-in notebook?",
              description: "All captured notes are automatically stored by course, playlist, or meeting date so you can review and print them anytime."
            }
          ]}
          help={{
            label: "Support",
            title: "Need help from Holly?",
            description: "Holly Henderson is available to answer your setup and notebook questions.",
            cta: {
              text: "Contact support",
              href: "#statement-dark-panel-board-1"
            },
            imageSrc: "https://img.b2bpic.net/free-photo/serious-adult-european-woman-using-computer-answers-mail-while-sitting-table-freelance-work-business-people-concept_197531-31276.jpg",
            imageAlt: "Serious adult european woman using computer answers mail while sitting at table Freelance work business people concept"
          }}
        />
      </div>

      <div id="statement-dark-panel-board-1" data-webild-section="StatementDarkPanelBoard" data-webild-section-id="StatementDarkPanelBoard-1" data-section="statement-dark-panel-board-1">
        <StatementDarkPanelBoard
          title="Ready to automate your note taking?"
          primaryCta={{
            text: "Get Started",
            href: "/app"
          }}
          secondaryCta={{
            text: "Contact support",
            href: "mailto:hello@noteai.com"
          }}
          imageSrc="https://img.b2bpic.net/free-photo/flat-lay-desk-with-tablet-mock-up_23-2148291149.jpg"
          imageAlt="Flat lay of desk with tablet mock-up"
        />
      </div>
    </>
  );
}
