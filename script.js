
const form = document.getElementById('genderform');

form.addEventListener('submit', function (event) {
    event.preventDefault(); 
    const myGender = document.getElementById('gender').value;
    const chatPreference = document.getElementById('preferences').value;

    if (!myGender || !chatPreference) {
        alert("Please select both gender and preference.");
        return;
    }


    localStorage.setItem("anonGender", myGender);
    localStorage.setItem("anonPref", chatPreference);

   
    console.log("anonGender saved:", myGender);
    console.log("anonPref saved:", chatPreference);

   
    window.location.href = "username.html";
});
