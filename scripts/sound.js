
var musicPlayer = {
  activeTrack : undefined,
  music : document.getElementById('music'),
  repeat : false,
  delay: false,
  tracks : {
    kata : {
    djemSo : 'assets/audio/music/forms/DjemSo.mp3',
    shiiCho : 'assets/audio/music/forms/Shii-Cho.mp3',
    makashi : 'assets/audio/music/forms/Makashi.mp3',
    soresu : 'assets/audio/music/forms/Soresu.mp3'
      },
    fight : {
      darkSide : '',
      dramatic : 'assets/audio/musi/fight/dramatic.mp3',
      epic : '',
      tragic : 'assets/audio/music/fight/tragic.mp3'
    },
    force : {
      fullTrack : 'assets/audio/music/force/ForceExpFull.mp3'
    }
  },

  toggleRepeat : function() { //controls the repeat button
    if (this.repeat) {
      rButton.style.backgroundColor = 'ivory';
    } else if (!this.repeat) {
      rButton.style.backgroundColor = '#4200f7';
    }
    this.repeat = !this.repeat;
  },

  toggleDelay : function() {
    if (this.delay) {
      dButton.style.backgroundColor = 'ivory';
    } else if (!this.delay) {
      dButton.style.backgroundColor = '#4200f7';
    }
    this.delay = !this.delay;
  },

  select : function(type, id) {
    var title = id.toUpperCase();
    document.querySelector('audio').setAttribute('src', this.tracks[type][id]);
    document.getElementById('title').textContent = title;
    this.activeTrack = this.tracks[type][id];
    pButton.className = 'play';
    playhead.style.marginLeft = '0px';
  },

  playMusic : function() { //actually plays the track, and gets the timeline handling going
    var interval;
    var delay;
    if (this.activeTrack === undefined) {
      return;
    }

    handlers.setupTimelineHandler();
    if (music.paused) {
      music.play();
      pButton.className = '';
		  pButton.className = 'pause';
		  interval = setInterval(display.showNumbers, 1000);
    } else {
      music.pause();
		  pButton.className = '';
		  pButton.className = 'play';
		  clearInterval(interval);
  }
  }
};

var handlers = {
 setupClickHandlers : function() { //sets up handlers for track selection
   document.getElementById('kata').addEventListener('click', function(event) {
     track = event.target.id;
     if (track === '' || track === 'kata') {
       return;
     }
     musicPlayer.select('kata', track);
     display.clearActives();
     display.makeActive(event.target);
   });
   document.getElementById('fight').addEventListener('click', function(event) {
     track = event.target.id;
     if (track === '' || track === 'fight') {
       return;
     }

     musicPlayer.select('fight', track);
     display.clearActives();
     display.makeActive(event.target);
   });
   document.getElementById('force').addEventListener('click', function(event) {
     track = event.target.id;
     if (track === '' || track === 'force') {
       return;
     }
     musicPlayer.select('force', track);
     display.clearActives();
     display.makeActive(event.target);
   });
 },

 setupTimelineHandler : function() { //creates the event listeners that update the timeline
    musicPlayer.music.addEventListener("timeupdate", handlers.timeUpdate, false);
    musicPlayer.music.addEventListener('canplaythrough', function() {
      handlers.duration = musicPlayer.music.duration;
    }, false);
  this.timeline.addEventListener("click", function (event) {
	display.moveplayhead(event);
	musicPlayer.music.currentTime = music.duration * handlers.clickPercent(event);
}, false);
  display.showNumbers();
 },

 playhead : document.getElementById('playhead'),
 duration : undefined,
 timeline : document.getElementById('timeline'),

  timeUpdate : function() {
	var playPercent = 100 * (musicPlayer.music.currentTime / music.duration);
	handlers.playhead.style.marginLeft = playPercent + "%";
	if (musicPlayer.music.currentTime == this.duration && musicPlayer.repeat === false) {
        pButton.className = "";
        pButton.className = "play";
    } else if (musicPlayer.music.currentTime == this.duration) {
      musicPlayer.music.currentTime = 0;
      musicPlayer.playMusic();
    }
  },

  playHandler : function() {
    var delay;
    if (musicPlayer.delay && music.paused && music.currentTime === 0) {
      delay = window.setTimeout(function(){musicPlayer.playMusic()}, 10000);
    } else {
      musicPlayer.playMusic();
    }
  },

  clickPercent: function(e) {
	return (e.pageX - timeline.offsetLeft) / timeline.offsetWidth;
},



};


var display = {
  moveplayhead : function(e) {
	var newMargLeft = e.pageX - timeline.offsetLeft;
	if (newMargLeft !== 0 && newMargLeft !== timeline.offsetWidth) {
		playhead.style.marginLeft = newMargLeft + 'px';
	}
	if (newMargLeft ===  0) {
		playhead.style.marginLeft = '0px';
	}
	if (newMargLeft === timeline.offsetWidth) {
		playhead.style.marginLeft = timeline.offsetWidth + 'px';
	}

},

  showNumbers : function() { //displays track time in seconds and minutes, does math to keep the display intuitive
    if (track_duration.className !== '') {
      track_duration.className = '';
      elapsed.className = '';
    }
    var xMinutes = Math.floor(parseInt(music.currentTime) / 60);
    var yMinutes = Math.floor(parseInt(music.duration) / 60);
    var xSeconds = parseInt(music.currentTime);
    var ySeconds = parseInt(music.duration);
    if (xMinutes > 0) {
      xSeconds = xSeconds - (xMinutes * 60);
    }
    if (yMinutes > 0) {
      ySeconds = ySeconds - (yMinutes * 60);
    } //logic to ensure that seconds translate to minutes
    if (xSeconds.toString().length < 2) {
      xSeconds = '0' + xSeconds.toString();
    }
    if (ySeconds.toString().length < 2) {
      ySeconds = '0' + ySeconds.toString();
    } //these two statements add 0s to the beginning to match the format the user expects

    elapsed.textContent = xMinutes + ':' + xSeconds;
    track_duration.textContent = yMinutes + ':' + ySeconds;
  },

  makeActive : function(element) {
    element.className += ' active_track';
  },

  clearActives : function() {
    var kataList = document.getElementById('kata').childNodes;
    var fiteList = document.getElementById('fight').childNodes;
    var forceList = document.getElementById('force').childNodes;
    kataList.forEach(function(node){
      if (node.nodeName === 'P') {
        node.className = 'track-heading bold lite-up';
      }
    });
    fiteList.forEach(function(node){
      if (node.nodeName === 'P') {
        node.className = 'track-heading bold lite-up';
      }
    });
    forceList.forEach(function(node){
      if (node.nodeName === 'P') {
        node.className = 'track-heading bold lite-up';
      }
    });
  }
};

handlers.setupClickHandlers();

/*musicPlayer.music.addEventListener('canplaythrough', function() {
    handlers.duration = musicPlayer.music.duration;
}, false);*/

musicPlayer.music.addEventListener('canplay', function() {
    display.showNumbers();
}, false);
