import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import taskReducer from './slices/taskSlice'
import projectReducer from './slices/projectSlice'
import dashboardReducer from './slices/dashboardSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        tasks: taskReducer,
        projects: projectReducer,
        dashboard: dashboardReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Allow non-serializable values in actions
                ignoredActions: ['persist/PERSIST'],
            },
        }),
})

export default store