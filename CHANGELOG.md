## [0.3.2](https://github.com/Otard95/prun-palette/compare/v0.3.1...v0.3.2) (2023-06-08)


### Bug Fixes

* Compat with PMMG Extended ([86d531d](https://github.com/Otard95/prun-palette/commit/86d531deecd0a33a2565ad9b60ca840f49892538))

## [0.3.1](https://github.com/Otard95/prun-palette/compare/v0.3.0...v0.3.1) (2023-06-06)


### Bug Fixes

* Add some basic styling to notification index ([#9](https://github.com/Otard95/prun-palette/issues/9)) ([8b62dc9](https://github.com/Otard95/prun-palette/commit/8b62dc936d671a051160149bb78a742c29e970c9))
* Waiting for element may alredy exist ([#8](https://github.com/Otard95/prun-palette/issues/8)) ([e741968](https://github.com/Otard95/prun-palette/commit/e741968d145c7e09bf4f5218aa9d2cdd3640ea76))

# [0.3.0](https://github.com/Otard95/prun-palette/compare/v0.2.0...v0.3.0) (2023-06-01)


### Features

* **apex:** Save and load ship info from/to localStorage ([777b152](https://github.com/Otard95/prun-palette/commit/777b152f05baef452cef697ce84e27211df44a0c))
* Closing buffers ([#6](https://github.com/Otard95/prun-palette/issues/6)) ([7f43cde](https://github.com/Otard95/prun-palette/commit/7f43cdee21a1604e2e9efd7bea9617397b02ed40))
* Emit new-buffer event for any new buffer ([#4](https://github.com/Otard95/prun-palette/issues/4)) ([d48ffe9](https://github.com/Otard95/prun-palette/commit/d48ffe93c800dc003548e6686b65237e869017e3))
* Notification commands ([#5](https://github.com/Otard95/prun-palette/issues/5)) ([ff025e8](https://github.com/Otard95/prun-palette/commit/ff025e8498e2f6c71d4505b93f3308fd65d80ba2))

# [0.2.0](https://github.com/Otard95/prun-palette/compare/v0.1.4...v0.2.0) (2023-05-21)


### Bug Fixes

* Allow tab complete to use current intput ([3066e99](https://github.com/Otard95/prun-palette/commit/3066e99e3fbf0359267830ce8c53e2e3ac1f1a57))
* Disallow completion when no commands match ([bd4e3dc](https://github.com/Otard95/prun-palette/commit/bd4e3dc080bceda94503beb0679bcf6723df9296))
* Screen type ([948e351](https://github.com/Otard95/prun-palette/commit/948e351462291150210f7918cc38a49c8925d68c))
* Use location arg for inventory warehouse command ([13d4d8f](https://github.com/Otard95/prun-palette/commit/13d4d8ff4aab67feaa592b0b89d983b254fb5bce))
* Use regexp utils to match string with special chars ([6f499d5](https://github.com/Otard95/prun-palette/commit/6f499d5536e061632862504ceff2f4e9d2010f20))


### Features

* Add regexp utils ([95b807d](https://github.com/Otard95/prun-palette/commit/95b807dd83e1c536ae1f35b48d7fb31d6512351b))
* **apex:** Add stations ([453aed4](https://github.com/Otard95/prun-palette/commit/453aed4c675ebaa20b1e0dd58c1c3b0a05d69fc6))
* Enable location fuzzing ([c45a97b](https://github.com/Otard95/prun-palette/commit/c45a97bb033a5493251d24c2761e4480e6fc38cc))

## [0.1.4](https://github.com/Otard95/prun-palette/compare/v0.1.3...v0.1.4) (2023-05-19)


### Bug Fixes

* Try not submitting chrome for review ([890a597](https://github.com/Otard95/prun-palette/commit/890a597131b2ac847c226755fed03531815262c6))

## [0.1.3](https://github.com/Otard95/prun-palette/compare/v0.1.2...v0.1.3) (2023-05-18)


### Bug Fixes

* On publish checkout to new release tag ([b90f7f3](https://github.com/Otard95/prun-palette/commit/b90f7f3a4eecfbb2b7172145afb3387fe58eafa7))

## [0.1.2](https://github.com/Otard95/prun-palette/compare/v0.1.1...v0.1.2) (2023-05-18)


### Bug Fixes

* Release should update versions of manifests and commit them. ([b004a7b](https://github.com/Otard95/prun-palette/commit/b004a7bf9483ecc681bea5b95b321a0908763ab2))

# [0.1.0](https://github.com/Otard95/prun-palette/compare/v0.0.1...v0.1.0) (2023-05-18)


### Bug Fixes

* Allow event listners to be async ([88d436a](https://github.com/Otard95/prun-palette/commit/88d436a937f6d8eb95b5c8d690fcea20424df1b8))
* DocumentObserver.waitFor will return the element matching the selector to cb ([8d6bedc](https://github.com/Otard95/prun-palette/commit/8d6bedc0632f8b2f586d80b47d3169f7e1190f10))
* Firefox addon permissions ([e8e8fd5](https://github.com/Otard95/prun-palette/commit/e8e8fd5daeb048ff244d14d7195fb35b2204102d))


### Features

* **apex:** Add mixin to get ship info when possible ([c625811](https://github.com/Otard95/prun-palette/commit/c62581125502c36539109449cae462d987044abd))
* Emit new buffer event ([9194ffe](https://github.com/Otard95/prun-palette/commit/9194ffe043b4f77106ddb92b23f34a0be3ef431e))
* **palette:** Add fuzzing for ship names ([6afe30f](https://github.com/Otard95/prun-palette/commit/6afe30f40dd2eb197ba19c1477ad7364f5d3f242))
* Refactor FIO data in Apex to own mixin ([37c0566](https://github.com/Otard95/prun-palette/commit/37c05665d892ff83fd97643e30e50c22d6a80ac4))
* Use constrained mixin pattern for Apex util ([d6696c1](https://github.com/Otard95/prun-palette/commit/d6696c1cb3f7e7a091ebeda72d10d3cfe539167a))
