


// script.js

// namespace object
writerAiApp = {};


// method to utilize Netlify's environment variable with serverless function
writerAiApp.keyaGrab = async () => {
  writerAiApp.envVarAccessReturn = await fetch("/.netlify/functions/envVarAccess")
  .then(response => response.json());
}



// method to generate robot avatar with robohash api 
// avatar generated is based on user's name input given to AI
// Also make button to start chat with AI visible
writerAiApp.AvatarGeneration = () => {
  const nameSubmitTarget = document.querySelector(".nameSubmit")
  const nameInputTarget = document.querySelector(".aiName")
  const chatStartTarget = document.querySelector(".chatStartButtonContainer")

  nameSubmitTarget.addEventListener("click", (event) => {
    event.preventDefault();

    writerAiApp.aiNameGiven = nameInputTarget.value;

    if (writerAiApp.aiNameGiven){
      document.querySelector(".avatarImageContainer").innerHTML = `<img src="https://robohash.org/${writerAiApp.aiNameGiven}.png" alt="Image of your AI avatar">`
  
      chatStartTarget.innerHTML = `<button type="submit" class="chatStartSubmit">Let's start a chat with ${writerAiApp.aiNameGiven}</button>`
      nameInputTarget.value = ""
    } else{
      chatStartTarget.innerHTML = "<p>Please give AI a name to proceed</p>"
    }
  })
}



// method to show and hide chat modal that serves as main area of interaction
writerAiApp.chatModal = () => {
  const chatStartSubmitTarget = document.querySelector(".chatStartButtonContainer");
  const chatCloseButtonTarget = document.querySelector(".chatCloseButton");

  chatStartSubmitTarget.addEventListener("click", (event) => {
    event.preventDefault();

    document.querySelector(".chatAndPromptHistory").classList.toggle("hideElement");
  })

  chatCloseButtonTarget.addEventListener("click", ()=>{
    document.querySelector(".chatAndPromptHistory").classList.toggle("hideElement");
    window.location.reload();
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
          `<p class="userP">
            <span>Your request:</span> ${writerAiApp.outputArr[i].prompt}
          </p>
          <div class="aiResponseContainer">
            <div class="chatboxAvatarPortraiContainer">
              <img src="https://robohash.org/${writerAiApp.aiNameGiven}.png" alt="Image of your AI avatar">
            </div>
            <p class="aiP">
              <span>${writerAiApp.aiNameGiven}'s answer:</span> ${writerAiApp.outputArr[i].result}
            </p>
          </div>`
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
  writerAiApp.AvatarGeneration();
  writerAiApp.keyaGrab()
    .then(writerAiApp.feedTextPrompt());
  writerAiApp.chatModal();
}

writerAiApp.init();
