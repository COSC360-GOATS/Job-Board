import createController from "./controller.js";

export default function applicationController(service) {
    return createController(service);
}