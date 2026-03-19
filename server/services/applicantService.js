import data from '../data/applicants.json' with { type: 'json' };

export const getApplicantService = () => data;

export const getApplicantByIdService = (id) => data.find(a => a.id === parseInt(id));

export const createApplicantService = (applicant) => {
    const newApplicant = {
        id: data.length + 1,
        ...applicant
    };
    data.push(newApplicant);
    return newApplicant;
}

export const updateApplicantService = (id, applicant) => {
    const index = data.findIndex(a => a.id === parseInt(id));
    if (index === -1) return null;
    data[index] = { id: parseInt(id), ...applicant };
    return data[index];
}

export const deleteApplicantService = (id) => {
    const index = data.findIndex(a => a.id === parseInt(id));
    if (index === -1) return false;
    data.splice(index, 1);
    return true;
}