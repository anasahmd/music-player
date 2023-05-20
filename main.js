import songs from './songs.js';

const coverContainer = document.querySelector('.cover-container');
const coverImage = document.querySelector('.cover-image');
const songTitle = document.querySelector('.song-title');
const songArtist = document.querySelector('.song-artist');
const btnNext = document.querySelector('.btn-next');
const btnPrev = document.querySelector('.btn-prev');
const btnPlay = document.querySelector('.btn-play');
const progress = document.querySelector('.progress');
const totalDuration = document.querySelector('.total-duration');
const playedDuration = document.querySelector('.played-duration');
const progressBar = document.getElementById('progress-bar');

function createMusicControl() {
	let currentPlaying = 0;
	let isPlaying = false;
	let audio = document.createElement('audio');
	let isSeeking = false;

	function render() {
		let song = songs[currentPlaying];

		audio.src = songs[currentPlaying].fileName;
		// audio.controls = true;
		progress.appendChild(audio);

		let blob = new Blob([new Uint8Array(song.cover.data)], {
			type: song.cover.format,
		});
		var url = URL.createObjectURL(blob);
		coverImage.src = url;

		songTitle.innerHTML = song.title;
		songArtist.innerHTML = song.artist;
		audio.onloadedmetadata = function () {
			totalDuration.innerHTML = formatTime(audio.duration);
		};
		audio.addEventListener('timeupdate', () => {
			if (!isSeeking) {
				const progress = (audio.currentTime / audio.duration) * 100;
				progressBar.value = progress * 5;
				progressBar.style.background = `linear-gradient(to right, #fff ${progress}%, #333 ${progress}%)`;
				playedDuration.innerHTML = formatTime(audio.currentTime);
			}
		});
	}
	render();

	audio.addEventListener('ended', () => {
		next();
	});

	function play() {
		isPlaying = true;
		audio.play();
		btnPlay.children[0].classList = 'fa fa-pause';
	}

	function pause() {
		isPlaying = false;
		audio.pause();
		btnPlay.children[0].classList = 'fa fa-play';
	}

	function playPause() {
		if (isPlaying) {
			pause();
		} else {
			play();
		}
	}

	function next() {
		if (currentPlaying >= songs.length - 1) {
			currentPlaying = 0;
		} else {
			currentPlaying += 1;
		}
		render();
		play();
	}

	function prev() {
		if (currentPlaying <= 0) {
			currentPlaying = songs.length - 1;
		} else {
			currentPlaying -= 1;
		}
		render();
		play();
	}

	function setSeeking(bool) {
		isSeeking = bool;
	}

	function seek(value) {
		const progress = (audio.duration / 500) * value;
		audio.currentTime = progress;
	}

	function seeking(value) {
		const time = (audio.duration / 500) * value;
		const progress = (time / audio.duration) * 100;
		progressBar.value = progress * 5;
		progressBar.style.background = `linear-gradient(to right, #fff ${progress}%, #333 ${progress}%)`;
		playedDuration.innerHTML = formatTime(time);
	}

	return {
		playPause,
		next,
		prev,
		seek,
		setSeeking,
		seeking,
	};
}

let musicControl = createMusicControl();

btnPlay.addEventListener('click', () => {
	musicControl.playPause();
});

btnNext.addEventListener('click', () => {
	musicControl.next();
});

btnPrev.addEventListener('click', () => {
	musicControl.prev();
});

progressBar.addEventListener('mousedown', () => {
	musicControl.setSeeking(true);
});

progressBar.addEventListener('input', () => {
	musicControl.seeking(progressBar.value);
});

progressBar.addEventListener('mouseup', () => {
	musicControl.setSeeking(false);
	musicControl.seek(progressBar.value);
});

function formatTime(seconds) {
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = Math.round(seconds % 60);
	return [h, m > 9 ? m : h ? '0' + m : m || '0', s > 9 ? s : '0' + s]
		.filter(Boolean)
		.join(':');
}
