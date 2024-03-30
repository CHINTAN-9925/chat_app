import React from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SingleChat from './SingleChat'


type Props = {
  setFetchAgain: (fetchAgain: boolean) => void,
  fetchAgain: boolean
}


const ChatBox = ({setFetchAgain, fetchAgain }: Props) => {
  const { selectedChat } = ChatState()
  return (
    <Box display={{ base: selectedChat ? "flex" : "none", md: "flex" }} flexDir="column" p={3} bg="#E8E8E8" w={{ base: "100%", md: "68%" }} borderRadius="lg" borderWidth={1} overflowY="hidden" textColor={"black"}>
      <SingleChat setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} />
    </Box>
  )
}

export default ChatBox