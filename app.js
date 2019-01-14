const video = document.getElementById('video');
const button = document.getElementById('button');
const select = document.getElementById('select');
const canvas = document.getElementById('canvas');
const img = document.getElementById('img');
const shot = document.getElementById('shot')
let currentStream;

button.addEventListener('click', event => {
	if (typeof currentStream !== 'undefined') {
		stopMediaTracks(currentStream);
	}
	const videoConstraints = {};
	if (select.value === '') {
		videoConstraints.facingMode = 'environment';
	} else {
		videoConstraints.deviceId = {exact: select.value};
	}
	const constraints = {
		video: videoConstraints,
		audio: false
	};
	navigator.mediaDevices
		.getUserMedia(constraints)
		.then(stream => {
			currentStream = stream;
			video.srcObject = stream;
			return navigator.mediaDevices.enumerateDevices();
		})
		.then(gotDevices)
		.catch(error => {
			console.error(error);
		});
});

shot.addEventListener('click', screenShot)

function stopMediaTracks(stream) {
	stream.getTracks().forEach(track => {
		track.stop();
	});
}

function gotDevices(mediaDevices) {
	select.innerHTML = '';
	select.appendChild(document.createElement('option'));
	let count = 1;
	mediaDevices.forEach(mediaDevice => {
		if (mediaDevice.kind === 'videoinput') {
			const option = document.createElement('option');
			option.value = mediaDevice.deviceId;
			const label = mediaDevice.label || `Camera ${count++}`;
			const textNode = document.createTextNode(label);
			option.appendChild(textNode);
			select.appendChild(option);
		}
	});
}

function screenShot() {
	canvas.getContext('2d').drawImage(video, 0, 0, 400, 300);

	img.src = canvas.toDataURL("image/png");
}

navigator.mediaDevices.enumerateDevices().then(gotDevices)