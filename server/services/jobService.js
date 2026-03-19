import createService from './service.js';

export default function jobService(db) {
    return createService(db.collection('jobs'));
}