// audio.js
// IMPORTANT: Please create an 'assets' folder and place your sound files inside.
const ASSET_PATH = 'assets/';

export class SoundManager {
    constructor() {
        this.jumpSound = this.loadSound('jump.mp3'); 
        this.gameOverSound = this.loadSound('game_over.mp3'); 
        this.boostSound = this.loadSound('boost.mp3');
    }

    loadSound(filename) {
        try {
            const audio = new Audio(ASSET_PATH + filename);
            audio.preload = 'auto'; 
            return audio;
        } catch (e) {
            console.error(`Failed to load audio: ${filename}`, e);
            // যদি লোড না হয়, একটি ডামি অবজেক্ট ফেরত দাও
            return { play: () => console.warn(`Sound file not available: ${filename}`) };
        }
    }

    playSound(audioElement) {
        if (audioElement && audioElement.src) {
            audioElement.currentTime = 0; 
            audioElement.play().catch(e => {
                console.warn("Sound playback blocked by browser policy. Try interacting first.", e);
            });
        }
    }

    playJump() { this.playSound(this.jumpSound); }
    playGameOver() { this.playSound(this.gameOverSound); }
    playBoost() { this.playSound(this.boostSound); }
}