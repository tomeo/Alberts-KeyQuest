let femaleVoice = null;
const setFemaleVoice = () => {
    const voices = speechSynthesis.getVoices();
    femaleVoice = voices.find(voice => voice.name.includes("Female") || voice.name.includes("Google UK English Female"));
};

if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = setFemaleVoice;
} else {
    setFemaleVoice();
}

export const speakText = (text, callback = null) => {
    if (!("speechSynthesis" in window)) {
        console.error("Speech synthesis not supported. Skipping speech.");
        if (callback) callback();
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onend = () => {
        console.log(`Finished speaking: ${text}`);
        if (callback) callback();
    };

    console.log(`Speaking: ${text}`);

    document.body.addEventListener("click", () => {
        speechSynthesis.speak(utterance);
    }, { once: true });
};

export const addBackToTitleButton = (scene) => {
    const backButton = scene.add.text(20, 20, "< Back to Title", {
        fontFamily: '"Press Start 2P", cursive',
        fontSize: "1rem",
        fill: "#fff",
        backgroundColor: "#333",
        padding: { x: 10, y: 5 }
    }).setInteractive();

    // Hover effect for the button
    backButton.on('pointerover', () => backButton.setStyle({ fill: "#FFD700" }));
    backButton.on('pointerout', () => backButton.setStyle({ fill: "#fff" }));

    // Click action to go back to the title screen
    backButton.on('pointerup', () => {
        scene.scene.start("TitleScene");
    });
};