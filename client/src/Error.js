import React from "react";
import { useNavigate } from "react-router-dom";

const Error = ({ error, setError }) => {

  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("")
    navigate("/")
  }

  return (
    <>
      <h1>Error</h1>
      <p>The following error has occured: {error}.</p>
      <p>
        Go to dashboard and try again.
      </p>
      <form onSubmit={(e) => handleSubmit(e)}>
        <button type="submit">Go to Dashboard</button>
      </form>
    </>
  );
};

export default Error;
