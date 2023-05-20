const fileNames = ['1', '2', '3', '4', '5'];

let songs = [];

class Song {
	constructor(fileName, title, artist, cover) {
		this.fileName = 'Music/' + fileName + '.mp3';
		this.title = title;
		this.artist = artist;
		this.cover = cover;
	}
}

for (let fileName of fileNames) {
	await createSong(fileName);
	function createSong(fileName) {
		return new Promise(function (resolve, reject) {
			const data = jsmediatags.read(
				window.location.href + '/Music/' + fileName + '.mp3',
				{
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
				}
			);
		});
	}
}

export default songs;
