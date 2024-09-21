import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Box, Heading, Button, useDisclosure, Flex, useToast, Skeleton,
    useBreakpointValue,InputGroup, InputLeftElement, Input, AlertDialog, AlertDialogOverlay,
    AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter
} from '@chakra-ui/react';
import {  FiSearch } from 'react-icons/fi';
import apiService from "../apiService.js";
import CustomerModal from "./customerModal.jsx";
import Sidebar from "./SideBar.jsx";
import { Link as ChakraLink } from '@chakra-ui/react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import HomeBody from "./HomeBody.jsx";
import {useAuth} from "./auth.js";

const Home = () => {
    const [customers, setCustomers] = useState([]);
    const { user, loading: authLoading, error: authError, userRole } = useAuth();
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate()
    const [buttonStates, setButtonStates] = useState({
        creating: false,
        updating: false,
        deleting: false,
    });



    const fetchCustomers = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const { data } = await apiService.getCustomers();
            setCustomers(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch customers',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    }, [user, toast]);

    useEffect(() => {
        if (authLoading) {
            return; // Do nothing while loading
        }
        //incase of authentication error
        if (authError) {
            toast({
                title: 'Authentication Error',
                description: authError.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            navigate('/Signin');
            return;
        }
        // incase user is not found
        if (!user) {
            navigate('/Signin');
            toast({
                title: 'User not logged in',
                description:'Login to access this page',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            return;
        }
        // incase user doesnt have necessary permissions
        if (userRole !== 'admin' && userRole !== 'user') {
            toast({
                title: 'Access Denied',
                description: 'You do not have permission to view this page.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            navigate('/Signin');
            return;
        }

        fetchCustomers();
    }, [authLoading, user, fetchCustomers]);

    const handleEdit = useCallback((customer) => {
        setSelectedCustomer(customer);
        onOpen();
    }, [onOpen]);

    const handleDeleteClick = useCallback((customer) => {
        setCustomerToDelete(customer);
        setIsDeleteDialogOpen(true);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        if (customerToDelete) {
            try {
                setButtonStates(prevState => ({ ...prevState, deleting: true }));
                await apiService.deleteCustomer(customerToDelete.db_id);
                toast({
                    title: 'Success',
                    description: 'Customer deleted successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                setIsDeleteDialogOpen(false);
                await fetchCustomers();
            } catch (error) {
                console.error('Error deleting customer:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to delete customer',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            } finally {
                setCustomerToDelete(null);
                setButtonStates(prevState => ({ ...prevState, deleting: false }));
            }
        }
    }, [customerToDelete, fetchCustomers, toast]);

    const handleCustomerSubmit = useCallback(async (customerData, isEdit) => {
        try {
            const formattedData = {
                ...customerData,
                balance: parseFloat(customerData.balance),
                bandwidth: parseInt(customerData.bandwidth, 10),
                subscription_amount: parseFloat(customerData.subscription_amount),
            };

            if (isEdit) {
                setButtonStates(prevState => ({ ...prevState, updating: true }));
                const response = await apiService.updateCustomer(selectedCustomer.db_id, formattedData);
                if(response.status !== 200) {
                    throw new Error(response.message || "Unable to update customer");
                }
            } else {
                setButtonStates(prevState => ({ ...prevState, creating: true }));
                const response = await apiService.createCustomer(formattedData);
                if(response.status !== 201){
                    throw new Error(response.message);
                }
            }

            toast({
                title: 'Success',
                description: `Customer ${isEdit ? 'updated' : 'created'} successfully`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            onClose();
            await fetchCustomers();
        } catch (error) {
            console.error(`Error ${isEdit ? 'updating' : 'creating'} customer:`, error);
            toast({
                title: 'Error',
                description: `Failed to ${isEdit ? 'update' : 'create'} customer`,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setButtonStates(prevState => ({ ...prevState, creating: false, updating: false }));
        }
    }, [selectedCustomer, onClose, fetchCustomers, toast]);

    const filteredCustomers = useMemo(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return customers.filter(customer =>
            customer.name.toLowerCase().includes(lowercasedSearchTerm)
        );
    }, [customers, searchTerm]);

    const tableSize = useBreakpointValue({ base: 'sm', md: 'md', lg: 'lg' });
    const cancelRef = React.useRef();

    return (
        <Box>

            <Sidebar/>

            {/* Main content area */}
            <Box
                ml={{ base: 0, md: 64 }}
                transition=".3s ease"
                height="100vh"
                display="flex"
                flexDirection="column"
                overflowX="hidden"
            >
                {/* Header */}
                <Flex
                    as="header"
                    align="center"
                    justify="space-between"
                    w="full"
                    px="4"
                    bg="white"
                    borderBottomWidth="1px"
                    borderColor="gray.200"
                    h="14"
                >
                    <Heading size="lg" display={{ base: 'none', md: 'block' }}>Customers</Heading>
                </Flex>

                {/* Main content */}
                <Box as="main" p="4" flex="1" overflowY="auto" width="100%">
                    <Flex
                        justify="space-between"
                        align={{ base: 'flex-start', md: 'center' }}
                        direction={{ base: 'column', md: 'row' }}
                        mb="8"
                        width="100%"
                    >
                        <Heading size="lg" display={{ base: 'block', md: 'none' }} mb={{ base: '4', md: '0' }}>
                            Customers
                        </Heading>
                        <Button
                            colorScheme="blue"
                            onClick={() => { setSelectedCustomer(null); onOpen(); }}
                        >
                            Add Customer
                        </Button>
                    </Flex>

                    <InputGroup mb="4" width="100%">
                        <InputLeftElement pointerEvents="none">
                            <FiSearch color="gray.300" />
                        </InputLeftElement>
                        <Input
                            type="text"
                            placeholder="Search customers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>

                    {loading || authLoading ? (
                        <Box overflowX="auto" width="100%">
                            <Skeleton height="40px" mb="4" />
                            <Skeleton height="calc(100vh - 250px)" />
                        </Box>
                    ) : (
                        <Box overflowX="auto" width="100%">
                            <HomeBody
                                tableSize={tableSize}
                                filteredCustomers={filteredCustomers}
                                handleEdit={handleEdit}
                                handleDelete={handleDeleteClick}
                                RouterLink={RouterLink}
                                ChakraLink={ChakraLink}
                            />
                        </Box>
                    )}

                    <CustomerModal
                        isOpen={isOpen}
                        onClose={onClose}
                        customer={selectedCustomer}
                        onSubmit={handleCustomerSubmit}
                        createLoading={buttonStates.creating}
                        updateLoading={buttonStates.updating}
                    />
                </Box>

                {/* Delete confirmation dialog */}
                <AlertDialog
                    isOpen={isDeleteDialogOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={() => setIsDeleteDialogOpen(false)}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                Delete Customer
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                Are you sure you want to delete this customer? This action cannot be undone.
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={() => setIsDeleteDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    colorScheme="red"
                                    onClick={handleDeleteConfirm}
                                    ml={3}
                                    isLoading={buttonStates.deleting}
                                >
                                    Delete
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </Box>
        </Box>

    );
};

export default Home;
