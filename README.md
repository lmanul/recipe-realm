# Recipe Realm

Help people discover and collect food recipes!

## Usage

* Clone this repository and enter the directory:

`git clone git@github.com:lmanul/recipe-realm.git && cd recipe-realm`

* Install the necessary Node packages:

`npm install`

* Then start the server. In production:

`npm run start`

* For development mode:

`npm run dev`

* Run tests:

`npm test`

## Technological choices

The only clear preferences expressed by the exercise instructions were towards
Node.js and Typescript, so that was an easy choice. It was then logical to
extend the choice of Typescript to the client-side code to allow for more code
sharing.

For the client-side "framework", after debating between React and Vue for a
little while, I made the observation that when using those, I am sometimes
a little frustrated by the extra layers of abstraction which translate to less
control, especially when it comes to optimizing for performance (but of course
these frameworks also come with enormous benefits). So I thought it would be
an interesting exercise to do without any pre-built framework, and to just use
"vanilla" Typescript / Javascript. That meant reinventing the wheel for some
things (component management, routing, etc.) but I could design a small wheel
perfectly adapted to the project's needs. In a collaborative project, I would
probably have picked Vue, but for this solo exercise, building something simple
and performant from scratch was a nice little challenge.

### What goes over the wire

In the same spirit, while JSON is a nice, widespread and well-supported format,
I decided to come up with ad-hoc, more minimal, data-only messages sent from
the server. Using the same code on the client and the server makes it easy to
build simple, self-contained, testable classes that know how to serialize and
deserialize themselves.

### Client-side rendering

The application is mostly rendered on the client. The drawback is bad "search
engine optimization", but I thought this wasn't the priority in this case.
Rendering some pages on the server (e.g. the list of all recipes) would be an
easy change, but I decided to keep things simple.

You can load the app from any page (e.g. single-recipe page), but once it's
loaded it is a "single-page app" for the most part (except for when you log
in / out), and should therefore be very fast.

### Authentication

From reading the requirements, it seemed like proper authentication was not
explicitly in scope. However, assuming the app would only ever be used by one
person and have one set of lists seemed a little over-simplistic, so I added
the bare minimum: there are 3 "hard-coded" users, and you can identify as any
of them without any verification. Express's "Passport" module would make it
quite easy to swap this mechanism for something more production-worthy, but
I wanted to have at least a placeholder for that.

### Images

I understand this wasn't explicitly part of the exercise, but being a fairly
visual person, I thought that text-only recipes in a text-only application was
not very appealing, so I did a bit of pre-work to scrape recipe images (O, God
of the BBC, please forgive me) and include them in the project. I was initially
concerned about the size, but I was surprised to see that they weren't very
well optimized and that with a little bit of post-processing, the total of
~1600 images add up to ~70 MB. I made sure to let the client know to load
those lazily as they scroll through the list.

### Other missing pieces

Some other things that would need a little extra effort for this to be a
"real" application: internationalization (currently only English),
accessibility (I didn't pay close attention to things like screen readers
or keyboard navigation).