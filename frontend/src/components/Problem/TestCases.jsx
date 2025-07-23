import { useEffect, useState } from 'react';

const Testcases = ({ testcases = [] }) => {
  const [activeTestCase, setActiveTestCase] = useState(0);
  // console.log('testcases', testcases);
  const totalRunTime = testcases.reduce((acc, { time }) => acc + Number(time), 0);

  useEffect(() => {
    const firstFailed = testcases.findIndex((tc) => !tc?.isPassed);
    // console.log(firstFailed);
    setActiveTestCase(firstFailed > -1 ? firstFailed : 0);
  }, [testcases]);

  return (
    <div className="h-full flex flex-col bg-base-100">
      {/* Test Header */}
      <div className="bg-base-200 border-b border-base-300 flex-shrink-0">
        <div className="tabs tabs-bordered">
          <span className="btn ">Testcases</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4">
          {!!testcases[activeTestCase]?.status && (
            <div className="flex gap-2 mb-4">
              {testcases[activeTestCase]?.isPassed ? (
                <span className="badge badge-success">{testcases[activeTestCase]?.status}</span>
              ) : (
                <span className="badge badge-error">{testcases[activeTestCase]?.status}</span>
              )}
              {!Number.isNaN(totalRunTime) && (
                <span>
                  <span className="font-semibold">Runtime: </span>
                  {totalRunTime.toFixed(2)} ms
                </span>
              )}
            </div>
          )}
          <div className="flex gap-2 mb-4">
            {testcases.map((_, index) => (
              <button
                key={index}
                className={`btn btn-sm ${activeTestCase === index ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveTestCase(index)}
              >
                Case {index + 1}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Input</label>
              <div className="bg-base-200 p-3 rounded-lg font-mono text-sm">
                {testcases[activeTestCase]?.input}
              </div>
            </div>
            {!!testcases[activeTestCase]?.status && (
              <div>
                <label className="block text-sm font-medium mb-1">Output:</label>
                <div className="bg-base-200 p-3 rounded-lg font-mono text-sm">
                  {testcases[activeTestCase]?.stdout}
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Expected:</label>
              <div className="bg-base-200 p-3 rounded-lg font-mono text-sm">
                {testcases[activeTestCase]?.output}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testcases;
