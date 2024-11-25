window.onload = onpageload

var canvas;
var ctx;

function onpageload() {
  aboutPageInfo().then(() => { interactiveText() }).catch(() => { interactiveText() });
  canvas = canvas = document.querySelector("#playspace canvas");
  ctx = canvas.getContext("2d");
}

function displaceContact() {
  let cb = document.getElementById("contact-button");
  cb.style.left = String(Math.round(Math.random() * 90)) + "%";
  cb.style.top = String(Math.round(Math.random() * 60) + 30) + "%";
}

function aboutPageInfo() {
  return new Promise((resolve, reject) => {
    let profpic = document.getElementById("profile-pic")
    let proftext = document.getElementById("profile-text")
    fetch("https://random-person-generator.com/api?gender=m")
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Parse JSON response
      })
      .then(data => {
        console.log(data); // Handle the data from the API
        profpic.src = data["profile_photo"]["256x256"];
        proftext.innerText = "My name is " + data["identification"]["full_name"] + ", and I am a " + data["identification"]["age"] + "-year-old " + data["identification"]["nationality"] + " " + data["employment"]["occupation"] + " working in the " + data["employment"]["industry"] + " industry. I am currently employed by " + data["employment"]["employer"] + ", where I contribute to exciting projects and collaborate with talented individuals to achieve impactful results. This website is a personal project that I developed in my free time as a way to further explore my skills and share my work with a broader audience. With a strong passion for innovation and problem-solving, I strive to stay ahead in the ever-evolving " + data["employment"]["industry"] + " landscape.";
        resolve();
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        reject();
      });
  }, 1000);
}

//this argument is a list always
function interactiveText(hs = ".hover-element") {
  if (hs == ".hover-element") {
    hs = document.querySelectorAll(".hover-element");
  }
  else {
    console.log(hs);
  }
  for (let i = 0; i < hs.length; i++) {
    let l = true;
    for (let j = 0; j < hs[i].innerHTML.length; j++) {
      if (l && hs[i].innerHTML[j] != " ") {
        hs[i].innerHTML = hs[i].innerHTML.slice(0, j) + "<span class=\"hover-text\">" + hs[i].innerHTML.slice(j);
        l = false;
        j = j + "<span class=\"hover-text\">".length;
      }
      else if (!l && hs[i].innerHTML[j] == " ") {
        hs[i].innerHTML = hs[i].innerHTML.slice(0, j) + "</span>" + hs[i].innerHTML.slice(j);
        l = true;
        j = j + "</span>".length;
      }
    }
  }
  return hs;
}

function hidePlayspace() {
  let items = document.querySelectorAll("#playspace *");
  for (let i = 0; i < items.length; i++) {
    items[i].style["display"] = "none";
  }
}

function dogAPI() {
  fetch("https://dog.ceo/api/breeds/image/random")
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(resp => {
      let dogimg = document.querySelector("#playspace img")
      dogimg.src = resp["message"];
      dogimg.style["display"] = "block"
    })
    .catch(error => {
      console.error('Error fetching the image:', error);
    });

  fetch("https://dog-api.kinduff.com/api/facts")
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(parsed => {
      let text = document.querySelector("#playspace p");
      text.innerHTML = parsed["facts"];
      text.style["display"] = "block";
      text.innerHTML = interactiveText([text])[0].innerHTML;
      document.querySelectorAll("#playspace p span").forEach((el) => el.style["display"] = "inline-block");
      console.log(text);
      console.log(parsed);
    })
    .catch(error => {
      console.error('Error fetching the text:', error);
    });
}

var keys = { "w": false, "s": false };
window.addEventListener("keydown", (e) => { keys[e.key] = true });
window.addEventListener("keyup", (e) => { keys[e.key] = false });

var py = 0;
var ey = 0, edes;

var bx = 350, by = 100;
var bvx = 6.0, bvy = -3.0;
var vel = 20;

var estimate = true;

