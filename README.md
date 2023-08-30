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

Use `npm i` to install the dependencies and `npm run test` to run the tests (or their pnpm/yarn equivalents).
`npm run test:watch` will keep tests running in the background (prefferred during development).

# Walkthrough

Fork this repository.

You should complete this kata using TDD, constantly cycling through RED -> GREEN -> REFACTOR stages where you start by writing a test, watch it fail, then write just what is needed to make the test pass.
To guide you through a proper way of tackling this problem, follow the following steps. Make sure to commit along the way (e.g. commit every time a new test passes).

## Step 1: first test

Start by running your tests (so far only one test in `test/checkout.test.ts`)... they will fail (RED).
Write **the minimum amount of code** to make that first test pass (GREEN). While doing so, type the function parameters (one parameter `itemList` of type `string`) and return value using Typescript (it's already installed and configured).
_Double-check whether your code can be refactored._ (REFACTOR)

<details>
  <summary>Hints (don't open unless stuck)</summary>
  - To pass this test, your function simply needs to return 0
  - In addition to writing the checkout function, you will need to import it in the test file.
</details>

## Step 2: More tests

Write the following test with the proper Jest syntax (using Jest functions such as `it`, `expect` and `toBe`) then run it:

> should return 50 when providing an A

Watch the test fail (RED) then modify your `checkout` function with `the minimum amount of code` necessary to pass this test (GREEN).
_Double-check whether your code can be refactored._ (REFACTOR)

<details>
  <summary>Hint (don't open unless stuck)</summary>
  Adding simple condition with the other return value will get your sorted.
</details>

When both tests pass, add the following tests, one at a time, making sure each one passes before tackling the next one:

> should return 30 when providing a B<br>
> should return 20 when providing a C<br>
> should return 15 when providing a D

If you find room for refactoring, don't forget to do so.
Note: At this stage, your implementation does not yet need to cover sequences of letters (e.g. providing "DD").

## Step 3: Handling a sequence of multiple letters

You should now have 5 tests passing. Your next tests are the following:

> should return 30 when providing two D<br>
> should return 115 when providing one of each (ABCD)

Note: If all you did was adding more conditional statements to check for specific "DD" and "ABCD" cases, you _need_ to go back and refactor your code. Tests never cover all possibilities, but at this stage any single or multiple-letter input should provide the expected result. (e.g. AABCD should do the same as DCABA). Feel free to add additional tests if you think it's needed.

<details>
  <summary>Hint (don't open unless stuck)</summary>
  Use `split` on `itemList`, a `for of` loop and an accumulator variable `total` initialized at 0.
</details>

## Step 4: Error handling

If a letter other than A, B, C or D is passed within the sequence of letters, the function should throw an error. Add a test to handle this. You will need to inspect the [Jest documentation](https://jestjs.io/docs/using-matchers) to choose the right function here.

<details>
  <summary>Hint (don't open unless stuck)</summary>
  Pay a closer look at [this section](https://jestjs.io/docs/using-matchers#exceptions) for an example of throwing an error and catching it with `toThrow`
  Also read the TIP section explaining that you need to wrap your function call inside an anonymous function for the test to pass.
</details>

## Step 5: Implementing Discount (Take 1)

At this stage, your application covers calculating costs without discounts. Your code might be something like this:

<details>
  <summary>Expand to view code (:warning: spoiler if you haven't finished previous steps)</summary>

```typescript
export function checkout(itemList: string): number {
  let total = 0
  for (const item of itemList.split("")) {
    if (item === "A") total += 50
    else if (item === "B") total += 30
    else if (item === "C") total += 20
    else if (item === "D") total += 15
    else throw new Error("Unknown Item")
  }
  return total
}
```

</details>

To implement discounts, a good first test could read as follows :

> should apply twice the discount when having 8 As

Write the test that checks the function resolves to the correct value, 360, watch it fail, and come with a solution to deal with this new requirement (make the test pass).
Write another test to make sure discounts for B are applied (e.g. providing BBB will apply once the discount once and return 75).

<details>
  <summary>Hint 1</summary>
  Keep your current logic and substract the amount that correspond to the discount from the total.
</details>

<details>
  <summary>Hint 2</summary>
  Since you know how many items are needed for getting the discount, you can now infer how many times the discount should be aplied.
  You may need to to know how many times a specific char appears using `split`, `filter` and `length`, and find a function from the `Math` standard library that keeps only the non-decimal part of a number.
</details>

## Step 6: OOP refactoring

At this stage you may have something like this:

<details>
  <summary>Expand to view code (:warning: spoiler if you haven't finished previous steps)</summary>

```typescript
export function checkout(itemList: string): number {
  let total = 0
  for (const item of itemList.split("")) {
    if (item === "A") total += 50
    else if (item === "B") total += 30
    else if (item === "C") total += 20
    else if (item === "D") total += 15
    else throw new Error("Unknown Item")
  }

  let countOfAs = itemList.split("").filter((c) => c === "A").length
  total -= Math.trunc(countOfAs / 3) * 20
  let countOfBs = itemList.split("").filter((c) => c === "B").length
  total -= Math.trunc(countOfBs / 2) * 15

  return total
}
```

</details>

This works fine, but has the following limitations :

- Item prices, discount rates and minimum amount of items for discounts to apply are all hardcoded within the application logic. (e.g. the checkout function).
- Our code is hardly DRY (doesn't respect the Don't Repeat Yourself principle). Operations applying the discount are duplicated for every new discount.
- We need new conditional statements in the `for of` loop for any new type of item in our store. This makes the core logic hard to read.

You got it, even though we're feature-complete, it's time for a refactor.

As we don't build new features here, we won't write new tests, but should make sure that our current test keep passing.

Do the following, in order:

1. Create global variables for all item prices, named accordingly (e.g `A_PRICE`, `B_PRICE` etc...). Global variables are typically kept at the very top of the file
2. Create an `Item` interface specifying a `getPrice` method that returns a number. Then create different classes for each item, all of which should _implement_ Item (see [the « `implements` Clauses » section of the doc](https://www.typescriptlang.org/docs/handbook/2/classes.html#implements-clauses)). Reflect changes in the classes (return the matching global variable). <br>
   You may still use a single file `checkout.ts` at this stage.
3. To use the classes created in `2.`, implement a `itemFactory` function taking a `itemChar: string` parameter and returning the correct new instance of `Item` depending on the character passed.<br>
   Use `itemFactory` to instantiate an item in the `for of` loop of the `checkout` method. You should be able to get rid of all conditional logic in the loop and simply use the `getPrice` method to add to the total at each pass of the loop. Make sure all tests are still green before moving on.
4. Move classes and their global variables to their own files. Also move the `itemFactory` and `Item` interface to a `Item.ts` file. Make sure to export/import where need be.<br>
   Make sure all tests are still green before moving on.
5. Create a `Discount` class with a constructor taking parameters `itemType: ItemType`, `quantity: number` and `discount: number` all three `private` (take a look at the [member visibility section](https://www.typescriptlang.org/docs/handbook/2/classes.html#member-visibility) of the docs if you need a reminder on private props/methods). Create `ItemType` as an enum (see TS docs) representing all possible values/chars for an item.<br>
   The `Discount` class will have a `calculateDiscount` method accepting an `ItemList` as argument and handling the bit of repetitive discount calculations we added in Step 5. You'll need to edit sligthly the calculations to make them generic using class properties then use it within the `checkout` function. Your tests should still be green.
6. Values for Discounts are still hardcoded in `checkout`. To fix that, create a `Store` class that takes a private `discountList` in its constructor. Make `checkout` become a method of that class. This will beak your tests - you'll need to instanciate a new store class in `checkout.test.ts` and call the `checkout` method on the instanciated variable. When all is green again, move the instanciations of Discount class to the test file and pass these discount as the `discountList` parameter of `Store`. You will need to alter your discount calculation logic in the `checkout` method so that it is applied for each entry of the list.
7. Finally, extract the two main pieces of logic of the `checkout` method to two methods `calculateTotal` and `calculateDiscount`.
8. Double check for any additional refactor. Your final `Store` class should look similar to this:

<details>
  <summary>Expand to view code (:warning: spoiler if you haven't finished previous steps)</summary>

```typescript
import { Discount } from "./Discount"
import { itemFactory } from "./Item"

export class Store {
  constructor(private discountList?: Discount[]) {}

  checkout(itemList: string): number {
    const total = this.caclulateTotal(itemList)
    const discount = this.calculateDiscount(itemList)

    return total - discount
  }

  private calculateDiscount(itemList: string) {
    let totalDiscount = 0
    for (const discount of this.discountList) {
      totalDiscount += discount.calculateDiscount(itemList)
    }
    return totalDiscount
  }

  private caclulateTotal(itemList: string) {
    let total = 0
    for (const itemChar of itemList.split("")) {
      const item = itemFactory(itemChar)
      total += item.getPrice()
    }
    return total
  }
}
```

</details>

# Credits

This worshop is based off [a Udemy course by Josep Mir](https://www.udemy.com/course/practice-tdd-with-node-typescript-and-jest-checkout-kata/learn/lecture/31241880#overview)
