import data from '../data/jobs.json' with { type: 'json' };
import createService from './service.js';

const service = createService(data);

export default service;