import { forwardRef } from 'react';

const Input = forwardRef(
  ({ label, icon: Icon, placeHolder, type = 'text', classNames = '', errorMsg, ...props }, ref) => (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">{label}</span>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 bg-transparent">
          <Icon className="h-5 w-5 text-base-content" />
        </div>

        <input
          ref={ref}
          type={type}
          placeholder={placeHolder}
          className={`input input-bordered w-full pl-10  ${classNames}`}
          {...props}
        />
      </div>
      {errorMsg && (
        <label className="label">
          <span className="label-text-alt text-error">{errorMsg}</span>
        </label>
      )}
    </div>
  )
);

export default Input;
