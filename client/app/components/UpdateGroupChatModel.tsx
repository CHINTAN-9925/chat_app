import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { IconButton } from '@chakra-ui/button';
import { ChatState } from '../context/ChatProvider';
import UserBadgeItem from './UserBadgeItem';
import axios from 'axios';
import { headers } from '../utils';
import UserListItem from './UserListItem';

type Props = {
    fetchAgain: boolean
    setFetchAgain: (fetchAgain: boolean) => void
    fetchMessages: () => void
}

const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain,fetchMessages }: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, selectedChat, setSelectedChat } = ChatState();
    const [groupChatName, setGroupChatName] = useState("");
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [renameLoading, setRenameLoading] = useState(false);

    const toast = useToast();

    const handleRemove = async (user1: any) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: "Only admins can remove someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/leave`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
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
        setGroupChatName("");
    }
    const handleRename = async () => {
        if (!groupChatName) {
            toast({
                title: "Please Enter Group Name",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            return;
        }
        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    ...headers,
                    Authorization: `Bearer ${user?.token}`,
                },
            }
            const { data } = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/rename`, {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config)
            console.log(data.data);
            setSelectedChat(data.data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error: any) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            setRenameLoading(false);
        }
        setGroupChatName("");
    }
    const handleSearch = async (query: string) => {
        setSearch(query)
        if (!query) {
            toast({
                title: "Please enter something in search Box",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            return;
        }
        try {
            const token = localStorage.getItem('token')
            setLoading(true)
            const config = {
                headers: {
                    ...headers,
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user?search=${search}`, config)
            console.log(data)
            console.log(data.data)
            setLoading(false)
            setSearchResult(data.data)

        } catch (error: any) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
        }
    }
    const handleAddUser = async (inComingUser: any) => {
        if (selectedChat.users.find((u: any) => u._id === inComingUser._id)) {
            toast({
                title: "User Already in group!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            return;
        }
        if (selectedChat.groupAdmin._id !== user?._id) {
            toast({
                title: "Only admins can add someone!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            return;
        }
        try {

            setLoading(true)
            const config = {
                headers: {
                    ...headers,
                    Authorization: `Bearer ${user?.token}`,
                },
            }
            const { data } = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/join`, {
                chatId: selectedChat._id,
                userId: inComingUser._id
            }, config)

            setSelectedChat(data.data)
            setFetchAgain(!fetchAgain)
            setLoading(false)

        } catch (error: any) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            setLoading(false)
        }
    }
    return (
        <>
            <IconButton onClick={onOpen} aria-label={''} display={{ base: "flex" }} icon={<i className="fa-solid fa-eye"></i>} />

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent textColor={"black"}>
                    <ModalHeader>{selectedChat?.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box display={"flex"} flexWrap={"wrap"}>
                            {selectedChat?.users.map((u: any) => (
                                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)} />
                            ))}
                        </Box>
                        <FormControl display={"flex"}>
                            <Input placeholder="Chat Name" mb={3} value={groupChatName} onChange={(e: any) => setGroupChatName(e.target.value)} />
                            <Button variant="solid" colorScheme="teal" ml={1} isLoading={renameLoading} onClick={handleRename}>Update</Button>
                        </FormControl>
                        <FormControl>
                            <Input placeholder="Add User to group" mb={1} onChange={(e: any) => handleSearch(e.target.value)} />
                        </FormControl>
                        {loading ? (
                            <Spinner size="sm" />
                        ) : (
                            searchResult?.map((user: any) => (
                                <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={() => handleRemove(user)} bg={"red"}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModel 