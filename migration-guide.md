# Migration Guide

## v2 to v3

Environment variables:

- `OCTOPUS_HOST` has been dropped, in favour of `OCTOPUS_URL`. This is being applied across v3 of all of our actions.
- `OCTOPUS_SPACE` is now supported for setting the name of the Space

The debug parameter has been removed from the action, debug output will be run when the action itself is run in debug mode.
