import { Reducer } from "redux";
import { ChatActions, actionTypes,SetGroupNotifications} from "../actions/types";
import { GroupNotification } from "../actions/chatActions";


enum ChatTypes {
    direct = "DIRECT",
    group = "GROUP",
}

interface Message {
    _id: string;
    content: string;
    author: {
        username: string;
        _id: string;
    }
    createdAt: string,
}

interface ChatState {
    chatType: ChatTypes;
    chosenChatDetails: {
        userId: string;
        username: string;
        department: string;
        section: string;
        designation: string;
        name: string;
    } | null;
    chosenGroupChatDetails: {
        groupId: string;
        groupName: string;
        participants: Array<{
            _id: string;
            username: string;
            email: string;
        }>;
        admin: {
            _id: string;
            username: string;
            email: string;
        };
    } | null;
    typing: Array<{
        userId: string;
        typing: boolean;
    }>;
    messages: Array<Message>;
    notifications:GroupNotification[]; // Update the type here
}




const initialState = {
    chosenChatDetails: null,
    chosenGroupChatDetails: null,
    typing: [],
    chatType: ChatTypes.direct,
    messages: [],
    notifications:[],
};



const chatReducer: Reducer<ChatState, ChatActions> = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case actionTypes.setChosenChatDetails:
            return {
                ...state,
                chosenGroupChatDetails: null,
                messages: [],
                chosenChatDetails: {
                    ...action.payload,
                    typing: {
                        typing: false,
                        userId: "",
                    },
                },
            };

        case actionTypes.setChosenGroupChatDetails:
            return {
                ...state,
                chosenChatDetails: null,
                messages: [],
                chosenGroupChatDetails: action.payload,
            };

        case actionTypes.setMessages:
            return {
                ...state,
                messages: action.payload,
            };
        case actionTypes.setGroupNotifications:
            return {
                ...state,
                notifications: action.payload, // Assuming action.payload is an array of objects
            };

        case actionTypes.addNewMessage:
            return {
                ...state,
                messages: [...state.messages, action.payload],
            };

        case actionTypes.setInitialTypingStatus:
            return {
                ...state,
                typing: action.payload,
            };

        case actionTypes.setTyping:
            return {
                ...state,
                typing: state.typing.map((item) => {
                    if (item.userId === action.payload.userId) {
                        return action.payload;
                    } else {
                        return item;
                    }
                }),
            };

        case actionTypes.resetChat:
            return {
                ...state,
                chosenChatDetails: null,
                chosenGroupChatDetails: null,
                messages: [],
            };

        default:
            return state;
    }
};

export { chatReducer };
