import { WebContainer } from "@webcontainer/api";
import { Terminal } from "xterm";
import files from './files.json';

const outputPanel = document.getElementById("terminal")!;
const form = document.getElementById("form")!;
const command = <HTMLInputElement>document.getElementById("command")!;

const reportOutput = (output: string, terminal: Terminal) => {
  terminal.write(output + "\r\n");
};

const getTerminal = (terminal_el: HTMLDivElement) => {
  const terminal = new Terminal({
    cols: 80,
    rows: 24,
    convertEol: true,
    scrollback: 1000,
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 14,
    theme: {
      background: "#000000",
      foreground: "#ffffff",
      cursor: "#ffffff",
    },
  });

  terminal.open(terminal_el);
  terminal.write("Welcome to the WebContainer Terminal!\r\n");
  terminal.focus();
  return terminal;
};

window.addEventListener("load", async () => {
  const terminal = getTerminal(
    <HTMLDivElement>document.getElementById("terminal")!
  );

  reportOutput("BOOTING", terminal);
  const wc = await WebContainer.boot();
  await wc.mount(files, { mountPoint: '' });
  reportOutput("BOOTED", terminal);

  const initTerminal = async () => {
    const shell = await wc.spawn("sh");

    shell.output.pipeTo(
      new WritableStream({
        write(chunk) {
          terminal.write(chunk);
        },
      })
    );

    const inputWriter = shell.input.getWriter();
    terminal.onData((data) => {
      inputWriter.write(data);
    });
  };

  await initTerminal();

  wc.on("server-ready", (port, host) => {
    reportOutput(`Server ready on ${host}:${port}`, terminal);
  });
});
