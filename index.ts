import { WebContainer } from "@webcontainer/api";

const outputPanel = document.getElementById("output-panel")!
const form = document.getElementById("form")!
const command = <HTMLInputElement>document.getElementById("command")!

const reportOutput = (output: string) => {
    outputPanel.textContent += '\n' + output
}

window.addEventListener("load", async () => {
    reportOutput("BOOTING")
    const wc = await WebContainer.boot();
    reportOutput("BOOTED")

    const runCommand = async(cmd: string, args: string[]) => {
        const process = await wc.spawn(cmd, args)

        process.output.pipeTo(new WritableStream({
            write: (chunk) => {
                reportOutput(`Process output: ${chunk}`);
            }
        }));

        if (await process.exit) {
            reportOutput(`Process exited with code ${process.exit}`);
        }
    }

    await runCommand('echo', ['Hello boi!!!!!!!!']) 

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const cmd = command.value.split(' ')[0];
        const args = command.value.split(' ').slice(1);
        await runCommand(cmd, args);
    });

    wc.on('server-ready', (port, host) => {
        reportOutput(`Server ready on ${host}:${port}`);
    })
});