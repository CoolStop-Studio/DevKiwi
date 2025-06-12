// editor.ts
declare const monaco: typeof import('monaco-editor');

declare const require: any;

require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@latest/min/vs' } });

require(['vs/editor/editor.main'], function () {
  monaco.editor.create(document.getElementById('editor')!, {
    value: "// Start coding...",
    language: "javascript",
    theme: "vs-dark",
  });
});
