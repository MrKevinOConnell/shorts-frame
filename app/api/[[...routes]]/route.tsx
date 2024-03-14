/** @jsxImportSource frog/jsx */
import { Button, Frog, TextInput } from "frog";
import { handle } from "frog/next";
import { neynar } from "frog/hubs";
import axios from "axios";

const app = new Frog({
  basePath: "/api",
  //comment out below for local
  hub: neynar({ apiKey: process.env.NEYNAR_API_KEY as string }),
  initialState: {
    prompt: "",
  },
});

app.frame("/frame", async (c) => {
  const { buttonValue, status, inputText, frameData, deriveState } = c;
  const state = deriveState((previousState) => {
    if (buttonValue === "generate") {
      return { ...previousState, prompt: inputText };
    }
  });
  const { fid } = frameData || {};

  const isFinished = false;
  //Check process of TX
  let text = state.prompt;
  if (!fid && state.prompt) {
    text = "There was an error generating your video, please try again!";
  } else if (fid && state.prompt) {
    const users = await axios.get(
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
      {
        headers: {
          accept: "application/json",
          api_key: process.env.NEYNAR_API_KEY,
        },
      }
    );

    if (!users.data || !users.data.users || !users.data.users.length) {
      text = "There was an error generating your video, please try again!";
    }

    const addresses = users.data.users[0].verified_addresses;
    let address =
      addresses.eth_addresses && addresses.eth_addresses.length
        ? addresses.eth_addresses[0]
        : users.data.users[0].custody_address;

    // const res = await axios.post(
    //   "https://79828676f8aea1eb.agent.propel.autonolas.tech/generate_farcaster",
    //   {
    //     ...c,
    //     address,
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
    //     },
    //   }
    // );
  }

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
        {text ? text : "Enter a prompt to generate a video!"}
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
