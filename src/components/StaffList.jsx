import React from 'react';
import {
    Button,
    Skeleton,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    VStack,
    Table,
    Box,
    Text,
    HStack,
    useBreakpointValue,
    Badge
} from "@chakra-ui/react";

const StaffList = ({ staff, onEdit, isLoading,onDelete }) => {
    const isMobile = useBreakpointValue({ base: true, md: false });

    if (isLoading) {
        return (
            <VStack spacing={4} align="stretch">
                {[...Array(5)].map((_, index) => (
                    <Skeleton key={index} height="50px" />
                ))}
            </VStack>
        );
    }

    if (isMobile) {
        return (
            <VStack spacing={4} align="stretch" width="100%">
                {staff.map((member) => (
                    <Box key={member.id} borderWidth="1px" borderRadius="lg" p={4}>
                        <VStack align="stretch" spacing={2}>
                            <Text fontWeight="bold">{member.username}</Text>
                            <Text>{member.email}</Text>
                            <HStack justify="space-between">
                                <Badge colorScheme={member.is_superuser ? "green" : "gray"}>
                                    {member.is_superuser ? 'Superuser' : 'Regular User'}
                                </Badge>
                                <Button colorScheme="blue" size="sm" onClick={() => onEdit(member)}>
                                    Edit
                                </Button>
                                <Button colorScheme="red"  size="sm" onClick={() => onDelete(member)} >
                                    Delete
                                </Button>
                            </HStack>
                        </VStack>
                    </Box>
                ))}
            </VStack>
        );
    }

    return (
        <Box overflowX="auto" w="100%">
            <Table variant="simple" size="sm">
                <Thead>
                    <Tr>
                        <Th>Username</Th>
                        <Th>Email</Th>
                        <Th>Is Superuser</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {staff.map((member) => (
                        <Tr key={member.id}>
                            <Td>{member.username}</Td>
                            <Td>{member.email}</Td>
                            <Td>{member.is_superuser ? 'Yes' : 'No'}</Td>
                            <Td>
                                <Button colorScheme="blue" size="sm" onClick={() => onEdit(member)}>
                                    Edit
                                </Button>
                                <Button colorScheme="red"  size="sm" onClick={() => onDelete(member)} ml={2}>
                                    Delete
                                </Button>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default StaffList;