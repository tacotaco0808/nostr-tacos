import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import { ViewPosts } from "../pages/ViewPosts/ViewPosts";

export const Router = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/view"} element={<ViewPosts />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
