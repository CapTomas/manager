import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from './stores/authStore';
import {
  Trophy,
  Clock,
  Users,
  X,
  ChevronRight,
  BarChart3,
  MessageSquare,
  Calendar,
  Zap,
  Check,
} from 'lucide-react';
import Topography from './patterns/topography';
import Logo from './patterns/logo';

const WelcomePage = () => {
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState('signin'); // 'signin' or 'signup'
  const { signIn } = useAuthStore();
  const [credentials, setCredentials] = React.useState({
    email: '',
    password: '',
    name: '',
  });

  const handleAuth = (e) => {
    e.preventDefault();
    if (authMode === 'signin') {
      signIn(credentials.email, credentials.password);
    } else {
      // Handle sign up
      console.log('Sign up with:', credentials);
    }
  };

  const pricingTiers = [
    {
      name: 'Free',
      price: '0',
      description: 'Perfect for hobby teams and casual players',
      features: [
        'Up to 20 team members',
        'Basic event scheduling',
        'Team chat',
        'Personal calendar sync',
        'Event notifications',
        'Basic attendance tracking',
      ],
    },
    {
      name: 'Pro',
      price: '9.99',
      description: 'For serious teams and organizations',
      features: [
        'Unlimited team members',
        'Advanced scheduling with conflicts detection',
        'Multiple teams management',
        'Statistics and performance tracking',
        'Custom branding',
        'Priority support',
        'Tournament organization',
        'Advanced analytics',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0B0F] text-white relative overflow-hidden">
      {/* SVG Background Pattern */}
      <Topography width="100%" height="25.9%" opacity={0.05} className="rounded-lg" />



      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
              <Logo />
            </div>
            <span className="text-xl font-bold">TeamSync</span>
          </div>



          <div className="flex items-center gap-6">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a>
            <button
              onClick={() => {
                setAuthMode('signin');
                setIsAuthOpen(true);
              }}
              className="px-4 py-2 bg-primary rounded text-white hover:bg-primary/90 transition-colors"
            >
              Sign In
            </button>
          </div>
        </nav>

        {/* Hero Section - Updated messaging */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center space-x-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-sm">Join 2,000+ teams worldwide</span>
            </div>

            <h1 className="text-5xl font-bold leading-tight">
              Never miss a game.
              <span className="block text-primary mt-2">Play more together</span>
            </h1>

            <p className="text-lg text-gray-400 max-w-lg">
              Whether you're organizing pickup games with friends or managing a professional team,
              TeamSync makes it easy to schedule games, coordinate with teammates, and spend more
              time playing the sports you love.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setAuthMode('signup');
                  setIsAuthOpen(true);
                }}
                className="group px-6 py-3 bg-primary rounded text-white font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                Get Started Free
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.a
                href="#demo"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 border border-white/10 rounded text-white font-medium hover:bg-white/5 transition-colors flex items-center gap-2"
              >
                See it in action
                <Calendar className="w-4 h-4" />
              </motion.a>
            </div>

            {/* Updated Social Proof */}
            <div className="pt-8 border-t border-white/5">
              <div className="flex gap-8">
                <div className="group cursor-pointer">
                  <div className="text-2xl font-bold text-primary group-hover:scale-105 transition-transform">93%</div>
                  <div className="text-sm text-gray-400">More games played</div>
                </div>
                <div className="group cursor-pointer">
                  <div className="text-2xl font-bold text-primary group-hover:scale-105 transition-transform">15k+</div>
                  <div className="text-sm text-gray-400">Active players</div>
                </div>
                <div className="group cursor-pointer">
                  <div className="text-2xl font-bold text-primary group-hover:scale-105 transition-transform">4.9/5</div>
                  <div className="text-sm text-gray-400">Player satisfaction</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="bg-[#13141A] border border-white/10 rounded-lg p-6 shadow-2xl">
              <div className="space-y-6">
                {/* Quick Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Next Event</div>
                    <div className="font-medium mt-1">2d 14h</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Players</div>
                    <div className="font-medium mt-1">12</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Practice</div>
                    <div className="font-medium mt-1">Today 18:00</div>
                  </div>
                </div>

                {/* Team Performance */}
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-primary" />
                      <span className="font-medium">Team Performance</span>
                    </div>
                    <span className="text-sm text-primary">Last 30 days</span>
                  </div>
                  <div className="h-32 flex items-end justify-between gap-2">
                    {[65, 70, 85, 75, 90, 85, 92].map((height, i) => (
                      <div
                        key={i}
                        className="w-full bg-white/10 rounded-sm"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="flex-1 bg-primary/10 hover:bg-primary/20 transition-colors rounded-lg p-4 text-center"
                  >
                    <MessageSquare className="w-5 h-5 text-primary mx-auto mb-2" />
                    <span className="text-sm">Team Chat</span>
                  </button>
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="flex-1 bg-primary/10 hover:bg-primary/20 transition-colors rounded-lg p-4 text-center"
                  >
                    <Calendar className="w-5 h-5 text-primary mx-auto mb-2" />
                    <span className="text-sm">Schedule</span>
                  </button>
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="flex-1 bg-primary/10 hover:bg-primary/20 transition-colors rounded-lg p-4 text-center"
                  >
                    <Users className="w-5 h-5 text-primary mx-auto mb-2" />
                    <span className="text-sm">Squad</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-24 ">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Everything you need to lead your team
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Powerful features designed specifically for sports teams, from
              amateur to professional levels
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: 'Smart Scheduling',
                description:
                  'Schedule practices, games, and team meetings. Send automatic reminders to all participants.',
              },
              {
                icon: Users,
                title: 'Team Management',
                description:
                  'Track attendance, manage rosters, and handle team communications in one place.',
              },
              {
                icon: MessageSquare,
                title: 'Team Communication',
                description:
                  'Built-in chat, announcements, and file sharing. Keep everyone aligned and engaged.',
              },
              {
                icon: BarChart3,
                title: 'Competition Management',
                description:
                  'Organize leagues, tournaments, and friendly matches. Keep track of scores and standings.',
              },
              {
                icon: Calendar,
                title: 'Event Planning',
                description:
                  'Organize matches, training sessions, and team events. Automatic reminders and confirmations.',
              },
              {
                icon: Trophy,
                title: 'Competition Tracking',
                description:
                  'Monitor league standings, match statistics, and performance trends throughout the season.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                <div className="relative border border-white/10 rounded-lg p-6 hover:border-primary/50 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary mb-4" />
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* New Pricing Section */}
        <div id="pricing" className="py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose the plan that works best for your team, whether you're playing for fun or competing professionally
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                {/* SVG Background for 'Pro' Plan */}
                {tier.name === 'Pro' && (
                  <Topography width="100%" height="100%" opacity={0.05} className="rounded-lg" />
                )}

                <div className="relative border border-white/10 rounded-lg p-8 hover:border-primary/50 transition-colors">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">${tier.price}</span>
                      <span className="text-gray-400">/month</span>
                    </div>
                    <p className="text-gray-400 mt-2">{tier.description}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setAuthMode('signup');
                      setIsAuthOpen(true);
                    }}
                    className={`w-full px-6 py-3 rounded font-medium transition-colors ${tier.name === 'Pro'
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-white/5 hover:bg-white/10'
                      }`}
                  >
                    {tier.name === 'Free' ? 'Get Started' : 'Go Pro'}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
};

export default WelcomePage;