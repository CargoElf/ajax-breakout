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
      $("#addSongContainer form").attr("action", url + "/songs"); //set the form to add songs to this playlist
    })
  });

  $("#songsContainer").on("click", "i.fa-trash", function(){
    var $row = $(this).parent().parent();
    var songId = $row.attr("data-song-id");

    $.ajax({
      url: "/songs/" + songId,
      method: "DELETE"
    }).done(function(response){
      $row.remove();
    });
  })
});

function buildSongs(data) {
  var allSongs = "";

  for(var i = 0; i < data.length; i++) {
    allSongs += `<tr data-song-id="${data[i].id}">
              <td>${data[i].title}</td>
              <td>${data[i].artist}</td>
              <td><i class="fa fa-trash" aria-hidden="true"></i></td>
            </tr>`;
  }
  return allSongs;
}
