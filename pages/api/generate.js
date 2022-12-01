import { Configuration, OpenAIApi } from "openai";


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const basePromptPrefix = 
`Extract and list out these items from the contract:
Owner:
Address:
Contract Cost/Price:
General Contractor:
Project Description:
Scope:
License Number:
Start Date:
End Date:
`


const generateAction = async (req, res) => {
  console.log(`API: ${basePromptPrefix}${req.body.userInput}\n`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature:0.01,
    max_tokens:400,
  })

  const basePromptOutput = baseCompletion.data.choices.pop();

  const secondPrompt = 
  `
  take the list of data and provide the show total price, owner, address, start date, end date, and length of contract in months
  `

  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    temperature: 0.01, 
    max_tokens: 1000
  });

  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;