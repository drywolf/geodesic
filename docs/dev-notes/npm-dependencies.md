### options for dependency inclusion ###

- <u>remote sources</u>
 - HTTP npm remote registry → node_modules
 - HTTP targball URL → node_modules
 - GIT remote repository → node_modules
- <u>local sources</u>
 - local directory / network share → node_modules
 - npm link → global link dir → node_modules

### dependency types ###

- dependencies ... usual module dependencies
- devDependencies ... dependencies only used to build and/or develop the module
- peerDependencies ... modules that depend on this module to provide an interface/plugin
- bundledDependencies ... modules that will be bundled into the module when publishing
- optionalDependencies ... dependencies that npm can skip if there are errors while resolving them

### traditional development usecases with modules and their dependencies ###

- require build artifact from remote
- require build artifact from local
- require source code from local
