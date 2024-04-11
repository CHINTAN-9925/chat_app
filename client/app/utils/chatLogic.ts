export const getSender = (loggedUser: any, chatUsers: any) => {
    if (!loggedUser || !chatUsers || !chatUsers[0] || !chatUsers[1]) {
        console.error("Invalid input: loggedUser or chatUsers is undefined or does not have the expected structure.");
        return null;
    }
    return chatUsers[0]._id === loggedUser._id ? chatUsers[1].name : chatUsers[0].name;
};

export const getSenderWhole = (loggedUser: any, chatUsers: any) => {
    if (!loggedUser || !chatUsers || !chatUsers[0] || !chatUsers[1]) {
        console.error("Invalid input: loggedUser or chatUsers is undefined or does not have the expected structure.");
        return null;
    }
    return chatUsers[0]._id === loggedUser._id ? chatUsers[1] : chatUsers[0];
};

export const isSameSenderMargin = (messages:any, m:any, i:number, userId:any) => {
    if (
        i < messages.length - 1 &&
        messages[i + 1].sender._id === m.sender._id &&
        messages[i].sender._id !== userId
    )
        return 33;
    else if (
        (i < messages.length - 1 &&
            messages[i + 1].sender._id !== m.sender._id &&
            messages[i].sender._id !== userId) ||
        (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
        return 0;
    else return "auto";
};

export const isSameSender = (messages:any, m:any, i:number, userId:any) => {
    return (
        i < messages.length - 1 &&
        (messages[i + 1].sender._id !== m.sender._id ||
            messages[i + 1].sender._id === undefined) &&
        messages[i].sender._id !== userId
    );
};

export const isLastMessage = (messages:any, i:number, userId:any) => {
    return (
        i === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    );
};

export const isSameUser = (messages:any, m:any, i:any) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
