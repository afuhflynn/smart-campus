import { Navbar } from "./navbar";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { FaTwitter, FaLinkedin } from "react-icons/fa6";
import { Suspense } from "react";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t bg-muted/30">
          <div className="container py-12 md:py-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div className="col-span-1 md:col-span-1">
                <Link href="/" className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <span className="text-lg font-bold tracking-tight">
                    Smart<span className="text-primary">Campus</span>
                  </span>
                </Link>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The modern platform for higher education management.
                  Streamlining applications, attendance, and campus life.
                </p>
                <div className="flex gap-4 mt-6">
                  <Link href="https://x.com/afuhflynn" target="_blank">
                    <FaTwitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                  </Link>
                  <Link
                    href="https://linkedin.com/in/afuhflynn"
                    target="_blank"
                  >
                    <FaLinkedin className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                  </Link>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Platform</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      href="/schools"
                      className="hover:text-primary transition-colors"
                    >
                      Find Schools
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/how-it-works"
                      className="hover:text-primary transition-colors"
                    >
                      How it Works
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/pricing"
                      className="hover:text-primary transition-colors"
                    >
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      href="/contact"
                      className="hover:text-primary transition-colors"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="hover:text-primary transition-colors"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faq"
                      className="hover:text-primary transition-colors"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      href="/privacy"
                      className="hover:text-primary transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="hover:text-primary transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Smart Campus. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </Suspense>
  );
}
