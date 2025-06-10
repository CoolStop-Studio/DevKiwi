import { WebContainer } from "@webcontainer/api";

const reportOutput = (output: string) => {
    console.log(output)
}

window.addEventListener("load", async () => {
    reportOutput("BOOTING")
    const wc = await WebContainer.boot();
    reportOutput("BOOTED")
});