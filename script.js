const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = new Audio();
const btn = document.getElementById("searchBtn");
const inpWord = document.getElementById("searchInput");

btn.addEventListener("click", fetchDefinitions);
inpWord.addEventListener("keypress", (e) => {
    if(e.key === "Enter") fetchDefinitions();
});

function fetchDefinitions() {
    let word = inpWord.value.trim();
    if(word === "") return;
    
    fetch(`${url}${word}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            const phonetics = data[0].phonetics.find(p => p.audio !== '');
            const audioSrc = phonetics ? phonetics.audio : '';
            if(audioSrc) sound.setAttribute("src", audioSrc);
            
            result.innerHTML = `
            <div class="word">
                    <h3>${data[0].word}</h3>
                    ${audioSrc ? `<button onclick="playSound()"><i class="fa-solid fa-volume-high"></i></button>` : ''}
                </div>
                <div class="details">
                    <p>${data[0].meanings[0].partOfSpeech}</p>
                    <p>${data[0].phonetic || ''}</p>
                </div>
                <div class="meaning">
                    <span>Meaning:</span>
                    <p>${data[0].meanings[0].definitions[0].definition}</p>
                </div>
                ${data[0].meanings[0].definitions[0].example ? `<div class="example">"${data[0].meanings[0].definitions[0].example}"</div>` : ''}
            `;
        })
        .catch(() => {
            result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
        });
}

window.playSound = function() {
    sound.play();
};
