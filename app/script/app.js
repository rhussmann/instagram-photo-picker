$(function () {
  $.get('/posts.json', function(posts) {
    $.get('/templates/thumbnails.html.mustache', function(template) {
      var ITEMS_PER_ROW = 4;
      var START_INDEX = 0;
      var TOTAL_NUM = 200;
      var model = {
        rows: []
      };

      posts = posts.filter((p) => {return p.type === 'image';});
      for (var i = START_INDEX; i < TOTAL_NUM; i += ITEMS_PER_ROW) {
        model.rows.push({images: posts.slice(i, i + ITEMS_PER_ROW)});
      }
      var html = Mustache.render(template, model);
      $('#testing').html(html);

      $('.rhpreview').click(function(){
        $(this).toggleClass('rhselected');
      });
    });
  });

  new Clipboard('.btn', {
    text: function() {
      return $('.rhselected').map(function(i, elem) {
        return $(elem).attr('src');
      }).toArray().join(',');
    }
  });
});
