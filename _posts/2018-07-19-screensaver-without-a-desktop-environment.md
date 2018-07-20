---
title: Screensaver and Screenlocker without a Desktop Environment
date: 2018-07-19
category: [ blog, desktop independent ]
tags: [ screensaver, screenlocker, lockscreen, desktop independent ]
---
# Screensavers and Screenlockers
Without the bells and whistles of a desktop environment, the simplicity of a program that turns your screen off and locks your session becomes an irritating manual task.

## Expectations
My personal ideas of how a screensaver should work are:
1. Activate when the user is idle for a period of time
2. Notify the user before activation for cancellation
3. Lock the session after a short period of the screensaver being active



# Options

## [XScreenSaver](https://www.jwz.org/xscreensaver/)
Created back in 1992, XScreenSaver is a desktop independent screensaver program. Still maintained, it is used by default in many lightweight environments and distributions because of its installation simplicity.

Configuration is simple:
```
~/.xscreensaver
---
timeout:     0:09:00
lockTimeout: 0:00:30
fadeSeconds: 0:00:03
fadeTicks:   20
dpmsOff:     0:10:00
```
If you prefer a GUI setup tool use `xscreensaver-demo` to configure your `~/.xscreensaver` config file.

**Breakdown**  
The screensaver will run after 9 minutes, and 30 seconds *after* that the locker will run. After 10 minutes the screen will shut off.

**Issues**  
* XScreenSaver cannot notify the user that the locker is about to activate in a dimming/fading manner. Screen fading cannot be cancelled by the user.


## [xautolock](https://linux.die.net/man/1/xautolock) and an external locker
Not a screensaver in itself, xautolock can run a command after a period of user inactivity. Pairing it with an external locker like [i3lock](https://i3wm.org/i3lock/) may be able to get you to where you want to be.

```sh
xautolock \
    -notify 30 -notifier "~/.scripts/dim-screen.sh" \
    -time 9 -locker "~/.scripts/undim-screen.sh; i3lock" \
    -killtime 10 -killer "xset dpms force off" \
    -detectsleep
```

**Breakdown**  
The locker will run after 9 minutes, but 30 seconds *before* that the notifier will dim the screen.
After 10 minutes, the screen will be turned off.

**Issues**  
* If your `dim-screen.sh` script only dims and you shake your cursor to break out of the notifier, the screen will remain dimmed. You may be able to use a [trap](https://www.shellscript.sh/trap.html) to rectify this.


## [xidlehook](https://github.com/jD91mZM2/xidlehook) and an external locker 
*"Because xautolock is annoying to work with."* - [jD91mZM2](https://github.com/jD91mZM2)

xidlehook is a replacement for xautolock. It has more features, which includes: notify canceller, fullscreen detection, and audio detection. Just like xautolock, when paired with an external locker like i3lock, it should provide a better experience than xautolock.

```sh
xidlehook \
    --notify 30 --notifier "~/.scripts/dim-screen.sh" \
    --canceller "~/.scripts/undim-screen.sh" \
    --time 9 --timer "~/.scripts/undim-screen.sh; i3lock" \
    --not-when-fullscreen --not-when-audio
```

**Breakdown**  
The locker will run after 9 minutes, but 30 seconds *before* that the notifier will dim the screen.
If the notifier is cancelled the undim script will run.

**Issues**
* No `-killer` option to misuse and turn the screen off. Would have to run two instances.
* [Timer only accurate to the minute.](https://github.com/jD91mZM2/xidlehook/issues/6)
* [`--not-when-fullscreen` does not work with i3.](https://github.com/jD91mZM2/xidlehook/issues/5)


## [xss-lock](http://manpages.ubuntu.com/manpages/bionic/man1/xss-lock.1.html) and an external locker

xss-lock is a program runs a command to lock the screen on X signals. It also listens to systemd's login manager and even activates the lockscreen before suspending/hibernating.

```sh
xset s 600 30
xss-lock -n /usr/share/doc/xss-lock/dim-screen.sh -- i3lock
```

**Breakdown**  
Set X screensaver properties to 600 and 30, being 10 minutes and 30 seconds.
xss-lock will run the `dim-screen.sh` script after 10 minutes and then lock the session 30 seconds later.
On suspending/hibernation the session will be locked.

xss-lock's `dim-screen.sh` script utilizes a trap to undim the screen after xss-lock kills it.



# Extras

## [lightson+](https://github.com/devkral/lightsonplus)
lightson+ is a screensaver inhibitor to prevent the screensaver from activating while watching a fullscreen video.
