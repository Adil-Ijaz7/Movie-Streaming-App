import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import Profiles from "./pages/Profiles";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Series from "./pages/Series";
import Detail from "./pages/Detail";
import Search from "./pages/Search";
import Watchlist from "./pages/Watchlist";
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route
              path="/profiles"
              element={
                <RequireAuth requireProfile={false}>
                  <Profiles />
                </RequireAuth>
              }
            />
            <Route
              path="/home"
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />
            <Route
              path="/movies"
              element={
                <RequireAuth>
                  <Movies />
                </RequireAuth>
              }
            />
            <Route
              path="/series"
              element={
                <RequireAuth>
                  <Series />
                </RequireAuth>
              }
            />
            <Route
              path="/originals"
              element={
                <RequireAuth>
                  <Series originalsOnly />
                </RequireAuth>
              }
            />
            <Route
              path="/watchlist"
              element={
                <RequireAuth>
                  <Watchlist />
                </RequireAuth>
              }
            />
            <Route
              path="/search"
              element={
                <RequireAuth>
                  <Search />
                </RequireAuth>
              }
            />
            <Route
              path="/movie/:id"
              element={
                <RequireAuth>
                  <Detail type="movie" />
                </RequireAuth>
              }
            />
            <Route
              path="/tv/:id"
              element={
                <RequireAuth>
                  <Detail type="tv" />
                </RequireAuth>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
