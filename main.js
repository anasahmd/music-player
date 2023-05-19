import songs from './songs.js';

const coverImage = document.querySelector('.cover-image');
const songTitle = document.querySelector('.song-title');
const songArtist = document.querySelector('.song-artist');
const btnNext = document.querySelector('.btn-next');
const btnPrev = document.querySelector('.btn-prev');
const btnPlay = document.querySelector('.btn-play');

// for (let song of songs) {
// 	if (song.cover) {
// 		var blob = new Blob([new Uint8Array(song.cover.data)], {
// 			type: song.cover.format,
// 		});
// 		var url = URL.createObjectURL(blob);
// 		const img = document.createElement('img');
// 		document.body.appendChild(img);
// 		img.setAttribute('src', url);
// 	}
// }

var blob = new Blob([new Uint8Array(songs[1].cover.data)], {
	type: songs[0].cover.format,
});
var url = URL.createObjectURL(blob);
const img = document.createElement('img');
coverImage.appendChild(img);
img.setAttribute('src', url);

songTitle.innerHTML = songs[1].title;
songArtist.innerHTML = songs[1].artist;

btnNext.addEventListener('click', () => {});

function musicPlayer() {
	let playing = false;
	let currentTrack = 0;
}
