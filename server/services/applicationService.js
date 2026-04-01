import createService from './service.js';

export default function applicationService(db) {
    return createService(db.collection('applications'));
}