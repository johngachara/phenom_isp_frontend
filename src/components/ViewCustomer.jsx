import React, { useEffect, useState } from 'react';
import {
    Box,
    VStack,
    Text,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Skeleton,
    useToast,
    Card,
    CardHeader,
    CardBody,
    SimpleGrid,
    Badge,
    useBreakpointValue,
    Stack
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import apiService from "../apiService.js";
import SideBar from "./SideBar.jsx";

const ViewCustomer = () => {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    const isMobile = useBreakpointValue({ base: true, md: false });
    const gridColumns = useBreakpointValue({ base: 1, sm: 2, md: 3 });

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const { data } = await apiService.getCustomer(id);
                setCustomer(data);
            } catch (err) {
                toast({
                    title: 'Error fetching customer data',
                    description: err.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();
    }, [id, toast]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const CustomerInfoCard = ({ title, value }) => (
        <Card>
            <CardHeader>
                <Heading size="sm">{title}</Heading>
            </CardHeader>
            <CardBody>
                <Text fontSize="lg">{value}</Text>
            </CardBody>
        </Card>
    );

    const SkeletonCard = () => (
        <Card>
            <CardHeader>
                <Skeleton height="20px" width="50%" />
            </CardHeader>
            <CardBody>
                <Skeleton height="24px" />
            </CardBody>
        </Card>
    );

    const SubscriptionCard = ({ sub }) => (
        <Card>
            <CardBody>
                <Stack spacing={2}>
                    <Text><strong>Router IP:</strong> {sub.router_ip_address}</Text>
                    <Text><strong>Bandwidth:</strong> {sub.bandwidth}</Text>
                    <Text><strong>Amount:</strong> {sub.subscription_amount}</Text>
                    <Text>
                        <strong>Status:</strong>{' '}
                        <Badge colorScheme={sub.is_active ? "green" : "red"}>
                            {sub.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                    </Text>
                    <Text><strong>Start Date:</strong> {formatDate(sub.start_date)}</Text>
                    <Text><strong>End Date:</strong> {formatDate(sub.end_date)}</Text>
                    <Text><strong>Last Payment:</strong> {formatDate(sub.last_payment_date)}</Text>
                </Stack>
            </CardBody>
        </Card>
    );

    return (
        <Box minH="100vh" bg="gray.50">
            <SideBar />
            <Box
                ml={{ base: 0, md: 64 }}
                transition=".3s ease"
                p={{ base: 4, md: 8 }}
                pt={{ base: 20, md: 8 }}
                w={{ base: "100%", md: "calc(100% - 256px)" }}
            >
                <VStack spacing={6} align="stretch">
                    <Heading size="lg">Customer Details</Heading>

                    <SimpleGrid columns={gridColumns} spacing={4}>
                        {loading ? (
                            <>
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                            </>
                        ) : (
                            <>
                                <CustomerInfoCard title="Name" value={customer.name} />
                                <CustomerInfoCard title="Phone" value={customer.phone} />
                                <CustomerInfoCard title="Email" value={customer.email} />
                                <CustomerInfoCard title="Balance" value={customer.balance} />
                                <CustomerInfoCard title="Last Updated" value={formatDate(customer.last_updated)} />
                            </>
                        )}
                    </SimpleGrid>

                    <Box>
                        <Heading size="md" mb={4}>Subscriptions</Heading>
                        {isMobile ? (
                            <Stack spacing={4}>
                                {loading ? (
                                    <SkeletonCard />
                                ) : (
                                    customer.subscriptions.map((sub, index) => (
                                        <SubscriptionCard key={index} sub={sub} />
                                    ))
                                )}
                            </Stack>
                        ) : (
                            <Box overflowX="auto">
                                <Table variant="simple" size="sm">
                                    <Thead>
                                        <Tr>
                                            <Th>Router IP</Th>
                                            <Th>Bandwidth</Th>
                                            <Th>Amount</Th>
                                            <Th>Status</Th>
                                            <Th>Start Date</Th>
                                            <Th>End Date</Th>
                                            <Th>Last Payment</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {loading ? (
                                            <Tr>
                                                <Td colSpan={7}><Skeleton height="40px" /></Td>
                                            </Tr>
                                        ) : (
                                            customer.subscriptions.map((sub, index) => (
                                                <Tr key={index}>
                                                    <Td>{sub.router_ip_address}</Td>
                                                    <Td>{sub.bandwidth}</Td>
                                                    <Td>{sub.subscription_amount}</Td>
                                                    <Td>
                                                        <Badge colorScheme={sub.is_active ? "green" : "red"}>
                                                            {sub.is_active ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </Td>
                                                    <Td>{formatDate(sub.start_date)}</Td>
                                                    <Td>{formatDate(sub.end_date)}</Td>
                                                    <Td>{formatDate(sub.last_payment_date)}</Td>
                                                </Tr>
                                            ))
                                        )}
                                    </Tbody>
                                </Table>
                            </Box>
                        )}
                    </Box>
                </VStack>
            </Box>
        </Box>
    );
};

export default ViewCustomer;