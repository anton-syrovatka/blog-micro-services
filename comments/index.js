const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { randomBytes } = require("crypto");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  const comments = commentsByPostId[req.params.id] || [];

  res.send(comments);
});

app.post("/posts/:id/comments", async (req, res) => {
  const postId = req.params.id;
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const comments = commentsByPostId[postId] || [];

  const comment = {
    id: commentId,
    postId,
    content,
    status: "pending",
  };
  comments.push(comment);
  commentsByPostId[postId] = comments;

  await axios.post("http://event-bus-srv:4005/events", {
    type: "CommentCreated",
    data: comment,
  });

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  console.log("Event Received", req.body.type);

  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { postId, id, status } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((c) => c.id === id);

    if (comment) {
      comment.status = status;

      try {
        await axios.post("http://event-bus-srv:4005/events", {
          type: "CommentUpdated",
          data: comment,
        });
      } catch (err) {
        console.log(err.message);
      }
    }
  }

  res.send({});
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});
