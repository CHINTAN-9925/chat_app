'use client'
import axios from 'axios'
import React, { useEffect } from 'react'

type Props = {}

const Page = (props: Props) => {
    const fetchChats = async () => {
        // await fetch("https://swapi.dev/api/").then((res) => res.json()).then((data) => {
        //     console.log(data)
        // }).catch((err)=>{
        //     console.log(err)
        // })
        const data = await axios.get("https://swapi.dev/api/");
        console.log(data)
    }
    useEffect(()=>{
        fetchChats()
    },[])
    return (
        <div >from chats</div>
    )
}

export default Page;