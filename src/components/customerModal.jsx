import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    NumberInput,
    NumberInputField,
    useToast,
} from '@chakra-ui/react';

const CustomerModal = ({ isOpen, onClose, customer, onSubmit,createLoading,updateLoading }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        balance: 0,
        router_ip_address: '192.168.88.1',
        bandwidth: '',
        subscription_amount: '',
        start_date: '',
        last_payment_date: '',
    });
    const [errors, setErrors] = useState({});
    const toast = useToast();
    useEffect(() => {
        if (customer) {
            setFormData({
                name: customer.name || '',
                phone: customer.phone || '',
                email: customer.email || '',
                balance: customer.balance || 0,
                router_ip_address: customer.router_ip_address || '192.168.88.1',
                bandwidth: customer.subscriptions[0]?.bandwidth || '',
                subscription_amount: customer.subscriptions[0]?.subscription_amount || '',
                start_date: customer.subscriptions[0]?.start_date || '',
                last_payment_date: formatDate(customer.subscriptions[0]?.last_payment_date),
            });
        } else {
            setFormData({
                name: '',
                phone: '',
                email: '',
                balance: 0,
                router_ip_address: '192.168.88.1',
                bandwidth: '',
                subscription_amount: '',
                start_date: '',
                last_payment_date: '',
            });
        }
    }, [customer]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleNumberChange = (name, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        let newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        // Phone validation
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone is required";
        } else if (!/^\d{10,}$/.test(formData.phone)) {
            newErrors.phone = "Phone number should be at least 10 digits";
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        // Balance validation
        if (isNaN(parseFloat(formData.balance))) {
            newErrors.balance = "Balance must be a number";
        }

        // Router IP Address validation
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (!ipRegex.test(formData.router_ip_address)) {
            newErrors.router_ip_address = "Invalid IP address";
        }

        // Bandwidth validation
        if (!formData.bandwidth.trim()) {
            newErrors.bandwidth = "Bandwidth is required";
        } else if (isNaN(parseInt(formData.bandwidth))) {
            newErrors.bandwidth = "Bandwidth must be a number";
        }

        // Subscription amount validation
        if (!formData.subscription_amount.trim()) {
            newErrors.subscription_amount = "Subscription amount is required";
        } else if (isNaN(parseFloat(formData.subscription_amount))) {
            newErrors.subscription_amount = "Subscription amount must be a number";
        }

        // Start date validation
        if (!formData.start_date) {
            newErrors.start_date = "Start date is required";
        }

        // Last payment date validation
        if (formData.last_payment_date && new Date(formData.last_payment_date) > new Date()) {
            newErrors.last_payment_date = "Last payment date cannot be in the future";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData, customer);
        } else {
            toast({
                title: "Validation Error",
                description: "Please check the form for errors",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{customer ? 'Edit Customer' : 'Add Customer'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4}>
                            <FormControl isRequired isInvalid={errors.name}>
                                <FormLabel>Name</FormLabel>
                                <Input name="name" value={formData.name} onChange={handleChange} />
                                {errors.name && <p style={{color: 'red'}}>{errors.name}</p>}
                            </FormControl>
                            <FormControl isRequired isInvalid={errors.phone}>
                                <FormLabel>Phone</FormLabel>
                                <Input name="phone" value={formData.phone} onChange={handleChange} />
                                {errors.phone && <p style={{color: 'red'}}>{errors.phone}</p>}
                            </FormControl>
                            <FormControl isRequired isInvalid={errors.email}>
                                <FormLabel>Email</FormLabel>
                                <Input name="email" type="email" value={formData.email} onChange={handleChange} />
                                {errors.email && <p style={{color: 'red'}}>{errors.email}</p>}
                            </FormControl>
                            <FormControl isInvalid={errors.balance}>
                                <FormLabel>Balance</FormLabel>
                                <NumberInput
                                    name="balance"
                                    value={formData.balance}
                                    onChange={(value) => handleNumberChange('balance', value)}
                                    precision={2}
                                >
                                    <NumberInputField />
                                </NumberInput>
                                {errors.balance && <p style={{color: 'red'}}>{errors.balance}</p>}
                            </FormControl>
                            <FormControl isRequired isInvalid={errors.router_ip_address}>
                                <FormLabel>Router IP Address</FormLabel>
                                <Input
                                    name="router_ip_address"
                                    value={formData.router_ip_address}
                                    onChange={handleChange}
                                    placeholder="192.168.88.1"
                                />
                                {errors.router_ip_address && <p style={{color: 'red'}}>{errors.router_ip_address}</p>}
                            </FormControl>
                            <FormControl isRequired isInvalid={errors.bandwidth}>
                                <FormLabel>Bandwidth (MBPS)</FormLabel>
                                <NumberInput
                                    name="bandwidth"
                                    value={formData.bandwidth}
                                    onChange={(value) => handleNumberChange('bandwidth', value)}
                                    min={1}
                                >
                                    <NumberInputField placeholder="MBPS" />
                                </NumberInput>
                                {errors.bandwidth && <p style={{color: 'red'}}>{errors.bandwidth}</p>}
                            </FormControl>
                            <FormControl isRequired isInvalid={errors.subscription_amount}>
                                <FormLabel>Subscription Amount</FormLabel>
                                <NumberInput
                                    name="subscription_amount"
                                    value={formData.subscription_amount}
                                    onChange={(value) => handleNumberChange('subscription_amount', value)}
                                    precision={2}
                                >
                                    <NumberInputField />
                                </NumberInput>
                                {errors.subscription_amount && <p style={{color: 'red'}}>{errors.subscription_amount}</p>}
                            </FormControl>
                            <FormControl isRequired isInvalid={errors.start_date}>
                                <FormLabel>Start Date</FormLabel>
                                <Input
                                    name="start_date"
                                    type="date"
                                    value={formData.start_date}
                                    onChange={handleChange}
                                />
                                {errors.start_date && <p style={{color: 'red'}}>{errors.start_date}</p>}
                            </FormControl>
                            <FormControl isInvalid={errors.last_payment_date}>
                                <FormLabel>Last Payment Date</FormLabel>
                                <Input
                                    name="last_payment_date"
                                    type="date"
                                    value={formData.last_payment_date}
                                    onChange={handleChange}
                                />
                                {errors.last_payment_date && <p style={{color: 'red'}}>{errors.last_payment_date}</p>}
                            </FormControl>
                        </VStack>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} isLoading={customer ? updateLoading : createLoading}  loadingText={customer ? "Updating" : "Creating"} onClick={handleSubmit}>
                        {customer ? 'Update' : 'Create'}
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CustomerModal;