const canvas = document.querySelector('canvas')
const ctx = canvas.getContext("2d")
const con = document.getElementById("console")

var background = new Image();
background.src = "assets/temple.jpg"
function drawBackground(){
    ctx.drawImage(background,0,0, canvas.width, canvas.height);  
}
background.onload = function(){
    drawBackground() 
}
const batman = new Image()
batman.src = "assets/batman.png"
const mummy = new Image()
mummy.src = "assets/mummy.png"
damageImages = []
for (let i=0; i<10; i++){
    damageImages[i] = new Image()
    damageImages[i].src = "assets/damages/"+i+".PNG"
}

canvas.width = innerWidth;
canvas.height = innerHeight;
const size = canvas.height/2;
const friction = 0.99

class Hero {
    constructor(x, y){
        this.x = x
        this.y = y
    }

    draw(){
	    ctx.drawImage(batman, this.x - size / 2, this.y - size / 2, size, size)
    }
}

class Enemy {
    constructor(x, y){
        this.x = x
        this.y = y
    }

    draw(){
	    ctx.drawImage(mummy, this.x - size / 2, this.y - size / 2, size, size)
    }

    takeDamage(){
        // this.x+=10
        // damageSound.play()
        ctx.save()
        ctx.translate(Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 10) + 1)
        ctx.drawImage(mummy, this.x - size / 2, this.y - size / 2, size, size)
        ctx.translate(0, 10)
        ctx.restore()
    }
}

class Damage {
    constructor(x, y){
        this.x = x
        this.y = y
        this.number = Math.floor(Math.random() * 100000) + 1
        this.alpha = 1
        this.velocity = 3
    }

    draw(){
        ctx.save()
        ctx.globalAlpha = this.alpha
        this.number.toString().split('').forEach((number, numberIndex) => {
            ctx.drawImage(damageImages[number], this.x + numberIndex*size/12, this.y, size/10, size/10)
        })
        ctx.restore()
    }

    update(){
        this.draw()
        // this.velocity *= friction
        this.y = this.y - this.velocity
        this.alpha -= 0.005
    }
}

class Particle {
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }

    draw(){
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.restore()
    }

    update(){
        this.draw()
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x = this.x + this.velocity.x * 10
        this.y = this.y + this.velocity.y * 10
        this.alpha -= 0.01
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw(){
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        // ctx.fillRect(this.x, this.y, 150, 10);
        ctx.fillStyle = this.color
        ctx.fill()
    }

    update(){
        this.draw()
        this.x = this.x + this.velocity.x * 20
        this.y = this.y + this.velocity.y * 20
    }
}

const x = 0
const y = canvas.height - size / 2

const hero = new Hero(x + size / 2, y)
const enemy = new Enemy(canvas.width- size / 2, y)

const projectiles = []
const particles = []
const damages = []

// function sound(src) {
//     const AudioContext = window.AudioContext || window.webkitAudioContext;
//     const audioCtx = new AudioContext();
//     this.sound = document.createElement("audio");
//     this.sound.src = src;
//     this.sound.autoplay = true;
//     this.sound.setAttribute("preload", "auto");
//     this.sound.setAttribute("controls", "none");
//     this.sound.style.display = "none";
//     document.body.appendChild(this.sound);
//     this.play = function(){
//         this.sound.play();
//     }
//     this.stop = function(){
//         this.sound.pause();
//     }    
// }
// damageSound = new sound("assets/damage.mp3")

// Web Audio API
// var audioCtx, analyser, bufferLength, dataArray;
// window.addEventListener('load', initAudio, false);
// function initAudio() {
    //     try {
