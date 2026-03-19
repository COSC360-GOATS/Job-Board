import createController from './controller.js';
import service from '../services/applicantService.js';

const controller = createController(service);

export default controller;