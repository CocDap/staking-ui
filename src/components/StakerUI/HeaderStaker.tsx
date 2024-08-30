import { Flex, Text } from '@chakra-ui/react'
import React from 'react'

const HeaderStaker = ({value, label, icon} : {
    value: string,
    label: string,
    icon: any,
    
  
}) => {
  return (
    <Flex width={'full'} height={'full'} flexDirection={'column'} alignItems={'start'} gap={2} justifyContent={'center'} p={8}  border={"8px solid #89d7e9"}
    backgroundColor={"#F0FCFF"}
    rounded={"40px"}>
            <Text fontWeight={'bold'} fontSize={28}>{value}</Text>
            <Flex alignItems={'center'} justifyContent={'center'} gap={2}>
            {icon}
            <Text fontSize={18}>{label}</Text>
            </Flex>
      </Flex>
  )
}

export default HeaderStaker