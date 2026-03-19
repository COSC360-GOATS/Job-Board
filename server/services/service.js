export default function createService(data) {
    return {
        getAll() {
            return data;
        },

        getById(id) {
            const target = parseInt(id);
            return data.find(x => x.id === target);
        },

        create(payload) {
            const lastId = data.length > 0 ? data[data.length - 1].id : 0;
            const newItem = {
                id: lastId + 1,
                ...payload
            };

            data.push(newItem);
            return newItem;
        },

        update(id, payload) {
            const target = parseInt(id);
            const index = data.findIndex(x => x.id === target);

            if (index === -1) return null;
            
            data[index] = { ...data[index], ...payload, id: target };

            return data[index];
        },

        remove(id) {
            const target = parseInt(id);
            const index = data.findIndex(x => x.id === target);

            if (index === -1) return null;

            const removed = data[index];
            data.splice(index, 1);

            return removed;
        }
    }
}