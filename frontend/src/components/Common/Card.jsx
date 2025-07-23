import React from 'react';

const Card = ({ title, subTitle = '', children }) => {
  return (
    <div className="space-y-6">
      <div className="card card-xl bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p className="text-sm opacity-70">{subTitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Card;
