import {
    Button,
    Flex, Input, InputGroup,
    InputRightElement,
    Modal, ModalBody, ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    useToast,
    Box,
    Container,
    Heading, Skeleton, Stack,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from "@chakra-ui/react";
import SideBar from "./SideBar.jsx";
import {SearchIcon} from "@chakra-ui/icons";
import {useEffect, useRef, useState} from "react";
import StaffList from "./StaffList.jsx";
import StaffForm from "./StaffForm.jsx";
import apiService from "../apiService.js";
import { getFirestore, doc, setDoc, getDocs, query, where, collection, deleteDoc } from 'firebase/firestore';
import {createUserWithEmailAndPassword, firebaseConfig} from '../firebase.js';
import {useAuth} from "./auth.js";
import {useNavigate} from "react-router-dom";
import {getAuth,signOut} from "firebase/auth";
import {initializeApp} from "firebase/app";
import axios from "axios";

const StaffManagement = () => {
    const db = getFirestore();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [staff, setStaff] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const toast = useToast();
    const {userRole, loading: authLoading, error: authError, user} = useAuth();
    const navigate = useNavigate();
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingStaff, setDeletingStaff] = useState(null);
    const cancelRef = useRef();
    const [buttonStates, setButtonStates] = useState({
        creating: false,
        updating: false,
        deleting: false,
    });



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
        if (userRole !== 'admin') {
            toast({
                title: 'Access Denied',
                description: 'You do not have permission to view this page.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            navigate(-1);
            return;
        }

        fetchStaff();
    }, [authLoading, user]);
    const fetchStaff = async () => {
        setIsLoading(true);
        try {
            const response = await apiService.getStaff();
            if (response.status === 200) {
                setStaff(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            toast({
                title: 'Error fetching staff',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Initialize a temporary Firebase app for user creation
    const tempApp = initializeApp(firebaseConfig, 'tempApp');
    const tempAuth = getAuth(tempApp);

    const handleAddStaff = async (staffData) => {
        try {
            setButtonStates((prevState)=>({...prevState,creating: true}))
            // Create the user in Firebase Authentication using the temporary auth instance
            const userCredential = await createUserWithEmailAndPassword(tempAuth, staffData.email, staffData.password);
            const firebaseUid = userCredential.user.uid;
            const idToken = await userCredential.user.getIdToken(); // Obtain the ID token
            const role = staffData.is_superuser ? 'admin' : 'user';

            // Add the user to Firestore, including the ID token
            await setDoc(doc(db, 'users', firebaseUid), {
                username: staffData.username,
                email: staffData.email,
                first_name: staffData.first_name,
                last_name: staffData.last_name,
                role: role,
                idToken: idToken, // Store the ID token
            });

            // Sign out the newly created user from the temporary auth instance
            await signOut(tempAuth);

            // Proceed with the API call
            const response = await apiService.addStaff(staffData);
            if (response.status !== 201) {
                throw new Error(response.message || "Unable to add staff");
            }

            toast({
                title: 'Staff added successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            onClose();
            await fetchStaff();
        } catch (error) {
            toast({
                title: 'Error adding staff',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }finally {
            setButtonStates((prevState)=>({...prevState,creating: false}))
        }
    };


    const handleUpdateStaff = async (staffData) => {
        try {
            setButtonStates((prevState)=>({...prevState,updating: true}))
            const staffDoc = await getDocs(query(collection(db, "users"), where("email", "==", staffData.email)));
            let firebaseUid = null;
            let idToken = null;
            staffDoc.forEach(doc => {
                firebaseUid = doc.id;
                idToken = doc.data().idToken; // Retrieve the existing ID token
            });

            if (!firebaseUid) {
                throw new Error('Staff member not found in Firestore');
            }

            const role = staffData.is_superuser ? 'admin' : 'user';
            await setDoc(doc(db, 'users', firebaseUid), {
                username: staffData.username,
                email: staffData.email,
                first_name: staffData.first_name,
                last_name: staffData.last_name,
                role: role,
                idToken: idToken, // Store the existing ID token back
            }, { merge: true });

            // Proceed with the API call
            const response = await apiService.updateStaff(selectedStaff.id, staffData);
            if (response.status !== 200) {
                throw new Error(response.message || "Unable to update staff");
            }

            toast({
                title: 'Staff updated successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            onClose();
            await fetchStaff();
        } catch (error) {
            toast({
                title: 'Error updating staff',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }finally {
            setButtonStates((prevState)=>({...prevState,updating: false}))
        }
    };


    const handleDeleteStaff = (staff) => {
        setDeletingStaff(staff);
        setDeleteDialogOpen(true);
    };

    const FIREBASE_AUTH_API_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:delete';
    const FIREBASE_API_KEY = import.meta.env.VITE_API_KEY

    const confirmDeleteStaff = async () => {
        if (!deletingStaff) return;

        try {
            setButtonStates((prevState)=>({...prevState,deleting: true}))
            // Step 1: Obtain the ID token of the user being deleted
            const userDoc = await getDocs(query(collection(db, "users"), where("email", "==", deletingStaff.email)));
            let firebaseUid = null;
            let idToken = null;
            userDoc.forEach(doc => {
                firebaseUid = doc.id;
                idToken = doc.data().idToken; // Retrieve the stored ID token
            });

            if (!firebaseUid || !idToken) {
                throw new Error('Staff member not found in Firestore or ID token is missing');
            }

            // Step 2: Delete the user from Firebase Authentication using the REST API
            try {
                const response = await axios.post(FIREBASE_AUTH_API_URL, {
                    idToken: idToken,
                }, {
                    params: {
                        key: FIREBASE_API_KEY,
                    },
                });
                if (response.data.kind === 'identitytoolkit#DeleteAccountResponse') {
                    console.log('User deleted from Firebase Auth');
                }
            } catch (authError) {
                console.error("Error deleting user from Firebase Auth:", authError);
                // Continue with the process even if Auth deletion fails
            }

            // Step 3: Delete the user document from Firestore
            await deleteDoc(doc(db, "users", firebaseUid));

            // Step 4: Delete the staff member from your backend API
            const { status } = await apiService.deleteStaff(deletingStaff.id);
            if (status === 204) {
                toast({
                    title: 'Staff deleted successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                await fetchStaff();
            } else {
                throw new Error("Unable to delete staff member");
            }
        } catch (error) {
            toast({
                title: 'Error deleting staff',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setDeleteDialogOpen(false);
            setDeletingStaff(null);
            setButtonStates((prevState)=>({...prevState,deleting: false}))
        }
    };

    const handleEdit = (staff) => {
        setSelectedStaff(staff);
        onOpen();
    };

    const handleModalClose = () => {
        setSelectedStaff(null);
        onClose();
    };

    const filteredStaff = staff.filter(member =>
        member.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const SkeletonLoader = () => (
        <Stack>
            {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} height="60px" />
            ))}
        </Stack>
    );

    return (
        <Flex minHeight="100vh">
            <SideBar />
            <Box flex="1" p={5} ml={{ base: 0, md: 64 }}>
                <Container maxW="container.xl">
                    <Heading mb={5}>Staff Management</Heading>
                    <Flex justifyContent="space-between" mb={5} flexWrap="wrap">
                        <Button colorScheme="green" onClick={onOpen} mb={{ base: 2, md: 0 }}>
                            Add New Staff
                        </Button>
                        <InputGroup maxW="300px">
                            <Input
                                placeholder="Search staff..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <InputRightElement>
                                <SearchIcon color="gray.300" />
                            </InputRightElement>
                        </InputGroup>
                    </Flex>
                    <Box>
                        {isLoading || authLoading ? (
                            <SkeletonLoader />
                        ) : (
                            <StaffList staff={filteredStaff} onEdit={handleEdit} isLoading={isLoading} onDelete={handleDeleteStaff} />
                        )}
                    </Box>
                </Container>
                <Modal isOpen={isOpen} onClose={handleModalClose} size="xl">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>{selectedStaff ? 'Edit Staff' : 'Add New Staff'}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <StaffForm
                                staff={selectedStaff}
                                onSubmit={selectedStaff ? handleUpdateStaff : handleAddStaff}
                                onClose={handleModalClose}
                                creatingLoading={buttonStates.creating}
                                updatingLoading={buttonStates.updating}
                            />
                        </ModalBody>
                    </ModalContent>
                </Modal>
                <AlertDialog
                    isOpen={isDeleteDialogOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={() => setDeleteDialogOpen(false)}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                Delete Staff
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                Are you sure you want to delete this staff member? This action cannot be undone.
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={() => setDeleteDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button isLoading={buttonStates.deleting} loadingText="Deleting" colorScheme="red" onClick={confirmDeleteStaff} ml={3}>
                                    Delete
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </Box>
        </Flex>
    );
};

export default StaffManagement;