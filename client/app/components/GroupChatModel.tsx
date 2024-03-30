import { Box, Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import axios from 'axios';
import { headers } from '../utils';
import UserListItem from './UserListItem';
import UserBadgeItem from './UserBadgeItem';

type Props = {
    children: React.ReactNode;
};

const GroupChatModel = ({ children }: Props) => {
    const { onOpen, isOpen, onClose } = useDisclosure();
    const [groupChatNAme, setGroupChatNAme] = useState()
    const [selectedUsers, setSelectedUsers] = useState<any[]>([])
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)

    const toast = useToast();
    const { user, chatState, setChatState } = ChatState();

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
    const handleSubmit = async (event: any) => {
        if (!groupChatNAme || !selectedUsers) {
            toast({
                title: "Please fill all the feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            })
            return;
        }
        try {
            const token = localStorage.getItem('token')
            const config = {
                headers: {
                    ...headers,
                    Authorization: `Bearer ${token}`,
                },
            }
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/group`, {
                name: groupChatNAme,
                users: JSON.stringify(selectedUsers.map((u: any) => u._id)),
            }, config)
            console.log(data)
            console.log(data.data)
            setChatState([data.data, ...chatState])
            onClose()
            if (data.message === 'Group Chat Created Successfully') {
                toast({
                    title: "Group Chat Created Successfully",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                })
            }
        } catch (error: any) {
            toast({
                // title: "Error Occured!",
                title: `${error.response.data.message}`,
                description: "Failed to Create the Chat",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
        }
    }
    const handleGroup = (userToAdd: any) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd])
    }
    const handleDelete = (user: any) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== user._id))
    }
    return (
        <Box>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent textColor={"black"}>
                    <ModalHeader fontWeight={'bold'} fontSize={"3xl"} display={'flex'} justifyContent={'center'} >Create Group</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box mb={3}>
                            <Input type='text' placeholder='Chat Name' onChange={(e: any) => setGroupChatNAme(e.target.value)} mb={3} />
                            <Input type='text' placeholder='Add users' onChange={(e: any) => handleSearch(e.target.value)} />

                        </Box>

                        <Box display={'flex'} flexWrap={'wrap'} mb={3}>
                            {selectedUsers.map((u: any) => (
                                <UserBadgeItem key={user._id} user={u} handleFunction={() => handleDelete(u)} />
                            ))}
                        </Box>
                        <Box>
                            {loading ? <div>loading</div> : (
                                searchResult?.slice(0, 4).map((user: any) => (
                                    <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                                ))
                            )}
                        </Box>
                    </ModalBody>

                    <ModalFooter display={'flex'} justifyContent={'center'}>
                        <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                            Craete Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default GroupChatModel;
