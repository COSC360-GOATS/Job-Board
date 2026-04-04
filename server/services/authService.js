import bcrypt from 'bcryptjs';
import process from 'process';

export default function authService(db) {
    const applicants = db.collection('applicants');
    const employers = db.collection('employers');

    return {
        async login({ email, password }) {
            // Check admin credentials from env vars
            if (
                email === process.env.ADMIN_EMAIL &&
                password === process.env.ADMIN_PASSWORD
            ) {
                return { user: { id: 'admin', name: 'Admin', email }, role: 'admin' };
            }

            // Check applicants collection
            const applicant = await applicants.findOne({ email });
            if (applicant) {
                const match = await bcrypt.compare(password, applicant.password);
                if (!match) throw new Error('Invalid email or password');
                return {
                    user: {
                        id: applicant._id,
                        name: `${applicant.firstName} ${applicant.lastName}`.trim() || applicant.name || email,
                        email: applicant.email,
                    },
                    role: 'applicant',
                };
            }

            // Check employers collection
            const employer = await employers.findOne({ email });
            if (employer) {
                const match = await bcrypt.compare(password, employer.password);
                if (!match) throw new Error('Invalid email or password');
                return {
                    user: {
                        id: employer._id,
                        name: employer.companyName || employer.name || email,
                        email: employer.email,
                    },
                    role: 'employer',
                };
            }

            throw new Error('Invalid email or password');
        },
    };
}
