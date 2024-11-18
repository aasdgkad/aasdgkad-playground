window.onload = onpageload


function onpageload(){
    aboutPageInfo().then(() => {interactiveText()}).catch(() => {interactiveText()});

}

function displaceContact(){
    let cb = document.getElementById("contact-button");
    cb.style.left = String(Math.round(Math.random() * 90)) + "%";
    cb.style.top = String(Math.round(Math.random() * 60)+30) + "%";
}

function aboutPageInfo(){
    return new Promise((resolve, reject) =>
    {
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

function interactiveText(){
    let hs = document.querySelectorAll(".hover-element");
    console.log(hs);
    for(let i = 0; i < hs.length; i++){
        console.log(hs[i]);
        let l = true;
        for(let j = 0; j < hs[i].innerHTML.length; j++){
            if(l && hs[i].innerHTML[j] != " "){
                hs[i].innerHTML = hs[i].innerHTML.slice(0,j) + "<span class=\"hover-text\">" + hs[i].innerHTML.slice(j);
                l = false;
                j = j+"<span class=\"hover-text\">".length;
            }
            else if(!l && hs[i].innerHTML[j] == " "){
                hs[i].innerHTML = hs[i].innerHTML.slice(0,j) + "</span>" + hs[i].innerHTML.slice(j);
                l = true;
                j = j+"</span>".length;
            }
        }
    }
}