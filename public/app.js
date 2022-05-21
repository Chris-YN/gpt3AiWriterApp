


// script.js





//  ===============================
//   ////////// asdasd ///////////
//  ===============================
// namespace object
writerAiApp = {};


writerAiApp.outputArr = []

writerAiApp.keyaGrab = async () => {
  writerAiApp.envVarAccessReturn = await fetch("/.netlify/functions/envVarAccess")
    .then(response => response.json());
}

writerAiApp.feedTextPrompt = () => {
  const submitButtonTarget = document.querySelector(".submitButton");

  submitButtonTarget.addEventListener("click", function (event) {
    event.preventDefault();
    console.log("I work?")
    const textAreaTarget = document.querySelector(".userInput")
    const userPrompt = textAreaTarget.value;

    console.log(userPrompt)

    const data = {
      prompt: userPrompt,
      temperature: 0.5,
      max_tokens: 64,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    };

    fetch("https://api.openai.com/v1/engines/text-curie-001/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${writerAiApp.envVarAccessReturn.apiKey
          }`,
      },
      body: JSON.stringify(data),
    }).then((response) => {
      return response.json();
    }).then((jsonResult) => {
      console.log(userPrompt, "userPrompt")
      writerAiApp.outputArr.push(
        {
          prompt: userPrompt,
          result: jsonResult.choices[0].text
        }
      );

      console.log(writerAiApp.outputArr);
    }).then(() => {
      console.log("display function is here");
      const resultUlTarget = document.querySelector(".resultUl");
      const liElement = document.createElement("li");
      liElement.innerHTML = "";
      for (i = 0; i < writerAiApp.outputArr.length; i++) {
        liElement.innerHTML = `<p>Your request: ${writerAiApp.outputArr
        [i].prompt}<br>AI's answer: ${writerAiApp.outputArr
        [i].result}</p>`
        resultUlTarget.append(liElement);
      }
    })

  })
}


writerAiApp.displayResult = () => {

}


writerAiApp.init = function () {
  writerAiApp.keyaGrab()
    // .then(console.log(writerAiApp.apiKey))
    .then(writerAiApp.feedTextPrompt())
    .then(writerAiApp.displayResult());
  
  
  // async function asyncTest() {
  //   const output = await feedTextPrompt();
  //   console.log(output);
  // }
}

writerAiApp.init();
