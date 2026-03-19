import createService from './service.js';

export default function applicantService(db) {
    return createService(db.collection('applicants'));
}