import { isDomUsable } from "../is/is-dom-usable";

type Type = "script" | "link";

type ScriptLoading = {
  defer?: boolean;
};

const loadScript = (url: string, { defer = false }: ScriptLoading = {}) => {
  const { promise, reject, resolve } = Promise.withResolvers<void>();
  const script = document.createElement("script");

  script.src = url;
  script.async = true;
  script.crossOrigin = "anonymous";
  script.defer = defer;

  script.addEventListener("load", () => {
    resolve();
  });

  script.addEventListener("error", () => {
    reject();
  });

  document.head.appendChild(script);
  return promise;
};

const loadLink = (url: string) => {
  const { promise, reject, resolve } = Promise.withResolvers<void>();
  const link = document.createElement("link");

  link.href = url;

  link.addEventListener("load", () => {
    resolve();
  });

  link.addEventListener("error", () => {
    reject();
  });

  document.head.appendChild(link);
  return promise;
};

/**
 * @description
 * load remote resource
 */
function load(type: "script", url: string, loading?: ScriptLoading): Promise<void>;
function load(type: "link", url: string): Promise<void>;
function load(type: Type, url: string, loading?: ScriptLoading) {
  if (!isDomUsable()) return null;

  switch (type) {
    case "script":
      return loadScript(url, loading);
    case "link":
      return loadLink(url);
    default:
      return Promise.resolve();
  }
}

export { load };
