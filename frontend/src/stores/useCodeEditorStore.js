import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// "id:PYTHON": "print('hello')"
const useCodeEditorStore = create(
  persist(
    (set) => ({
      codeMap: {},
      lastEditedLanguage: 'JAVASCRIPT',
      setCodeMap: (problemId, language, code) =>
        set((state) => ({
          codeMap: {
            ...state.codeMap,
            [`${problemId}:${language}`]: code,
          },
        })),
      setLastEditedLanguage: (language) => set({ lastEditedLanguage: language }),
    }),
    {
      name: 'code-editor',
    }
  )
);

export default useCodeEditorStore;
