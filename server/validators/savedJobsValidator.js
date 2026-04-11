import Joi from "joi";

const objectIdPattern = /^[a-fA-F0-9]{24}$/;

const objectIdSchema = Joi.string().pattern(objectIdPattern).messages({
    "string.pattern.base": "must be a valid id",
});

export const saveJobBodySchema = Joi.object({
    applicantId: objectIdSchema.required(),
    jobId: objectIdSchema.required(),
}).unknown(false);

export const savedUserIdParamSchema = Joi.object({
    userId: objectIdSchema.required(),
});

export const savedDeleteParamSchema = Joi.object({
    userId: objectIdSchema.required(),
    jobId: objectIdSchema.required(),
});
