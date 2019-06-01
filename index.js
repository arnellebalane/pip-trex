const runner = new Runner('.interstitial-wrapper');

const button = document.querySelector('button');
const canvas = document.querySelector('.runner-canvas');
const audio = document.querySelector('audio');
const video = document.createElement('video');
video.srcObject = canvas.captureStream();

if (document.pictureInPictureEnabled) {
    function simulateSpacebar() {
        const keyboardEventOptions = {
            code: 'Space',
            keyCode: 32,
        };

        if (runner.crashed) {
            const event = new KeyboardEvent('keyup', keyboardEventOptions);
            runner.onKeyUp(event);
        } else {
            const event = new KeyboardEvent('keydown', keyboardEventOptions);
            runner.onKeyDown(event);
        }
    }

    video.addEventListener('enterpictureinpicture', () => {
        button.textContent = 'Exit Picture-in-Picture';
    });

    video.addEventListener('leavepictureinpicture', () => {
        button.textContent = 'Enter Picture-in-Picture';
    });

    button.addEventListener('click', async () => {
        if (video.paused) {
            await audio.play();
            await video.play();
        }

        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
        } else {
            await video.requestPictureInPicture();
        }

        simulateSpacebar();
    });

    navigator.mediaSession.setActionHandler('play', simulateSpacebar);
    navigator.mediaSession.setActionHandler('pause', simulateSpacebar);
} else {
    button.disabled = true;
    button.textContent = 'Picture-in-Picture is not supported.';
}
