import solver from "javascript-lp-solver";

type Operation = "max" | "min";

interface IConstraint {
  [key: string]: { [key in Operation]: number };
}

interface IVariable {
  [key: string]: { [key: string]: number };
}

interface ILinearModel {
  optimize: string;
  operation: Operation;
  constraints: IConstraint;
  variables: IVariable;
  integer?: boolean;
}

interface ILinearResult {
  feasible: boolean;
  result: number;
  variableResult: { [key: string]: number };
}

/**
 *
 * @param optimize Parâmetro a ser otimizado. Deve estar presente nas propriedades de cada variável.
 * @param operation Operação a ser realizada no parâmetro ```optimize```. Deve ser "max" ou "min". Aqui é bem óbvio.
 * @param constraints Constraints a serem aplicadas. Devem ser presentes nas propriedades de cada variável.
 * Deve ser específicado o valor máximo e mínimo para aquela constraint. Exemplo: `peopleInTheRoom: { max: 3, min: 1 }`,
 * para uma sala que deve suportar no mínimo uma pessoa e no máximo 3.
 * @param variables Variáveis do sistema. Similar à função objetivo do simplex. O valor de cada propriedade significa o quanto contribui para o total da chave.
 * Por exemplo, `man: { cost: 1_000 }` significa que cada `man` contribui em `1_000` para o `cost` total do sistema.
 * @param integer Informa se os resultados devem ser restritos a valores inteiros.
 * @example
 * // Retorna a otimização do probléma para custo mínimo.
 * //   {
 * //     feasible: true
 * //     result: 9500
 * //     variableResult: {
 * //     man: 5
 * //     woman: 6
 * //   }
 * //}
 * solve({
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
 */
export function solve({
  optimize,
  operation,
  constraints,
  variables,
  integer,
}: ILinearModel) {
  const integerMap = getIntegerMap(variables, integer);

  let model: any = {
    optimize,
    opType: operation,
    constraints,
    variables,
  };

  if (integerMap) {
    model = {
      ...model,
      ints: integerMap,
    };
  }

  const { feasible, result, isIntegral, bounded, ...rest } =
    solver.Solve(model);

  const linearResult: ILinearResult = {
    feasible,
    result,
    variableResult: rest,
  };

  return linearResult;
}

function getIntegerMap(variables: IVariable, integer: boolean | undefined) {
  interface IIntegerMap {
    [key: string]: 1 | 0;
  }

  const map: IIntegerMap = {};
  if (integer) {
    for (const key in variables) {
      map[key] = 1;
    }
  }

  return map;
}
