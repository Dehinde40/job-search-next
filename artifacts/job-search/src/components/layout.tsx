import { Link } from "wouter";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" data-testid="link-home">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">JobBoard</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/jobs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-jobs">
              Browse Jobs
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link href="/post-job" data-testid="link-post-job">
              <Button variant="secondary" className="font-semibold">Post a Job</Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      
      <footer className="border-t bg-muted/40 py-12">
        <div className="container mx-auto px-4 md:px-6 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Briefcase className="h-5 w-5 text-primary" />
            <span className="font-display font-bold text-lg text-foreground">JobBoard</span>
          </div>
          <p className="text-sm">Built for ambitious professionals.</p>
        </div>
      </footer>
    </div>
  );
}
