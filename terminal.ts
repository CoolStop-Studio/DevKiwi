import { WebContainer } from "@webcontainer/api";
import { Terminal } from "xterm";

const outputPanel = document.getElementById("terminal")!;
const form = document.getElementById("form")!;
const command = <HTMLInputElement>document.getElementById("command")!;

const reportOutput = (output: string, terminal: Terminal) => {
  terminal.write(output + "\r\n");
};

const getTerminal = (terminal: HTMLDivElement) => {
  const term = new Terminal({
    cols: 80,
    rows: 24,
    convertEol: true,
    scrollback: 1000,
    theme: {
      background: "#000000",
      foreground: "#ffffff",
      cursor: "#ffffff",
    },
  });

  term.open(terminal);
  term.write("Welcome to the WebContainer Terminal!\r\n");
  term.focus();
  return term;
};

window.addEventListener("load", async () => {
  const term = getTerminal(
    <HTMLDivElement>document.getElementById("terminal")!
  );

  reportOutput("BOOTING", term);
  const wc = await WebContainer.boot();
  reportOutput("BOOTED", term);

  const runCommand = async () => {
    const shell = await wc.spawn("sh");

    shell.output.pipeTo(
      new WritableStream({
        write(chunk) {
          term.write(chunk);
        },
      })
    );

    const inputWriter = shell.input.getWriter();
    term.onData((data) => {
      inputWriter.write(data);
    });
  };

  await runCommand();

  wc.on("server-ready", (port, host) => {
    reportOutput(`Server ready on ${host}:${port}`, term);
  });
});
