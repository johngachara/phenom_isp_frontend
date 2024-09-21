import React from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    useBreakpointValue,
    Flex,
    Box,
    Text,
    VStack,
    HStack,
    Divider
} from '@chakra-ui/react';
import { useAuth } from "./auth.js";

const HomeBody = ({ tableSize, filteredCustomers, handleEdit, handleDelete, RouterLink, ChakraLink }) => {
    const buttonSize = useBreakpointValue({ base: "sm", md: "md" });
    const isMobile = useBreakpointValue({ base: true, md: false });
    const { loading, userRole } = useAuth();  // Get the userRole from  auth hook

    // Disable edit and delete buttons if the userRole is not admin
    const canEditOrDelete = userRole === 'admin';

    if (isMobile) {
        return (
            <VStack spacing={4} align="stretch" width="100%">
                {filteredCustomers.map((customer, index) => (
                    <Box key={index} borderWidth="1px" borderRadius="lg" p={4}>
                        <VStack align="stretch" spacing={2}>
                            <Text fontWeight="bold">{customer.name}</Text>
                            <Text>{customer.email}</Text>
                            <Text>{customer.phone}</Text>
                            <Divider />
                            <HStack spacing={2} justify="space-between">
                                <Button
                                    size={buttonSize}
                                    colorScheme="blue"
                                    isDisabled={!customer.db_id || !canEditOrDelete}
                                    onClick={() => handleEdit(customer)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size={buttonSize}
                                    colorScheme="red"
                                    isDisabled={!customer.db_id || !canEditOrDelete}
                                    onClick={() => handleDelete(customer)}
                                >
                                    Delete
                                </Button>
                                <ChakraLink
                                    as={RouterLink}
                                    to={`/customer/${customer.db_id}`}
                                >
                                    <Button
                                        isDisabled={!customer.db_id}
                                        size={buttonSize}
                                        colorScheme="green"
                                    >
                                        View
                                    </Button>
                                </ChakraLink>
                            </HStack>
                        </VStack>
                    </Box>
                ))}
            </VStack>
        );
    }

    return (
        <Box width="100%" overflowX="auto">
            <Table variant="simple" size={tableSize} width="100%">
                <Thead>
                    <Tr>
                        <Th>Name</Th>
                        <Th>Email</Th>
                        <Th>Phone</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {filteredCustomers.map((customer, index) => (
                        <Tr key={index}>
                            <Td>{customer.name}</Td>
                            <Td>{customer.email}</Td>
                            <Td>{customer.phone}</Td>
                            <Td>
                                <Flex gap={2}>
                                    <Button
                                        size={buttonSize}
                                        colorScheme="blue"
                                        isDisabled={!customer.db_id || !canEditOrDelete}
                                        onClick={() => handleEdit(customer)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size={buttonSize}
                                        colorScheme="red"
                                        isDisabled={!customer.db_id || !canEditOrDelete}
                                        onClick={() => handleDelete(customer)}
                                    >
                                        Delete
                                    </Button>
                                    <ChakraLink
                                        as={RouterLink}
                                        to={`/customer/${customer.db_id}`}
                                    >
                                        <Button
                                            isDisabled={!customer.db_id}
                                            size={buttonSize}
                                            colorScheme="green"
                                        >
                                            View
                                        </Button>
                                    </ChakraLink>
                                </Flex>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default HomeBody;
