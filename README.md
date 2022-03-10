# XJ_Land
This program is a simple JavaScript Game which serves as a demo for a university assignment.  
<img src="https://github.com/IsaacIndex/XJ_Land/blob/main/assets/demo.png" height="200">

## Table of Contents
* [Installation](#installation)
* [Usage](#usage)
* [Challenges](#challenges)
* [Room for Improvement](#room-for-improvement)

## Installation
`
git clone https://github.com/IsaacIndex/XJ_Land
`

## Usage
- Click on the screen to shoot
- Damage numbers appear randomly
- Slight shock is applied on the character when hit

## Challenges
### Audio not playing on iOS devices
This games is designed to play on all platforms. However, in the beginning the "getting hit" sound only works on Windows or Android devices. This is due to iOS only allows sounds to be played when users' make an interaction. 

> credits to https://curtisrobinson.medium.com/how-to-auto-play-audio-in-safari-with-javascript-21d50b0a2765

The solution is to have the game plays an empty sound at the start so other audio files can be loaded.

### Getting the direction of the projectile
Players can shoot projectiles in all directions. However, the game would not know where to point them.

The solution is to use the atan2 function to get the angle in radian.

### Displaying characters correctly on all devices
If the height or the hit box are hard code numbers, the game will not be compatible with all the devices.

The solution is make them all relative to the viewport.

## Room for Improvement
1. There is a minor bug where if you shoot underground it would still show you hit the target. This is because there is no lower boundary for the hit box.
2. A scoreboard
