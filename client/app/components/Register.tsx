import { FormControl, Button, FormLabel, Input, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import { headers } from '../utils';

type Props = {}

function Register({ }: Props) {
    const toast = useToast();
    const [input, serInput] = useState({
        name: "",
        email: "",
        password: "",

    })
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    // const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);
    const handleInput = (event: any) => {
        const { name, value } = event.target;
        serInput((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    const postDetails = (pics: any) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: "Please Select an Image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "dctin1d9p");
            fetch(`${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD}`, {
                method: "post",
                body: data,
            }).then((res) => res.json()).then((data) => {
                setPic(data.url.toString());
                // console.log(data.url.toString());
                console.log(data);
                setLoading(false);
                const response = axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/picupdate`, {
                    id:
                },{
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    }
                })
            }).catch((err) => {
                console.log(err);
                setLoading(false);
            })

        } else {
            toast({
                title: "Please Select an Image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

    }
    const handleSubmit = async (event: any) => {
        setLoading(true);
        console.log(input)
        if (!input.name || !input.email || !input.password) {
            toast({
                title: "Please Fill all the Feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/register`, {
                name: input.name,
                email: input.email,
                password: input.password,
                pic: pic
            },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    }
                }

            )
            console.log(data)
            if (data.status === 409) {
                toast({
                    title: "user already exists",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                })
                setLoading(false);
                return;
            }

            if (data.status === 201) {
                localStorage.setItem("token", data.data.token);
                toast({
                    title: "user created successfully",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                })
                // setSubmittedSuccessfully(true);
                postDetails(pic)
                return;
            }
            setLoading(false);
        } catch (error: any) {
            toast({
                title: `${error.message}`,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            setLoading(false);
        }
    }
    return (
        <VStack spacing={"20px"}>
            <FormControl>
                <FormLabel fontWeight={"2px"} fontSize={"15px"} w={"100%"} h={"100%"}>Name</FormLabel>
                <Input placeholder='Name' name='name' onChange={handleInput} height={"30px"} fontWeight={"2px"} fontSize={"15px"} />
            </FormControl>
            <FormControl>
                <FormLabel fontWeight={"2px"} fontSize={"15px"} w={"100%"}>Email</FormLabel>
                <Input placeholder='Email' name='email' onChange={handleInput} height={"30px"} fontWeight={"2px"} fontSize={"15px"} />
            </FormControl>
            <FormControl>
                <FormLabel fontWeight={"2px"} fontSize={"15px"}>Password</FormLabel>
                <Input placeholder='Password' name='password' onChange={handleInput} height={"30px"} fontWeight={"2px"} fontSize={"15px"} />
            </FormControl>
            <FormControl>
                <FormLabel fontWeight={"2px"} fontSize={"15px"}>Profile pic</FormLabel>
                <Input placeholder='Upload Profile pic' name="pic" border={"none"} type='file' accept='image/*' height={"30px"} fontWeight={"2px"} fontSize={"15px"} />
            </FormControl>
            <Button type='submit' color={"white"} isLoading={loading} colorScheme='blue' size='sm' mt={5} w={"75%"} onClick={handleSubmit} >Submit</Button>
        </VStack>
    )
}

export default Register;