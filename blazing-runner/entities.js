// entities.js
// 'game.js' থেকে GameState ইম্পোর্ট করা হয়েছে
import { GameState } from './game.js'; 

// --- ব্যাকগ্রাউন্ড এলিমেন্ট: Parallax Mountains ---
export class Mountains {
    constructor(canvas, GROUND_Y) {
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.GROUND_Y = GROUND_Y;
        this.mountainX = 0;
    }
    draw(GAME_SPEED) {
        // Delta Time এর সমতা বজায় রাখার জন্য একটি অনুমানমূলক মান
        const speedFactor = 0.2; 
        const FIXED_MOVEMENT = (GAME_SPEED / 1000) * (1000/60); 

        this.mountainX = (this.mountainX - FIXED_MOVEMENT * speedFactor) % this.width;

        this.ctx.fillStyle = '#1e1e3f'; 

        for (let i = 0; i < 2; i++) {
            const xOffset = this.mountainX + i * this.width;
            
            this.ctx.beginPath();
            this.ctx.moveTo(xOffset - 100, this.GROUND_Y);
            this.ctx.lineTo(xOffset + 250, this.GROUND_Y - 120);
            this.ctx.lineTo(xOffset + 500, this.GROUND_Y - 70);
            this.ctx.lineTo(xOffset + 850, this.GROUND_Y - 180);
            this.ctx.lineTo(xOffset + 1000, this.GROUND_Y);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }
}

// --- প্লেয়ার অবজেক্ট (Delta Time & Adaptive) ---
export class Player {
    constructor(canvas, GROUND_Y, MAX_JUMP_VELOCITY, soundManager) {
        this.ctx = canvas.getContext('2d');
        this.soundManager = soundManager;
        this.GROUND_Y = GROUND_Y;

        this.baseGravity = 1800; // (px/s^2)
        this.baseMaxJumpVelocity = MAX_JUMP_VELOCITY; // (px/s)

        this.gravity = this.baseGravity; 
        this.MAX_JUMP_VELOCITY = this.baseMaxJumpVelocity; 
        
        this.initialY = GROUND_Y - 50;
        this.x = 50; this.y = this.initialY; this.width = 30; this.height = 50;
        this.velocityY = 0; this.isJumping = false;
        this.hitboxOffset = {x: 5, y: 5, width: -10, height: -5}; 

        // AI ট্র্যাকিং ভেরিয়েবল
        this.successfulJumps = 0; 
    }

    reset() {
        this.y = this.initialY;
        this.velocityY = 0;
        this.isJumping = false;
        this.successfulJumps = 0; 
        this.gravity = this.baseGravity; 
        this.MAX_JUMP_VELOCITY = this.baseMaxJumpVelocity; 
    }

    draw(frameCount, gameState) {
        this.ctx.shadowColor = '#FF00FF'; 
        this.ctx.shadowBlur = 10;
        this.ctx.fillStyle = '#FF00FF'; 
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.shadowBlur = 0; 

        if (gameState === GameState.RUNNING && !this.isJumping) {
            this.ctx.fillStyle = (frameCount % 8 < 4) ? '#00FFFF' : '#00AABB'; 
            this.ctx.fillRect(this.x + 5, this.y + this.height - 10, 5, 10); 
            this.ctx.fillRect(this.x + 20, this.y + this.height - 10, 5, 10);
        }
    }
    
    // ফিজিক্স আপডেট: dt হলো ডেল্টা টাইম (সেকেন্ডে)
    update(dt) {
        this.velocityY += this.gravity * dt;
        this.y += this.velocityY * dt;

        if (this.y + this.height > this.GROUND_Y) {
            this.y = this.GROUND_Y - this.height;
            this.velocityY = 0;
            this.isJumping = false;
        }
    }
    
    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.velocityY = this.MAX_JUMP_VELOCITY; 
            this.soundManager.playJump();
        }
    }
    
    getHitbox() {
        return {
            x: this.x + this.hitboxOffset.x,
            y: this.y + this.hitboxOffset.y,
            width: this.width + this.hitboxOffset.width,
            height: this.height + this.hitboxOffset.height
        };
    }
}

// --- বাধা অবজেক্ট ---
export class Obstacle {
    constructor(canvas, GROUND_Y, customHeight) {
        this.ctx = canvas.getContext('2d');
        this.width = Math.random() * 20 + 20;
        this.height = customHeight || (Math.random() * 30 + 30);
        this.y = GROUND_Y - this.height;
        this.x = canvas.width;
        this.color = '#FF00FF'; 
        this.passed = false; // AI ট্র্যাকিং এর জন্য
    }
    draw() {
        this.ctx.shadowColor = '#FF00FF';
        this.ctx.shadowBlur = 10;
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.shadowBlur = 0;
    }
    update(GAME_SPEED) {
        const FIXED_MOVEMENT = (GAME_SPEED / 1000) * (1000/60); 
        this.x -= FIXED_MOVEMENT;
    }
}