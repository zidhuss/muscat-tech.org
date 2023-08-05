const fs = require("fs");
const path = require("path");
const matter = require("gray-matter"); // For parsing the front-matter
const ical = require("ical-generator").default;
const schemas = require("./schemas");

// Filter _index.md files
const notIndexFile = (file) => file !== "_index.md";

// Input & output directories
const eventsDir = path.join(__dirname, "..", "content", "events");
const outputDir = path.join(__dirname, "..", "public", "events");

async function generateCalendar() {
  try {
    const events = {};
    const validations = [];
    const allEventsCalendar = ical({
      domain: "muscat-tech.org",
    });
    const generateIcs = icsEventGenerator(allEventsCalendar);

    fs.readdirSync(eventsDir)
      .filter(notIndexFile)
      .forEach((group) => {
        const groupDir = path.join(eventsDir, group);

        const groupIndexPath = path.join(groupDir, "_index.md");
        const groupIndexContent = fs.readFileSync(groupIndexPath, "utf8");
        const groupData = matter(groupIndexContent).data;

        validations.push({
          promise: schemas.group.validate(groupData, { abortEarly: false }),
          file: groupIndexPath,
        });

        fs.readdirSync(groupDir)
          .filter(notIndexFile)
          .forEach((file) => {
            // Read each event file
            const filePath = path.join(groupDir, file);
            const fileContent = fs.readFileSync(filePath, "utf8");
            const relativePath = path.relative(eventsDir, filePath);

            // Parse the event data
            const eventData = { ...matter(fileContent).data, group: groupData };

            // Extract the year and month from the event date
            const eventDate = new Date(eventData.date);
            const year = eventDate.getFullYear();
            const month = String(eventDate.getMonth() + 1).padStart(2, "0");

            eventData.eventUrl = `groups/${group}/events/${year}/${month}/${
              eventData.slug ?? path.parse(file).name
            }/`;

            validations.push({
              promise: schemas.event.validate(eventData, {
                abortEarly: false,
              }),
              file: relativePath,
            });

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
    const results = await Promise.allSettled(validations.map((v) => v.promise));

    let hasError = false;
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        hasError = true;
        console.error(
          `Error in ${validations[index].file}:\n\t${result.reason.errors.join(
            "\n\t"
          )}`
        );
      } else if (result.value?.type !== "group") {
        // Passed the validation
        const eventData = result.value;
        generateIcs(eventData, validations[index].file);
      }
    });

    if (hasError) {
      throw new Error("Validation failed.");
    }

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Create a new JSON file with an array of months that have events
    const eventsFileOutputPath = path.join(outputDir, "months.js");
    const jsContent = `export default new Set(${JSON.stringify(
      Object.keys(events)
    )});`;

    fs.writeFileSync(eventsFileOutputPath, jsContent);

    // Write the aggregated events data to JSON files
    Object.entries(events).forEach(([key, value]) => {
      const outputFilePath = path.join(outputDir, `${key}.json`);
      fs.writeFileSync(outputFilePath, JSON.stringify(value, null, 2));
    });

    // Write the global calendar
    const outputICSFile = path.join(outputDir, "all.ics");
    allEventsCalendar.saveSync(outputICSFile);

    console.log("Created event json files successfully!");
  } catch (error) {
    console.error(
      `An error occurred during the post-build step: ${error.message}`
    );
    process.exit(1);
  }
}

generateCalendar();

function icsEventGenerator(allEventsCalendar) {
  return function (eventData, id) {
    const eventObject = {
      start: new Date(eventData.date),
      end: new Date(eventData.endDate),
      summary: `${eventData.group.name} - ${eventData.name}`,
      description: eventData.description,
      location: eventData.location,
      url: eventData.detailsUrl,
      organizer: {
        name: eventData.group.name,
        email: eventData.group.email,
      },
      class: "PUBLIC",
      id,
    };
    allEventsCalendar.createEvent(eventObject);

    // TODO: Create individual ics files
    writeEventIcs();
  };
}

function writeEventIcs() {}
