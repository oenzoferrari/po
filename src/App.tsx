import { solve } from "./business";

function App() {
  console.log(
    solve({
      optimize: "cost",
      operation: "min",
      constraints: {
        cost: { max: 25_000, min: 0 },
        peopleAmount: { max: 50, min: 10 },
        manAmount: { max: 30, min: 5 },
        womanAmount: { max: 35, min: 6 },
      },
      variables: {
        man: {
          cost: 1_000,
          manAmount: 1,
          peopleAmount: 1,
        },
        woman: {
          cost: 750,
          womanAmount: 1,
          peopleAmount: 1,
        },
      },
      integer: true,
    })
  );

  return <h1>Hello, world</h1>;
}

export default App;
