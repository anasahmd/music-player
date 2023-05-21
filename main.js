import createSong from './songs.js';

const input = document.getElementById('audio-input');
const fileInputDiv = document.querySelector('.file-input-div');
const coverImage = document.querySelector('.cover-image');
const songTitle = document.querySelector('.song-title');
const songArtist = document.querySelector('.song-artist');
const btnNext = document.querySelector('.btn-next');
const btnPrev = document.querySelector('.btn-prev');
const btnPlay = document.querySelector('.btn-play');
const btnShuffle = document.querySelector('.btn-shuffle');
const btnRepeat = document.querySelector('.btn-repeat');
const totalDuration = document.querySelector('.total-duration');
const playedDuration = document.querySelector('.played-duration');
const progressBar = document.getElementById('progress-bar');
const musicContainer = document.querySelector('.music-container');

let musicControl;
let songs;

function createMusicControl() {
	let currentPlaying = 0;
	let isPlaying = false;
	let audio = document.createElement('audio');
	let isSeeking = false;
	let isShuffling = false;
	let isRepeating = false;

	function render() {
		let song = songs[currentPlaying];
		audio.src = song.fileName;
		document.body.appendChild(audio);
		coverImage.src = song.cover ? song.cover : './images/default.png';
		songTitle.innerHTML = song.title;
		songArtist.innerHTML = song.artist;
	}
	render();

	audio.addEventListener('loadedmetadata', () => {
		totalDuration.innerHTML = formatTime(audio.duration);
	});

	audio.addEventListener('timeupdate', () => {
		if (!isSeeking) {
			const progress = (audio.currentTime / audio.duration) * 100;
			progressBar.value = progress * 5;
			progressBar.style.background = `linear-gradient(to right, #fff ${progress}%, #333 ${progress}%)`;
			playedDuration.innerHTML = formatTime(audio.currentTime);
		}
	});

	audio.addEventListener('ended', () => {
		if (isRepeating) {
			repeat();
		} else if (isShuffling) {
			shuffle();
		} else {
			next();
		}
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
		if (audio.currentTime < 5) {
			if (currentPlaying <= 0) {
				currentPlaying = songs.length - 1;
			} else {
				currentPlaying -= 1;
			}
		}

		render();
		play();
	}

	function repeat() {
		render();
		play();
	}

	function shuffle() {
		let random = Math.floor(Math.random() * songs.length);
		currentPlaying = random;
		render();
		play();
	}

	function setSeeking(bool) {
		isSeeking = bool;
	}

	function seekAudio(value) {
		const progress = (audio.duration / 500) * value;
		audio.currentTime = progress;
	}

	function updateProgressBarSeek(value) {
		const time = (audio.duration / 500) * value;
		const progress = (time / audio.duration) * 100;
		progressBar.value = progress * 5;
		progressBar.style.background = `linear-gradient(to right, #fff ${progress}%, #333 ${progress}%)`;
		playedDuration.innerHTML = formatTime(time);
	}

	function changeShuffleMode() {
		if (isShuffling) {
			isShuffling = false;
			btnShuffle.children[0].style.color = '#333';
		} else {
			isShuffling = true;
			btnShuffle.children[0].style.color = '#fff';
		}
	}

	function changeRepeatMode() {
		if (isRepeating) {
			isRepeating = false;
			btnRepeat.children[0].style.color = '#333';
		} else {
			isRepeating = true;
			btnRepeat.children[0].style.color = '#fff';
		}
	}

	return {
		playPause,
		next,
		prev,
		seekAudio,
		setSeeking,
		updateProgressBarSeek,
		changeShuffleMode,
		changeRepeatMode,
	};
}

input.addEventListener('change', (e) => {
	let files = e.target.files;
	createSong(files)
		.then((data) => {
			songs = data;
			musicControl = createMusicControl();
			fileInputDiv.classList.add('hidden');
			musicContainer.classList.remove('hidden');
		})
		.catch((e) => {
			input.value = '';
			alert('Unsupported file format!');
		});
});

btnPlay.addEventListener('click', () => {
	musicControl.playPause();
});

btnNext.addEventListener('click', () => {
	musicControl.next();
});

btnPrev.addEventListener('click', () => {
	musicControl.prev();
});

btnShuffle.addEventListener('click', () => {
	musicControl.changeShuffleMode();
});

btnRepeat.addEventListener('click', () => {
	musicControl.changeRepeatMode();
});

progressBar.addEventListener('mousedown', () => {
	musicControl.setSeeking(true);
});

progressBar.addEventListener('touchstart', () => {
	musicControl.setSeeking(true);
});

progressBar.addEventListener('input', () => {
	musicControl.updateProgressBarSeek(progressBar.value);
});

progressBar.addEventListener('mouseup', () => {
	musicControl.setSeeking(false);
	musicControl.seekAudio(progressBar.value);
});

progressBar.addEventListener('touchend', () => {
	musicControl.setSeeking(false);
	musicControl.seekAudio(progressBar.value);
});

function formatTime(seconds) {
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = Math.round(seconds % 60);
	return [h, m > 9 ? m : h ? '0' + m : m || '0', s > 9 ? s : '0' + s]
		.filter(Boolean)
		.join(':');
}
