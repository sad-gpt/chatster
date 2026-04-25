const adjectives = ["Witty", "Chill", "Lazy", "Cool", "Smart", "Silent", "Zany", "Bold", "Snappy", "Swift"];
const animals = ["Fox", "Panda", "Koala", "Otter", "Tiger", "Penguin", "Cat", "Hawk", "Wolf", "Raven"];

function generateUsername() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const number = Math.floor(100 + Math.random() * 900); 

  const randomName = `${adj}${animal}${number}`;
  document.getElementById("usernameInput").value = randomName;
}

function startChat() {
  const usernameInput = document.getElementById("usernameInput");
  const username = usernameInput.value.trim();

  if (!username) {
    alert("Please enter or generate a username first!");
    usernameInput.focus();
    return;
  }

 
  localStorage.setItem("anonUsername", username);

  
  window.location.href = "chat.html";
}
