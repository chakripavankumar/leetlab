import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CopyButton } from '../common';
import { useEffect, useState } from 'react';
import { ArrowLeftCircle } from 'lucide-react';
import useCodeEditorStore from '../../stores/useCodeEditorStore';
import { useAuthStore } from '../../stores/useAuthStore';
import formatDate from '../../utils/formatDate';
import SubmissionHistory from './SubmissionHistory';

const Contents = ({
  id = '',
  title = '',
  description = '',
  difficulty,
  tags = [],
  companies = [],
  examples = [],
  hints,
  editorial,
  constraints,
  referenceSolutions = {},
  submissionData = {},
}) => {
  const [activeTab, setActiveTab] = useState('description');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { hash: activeHashPathName } = useLocation();

  const { codeMap, lastEditedLanguage } = useCodeEditorStore();
  const { authUser, problemsSolved, isAuthenticated } = useAuthStore();

  const navigate = useNavigate();

  const sourceCode = codeMap[`${id}:${lastEditedLanguage}`];

  useEffect(() => {
    const updateTabFromHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'submission') setIsSubmitted(true);
      setActiveTab(hash || 'description');
    };

    updateTabFromHash(); // Initial set

    window.addEventListener('hashchange', updateTabFromHash);
    return () => window.removeEventListener('hashchange', updateTabFromHash);
  }, [activeHashPathName]);

  if (!isAuthenticated && (activeTab === 'submissionHistory' || activeTab === 'submission')) {
    navigate('/login');
  }

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="tabs tabs-bordered bg-base-200 flex-shrink-0">
        <span
          className={`tab ${activeTab === 'description' ? 'tab-active' : ''}`}
          onClick={() => {
            setActiveTab('description');
            window.location.hash = 'description';
          }}
        >
          Description
        </span>
        <span
          className={`tab ${activeTab === 'editorial' ? 'tab-active' : ''}`}
          onClick={() => {
            setActiveTab('editorial');
            window.location.hash = 'editorial';
          }}
        >
          Editorial
        </span>
        <span
          className={`tab ${activeTab === 'solutions' ? 'tab-active' : ''}`}
          onClick={() => {
            setActiveTab('solutions');
            window.location.hash = 'solutions';
          }}
        >
          Solutions
        </span>
        {isAuthenticated && (
          <>
            <span
              className={`tab ${activeTab === 'submissionHistory' ? 'tab-active' : ''}`}
              onClick={() => {
                setActiveTab('submissionHistory');
                window.location.hash = 'submissionHistory';
              }}
            >
              History
            </span>
            {isSubmitted && (
              <span
                className={`tab ${activeTab === 'submission' ? 'tab-active' : ''}`}
                onClick={() => {
                  setActiveTab('submission');
                  window.location.hash = 'submission';
                }}
              >
                Current Submission
              </span>
            )}
          </>
        )}
      </div>

      {/* Content - Fixed height and scrollable */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-6 py-2">
          {activeTab === 'description' && (
            <div className="prose prose-sm max-w-none">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-base-content m-0">{title}</h1>
                {/* {(isSolved || submissionData?.isAllPassed) && ( */}
                {problemsSolved.includes(id) && <div className="badge badge-success">Solved ✓</div>}
              </div>

              <div className="badge badge-warning capitalize my-3">{difficulty}</div>
              <div className="flex gap-2 mb-6">
                {companies.map((company) => (
                  <div key={company} className="badge badge-outline">
                    {company}
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-base-content">
                {/* Description */}
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body p-2">
                    <pre className="text-sm leading-relaxed text-pretty font-sans">
                      {description}
                    </pre>
                  </div>
                </div>

                {Array.isArray(examples) &&
                  examples.map((exmp, index) => (
                    <div key={index} className="card bg-base-200 p-4 rounded-lg mt-6">
                      <h3 className="font-semibold mb-2">Example {index + 1}:</h3>
                      <pre className="space-y-2 font-mono text-sm text-pretty">
                        <div>
                          <strong>Input:</strong> {exmp?.input}
                        </div>
                        <div>
                          <strong>Output:</strong> {exmp?.output}
                        </div>
                        <div>
                          <strong>Explanation:</strong> {exmp?.explanation}
                        </div>
                      </pre>
                    </div>
                  ))}

                {/* Constraints and Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body p-4">
                      <h3 className="font-semibold text-sm mb-2">Constraints</h3>
                      <div className="bg-base-200 rounded p-2">
                        <pre className="text-xs text-pretty">{constraints}</pre>
                      </div>
                    </div>
                  </div>

                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body p-4">
                      <h3 className="font-semibold text-sm mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-1">
                        {tags.map((tag) => (
                          <div key={tag} className="badge badge-outline text-xs">
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hints */}
                {hints && (
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body p-4">
                      <h3 className="font-semibold text-sm mb-2">Hints</h3>
                      <div className="bg-base-200 rounded p-2">
                        <div className="text-xs">{hints}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'editorial' && (
            <div className="max-w-7xl mx-auto">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-4">
                  <p className="text-sm leading-relaxed">{editorial}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'solutions' && (
            <div className="max-w-7xl mx-auto space-y-4">
              {Object.entries(referenceSolutions).map(([lang, code]) => (
                <div key={lang} className="card bg-base-100 shadow-xl">
                  <div className="card-body p-0">
                    <div className="p-3 border-b border-base-300">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold capitalize">{lang}</span>
                        <CopyButton text={code} />
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="bg-base-200 rounded p-3">
                        <pre className="text-xs overflow-auto max-h-60 whitespace-pre-wrap">
                          <code>{code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* current submission */}
          {activeTab === 'submission' && (
            <div className="prose prose-sm max-w-none">
              <h2 className="text-xl font-bold mb-4">Submissions</h2>{' '}
              <>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {submissionData?.isAllPassed ? (
                      <span className="badge badge-success">{submissionData?.status}</span>
                    ) : (
                      <span className="badge badge-error">{submissionData?.status}</span>
                    )}
                    <p className="text-sm opacity-50">
                      {submissionData?.passedTestcasesCount} / {submissionData?.totalTestcasesCount}{' '}
                      testcases passed
                    </p>
                  </div>
                  <p className="text-sm opacity-70">
                    Submitted by {authUser?.name} on {formatDate(submissionData?.submittedOn, true)}
                  </p>

                  {!submissionData?.isAllPassed && (
                    <div className="bg-base-200 p-4 rounded-lg mt-6">
                      <h3 className="font-semibold mb-2">
                        Failed testcase no. {submissionData?.testCaseNumber}:
                      </h3>
                      <pre className="space-y-2 font-mono text-sm text-pretty">
                        <div>
                          <strong>Input:</strong> {submissionData?.stdin}
                        </div>
                        <div>
                          <strong>Output:</strong> {submissionData?.stdout}
                        </div>
                        <div>
                          <strong>Expected Output:</strong> {submissionData?.expectedOutput}
                        </div>
                        <div>
                          <strong>Error:</strong> {submissionData?.stderr}
                        </div>
                      </pre>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-base-300 rounded-lg p-3">
                      <h4 className="text-center font-semibold">Time</h4>
                      <p className="text-center p-2 text-2xl text-white">
                        {Number(submissionData?.time).toFixed(2)} ms
                      </p>
                    </div>
                    <div className="border border-base-300 rounded-lg p-3">
                      <h4 className="text-center font-semibold">Memory</h4>
                      <p className="text-center p-2 text-2xl text-white">
                        {(parseInt(submissionData?.memory) / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>

                  <h3 className="font-semibold my-2 flex justify-between">
                    <span>
                      Code:{' '}
                      <span className="opacity-70 capitalize">
                        {lastEditedLanguage.toLowerCase()}
                      </span>
                    </span>
                    <span className="sticky top-0 right-0">
                      <CopyButton text={sourceCode} />
                    </span>
                  </h3>
                  <pre className="max-h-60 h-full text-xs bg-base-200 p-4 rounded-lg overflow-auto relative">
                    {sourceCode}
                  </pre>
                </div>
              </>
            </div>
          )}

          {activeTab === 'submissionHistory' && <SubmissionHistory key={id} />}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer flex justify-center items-center p-2 bg-base-100 border-t border-base-300">
        <p className="text-xs text-center opacity-50">
          Copyright © {new Date().getFullYear()} - All right reserved
        </p>
      </footer>
    </div>
  );
};

export default Contents;
