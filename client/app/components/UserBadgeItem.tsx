import { Box, Button, Text } from '@chakra-ui/react'
import React from 'react'

type Props = {
    user?: any
    handleFunction?: any
}

const UserBadgeItem = ({ user, handleFunction }: Props) => {
    return (
        <Box cursor={"pointer"} p={1} borderRadius={"lg"} w={"fit-content"} h={8} m={1} mb={2} display={"flex"} gap={2} justifyContent={"center"} alignItems={"center"} bg='tomato' color='white' >
            <Text>
                {user.name.length > 8 ? (
                    <>
                        {user.name.slice(0, 8)}...
                    </>
                ) : (
                    <>
                        {user.name}
                    </>
                )}
            </Text>
            <Button onClick={() => handleFunction()} variant={"unstyled"} bg={"transparent"} color={"white"} _hover={{ bg: "transparent", color: "black" }}>
                <i className="fa-solid fa-xmark"></i>
            </Button>
        </Box>
    )
}

export default UserBadgeItem