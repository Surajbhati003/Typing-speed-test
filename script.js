
const typing_ground=document.querySelector('#textarea');
const btn=document.querySelector('#btn');
const score=document.querySelector('#score');
const show_sentence=document.querySelector('#showSentence');
const speedChartElement = document.getElementById('speedChart').getContext('2d');
const chartContainer = document.querySelector('.chart-container');

let startTime,endTime,totalTimeTaken;
let wordTimes = [];
let chart;

const sentences=[
    "The quick brown fox jumps over the lazy dog.",
    "Many hands make light work.", 
    "By failing to prepare, you are preparing to fail.",
    "Practice makes perfect.",
    "Pack my box with five dozen liquor jugs.",
  ];

const startTyping=()=>{
    let randomNumber=Math.floor(Math.random()*sentences.length);
    let newSentence;
    wordTimes=[];
    show_sentence.innerHTML=sentences[randomNumber];
    let date = new Date();
    startTime=date.getTime();
    typing_ground.focus(); // use for automatically shift to textbox when hit start
    btn.innerText="Done"; 
    resetChart();
    resetScore();
    
}
// reseting score after hit restart.
const resetScore = () => {
  score.innerHTML = '';
};
// Handle "Enter" key to end typing
typing_ground.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
      btn.dispatchEvent(new Event('click')); 
    }
  });
  // used for calculating mistakes
const calculateMistakes = () => {
    const typedSentence = typing_ground.value.trim().toLowerCase(); // Get user's typed sentence (lowercase)
    const actualSentence = show_sentence.textContent.toLowerCase(); // Get displayed sentence (lowercase)
  
    let mistakes = 0;
  
    // Loop through characters and compare for mismatches
    for (let i = 0; i < actualSentence.length; i++) {
      if (typedSentence[i] !== actualSentence[i] && typedSentence[i] !== "") {
        mistakes++;
      }
    }
  
    // Additional check for extra characters typed by the user
    if (typedSentence.length > actualSentence.length) {
      mistakes += typedSentence.length - actualSentence.length;
    }
  
    return mistakes;
  };
  
// calculates typing speed  
const calculateTypingSpeed=()=>
    {
        let totalWords=typing_ground.value.trim();
        let actualWords= totalWords === ''? 0:totalWords.split(" ").length;
        const mistakes = calculateMistakes();

        if(actualWords !== 0)
            {
                let typing_speed = (actualWords/totalTimeTaken)*60;
                typing_speed=Math.round(typing_speed);
                score.innerHTML=`Typing Speed is ${typing_speed} wpm and words wrote ${actualWords} words & time taken ${totalTimeTaken}sec Mistakes made ${mistakes} `;
            }
        else
            score.innerHTML=`Typing Speed is 0 wpm and time taken ${totalTimeTaken}sec`;

    }
const endTypingTest = ()=>{
    btn.innerText="Start";
    let date=new Date();
    endTime=date.getTime();
    totalTimeTaken=(endTime-startTime)/1000;
    
    calculateTypingSpeed(totalTimeTaken);
    show_sentence.innerHTML="";
    typing_ground.value="";  
    displaySpeedChart();
}

 btn.addEventListener('click',()=>
{
    switch(btn.innerText.toLowerCase())
    {
        case "start":
            typing_ground.removeAttribute('disabled');
            startTyping();
            break;
        case "done":
            typing_ground.setAttribute('disabled','true');
            endTypingTest();
            break;
    }
})
//functions used for graphical presentation

// Record time for each word typed
typing_ground.addEventListener('keyup', (event) => {
  if (event.key === ' ') {
      recordWordTime();
  }
});

const recordWordTime = () => {
  const currentTime = new Date().getTime();
  const timeTaken = (currentTime - startTime) / 1000; // time in seconds
  wordTimes.push(timeTaken);
};
const displaySpeedChart = () => {
  const wordSpeeds = wordTimes.map((time, index) => {
      const words = index + 1;
      return (words / time) * 60; // wpm
  });

  const labels = wordTimes.map((_, index) => `Word ${index + 1}`);

  chartContainer.style.display = 'flex';

  chart = new Chart(speedChartElement, {
      type: 'line',
      data: {
          labels: labels,
          datasets: [{
              label: 'Typing Speed (WPM)',
              data: wordSpeeds,
              borderColor: 'rgba(99, 132, 255, 1)',
              borderWidth: 2,
              fill: false
          }]
      },
      options: {
          scales: {
              x: {
                  title: {
                      display: true,
                      text: 'Word Count'
                  }
              },
              y: {
                  title: {
                      display: true,
                      text: 'Speed (WPM)'
                  },
                  beginAtZero: true
              }
          }
      }
  });
};
const resetChart = () => {
  // Hide chart container and destroy chart instance
  chartContainer.style.display = 'none';
  if (chart) {
      chart.destroy();
      chart = null;
  }
};
  
