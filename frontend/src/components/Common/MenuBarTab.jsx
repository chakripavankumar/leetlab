import { Children, useId, isValidElement, useState } from 'react';
import TabContext from '../../context/useTabContext';

export const MenuBarTabItem = ({ children }) => {
  return children;
};

const MenuBarTab = ({ children }) => {
  const uid = useId();
  const [activeIdx, setActiveIdx] = useState(0);

  const validChildren = Children.toArray(children).filter(isValidElement);

  const nextTab = () => {
    if (activeIdx < validChildren.length - 1) {
      setActiveIdx((idx) => idx + 1);
    }
  };

  const previousTab = () => {
    if (activeIdx > 0) {
      setActiveIdx((idx) => idx - 1);
    }
  };

  return (
    <TabContext.Provider
      value={{ activeTabIdx: activeIdx, nextTab, previousTab, totalTabs: validChildren.length }}
    >
      <div className="tabs tabs-lift justify-center">
        {validChildren.map((child, idx) => (
          <label key={idx} className="tab cursor-pointer" onClick={() => setActiveIdx(idx)}>
            <input
              type="radio"
              name={uid}
              checked={activeIdx === idx}
              onChange={() => {}}
              hidden={true}
              className="hidden"
            />
            {child.props.icon && <child.props.icon className="w-4 h-4 mr-2" />}
            {child.props.title}
          </label>
        ))}
      </div>

      {/* Render all tab contents, show only the active one */}
      <div className="relative w-full">
        {validChildren.map((child, idx) => (
          <div
            key={idx}
            className={`tab-content bg-base-100  p-6 transition-opacity duration-300 ease-in-out ${
              activeIdx === idx ? 'block' : 'hidden'
            }`}
          >
            {child.props.children}
          </div>
        ))}
      </div>
    </TabContext.Provider>
  );
};

export default MenuBarTab;
