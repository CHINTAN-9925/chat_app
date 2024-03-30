import { Box, Button, Stack, Text, useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import { headers } from '../utils';
import { getSender } from '../utils/chatLogic';
import ChatLoading from './ChatLoading';
import GroupChatModel from './GroupChatModel';

type Props = {
    fetchAgain: boolean
}

const MyChats = ({ fetchAgain }: Props) => {
    const { selectedChat, setSelectedChat, chatState, setChatState } = ChatState();
    const [loggedUser, setLoggedUser] = useState<any>({});
    const toast = useToast();
    const { onOpen, onClose, isOpen } = useDisclosure();

    const fetchChats = async () => {
        try {
            const token = localStorage.getItem('token');
            // const user = localStorage.getItem('userInfo');
            console.log({ token })
            if (!token) {
                console.error('User token is missing');
                return;
            }


            const config = {
                headers: {
                    ...headers,
                    Authorization: `Bearer ${token}`,
                },
            };

            console.log('Authorization Header:', config.headers.Authorization);

            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chat`, config);
            console.log('Fetched chats:', response.data);
            setChatState(response.data);
        } catch (err: any) {
            console.error('Error fetching chats:', err);
            toast({
                title: 'Error Occurred!',
                description: 'Failed to load the chats',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
        }
    };


    useEffect(() => {
        console.log('Inside MyChats component');
        const user = localStorage.getItem('userInfo');
        setLoggedUser(user ? JSON.parse(user) : {});
        console.log('Logged user:', loggedUser);
        console.log('Chat state:', chatState);
        fetchChats();
    }, [fetchAgain]);

    return (
        <Box display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }} flexDir="column" p={3} bg="white" w={{ base: '100%', md: '31%' }} borderRadius="lg" borderWidth="1px" bgColor="#E8E8E8">
            <Box pb={3} px={3} fontSize={{ base: '28px', md: '30px' }} display="flex" alignItems="center" textAlign="center" w="100%" bg="teal" justifyContent="space-between" borderRadius="lg">
                My Chats
                <GroupChatModel>
                    <Button display="flex" variant="block" fontSize={{ base: '17px', md: '10px', lg: '17px' }} size="sm" gap={1} onClick={onOpen}>
                        <i className="fa-solid fa-plus"></i>
                        <Text>New Group Chat</Text>
                    </Button>
                </GroupChatModel>
            </Box>
            <Box display="flex" flexDir="column" p={3} bg="#E8E8E8" w="100%" h="100%" borderRadius="lg" overflowY="hidden">
                {chatState ? (
                    <Stack overflowY="scroll">
                        {chatState.map((chat: any) => (
                            <Box onClick={() => setSelectedChat(chat)} cursor="pointer" bg={selectedChat === chat._id ? 'teal.100' : 'white'} color={selectedChat === chat._id ? 'black' : 'black'} px={3} py={2} borderRadius="lg" key={chat._id}>
                                <Text>
                                    {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                                </Text>
                                {
                                    chat.latestMessage ? (
                                        <Text fontSize={"12px"}>
                                            {chat.latestMessage}
                                        </Text>
                                    ) : null
                                }
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box>
    );
};

export default MyChats;
