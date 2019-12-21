## Ideas for actions

* Merge PR on check_suite/completed if approved (and no newer commit since approval maybe?)
* Add a release for when a tag is pushed w/ a compare link if there are no release notes.
  * On create, figure it out if it's a tag, and it's a semver tag (e.g. vd.d.d)
  * Also figure ensure there is no release already for this thing.
  * Find previous tagged version and construct a compare link
  * Add a release for that tag w/ the compare link
