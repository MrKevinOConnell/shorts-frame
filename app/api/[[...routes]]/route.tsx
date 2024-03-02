/** @jsxImportSource frog/jsx */
import { Button, Frog, TextInput } from "frog";
import { handle } from "frog/next";

const app = new Frog({
  basePath: "/api",
  // Supply a Hub API URL to enable frame verification.
  hubApiUrl: "https://api.hub.wevm.dev",
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame("/", (c) => {
  const { buttonValue, status, inputText } = c;
  //TODO: check if the video is ready, if so link, otherwise refresh
  return c.res({
    image: (
      <div
        style={{
          height: "100vh", // This makes the div take the full height of the viewport
          width: "100vw", // This makes the div take the full width of the viewport
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "60px", // Ensure the unit "px" is included for consistency
          textAlign: "center", // This centers the text if it breaks into multiple lines
        }}
      >
        {inputText ? inputText : "Enter a prompt to generate a video!"}
      </div>
    ),
    intents: [
      <Button value="generate">Generate!</Button>,
      <TextInput placeholder="Enter your prompt here" />,
      <Button.Link href="https://shorts.wtf">Check out shorts!</Button.Link>,
    ],
  });
});

export const GET = handle(app);
export const POST = handle(app);
