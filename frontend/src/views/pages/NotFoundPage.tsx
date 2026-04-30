import { Link } from "wouter";
import { Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
      <div className="text-7xl mb-6">🥦</div>
      <h1 className="text-3xl font-bold text-foreground mb-2">Page not found</h1>
      <p className="text-muted-foreground mb-8 max-w-sm">
        Looks like this page got eaten. Let's get you back to your pantry.
      </p>
      <Link href="/">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all cursor-pointer">
          <Home className="w-5 h-5" />
          Go to Dashboard
        </div>
      </Link>
    </div>
  );
}
