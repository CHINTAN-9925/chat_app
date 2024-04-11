import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isSameSender, isLastMessage, isSameSenderMargin } from '../utils/chatLogic'
import { Avatar, Tooltip } from '@chakra-ui/react'
import { ChatState } from '../context/ChatProvider'

type Props = {
    messages: any
}

const ScrollableChat = ({ messages }: Props) => {
    const { user } = ChatState();
    return (
        <ScrollableFeed>
            {messages && messages.map((m: any, i: number) => (
                <div key={m._id} style={{ display: "flex" }}>
                    {
                        (isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
                            <Tooltip label={m.sender.name} placement="bottom-start" hasArrow arrowSize={10} >
                                <Avatar name={m.sender.name} src={m.sender.pic} mt={"7px"} mr={1} size={"sm"} cursor={"pointer"} />
                            </Tooltip>
                        )
                    }
                    <span style={{ backgroundColor: m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0", marginLeft: isSameSenderMargin(messages, m, i, user._id), borderRadius: "20px", padding: "5px 15px", maxWidth: "75%", marginTop: "5px" }}>
                        {m.content}
                    </span>
                </div>
            ))}
        </ScrollableFeed>
    )
}

export default ScrollableChat