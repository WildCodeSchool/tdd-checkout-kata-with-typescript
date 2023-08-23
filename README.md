# Checkout Kata

Write a program that implements a checkout system of a store. This program takes a set of products as string (`ABBDBBAC`) representing the products in a shopping cart and returns the total payable amount. Each product has a fixed price and some have special discounts.

Table of prices:

```
Item	Price	Discount
================================
A		50		3 for 130
B		30		2 for 45
C		20
D		15
```

Example results:

```
AA -> 100
AABCDADDCD -> 260
AAABBBCCCDDD -> 310
```

<br>

To run the tests, execute:  
`npm i` to install the dependencies and then  
`npm run test` to run the tests
