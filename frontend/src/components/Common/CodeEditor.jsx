import Editor from '@monaco-editor/react';
import { LucideLoader } from 'lucide-react';

const CodeEditor = ({ language, value, onChange, readOnly = false, ...props }) => {
  const handleEditorDidMount = (editor, monaco) => {
    // Add custom keybindings
    // editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
    //   console.log('Save triggered');
    // });

    // Add custom actions
    editor.addAction({
      id: 'format-document',
      label: 'Format Document',
      keybindings: [monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF],
      run: () => {
        editor.getAction('editor.action.formatDocument').run();
      },
    });

    // Define custom theme with different line number colors
    monaco.editor.defineTheme('customDark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editorLineNumber.foreground': '#9DCA9D', // Bright green line numbers
        'editorLineNumber.activeForeground': '#E87952', // Orange for active line number
        'editor.lineHighlightBackground': '#2d2d2d', // Subtle line highlight
      },
    });

    // Apply the custom theme
    monaco.editor.setTheme('customDark');

    // Focus editor
    editor.focus();
  };

  return (
    <Editor
      height="100%"
      language={language.toLowerCase()}
      value={value}
      onChange={onChange}
      theme="night-owl"
      loading={<LucideLoader className="animate-spin" />}
      onMount={handleEditorDidMount}
      {...props}
      options={{
        // Basic settings
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily:
          "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', Consolas, monospace",
        fontLigatures: true, // Enable font ligatures for supported fonts
        lineNumbers: 'on',
        lineNumbersMinChars: 3,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        readOnly,

        // Visual enhancements
        roundedSelection: true,
        cursorSmoothCaretAnimation: 'on',
        cursorBlinking: 'phase',
        cursorWidth: 2,
        renderLineHighlight: 'all',
        renderWhitespace: 'selection', // Show whitespace only when text is selected
        renderControlCharacters: true,
        smoothScrolling: true,

        // Word wrapping
        wordWrap: 'on',
        wrappingIndent: 'indent',
        wrappingStrategy: 'advanced',

        // Indentation and formatting
        tabSize: 2,
        insertSpaces: true,
        detectIndentation: true,
        formatOnType: true,
        formatOnPaste: true,

        // Bracket and quote handling - UPDATED: Only vertical lines
        autoClosingBrackets: 'always',
        autoClosingQuotes: 'always',
        autoClosingDelete: 'always',
        autoSurround: 'languageDefined',
        bracketPairColorization: { enabled: true },
        guides: {
          bracketPairs: true,
          bracketPairsHorizontal: false, // CHANGED: Disable horizontal bracket guides
          highlightActiveBracketPair: true,
          indentation: true,
        },

        // Scrollbar customization
        scrollbar: {
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
          arrowSize: 11,
          useShadows: true,
          verticalHasArrows: false,
          horizontalHasArrows: false,
          vertical: 'visible',
          horizontal: 'visible',
        },

        // IntelliSense and suggestions
        quickSuggestions: {
          other: true,
          comments: false,
          strings: false,
        },
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: 'on',
        acceptSuggestionOnCommitCharacter: true,
        suggestSelection: 'first',
        wordBasedSuggestions: 'matchingDocuments',
        parameterHints: { enabled: true },

        // Find and replace
        find: {
          addExtraSpaceOnTop: false,
          autoFindInSelection: 'never',
          seedSearchStringFromSelection: 'selection',
        },

        // Context menu and interactions
        contextmenu: true,
        mouseWheelZoom: true,
        multiCursorModifier: 'ctrlCmd',
        multiCursorMergeOverlapping: true,

        // Selection and editing
        selectOnLineNumbers: true,
        selectionHighlight: true,
        occurrencesHighlight: 'singleFile',
        wordHighlightDelay: 300,

        // Hover and links
        hover: {
          enabled: true,
          delay: 300,
          sticky: true,
        },
        links: true,

        // Folding
        folding: true,
        foldingStrategy: 'indentation',
        foldingHighlight: true,
        unfoldOnClickAfterEndOfLine: false,

        // Diff editor specific (useful if you switch to diff mode)
        ignoreTrimWhitespace: true,
        renderSideBySide: true,

        // Performance
        largeFileOptimizations: true,

        // Accessibility
        accessibilitySupport: 'auto',
        accessibilityPageSize: 10,

        // Sticky scroll (shows current scope at top)
        stickyScroll: {
          enabled: true,
          maxLineCount: 5,
        },

        // Semantic highlighting
        'semanticHighlighting.enabled': true,

        // Error and warning decorations
        showFoldingControls: 'mouseover',
        showUnused: true,

        // Editor appearance
        padding: {
          top: 16,
          bottom: 16,
        },

        // Advanced features
        columnSelection: false, // Set to true to enable column selection mode
        dragAndDrop: true,
        copyWithSyntaxHighlighting: true,
        emptySelectionClipboard: true,

        // Code lens (shows references, implementations, etc.)
        codeLens: true,
        codeLensFontFamily: "'JetBrains Mono', monospace",
        codeLensFontSize: 12,

        // Rulers (vertical lines at specific columns)
        rulers: [80, 120], // Add vertical lines at 80 and 120 characters

        // Lightbulb (code actions indicator)
        lightbulb: {
          enabled: 'onCode',
        },

        // Sticky tabs
        stickyTabStops: true,

        // Define custom themes or override existing ones
        automaticColorTheme: false,
      }}
    />
  );
};

export default CodeEditor;
