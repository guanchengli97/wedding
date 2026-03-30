import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { OurStory } from "./components/OurStory";
import { WeddingDetails } from "./components/WeddingDetails";
import { RSVP } from "./components/RSVP";
import { Gallery } from "./components/Gallery";
import { RSVPAdmin } from "./components/RSVPAdmin";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "our-story", Component: OurStory },
      { path: "details", Component: WeddingDetails },
      { path: "rsvp", Component: RSVP },
      { path: "rsvp-admin", Component: RSVPAdmin },
      { path: "gallery", Component: Gallery },
    ],
  },
]);
