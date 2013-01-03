---
title: Ludum Postmortem
layout: post
---
Last weekend I took part, for the first time, in [Ludum Dare](http://ludumdare.com), a
competition in which you have **48** hours to create a game from scratch. I&rsquo;ll be
doing the next one too.

I don&rsquo;t usually make games, but I enjoyed the challenge. As Rails 3.1 will use
[CoffeeScript](http://coffeescript.org/) by default, I thought it would be the perfect
change to get to know it a bit better.

<!--more-->

## What did I make?
Each Ludum Dare has its own theme, and the theme for Ludum Dare 21 was
&ldquo;Escape.&rdquo; I made a game called *65-73-63*, which is &ldquo;esc&rdquo; in hex
(utf-8).

I initially designed it to be a traditional 2D side scrller, but with a small twist. The
twist being that you did not control the player, but instead you are in control of the
environment. You would operate a series of bridges, doors, and boosters to help the
protaganist, Tom, escape from a series of overgrown Earth Bees that were chasing him.
How the game turned out was a bit different.

Here&rsquo;s a list of the main features I wanted to include:

* An array of different objects to control, including doors, bridges, launchers, and
  boosters.
* Random level generation, so that the game would be endless.
* Very basic, blocky art. Simple is nice sometimes.
* A simple scoring system, which reflected how far you had managed to get.


## What did it end up like?
*65-73-63* ended up half the game I imagined it to be. For a few reasons, I used up all of
my time.

One of the things that annoyed me most was the the final submissing only included bridges
to operate. This made the game far more boring than originally intended. I still think the
idea was good, and I will finish adding the parts that did not make it later. I also never
got around to implementing the random level generation, which was to be another important
feature. Random level generation meant the level could be endless, making it a
[canabalt](http://www.canabalt.com/)-style dash-until-death game.

## Things that slowed me down
I started it half a day late, as I didn&rsquo;t realise it was that weekend.

Learning CoffeeScript at the same time definitely made things take much longer, especially
at the beginning.

Not having software that I needed installed, and then trying to download it and my
connection dying. This was very annoying, but, these things happen.

## Things I, maybe, should have done differently
I should have been more prepared, which would have meant knowing that it was on, and
having the right stuff installed.

I used this as an opportunity to learn some CoffeeScript, if I wanted to make the best of
the time, I should have stuck to things I already knew.

## Thoughts on CoffeeScript
It is so great that I never want to use plain JavaScript again. Ever. The syntax is very
concise, which works really well. I love the use of indentation rather than symbols such
as braces. The addition of simple Class structures make things much easier (though you
have to be careful when splitting your code into multiple files, CoffeeScript wraps each
one in an anonymous function.)

## Where to play it, and screenshots
You can play *65-73-63* [here](http://austinbirch.co.uk/65-73-63/), and that is where I
keep the most updated version.

![start](/assets/img/65-73-63-start.png)
![jump](/assets/img/65-73-63-jump.png)

## End
Hopefully I will be better prepared for the next one, and let’s hope that I learn from the
mistakes I made this time round.

The end of a fun, but a bit exhausting weekend. : )
