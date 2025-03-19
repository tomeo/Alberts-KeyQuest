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
    if (typeof responsiveVoice !== "undefined") {
        console.log(`🎤 Speaking: ${text}`);
        
        responsiveVoice.speak(text, "UK English Female", {
            onend: () => {
                console.log(`✅ Finished speaking: ${text}`);
                if (callback) callback();
            }
        });

        setTimeout(() => {
            console.warn("⚠️ Speech timeout! Skipping...");
            if (callback) callback();
        }, 5000);

    } else {
        console.error("❌ ResponsiveVoice.js not loaded! Skipping speech.");
        if (callback) callback();
    }
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