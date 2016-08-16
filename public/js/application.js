$(document).ready(function() {
  // what element is my event being bound to?
  // are these elements always on the page when it loads?
    //always - no need for event delegation
    //sometimes/never - event delegation
  // what event are we binding to that element?
  // do we have an default behavior to prevent?

  // make sure your event is bound, by console.log(ing) something

  // ajax call
    // where is the url coming from?
    // where is the method coming?
    // do we need to send any data?

    //controller
      // route
      // do I have to consider this working for non-ajax
      // what data are we receiving?
      // p params
      // what am I doing with that data?
      // what am I sending back to the front end (html - partial, json)

    // console.log the response in done to make sure you are getting back the right thing

    // ajax call continued
    // decide what to do with that data that comes back (if any)
    // decide if you need to update the DOM

  $("#songsContainer").on("click", "i.fa-trash", function(event){
    event.preventDefault();

    var $row = $(this).parent().parent();
    var url = "/tracks/" + $row.attr("data-song-id");

    $.ajax({
      url: url,
      method: "DELETE",
    }).done(function(response){
      $row.remove();
    });

  });


  $("#playlistsContainer tr").on("click", function(event){
    var $row = $(this);
    var playlistId = $row.attr("data-playlist-id");
    var url = "/playlists/" + playlistId;

    $.ajax({
      url: url
    }).done(function(response) {
      $("#songsContainer tbody").html(buildSongs(response));
      $(".info").removeClass("info"); //clear other selected playlist
      $("#songsContainer").show('slow');
      $("#addSongContainer").show('slow');
      $row.addClass("info"); // indicate this playlist was selected
      $("#addSongContainer form").attr("action", url + "/tracks"); //set the form to add songs to this playlist
    })
  });

  $("#addSongContainer form").on("submit", function(event){
    event.preventDefault();
    var $form = $(this);

    $.ajax({
      url: $form.attr("action"),
      method: $form.attr("method"),
      data: $form.serialize()
    }).done(function(response){
      $("span.error").remove();
      $form.trigger("reset");
      $("#songsContainer tbody").append(buildSong(response));
    }).fail(processErrors);
  });
});

function buildSongs(data) {
  var allSongs = "";

  for(var i = 0; i < data.length; i++) {
    allSongs += buildSong(data[i]);
  }

  return allSongs;
}

function buildSong(songData) {
  return `<tr data-song-id="${songData.id}">
            <td>${songData.title}</td>
            <td>${songData.artist}</td>
            <td><i class="fa fa-trash" aria-hidden="true"></i></td>
          </tr>`;
}

function processErrors(response) {
  console.log(response);
  var errors = JSON.parse(response.responseText);
  var fields_with_errors = Object.keys(errors);

  for(var i = 0; i < fields_with_errors.length; i++) {
    $("#" + fields_with_errors[i]).append(`<span class="error">${errors[fields_with_errors[i]]}</span>`);
  }
}
