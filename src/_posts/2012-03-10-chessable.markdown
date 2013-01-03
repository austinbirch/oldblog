---
title: chessable
layout: post
---

[![chessable](/assets/img/chessable.png)](https://www.chessable.co.uk)

To scratch an itch, I built [chessable](https://www.chessable.co.uk). chessable is a
correspondence chess game with an uncluttered and responsive interface.

I created it a few weeks ago, as other similar services were cluttered with ads, and laden
with extra features. I wanted something simpler to use.

<!--more-->

## Which devices does it work on?

It is playable on any device which has support for the relatively modern HTML5 &amp; CSS3
specs. The major parts of these that chessable leverages is the Canvas element, and font
loading through font-face.

The responsive layout is achieved using [skeleton](http://www.getskeleton.com/), which
means that it scales well to almost any screen size. The main reason for opting for a
responsive design was that chessable should be playable from anywhere, at any time. I
think that it works quite well.

## How it’s made

The server is a [Rails 3](http://rubyonrails.org/) app, and the client was built with
HTML5, CSS, and JavaScript (compiling CoffeeScript to JavaScript via Rails). The chess
validation library used is [chess.js](https://github.com/jhlywa/chess.js), which is really
very good.

The chessboard is drawn using HTML5 Canvas, and the chess pieces are loaded as a font,
using font-face. The font contains symbols for the chess pieces mapped out as different
letters. For example, drawing the letter &lsquo;p&rsquo; will draw a pawn.

## Stuff that works well

Overall the whole app works great. It&rsquo;s really simple to use, and pretty much
**just works**. I&rsquo;m reqlly happy with how it turned out.

Using email notifications to let players know of events works really well. It lets the
player get back to the game whenever they feel like playing.

Being written as a web app, it is inherently cross-platform, which is really good. However
, it being cross-platform doesn&rsquo;t mean that there is no specific work involved for
targetting separate platforms.

## Most important bug fixes to make

Even though I feel chessable works well, there are lots of things that I&rsquo;d like to
fix, change and implement.

Using a font for the pieces is (currently) responsible for a fair amount of the loading
time for a chessboard, and a game preview. Loading a font through font-face, which is to
be used with the HTML5 Canvas element, is troublesome. Waiting for
<span class="monospace">$(document).ready()</span> before loading the game isn&rsquo;t
enough for a cross-platform solution, as some browsers and some devices never seem to
load the font (and therefore never displayed the pieces).

The most bulletproof method I have found for ensuring that the pieces are displayed is to
wait for <span class="monospace">$(window).onload()</span>. This is obviously much slower,
as everything must be loaded before the game can begin loading.

When there are lots of game previews to be generated on one view, this causes a very long,
and unacceptable, loading time. At first this issue didn&rsquo;t present itself, but as
more games were played, and as more game previews were being loaded (especially on the
dashboard view), this has a really negative effect. **Fixing the loading times is &#35;1
on the priority list.** (see update below.)

<p class="update">
Update:<br><br>
After some more investigation, it became clear that although the font-face
loading was slowing things down, this wasn’t the cause of the slow load when
multiple game previews were being shown.
<br><br>
The slow game preview loading was due to having to compute lots of moves to
calculate the board positions (from the PGN) for long games.
<br><br>
This was solved by storing a
 <a href="http://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation">
FEN notation</a> of the game, and loading from that.
</p>

## Features to add

### Game invites via email

Inviting an opponent by email is a feature that I really want to put in, as it would help
attract new players to chessable. However, it can be a sensitive subject, as I
don&rsquo;t want the system to be abused, using random email addresses to span people with
chessable invites. Somehow I&rsquo;ll have to figure out a solution that allows
flexibility but minimises the risk for abuse.

### Ranking system & some stats

Although chessable is designed to be played by mostly casual players, having a ranking
system and some basic statistics would be a nice way for players to measure their
progress. However, the problem with this is that as this is correspondence chess, there
is plenty of opportunity for cheaters to abuse the system by having a computer play for
them. This would be a hard problem to solve, but a very neat feature if I could add it.

### Redesign some components

I need to redesign the player information, and game preview panels pretty quickly. They
are not good, and do not make proper use of screen space. There are other areas that I
need to tidy up too, but this is an obvious one.

### Closing Thoughts

Overall, this weekend project ended up drawing far more of my interest than I meant for it
to do. I&rsquo;m definitely going to keep developing it so that it gets better and better.

If you can create something, and still enjoy using it afterwards (despite knowing its
flaws), you have done quite well.

I am happy to say that I enjoy using chessable.

If you like playing chess, you should [go and try it out.](https://www.chessable.co.uk)
