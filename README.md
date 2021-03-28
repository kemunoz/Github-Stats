# Github-Stats
This is an API that returns user stats from Github
# Installation
1. Clone the repo like below
```bash
git clone https://github.com/kemunoz/Github-Stats.git
```
2. Install dependencies using npm
```bash
npm install
```
# Endpoints

GET /users/{username} <br />
Lists repository stats for {username}<br />
Params<br />
`forked` if set to false returns stats only for repos that are not forked<br />
### Example Code
```js
const resp = fetch(http://localhost:3000/users/{username}, {
  method: 'GET'
});
```

## Response
```
Status: 200 OK
```
```
{
  "repoCount": "55",
  "starGazerCount": "1563",
    "forkCount": "225",
    "languages": [
        "PHP",
        "Python",
        "CSS",
        "HTML",
        "C",
        "Go",
        "C++",
        "Standard ML",
        "JavaScript"
    ],
    "average_size": "17983"
}
```
