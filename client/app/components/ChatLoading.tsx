import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

type Props = {}

const ChatLoading = (props: Props) => {
  return (
    <Stack>
        <Skeleton height='45px' />
        <Skeleton height='45px' />
        <Skeleton height='45px' />
        <Skeleton height='45px' />
        <Skeleton height='45px' />
        <Skeleton height='45px' />
        <Skeleton height='45px' />
        <Skeleton height='45px' />
        <Skeleton height='45px' />
        <Skeleton height='45px' />
    </Stack>
  )
}

export default ChatLoading;