import express from "express";
import _ from "lodash";

import "./socket";
import { handleSpeech } from "./triggers";

import "./systems";

const app = express();

app.use(express.static("./public"));
app.use(express.json());


const debouncedDetectSpeech = _.debounce((text: string) => {
  handleSpeech(text);
}, 1000);

app.post("/api/speech-detected", (req, res) => {
  const { text } = req.body;
  debouncedDetectSpeech(text);
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
