import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import { headers } from '../utils';
import ChatLoading from './ChatLoading';
import ProfileModel from './ProfileModel';
import UserListItem from './UserListItem';

type Props = {}

const SideDrawer = (props: Props) => {
    const [search, setSearch] = useState<string>("");
    const [searchResult, setSearchResult] = useState<any>([{}]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingChats, setloadingChats] = useState<boolean>(false);
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const { user, setSelectedChat, chatState, setChatState } = ChatState();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
        router.push("/");
    }

    const handleSearch = async () => {
        if (!search) {
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
            setLoading(true);
            const config = {
                headers: {
                    ...headers,
                    Authorization: `Bearer ${user?.token}`,
                },
            };
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user?search=${search}`, config);
            console.log(data.data)
            console.log(data.message)

            if (data.message === "user data fetched successfully") {
                toast({
                    title: "user data fetched successfully",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                }) //we dont need this toast remove this after app is created this is just fopr debug
                setSearchResult(data.data);
                setLoading(false);
                return;
            }
            setLoading(false);
            setSearchResult(data);
        } catch (error: any) {
            toast({
                title: "Error Occured!,Please try again",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            setLoading(false);
        }
    }

    const accessChat = async (id: string) => {
        console.log("Accessing chat with ID:", id);
        try {
            setloadingChats(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.token}`,
                }
            };

            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chat`, { userId: id }, config);
            const newData = response.data;
            console.log({ newData })

            if (!chatState?.find((c: any) => c._id === newData._id)) {
                setChatState([newData, ...chatState]);
            }

            console.log("New chat data:", newData);
            setSelectedChat(newData);
            setloadingChats(false);
            onClose();
        } catch (error: any) {
            console.error("Error accessing chat:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to access chat",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setloadingChats(false);
        }
    };

    return (
        <>
            <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} p={"5px 10px 5px 10px"} w={"100%"} border={"1px solid teal"} borderRadius={4} bg={"teal"}>
                <Tooltip label='Search User' placement='right-end' hasArrow>
                    <Button variant='teal' colorScheme='cyan' color={'white'} _hover={{ bg: 'teal.100', textColor: 'black' }} display={'flex'} gap={2} onClick={onOpen}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <Text display={{ base: "none", md: "block" }} p={2}>Search User</Text>
                    </Button>
                </Tooltip>
                <Text display={{ base: "none", md: "block" }} fontSize={"20px"} fontWeight={"bold"} p={2}>
                    chta App
                </Text>
                <Box display={"flex"} gap={5} p={2} alignItems={"center"}>
                    <Menu>
                        <MenuButton>
                            <i className="fa-solid fa-bell"></i>
                        </MenuButton>
                        {/* <MenuList> </MenuList> */}
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} variant={"teal"} rightIcon={<i className="fa-solid fa-chevron-down"></i>}>
                            <Avatar name={user?.name} src={user?.pic} size={"sm"} cursor={"pointer"} />
                        </MenuButton>
                        <MenuList textColor={"black"}>
                            <ProfileModel user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModel>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
            </Box>
            <Drawer placement='left' onClose={onClose} isOpen={isOpen} >
                <DrawerOverlay />
                <DrawerContent textColor={"black"} borderRadius={"5px"}>
                    <DrawerHeader borderBottom={"1px solid teal"} textAlign={"center"}>Search User</DrawerHeader>
                    <DrawerBody>
                        <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} p={2}>
                            <Box textColor={"black"} display={"flex"} justifyContent={"center"} p={2}>
                                <Input type="text" placeholder='Search User' value={search} onChange={(e: any) => setSearch(e.target.value)} />
                            </Box>
                            <Button onClick={handleSearch} isLoading={loading}>Go</Button>
                        </Box>
                        {
                            loading ? (
                                <ChatLoading />
                            ) : (
                                searchResult?.map((user: any) => (
                                    <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
                                )))
                        }
                        {loadingChats && <Spinner ml={"auto"} display={"flex"} />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer