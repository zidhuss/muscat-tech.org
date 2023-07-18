# Muscat Tech Community Website

A place for tech communities in Muscat to list their events.

## Adding a new group

1. Create a new subdirectory under `content/events` with the group name. For example, `content/events/Muscat Ruby`.
2. Inside this new subdirectory, create a `_index.md` file with the following structure:

```md
---
name: OmanGo
description: |
  Meetup for people who know, use, or are just interested in starting to program in Go,
  the programming language designed and built at Google. All abilities are welcome.
email: hussein@omango.org
organisers:
  - name: Hussein Al Abry
    email: hussein@zidhuss.tech
    website: https://zidhuss.tech
    mastodon: https://omani.social/@zidhuss
    github: https://github.com/zidhuss
    linkedin: https://www.linkedin.com/in/hussein-al-abry/
where: Varies
when: Third Wednesday of every month
website: https://omango.org
type: group
---
```

## Adding a new event

Create a new Markdown file in the group's directory. For example, `content/events/Muscat Ruby/meetup.md` with the following structure:

```md
---
name: "July meetup"
description: "July meetup"
date: "2023-07-26T19:00:00"
endDate: "2023-07-26T23:00:00"
detailsUrl: "https://omango.org"
location: "Sorella"
image: "https://omango.org/images/logo.svg"
slug: meetup
---
```

**Note:** The `slug` field is optional. If not provided, the URL will be generated based on the file name.

See [this file](./scripts/schemas.js) for the validation schema.

## For Developers

### Building the Calendar

Install the dependencies with `yarn` then run `yarn build` to generate the calendar.

### Running the Hugo Server

You need to have `hugo` installed on your machine. To run the server, execute:

```sh
yarn dev
```

### Updating the Main Calendar

If you want your entries to be visible on the main calendar, you will need to re-run the JS build script with `yarn build`.

## Contributing

We appreciate and welcome your contributions. If you'd like to add a group or event please make a pull request with your changes.

After your Pull Request is merged, our continuous integration process will automatically build and deploy the website.

For more details on how to create a pull request, check out the [GitHub Docs](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

If you have questions or issues, please use the [GitHub Issues](https://github.com/zidhuss/muscat-tech.org/issues) section of this repository.
