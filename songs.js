let files;
let songs = [];

const input = document.getElementById('audio-input');

input.addEventListener('change', (e) => {
	files = e.target.files;
});

class Song {
	constructor(fileName, title, artist, cover) {
		this.fileName = fileName;
		this.title = title;
		this.artist = artist;
		this.cover = cover;
	}
}

export default async function createSongs() {
	for (let file of files) {
		await createSong(file);

		function createSong(file) {
			return new Promise(function (resolve, reject) {
				jsmediatags.read(file, {
					onSuccess: function (tag) {
						const fileName = URL.createObjectURL(file);
						const title = tag.tags.title ? tag.tags.title : file.name;
						const artist = tag.tags.artist ? tag.tags.artist : 'Unknown';
						const cover = tag.tags.picture;
						const song = new Song(fileName, title, artist, cover);
						resolve(songs.push(song));
					},
					onError: function (error) {
						reject(console.log(':(', error.type, error.info));
					},
				});
			});
		}
	}
	return songs;
}
