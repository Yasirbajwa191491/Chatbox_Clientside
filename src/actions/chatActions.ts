// import { Dispatch } from "redux";
import { actionTypes, SetChosenChatDetails, SetMessages, Message, SetTyping, AddNewMessage, SetInitialTypingStatus, Typing, GroupChatDetails, SetChosenGroupChatDetails, ResetChat,total,SetGroupNotifications } from "./types";

export const setChosenChatDetails = (chatDetails: {
    userId: string;
    username: string;
    department:string;
    section:string;
    designation:string;
    name:string;
}): SetChosenChatDetails => {
    return {
        type: actionTypes.setChosenChatDetails,
        payload: chatDetails,
    };
};

export const setChosenGroupChatDetails = (chatDetails: GroupChatDetails): SetChosenGroupChatDetails => {
    return {
        type: actionTypes.setChosenGroupChatDetails,
        payload: chatDetails,
    };
};


export const setMessages = (messages: Array<Message>): SetMessages => {
    return {
        type: actionTypes.setMessages,
        payload: messages,
    };
};
export interface GroupNotification {
    notifications: number;
    groupChatId: string;
}
export const setGroupNotifications = (notifications: GroupNotification[]): SetGroupNotifications => {
    return {
        type: actionTypes.setGroupNotifications,
        payload: notifications,
    };
};

export const addNewMessage = (message: Message): AddNewMessage => {
    return {
        type: actionTypes.addNewMessage,
        payload: message,
    };
};


export const setTyping = (typing: Typing): SetTyping => {
    return {
        type: actionTypes.setTyping,
        payload: typing
    };
};

export const setInitialTypingStatus = (typing: Array<Typing>): SetInitialTypingStatus => {
    return {
        type: actionTypes.setInitialTypingStatus,
        payload: typing,
    };
};

export const resetChatAction = (): ResetChat => {
    return {
        type: actionTypes.resetChat
    }
}