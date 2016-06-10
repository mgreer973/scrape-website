/*$.getJSON('/articles', function(data) {
  for (var i = 0; i<data.length; i++){
    $('#articles').append('<p data-id="' + data[i]._id + '">'+ data[i].title + '<br />'+ data[i].link + '</p>');
  }
});*/

$(document).on('click', '#loadBtn', function(){
  $('#articles').empty();
  console.log('loadBtn clicked')
  $.ajax({
    method: "GET",
    url: "/articles",
  })
    .done(function( data ) {
      console.log('load data ', data);
  for (var i = 0; i<data.length; i++){
    $('#articles').append('<p data-id="' + data[i]._id + '">'+ data[i].title + '<br />'+ data[i].summary + '</p>');
  }

    });
});

$(document).on('click', '#scrapeBtn', function(){
  console.log('scrapeBtn clicked')
  $.ajax({
    method: "GET",
    url: "/scrape",
  })
    .done(function( data ) {
      console.log('data ', data);
    });
});

$(document).on('click', 'p', function(){
  $('#notes').empty();
  $('#delNote').empty();

  var thisId = $(this).attr('data-id');
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    .done(function( data ) {
//      console.log('get articles ',data);
      console.log('data note', data.note);
      if (data.note) {
          console.log('note id ', data.note._id);
          console.log('data.note there');
          $('#delNote').append('<h2>' + data.title + '</h2>');
          $('#delNote').append('<input id="titleinput" name="title" >');
          $('#delNote').append('<textarea id="bodyinput" name="body"></textarea>');
          $('#delNote').append('<button data-id="' + data._id + '" note-id="' + data.note._id  + '" id="delnote">Delete Note</button>');
          $('#titleinput').val(data.note.title);
          $('#bodyinput').val(data.note.body);
//      if(data.note){
//            $('#titleinput').val(data.note.title);
//            $('#bodyinput').val(data.note.body);
      } else {
        console.log('data.note missing');
      $('#notes').append('<h2>' + data.title + '</h2>');
      $('#notes').append('<input id="titleinput" name="title" >');
      $('#notes').append('<textarea id="bodyinput" name="body"></textarea>');
      $('#notes').append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');
      } 
/*      $('#notes').append('<h2>' + data.title + '</h2>');
      $('#notes').append('<input id="titleinput" name="title" >');
      $('#notes').append('<textarea id="bodyinput" name="body"></textarea>');
      $('#notes').append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');
//      $('#notes').append('<button data-id="' + data._id + '" id="delnote">Delete Note</button>');
/*      if(data.note){
        $('#titleinput').val(data.note.title);
        $('#bodyinput').val(data.note.body);
      }*/
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
//  var thisId = $(this).attr('data-id');

  $.ajax({
    method: "GET",
    url: "/delete",
    data: {
      articleId: $(this).attr('data-id'),
      noteId: $(this).attr('note-id')
    }
  })
    .done(function( data ) {
      console.log('post articles ', data);
      $('#delnote').empty();
    });
  $('#titleinput').val("");
  $('#bodyinput').val("");
});
