import Joi from 'joi';

const objectIdPattern = /^[a-fA-F0-9]{24}$/;

const objectIdSchema = Joi.string().pattern(objectIdPattern).messages({
    'string.pattern.base': 'must be a valid id',
});

const nameSchema = Joi.object({
    first: Joi.string().trim().min(1).max(50).required(),
    last: Joi.string().trim().min(1).max(50).required(),
}).required();

const baseFields = {
    name: nameSchema,
    email: Joi.string().trim().email().max(254),
    password: Joi.string().min(6).max(128),
    phone: Joi.string().trim().min(7).max(30),
    skills: Joi.array().items(Joi.string().trim().min(1).max(100)).max(50),
    profilePicture: Joi.string().trim().max(500),
    resume: Joi.string().trim().max(500),
    location: Joi.string().trim().min(2).max(100),
};

export const createApplicantSchema = Joi.object({
    ...baseFields,
    name: nameSchema,
    email: baseFields.email.required(),
    password: baseFields.password.required(),
    phone: baseFields.phone.required(),
}).unknown(false);

export const updateApplicantSchema = Joi.object({
    name: nameSchema,
    email: baseFields.email,
    password: baseFields.password,
    phone: baseFields.phone,
    skills: baseFields.skills,
    profilePicture: baseFields.profilePicture,
    resume: baseFields.resume,
    location: baseFields.location,
}).unknown(false);

export const applicantIdParamSchema = Joi.object({
    id: objectIdSchema.required(),
});
