import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Error from "./Error";

export const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const res = await axios.post("/login", {
        username: username,
        password: password,
      });
      if (res.data.msg) {
        setMessage(res.data.msg);
        setIsLoading(false);
        return;
      }
      const resUser = await axios.get("/dashboard");
      setUser(resUser.data);
      setIsLoading(false);
      setUsername("");
      setPassword("");
      navigate("/");
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  return (
    <>
      {error ? (
        <Error error={error} setError={setError} />
      ) : (
        <>
          {isLoading ? (
            <h1>Loading</h1>
          ) : (
            <>
              <h1>Login</h1>
              <form onSubmit={(e) => handleSubmit(e)}>
                <label htmlFor="username">Username</label>
                <input
                  value={username}
                  type="text"
                  id="username"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                ></input>
                <label htmlFor="password">Password</label>
                <input
                  value={password}
                  type="password"
                  id="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                ></input>
                {message && <h3>{message}</h3>}
                <button type="submit">Login</button>
              </form>
              <a href="/register">Register</a>
            </>
          )}
        </>
      )}
    </>
  );
};
