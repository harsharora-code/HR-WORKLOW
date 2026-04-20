
import { configureStore } from "@reduxjs/toolkit";
import workflowReducer from "../features/workflow/slice";

export const store = configureStore({
  reducer: {
    workflow: workflowReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;