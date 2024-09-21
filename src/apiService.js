import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL;
const apiService = {
    login: async (credentials) => {
        try {
            const response = await axios.post(`${API_URL}/api`, credentials);
            return {
                data: response.data,
                status: response.status,
                message: 'Login successful'
            };
        } catch (error) {
            return {
                status: error.response?.status || 500,
                message: error.response?.data?.message || 'An error occurred during login'
            };
        }
    },

    logout: async () => {
        try {
            const response = await axios.post(`${API_URL}/api/logout`);
            return {
                data: response.data,
                status: response.status,
                message: 'Logout successful'
            };
        } catch (error) {
            return {
                status: error.response?.status || 500,
                message: error.response?.data?.message || 'An error occurred during logout'
            };
        }
    },

    getCustomers: async () => {
        try {
            const response = await axios.get(`${API_URL}/api/get_customers`);
            return {
                data: response.data,
                status: response.status,
                message: 'Customers fetched successfully'
            };
        } catch (error) {
            return {
                status: error.response?.status || 500,
                message: error.response?.data?.message || 'An error occurred while fetching customers'
            };
        }
    },

    getCustomer: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/api/view_customer/${id}`);
            return {
                data: response.data,
                status: response.status,
                message: 'Customer fetched successfully'
            };
        } catch (error) {
            return {
                status: error.response?.status || 500,
                message: error.response?.data?.message || 'An error occurred while fetching the customer'
            };
        }
    },

    createCustomer: async (customerData) => {
        try {
            const response = await axios.post(`${API_URL}/api/create`, customerData);
            return {
                data: response.data,
                status: response.status,
                message: 'Customer created successfully'
            };
        } catch (error) {
            return {
                status: error.response?.status || 500,
                message: error.response?.data?.message || 'An error occurred while creating the customer'
            };
        }
    },

    updateCustomer: async (id, customerData) => {
        try {
            const response = await axios.put(`${API_URL}/api/update/${id}`, customerData);
            return {
                data: response.data,
                status: response.status,
                message: 'Customer updated successfully'
            };
        } catch (error) {
            return {
                status: error.response?.status || 500,
                message: error.response?.data?.message || 'An error occurred while updating the customer'
            };
        }
    },

    deleteCustomer: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/api/delete/${id}`);
            return {
                data: response.data,
                status: response.status,
                message: 'Customer deleted successfully'
            };
        } catch (error) {
            return {
                status: error.response?.status || 500,
                message: error.response?.data?.message || 'An error occurred while deleting the customer'
            };
        }
    },

    getStaff: async () => {
        try {
            const response = await axios.get(`${API_URL}/staff`);
            return {
                data: response.data,
                status: response.status,
                message: 'Staff fetched successfully'
            };
        } catch (error) {
            return {
                status: error.response?.status || 500,
                message: error.response?.data?.message || 'An error occurred while fetching staff'
            };
        }
    },

    deleteStaff: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/api/delete_staff/${id}`);
            return {
                status: response.status,
                message: 'Staff deleted successfully'
            };
        } catch (error) {
            return {
                status: error.response?.status || 500,
                message: error.response?.data?.message || 'An error occurred while deleting staff'
            };
        }
    },

    addStaff: async (staffData) => {
        try {
            const response = await axios.post(`${API_URL}/staff_signup`, staffData);
            return {
                data: response.data,
                status: response.status,
                message: 'Staff added successfully'
            };
        } catch (error) {
            return {
                status: error.response?.status || 500,
                message: error.response?.data?.message || `An error occurred while adding staff .Ensure username doesn't exist`
            };
        }
    },

    updateStaff: async (staffId, staffData) => {
        try {
            const response = await axios.put(`${API_URL}/update_staff/${staffId}`, staffData);
            return {
                data: response.data,
                status: response.status,
                message: 'Staff updated successfully'
            };
        } catch (error) {
            return {
                status: error.response?.status || 500,
                message: error.response?.data?.message || 'An error occurred while updating staff'
            };
        }
    },
};

export default apiService;