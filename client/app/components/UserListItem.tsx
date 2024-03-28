import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'

type Props = {
    user: any,
    handleFunction: any,
}

const UserListItem = ({ user, handleFunction }: Props) => {
    return (
        <Box onClick={() => handleFunction(user._id)} cursor={"pointer"} bg={"#E8E8E8"} color={"black"} w={"100%"} _hover={{ bg: "#38B2AC", color: "white" }} display={"flex"} alignItems={"center"} justifyContent={"space-between"} px={3} py={2} borderRadius={"lg"} mr={2} mb={2}>
            <Avatar name={user.name} src={user.pic} cursor={"pointer"} size={"sm"} />
            <Box>
                <Text>{user.name}</Text>
                <Text fontSize={"xs"}>
                    <b>
                        Email :
                    </b>{user.email}</Text>
            </Box>
        </Box>
    )
}

export default UserListItem