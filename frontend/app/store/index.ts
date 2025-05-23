import { configureStore } from '@reduxjs/toolkit'
import friendReducer from '@/app/store/friendSlice'
import { useDispatch, useSelector, useStore } from 'react-redux'

export const makeStore = () => {
    return configureStore({
        reducer: {
            friends: friendReducer,
        },
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()
