import joi from 'joi';

export default schema = joi.object({
    title: joi.string().required().min(3).max(100),
    description: joi.string().required().min(10).max(5000),
    location: joi.string().required().min(2).max(100),
    payRange: joi.object({
        low: joi.number().required().min(0),
        high: joi.number().required().min(joi.ref('low'))
    }).required(),
    skills: joi.array().items(joi.string()).required(),
    employerId: joi.string().required(),
    additionalQuestions: joi.array().items(joi.string()).max(10).required()
});