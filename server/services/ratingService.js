import createService from "./service.js";

export default function ratingService(db) {
    return createService(db.collection('ratings'));
}