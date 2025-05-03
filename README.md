# Base Exchange API

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/en/download/)
[![GraphQL](https://img.shields.io/badge/GraphQL-blueviolet.svg)](https://graphql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Tests](https://github.com/pedrojose06/base-exchange-api/actions/workflows/test.yml/badge.svg)

Esta é uma API básica de controle de ordens construída usando Node.js e GraphQL. Ela permite que os usuários obtenham informacoes sobre ordens executadas, pendentes, canceladas e abertar, e é possivel criar uma nova ordem, cancelar, ver histórico de execuções e detalhes.

## Funcionalidades

* **Obtenção de Taxas de Câmbio via GraphQL:** Obtenha dados das ordens mais recente usando consultas GraphQL.
* **API Autodocumentada:** GraphQL fornece um mecanismo integrado para documentação e exploração da API.
* **Busca Eficiente de Dados:** Os usuários podem solicitar apenas os dados específicos de que precisam.
* **Tratamento Básico de Erros:** Fornece respostas de erro informativas para consultas inválidas.

## Primeiros Passos

### Pré-requisitos

* **Node.js 18+**
* **npm** ou **yarn** (gerenciadores de pacotes do Node.js)

### Instalação

1.  Clone o repositório:
    ```bash
    git clone https://github.com/pedrojose06/base-exchange-api
    cd base-exchange-api
    ```

2.  Instale as dependências usando npm:
    ```bash
    npm install
    ```
    ou usando yarn:
    ```bash
    yarn install
    ```

### Executando a API

1.  Inicie o servidor de desenvolvimento usando npm:
    ```bash
    npm run dev
    ```
    ou usando yarn:
    ```bash
    yarn dev
    ```

2.  A API GraphQL estará acessível em `http://localhost:4000/graphql`. Você pode usar ferramentas como o GraphiQL, que geralmente é integrado, para explorar o schema e executar consultas.

## API GraphQL

### Consultas (`Queries`)

Você pode usar os exemplos de queries a seguir no playground do GraphQL

#### `orders(limit: Int, page: Int): PaginatedOrders`

Retorna lista de ordens mais recentes, definindo a quantidade por página e a página que deve exibir.

**Argumentos:**

* `limit` (Int): Quantidade máxima de ordens por página.
* `page` (Int): Número da página.

**Tipo de Retorno:**

```graphql
type PaginatedOrders {
  totalPages: Int!
  orders: [Order]!
}
```

**Exemplo de Query:**
```graphql
query {
  orders(limit: 5, page: 1) {
    totalPages
    orders {
      id
      instrument
      side
      price
      quantity
      remainingQuantity
      status
      createdAt
      updatedAt
    }
  }
}
```

---

#### `order(id: ID): Order`

Recupera uma ordem específica pelo ID.

**Argumentos:**

* `id` (ID): O identificador da ordem.

**Tipo de Retorno:**

```graphql
type Order {
  id: ID!
  instrument: String!
  side: Int!
  price: Float!
  quantity: Float!
  remainingQuantity: Float!
  status: String!
  createdAt: String!
  updatedAt: String!
}
```

**Exemplo de Query:**
```graphql
query {
  order(id: "1") {
    id
    instrument
    side
    price
    quantity
    remainingQuantity
    status
    createdAt
    updatedAt
  }
}
```

---

#### `ordersByFilter(filters: FiltersInput, limit: Int, page: Int): PaginatedOrders`

Retorna uma lista paginada de ordens filtradas por critérios específicos.

**Argumentos:**

* `filters` (FiltersInput): Filtros para busca (id, instrument, side, status, createdAt).
* `limit` (Int): Quantidade máxima de ordens por página.
* `page` (Int): Número da página.

**Tipo de Retorno:**

```graphql
type PaginatedOrders {
  totalPages: Int!
  orders: [Order]!
}
```

**Exemplo de Query:**
```graphql
query {
  ordersByFilter(
    filters: { instrument: "PETR4", status: "open" }
    limit: 5
    page: 1
  ) {
    totalPages
    orders {
      id
      instrument
      side
      price
      quantity
      remainingQuantity
      status
      createdAt
      updatedAt
    }
  }
}
```

---

#### `orderHistoryDetailById(id: ID!): [OrderHistoryDetail]!`

Recupera o histórico de execução de uma ordem pelo ID.

**Argumentos:**

* `id` (ID!): O identificador da ordem.

**Tipo de Retorno:**

```graphql
type OrderHistoryDetail {
  orderId: ID!
  executedQuantity: Int!
  quantity: Int!
  createdAt: String!
}
```

**Exemplo de Query:**
```graphql
query {
  orderHistoryDetailById(id: "1") {
    orderId
    executedQuantity
    quantity
    createdAt
  }
}
```

Retorna lista de ordens mais recentes, definindo a quantidade por pagina e a pagina que deve exibir.

**Argumentos:**

* `limit` (Int): Quantid
* `page` (Int): Número da página.

**Tipo de Retorno:**

```graphql
type PaginatedOrders {
  totalPages: Int!
  orders: [Order]!
}
```

**Exemplo de Query:**
```graphql

query {
  orders(limit: 5, page: 1) {
    totalPages
    orders {
      id
      instrument
      side
      price
      quantity
      remainingQuantity
      status
      createdAt
      updatedAt
    }
  }
}
```

### Mutations

Você pode usar os exemplos de mutations a seguir no playground do GraphQL, para inserir valores do projeto.

#### `updateOrderStatus(id: ID!, status: String!): Order`

Atualiza o status de uma ordem específica.

**Argumentos:**

* `id` (ID!): O identificador da ordem.
* `status` (String!): O novo status da ordem.

**Tipo de Retorno:**

```graphql
type Order {
  id: ID!
  instrument: String!
  side: Int!
  price: Float!
  quantity: Float!
  remainingQuantity: Float!
  status: String!
  createdAt: String!
  updatedAt: String!
}
```

**Exemplo de Mutation:**
```graphql
mutation {
  updateOrderStatus(id: "1", status: "executed") {
    id
    status
    updatedAt
  }
}
```

---

#### `insertOrder(order: OrderInput!): Order`

Cria uma nova ordem.

**Argumentos:**

* `order` (OrderInput!): Os dados da nova ordem.

**Tipo de Retorno:**

```graphql
type Order {
  id: ID!
  instrument: String!
  side: Int!
  price: Float!
  quantity: Float!
  remainingQuantity: Float!
  status: String!
  createdAt: String!
  updatedAt: String!
}
```

**Exemplo de Mutation:**
```graphql
mutation {
  insertOrder(order: {
    instrument: "PETR4"
    side: 1
    price: 10.5
    quantity: 100
  }) {
    id
    instrument
    side
    price
    quantity
    remainingQuantity
    status
    createdAt
    updatedAt
  }
}
```