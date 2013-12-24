lens
====

A minimal jQuery gallery (experiment) for retina images. 

[example](http://austinbirch.co.uk/lens)

### Notes

The idea of this jQuery plugin is to avoid requesting images that you do not
need. For example:

- On a non-retina device you do not need to request the retina images. 
- On a retina device, you do not need to request the non-retina images.
- If you do not view an image in the gallery, it should not need to be
  requested.
  
### Limitations etc

- At the moment I have not tested it in many browsers/devices. So, for now,
  compatibility may be an issue.
- If you want the images to show without JavaScript enabled, then this will
  cause all of the normal images to be requested (even when viewing from a
  retina device).
  
### Example

You can find an example [here](http://austinbirch.co.uk/lens), and I
encourage you to read the source code.

I will be tidying up the source code later, making the plugin more
configurable (at the moment it requires a certain html layout). Once I
have made configuration easier, I will write the documentation for it.

### Image attribution

I found all the images from flickr, and have attributed the authors in the
html.

### Licence

All code written by me is MIT Licensed. The images are not mine to licence.
