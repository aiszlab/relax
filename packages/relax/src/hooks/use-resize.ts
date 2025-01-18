import { useEvent } from "./use-event";
import { useMount } from "./use-mount";

/**
 * @description window resize callback hook
 */
const useResize = (callback: Function) => {
  const resize = useEvent(() => {
    callback();
  });

  useMount(() => {
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  });
};

export { useResize };
