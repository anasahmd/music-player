class Song {
	constructor(fileName, title, artist, cover) {
		this.fileName = fileName;
		this.title = title;
		this.artist = artist;
		this.cover = cover;
	}
}

export default async function createSongs(files) {
	let songs = [];
	for (let file of files) {
		const song = await createSong(file);
		songs.push(song);

		async function createSong(file) {
			return new Promise(function (resolve, reject) {
				jsmediatags.read(file, {
					onSuccess: function (tag) {
						const fileName = URL.createObjectURL(file);
						const title = tag.tags.title ? tag.tags.title : file.name;
						const artist = tag.tags.artist ? tag.tags.artist : 'Unknown';
						const cover = tag.tags.picture;
						const song = new Song(fileName, title, artist, cover);
						resolve(song);
					},
					onError: function (error) {
						// reject(console.log(':(', error.type, error.info));
						reject(new Error('Unsupported file format!'));
					},
				});
			});
		}
	}
	return songs;
}
