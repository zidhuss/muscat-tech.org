const yup = require("yup");

const group = yup.object().shape({
  name: yup.string().required("Group name is a required field."),
  description: yup.string().required("Group description is a required field."),
  type: yup
    .string()
    .oneOf(["group"])
    .required('Type is required and must be "group".'),
  // Optional
  website: yup.string().url("Website must be a valid URL."),
  contactUrl: yup.string().url("Contact URL must be a valid URL."),
  email: yup.string().email("Email must be a valid email."),
  where: yup.string(),
  when: yup.string(),
  organisers: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Organiser name is a required field."),
      email: yup.string().email("Email must be a valid email."),
      website: yup.string().url("Website must be a valid URL."),
      linkedin: yup.string().url("LinkedIn must be a valid URL."),
      mastodon: yup.string().url("Mastodon must be a valid URL."),
      github: yup.string().url("GitHub must be a valid URL."),
    })
  ),
});

const event = yup.object().shape({
  name: yup.string().required("Event name is a required field."),
  description: yup.string().required("Event description is a required field."),
  date: yup.date().required("Event start time is a required field."),
  endDate: yup.date().required("Event end time is a required field."),
  location: yup.string().required("Event location is a required field."),
  detailsUrl: yup
    .string()
    .url("Details URL must be a valid URL.")
    .required("Details URL is a required field."),
  promotionalImage: yup
    .string()
    .url("Promotional image URL must be a valid URL."),
  allDay: yup.bool(),
  group: group,
  eventUrl: yup.string().required(),
  registrationUrl: yup.string().url("Registration URL must be a valid URL."),
  tags: yup.array().of(yup.string()),
  pricing: yup.string(),
  isOnline: yup.bool(),
});

module.exports = { event, group };
