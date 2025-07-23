import {
  Play,
  Trophy,
  Target,
  Code,
  Users,
  Zap,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Rocket,
  Layout,
  PlusSquare,
  EyeOff,
} from 'lucide-react';

export const PLATFORM_FEATURES = [
  {
    icon: <Sparkles className="w-8 h-8 text-purple-500" />,
    title: 'AI Assistance',
    description: 'Get hints, pseudocode, and step-by-step guidance from DSA CodeLab AI Bot',
  },
  {
    icon: <Zap className="w-8 h-8 text-warning" />,
    title: 'Auto Save',
    description: 'Never lose your progress. Your code is automatically saved as you type.',
  },
  {
    icon: <EyeOff className="w-8 h-8 text-muted" />,
    title: 'Hidden Test Cases',
    description:
      'Test your code against hidden cases that aren’t visible to prevent hardcoded solutions.',
  },
  {
    icon: <Layout className="w-8 h-8 text-primary" />,
    title: 'Interactive Code Editor UI',
    description: 'Enjoy a smooth and modern coding experience with our custom-built code editor.',
  },
  {
    icon: <Trophy className="w-8 h-8 text-primary" />,
    title: 'Detailed Profile Statistics',
    description:
      'Comprehensive analytics to track your progress and identify areas for improvement.',
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-success" />,
    title: 'Browse Problems Without Login',
    description: 'Explore our extensive problem library before creating an account.',
  },
  {
    icon: <Target className="w-8 h-8 text-success" />,
    title: '15+ Language Support',
    description: 'Code in Python, JavaScript, and Java with full syntax highlighting.',
  },
  {
    icon: <PlusSquare className="w-8 h-8 text-accent" />,
    title: 'Easy Problem Creation',
    description:
      'Add new problems effortlessly with a clean and intuitive problem-setting interface.',
  },
  {
    icon: <Play className="w-8 h-8 text-secondary" />,
    title: 'Curated Playlists',
    description: 'Expertly crafted problem sets designed to enhance your coding skills.',
  },
];

export const PLATFORM_STATS = [
  { number: '50K+', label: 'Problems Solved', icon: <Target className="w-6 h-6 text-success" /> },
  { number: '10K+', label: 'Active Users', icon: <Users className="w-6 h-6 text-primary" /> },
  { number: '15+', label: 'Languages', icon: <Code className="w-6 h-6 text-warning" /> },
  { number: '99.9%', label: 'Uptime', icon: <Zap className="w-6 h-6 text-info" /> },
];
