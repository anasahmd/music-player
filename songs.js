let fileNames;
let songs = [];

const input = document.getElementById('audio-input');

input.addEventListener('change', (e) => {
	fileNames = e.target.files;
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
	for (let fileName of fileNames) {
		await createSong(fileName);

		function createSong(fileName) {
			return new Promise(function (resolve, reject) {
				jsmediatags.read(fileName, {
					onSuccess: function (tag) {
						const song = new Song(
							fileName,
							tag.tags.title,
							tag.tags.artist,
							tag.tags.picture
						);
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
