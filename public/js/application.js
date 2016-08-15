$(document).ready(function() {
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
  var errors = JSON.parse(response.responseText);
  var fields_with_errors = Object.keys(errors);

  for(var i = 0; i < fields_with_errors.length; i++) {
    $("#" + fields_with_errors[i]).append(`<span class="error">${errors[fields_with_errors[i]]}</span>`);
  }
}
