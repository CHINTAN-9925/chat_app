import { Button, FormControl, FormLabel, Input, VStack, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from "next/navigation"
import { useState } from 'react'

type Props = {}

const Login = (props: Props) => {
    const toast = useToast();
    const router = useRouter();
    const [input, serInput] = useState({
        email: "",
        password: ""
    })
    const handleInput = (event: any) => {
        const { name, value } = event.target;
        serInput((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    const submithandler = async (event: any) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/login`, input, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Access-Control-Allow-Origin": "*",
                }
            });
            if (response.data.message === "Invalid creadentials") {
                toast({
                    title: "Invalid creadentials",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                })
            }
            if (response.data.message === "user not found") {
                toast({
                    title: "user not found",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                })
            }
            if (response.data.message === "user logged in successfully") {
                toast({
                    title: "user logged in successfully",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                })
                localStorage.setItem("token", response.data.data.token);
                localStorage.setItem("userInfo", JSON.stringify(response.data.data))
                router.push("/chats")
            }
        } catch (error: any) {
            console.error("Error:", error.message);
            toast({
                title: `${error.message}`,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
        }
    };

    return (
        <VStack>
            <FormControl>
                <FormLabel fontWeight={"2px"} fontSize={"15px"} w={"100%"}>Email</FormLabel>
                <Input placeholder='Email' name='email' height={"30px"} onClick={handleInput} fontWeight={"2px"} fontSize={"15px"} />
            </FormControl>
            <FormControl>
                <FormLabel fontWeight={"2px"} fontSize={"15px"}>Password</FormLabel>
                <Input placeholder='Password' name='password' height={"30px"} onChange={handleInput} fontWeight={"2px"} fontSize={"15px"} />
            </FormControl>
            <Button type='submit' color={"white"} colorScheme='blue' size='sm' mt={5} w={"75%"} onClick={submithandler}>Submit</Button>
        </VStack>
    )
}

export default Login