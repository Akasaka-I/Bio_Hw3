document.getElementById('sequenceForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Clear previous output
    document.getElementById('outputContainer').innerHTML = '';

    // Get sequences from textarea or file input
    let sequences = [];
    const sequenceInput = document.getElementById('sequenceInput').value.trim();
    if (sequenceInput !== '') {
        sequences = sequenceInput.split('\n');
        processSequences(sequences);
    } else {
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            sequences = e.target.result.trim().split('\n');
            processSequences(sequences);
        };
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
              sequences = e.target.result.trim().split('\n');
              processSequences(sequences);
            };
            reader.readAsText(file);
        } 
        else {
            // handle error or display message to user
        }
    }
});

function processSequences(sequences) {

    for(let i = 0; i < sequences.length; i++) {
        if(sequences[i].length > 16) {
            alert("Sequence " + (i+1) + " is too long. Please provide sequences of length 16 or less.");
            return;  // Stop processing
        }
    }
    
    if(sequences.length > 16) {
        alert("Too many sequences. Please provide 16 sequences or less.");
        return;  // Stop processing
    }

    // Send sequences to Python script using fetch API
    fetch('https://akasaka-i.github.io/Bio_Hw3/process_sequence', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sequences: sequences })
    })
        .then(response => response.json())
        .then(data => displaySequenceLogo(data));
}

function displaySequenceLogo(logoData) {
    const outputContainer = document.getElementById('outputContainer');
    const logoImg = document.createElement('img');
    logoImg.src = 'data:image/png;base64,' + logoData;
    outputContainer.appendChild(logoImg);
}
