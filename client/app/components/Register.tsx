import { Button, FormControl, FormLabel, Input, VStack, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { headers } from '../utils';

type Props = {}

function Register({ }: Props) {
    const toast = useToast();
    const [input, serInput] = useState({
        name: "",
        email: "",
        password: "",
        pic: "",
    })
    const [pic, setPic] = useState<any>();
    const [picUrl, setPicUrl] = useState<string>("");
    const [user, setUser] = useState<any>();
    const [loading, setLoading] = useState(false);
    const handleInput = (event: any) => {
        const { name, value } = event.target;
        serInput((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const postDetails = async (pics: File) => {
        setLoading(true);
        if (pics === undefined) {
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
        console.log("pics", pics);
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "dctin1d9p");
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD}`, {
                    method: "post",
                    body: data,
                });
                if (!response.ok) {
                    throw new Error("Failed to upload image");
                }
                const imageData = await response.json();
                console.log({ imageData });
                console.log(typeof imageData.url.toString());
                setPicUrl(imageData.url.toString()); // Set pic state to URL string
                setLoading(false);
                // Call backend API to save pic URL
                const payload = {
                    id: user,
                    pic: imageData.url.toString(), // Send pic URL to backend
                }
                console.log({ picUrl })
                console.log("imageDta", imageData.url.toString());
                const updatedUserWithPic = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/picupdate`, JSON.stringify(payload), { headers });
                console.log({ updatedUserWithPic });
                console.log("pic uploaded successfully");
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        } else {
            toast({
                title: "Please Select an Image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            postDetails(pic);
        }
    }, [user]); 

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
                pic: picUrl
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
                localStorage.setItem("userInfo", JSON.stringify(data.data))
                console.log("data", data.data)
                setUser(data.data._id.toString());
                console.log("user id", data.data._id)
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
                <Input placeholder='Upload Profile pic' name="pic" border={"none"} type='file' accept='image/*' height={"30px"} fontWeight={"2px"} fontSize={"15px"} onChange={(e: any) => setPic(e.target.files[0])} />
            </FormControl>
            <Button type='submit' color={"white"} colorScheme='blue' size='sm' mt={5} w={"75%"} onClick={handleSubmit} >Submit</Button>
        </VStack>
    )
}

export default Register;
