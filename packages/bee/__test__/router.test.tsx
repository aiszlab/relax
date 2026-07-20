import * as beeRouter from "../src/router";

describe("router", () => {
  it("re-exports RouterProvider from react-router/dom", () => {
    expect(beeRouter.RouterProvider).toBeDefined();
    expect(typeof beeRouter.RouterProvider).toBe("function");
  });

  it("re-exports createBrowserRouter from react-router", () => {
    expect(beeRouter.createBrowserRouter).toBeDefined();
    expect(typeof beeRouter.createBrowserRouter).toBe("function");
  });

  it("re-exports Route from react-router", () => {
    expect(beeRouter.Route).toBeDefined();
    expect(typeof beeRouter.Route).toBe("function");
  });
});
