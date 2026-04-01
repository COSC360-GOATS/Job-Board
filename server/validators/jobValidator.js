import joi from 'joi';

const jobFieldsSchema = {
    title: joi.string().min(3).max(100),
    description: joi.string().min(10).max(1500),
    location: joi.string().min(2).max(100),
    payRange: joi.object({
        low: joi.number().min(0),
        high: joi.number().min(joi.ref('low'))
    }),
    skills: joi.array().items(joi.string()),
    employerId: joi.string(),
    additionalQuestions: joi.array().items(joi.string().min(3).max(200)).max(10),
    postedAt: joi.date().iso()
};

export const createJobSchema = joi.object({
    ...jobFieldsSchema,
    title: jobFieldsSchema.title.required(),
    description: jobFieldsSchema.description.required(),
    location: jobFieldsSchema.location.required(),
    payRange: jobFieldsSchema.payRange.required(),
    skills: jobFieldsSchema.skills.required(),
    employerId: jobFieldsSchema.employerId.required(),
    additionalQuestions: jobFieldsSchema.additionalQuestions.required()
});

export const updateJobSchema = joi.object(jobFieldsSchema);