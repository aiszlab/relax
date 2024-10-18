import { isDomUsable, load } from "@aiszlab/relax";

type Tag = "js" | "config";

declare global {
  interface Window {
    dataLayer?: [Tag, ...args: unknown[]][];
  }
}

/**
 * @description
 * bootstrap
 */
export const bootstrap = ({ measurementId }: { measurementId: string }) => {
  if (!isDomUsable()) return;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(["js", new Date()]);
  window.dataLayer.push(["config", measurementId]);

  return load("script", `https://www.googletagmanager.com/gtag/js?id=${measurementId}`);
};
