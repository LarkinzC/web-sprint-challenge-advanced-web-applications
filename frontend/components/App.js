import React, { useState } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import axios from "axios";
import PrivateRoute from "./PrivateRoute";

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setMessage("Goodbye!");
    navigate("/");
  };

  const login = ({ username, password }) => {
    setSpinnerOn(true);
    axios
      .post("http://localhost:9000/api/login", { username, password })

      .then((res) => {
        setMessage(res.data.message);
        
        console.log("Token Set --> ", res.data.token);
        localStorage.setItem("token", res.data.token);
        navigate("/articles");
        setSpinnerOn(false);
      })

      .catch((err) => {
        console.log(err);
      });
  };

  const getArticles = () => {
    setMessage("");
    setSpinnerOn(true);
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:9000/api/articles", {
        headers: { authorization: token },
      })
      .then((res) => {
        setMessage(res.data.message);
        setArticles(res.data.articles);
      })

      .catch((err) => {
        console.log("ERROR", err);
      })

      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const postArticle = (article) => {
    // ✨ implement
    const token = localStorage.getItem("token");
    axios
      .post("http://localhost:9000/api/articles", article, {
        headers: { authorization: token },
      })
      .then((res) => {
        setMessage(res.data.message);
        axios
          .get("http://localhost:9000/api/articles", {
            headers: { authorization: token },
          })
          .then((res) => {
            setArticles(res.data.articles);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  };

  const updateArticle = ({ currentArticleId, values }) => {
    const token = localStorage.getItem("token")
    console.log(currentArticleId, values)
    axios.put(`http://localhost:9000/api/articles/${currentArticleId}`, values, {headers:{ authorization: token}} )
    .then(res=> {
      console.log(res)
      setMessage(res.data.message)
      setArticles(articles.map(article => {
        if (article.article_id === res.data.article.article_id) {
          return res.data.article;
        } else {
          return article;
        }
      }));
      console.log('update', articles)
    })
    .catch(err => console.log(err))
  };

  const deleteArticle = (article_id) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:9000/api/articles/${article_id}`, {
        headers: { authorization: token },
      })
      .then((res) => {
        setMessage(res.data.message);
        setArticles(articles.filter((art) => art.article_id !== article_id))
      })
      .catch((err) => {
        console.log(err);
      });

    
  };

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {" "}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            element={
              <>
                <ArticleForm
                  postArticle={postArticle}
                  updateArticle={updateArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  currentArticleId={currentArticleId}
                  articles={articles}
                />
                <Articles
                  articles={articles}
                  getArticles={getArticles}
                  deleteArticle={deleteArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  currentArticleId={currentArticleId}
                />
              </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
}
