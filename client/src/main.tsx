import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { waitForApp } from "./utils/comfyapp.ts";

// eslint-disable-next-line react-refresh/only-export-components
const App = React.lazy(() =>
  import("./App.tsx").then(({ default: App }) => ({
    default: App,
  })),
);

// hacky fix for chakra add extra className (chakra-ui-light) into body
// and resulted in user unable to copy new nodes into clipboard, because of this check: e.target.className === "litegraph"
// (https://github.com/comfyanonymous/ComfyUI/blob/57926635e8d84ae9eea4a0416cc75e363f5ede45/web/scripts/app.js#L861)
// source: https://github.com/11cafe/comfyui-workspace-manager
const targetNode = document.body;
const observerConfig = { attributes: true, attributeFilter: ["class"] };
// Callback function to execute when mutations are observed
const callback = function (mutationsList: MutationRecord[]) {
  // remove color-scheme property from <html> element, this made the checkboxes dark
  const htmlElement = document.documentElement;
  if (htmlElement.style.colorScheme === "dark") {
    // Remove the color-scheme property
    htmlElement.style.removeProperty("color-scheme");
  }

  // remove chakra from <body> class list, this broke the copy node feature
  for (const mutation of mutationsList) {
    if (mutation.type === "attributes" && mutation.attributeName === "class") {
      // remove all chakra classes from body element
      for (const className of targetNode.classList) {
        if (className.includes("chakra")) {
          targetNode.classList.remove(className);
        }
      }
    }
  }
};
const observer = new MutationObserver(callback);
observer.observe(targetNode, observerConfig);

function waitForDocumentBody() {
  return new Promise((resolve) => {
    if (document.body) {
      return resolve(document.body);
    }

    document.addEventListener("DOMContentLoaded", () => {
      resolve(document.body);
    });
  });
}

waitForDocumentBody()
  .then(() => waitForApp())
  .then(() => {
    const cbMountPoint = document.createElement("div");
    document.body.append(cbMountPoint);
    ReactDOM.createRoot(cbMountPoint).render(
      <React.StrictMode>
        <ChakraProvider resetCSS={false} disableGlobalStyle={true}>
          <ColorModeScript initialColorMode="dark" />
          <Suspense>
            <App />
          </Suspense>
        </ChakraProvider>
      </React.StrictMode>,
    );
  });
