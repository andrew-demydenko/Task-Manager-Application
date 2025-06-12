import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import tasksReducer from "./slices/tasksSlice";
import projectsReducer from "./slices/projectsSlice";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    projects: projectsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
