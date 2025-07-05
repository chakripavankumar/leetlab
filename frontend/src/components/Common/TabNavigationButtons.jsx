import { useContext } from 'react';
import TabContext from '../../context/useTabContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TabNavigationButtons = () => {
  const { activeTabIdx, nextTab, previousTab, totalTabs } = useContext(TabContext);

  return (
    <div className="flex justify-between items-center mt-6 pt-4 border-t border-base-300">
      <button
        type="button"
        onClick={previousTab}
        disabled={activeTabIdx === 0}
        className={`btn btn-outline ${activeTabIdx === 0 ? 'btn-disabled' : ''}`}
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <span className="text-sm text-base-content/70">
        {activeTabIdx + 1} of {totalTabs}
      </span>

      <button
        type="button"
        onClick={nextTab}
        disabled={activeTabIdx === totalTabs - 1}
        className={`btn btn-primary ${activeTabIdx === totalTabs - 1 ? 'btn-disabled' : ''}`}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TabNavigationButtons;
