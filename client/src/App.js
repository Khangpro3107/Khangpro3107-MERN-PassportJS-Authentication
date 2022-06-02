import { Login } from "./Login";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import { Register } from "./Register";
import { useEffect, useState } from "react";
import axios from "axios";
import Error from "./Error";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("/dashboard");
        setUser(res.data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setError(err.message);
      }
    };
    fetchUser();
  }, [user?.id]);

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
              <Routes>
                <Route
                  path="/"
                  element={
                    user ? (
                      <Dashboard user={user} setUser={setUser} />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
                <Route
                  path="/login"
                  element={
                    !user ? (
                      <Login setUser={setUser} />
                    ) : (
                      <Navigate to="/" replace />
                    )
                  }
                />
                <Route
                  path="/register"
                  element={!user ? <Register /> : <Navigate to="/" replace />}
                />
              </Routes>
            </>
          )}
        </>
      )}
    </>
  );
}

export default App;
