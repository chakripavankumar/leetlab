/* eslint-disable no-unused-vars */
import { DRAFT_PROBLEM_KEY, QUERY_KEYS } from "../../constants/keys";
import {
  BookOpen,
  Code,
  FileText,
  TestTube,
  CheckCircle,
  Settings,
  Save,
  Send,
  Download,
  RefreshCcwDotIcon,
} from "lucide-react";
import MenuBarTab, { MenuBarTabItem } from "../Common/MenuBarTab";
import RenderBasicDetails from "./RenderBasicDetails";
import RenderExamples from "./RenderExamples";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { zodProblemSchema } from "../../utils/zodSchema";
import { useCreateProblem } from "../../hooks/ReactQuery/useAdmimApi";
import { DEFAULT_PROBLEM_VALUES } from "../../constants/ProblemDetials";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  setToLocalStorage,
} from "../../utils/localStorage";
import {
  sampleDPData,
  sampleStringProblem,
  sampleDemoData,
} from "../../constants/SampleProblemData";
import toast from "react-hot-toast";
import queryClient from "../../utils/queryClient";

const CreateProblem = () => {
  const [sampleType, setSampleType] = useState("DP");
  const { mutate: createProblem, isLoading } = useCreateProblem();

  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    reset,
    resetField,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: DEFAULT_PROBLEM_VALUES,
    resolver: zodResolver(zodProblemSchema),
  });
  const {
    fields: examplesField,
    append: appendExample,
    remove: removeExample,
    replace: replaceExample,
  } = useFieldArray({
    control,
    name: "examples",
  });
  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
    replace: replaceTestCases,
  } = useFieldArray({
    control,
    name: "testcases",
  });

  useEffect(() => {
    const data = getFromLocalStorage(DRAFT_PROBLEM_KEY);
    reset(data);
  });
  const handleSaveDraft = () => {
    const data = getValues();
    setToLocalStorage(DRAFT_PROBLEM_KEY, data);
    return;
  };
  const handleFormReset = () => {
    removeFromLocalStorage(DRAFT_PROBLEM_KEY);
    replaceExample([]);
    replaceTestCases([]);
    reset(DEFAULT_PROBLEM_VALUES);
  };
  const handleSubmitQuestion = (data) => {
    createProblem(data, {
      onSuccess: (res) => {
        if (res?.success) {
          toast.success(res?.message || "problem created successfully");
          navigate(`problems/${res?.data?.id}`);
          queryClient.invalidateQueries(QUERY_KEYS.PROBLEMS);
        } else {
          toast.error(res?.message || "something went wrong");
          return;
        }
      },
      onError: (err) => {
        toast.error(err.responce.data?.error || "something went wrong");
      },
    });
  };
  const loadSampleData = () => {
    const sampleDate = sampleType === "DP" ? sampleDPData : sampleStringProblem;
    replaceTestCases(sampleDate?.testcases.map((test) => test));
    replaceExample(sampleDate?.examples.map((ex) => ex));
    reset(sampleDate);
  };
  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 pb-8 border-b">
            <h2 className="card-title text-2xl md:text-3xl flex items-center gap-3">
              <FileText className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              Create Problem
            </h2>
            <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
              <button
                type="button"
                className="btn btn-secondary gap-2"
                onClick={() => {
                  replaceTestCases(
                    sampleDemoData?.testcases.map((test) => test)
                  );
                  replaceExample(sampleDemoData?.examples.map((ex) => ex));

                  reset(sampleDemoData);
                }}
              >
                <Download className="w-4 h-4" />
                Load Sample Data
              </button>
            </div>
          </div>
          {/* Top Action Buttons */}
          <form onSubmit={handleSubmit(handleSubmitQuestion)}>
            <div className="flex flex-col flex-wrap justify-end sm:flex-row gap-4 mb-6 p-4 rounded-lg">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="btn btn-outline gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={handleFormReset}
                  className="btn btn-outline gap-2"
                >
                  <RefreshCcwDotIcon className="w-4 h-4" />
                  Reset Form
                </button>
                <button
                  disabled={isLoading}
                  type="submit"
                  className={`btn btn-primary gap-2 ${
                    isLoading && "btn-disabled"
                  }`}
                >
                  {isLoading && (
                    <span className="loading loading-spinner loading-xs mr-2"></span>
                  )}
                  <Send className="w-4 h-4" />
                  Submit Question
                </button>
              </div>
            </div>
            <MenuBarTab>
              <MenuBarTabItem title="Basic Info" icon={FileText}>
                <RenderBasicDetails {...{ register, errors }} />
              </MenuBarTabItem>
              <MenuBarTabItem title="Examples" icon={BookOpen}>
                <RenderExamples
                  register={register}
                  errors={errors}
                  exampleFields={examplesField}
                  addExample={appendExample}
                  removeExample={removeExample}
                />
              </MenuBarTabItem>
              <MenuBarTabItem title="Reference Solutions" icon={CheckCircle}>
                <RenderReferenceSolution
                  {...{ control, errors, watch, resetField }}
                />
              </MenuBarTabItem>
              <MenuBarTabItem title="Test Cases" icon={TestTube}>
                <RenderTestcases
                  register={register}
                  testcaseFields={testCaseFields}
                  addTestcase={appendTestCase}
                  removeTestcase={removeTestCase}
                  errors={errors}
                />
              </MenuBarTabItem>
              <MenuBarTabItem title="Metadata" icon={Settings}>
                <RenderMetadata {...{ register, errors, setValue, watch }} />
              </MenuBarTabItem>
            </MenuBarTab>
          </form>
        </div>
      </div>
    </div>
  );
};
export default CreateProblem;
