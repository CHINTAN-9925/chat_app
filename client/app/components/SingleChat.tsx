import { IconButton } from '@chakra-ui/button';
import { Box, FormControl, Input, Spinner, Text } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/toast';
import axios from 'axios';
import { useEffect, useState } from 'react';
import io from "socket.io-client";
import { ChatState } from '../context/ChatProvider';
import { getSender, getSenderWhole } from '../utils/chatLogic';
import ProfileModel from './ProfileModel';
import ScrollableChat from './ScrollableChat';
import UpdateGroupChatModel from './UpdateGroupChatModel';

type Props = {
    fetchAgain: boolean,
    setFetchAgain: (fetchAgain: boolean) => void
}

const ENDPOINT = "http://localhost:4000";
let socket: any, selectedChatCompare: any;

const SingleChat = ({ fetchAgain, setFetchAgain }: Props) => {
    const { user, selectedChat, setSelectedChat } = ChatState();
    const [message, setMessage] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [newMessage, setNewMessage] = useState<any>();
    const [socketConnected, setSocketConnected] = useState<boolean>(false);
    const [typing, setTyping] = useState<boolean>(false);
    const toast = useToast();

    useEffect(() => {
        console.log("Socket initialized");
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
        // eslint-disable-next-line
    }, [selectedChat]);

    useEffect(() => { 
        socket.on("message received", (newMessageRecieved: any) => {
            if (
                !selectedChatCompare || 
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
            // notification
        } else {
            setMessage([...message, newMessageRecieved]);
        }
    });
});
const sendMessage = async (event: any) => {
    if (event.key === "Enter") {
        event.preventDefault();
        try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/message`,
                {
                    content: newMessage,
                    chatId: selectedChat._id,
                },
                config
            );
            socket.emit("new message", data.data);
            setMessage([...message, data.data]);
            setLoading(false);
            setNewMessage("");
        } catch (error: any) {
            toast({
                title: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            setNewMessage("");
        }

    }
    return;
}
const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        setLoading(true);
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/message/${selectedChat._id}`, config);
        setMessage(data.data);
        console.log({ message })
        console.log(data.data)
        setLoading(false);
        socket.emit("join chat", selectedChat._id);
    } catch (error: any) {
        toast({
            title: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        setLoading(false);
    }
}
const typingHandler = (event: any) => {
    setNewMessage(event.target.value)
}

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
                    <UpdateGroupChatModel fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />

                </>)}
            </Text>
            <Text>
                <Box display={"flex"} flexDir={"column"} justifyContent={"fixed-end"} w={"100%"} h={"100%"} bg={"#E8E8E8"} borderRadius={"lg"} overflowY={"hidden"} >

                    {
                        loading ? <Spinner size={"xl"} w={10} h={10} alignSelf="center" margin={"auto"} /> :
                            <Box p={3} display={"flex"} flexDir={"column"} justifyContent={"end"} w={"100%"} h={"70vh"} bg={"teal.200"} borderRadius={"lg"} overflowY={"hidden"}>
                                <ScrollableChat messages={message} />
                            </Box>
                    }
                    <FormControl onKeyDown={sendMessage} mb={"10px"} mt={"5px"} isRequired >
                        <Input variant={"filled"} bg={"#E0E0E0"} placeholder='Enter a message...' onChange={typingHandler} value={newMessage} />
                    </FormControl>
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