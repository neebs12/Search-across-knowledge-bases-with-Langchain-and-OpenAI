# Search across knowledge bases with Langchain and OpenAI

Built with Typescript, Langchain, OpenAI, HNSWLib(local vectorstore) in the backend, and React, Vite, TailwindCSS in the frontend.

Main features:

- All in file (no use of external clients apart from OpenAI)
- Cross-knowledge base search
- Context-aware conversations

## What you need

- Have Node 18 and Typescript 5.0 installed
- Create a .env file in the `/backend` directory with the following variables:

```
OPENAI_API_KEY="..."

# switch to "gpt-3.5-turbo" if you dont have access
# app may not contextualize as well though...
QUESTION_REFINER_AGENT_MODEL_NAME="gpt-4"
```

## Demo

> Here is an example conversation
> ![Pasted image 20230410161507](https://user-images.githubusercontent.com/51255216/230964287-3d446008-48c0-4492-9356-79552640b84f.png)

> Here is the full app. Only `Multi Resources` conducts the cross knowledgebase search
> ![image](https://user-images.githubusercontent.com/51255216/230964811-181f02ea-bdd7-41bc-a5c1-3ffcd06cbc91.png)

## How to run

```bash
bash initialize.sh # installs dependencies
bash start.sh # or bash dev.sh
```

Use `localhost:3000` if you ran `bash start.sh` OR
`localhost:5173` if you ran `bash dev.sh`

## Structuring for personal use

```bash
bash ingest.sh # ingests text files into local vectorstore
```

### Using your own data

- Go to `./backend/text-files`
- Each folder is a treated as a "knowledgebase", where each file inside is a "document" that is TEXT only. In my usecase, I used the text filenames inside the folder as encoded links to the articles the texts came from. So `https://hnry.co.nz/theleap/the-gig-economy/` is replaced with `hnry.co.nz_theleap_the-gig-economy.txt`. This is used as "sources" in the frontend. But, its not really critical. You can just use the filenames as the "sources" if you want.
- So ideally, your folder structure should look like this:

```
./backend/text-files/{namespace}
├── hnry.co.nz_theleap_the-gig-economy.txt
├── hnry.co.nz_theleap_7-tips-for-self-employment-nz
├── ...
```

Then you need to modify the `knowledgebase-constants.json` if you created a new folder (or deleted existing ones) - see next section.

### Adding new knowledgebases

You need to modify the `/knowledgebase-constants.json` file as this is referenced by AI agents to know which knowledgebase to search for a given question. Here is an example:

```json
[
  {
    "name": "Test Data",
    "namespace": "test-data",
    "description": "This knowledge base is for testing purposes only. It contains dummy data that can be used for testing and development purposes. This knowledge base is not intended for production use.",
    "image": "https://cdn.pixabay.com/photo/2016/11/23/18/27/hummingbird-1854225_960_720.jpg"
  }
]
```

- `name` is the name of the knowledgebase that appears on the frontend
- `namespace` is the name of the folder in `./backend/text-files` that you store the text files
- `description` is the description of the knowledgebase THAT IS REFERENCED BY THE AI AGENT. So make this as descriptive as possible. This is used to inform the AI agent to understand what the knowledgebase is about.
- `image` is the image that appears on the frontend 😃
