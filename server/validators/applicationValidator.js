import Joi from 'joi';

const objectIdPattern = /^[a-fA-F0-9]{24}$/;

const objectIdSchema = Joi.string().pattern(objectIdPattern).messages({
    'string.pattern.base': 'must be a valid id',
});

export const APPLICATION_STATUSES = ['pending', 'interview', 'accepted', 'rejected'];

const applicationFields = {
    jobId: objectIdSchema,
    applicantId: objectIdSchema,
    skills: Joi.array().items(Joi.string().trim().min(1).max(100)).max(50),
    additionalAnswers: Joi.array().items(Joi.string().trim().min(1).max(2000)).max(10),
    date: Joi.date().iso(),
    submittedAt: Joi.date().iso(),
    createdAt: Joi.date().iso(),
};

const applicationStatusSchema = Joi.string().valid(...APPLICATION_STATUSES);

export const createApplicationSchema = Joi.object({
    ...applicationFields,
    jobId: applicationFields.jobId.required(),
    applicantId: applicationFields.applicantId.required(),
}).unknown(false);

export const updateApplicationSchema = Joi.object({
    skills: applicationFields.skills,
    additionalAnswers: applicationFields.additionalAnswers,
    date: applicationFields.date,
    submittedAt: applicationFields.submittedAt,
    createdAt: applicationFields.createdAt,
    status: applicationStatusSchema,
})
    .or('skills', 'additionalAnswers', 'date', 'submittedAt', 'createdAt', 'status')
    .unknown(false);

export const applicationIdParamSchema = Joi.object({
    id: objectIdSchema.required(),
});

