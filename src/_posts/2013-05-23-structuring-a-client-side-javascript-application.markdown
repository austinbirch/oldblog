---
title: "Structuring a client-side JavaScript application"
layout: post
---

Deciding how to structure a client-side JavaScript application can be quite
a challenge, as there are few popular conventions for doing so.

For the application that I am writing at my current startup, BottleCRM,
I have come up with what I think is an interesting approach, considering
our particular requirements and restrictions.

<!--more-->

<div class="aside"><p>
I should warn you that this post turned out to be much longer than I
originally anticipated, and it is only a high-level overview of the structure
that I have used to develop BottleCRM.
<br><br>
I plan on writing more in-depth posts (they will be shorter, more
technical, and include examples) about specifics later.
</p></div>

## Our requirements

Firstly, I should explain that the BottleCRM application comes with a set of
design restrictions that some other client-side JavaScript applications will
not have to face, the biggest of which is our plugin system.

BottleCRM will allow the user to write (or select from an app-store
sort of arrangement), plugins that will be run on the client. The aim is to
enable competent JavaScript programmers to customize the software to closer
match their business needs.

This is a bit of a nightmare for designing the fundamental structure, as
decisions made now may be hard to change once third-parties (or even myself)
write plugins that extend the functionality of the application.

The more plugins there are, the harder it is to change the plugin system.
The more complicated the plugin system is, the harder it is to write plugins
that interact well with the application.

## Modules

Structuring client-side JavaScript applications should be no different than
structuring applications written in other languages, but as JavaScript (in
the browser), has no real module loading system, amongst some other oddities,
this can be a difficult task.

You cannot really start to design a decoupled and flexible application without
being able to separate the code into individual units. Because of this, the
first thing that is required for application structure is a module system.

