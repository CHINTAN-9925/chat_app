import { Avatar, Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Text } from '@chakra-ui/react'
import React from 'react'

type Props = {
    children?: React.ReactNode;
    user?: any
}

const ProfileModel = ({ children, user }: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <Box>
            {children ?
                <span onClick={onOpen}>{children}</span> : (<Button onClick={onOpen} display={{ base: "flex", md: "block" }} size={"sm"}>
                    <i className="fa-solid fa-eye"></i>
                </Button>)}

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay/>
                <ModalContent textColor={"black"} display={"flex"} placeItems={"center"} justifyContent={"center"}>
                    <Avatar name={user?.name} src={user?.pic} size={"xl"} cursor={"pointer"} mt={"10"} border={"1px solid grey"} />
                    <ModalHeader fontSize={"25px"} fontWeight={"bold"} p={2}>{user?.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Email:{user?.email}</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='teal' onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default ProfileModel