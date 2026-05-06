import { Zap } from 'lucide-react';

export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient blob */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-600/20 to-blue-500/20 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Content */}
      <div className="relative w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Branding & Value Prop */}
          <div className="hidden lg:flex flex-col justify-center space-y-8">
            {/* Logo & Brand */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Zap size={24} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">ISMS-EWA</h1>
              </div>
              <p className="text-cyan-400 font-medium">Intelligent School Management System</p>
            </div>

            {/* Tagline */}
            <div className="space-y-3">
              <h2 className="text-4xl font-bold text-white leading-tight">
                Early Warning Analytics for Student Success
              </h2>
              <p className="text-slate-300 text-lg">
                Monitor student performance, identify at-risk students, and take proactive measures to ensure academic success.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              {[
                { label: 'Real-time Risk Monitoring', desc: 'Track student performance metrics in real-time' },
                { label: 'Smart Analytics', desc: 'AI-powered insights for early intervention' },
                { label: 'Role-based Access', desc: 'Secure access control for teachers and administrators' },
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{feature.label}</p>
                    <p className="text-slate-400 text-xs">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Floating card preview */}
            <div className="mt-8 p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-300">Risk Monitoring</p>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">At-Risk Students</span>
                    <span className="text-sm font-bold text-rose-400">12</span>
                  </div>
                  <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-gradient-to-r from-rose-500 to-rose-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900">Welcome Back</h3>
                  <p className="text-slate-600">Sign in to your account to continue</p>
                </div>

                {/* Form */}
                {children}
              </div>

              {/* Footer text */}
              <p className="text-center text-sm text-slate-400 mt-6">
                Protected by enterprise-grade security
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
