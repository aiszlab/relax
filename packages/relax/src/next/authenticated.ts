import { createElement } from "react";
import { TOKEN_KEY } from "./constants";
import { tryAuthenticate } from "./authentication";

/**
 * 认证注入组件
 */
const Authenticated = async () => {
  const authenticated = await tryAuthenticate().catch(() => null);

  if (!authenticated) {
    return null;
  }

  return createElement("script", {
    dangerouslySetInnerHTML: {
      __html: `sessionStorage.setItem('${TOKEN_KEY}', '${authenticated}')`,
    },
  });
};

export default Authenticated;
