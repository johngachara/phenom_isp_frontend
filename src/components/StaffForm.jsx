// StaffForm Component
import {
    Button,
    Checkbox,
    FormControl,
    FormErrorMessage,
    FormLabel,
    IconButton,
    Input,
    InputGroup,
    InputRightElement, ModalFooter,
    VStack
} from "@chakra-ui/react";
import {useState} from "react";
import {  ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
const StaffForm = ({ staff, onSubmit, onClose,creatingLoading,updatingLoading }) => {
    const initialFormData = {
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        is_superuser: false,
        is_staff: true,
        password: '',
        confirmPassword: '',
    };

    const [formData, setFormData] = useState(staff || initialFormData);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!staff && formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long';
        if (!staff && formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const { confirmPassword, ...submissionData } = formData;
            onSubmit(submissionData);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
                <FormControl isInvalid={errors.username}>
                    <FormLabel>Username</FormLabel>
                    <Input name="username" value={formData.username} onChange={handleChange} required />
                    <FormErrorMessage>{errors.username}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input name="email" type="email" value={formData.email} isReadOnly={staff} onChange={handleChange} required />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
                <FormControl>
                    <FormLabel>First Name</FormLabel>
                    <Input name="first_name" value={formData.first_name} onChange={handleChange} />
                </FormControl>
                <FormControl>
                    <FormLabel>Last Name</FormLabel>
                    <Input name="last_name" value={formData.last_name} onChange={handleChange} />
                </FormControl>
                {!staff && (
                    <>
                        <FormControl isInvalid={errors.password}>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <InputRightElement>
                                    <IconButton
                                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                        onClick={() => setShowPassword(!showPassword)}
                                        variant="ghost"
                                    />
                                </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>{errors.password}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={errors.confirmPassword}>
                            <FormLabel>Confirm Password</FormLabel>
                            <InputGroup>
                                <Input
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <InputRightElement>
                                    <IconButton
                                        icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        variant="ghost"
                                    />
                                </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                        </FormControl>
                    </>
                )}
                <FormControl>
                    <Checkbox name="is_superuser" isChecked={formData.is_superuser} onChange={handleChange}>
                        Is Superuser
                    </Checkbox>
                </FormControl>
            </VStack>
            <ModalFooter>
                <Button isLoading={staff ? updatingLoading : creatingLoading} loadingText={staff ? "Updating" : "Creating"} colorScheme="blue" mr={3} type="submit">
                    {staff ? 'Update' : 'Add'}
                </Button>
                <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
        </form>
    );
};
export default StaffForm