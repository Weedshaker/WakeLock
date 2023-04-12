<s>
# Wake Lock
## Keep your device awake! Hence avoid that the OS goes into screen lock while inactive...
- Feature: Keep your teams status "available" in consequence prevent the status "away"
- Note: The WakeLock API only works with Chrome and its alike
- More Info at: https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API

[<img align="center" src="https://weedshaker.github.io/WakeLock/img/icon_192x192.png">](https://weedshaker.github.io/WakeLock/index.html "Click and stay available!") \
[👆 Click and stay available! 😎🤙](https://weedshaker.github.io/WakeLock/index.html)
</s>
*Wake Lock is released under GPL-3.0 License . Copyright (c) the Universe.*

# Wake Lock stopped working for Teams, which now disrespects the Wake Lock and does not stay green... alternatively use something like:

```
// npm install robotjs

// Move the mouse across the screen as a sine wave.
var robot = require('robotjs');

// duration in min
var args = process.argv.slice(2);
var timeInMs = 0
args.forEach(arg => {
    var [key, value] = arg.split('=')
    if (key === 'sec') timeInMs += value * 1000
    if (key === 'min') timeInMs += value * 1000 * 60
    if (key === 'h') timeInMs += value * 1000 * 60 * 60
})
if (timeInMs) timeInMs += Date.now()

// Speed up the mouse.
robot.setMouseDelay(2);

var move = () => {
    var twoPI = Math.PI * 2.0;
    var screenSize = robot.getScreenSize();
    var height = (screenSize.height / 2) - 10;
    var width = screenSize.width;

    for (var x = 0; x < width; x++)
    {
        y = height * Math.sin((twoPI * x) / width) + height;
        robot.moveMouse(x, y);
    }
    if (timeInMs === 0 || timeInMs > Date.now()) {
        if (timeInMs !== 0) console.log('running for another: ' + ((timeInMs - Date.now()) / 1000 / 60).toFixed(1) + 'min');
        move();
    } else {
        console.log('ended at: ' + (new Date()).toLocaleString('en-US'))
    }
};
move();
```
and call the following in your cli:
```
node mouse.js min=2
```
