import { Howl } from "howler";
import { romajiConv } from "@koozaki/romaji-conv";
import "./style.css"

const $speakText = document.getElementById("speak-text");
const speakText = async text => {
  const url = `https://synthesis-service.scratch.mit.edu/synth?locale=JA-JP&gender=female&text=${text}`;

  const dataUrl = URL.createObjectURL(await fetch(url).then(res => res.blob()));

  const sound = new Howl({
    src: [dataUrl],
    html5: true,
    onend: () => { sound.unload(); },
  });

  sound.play();
};
$speakText.addEventListener("keydown", (evt) => {
  if (evt.key.toLowerCase() === "enter") {
    speakText($speakText.value);
    $speakText.value = ""
  }
});

const data = {
  consonantList: [],
};
for (const vowel of document.getElementsByClassName("vowels")) {
  vowel.addEventListener("pointerover", (evt) => {
    evt.target.classList.add("bg-gray-300");
    const targetText = romajiConv(data.consonantList.join("") + evt.target.textContent).toHiragana();
    data.consonantList = [];
    speakText(targetText);
    evt.preventDefault();
  });
  vowel.addEventListener("pointerleave", (evt) => {
    evt.target.classList.remove("bg-gray-300");
    evt.preventDefault();
  });
}
for (const consonant of document.getElementsByClassName("consonant")) {
  consonant.addEventListener("click", (evt) => {
    data.consonantList.push(evt.target.textContent)
  });
}
