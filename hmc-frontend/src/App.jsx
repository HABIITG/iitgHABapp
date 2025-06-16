import React, { useState} from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import Hostels from "./components/Hostels";
import Mess from "./components/Mess";
import StatisticsComplaints from "./components/StatisticsComplaints";
import Layout from "./components/Layout";

export default function App() {
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: 
      <Layout >
       <Home/>
      </Layout>,
    },
    {
      path: "/hostels",
      element:
      <Layout>
       <Hostels/>
      </Layout>,
    },
    {
      path: "/mess",
      element:
      <Layout>
       <Mess/>
      </Layout>,
    },
    {
      path: "/statisticscomplaints",
      element:
      <Layout>
       <StatisticsComplaints/>
      </Layout>,
    },
  ]);
  return (
      <div>
        <RouterProvider router={router}/>
      </div>
  );
}
export default App;
