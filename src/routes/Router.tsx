import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import { ViewPosts } from "../pages/ViewPosts/ViewPosts";
import { Register } from "../pages/Register/Register";
import { Login } from "../pages/Login/Login";

export const Router = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/view"} element={<ViewPosts />} />
          <Route path={"/register"} element={<Register />} />
          <Route path={"/login"} element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
