# Crypto cards done right
A public goods project aimed at creating the cheapest crypto debit card, with no hidden fees or costs, nor any centralised entity controlling it.

## Features
- Create multiple virtual and physical cards
- Top up your card with any crypto asset and from any EVM chain
- Pay anywhere in the world where Visa or Mastercard is accepted
- Control daily and monthly spend limits, pause and block cards
- Dispute fraudulent transactions
- Get notified of any card activity via Push protocol

## Project structure
* **Backend** responsible for basic CRUD requests, displaying, updating and creating new resources (users, cards and disputes), built with NestJS and MongoDb on top of Stripe Issuing API
* **Frontend** the UI for the project, built with React and Vite
* **Smart contract** a collection of multi-chain vaults that call cross-chain using CCIP an accountant contract to keep track of deposits, withdrawals and payments, built with Solidity and Foundry and using CCIP (by ChainLink)
