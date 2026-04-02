import createController from "./controller.js";

export default function employerController(service) {
    const baseController = createController(service);
    
    return {
        ...baseController,
        
        async create(req, res) {
            try {
                const { username, password, email } = req.body;
                
                if (!username || !password) {
                    return res.status(400).json({ error: "Username and password are required" });
                }
                
                if (password.length < 6) {
                    return res.status(400).json({ error: "Password must be at least 6 characters long" });
                }
                
                const existingUser = await service.getByUsername?.(username);
                if (existingUser) {
                    return res.status(409).json({ error: "Username already exists" });
                }
                
                if (email) {
                    const existingEmail = await service.getByEmail?.(email);
                    if (existingEmail) {
                        return res.status(409).json({ error: "Email already registered" });
                    }
                }
                
                const created = await service.create(req.body);
                return res.status(201).json(created);
            } catch (err) {
                console.error('Create error:', err);
                return res.status(500).json({ error: "Failed to create employer" });
            }
        }
    };
}