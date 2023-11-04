import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider} from "react-router-dom";
import {router} from "./router";
import {CustomQueryClientProvider} from "./CustomQueryClientProvider.tsx";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:80/api"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <CustomQueryClientProvider>
          <RouterProvider router={router} />
      </CustomQueryClientProvider>

  </React.StrictMode>,
)
