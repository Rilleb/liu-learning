import { configureStore } from '@reduxjs/toolkit'
import friendReducer from '@/app/store/friendSlice'

export const store = configureStore({
    reducer: {
        friends: friendReducer,
    },
})

// Types for use in hooks
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
