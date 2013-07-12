(function($) {
  // default settings
  var defaults = {
    thumbnailOpacity: 0.3,
    thumbnailPath: function(path) {
      return path.replace('.jpg', '-thumb.jpg');
    },
    retinaPath: function(path) {
      return path.replace('.jpg', '@2x.jpg');
    }
  };

  // The Lens object itself. Instantiated for each Lens gallery
  var Lens = function(element, options) {
    this.el = element;
    this.$el = $(element);

    this.options = $.extend({}, defaults, options);

    this.init();
  };

  // Hides all of the gallery images
  Lens.prototype._hideImages = function() {
    this.$el.find('.lens-image-container').css('display', 'none');
  };

  // Shows an image for the given index
  Lens.prototype.showImage = function(index) {
    var query = '[data-lens-index="' + index + '"]';
    this._hideImages();

    // fade out all of the thumbnails
    this.$el.find('.lens-thumbnail').fadeTo('fast',
        this.options.thumbnailOpacity);

    this.$el.find('.lens-image-container' + query).fadeIn();

    // fade in the correct thumbnail
    this.$el.find('.lens-thumbnail' + query).fadeTo('fast', 1);
  };

  // Funnily named method for inserting the retina image divs into the
  // gallery. They will only request an image if we are on a retina device.
  Lens.prototype._insertRetinas = function() {
    var self = this;
    $.each(this.images, function(index, image) {
      var query = '.lens-image-container[data-lens-index="' + index + '"]';
      var template = '"<div class="lens-image retina"></div>';

      // hacky, I know
      var template = [
        '<div class="lens-retina-wrapper">',
        '<div class="lens-image retina"></div>',
        '</div>'
      ];
      var template = template.join('');

      var $imageWrapper = $('<div></div>').html(template).contents();
      var $img = $imageWrapper.children('.lens-image');
      var url = self.options.retinaPath(image.src);

      // find the standard version
      var $standard = self.$el.find(query).find('.lens-image').first();

      // make sure the standard url is set
      $standard.css('background-image', 'url(' + image.src + ')');

      // wrap the standard version in a wrapper so we can hide it
      $standard.wrap('<div class="lens-standard-wrapper" />');

      var $standardWrapper = self.$el.find(query).find('.lens-standard-wrapper').first();

      // set the retina background
      $img.css('background-image', 'url(' + url + ')');

      // insert our image
      $imageWrapper.insertBefore($standardWrapper);
    });
  };

  Lens.prototype._createThumbnails = function() {
    var self = this;
    var $container = this.$el.children('.lens-thumbnail-container');
    if ($container.length < 1) {
      this.$el.prepend('<div class="lens-thumbnail-container"></div>');
      $container = this.$el.children('.lens-thumbnail-container');
    }

    $.each(this.images, function(index, image) {
      var template = '<img class="lens-thumbnail">';
      var $thumb = $('<div></div>').html(template).contents();
      var src = self.options.thumbnailPath(image.src);
      $thumb.attr('src', src);
      $thumb.attr('data-lens-index', index);
      $container.append($thumb);

      $thumb.click(function() {
        self.showImage.apply(self, [$(this).attr('data-lens-index')]);
      });
    });
  };

  // Initializes the plugin for this instance
  Lens.prototype.init = function() {
    this.images = {};

    // create the image models and indexes (our data backed plugin)
    var self = this;
    this.$el.find('.lens-image-container').each(function(index, container) {
      var image = {};
      image.src = $(container).find('.lens-image').first().attr('data-image');
      self.images[index] = image;
      $(container).attr('data-lens-index', index);
      self._hideImages();
    });

    // create our thumbnails
    this._createThumbnails();

    // insert our retina images
    this._insertRetinas();

    this.showImage(0);
  };

  // Plugin wrapper for jQuery
  $.fn.lens = function(options) {
    return this.each(function() {
      if (!$.data(this, 'plugin-lens')) {
        var plugin = new Lens(this, options);
        $.data(this, 'plugin-lens', plugin);
      }
    });
  }
}(jQuery));
