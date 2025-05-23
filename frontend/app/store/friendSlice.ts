import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
    FriendInviteList,
    FriendsList,
    FriendInvite,
} from '../data_types/data_types'

const initialState: FriendsList = {
    offline: [],
    online: [],
    invites: [],
    refetch: false,
}

const friendSlice = createSlice({
    name: 'friends',
    initialState,
    reducers: {
        setFriends(state, action: PayloadAction<FriendsList>) {
            state.online = action.payload.online
            state.offline = action.payload.offline
        },

        setFriendOnline(state, action: PayloadAction<number>) {
            const friend = state.offline.find((f) => f.id == action.payload)
            if (friend) {
                state.offline = state.offline.filter((f) => f != friend)
                state.online = [friend, ...state.online]
            }
        },

        setFriendOffline(state, action: PayloadAction<number>) {
            const friend = state.online.find((f) => f.id == action.payload)
            if (friend) {
                state.online = state.online.filter((f) => f != friend)
                state.offline = [friend, ...state.offline]
            }
        },

        setFriendInvites(state, action: PayloadAction<FriendInviteList>) {
            state.invites = action.payload
        },

        addFriendInvite(state, action: PayloadAction<FriendInvite>) {
            state.invites.push(action.payload)
        },
        removeFriendInvite(state, action: PayloadAction<number>) {
            state.invites = state.invites.filter(
                (f) => f && f.to !== action.payload
            )
        },
        setRefetch(state, action: PayloadAction<boolean>) {
            state.refetch = action.payload
        },
    },
})

export const {
    setFriends,
    setFriendOnline,
    setFriendOffline,
    setFriendInvites,
    addFriendInvite,
    removeFriendInvite,
    setRefetch,
} = friendSlice.actions
export default friendSlice.reducer
