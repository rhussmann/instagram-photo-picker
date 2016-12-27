$(function () {
  if (!docCookies.hasItem('connect.sid')) {
    window.location = '/api/auth/instagram';
    return;
  }
  $.get('/api/posts', function(posts) {
    $.get('/templates/thumbnails.html.mustache', function(template) {
      var ITEMS_PER_ROW = 4;
      var START_INDEX = 0;
      var TOTAL_NUM = 200;
      var model = {
        rows: []
      };

      posts = posts.data.filter((p) => {return p.type === 'image';});
      for (var i = START_INDEX; i < TOTAL_NUM; i += ITEMS_PER_ROW) {
        model.rows.push({images: posts.slice(i, i + ITEMS_PER_ROW)});
      }
      var html = Mustache.render(template, model);
      $('#testing').html(html);

      $('#montage-button').click(function() {
        var selectedItems = $('.rhselected').map(function(i, elem) {
          return $(elem).attr('src');
        }).toArray();

        $.ajax({
          url: '/api/montage',
          type: 'POST',
          data: JSON.stringify(selectedItems),
          contentType: 'application/json; charset=utf-8',
          success: function _success(data) {
            var img = document.createElement('img');
            img.src = 'data:image/png;base64,' + data;
            $('#testing').html(img);
          }
        });
      });

      $('.rhpreview').click(function(){
        $(this).toggleClass('rhselected');
      });
    });
  });

  new Clipboard('#copy-button', {
    text: function() {
      return $('.rhselected').map(function(i, elem) {
        return '"' + $(elem).attr('src') + '"';
      }).toArray().join(',');
    }
  });
});
