import { Outlet, useLocation } from "react-router-dom";
import NavbarFloatingPill from "@/components/navbars/NavbarFloatingPill";
import FooterTrayWordmark from "@/components/sections/footer/FooterTrayWordmark";

export default function Layout() {
  const location = useLocation();
  const isApp = location.pathname.startsWith("/app");

  if (isApp) {
    return (
      <main className="min-h-svh bg-background text-foreground overflow-hidden">
        <Outlet />
      </main>
    );
  }

  return (
    <div className="relative isolate min-h-svh flex flex-col bg-background text-foreground" data-button="chip" data-card="tray" data-pattern="glow">
      <header data-webild-section="Header">
        <NavbarFloatingPill
          brand="NoteAI"
          navItems={[
            {
              name: "Features",
              href: "#product"
            },
            {
              name: "Interface",
              href: "#gallery-tilt-cards"
            },
            {
              name: "Reviews",
              href: "#customers"
            },
            {
              name: "FAQ",
              href: "#faq-tray-accordion-1"
            }
          ]}
          cta={{
            text: "Get Started",
            href: "/app"
          }}
          introDelay={1.2}
        />
      </header>
      <main className="flex-grow" data-button="chip" data-card="tray" data-pattern="glow">
        <Outlet />
      </main>
      <footer data-webild-section="Footer" data-section="footer">
        <FooterTrayWordmark
          brand="NoteAI"
          wordmark="NoteAI."
          columns={[
            {
              title: "Product",
              links: [
                {
                  text: "Get Started",
                  href: "/app"
                },
                {
                  text: "Note-taking engine",
                  href: "#product"
                },
                {
                  text: "Workspace preview",
                  href: "#gallery-tilt-cards"
                }
              ]
            },
            {
              title: "Company",
              links: [
                {
                  text: "About NoteAI",
                  href: "#about"
                },
                {
                  text: "Student reviews",
                  href: "#customers"
                },
                {
                  text: "Get started",
                  href: "/app"
                }
              ]
            },
            {
              title: "Resources",
              links: [
                {
                  text: "Questions & FAQ",
                  href: "#faq-tray-accordion-1"
                },
                {
                  text: "Privacy Policy",
                  href: "#"
                },
                {
                  text: "Terms of Service",
                  href: "#"
                }
              ]
            },
            {
              title: "Contact",
              links: [
                {
                  text: "hello@noteai.com",
                  href: "mailto:hello@noteai.com"
                },
                {
                  text: "750 University Ave, Palo Alto, CA 94301",
                  href: "#"
                }
              ]
            }
          ]}
          copyright="© 2026 NoteAI. All rights reserved."
          topText="Back to top"
        />
      </footer>
    </div>
  );
}
