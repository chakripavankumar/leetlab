import { Card } from '../common';
import { Plus, Trash2 } from 'lucide-react';
import TabNavigationButtons from '../common/TabNavigationButtons';

const RenderExamples = ({ exampleFields, register, errors, addExample, removeExample }) => {
  return (
    <div className="space-y-4">
      <Card
        title={
          <div className="flex items-center w-full justify-between">
            <span>Examples</span>
            <button
              type="button"
              onClick={() => addExample({ input: '', output: '', explanation: '' })}
              className="btn btn-sm btn-primary"
            >
              <Plus className="w-4 h-4" />
              Add Example
            </button>
          </div>
        }
        subTitle="Provide clear examples with input, output, and explanations"
      >
        <div className="space-y-4 grid grid-cols-2 gap-3">
          {exampleFields?.map((field, index) => (
            <div
              key={field.id}
              className="h-full card border-dashed border-1 border-base-300 bg-base-50"
            >
              <div className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Example {index + 1}</h3>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm text-error"
                    onClick={() => removeExample(index)}
                    disabled={exampleFields.length === 1}
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
              <div className="card-body p-4 pt-0">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm">Input</span>
                  </label>
                  <textarea
                    {...register(`examples.${index}.input`)}
                    placeholder="Enter testcase input"
                    className="textarea textarea-bordered w-full"
                  />
                  {errors.examples?.[index]?.input && (
                    <span className="label-text-alt text-error text-sm">
                      {errors.examples?.[index]?.input.message}
                    </span>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm">Expected Output</span>
                  </label>
                  <textarea
                    {...register(`examples.${index}.output`)}
                    placeholder="Enter testcase output"
                    className="textarea textarea-bordered w-full"
                  />
                  {errors.examples?.[index]?.output && (
                    <span className="label-text-alt text-error text-sm">
                      {errors.examples?.[index]?.output.message}
                    </span>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm">Explanation</span>
                  </label>
                  <textarea
                    {...register(`examples.${index}.explanation`)}
                    placeholder="Enter testcase output"
                    className="textarea textarea-bordered w-full"
                  />
                  {errors.examples?.[index]?.explanation && (
                    <span className="label-text-alt text-error text-sm">
                      {errors.examples?.[index]?.explanation.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <TabNavigationButtons />
    </div>
  );
};

export default RenderExamples;
