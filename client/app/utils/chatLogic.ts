export const getSender = (loggedUser: any, chatUsers: any) => {
    console.log({ loggedUser, chatUsers });
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

