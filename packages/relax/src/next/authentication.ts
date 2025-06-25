import { isDomUsable } from "../is/is-dom-usable";

class Authentication {
  /**
   * Get the authentication `token` in current Application.
   */
  token() {
    // in server side, use `next/cookies` to get the token
    if (!isDomUsable()) {
    }
  }
}

export { Authentication };
