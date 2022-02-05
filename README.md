
## developement
The smart contracts are build using truffle and tested locally using ganache-cli.


## test
it is assumed that you have nodejs and yarn installed. You also need to have metamask extension added to your chrome beowser.

The next steps will be:
1. Clone project
2. yarn in main directory will install all dependencies
```
yarn
```
3. yarn start will run DApp http://localhost:3000/
```
yarn start
```
If you are going to redeploy the contracts to testtnet you can use:
```
truffle migrate --reset --network rinkeby
```
## test locally using ganache
You need to install truffle and ganache and truffle hdwallet-provider to compile, migrate, and test smart contracts locally.
In a command line window run: ganache-cli
Move to another command line window.
In AssetDonation sub-directory:
```
1. truffle compile
```
```
2. truffle migrate
```
```
3. truffle console
```
```
4. truffle test
```
