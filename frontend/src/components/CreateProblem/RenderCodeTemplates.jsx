import { useEffect, useState } from 'react';
import { Card } from '../common';
import { SUPPORTED_LANGUAGES } from '../../constants/problemDetails';
import CodeEditor from '../common/CodeEditor';
import { Code2, Trash2 } from 'lucide-react';
import TabNavigationButtons from '../common/TabNavigationButtons';
import { Controller } from 'react-hook-form';

const RenderCodeTemplates = ({ control, errors, watch, resetField }) => {
  const [activeTab, setActiveTab] = useState('manage');
  const [addedLanguages, setAddedLanguages] = useState([]);

  const referenceSolutions = watch('codeSnippets');

  useEffect(() => {
    if (referenceSolutions) {
      const langs = Object.keys(referenceSolutions);
      const matchedLangs = SUPPORTED_LANGUAGES.filter((lang) => langs.includes(lang.value));
      setAddedLanguages(matchedLangs);
    }
  }, [referenceSolutions]);

  const toggleSelectedLanguage = (lang) => {
    const isAlreadyAdded = addedLanguages.includes(lang);

    if (isAlreadyAdded) {
      setAddedLanguages((prev) => prev.filter((l) => l !== lang));
      // 🧼 Clear the corresponding field from the form
      resetField(`codeSnippets.${lang.value}`);
    } else {
      setAddedLanguages((prev) => [...prev, lang]);
    }
  };
  return (
    <div className="space-y-4">
      <Card title="Code Templates" subTitle="Code templates for the problem">
        <div className="flex items-center flex-wrap gap-2">
          <button type="button" onClick={() => setActiveTab('add')} className="btn flex-1">
            Add Template
          </button>
          <button type="button" onClick={() => setActiveTab('manage')} className="btn flex-1">
            Manage Template{' '}
            <div className="badge badge-sm badge-secondary">{addedLanguages.length}</div>
          </button>
        </div>

        <div className="w-full">
          <div
            className={`tab-content bg-base-100  p-6 transition-opacity duration-300 ease-in-out ${
              activeTab === 'add' ? 'block' : 'hidden'
            }`}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  type="button"
                  onClick={() => toggleSelectedLanguage(lang)}
                  className={`btn btn-neutral ${addedLanguages.includes(lang) && 'disabled'}`}
                  disabled={addedLanguages.includes(lang)}
                  key={lang.id}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`tab-content bg-base-100  p-6 transition-opacity duration-300 ease-in-out ${
              activeTab === 'manage' ? 'block' : 'hidden'
            }`}
          >
            {addedLanguages.length === 0 && (
              <div className="text-sm opacity-70 text-center">
                No templates added, Kindly click on the language you want to add
              </div>
            )}

            {addedLanguages.map((lang) => (
              <div
                key={lang?.id}
                className="space-y-2 card border-dashed border-1 border-base-300 bg-base-50 p-3 my-2"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold flex items-center gap-2">
                    <Code2 className="w-4 h-4" /> {lang?.name}
                  </p>

                  <button
                    type="button"
                    onClick={() => toggleSelectedLanguage(lang)}
                    className="btn btn-ghost btn-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="h-96">
                  <Controller
                    name={`codeSnippets.${lang?.value}`}
                    control={control}
                    render={({ field }) => (
                      <CodeEditor
                        key={`codeSnippets.${lang?.value}`}
                        language={lang?.value}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                {errors.codeSnippets && (
                  <span className="label-text-alt text-error text-sm">
                    {errors.codeSnippets?.message}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>
      <TabNavigationButtons />
    </div>
  );
};

export default RenderCodeTemplates;
