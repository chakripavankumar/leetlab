import { useLocation, useNavigate } from "react-router-dom";
import { CopyButton } from "../common";
import { useEffect, useState } from "react";
import useCodeEditorStore from "../../stores/useCodeEditorStore";
import { useAuthStore } from "../../stores/useAuthStore";
import formatDate from "../../utils/formatDate";
import SubmissionHistory from "./SubmissionHistory";

const Contents = ({
  id = "",
  title = "",
  description = "",
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
  const [activeTab, setActiveTab] = useState("description");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { hash: activeHashPathName } = useLocation();

  const { codeMap, lastEditedLanguage } = useCodeEditorStore();
  const { authUser, problemsSolved, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const sourceCode = codeMap[`${id}:${lastEditedLanguage}`];
  useEffect(() => {
    const updateTabFromHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash === "submission") setIsSubmitted(true);
      setActiveTab(hash || "description");
    };

    updateTabFromHash(); // Initial set

    window.addEventListener("hashchange", updateTabFromHash);
    return () => window.removeEventListener("hashchange", updateTabFromHash);
  }, [activeHashPathName]);
  if (
    !isAuthenticated &&
    (activeTab === "submissionHistory" || activeTab === "submission")
  ) {
    navigate("/login");
  }
  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="tabs tabs-bordered bg-base-200 flex-shrink-0">
        <span
          className={`tab ${activeTab === "description" ? "tab-active" : ""}`}
          onClick={() => {
            setActiveTab("description");
            window.location.hash = "description";
          }}
        >
          Description
        </span>
        <span
          className={`tab ${activeTab === "editorial" ? "tab-active" : ""}`}
          onClick={() => {
            setActiveTab("editorial");
            window.location.hash = "editorial";
          }}
        >
          Editorial
        </span>
        <span
          className={`tab ${activeTab === "solutions" ? "tab-active" : ""}`}
          onClick={() => {
            setActiveTab("solutions");
            window.location.hash = "solutions";
          }}
        >
          Solutions
        </span>
        {isAuthenticated && (
          <>
            <span
              className={`tab ${
                activeTab === "submissionHistory" ? "tab-active" : ""
              }`}
              onClick={() => {
                setActiveTab("submissionHistory");
                window.location.hash = "submissionHistory";
              }}
            >
              History
            </span>
            {isSubmitted && (
              <span
                className={`tab ${
                  activeTab === "submission" ? "tab-active" : ""
                }`}
                onClick={() => {
                  setActiveTab("submission");
                  window.location.hash = "submission";
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
                
             </div>
          </div>
    </div>
  );
};

export default Contents;
