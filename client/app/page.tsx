'use client'

import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Login from "./components/Login"
import Register from "./components/Register"

export default function Page() {
  const router = useRouter()
  useEffect(() => {
    const user = localStorage.getItem("userInfo");
    if (user) {
      router.push("/chats")
    }
  },[router])
  return (
    <Container maxW="xl" centerContent>
      <Box w={"50%"} textAlign={"center"} mt={100} rounded={"md"} shadow={"md"}>
        <Tabs bgColor={"#0d0d0d"} p={0} shadow={"xl"} rounded={"md"}>
          <TabList>
            <Tab w={"50%"}>Register</Tab>
            <Tab w={"50%"}>Login</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Register />
            </TabPanel>
            <TabPanel>
              <Login />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}