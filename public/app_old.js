/*$.getJSON('/articles', function(data) {
  for (var i = 0; i<data.length; i++){
    $('#articles').append('<p data-id="' + data[i]._id + '">'+ data[i].title + '<br />'+ data[i].summary + '</p>');
  }
});*/

$(document).on('click', '#scrapeBtn', function(){  var thisId = $(this).attr('data-id');

  $.ajax({
    method: "GET",
    url: "/scrape",
    data: {
      title: $('#titleinput').val(),
      body: $('#bodyinput').val()
    }
  })
    .done(function( data ) {
      console.log('post articles ', data);
      $('#notes').empty();
    });
});


  var thisId = $(this).attr('data-id');

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $('#titleinput').val(),
      body: $('#bodyinput').val()
    }
  })
    .done(function( data ) {
      console.log('post articles ', data);
      $('#notes').empty();
    });
  $('#titleinput').val("");
  $('#bodyinput').val("");
});



var noteId;
$(document).on('click', 'p', function(){
  $('#notes').empty();
  var thisId = $(this).attr('data-id');

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    .done(function( data ) {
      console.log('get articles ',data);
//      console.log('data note', data.note._id);
//      noteId = data.note._id;
      $('#notes').append('<h2>' + data.title + '</h2>');
      $('#notes').append('<input id="titleinput" name="title" >');
      $('#notes').append('<textarea id="bodyinput" name="body"></textarea>');
      $('#notes').append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');
//      $('#notes').append('<button data-id="' + data.note._id + '" id="delnote">Delete Note</button>');

      if(data.note){
        $('#titleinput').val(data.note.title);
        $('#bodyinput').val(data.note.body);
      $('#notes').append('<button data-id="' + data.note._id + '" id="delnote">Delete Note</button>');
      }
    });
});

$(document).on('click', '#savenote', function(){
  var thisId = $(this).attr('data-id');

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $('#titleinput').val(),
      body: $('#bodyinput').val()
    }
  })
    .done(function( data ) {
      console.log('post articles ', data);
      $('#notes').empty();
    });


  $('#titleinput').val("");
  $('#bodyinput').val("");
});


$(document).on('click', '#delnote', function(){
  var thisId = $(this).attr('data-id');
  console.log('thisId ', thisId);

  $.ajax({
    method: "GET",
    url: "/delete/" + thisId,
    data: {
      title: $('#titleinput').val(),
      body: $('#bodyinput').val()
    }
  })
    .done(function( data ) {
      console.log('post articles ', data);
      $('#notes').empty();
    });


  $('#titleinput').val("");
  $('#bodyinput').val("");
});
