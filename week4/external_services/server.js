"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = 8080;
const HOST = "0.0.0.0";
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.post("/generate-text", async (req, res) => {
  try {
    // Change this with user's API_KEY
    const apiKey = "YOUR_API_KEY";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    let question = req.body.text;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `${question}` }],
          },
        ],
      }),
    });

    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error making API request");
  }
});

app.use("/", express.static("pages"));
app.listen(PORT, HOST);

console.log("up and running");
