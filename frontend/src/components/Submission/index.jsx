import { Link, useParams } from 'react-router-dom';
import { useGetSubmissionById } from '../../hooks/reactQuery/useSubmissionApi';
import { CopyButton, MyLoader, PageNotFound } from '../common';
import {
  Book,
  LinkIcon,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Code,
  User,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { calculateAverageMemory, calculateAverageTime } from '../../utils/calculation';
import formatDate from '../../utils/formatDate';

const Submission = () => {
  const { submissionId } = useParams();

  const { isLoading, isError, data, error } = useGetSubmissionById(submissionId);

  const { authUser } = useAuthStore();

  if (isLoading) {
    return <MyLoader />;
  }

  if (isError) {
    // toast.error(error.response.data?.error || 'Something went wrong');
    console.log(error);
    return <PageNotFound />;
  }

  // console.log(data.data);
  const avgTime = calculateAverageTime(data?.data?.time).toFixed(2);
  const avgMemory = calculateAverageMemory(data?.data?.memory).toFixed(0);

  const totalTestcases = data?.data?.testcasesResults?.length;
  const passedTestcases = data?.data?.testcasesResults?.filter((t) => t.isPassed).length;

  // Find first failed test case
  const firstFailedTestCase = data?.data?.testcasesResults?.find((t) => !t.isPassed);

  return (
    <div className="min-h-screen bg-base-200 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Book className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">Submission Details</h1>
                  <p className="text-base-content/70 text-lg">
                    View detailed information about your code submission
                  </p>
                </div>
              </div>

              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-title text-xs">Status</div>
                  <div
                    className={`stat-value text-2xl ${
                      data.data?.status === 'Accepted' ? 'text-success' : 'text-error'
                    }`}
                  >
                    {data.data?.status}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">Test Cases</p>
                  <p className="text-3xl font-bold text-info">
                    {passedTestcases}/{totalTestcases}
                  </p>
                </div>
                <div className="p-3 bg-info/10 rounded-lg">
                  {data.data?.status === 'Accepted' ? (
                    <CheckCircle className="w-8 h-8 text-success" />
                  ) : (
                    <XCircle className="w-8 h-8 text-error" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">Avg Time</p>
                  <p className="text-3xl font-bold text-warning">{avgTime}ms</p>
                </div>
                <div className="p-3 bg-warning/10 rounded-lg">
                  <Clock className="w-8 h-8 text-warning" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">Avg Memory</p>
                  <p className="text-3xl font-bold text-info">{avgMemory}KB</p>
                </div>
                <div className="p-3 bg-info/10 rounded-lg">
                  <Zap className="w-8 h-8 text-info" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">Language</p>
                  <p className="text-3xl font-bold text-success capitalize">
                    {data.data?.language?.toLowerCase()}
                  </p>
                </div>
                <div className="p-3 bg-success/10 rounded-lg">
                  <Code className="w-8 h-8 text-success" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Problem Info Card */}
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body p-0">
            <div className="p-6 border-b border-base-300">
              <h2 className="card-title text-2xl flex items-center gap-2">
                <LinkIcon className="w-6 h-6 text-primary" />
                Problem Information
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Book className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-base-content/60">Problem</p>
                    <Link to={`/problems/${data.data?.problemId}`}>
                      <span className="text-lg font-semibold text-primary hover:text-primary-focus transition-colors">
                        {data.data?.problem?.title}
                      </span>
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-info/10 rounded-lg">
                    <User className="w-5 h-5 text-info" />
                  </div>
                  <div>
                    <p className="text-sm text-base-content/60">Submitted By</p>
                    <p className="text-lg font-semibold">{authUser.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <Calendar className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-base-content/60">Submitted</p>
                    <p className="text-lg font-semibold">{formatDate(data.data.createdAt, true)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Source Code Card */}
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body p-0">
            <div className="p-6 border-b border-base-300">
              <div className="flex items-center justify-between">
                <h2 className="card-title text-2xl flex items-center gap-2">
                  <Code className="w-6 h-6 text-primary" />
                  Source Code
                  <span className="badge badge-outline badge-lg capitalize">
                    {data.data?.language?.toLowerCase()}
                  </span>
                </h2>
                <CopyButton text={data.data?.sourceCode} />
              </div>
            </div>

            <div className="p-6">
              <div className="bg-base-200 rounded-lg p-4">
                <pre className="text-sm overflow-auto max-h-96 whitespace-pre-wrap">
                  <code>{data.data?.sourceCode}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* First Failed Test Case Card - Only show if there are failures */}
        {firstFailedTestCase && (
          <div className="card bg-base-100 shadow-2xl border-l-4 border-error">
            <div className="card-body p-0">
              <div className="p-6 border-b border-base-300">
                <h2 className="card-title text-2xl flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-error" />
                  First Failed Test Case
                  <div className="badge badge-error badge-lg">
                    Test Case #{firstFailedTestCase.testCaseNumber}
                  </div>
                </h2>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Input */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-info rounded-full"></div>
                      <h3 className="font-semibold text-lg">Input</h3>
                    </div>
                    <div className="bg-base-200 rounded-lg p-4">
                      <pre className="text-sm whitespace-pre-wrap">
                        <code>{firstFailedTestCase.stdin}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Expected vs Actual Output */}
                  <div className="space-y-4">
                    {/* Expected Output */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-success rounded-full"></div>
                        <h3 className="font-semibold text-lg">Expected Output</h3>
                      </div>
                      <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                        <pre className="text-sm whitespace-pre-wrap">
                          <code>{firstFailedTestCase.expectedOutput}</code>
                        </pre>
                      </div>
                    </div>

                    {/* Actual Output */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-error rounded-full"></div>
                        <h3 className="font-semibold text-lg">Your Output</h3>
                      </div>
                      <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                        <pre className="text-sm whitespace-pre-wrap">
                          <code>{firstFailedTestCase.stdout}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Test Case Stats */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-base-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-base-content/60">Status</p>
                    <p className="font-semibold text-error">{firstFailedTestCase.status}</p>
                  </div>
                  <div className="bg-base-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-base-content/60">Time</p>
                    <p className="font-semibold">{firstFailedTestCase.time}ms</p>
                  </div>
                  <div className="bg-base-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-base-content/60">Memory</p>
                    <p className="font-semibold">
                      {(firstFailedTestCase.memory / 1024).toFixed(0)}KB
                    </p>
                  </div>
                  <div className="bg-base-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-base-content/60">Test #</p>
                    <p className="font-semibold">{firstFailedTestCase.testCaseNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Test Cases Status Card */}
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body p-0">
            <div className="p-6 border-b border-base-300">
              <h2 className="card-title text-2xl flex items-center gap-2">
                <div className="flex items-center gap-2">
                  {data.data?.status === 'Accepted' ? (
                    <CheckCircle className="w-6 h-6 text-success" />
                  ) : (
                    <XCircle className="w-6 h-6 text-error" />
                  )}
                  Test Cases Results
                </div>
                <div
                  className={`badge ${
                    data.data?.status === 'Accepted' ? 'badge-success' : 'badge-error'
                  } badge-lg text-nowrap`}
                >
                  {passedTestcases} / {totalTestcases} Passed
                </div>
              </h2>
            </div>

            <div className="p-6">
              <div className="text-center">
                <div
                  className={`text-6xl font-bold mb-4 ${
                    data.data?.status === 'Accepted' ? 'text-success' : 'text-error'
                  }`}
                >
                  {data.data?.status === 'Accepted' ? '✓' : '✗'}
                </div>
                <h3 className="text-2xl font-bold mb-2">{data.data?.status}</h3>
                <p className="text-lg text-base-content/70">
                  {passedTestcases} out of {totalTestcases} test cases passed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Submission;