var pongRunning = false;
function pongInit(phase) {
  switch (phase) {
    case 1: {
      document.querySelector("#playspace div").style["display"] = "flex";
      let text = document.querySelector("#playspace p");
      text.innerHTML = "Press W to move up and S to move down, You got this do not worry"
      text = interactiveText([text])[0];
      document.querySelectorAll("#playspace p span").forEach((el)=>{el.style["display"] = "inline-block"});
      text.style["display"] = "block";
      break;
    }
    case 2: {
      document.querySelector("#playspace div").style["display"] = "none";
      document.querySelector("#playspace p").style["display"] = "none";

      canvas.width = 740;
      canvas.height = 400;
      canvas.style["display"] = "block";

      py = 0;
      ey = 0;

      bx = 350, by = 100;
      bvx = 6.0, bvy = -6.0;
      vel = 20;

      estimate = true;

      if (!pongRunning) {
        requestAnimationFrame(pongLoop);
      }
      break;
    }
  }
}

function pongLoop() {
  pongRunning = true;

  py += vel * ((keys["s"]) - (keys["w"]))
  if(py<0){
    py = 0;
  }
  else if(py > 300){
    py = 300;
  }

  bx += bvx;
  by += bvy;

  if (bvx > 0 && estimate) {
    let estimy = by + bvy * (630 - bx) / bvx;
    let cbvy = bvy;
    let cbx = bx, cby = by;
    while ((estimy <= 0 || estimy >= 370) && cbx < 630) {
      if (estimy <= 0) {
        cbx += bvx * cby / (-cbvy);
        cby = 0;
      }
      else {
        cbx += bvx * (370 - cby) / cbvy;
        cby = 370;
      }
      cbvy = -cbvy;
      estimy = cby + cbvy * (630 - cbx) / bvx;
    }
    edes = estimy - 50;
    estimate = false;
  }
  else if (Math.abs(ey - edes) > vel - 1) {
    ey += vel * ((ey < edes) * 2 - 1)
    if(ey<0){
      ey = 0;
    }
    else if(ey > 300){
      ey = 300;
    }
  
  }

  if (by <= 0) {
    by = 0;
    bvy = -bvy;
  }
  if (by >= 370) {
    by = 370;
    bvy = -bvy;
  }

  if (bx > 80 && bx + bvx < 70) {
    bx = 80;
  }
  if (bvx < 0 && bx <= 80 && bx >= 70) {
    if (by <= py + 100 && by + 30 >= py) {
      bx = 80;
      let rangle = Math.atan(Math.abs(bvx / bvy)) + Math.random() - 0.5 * Math.PI / 7;
      let speed = Math.min(Math.sqrt(bvy * bvy + bvx * bvx) * 1.05, 20);
      bvy = ((bvy > 0) * 2 - 1) * Math.abs(Math.cos(rangle) * speed);
      bvx = ((bvx < 0) * 2 - 1) * Math.sin(rangle) * speed;
      estimate = true;
    }
  }
  else if (bx <= 0) {
    const img = new Image();
    img.src = 'https://i.ytimg.com/vi/ZS5hZjAItYY/maxresdefault.jpg';

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    pongRunning = false;
    return;
  }

  if (bx < 630 && bx + bvx > 640) {
    bx = 630;
  }
  if (bvx > 0 && bx >= 630 && bx <= 640) {
    if (by <= ey + 100 && by + 30 >= ey) {
      bx = 630;
      let rangle = Math.atan(Math.abs(bvx / bvy)) + Math.random() - 0.5 * Math.PI / 7;
      let speed = Math.min(Math.sqrt(bvy * bvy + bvx * bvx) * 1.05, 20);
      bvy = ((bvy > 0) * 2 - 1) * Math.abs(Math.cos(rangle) * speed);
      bvx = ((bvx < 0) * 2 - 1) * Math.sin(rangle) * speed;
    }
  }
  else if (bx >= 710) {
    const img = new Image();
    img.src = 'https://png.pngtree.com/png-vector/20220520/ourlarge/pngtree-happy-emoji-emoticon-showing-double-thumbs-up-like-png-image_4708251.png';

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    pongRunning = false;
    return;
  }

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 740, 400);

  ctx.fillStyle = "white";
  ctx.fillRect(50, py, 30, 100);
  ctx.fillRect(660, ey, 30, 100);
  ctx.fillRect(bx, by, 30, 30);

  requestAnimationFrame(pongLoop);
}