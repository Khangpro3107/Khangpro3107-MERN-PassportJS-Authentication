import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Error from "./Error";

const Dashboard = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      await axios.delete("/logout");
      setIsLoading(false);
      setUser(null);
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
          <h1>Dashboard</h1>
          {isLoading ? (
            <h1>Loading</h1>
          ) : (
            <>
              <h2>Hello {user.username}</h2>
              <form onSubmit={(e) => handleSubmit(e)}>
                <button type="submit">Log out</button>
              </form>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Dashboard;
