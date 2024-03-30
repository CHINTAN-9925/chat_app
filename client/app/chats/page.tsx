'use client'
import { Box } from '@chakra-ui/react';
import { useRouter } from "next/navigation";
import ChatBox from '../components/ChatBox';
import MyChats from '../components/MyChats';
import SideDrawer from '../components/SideDrawer';

import { ChatState } from '../context/ChatProvider';
import { useState } from 'react';

type Props = {}

const Page = (props: Props) => {
    const router = useRouter()
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState<boolean>(false);

    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box style={{ display: "flex", justifyContent: "space-between", height: "91vh", padding: "10px" }}>
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    )
}
export default Page;