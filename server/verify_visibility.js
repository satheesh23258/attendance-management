import axios from 'axios';

const verifyFix = async () => {
    try {
        console.log('1. Attempting login as Mike Employee...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'mike@company.com',
            password: 'employee123'
        });
        
        const token = loginRes.data.token;
        console.log('✓ Login successful.');
        console.log('User ID:', loginRes.data.user.id);
        console.log('Employee ID:', loginRes.data.user.employeeId);

        console.log('\n2. Fetching my services...');
        const servicesRes = await axios.get('http://localhost:5000/api/services/my', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const services = servicesRes.data;
        console.log(`✓ Fetched ${services.length} services.`);
        
        if (services.length > 0) {
            console.log('\nServices found:');
            services.forEach(s => {
                console.log(`- ${s.title} (Status: ${s.status}, AssignedToID: ${s.assignedTo._id || s.assignedTo})`);
            });
        } else {
            console.log('✗ No services found. Visibility issue may still persist.');
        }

    } catch (error) {
        console.error('✗ Verification failed:');
        if (error.response) {
            console.error(error.response.status, error.response.data);
        } else {
            console.error(error.message);
        }
    }
};

verifyFix();
