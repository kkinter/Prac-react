import React, { useEffect, useState } from "react";
import Page from "./Page";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import ReactMarkdown from "react-markdown";
import ReactTooltip from "react-tooltip";
import NotFound from "./NotFound";

function ViewSinglePost() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();

    async function fetchPost() {
      try {
        const response = await axios.get(`/post/${id}`, {
          cancelToken: ourRequest.token,
        });
        console.log(response.data);
        setPost(response.data);
        setIsLoading(false);
      } catch (e) {
        console.log("There was a problem.");
      }
    }
    fetchPost();
    return () => {
      ourRequest.cancel();
    };
  }, []);

  if (!isLoading && !post) {
    return <NotFound />;
  }

  if (isLoading)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );

  const date = new Date(post.createdDate);
  const dateFormatted = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        <span className="pt-2">
          <Link
            to={`/post/${post._id}/edit`}
            data-tip="Edit"
            data-for="edit"
            className="text-primary mr-2"
          >
            <i className="fas fa-edit"></i>
          </Link>
          <ReactTooltip id="edit" className="custom-tooltip" />{" "}
          <a
            data-tip="Delete"
            data-for="delete"
            className="delete-post-button text-danger"
            title="Delete"
          >
            <i className="fas fa-trash"></i>
          </a>
          <ReactTooltip id="delete" className="cutom-tooltip" />
        </span>
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>{" "}
        {dateFormatted}
      </p>

      <div className="body-content">
        <ReactMarkdown
          children={post.body}
          allowedElements={[
            "p",
            "br",
            "strong",
            "em",
            "h1",
            "h2",
            "h2",
            "h3",
            "ul",
            "ol",
            "li",
          ]}
        />
      </div>
    </Page>
  );
}

export default ViewSinglePost;
