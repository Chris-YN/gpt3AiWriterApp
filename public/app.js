


// script.js





//  ===============================
//   ////////// asdasd ///////////
//  ===============================
// namespace object
writerAiApp = {};


// method to utilize Netlify's environment variable with serverless function
writerAiApp.keyaGrab = async () => {
  writerAiApp.envVarAccessReturn = await fetch("/.netlify/functions/envVarAccess")
  .then(response => response.json());
}


// method to generate robot avatar with robohash api 
// avatar generated is based on user's name input given to AI
writerAiApp.AvatarGeneration = () => {
  const nameSubmitTarget = document.querySelector(".nameSubmit")

  nameSubmitTarget.addEventListener("click", (event) => {
    event.preventDefault();

    const nameInputTarget = document.querySelector("#aiName")

    writerAiApp.aiNameGiven = nameInputTarget.value;
    document.querySelector(".avatarImageContainer").innerHTML = `<img src="https://robohash.org/${writerAiApp.aiNameGiven}.png" alt="Image of your AI avatar">`
  })
}



// array to store responses as objects from openAI api
writerAiApp.outputArr = []

// method to make API call to openAI with user input as prompt
// user input and response string is pushed(unshift()to push in reverse order)
    // to writerAiApp.outputArr as an object
writerAiApp.feedTextPrompt = () => {
  const promptSubmitTarget = document.querySelector(".promptSubmit");

  promptSubmitTarget.addEventListener("click", function (event) {
    event.preventDefault();

    const resultUlTarget = document.querySelector(".resultUl");

    // if statement to ensure that the user has given name to AI and generated avatar
    if (writerAiApp.aiNameGiven){
      const textAreaTarget = document.querySelector(".userInput")
      const userPrompt = textAreaTarget.value;
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
        writerAiApp.outputArr.unshift(
          {
            prompt: userPrompt,
            result: jsonResult.choices[0].text
          }
        );
      }).then(() => {
        resultUlTarget.innerHTML = "";
  
        for (i = 0; i < writerAiApp.outputArr.length; i++) {
          const liElement = document.createElement("li");
  
          liElement.innerHTML = 
          `<p><span>Your request:</span> ${writerAiApp.outputArr[i].prompt}</p>
          <p class="aiP"><span>AI's answer:</span> ${writerAiApp.outputArr[i].result}</p>`
          resultUlTarget.append(liElement);
        }
        textAreaTarget.value = ""
      })

    // if the user has skipped name and avatar generation 
    } else {
      resultUlTarget.innerHTML = "<p>Please give AI a name first</p>"
    }
  })
}


// writerAiApp.init
writerAiApp.init = function () {
  writerAiApp.AvatarGeneration()
  writerAiApp.keyaGrab()
    .then(writerAiApp.feedTextPrompt())
    // .then(writerAiApp.displayResult());
}

writerAiApp.init();