//     window.audioCtx = window.AudioContext|| window.webkitAudioContext;
//     audioCtx = new AudioContext();
//     analyser = audioCtx.createAnalyser();
//     }
//     catch(e) {
//     alert('Web Audio API is not supported in this browser');
//     }
//     // load the audio file
//     source = audioCtx.createBufferSource();
//     request = new XMLHttpRequest();
//     request.open('GET', 'assets/damage.mp3', true);
//     request.responseType = 'arraybuffer';
//     request.onload = function() {
//         var audioData = request.response;
//         audioCtx.decodeAudioData(audioData, function(buffer) {
//         source.buffer = buffer;
//         source.connect(analyser);
//         analyser.connect(audioCtx.destination);
//         source.loop = false;
//         source.start(0);
//         },function(e){"Error with decoding audio data" + e.err});
//     }
//     request.send(); 
// }

var audioContext = new (window.AudioContext || window.webkitAudioContext)()
function loadSound(filename) {
    var sound = {volume: 1, audioBuffer: null}
    
    var ajax = new XMLHttpRequest()
    ajax.open("GET", filename, true)
    ajax.responseType = "arraybuffer"
    ajax.onload = function()
    {
     audioContext.decodeAudioData
     (
      ajax.response,
      function(buffer) {
       sound.audioBuffer = buffer
      },
      function(error) {
       debugger
      }
     )
    }
    
    ajax.onerror = function() {
     debugger
    }
    
    ajax.send()
    
    return sound
}
function playSound(sound) {
    if(!sound.audioBuffer)
     return false
    
    var source = audioContext.createBufferSource()
    if(!source)
     return false
    
    source.buffer = sound.audioBuffer
    if(!source.start)
     source.start = source.noteOn
    
    if(!source.start)
     return false 
    var gainNode = audioContext.createGain()
    gainNode.gain.value = sound.volume
    source.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    source.start(0)
    
    sound.gainNode = gainNode
    return true
}
   function stopSound(sound) {
    if(sound.gainNode)
     sound.gainNode.gain.value = 0
   }
   function setSoundVolume(sound, volume) {
    sound.volume = volume
    
    if(sound.gainNode)
     sound.gainNode.gain.value = volume
   }
   var mySound = loadSound("assets/damage.m4a")// Then later after audio is unlocked and the sound is loaded:
   playSound(mySound)
   // How to unlock all sounds:
   var emptySound = loadSound("assets/shoot.m4a")
   document.body.addEventListener('touchstart', function(){playSound(emptySound)}, false)


function animate(){
    requestAnimationFrame(animate)
	// ctx.fillStyle = 'rgba(0,0,0,0.5)'
	// ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground()
    hero.draw()
	enemy.draw()
    particles.forEach((particle, particleIndex) => {
        if (particle.alpha <= 0){
            particles.splice(particleIndex, 1)
        }else{
            particle.update()
        }
    })
    damages.forEach((damage, damageIndex) => {
        damage.draw()
        if (damage.alpha <= 0.1){
            damages.splice(damageIndex, 1)
        }else{
            damage.update()
        }
    })
    projectiles.forEach((projectile, projectileIndex) => {
        projectile.update()
        
        // When hit
	    if (projectile.x > canvas.width - size && projectile.y > canvas.height - size){
            // damageSound.play()
            playSound(mySound)
            enemy.takeDamage()
            for(let i = 0; i < 20; i++){
                particles.push(new Particle(projectile.x, projectile.y, Math.random() * size/45, projectile.color, {x: Math.random() - 0.5, y: Math.random() - 0.5}))
            }
		    setTimeout(() => {
			    projectiles.splice(projectileIndex, 1)
		    }, 0)
            damages.push(new Damage(projectile.x, projectile.y))
	    }
    })
}

document.addEventListener('click', handler, false)
// document.addEventListener('touchstart', handler, false)

function handler(e){
    if(e.touches){
        angle = Math.atan2(e.touches[0].clientY - hero.y, e.touches[0].clientX  - hero.x)
    }else{
        angle = Math.atan2(e.clientY - hero.y, e.clientX  - hero.x)
    }
	const velocity = {x: Math.cos(angle), y: Math.sin(angle)}
	const color = `hsl(${Math.random() *360}, 50%, 50%)`
	projectiles.push(new Projectile(hero.x, hero.y, size/30, color, velocity))
}

animate()
