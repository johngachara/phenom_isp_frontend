import {
    Button,
    Box,
    Flex,
    Heading,
    Link,
    useColorModeValue,
    VStack,
    Text,
    Input,
    FormControl,
    FormLabel,
    useToast
} from '@chakra-ui/react';
import { getAuth, signInWithEmailAndPassword } from '../firebase.js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi } from 'lucide-react';
import { checkUserRole } from "./auth.js";
import { Link as RouterLink } from 'react-router-dom'; // Correct Link import

const SignIn = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [islogging, setIslogging] = useState(false);
    const toast = useToast()
    const handleEmailSignIn = async (e) => {
        e.preventDefault();
        try {
            setIslogging(true)
            const result = await signInWithEmailAndPassword(auth, email, password);
            const user = result.user;

            // Check if the user exists in Firestore and has a role assigned
            const userRole = await checkUserRole(user);
            if (userRole) {
                if (userRole === 'admin' || userRole === 'user') {
                    navigate('/');
                }
                } else {
                await auth.signOut()
                toast({
                        status:"info",
                        position:"bottom",
                        duration: 3000,
                        title:"Unauthorised",
                        description:"You are not authorised to login"
                    })
                }

        } catch (error) {
            console.error('Error signing in with email/password:', error);
            toast({
                status:"error",
                position:"bottom",
                description:"Invalid credentials"
            })
        }finally {
            setIslogging(false)
        }
    };

    const bgGradient = useColorModeValue(
        'linear(to-r, blue.400, indigo.600)',
        'linear(to-r, blue.600, indigo.800)'
    );
    const cardBg = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const headingColor = useColorModeValue('gray.800', 'white');

    return (
        <Flex
            minHeight="100vh"
            width="100vw"
            bgGradient={bgGradient}
            alignItems="center"
            justifyContent="center"
        >
            <Box
                width={{ base: "90%", sm: "450px", md: "700px", lg: "900px" }}
                maxWidth="90%"
                mx="auto"  // This centers the box horizontally
            >
                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    bg={cardBg}
                    boxShadow="xl"
                    borderRadius="xl"
                    overflow="hidden"
                >
                    <VStack
                        spacing={8}
                        p={{ base: 6, md: 8 }}
                        flex={1}
                        align="flex-start"
                        justify="center"
                    >
                        <Wifi size={48} color="#3182CE" />
                        <Heading size="xl" color={headingColor}>
                           Phenom Ventures LTD
                        </Heading>
                        <Text color={textColor}>
                            Sign in to Phenom Management System
                        </Text>
                    </VStack>
                    <VStack
                        spacing={8}
                        p={{ base: 6, md: 8 }}
                        flex={1}
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        align="stretch"
                        justify="center"
                    >
                        <form onSubmit={handleEmailSignIn}>
                            <VStack spacing={4} width="full">
                                <FormControl>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Password</FormLabel>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </FormControl>

                                <Button width="full" colorScheme="blue" isLoading={islogging} loadingText="Signing in" size="lg" type="submit">
                                    Sign in
                                </Button>
                            </VStack>
                        </form>
                        {/* Forgot Password Link */}
                        <Text color={textColor}>
                            <Link
                                as={RouterLink}
                                to="/ForgotPassword" // Correct route for Forgot Password page
                                color="blue.500"
                                fontWeight="bold"
                            >
                                Forgot Password?
                            </Link>
                        </Text>

                    </VStack>
                </Flex>
            </Box>
        </Flex>
    );
};

export default SignIn;