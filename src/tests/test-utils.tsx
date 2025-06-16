import React from "react";
import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "../store/slices/projectsSlice";
import tasksReducer from "../store/slices/tasksSlice";

export function createTestStore() {
  return configureStore({
    reducer: {
      projects: projectsReducer,
      tasks: tasksReducer,
    },
  });
}

const customRender = (
  ui: ReactElement,
  { store = createTestStore(), ...renderOptions } = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from "@testing-library/react";
export { customRender as render };
