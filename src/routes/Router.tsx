import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import { ViewPosts } from "../pages/ViewPosts/ViewPosts";
import { Register } from "../pages/Register/Register";
import { Login } from "../pages/Login/Login";
import { FollowPage } from "../pages/FolowPage/FollowPage";

export const Router = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/view"} element={<ViewPosts />} />
          <Route path={"/register"} element={<Register />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/follow"} element={<FollowPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