The module system I am using is [component](http://component.io/),
which works in a very similar way to [Node.js](http://nodejs.org/) modules.
I prefer the CommonJS style module declarations to the
[AMD](http://requirejs.org/docs/whyamd.html) style, (both systems have
their own set of advantages/disadvantages), and using any module system
is much better than using none at all.

## Options for application structure

There are many different approaches that you can take, and mine is a
combination of different patterns (especially the mediator and facade)
that I have read about and explored with test projects.

A good place to start reading upon the different options would be any of the
below:

- [Patterns For Large-Scale JavaScript Application Architecture][lsjs]
- [Learning JavaScript Design Patterns][esjdp]
- [My Clojure Workflow, Reloaded][clojure-workflow]

Also, though Backbone specific, [Addy Osmani's](http://addyosmani.com/blog/)
book, [Developing Backbone.js Applications](http://addyosmani.github.io/backbone-fundamentals/), has some really great ideas.

## My approach

I do not believe that programming is about forcing your problem into design
patterns, so I try to avoid implementing pattern specifics too much, and
instead just follow the ideas and concepts of the design patterns that fit the
problem more naturally.

It is especially important to think of the problems that are specific in your
applications domain, and to think about the best ways in which those problems
can be solved &mdash; sometimes you need a little of this pattern, and a bit
of another.

For BottleCRM, the biggest problem I have to solve, in regards to application
structure, is the plugin system.

Implementing a plugin system, and the ideas that it represents (the ability
for other developers to hook in their own code and customisations), usually
involves quite complicated APIs, interfaces, and other connecting parts. This
can be quite troublesome to maintain, due to the large surface area of the
code.

As requirements of the plugin system change, changing it can be hard due to
the amount of code that has already been written to interact with it.
Enforcing backwards-compatibility is not an easy thing to do, especially as
early on in the software development process the direction that the plugin
system will take (in terms of what plugin developers will want to be able to
achieve) is relatively unknown.

In order to remove the complexity that is usually involved in a plugin system,
I decided to not really have one. Though this sounds counter-intuitive, for
an application that is almost all about plugins, it should become clearer as
you read on.

Instead of a plugin API, the core of the application would just be a plugin
loader, and nothing else. It knows which plugins to start, and requires them.
The plugins themselves do not need to require other plugins, or express their
dependency on other plugins in any other way. Instead, all communication
goes through an *event bus*.

This removes the requirement for the plugin loader to do any special kind of
dependency resolution, or handle connecting plugins to other plugins,
and reduces the complexity of the application quite a bit.

The application event bus is created by the module loader, and passed as a
parameter to each plugins constructor. The plugin keeps a reference to this
event bus, and using this reference can communicate with other components
in the system via; en-queuing and handling messages, listening for and
emitting events.

In order to reduce complexity and boilerplate code within a plugin, it only
has a small interface that it needs to conform to.
This interface outlines that a plugin should have two functions
(aside from the constructor):
<span class="monospace">initialize</span> and
<span class="monospace">stop</span>.

Once all plugins have been instantiated,
<span class="monospace">initialize</span> will be called, and
<span class="monospace">stop</span> will be called when a plugin is to be
disposed of, allowing it to shut down gracefully.

## The event bus

The event bus has a couple of distinct parts, and the way that it is used by
the components shapes the application structure.

The parts are:

- A *pub/sub* system
- A *message queue*

### Pub/sub

A traditional *publish/subscribe* system that allows components to
<span class="monospace">subscribe</span> to events (by name), and other
components to <span class="monospace">publish</span> events. The events can
have extra data associated with them that provide context and describe what
occurred.

Components that <span class="monospace">subscribe</span> to events are called
*consumers*, and components that <span class="monospace">publish</span> events
are *producers*.

In BottleCRM, for the most part, events are used to describe things that
have happened so that multiple consumers can react to a change in application
state. An example of this may be to load extra data when a
<span class="monospace">signin:success</span> event is published.

### The message queue

components can register to <span class="monospace">handle</span> messages,
and other components can <span class="monospace">enqueue</span> them. When
you enqueue a message, the last component to register a handler for that
message name will have its handler called. Messages will often contain
other parameters that the handler should use to perform its work.

Handler functions can allow the message to be passed to any previous handler
that was registered if it would like to, allowing interception and
modification of messages.

A parameter that will often be passed as part of a message will be a callback
function. For example, we might enqueue a database call to find all of users
in the system. A callback function would be supplied along with the message
for the handler to call with the result.

This sort of messaging is used to expose all of the functionality that a plugin
provides to the system. A short list of examples from BottleCRM would
look like this:

- View creation
- Building models
- Saving models
- Searching the local cache
- Searching the remote database
- Navigating to a different local route
- Showing a view in a certain region

The message queue, with few exceptions, is used to get other components to
do work/jobs. These message names are usually phrased as commands. For
example, a component may enqueue a
<span class="monospace">navigate:users</span> message to get a router
component to cause some navigation to occur. These messages change the state
of the application.

One interesting side effect to the message queue system is that it allows
plugins to be initialised *after* messages that it handles have been enqueued.
This is because when the handler function is registered with the event bus,
the event bus will dispatch messages to that function that already exist on
the queue (if the handler function handles those messages).

### Effects of using this structure

The best thing about this system is that it allows components and plugins to
express their dependencies in terms of *work* rather than *workers*. To make
an example, instead of a plugin knowing that it depends on a
<span class="monospace">router</span> component in order to perform
navigation, it expresses that it wants something to do some navigation for it.
This expression is displayed via the name of the message enqueued, in this
example a <span class="monospace">ui:navigate</span> message.

<div class="aside">
<p>
As an aside, I am likely to write a program to create a graph of these
<em>work dependencies</em> that I will run the source code for BottleCRM
through &mdash; it should be quite interesting to see.
</p>
</div>


This is great for decoupling. The components that are able to do the work can
just handle the correct messages, and components that want work to be done can
just enqueue work to be done. Neither component know implementation detail
about the other, just that they are able perform a function, or would like
a function to be performed.

In terms of application structure, this allows us to operate with a low level
of ceremony. The only stuff required is the plugin interface (the
<span class="monospace">initialize</span> and
<span class="monospace">stop</span> functions), and the handler function
itself.

Arguably, one of the disadvantages of this system is that it forces lots of the
code structure to be asynchronous. This can lead to code that some think
is more complicated to read, but I hope that it does not take too long for
developers that are not familiar with the codebase to get used to it.

I have found, however, that this style of code forces you to think about
what happens when some work you request is not performed, or takes a long time
to complete. For example, when requesting data from a remote database you may
wish to render a view that shows that you are loading some data. This is,
mostly, a nice trait that is forced by this no-guarantees approach.

Rather than defining that you cannot run without another plugin being enabled
(expressing a dependency on that plugin), you must handle the case that the
work you requested might not be completed. It might be that you just do
nothing (roughly the same as if your plugin has refused to load), however you
may decide to follow a different course of action.

### Problems and things yet to be done

It is not all wonderful, and there are still lots of details that need to be
ironed out.

One of these is versions between plugins. Making sure that various plugins
are compatible with other plugins with different versions is a hard problem to
solve. I do not want to have to implement the sort of dependency system in
which plugins depend on particular versions of other plugins, as this would
undo all of the simplification that has been achieved.

I would also like to make it easier to determine for plugins to determine
whether handlers are registered for particular messages, without allowing
too tight coupling between those plugins and handlers.

I also need to develop a way that components can remove messages that they
have enqueued, without them having been processed off of the queue. This is
because some messages may be irrelevant or incorrect when applied at a later
time. For example, if a <span class="monospace">navigate:users</span>
message was enqueued, without a component to handle it, and some time later
a component is initialised that does handle that message, it may be
inappropriate for it to take any action.

Another feature that I am looking into is a kind of pipeline flow, with
multiple participants that do not know of the implementation details of each
other &mdash; sort of like a middleware pattern. I am not too sure on this
yet, but it is worth some exploration.

### Open source (soon)

The framework that I have built to develop the application is based on
[Backbone.js](backbonejs.org), with some small additions in the form of
a couple of <span class="monospace">Backbone.View</span> subclasses, and some
subclasses of <span class="monospace">Backbone.Collection</span> for caching
server models, and creating live data views for view classes.

Of course, the biggest addition that makes this framework interesting is the
event bus, and there is no reason that that could not be used in a
non-Backbone.js project.

As soon as I pull apart some of the application-specific parts from my
framework, and tidy up the event bus code, I will be open sourcing it and
putting it up on my [Github](https://github.com/austinbirch/) profile.


<!-- footnotes -->
[lsjs]: http://addyosmani.com/largescalejavascript/ "Patterns For Large-Scale JavaScript Application Architecture"
[esjdp]: http://www.addyosmani.com/resources/essentialjsdesignpatterns/book/ "http://www.addyosmani.com/resources/essentialjsdesignpatterns/book/"
[clojure-workflow]: http://thinkrelevance.com/blog/2013/06/04/clojure-workflow-reloaded "My Clojure Workflow, Reloaded"
