import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Error from "./Error";

export const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (passwordAgain !== password) {
        setMessage("The two passwords need to be the same!");
        setIsLoading(false);
        return;
      }
      const res = await axios.post("/register", {
        username: username,
        password: password,
        passwordAgain: passwordAgain,
      });
      if (res.data.msg) {
        setMessage(res.data.msg);
        setIsLoading(false);
        return;
      }
      setUsername("");
      setPassword("");
      setPasswordAgain("");
      setIsLoading(false);
      alert("Register successful! Please log in to your account.");
      navigate("/login");
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
              <h1>Register</h1>
              <form onSubmit={(e) => handleSubmit(e)}>
                <label htmlFor="username">Username</label>
                <input
                  value={username}
                  type="text"
                  id="username"
                  onChange={(e) => setUsername(e.target.value)}
                ></input>
                <label htmlFor="password">Password</label>
                <input
                  value={password}
                  type="password"
                  id="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                ></input>
                <label htmlFor="passwordAgain">Password Again</label>
                <input
                  value={passwordAgain}
                  type="password"
                  id="passwordAgain"
                  onChange={(e) => {
                    setPasswordAgain(e.target.value);
                  }}
                ></input>
                {message && <h3>{message}</h3>}
                <button type="submit">Register</button>
              </form>
              <a href="/login">Login</a>
            </>
          )}
        </>
      )}
    </>
  );
};
