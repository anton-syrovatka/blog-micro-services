const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { randomBytes } = require("crypto");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

// obsolete
app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  const post = {
    id,
    title,
  };

  posts[id] = post;

  try {
    await axios.post("http://event-bus-srv:4005/events", {
      type: "PostCreated",
      data: post,
    });
  } catch (err) {
    console.log(err.message);
  }

  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("Event Received", req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log("v40");
  console.log("Listening on 4000");
});
