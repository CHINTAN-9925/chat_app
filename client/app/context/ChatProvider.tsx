"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from "next/navigation"

type Props = {
    children: React.ReactNode;
}

const ChatContext = createContext({})

const ChatProvider = ({ children }: Props) => {
    const [user, setUser] = useState({});
    const [selectedChat, setSelectedChat] = useState();
    const [chatState, setChatState] = useState<Array<any>>([]);
    const router = useRouter()

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        setUser(JSON.parse(userInfo!))
        if (!userInfo) {
            router.push("/")
        }
    }, [router])

    return (
        <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chatState, setChatState }}>
            {children}
        </ChatContext.Provider>
    )
}

export const ChatState = (): any => useContext(ChatContext)

export default ChatProvider;
