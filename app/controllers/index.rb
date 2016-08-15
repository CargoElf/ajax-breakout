get '/' do
  @playlists = Playlist.all
  erb :index
end

get '/playlists/:id' do
  content_type :json
  Playlist.find_by(id: params[:id]).tracks.to_json
end

post '/playlists/:id/tracks' do
  @track = Track.new(params[:song])

  if @track.save
    @playlist = Playlist.find_by(id: params[:id])
    @playlist.tracks << @track
    content_type :json
    @track.to_json
  else
    status 422
    body @track.errors.to_json
  end
end