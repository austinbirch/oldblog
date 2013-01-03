---
title: Site Redesign
layout: post
---
<p class="update">
<em>Updated 13/08/2011:</em><br>
This no longer applies, as it relates to the previous blog&rsquo;s design. Maybe I will
write a new article about the current design later.
</p>

I have redesigned my blog to make it simpler, less decorated, and more purposeful. What
follows is a break-down of the design decisions involved.

<!--more-->

## What is my blog for?
The articles I want to write for my blog are longer in form, and less media intensive
than many blogs. It is meant to be all about the words, so typography and legibility were
very important factors in the redesign.

## Typography
Reading longer forms of text is made more comfortable when things such as measure,
typeface selection, vertical rhythm, and colour are picked carefully.

Georgia is used as the primary typeface for everything. Visual hierarchy between type is
achieved by mainly using size.

I selected Georgia due to it&rsquo;s large x-height, and therefore good legibility. I
tried using some of the serif typefaces on the
[Google Web Fonts](http://www.google.com/webfonts) library, but I did not find any that
I felt produced as clear type. Georgia also has a neat advantage in that is is installed
on most operating systems by default too, which helps in cross-compatibility.

I selected a measure of around 76 characters for the main content column, which is on the
high side of the widely regarded ideal measure, but I like it. It is low enough not to
make line length too intimidating.

Font sizing is achieved using a new CSS3 unit, the
[&#8220;rem&#8221;](http://www.w3.org/TR/css3-values/#relative0). Jonathan Snook recently
wrote a very comprehensive article on its usage
[here](http://snook.ca/archives/html_and_css/font-size-with-rem) so I will skip going into
too much detail. He explains it far better than I could anyway. As a fall-back, I have
declared the pixel unit first. Any browser that supports the &#8220;rem&#8221; unit, will
override that first declaration.

I have used a traditional typographical scale, and selected the header and paragraph sizes
as follows (I will define the values in pixels from now on.)

* h1 &mdash; 36px
* h2 &mdash; 24px
* h3 &mdash; 21px
* p &mdash; 16px

Selecting a base size of 16px means that I could decide upon the vertical rhythm. The
vertical rhythm is defined by the baseline grid. To define the baseline grid I reset all
margins and paddings, and set the leading (line-height in CSS) to define the grid.

Any adjustments made in padding or margin need to total to a multiple of the leading. You
can read up on setting type to a baseline grid on
[A List Apart](http://www.alistapart.com/articles/settingtypeontheweb/), where again, it
would be explained better than I could do.

I set my leading at just under 140% of my paragraph font size, to keep the numbers nice
and round. 140% of 16px is 22.4px, so I've used 22px. Usually it pays to increase the
leading with a longer measure, and to use =>140% of the type size, however with the large
x-height of Georgia, it seems to be fine at just under 140%.

## Structure
The structure of the new design is simple, and allows unobtrusive reading. It is easy to
know where everything is &mdash; there are only two columns!

I used a customised version of the [960.gs](http://960.gs/) grid system to make it really
simple to define the columns.

I tried aligning the content to the center, but it felt like the article copy was floating
too far to the right. Pushing everything to the left meant that reading longer pieces of
text did not feel awkward with the introduction of too much white space.

Keeping article headers in the first column separates them well from the article itself,
and allows me to use slightly larger sub-headings in the article.

I think I might come up with a way of keeping track of your position in the article using
the space in the first column, I'm rather jealous that [Steve Losh](http://stevelosh.com/)
has an extremely neat implementation of this &mdash; see an example on one of his
[posts](http://stevelosh.com/blog/2010/09/coming-home-to-vim/).

## Colour
Colour is really simple. #333 for the type, variations on this for borders and
content-separating borders. The link colour, #902a2b, is a slightly brighter version of
red than the logo (#762223), to make the links a little more contrasting. I tried using
the logo colour itself, but it was too hard to see amongst the copy. Hovering a link
causes it to brighten slightly more to #9e2d2f, and an underline makes it further obvious.

## Final thoughts
I am pretty happy with how it turned out, I think it does what it is meant to do, and it
does it without shouting for attention. It is unobtrusive, but still pleasant.

## Your thoughts
Let me know what you think via twitter, my username is
[@austinbirch](http://twitter.com/austinbirch).
Aim corrections and suggestions that way too. Thanks.
