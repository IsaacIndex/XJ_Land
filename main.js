const canvas = document.querySelector('canvas')
const ctx = canvas.getContext("2d")
const con = document.getElementById("console")

const batman = new Image()
batman.src = "images/batman.png"
const mummy = new Image()
mummy.src = "images/mummy.png"
damageImages = []
for (let i=0; i<10; i++){
    damageImages[i] = new Image()
    damageImages[i].src = "images/damages/"+i+".png"
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
        //ctx.beginPath()
        //ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        //ctx.fillStyle = this.color
        //ctx.fill()
    }
}

class Enemy {
    constructor(x, y){
        this.x = x
        this.y = y
    }

    draw(){
	    ctx.drawImage(mummy, this.x - size / 2, this.y - size / 2, size, size)
        //ctx.beginPath()
        //ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        //ctx.fillStyle = this.color
        //ctx.fill()
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
        ctx.fillStyle = this.color
        ctx.fill()
    }

    update(){
        this.draw()
        this.x = this.x + this.velocity.x * 10
        this.y = this.y + this.velocity.y * 10
    }
}

const x = 0
const y = canvas.height - size / 2

const hero = new Hero(x + size / 2, y)
const enemy = new Enemy(canvas.width- size / 2, y)

const projectiles = []
const particles = []
const damages = []


function animate(){
    requestAnimationFrame(animate)
	ctx.fillStyle = 'rgba(0,0,0,0.1)'
	ctx.fillRect(0, 0, canvas.width, canvas.height)
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
	    if (projectile.x > canvas.width - size){
            for(let i = 0; i < 8; i++){
                particles.push(new Particle(projectile.x, projectile.y, Math.random() * size/25, projectile.color, {x: Math.random() - 0.5, y: Math.random() - 0.5}))
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
	projectiles.push(new Projectile(hero.x, hero.y, size/17, color, velocity))
}

animate()
