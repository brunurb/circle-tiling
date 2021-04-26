class Sketch extends Engine {
  preload() {
    // parameters
    this._palettes = [
      { title: "soft shades", font: "Roboto", colors: ["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"] },
      { title: "bauhaus", font: "Bauhaus", "colors": ["#1a1616", "#4f186b", "#3e4db4", "#91144e", "#ea1f25", "#ea1f25", "#f1ca00", "#ecddbe"] },
      { title: "starry night", font: "Vincent", colors: ["#173679", "#4888C8", "#7FC5DC", "#E8E163", "#DB901C", "#0B1E38"] },
      { title: "pop art", font: "BaksoSapi", colors: ["#FE0879", "#FF82E2", "#FED715", "#0037B3", "#70BAFF"] },
      { title: "impressionism", font: "Monet", colors: ["#2C4194", "#5470C0", "#9D92CC", "#C67BD0", "#B5E8C9", "#5A9F82"] },
      { title: "pastle impression", font: "Slabo", colors: ["#98ddca", "#d5ecc2", "#ffd3b4", "#ffaaa7"] },
    ];
    this._particles_num = 20000;
    this._cols = 10;
    this._border = 0.2;
    // download callback
    document.querySelector("#download").addEventListener("click", () => this._download());
    console.clear();
  }

  setup() {
    // sketch setup
    this._scl = (this._width * (1 - this._border)) / this._cols;
    // setup capturer
    if (this._recording) {
      this._capturer = new CCapture({ format: "png" });
      this._capturer_started = false;
    }
    // select palette
    let new_palette = random_from_array(this._palettes);
    this._title = new_palette.title;
    this._font = new_palette.font;
    const palette = [...new_palette.colors];
    // create tiles
    this._tiles = [];
    for (let x = 0; x < this._cols; x++) {
      for (let y = 0; y < this._cols; y++) {
        shuffle_array(palette);
        const new_tile = new Tile(x, y, this._scl, palette[0], palette[1]);
        this._tiles.push(new_tile);
      }
    }
    // create particles
    this._particles = [];
    for (let i = 0; i < this._particles_num; i++) {
      const new_particle = new Particle(this._width * (1 - this._border), this._height * (1 - this._border));
      this._particles.push(new_particle);
    }
    // set font in page
    const footer = document.querySelector("body");
    footer.style.fontFamily = this._font;
    // set page title
    document.title = this._title;
  }

  draw() {
    // draw tiles and particles
    this._ctx.save();
    this._background();
    this._ctx.translate(this._border * this._width / 2, this._border * this._height / 2);
    this._tiles.forEach(t => t.show(this._ctx));
    this._particles.forEach(p => p.show(this._ctx));
    this._ctx.restore();
    // there's no point in looping, just stop
    this.noLoop();
  }

  _background() {
    this._ctx.save();
    // background color
    this._ctx.fillStyle = "#F4F0E8";
    this._ctx.fillRect(0, 0, this._width, this._height);
    // title
    const dpos = this._width * this._border * 0.55;
    const text_size = this._width * this._border / 2 * 0.6;
    this._ctx.font = `${text_size}px ${this._font}`;
    this._ctx.fillStyle = "rgb(15, 15, 15)";
    this._ctx.textAlign = "left";
    this._ctx.textBaseline = "middle";
    this._ctx.fillText(this._title, dpos, dpos / 2);
    // watermark
    this._ctx.textAlign = "right";
    this._ctx.textBaseline = "top";
    this._ctx.font = `${text_size / 2}px ${this._font}`;
    this._ctx.fillText("Lorenzo Rossi", this._width - dpos, this._height - dpos / 2);
    this._ctx.restore();
  }

  _download() {
    this.saveAsImage(this._title);
  }

  click() {
    this.setup();
    this.loop();
  }
}


const random = (a, b) => {
  if (a == undefined && b == undefined) return random(0, 1);
  else if (b == undefined) return random(0, a);
  else if (a != undefined && b != undefined) return Math.random() * (b - a) + a;
};

const random_int = (a, b) => {
  if (a == undefined && b == undefined) return random_int(0, 1);
  else if (b == undefined) return random_int(0, a);
  else if (a != undefined && b != undefined) return Math.floor(Math.random() * (b - a + 1)) + a;
};

const random_interval = (average, interval) => {
  average = average || 0.5;
  interval = interval || 0.5;
  return random(average - interval, average + interval);
};

const random_from_array = (arr) => {
  return arr[random_int(arr.length - 1)];
};

const shuffle_array = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};