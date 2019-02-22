# Tickat [still in alpha, do NOT use in production]
A ticket system base on GitHub issue

## Why
Github is greate platform and data source for open source project.  
But, if you want it be a ticket management system, if your customors or users are not Github user, how to deal with this case?

Here Tickat, is a soluation.

Tickat makes a few tricks to the issue body to identify users instead of the Github auth.

Every ticket(issue) has a common head in body:
```
- uid:[the user uniq id in your own system]
- other metas in the future
----
```
And then you will filter the user with Github's powerful API.  
That's all!


## Prepare
1. Create an Github PRIVATE private repo for the incoming tickets
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
const allTks = await tk.find(uid, state);
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
