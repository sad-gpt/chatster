document.addEventListener("DOMContentLoaded", () => {
  const socket = io("http://localhost:5050");

  const anonUsername = localStorage.getItem("anonUsername");
  const anonGender = localStorage.getItem("anonGender")?.toLowerCase();
  const anonPreference = localStorage.getItem("anonPref")?.toLowerCase();
  document.getElementById("partner-name").innerText = anonUsername || "Stranger";

  const messageInput = document.getElementById("messageInput");
  const sendButton = document.getElementById("sendBtn");
  const messagesDiv = document.getElementById("messages");
  const typingDiv = document.getElementById("typing-indicator");
  const disconnectBtn = document.getElementById("disconnectBtn");
  const skipBtn = document.getElementById("skipBtn");

  let skipCount = 0;

  sendButton.addEventListener("click", sendMessage);
  messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  function sendMessage() {
    const msg = messageInput.value.trim();
    if (msg !== "") {
      appendMessage("right", msg);
      socket.emit("send_message", msg);
      messageInput.value = "";
    }
  }

  messageInput.addEventListener("input", () => {
    socket.emit("typing");
  });

  socket.on("receive_message", (msg) => {
    if (msg === "⚠️ Stranger disconnected.") {
      appendMessage("left", msg);

      // 🔁 Auto-rematch logic when stranger disconnects
      messagesDiv.innerHTML = "";
      typingDiv.style.display = "none";
      showSkipButton();
      setTimeout(() => {
        matchUser();
      }, 1000);
    } else {
      appendMessage("left", msg);
    }
  });

  socket.on("show_typing", () => {
    typingDiv.style.display = "block";
    setTimeout(() => {
      typingDiv.style.display = "none";
    }, 2000);
  });

  function appendMessage(side, message) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgElement = document.createElement("div");
    msgElement.classList.add("message", side);
    msgElement.innerHTML = `<span class="text">${message}</span><span class="time">${time}</span>`;
    messagesDiv.appendChild(msgElement);
    scrollToBottom();
  }

  function scrollToBottom() {
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  socket.on("updateOnlineCount", (count) => {
    document.getElementById("online-count").textContent = count.toLocaleString();
  });

  disconnectBtn.addEventListener("click", () => {
    socket.emit("disconnectUser");

    // 🛑 Remove this to stop redirecting to username.html:
    // window.location.href = "username.html";

    // 🔁 Instead: auto-rematch just like skip
    messagesDiv.innerHTML = "";
    typingDiv.style.display = "none";
    showSkipButton();
    matchUser();
  });

  skipBtn.addEventListener("click", () => {
    skipCount++;

    if (anonGender === "male" && anonPreference === "female" && skipCount >= 3) {
      showAdPopup();
      skipCount = 0;
    }

    socket.emit("disconnectUser");
    messagesDiv.innerHTML = "";
    typingDiv.style.display = "none";
    showSkipButton();
    matchUser();
  });

  function matchUser() {
    let premium = parseInt(localStorage.getItem("premiumMatches") || "0");
    let preferred = premium > 0 ? anonPreference : null;

    if (premium > 0) {
      localStorage.setItem("premiumMatches", premium - 1);
    }

    socket.emit("match_user", {
      username: anonUsername,
      gender: anonGender,
      preference: preferred
    });
  }

  function showAdPopup() {
    document.getElementById("ad-popup").style.display = "flex";
  }

  function closePopup() {
    document.getElementById("ad-popup").style.display = "none";
  }

  function watchAds() {
    alert(" Pretending to watch 3 ads...");
    localStorage.setItem("premiumMatches", "3");
    closePopup();
  }

  function showDisconnectButton() {
    disconnectBtn.style.display = "inline-block";
    skipBtn.style.display = "none";
  }

  function showSkipButton() {
    disconnectBtn.style.display = "none";
    skipBtn.style.display = "inline-block";
  }

  socket.on("matched", (partnerData) => {
    document.getElementById("partner-name").innerText = partnerData?.username || "Stranger";
    messagesDiv.innerHTML = "";
    showDisconnectButton();
  });

  showSkipButton();
  matchUser();

  window.watchAds = watchAds;
  window.closePopup = closePopup;
});
