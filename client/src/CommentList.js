import React from "react";

const getCommentContent = (comment) => {
  if (comment.status === "pending") {
    return "awaits moderation";
  }
  if (comment.status === "approved") {
    return comment.content;
  }
  if (comment.status === "rejected") {
    return "rejected comment";
  }
};

const CommentList = ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    return <li key={comment.id}>{getCommentContent(comment)}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
