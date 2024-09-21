import {
    Button,
    Box,
    Flex,
    Heading,
    useColorModeValue,
    VStack,
    Text,
    Input,
    FormControl,
    FormLabel,
    Link,
    useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from '../firebase.js';
import { Wifi } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // For navigation

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSending, setIsSending] = useState(false);
    const toast = useToast();
    const auth = getAuth();
    const navigate = useNavigate(); // Initialize navigation

    const handlePasswordReset = async (e) => {
        e.preventDefault();

        if (!email) {
            toast({
                status: 'warning',
                position: 'bottom',
                title: 'Missing Email',
                description: 'Please enter your email to reset the password.',
            });
            return;
        }

        try {
            setIsSending(true);
            await sendPasswordResetEmail(auth, email);
            toast({
                status: 'success',
                position: 'bottom',
                duration: 3000,
                title: 'Email Sent',
                description: 'Password reset email sent. Please check your inbox.',
            });
        } catch (error) {
            console.error('Error sending password reset email:', error);
            toast({
                status: 'error',
                position: 'bottom',
                description: 'Failed to send password reset email. Please try again.',
            });
        } finally {
            setIsSending(false);
        }
    };

    const bgGradient = useColorModeValue(
        'linear(to-r, teal.400, blue.600)',
        'linear(to-r, teal.600, blue.800)'
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
            p={4}
        >
            <Box
                width={{ base: '90%', sm: '450px', md: '600px', lg: '700px' }}
                maxWidth="90%"
                bg={cardBg}
                boxShadow="xl"
                borderRadius="xl"
                p={8}
                mx="auto"
            >
                <VStack spacing={6} align="stretch">
                    <Flex justifyContent="center">
                        <Wifi size={48} color="#3182CE" />
                    </Flex>
                    <Heading size="lg" textAlign="center" color={headingColor}>
                        Forgot Password
                    </Heading>
                    <Text color={textColor} textAlign="center">
                        Enter your email address, and we’ll send you instructions to reset your password.
                    </Text>

                    <form onSubmit={handlePasswordReset}>
                        <VStack spacing={4}>
                            <FormControl>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    focusBorderColor="blue.500"
                                    placeholder="Enter your email"
                                />
                            </FormControl>

                            <Button
                                type="submit"
                                width="full"
                                colorScheme="blue"
                                isLoading={isSending}
                                loadingText="Sending..."
                                size="lg"
                            >
                                Reset Password
                            </Button>
                        </VStack>
                    </form>

                    {/* Back to Sign In link */}
                    <Flex justifyContent="center">
                        <Text color={textColor}>
                            Remember your password?{' '}
                            <Link
                                color="blue.500"
                                fontWeight="bold"
                                onClick={() => navigate('/signin')} // Use navigate to redirect
                            >
                                Back to Sign In
                            </Link>
                        </Text>
                    </Flex>
                </VStack>
            </Box>
        </Flex>
    );
};

export default ForgotPassword;
