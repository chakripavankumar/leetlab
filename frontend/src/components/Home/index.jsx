import { Play, Target, ArrowRight, Sparkles, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { PLATFORM_FEATURES, PLATFORM_STATS } from '../../constants/platformFeature';

const LandingPage = () => {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuthStore();

  // console.log(isAuthenticated);

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero min-h-screen bg-gradient-to-br from-primary/20 via-base-200 to-secondary/20">
        <div className="hero-content text-center max-w-6xl mx-auto px-6">
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="p-6 bg-primary/10 rounded-full ring-4 ring-primary/20">
                  <Rocket className="w-16 h-16 text-primary" />
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Master Coding
              </h1>

              <h2 className="text-2xl md:text-3xl font-bold text-base-content">
                One Problem at a Time
              </h2>

              <p className="text-lg md:text-xl text-base-content/70 max-w-3xl mx-auto">
                Join thousands of developers sharpening their skills with our comprehensive coding
                platform. Track progress, solve challenges, and level up your programming abilities
                with the help of our built-in{' '}
                <span className="text-primary font-semibold">AI mentor</span>—DSA CodeLab AI Bot.
                Get hints, explanations, and pseudocode without spoilers.
              </p>

              <p className="text-md md:text-lg text-success text-center font-medium mt-4">
                🚀 Trusted by over 10,000 developers—and now smarter with AI to help you learn
                better, not just faster.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <a
                  onClick={() => navigate('/profile')}
                  className="btn btn-primary btn-md gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <Play className="w-6 h-6" />
                  My Profile
                  <ArrowRight className="w-5 h-5" />
                </a>
              ) : (
                <a
                  onClick={() => navigate('/register')}
                  className="btn btn-primary btn-md gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <Play className="w-6 h-6" />
                  Register
                  <ArrowRight className="w-5 h-5" />
                </a>
              )}
              <a
                onClick={() => navigate('/problems')}
                className="btn btn-outline btn-md gap-2 hover:scale-105 transition-all"
              >
                <Target className="w-6 h-6" />
                Browse Problems
              </a>
              <a
                href="#features"
                className="btn btn-outline btn-md gap-2 hover:scale-105 transition-all"
              >
                <Sparkles className="w-6 h-6" />
                Cool Features
              </a>
            </div>

            {!isAuthenticated && (
              <div className="text-center text-base text-muted-foreground mt-4">
                <span>🔍 Want to explore first? </span>
                <button
                  onClick={() => navigate('/problems')}
                  className="link link-hover text-primary underline font-medium hover:text-secondary transition-colors"
                >
                  Check out problems before registering →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-base-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by Developers Worldwide</h2>
            <p className="text-xl text-base-content/70">
              Join our growing community of problem solvers
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {PLATFORM_STATS.map((stat, index) => (
              <div
                key={index}
                className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                <div className="card-body text-center p-8">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-base-100 rounded-lg">{stat.icon}</div>
                  </div>
                  <h3 className="text-3xl font-bold text-primary">{stat.number}</h3>
                  <p className="text-base-content/70 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-base-200" id="features">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Everything you need to become a better programmer, all in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PLATFORM_FEATURES.map((feature, index) => (
              <div
                key={index}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02]"
              >
                <div className="card-body p-6">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="p-4 bg-base-200 rounded-xl">{feature.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-base-content/70 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
