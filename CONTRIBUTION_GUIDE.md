# Contribution Guide for PrUn Palette

PrUn Palette appreciates your interest in contributing! This guide provides a
brief overview of how you can contribute to PrUn Palette and what you'll need
to know to get started.

## Reporting a Bug or Suggesting a Feature

Before submitting a bug report or feature request, please search through the
existing issues to see if someone else has already reported it. If not, please
use the appropriate issue template:

 - For bug reports, use the Bug Report template. Be sure to provide as much
   detail as possible, including steps to reproduce the problem, what you
   expected to happen, and any error messages or relevant logs.

 - For feature requests, use the Feature Request template. Provide a detailed
   description of the suggested feature, why you think it would be useful, and
   any related documentation or external links.


## Setting Up Your Development Environment

Here are the steps to get started with setting up your development environment
for PrUn Palette:

### Prerequisites

1. Make sure you have Node.js installed. If you don't have Node.js installed,
   you can download it from [here](https://nodejs.org/). This project has been
   tested with Node.js 18.15.0, but newer versions should work as well.

2. Install `pnpm`. `pnpm` is a fast, disk-efficient package manager. If you
   don't have `pnpm` installed, you can install it globally by running:

   ```
   npm install -g pnpm
   ```

### Setup Steps

1. Clone the repository:

   ```
   git clone https://github.com/your-username/prun-palette.git
   ```
   > Remember to replace `your-username` with your actual GitHub username in
   > the clone command.

2. Navigate into the cloned repository:

   ```
   cd prun-palette
   ```

3. Install the project dependencies:

   ```
   pnpm install
   ```

### Running the Project Locally

1. To start the build process in watch mode, run:

   ```
   pnpm run watch
   ```

2. Running the extension locally. This is a little different from firefox to
   Chormium based browsers, therefor Please read thier respective
   documentation.

    - [Firefox Manually](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/)
    - [Firefox web-ext took](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/)
    - [Chormium](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked)

   The builds are located in the `build-<browser>` directory.

   > Please be aware that some scripts might need additional setup. For
   > example, the `ext` and `ext:lint` scripts assume that you have Firefox
   > installed at `/opt/firefox/firefox`. If your Firefox installation is
   > located somewhere else, you will need to adjust the path accordingly.

### Running Tests

1. To run the tests, use:

   ```
   pnpm run test
   ```

2. To watch for changes and rerun tests, use:

   ```
   pnpm run jest:watch
   ```

## Submitting a Pull Request

Before submitting a pull request, make sure you have followed these steps:

 - Fork the repository and create your branch from `dev`.
 - If you've added code that should be tested, add tests.
 - Ensure the test suite passes.
 - Make sure your code lints.
 - Issue that pull request! (always into the `dev` branch)

## Need Help?

If you're stuck or unsure about something, feel free to reach out! You can post
a question in [GitHub
Discussions](https://github.com/Otard95/prun-palette/discussions).
