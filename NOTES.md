# NOTES
* Remove `tmp` module and usage if moving to node > 5.10.10 (use `fs.mkdtemp` instead)
* Attempt to recreate issues with using `gm(request(url))` in creating a montage
  * Looks like streams in general seem to be problematic with `gm`, at least on the version of node I'm running
* Add a logging framework
* Add linting
* Consider extracting the app itself out to file
  * e.g. require the app as a module
  * Useful for writing integration tests
