import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <span className="text-xl font-semibold">Tweet Improver AI</span>
          </div>
          <Link
            href="/dashboard"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-6 leading-tight">
            Grow faster on <span className="text-primary">𝕏</span>
            <br />
            with Tweet Improver AI
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Paste your messy, raw text and transform it into perfectly formatted,
            viral-ready tweets in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/dashboard"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              🚀 Start Improving Tweets
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              "Auto line breaks",
              "Fix spacing",
              "Add emojis",
              "Thread splitter",
              "No character limit",
              "Live preview"
            ].map((feature) => (
              <span
                key={feature}
                className="px-4 py-2 bg-secondary rounded-full text-sm text-muted-foreground border border-border"
              >
                ✓ {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center">
          <Link
            href="https://superx.so/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors"
          >
            🔥 Try SuperX
          </Link>
        </div>
      </footer>
    </main>
  );
}