# JS Client for the Eve Swagger Interface (ESI)

- Documentation: <https://lhkbob.github.io/eve-swagger-js>

## Status

There has not been a release for some time, but it does not mean that this project is dead.  I have been working to update it to TypeScript (basically done) and improve its API while maintaining parity with ESI functionality.  However, I am also in my last year of my PhD and that has taken precedence.

The current master branch contains a TypeScript version of the API that is described by the above JS documentation link. It is tied to an old ESI version (~0.4).  This may be fine for some people, but since this library uses the exact version numbers in route URLs, it may not work depending on what specific features you require.

The esi-0.6.0 branch represents a pending update that has a much more recent ESI version (~0.7, contrary to what the branch name suggests).  This however also includes a more radical shift in API to support accessing a single id, multiple ids, or all ids in a consistent way across resources that have different access patterns in the underlying ESI interface (bulk id fetch then single access, paginated by page number, streamed by maximum id filter, etc).  All of these details are now abstracted over and hidden by the high-level interface.

The esi-0.6.0 branch shows the current direction I am planning on taking this project. If problems with the old version on npm or the master typescript branch come up, please try the esi-0.6.0 branch. As I have time to update the unit tests and document generation, I will make an official release, but that could take some time.

Thank you for your patience.
