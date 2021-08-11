const DefaultJoi = require("joi");
const sanitizeHTML = require("sanitize-html");
const extension = (Joi) => ({
  type: "string",
  base: Joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHTML(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = DefaultJoi.extend(extension);

module.exports.venueSchema = Joi.object({
  venue: Joi.object({
    name: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(0),
    // images: Joi.string().required(),
    location: Joi.string().required().escapeHTML(),
    rental: Joi.string().allow(""),
    description: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});
