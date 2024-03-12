/** @jsxImportSource frog/jsx */
import { Button, Frog, TextInput } from "frog";
import { handle } from "frog/next";
import { neynar } from "frog/hubs";
import axios from "axios";

const app = new Frog({
  basePath: "/api",
  //comment out below for local
  // hub: neynar({ apiKey: process.env.NEYNAR_API_KEY as string }),
});

app.frame("/", async (c) => {
  const { buttonValue, status, inputText } = c;
  console.log(c);
  //Check process of TX
  const isFinished = false;
  const res = await axios.post(
    "https://79828676f8aea1eb.agent.propel.autonolas.tech/generate_farcaster",
    {
      ...c,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
      },
    }
  );

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
      isFinished ? (
        <Button.Link href="https://shorts.wtf">Check out shorts!</Button.Link>
      ) : (
        <Button value="refresh">Refresh</Button>
      ),
      <TextInput placeholder="Enter your prompt here" />,
      <Button.Link href="https://shorts.wtf">Check out shorts!</Button.Link>,
    ],
  });
});

export const GET = handle(app);
export const POST = handle(app);
