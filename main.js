const canvas = document.querySelector('canvas')
const ctx = canvas.getContext("2d")
const con = document.getElementById("console")

const batman = new Image()
batman.src = "images/batman.png"
const mummy = new Image()
mummy.src = "images/mummy.png"

canvas.width = innerWidth;
canvas.height = innerHeight;
const size = 100;

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

    update(index){
        this.draw()
        this.x = this.x + this.velocity.x * 10
        this.y = this.y + this.velocity.y * 10
	    if (this.x > canvas.width - size){
		    setTimeout(() => {
			projectiles.splice(index, 1)
		    }, 0)
	    }
    }
}

const x = 0
const y = canvas.height - size / 2

const hero = new Hero(x, y)
const enemy = new Enemy(canvas.width-size, y)

const projectiles = []


function animate(){
    requestAnimationFrame(animate)
	ctx.fillStyle = 'rgba(0,0,0,0.1)'
	ctx.fillRect(0, 0, canvas.width, canvas.height)
    //ctx.clearRect(0, 0, canvas.width, canvas.height)
    hero.draw()
	enemy.draw()
    projectiles.forEach((projectile, projectileIndex) => {
        projectile.update(projectileIndex)
	    //con.innerHTML = projectile.x	
    })
}

addEventListener('touchstart', (e)=>{
	const angle = Math.atan2(e.touches[0].clientY - hero.y, e.touches[0].clientX  - hero.x)
	const velocity = {x: Math.cos(angle), y: Math.sin(angle)}
	const color = `hsl(${Math.random() *360}, 50%, 50%)`
	projectiles.push(new Projectile(hero.x, hero.y, 5, color, velocity))
})


animate()
