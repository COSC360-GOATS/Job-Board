export function createController(service) {
    return {
        async getAll(req, res) {
            const items = await service.getAll();
            return res.status(200).json(items);
        },

        async getById(req, res) {
            const item  = await service.getById(req.params.id);
            if (!item) return res.status(404).json({ error: "Not found" });
            return res.status(200).json(item);
        },

        async create(req, res) {
            const created = await service.create(req.body);
            return res.status(201).json(created);
        },

        async update(req, res) {
            const updated = await service.update(req.params.id, req.body);
            if (!updated) return res.status(404).json({ error: "Not found" });
            return res.status(200).json(updated);
        },

        async remove(req, res) {
            const removed = await service.remove(req.params.id);
            if (!removed) return res.status(404).json({ error: "Not found" });
            return res.status(200).json(removed);
        }
    }
}