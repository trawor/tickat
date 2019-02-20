# Tickat [still in alpha, do NOT use in production]
A ticket system base on GitHub issue

## Prepare
1. Create an Github repo for the incoming tickets
2. Add a new user to the repo or use your own
3. Get the user token here: https://github.com/settings/tokens/new

## Usage

1. install
`npm i tickat`

2. API

``` javascript
const Tickat = require('tickat');
const tk = new Tickat('YOUR GITHUB TOKEN', 'ORG_NAME/REPO_NAME');

/* Get All Tickets with 
- uid(optional, the user uniq id in your own system)
- state(optional, null means all)
*/
const allTks = await tk.getTickets(uid, state);
console.log(allTks);

const newtk = await tk.create(uid, 'test2', 'hello test');
console.log(newtk);

const cst = await tk.close(2);
console.log(cst);
```

## TODO
[ ] Web Management UI  
[ ] SDK for Web  
[ ] SDK for App  
