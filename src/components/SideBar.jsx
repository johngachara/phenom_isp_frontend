import { Box, VStack, Icon, Text, Flex, Button, Drawer, DrawerContent, DrawerOverlay, DrawerCloseButton, useDisclosure } from '@chakra-ui/react';
import { FiHome, FiUsers, FiLogOut, FiMenu,FiRefreshCw } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import apiService from "../apiService.js";
import {useAuth} from "./auth.js";
import {getAuth} from "../firebase.js";

const SidebarItem = ({ icon, children, to, onClose }) => (
    <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
            bg: 'cyan.400',
            color: 'white',
        }}
        as={Link}
        to={to}
        onClick={onClose}
    >
        <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
                color: 'white',
            }}
            as={icon}
        />
        <Text fontSize="1rem">{children}</Text>
    </Flex>
);

const SidebarContent = ({ onClose }) => {
    const { userRole } = useAuth();
    const navigate = useNavigate();
    const auth = getAuth()
    const handleLogout = async () => {
        try {
            await apiService.logout();
            await auth.signOut()
            navigate('/Signin');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const refreshPage = () => {
        window.location.reload(); // Reloads the page
    };

    return (
        <VStack align="stretch" spacing={4} mt={8}>
            <SidebarItem icon={FiHome} to="/" onClose={onClose}>
               Customers
            </SidebarItem>

            {/* Conditionally render Staff button if userRole is admin */}
            {userRole === 'admin' && (
                <SidebarItem icon={FiUsers} to="/Staff" onClose={onClose}>
                    Staff
                </SidebarItem>
            )}


            <Button
                leftIcon={<FiRefreshCw />}
                colorScheme="blue"
                variant="ghost"

                onClick={refreshPage}
            >
                Refresh
            </Button>

            <Button
                leftIcon={<FiLogOut />}
                colorScheme="red"
                variant="ghost"
                m={4}
                onClick={() => {
                    handleLogout();
                    onClose();
                }}
            >
                Logout
            </Button>
        </VStack>
    );
};

const Sidebar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();


    return (
        <>
            {/* Mobile Menu Icon */}
            <Box
                display={{ base: "flex", md: "none" }}
                alignItems="center"
                justifyContent="space-between"
                p={4}
                bg="white"
                boxShadow="md"
                position="fixed"
                top="0"
                left="0"
                w="full"
                zIndex="1"
            >
                {/* Mobile Menu Icon */}
                <Icon as={FiMenu} w={8} h={8} cursor="pointer" onClick={onOpen} />

                {/* Centered Heading */}
                <Text fontSize="lg" fontWeight="bold" textAlign="center" flex="1">
                   Phenom Ventures LTD
                </Text>
            </Box>

            {/* Sidebar for larger screens */}
            <Box
                display={{ base: "none", md: "block" }}
                bg="white"
                w="64"
                h="full"
                boxShadow="2xl"
                position="fixed"
                left="0"
                top="0"
            >
                <SidebarContent onClose={() => {}} />
            </Box>

            {/* Sidebar Drawer for mobile screens */}
            <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="full">
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default Sidebar;
