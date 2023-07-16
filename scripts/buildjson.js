const fs = require('fs');
const path = require('path');
const matter = require('gray-matter'); // For parsing the front-matter
const yup = require('yup');

// Filter _index.md files
const notIndexFile = (file) => file !== '_index.md';

// Input & output directories
const eventsDir = path.join(__dirname, '..', 'content', 'events');
const outputDir = path.join(__dirname, '..', 'public', 'events');

const eventSchema = yup.object().shape({
  name: yup.string().required('Event name is a required field.'),
  description: yup.string().required('Event description is a required field.'),
  startTime: yup.date().required('Event start time is a required field.'),
  endTime: yup.date().required('Event end time is a required field.'),
  location: yup.string().required('Event location is a required field.'),
  detailsUrl: yup.string().url('Details URL must be a valid URL.').required('Details URL is a required field.'),
  promotionalImage: yup.string().url('Promotional image URL must be a valid URL.'),
  allDay: yup.bool(),
  group: yup.string().required('Event group is a required field.'),
  eventUrl: yup.string().url('Event URL must be a valid URL.'),
  registrationUrl: yup.string().url('Registration URL must be a valid URL.'),
  tags: yup.array().of(yup.string()),
  pricing: yup.string(),
  isOnline: yup.bool(),
});

async function generateCalendar() {
  try {
    const events = {};
    const validations = [];

    fs.readdirSync(eventsDir)
      .filter(notIndexFile)
      .forEach((group) => {
        const groupDir = path.join(eventsDir, group);
        fs.readdirSync(groupDir)
          .filter(notIndexFile)
          .forEach((file) => {
            // Read each event file
            const filePath = path.join(groupDir, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');

            // Parse the event data
            const eventData = { ...matter(fileContent).data, group };

            const validationPromise = eventSchema.validate(eventData, { abortEarly: false });
            validations.push({
              promise: validationPromise,
              file: filePath,
            });

            // Extract the year and month from the event date
            const eventDate = new Date(eventData.date);
            const year = eventDate.getFullYear();
            const month = String(eventDate.getMonth() + 1).padStart(2, '0');

            // Construct the key for the event data
            const key = `${year}-${month}`;

            // Add the event data to the events object
            if (!events[key]) {
              events[key] = [];
            }
            events[key].push(eventData);
          });
      });

    // Run validations
    const results = await Promise.allSettled(validations.map(v => v.promise));

    let hasError = false;
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        hasError = true;
        console.error(`Error in ${validations[index].file}:\n\t${result.reason.errors.join('\n\t')}`);
      }
    });

    if (hasError) {
      throw new Error('Validation failed.');
    }

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the aggregated events data to JSON files
    Object.entries(events).forEach(([key, value]) => {
      const outputFilePath = path.join(outputDir, `${key}.json`);
      fs.writeFileSync(outputFilePath, JSON.stringify(value, null, 2));
    });

    console.log('Created event json files successfully!');
  } catch (error) {
    console.error(`An error occurred during the post-build step: ${error.message}`);
    process.exit(1);
  }
}

generateCalendar();
