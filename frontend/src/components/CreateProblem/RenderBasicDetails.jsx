import { Card } from '../common';
import TabNavigationButtons from '../common/TabNavigationButtons';

const RenderBasicDetails = ({ register, errors }) => {
  return (
    <>
      <Card title="Problem Details" subTitle="Basic information about the problem">
        <div className="form-control w-full space-y-3">
          <div>
            <label htmlFor="title" className="label">
              Problem Title
            </label>
            <input
              type="text"
              placeholder="e.g., Two Sum"
              className="input w-full"
              {...register('title')}
              // value={title}
              // onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && (
              <span className="label-text-alt text-error text-sm">{errors.title?.message}</span>
            )}
          </div>
          <div>
            <label className="label">Difficulty</label>
            <select defaultValue="title" className="select w-full" {...register('difficulty')}>
              <option disabled value="">
                Select Difficulty
              </option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
            {errors.difficulty && (
              <span className="label-text-alt text-error text-sm">{errors.difficulty.message}</span>
            )}
          </div>
          <div>
            <label className="label">Problem Descriptions</label>
            <textarea
              type="text"
              placeholder="Describe the problem in details"
              className="textarea w-full"
              {...register('description')}
              // value={title}
              // onChange={(e) => setTitle(e.target.value)}
            />
            {errors.description && (
              <span className="label-text-alt text-error text-sm">
                {errors.description.message}
              </span>
            )}
          </div>
          <div>
            <label className="label">Constraints</label>
            <textarea
              type="text"
              placeholder="e.g., 0 <= nums[i] <= 1000"
              className="textarea w-full"
              {...register('constraints')}
              // value={title}
              // onChange={(e) => setTitle(e.target.value)}
            />
            {errors.constraints && (
              <span className="label-text-alt text-error text-sm">
                {errors.constraints.message}
              </span>
            )}
          </div>
        </div>
      </Card>
      <TabNavigationButtons />
    </>
  );
};

export default RenderBasicDetails;
