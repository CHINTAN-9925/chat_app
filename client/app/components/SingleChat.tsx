import React from 'react'
import { ChatState } from '../context/ChatProvider';
import { Box, Text } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/button'
import { getSender, getSenderWhole } from '../utils/chatLogic';
import ProfileModel from './ProfileModel';
import UpdateGroupChatModel from './UpdateGroupChatModel';

type Props = {
    fetchAgain: boolean,
    setFetchAgain: (fetchAgain: boolean) => void
}

const SingleChat = ({ fetchAgain, setFetchAgain }: Props) => {
    const { user, selectedChat, setSelectedChat } = ChatState();
    return (
        <>
            {selectedChat ? (<>
                <Text fontSize={{ base: "28px", md: "30px" }} pb={3} px={2} w={"100%"} fontFamily={"Work sans"} display={"flex"} justifyContent={{ base: "space-between" }} alignItems={"center"}>
                    <IconButton display={{ base: "flex", md: "none" }} variant={"unstyled"} icon={<i className="fa-solid fa-arrow-left"></i>} onClick={() => setSelectedChat("")} aria-label={''} />
                    {!selectedChat.isGroupChat ? (
                        <>
                            {getSender(user, selectedChat.users)}
                            <ProfileModel user={getSenderWhole(user, selectedChat.users)} />
                        </>
                    ) : (<>
                        {selectedChat.chatName.toUpperCase()}
                        <UpdateGroupChatModel fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />

                    </>)}
                </Text>
                <Text>
                    <Box display={"flex"} flexDir={"column"} justifyContent={"fixed-end"} w={"100%"} h={"100%"} bg={"#E8E8E8"} borderRadius={"lg"} overflowY={"hidden"} >
                        {/* hi this is not imprtant thi wii be changed his is in single chat */}
                    </Box>
                </Text>
            </>) : (
                <Box display={"flex"} alignItems={"center"} justifyContent={"center"} h={"100%"}>
                    <Text fontSize={"2xl"} pb={3} fontFamily={"Work sans"}>
                        Click on a user to start chatting
                    </Text>
                </Box>
            )
            }
        </>
    )
}

export default SingleChat