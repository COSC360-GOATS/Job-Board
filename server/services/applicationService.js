import data from '../data/applications.json' with { type: 'json' };

export const getApplicationService = () => data;

export const getApplicationByIdService = (id) => data.find(a => a.id === parseInt(id));

export const createApplicationService = (application) => {
    const newApplication = {
        id: data.length + 1,
        ...application
    };
    data.push(newApplication);
    return newApplication;
}

export const updateApplicationService = (id, application) => {
    const index = data.findIndex(a => a.id === parseInt(id));
    if (index === -1) return null;
    data[index] = { id: parseInt(id), ...application };
    return data[index];
}

export const deleteApplicationService = (id) => {
    const index = data.findIndex(a => a.id === parseInt(id));
    if (index === -1) return false;
    data.splice(index, 1);
    return true;
}