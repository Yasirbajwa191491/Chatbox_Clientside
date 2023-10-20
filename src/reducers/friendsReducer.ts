import { Reducer } from "redux";
import { FriendsActions, actionTypes, PendingInvitation, Friend, OnlineUser, GroupChatDetails,UserGetNotification,OnlineNotifaction } from "../actions/types";


const initialState = {
    friends: [],
    pendingInvitations: [],
    onlineUsers: [],
    groupChatList: [],
    usernotifications:[],
    notifications:[],
};

interface FriendsState {
    friends: Array<Friend>;
    pendingInvitations: Array<PendingInvitation>;
    onlineUsers: Array<OnlineUser>;
    groupChatList: Array<GroupChatDetails>;
    usernotifications:Array<UserGetNotification>;
    notifications: Array<OnlineNotifaction>;
}


const friendsReducer: Reducer<FriendsState, FriendsActions> = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case actionTypes.setPendingInvitations:
            return {
                ...state,
                pendingInvitations: action.payload,
            };

        case actionTypes.setFriends:
            return {
                ...state,
                friends: action.payload,
            };
            case actionTypes.setNotifications:
                return {
                    ...state,
                    notifications: action.payload,
                };
        case actionTypes.setOnlineUsers:
            return {
                ...state,
                onlineUsers: action.payload,
            };
        case actionTypes.setUserNotifcations:
            return {
                ...state,
                usernotifications: action.payload,
            };

        case actionTypes.setGroupChatList:
            return {
                ...state,
                groupChatList: action.payload,
            };

        case actionTypes.resetFriends:
            return {
                ...initialState
            };

        default:
            return state;
    }
};

export { friendsReducer };
