import React, { useState } from 'react';
import {
  User,
  Trophy,
  FileText,
  List,
  Code,
  Calendar,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  Settings,
  Award,
  Target,
  Zap,
  Edit,
  Eye,
  BarChart3,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';
import { useAuthProfile } from '../../hooks/reactQuery/useAuthApi';
import { MyLoader } from '../common';
import { useNavigate } from 'react-router-dom';
import timeAgo from '../../utils/timeAgo';

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const navigate = useNavigate();

  const { data: profileData, isLoading } = useAuthProfile();

  if (isLoading) {
    return <MyLoader />;
  }

  const stats = {
    totalProblemsSolved: profileData?.data?.problemsSolved.length,
    totalSubmissions: profileData?.data?.submissions.length,
    totalPlaylists: profileData?.data?.playlists.length,
  };

  // console.log(profileData?.data?);

  const difficultyData = ['EASY', 'MEDIUM', 'HARD'].map((level) => ({
    name: level.charAt(0) + level.slice(1).toLowerCase(),
    value: profileData?.data?.problemsSolved.filter((p) => p.problem.difficulty === level).length,
    color: level === 'EASY' ? '#10B981' : level === 'MEDIUM' ? '#F59E0B' : '#EF4444',
  }));

  const statusColorMap = {
    Accepted: '#10B981',
    'Wrong Answer': '#EF4444',
    'Time Limit': '#F59E0B',
    'Runtime Error': '#8B5CF6',
    'Runtime Error (NZEC)': '#8B5CF6',
  };

  const statusCountMap = {};

  profileData?.data?.submissions.forEach(({ status }) => {
    statusCountMap[status] = (statusCountMap[status] || 0) + 1;
  });

  const submissionStatusData = Object.entries(statusCountMap).map(([name, value]) => ({
    name,
    value,
    color: statusColorMap[name] || '#6B7280', // default gray
  }));

  const langCountMap = {};

  profileData?.data?.submissions.forEach(({ language }) => {
    const lang = language.charAt(0).toUpperCase() + language.slice(1).toLowerCase();
    langCountMap[lang] = (langCountMap[lang] || 0) + 1;
  });

  const languageData = Object.entries(langCountMap).map(([name, count]) => ({ name, count }));

  const trendMap = {};

  profileData?.data?.submissions.forEach(({ createdAt }) => {
    const date = new Date(createdAt);
    const month = date.toLocaleString('default', { month: 'short' });
    trendMap[month] = (trendMap[month] || 0) + 1;
  });

  const submissionTrendData = Object.entries(trendMap).map(([month, submissions]) => ({
    month,
    submissions,
  }));

  const recentSubmissions = profileData?.data?.submissions
    .slice(-4)
    .reverse()
    .map(({ id, problem, status, language, createdAt }) => ({
      id,
      problem: problem.title,
      status,
      language: language.charAt(0).toUpperCase() + language.slice(1).toLowerCase(),
      time: new Date(createdAt).toLocaleString(), // You can use dayjs/timeago.js for "x hours ago"
    }));

  const recentProblems = profileData?.data?.problemsSolved
    .slice(-3)
    .reverse()
    .map(({ problem, updatedAt }) => ({
      title: problem.title,
      difficulty: problem.difficulty.charAt(0) + problem.difficulty.slice(1).toLowerCase(),
      solved: new Date(updatedAt).toLocaleDateString(), // Optional: make it "x days ago"
    }));

  const playlists = profileData?.data?.playlists.map(({ id, name, createdAt, problems }) => ({
    id,
    name,
    problems: problems.length,
    created: new Date(createdAt).toLocaleDateString(),
  }));

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'Wrong Answer':
        return <XCircle className="w-4 h-4 text-error" />;
      case 'Time Limit':
        return <Clock className="w-4 h-4 text-warning" />;
      default:
        return <AlertCircle className="w-4 h-4 text-info" />;
    }
  };

  const getDifficultyBadge = (difficulty) => {
    const colors = {
      Easy: 'badge-success',
      Medium: 'badge-warning',
      Hard: 'badge-error',
    };
    return <span className={`badge ${colors[difficulty]} badge-sm`}>{difficulty}</span>;
  };

  return (
    <div className="min-h-screen bg-base-200 p-12 rounded-2xl shadow-lg">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Profile Card */}
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="avatar">
                <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={profileData?.data?.imageUrl || 'https://avatar.iran.liara.run/public/boy'}
                    alt="Profile"
                  />
                </div>
              </div>

              <div className="text-center lg:text-left flex-1">
                <h1 className="text-4xl font-bold mb-2">{profileData?.data?.name}</h1>
                <p className="text-base-content/70 text-lg mb-4">{profileData?.data?.email}</p>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <div
                    className={`badge ${
                      profileData?.data?.role === 'ADMIN' ? 'badge-primary' : 'badge-secondary'
                    } badge-lg gap-2`}
                  >
                    <User className="w-4 h-4" />
                    {profileData?.data?.role}
                  </div>
                  <div className="badge badge-outline badge-lg gap-2">
                    <Calendar className="w-4 h-4" />
                    Member since {new Date(profileData?.data?.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">Problems Solved</p>
                  <p className="text-3xl font-bold text-success">{stats.totalProblemsSolved}</p>
                </div>
                <div className="p-3 bg-success/10 rounded-lg">
                  <Trophy className="w-8 h-8 text-success" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">Total Submissions</p>
                  <p className="text-3xl font-bold text-info">{stats.totalSubmissions}</p>
                </div>
                <div className="p-3 bg-info/10 rounded-lg">
                  <FileText className="w-8 h-8 text-info" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">Playlists Created</p>
                  <p className="text-3xl font-bold text-warning">{stats.totalPlaylists}</p>
                </div>
                <div className="p-3 bg-warning/10 rounded-lg">
                  <List className="w-8 h-8 text-warning" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body p-0">
            {/* Tab Navigation */}
            <div className="flex flex-wrap border-b border-base-300">
              <button
                className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-medium transition-colors
                  ${
                    activeTab === 'overview'
                      ? 'border-b-2 border-primary text-primary bg-primary/5'
                      : 'text-base-content/70 hover:text-base-content hover:bg-base-200'
                  }`}
                onClick={() => setActiveTab('overview')}
              >
                <BarChart3 className="w-5 h-5" />
                Overview
              </button>

              <button
                className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-medium transition-colors
                  ${
                    activeTab === 'activity'
                      ? 'border-b-2 border-primary text-primary bg-primary/5'
                      : 'text-base-content/70 hover:text-base-content hover:bg-base-200'
                  }`}
                onClick={() => setActiveTab('activity')}
              >
                <Activity className="w-5 h-5" />
                Activity
              </button>

              <button
                className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-medium transition-colors
                  ${
                    activeTab === 'playlists'
                      ? 'border-b-2 border-primary text-primary bg-primary/5'
                      : 'text-base-content/70 hover:text-base-content hover:bg-base-200'
                  }`}
                onClick={() => setActiveTab('playlists')}
              >
                <Play className="w-5 h-5" />
                Playlists
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Problems by Difficulty Chart */}
                    <div className="card bg-base-200 shadow-lg">
                      <div className="card-body">
                        <h3 className="card-title mb-6 flex items-center gap-2">
                          <Target className="w-5 h-5 text-primary" />
                          Problems solved by Difficulty
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={difficultyData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              dataKey="value"
                            >
                              {difficultyData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-6 mt-4">
                          {difficultyData.map((item) => (
                            <div key={item.name} className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: item.color }}
                              ></div>
                              <span className="text-sm font-medium">
                                {item.name}: {item.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Submission Status Chart */}
                    <div className="card bg-base-200 shadow-lg">
                      <div className="card-body">
                        <h3 className="card-title mb-6 flex items-center gap-2">
                          <Award className="w-5 h-5 text-primary" />
                          Submission Status
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={submissionStatusData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              dataKey="value"
                            >
                              {submissionStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                          {submissionStatusData.map((item) => (
                            <div key={item.name} className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                              ></div>
                              <span>
                                {item.name}: {item.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Languages Used Chart */}
                    <div className="card bg-base-200 shadow-lg">
                      <div className="card-body">
                        <h3 className="card-title mb-6 flex items-center gap-2">
                          <Code className="w-5 h-5 text-primary" />
                          Programming Languages
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={languageData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="hsl(var(--p))" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Submissions Over Time */}
                    <div className="card bg-base-200 shadow-lg">
                      <div className="card-body">
                        <h3 className="card-title mb-6 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-primary" />
                          Submission Trends
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <LineChart data={submissionTrendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="submissions"
                              stroke="hsl(var(--su))"
                              strokeWidth={3}
                              dot={{ fill: 'hsl(var(--su))', strokeWidth: 2, r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <div className="space-y-8">
                  {/* Recent Submissions Table */}
                  <div className="card bg-base-200 shadow-lg">
                    <div className="card-body">
                      <h3 className="card-title mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        Recent Submissions
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="table table-zebra">
                          <thead>
                            <tr>
                              <th className="font-semibold">Problem</th>
                              <th className="font-semibold">Status</th>
                              <th className="font-semibold">Language</th>
                              <th className="font-semibold">Submitted</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentSubmissions.map((submission) => (
                              <tr key={submission.id} className="hover">
                                <td className="font-medium">{submission.problem}</td>
                                <td>
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(submission.status)}
                                    <span className="font-medium">{submission.status}</span>
                                  </div>
                                </td>
                                <td>
                                  <span className="badge badge-ghost">{submission.language}</span>
                                </td>
                                <td className="text-base-content/60">{timeAgo(submission.time)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Recently Solved Problems */}
                  <div className="card bg-base-200 shadow-lg">
                    <div className="card-body">
                      <h3 className="card-title mb-6 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        Recently Solved Problems
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recentProblems.map((problem, index) => (
                          <div
                            key={index}
                            className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
                          >
                            <div className="card-body p-4">
                              <h4 className="font-semibold text-base mb-3">{problem.title}</h4>
                              <div className="flex justify-between items-center">
                                {getDifficultyBadge(problem.difficulty)}
                                {/* <span className="text-sm text-base-content/60">
                                  {timeAgo(problem.solved)}
                                </span> */}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Playlists Tab */}
              {activeTab === 'playlists' && (
                <div className="card bg-base-200 shadow-lg">
                  <div className="card-body">
                    <h3 className="card-title mb-6 flex items-center gap-2">
                      <List className="w-5 h-5 text-primary" />
                      My Playlists ({playlists.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {playlists.map((playlist, index) => (
                        <div
                          key={index}
                          className="card bg-base-100 shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
                        >
                          <div className="card-body">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                  <Play className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-lg">{playlist.name}</h4>
                                  <p className="text-sm text-base-content/60">
                                    {playlist.problems} problems
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => navigate(`/playlists/${playlist.id}`)}
                                className="btn btn-ghost btn-sm"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="text-xs text-base-content/50">
                              Created: {new Date(playlist.created).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
