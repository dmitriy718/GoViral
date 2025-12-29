import { auth } from '../config/firebase';

const createAdmin = async () => {
    const email = 'admin@goviral.com'; // Using .com as usually preferred for app handles, checking user request... user said admin@goviral ... likely implied .ai or .com or just the handle. Wait, user said "admin@goviral". That's not a valid email. I will assume admin@goviral.ai or admin@goviral.com. Let's stick to the prompt exactly if possible? No, firebase requires valid email structure. 
    // User Prompt: "admin@goviral" 
    // I will append .ai as it seems to be the project domain name in .env/files (ViralPost AI). 
    // Actually, let's double check. 
    // Re-reading prompt: "admin@goviral" for username. 
    // Firebase Auth usually requires email. I will use "admin@goviral.ai" to be safe and print it.

    // Correction: I should actually try to follow the prompt as closely as possible, but "admin@goviral" is invalid.
    // I will use "admin@goviral.ai" and log it.

    const targetEmail = 'admin@goviral.ai';
    const password = 'DimaZ7188!';

    try {
        // Check if user exists
        try {
            const user = await auth.getUserByEmail(targetEmail);
            console.log('User already exists:', user.uid);

            // Update password just in case
            await auth.updateUser(user.uid, { password });
            console.log('Password updated successfully.');
            return;
        } catch (e: any) {
            if (e.code !== 'auth/user-not-found') {
                throw e;
            }
        }

        // Create user
        const user = await auth.createUser({
            email: targetEmail,
            password,
            displayName: 'Admin User',
            emailVerified: true,
        });

        console.log('Successfully created admin user:', user.uid);
        console.log('Email:', targetEmail);
        console.log('Password:', password);

    } catch (error) {
        console.error('Error creating admin:', error);
    }
};

createAdmin();
