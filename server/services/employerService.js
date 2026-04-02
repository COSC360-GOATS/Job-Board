import createService from "./service.js";

export default function employerService(db) {
    return createService(db.collection('employers'));
}