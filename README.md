# PrUn Palette

PrUn Palette is a browser extension designed to enhance the gameplay experience
of Prosperous Universe. It offers a versatile and customizable command palette,
which allows players to manage their game actions via a few keystrokes.

## Table of Contents

[Installation](#installation)
[Development](#development)
[Building](#building)
[Contributing](#contributing)
[License](#license)

## Installation

To install PrUn Palette for personal use, you can download it from the Chrome or
Firefox extension stores.

## Development

This project uses `pnpm`.
To run PrUn Palette in a development environment, follow these steps:

 - Clone the repository: `git clone git@github.com:Otard95/prun-palette.git`
 - Navigate into the project directory: `cd prun-palette`
 - Install the dependencies: `pnpm install`
 - Build and watch for changes: pnpm watch
 - Add `./build-<browser>` as an extension, this varies based on the browser.

## Building

To build the extension for production, run the following command in the project
directory: `pnpm build:prod`

This will create a build directory with the compiled extension.

## Contributing

Contributions to PrUn Palette are always welcome. If you have a feature
suggestion, bug report, or want to contribute to the code, please feel free to
open an issue or submit a pull request.

## License

PrUn Palette is licensed under the GPL 3.0 license.
