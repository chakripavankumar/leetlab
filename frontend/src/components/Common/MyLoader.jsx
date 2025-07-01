import { Code2 } from "lucide-react";

const MyLoader = () => {
  return (
    <div className="min-h-screen bg-base-200 flex justify-center items-center">
      <div className="text-center">
        {/* App Icon */}
        <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
          <Code2 className="w-8 h-8 text-primary animate-pulse" />
        </div>
      </div>
      {/* DaisyUI Spinner */}
      <span className="loading  loading-dots loading-md text-primary"></span>
    </div>
  );
};

export default MyLoader;
