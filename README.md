# Muscat Tech Community Website

A place for tech communities in Muscat to list their events.

## Adding a New Group

You can add a new group either by using Hugo's built-in commands or by manually creating directories and files.

### Using Hugo

Run the following command in the terminal, replacing `<group-name>` with the name of the group:

    hugo new --kind group ./content/events/<group-name>

This will create a new directory under `content/events/<group-name>` and a `_index.md` file within that directory with the predefined structure.

### Manually

Create a new subdirectory under `content/events` with the group name, for example, `content/events/Muscat Ruby`. Inside this new subdirectory, create a `_index.md` file. You can copy the template from `archetypes/group/_index.md` and fill in your group details.

## Adding a New Event

Similar to adding a new group, you can add a new event either by using Hugo's built-in commands or by manually creating a markdown file.

### Using Hugo

Run the following command in the terminal, replacing `<group-name>` with the name of the group and `<event-name>` with the name of the event:

    hugo new --kind event ./content/events/<group-name>/<event-name>.md

This will create a new Markdown file in the group's directory with the predefined structure.

### Manually

Create a new Markdown file in the group's directory, for example, `content/events/Muscat Ruby/meetup.md`. You can copy the template from `archetypes/event.md` and fill in your event details.

**Note:** The `slug` field is optional. If not provided, the URL will be generated based on the file name.

## For Developers

### Requirements

To run and contribute to the project, you will need to install the following requirements:

1. [NodeJS](https://nodejs.org/en/download)
2. [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)
3. [Hugo](https://gohugo.io/installation/)

### Building the Calendar

Install the dependencies with `yarn` then run `yarn build` to generate the calendar.

### Running the Hugo Server

Before running the server, you need to install all required modules by running:

    yarn install

You need to have `hugo` installed on your machine. To run the server, execute:

    yarn dev

### Updating the Main Calendar

If you want your entries to be visible on the main calendar, you will need to re-run the JS build script with `yarn build`.

## Contributing

We appreciate and welcome your contributions. If you'd like to add a group or event please make a pull request with your changes.

After your Pull Request is merged, our continuous integration process will automatically build and deploy the website.

For more details on how to create a pull request, check out the [GitHub Docs](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

If you have questions or issues, please use the [GitHub Issues](https://github.com/zidhuss/muscat-tech.org/issues) section of this repository.
