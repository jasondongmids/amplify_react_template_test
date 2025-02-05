import React from "react";
import ReactDOM from "react-dom/client";
import { Authenticator } from "@aws-amplify/ui-react";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css"
import { PythonProvider} from "react-py"

Amplify.configure(outputs);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/react-py-sw.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.log('Service Worker registration failed:', error);
    });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Authenticator>
      <PythonProvider>
        <App />
      </PythonProvider>
    </Authenticator>
  </React.StrictMode>
);
