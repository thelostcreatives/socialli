## Demo video

[![Alt text](https://img.youtube.com/vi/8HFruukD1yg/0.jpg)](https://www.youtube.com/watch?v=8HFruukD1yg)

# Socialli

Nobody is one-dimensional, why should we only have one social media feed? 
On socialli we can have multiple "lists", a feed for our different interests. 
We might like a person's art, but not their politics, then just follow their "art list". :)

Socialli is an opensource decentralized social media app built with Blockstack.

## Features
### Data Ownership
Your data is your own. Private data, like the "lists" you follow are only accessible by you. Thus, can't be exploited.

### Host Independent Socialli Instances
You are not stuck with socialli.st. If you want to host or join an instance of Socialli
exclusively for your family, friends, or community, you can do so. 
As a host, you can choose to make it public or private where only people you add as members can access.

### Universal Login
As a user, you don't need to make multiple accounts, you only need your
[Blockstack](https://blockstack.org/) account to access different socialli instances.

### [More (Hosting Instructions)](https://www.notion.so/socialli/Socialli-55db29d73b7e43118b65167b4b1691dd)

# Contributing

## Setup
- Make sure `node` is available. (Using `yarn` as the package manager) 
- Need a [Blockstack](https://blockstack.org/) account 

### React Setup

In the `src` directory, edit `socialli_config.js`

```
const config = {
	host: "your.id.blockstack",
	instance_name: "Socialli or any other name",
	instance_description: "Socialli.st is a socialli instance for everyone. (or something else)"
}
```

Install dependencies:
```
yarn install
```

In the `server` directory, create a `.env` file with the content:
```
MONGO_DB_URL="mongodbUrl"
```

`cd` into the `server` directory and install dependencies:
```
cd server
yarn install
```

Start react app: 
```
//in root directory
yarn start
```
Available at http://127.0.0.1:3000/ by default. You can change this to `localhost` in the `.env.development` file

Start server:
```
//in server directory
node index.js
```

Then start making your changes :)