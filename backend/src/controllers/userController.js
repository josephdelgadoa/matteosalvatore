const SupabaseService = require('../services/supabase');
const { logger } = require('../utils/logger');
const supabase = require('../config/database');

const userService = new SupabaseService('profiles');

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        // Fetch profiles
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Ideally we would fetch emails from auth.users, but we can't join that easily.
        // We will fetch list of users using Admin API to get emails.
        const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();

        if (authError) {
            logger.warn('Failed to fetch auth users list:', authError);
            // Return profiles without emails if auth fetch fails
            return res.status(200).json({
                status: 'success',
                results: profiles.length,
                data: profiles
            });
        }

        // Merge profile data with email from auth users
        const mergedUsers = profiles.map(profile => {
            const authUser = users.find(u => u.id === profile.id);
            return {
                ...profile,
                email: authUser ? authUser.email : 'N/A'
            };
        });

        res.status(200).json({
            status: 'success',
            results: mergedUsers.length,
            data: mergedUsers
        });

    } catch (error) {
        logger.error('Error fetching users:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch users',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};

// Get single user
exports.getUser = async (req, res) => {
    try {
        const { id } = req.params;

        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!profile) return res.status(404).json({ status: 'fail', message: 'User not found' });

        // Get email
        const { data: { user }, error: authError } = await supabase.auth.admin.getUserById(id);

        res.status(200).json({
            status: 'success',
            data: {
                ...profile,
                email: user ? user.email : 'N/A'
            }
        });

    } catch (error) {
        logger.error(`Error fetching user ${req.params.id}:`, error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch user',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};

// Create User
exports.createUser = async (req, res) => {
    try {
        const { email, password, first_name, last_name, role, avatar_url } = req.body;

        // 1. Create in Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { first_name, last_name }
        });

        if (authError) throw authError;

        const userId = authData.user.id;

        // 2. Create/Update Profile (Trigger might handle creation, but we update role and avatar)
        // We use upsert to be safe
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                first_name,
                last_name,
                role: role || 'customer',
                avatar_url
            })
            .select()
            .single();

        if (profileError) {
            // Rollback auth user creation if profile fails? 
            // For now just error out, it's rare.
            throw profileError;
        }

        res.status(201).json({
            status: 'success',
            data: {
                ...profile,
                email
            }
        });

    } catch (error) {
        logger.error('Error creating user:', error);
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Update User
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password, first_name, last_name, role, avatar_url } = req.body;

        // 1. Update Auth (Email, Password)
        const authUpdates = {};
        if (email) authUpdates.email = email;
        if (password) authUpdates.password = password;
        if (first_name || last_name) {
            authUpdates.user_metadata = { first_name, last_name };
        }

        if (Object.keys(authUpdates).length > 0) {
            const { error: authError } = await supabase.auth.admin.updateUserById(id, authUpdates);
            if (authError) throw authError;
        }

        // 2. Update Profile
        const profileUpdates = {};
        if (first_name) profileUpdates.first_name = first_name;
        if (last_name) profileUpdates.last_name = last_name;
        if (role) profileUpdates.role = role;
        if (avatar_url !== undefined) profileUpdates.avatar_url = avatar_url;

        if (Object.keys(profileUpdates).length > 0) {
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .update(profileUpdates)
                .eq('id', id)
                .select()
                .single();

            if (profileError) throw profileError;

            res.status(200).json({
                status: 'success',
                data: profile
            });
        } else {
            res.status(200).json({ status: 'success', message: 'No profile changes' });
        }

    } catch (error) {
        logger.error('Error updating user:', error);
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete from Auth (Cascade deletes profile usually)
        const { error } = await supabase.auth.admin.deleteUser(id);
        if (error) throw error;

        res.status(204).json({
            status: 'success',
            data: null
        });

    } catch (error) {
        logger.error('Error deleting user:', error);
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};
