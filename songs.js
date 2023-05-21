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
	}
	return songs;
}

async function createSong(file) {
	const tag = await getMetaData(file);

	const fileName = URL.createObjectURL(file);
	const title = tag.tags.title ? tag.tags.title : file.name;
	const artist = tag.tags.artist ? tag.tags.artist : 'Unknown';
	const cover = tag.tags.picture;
	const song = new Song(fileName, title, artist, cover);
	return song;
}

function getMetaData(file) {
	return new Promise(function (resolve, reject) {
		jsmediatags.read(file, {
			onSuccess: function (tag) {
				resolve(tag);
			},
			onError: function (error) {
				reject(new Error('Unsupported file format!'));
			},
		});
	});
}
