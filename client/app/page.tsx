import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-bg text-dark-text canvas-bg relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-hero-glow pointer-events-none" />

      {/* Navbar */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10 glass rounded-b-2xl mx-4 mb-16">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-glow-sm">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Mini Eraser
          </span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="btn-ghost">
            Login
          </Link>
          <Link href="/signup" className="btn-primary">
            Start Drawing free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center mt-20 md:mt-32">
        <div className="animate-slide-up bg-brand-600/10 text-brand-400 border border-brand-500/20 px-4 py-1.5 rounded-full text-sm font-medium mb-8 flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
          </span>
          Introducing AI Architecture Generation
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-dark-subtle tracking-tight mb-8 leading-tight max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
          The developer workspace for <br />
          <span className="text-brand-500">technical design.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-dark-subtle mb-12 max-w-2xl mx-auto animate-slide-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
          Combine an infinite canvas with a powerful markdown editor. Draw architecture diagrams, write specs, and use AI to turn text into system designs.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Link href="/signup" className="btn-primary text-base px-8 py-3 shadow-glow-brand">
            Try it now
          </Link>
          <Link href="https://github.com/your-repo/mini-eraser" target="_blank" className="btn-ghost text-base px-8 py-3 bg-dark-elevated">
            View Source on GitHub
          </Link>
        </div>

        {/* Feature UI Preview Mockup */}
        <div className="mt-24 relative w-full max-w-5xl mx-auto animate-scale-in" style={{ animationDelay: '0.4s' }}>
          <div className="absolute inset-0 bg-brand-500/20 blur-[100px] rounded-full" />
          <div className="relative glass border border-dark-border rounded-xl p-2 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[500px]">
            {/* Split layout mockup */}
            <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-dark-border p-8 relative flex items-center justify-center bg-dark-bg/50">
              <div className="canvas-bg absolute inset-0 opacity-50" />
              {/* Fake diagram elements */}
              <div className="absolute top-20 left-10 w-32 h-16 border-2 border-brand-500/50 rounded flex items-center justify-center text-sm font-medium text-brand-300 bg-brand-500/10 backdrop-blur">Browser</div>
              <div className="absolute top-20 right-10 w-32 h-16 border-2 border-emerald-500/50 rounded flex items-center justify-center text-sm font-medium text-emerald-300 bg-emerald-500/10 backdrop-blur">API Gateway</div>
              <div className="absolute top-52 right-10 w-32 h-16 border-2 border-blue-500/50 rounded flex items-center justify-center text-sm font-medium text-blue-300 bg-blue-500/10 backdrop-blur">Database</div>
              
              {/* Fake edges */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path d="M 168 112 L 310 112" stroke="rgba(228,231,239,0.3)" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                <path d="M 374 144 L 374 208" stroke="rgba(228,231,239,0.3)" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <div className="w-full md:w-1/2 p-8 bg-dark-surface/80 flex flex-col gap-4">
              <div className="w-1/3 h-6 bg-dark-border rounded" />
              <div className="w-full h-4 bg-dark-elevated rounded mt-4" />
              <div className="w-5/6 h-4 bg-dark-elevated rounded" />
              <div className="w-4/6 h-4 bg-dark-elevated rounded" />
              <div className="w-full h-32 bg-dark-bg/80 border border-dark-border rounded mt-4" />
              <div className="flex gap-2 mt-4">
                <div className="w-4 h-4 rounded-full border border-brand-500/50 flex-shrink-0 mt-0.5" />
                <div className="w-full h-4 bg-dark-elevated rounded" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Features row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 mb-32 w-full max-w-5xl mx-auto text-left animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="p-6 card">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Automated Architecture</h3>
            <p className="text-dark-subtle text-sm">Upload your codebase (Spring Boot, Express, Django) and let AI generate a complete architecture diagram instantly.</p>
          </div>
          <div className="p-6 card">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Split-Pane Editor</h3>
            <p className="text-dark-subtle text-sm">Write documentation in rich markdown side-by-side with your diagrams. Keeps context unified.</p>
          </div>
          <div className="p-6 card">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Prompt to Diagram</h3>
            <p className="text-dark-subtle text-sm">Describe your system using natural language and watch the AI draw the boxes and arrows for you.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
