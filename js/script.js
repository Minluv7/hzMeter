document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("startButton");
    const resultDiv = document.getElementById("result");

    let audioContext;
    let analyser;
    let animationFrameId;

    startButton.addEventListener("click", () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
        }

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                const microphone = audioContext.createMediaStreamSource(stream);
                microphone.connect(analyser);

                const dataArray = new Uint8Array(analyser.frequencyBinCount);

                function updateFrequency() {
                    analyser.getByteFrequencyData(dataArray);

                    // Bereken de dominante frequentie
                    const maxIndex = dataArray.indexOf(Math.max(...dataArray));
                    const frequency = maxIndex * (audioContext.sampleRate / analyser.fftSize);

                    resultDiv.textContent = `Gemeten frequentie: ${frequency.toFixed(2)} Hz`;

                    // Vraag een volgende animatieframe aan voor continue updates
                    animationFrameId = requestAnimationFrame(updateFrequency);
                }

                // Start de continue update
                updateFrequency();
            })
            .catch((error) => {
                console.error("Er is een fout opgetreden bij het opnemen van audio:", error);
            });
    });

    // Stop de animatiefunctie wanneer de pagina wordt verlaten om geheugenlekken te voorkomen
    window.addEventListener("beforeunload", () => {
        cancelAnimationFrame(animationFrameId);
    });
});
