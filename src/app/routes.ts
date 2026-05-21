import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Events } from "./pages/Events";
import { EventDetail } from "./pages/EventDetail";
import { AiChat } from "./pages/AiChat";
import { Quiz } from "./pages/Quiz";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "su-kien", Component: Events },
      { path: "su-kien/:id", Component: EventDetail },
      { path: "hoi-dap-ai", Component: AiChat },
      { path: "kiem-tra", Component: Quiz },
    ],
  },
]);
