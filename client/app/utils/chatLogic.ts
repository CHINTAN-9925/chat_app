export const getSender = (loggedUser: any, chatUsers: any) => {
    console.log({ loggedUser, chatUsers });
    if (!loggedUser || !chatUsers || !chatUsers[0] || !chatUsers[1]) {
        console.error("Invalid input: loggedUser or chatUsers is undefined or does not have the expected structure.");
        return null; // or handle the error in some other way
    }
    
    return chatUsers[0]._id === loggedUser._id ? chatUsers[1].name : chatUsers[0].name;
};
