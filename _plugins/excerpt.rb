# This goes in _plugins/excerpt.rb
module Jekyll
  class Post
    alias_method :original_to_liquid, :to_liquid
    def to_liquid
      original_to_liquid.deep_merge({
        'excerpt' => content.match('<!--more-->') ? content.split('<!--more-->').first : nil
      })
    end
  end
  
  module Filters
    def mark_excerpt(content)
      more_position = content.index('<!--more-->')
      if more_position
        content.insert(more_position, '</div>')
        content.insert(0, '<div class="excerpt">')
        content.gsub('<!--more-->', '<p><span id="more"></span></p>')
      end
      content
    end
  end
end
