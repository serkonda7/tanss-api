# tanss-api
[![CI][ci-badge]][ci-status]
[![npm version][npm-badge]][npm-link]
[![npm updated][npm-date-badge]][npm-link]

TypeScript client for the TANSS API.


## ℹ️ Disclaimer
This project is an _unofficial_ API client for TANSS.

It is not affiliated with, endorsed by, or sponsored by TANSS or its owners.
TANSS and related trademarks remain the property of their respective owners.

Use of this package requires valid access to a TANSS installation and appropriate API permissions.

The authors provide this client as-is and make no guarantees regarding correctness, availability, compatibility, or future changes of the TANSS API.


## 📦 Installation
```sh
bun install tanss-api
```


## 🚀 Usage
Also check out the TANSS API docs: https://api-doc.tanss.de/#description/introduction


### Configure the client
```ts
import { client } from 'tanss-api'

client.setConfig({
  baseUrl: 'https://tanssserver.example.com'
})
```

### Authenticate
```ts
import { postApiV1Login, client } from 'tanss-api'

const { data } = await postApiV1Login({
  body: {
    username: process.env.TANSS_USER!,
    password: process.env.TANSS_PASS!,
  },
  // `baseUrl` can also be set per-request instead of via setConfig
  baseUrl: 'https://tanssserver.example.com',
})

// `apiKey` already includes the literal `Bearer ` prefix — send it verbatim.
client.setConfig({ auth: data!.content.apiKey })
```

### Make requests
```ts
import { getApiV1TicketsOwn, putApiV1TicketsTicketId, type Ticket } from 'tanss-api'

// GET /api/v1/tickets/own
const { data, error } = await getApiV1TicketsOwn()

if (error) {
  console.error(error)
} else {
  for (const ticket of data!) {
    console.log(ticket.id, ticket.subject)
  }
}

// Update a ticket — path params go in `path`, query in `query`, payload in `body`
await putApiV1TicketsTicketId({
  path: { ticketId: 42 },
  body: { stateId: 5 },
  throwOnError: true, // reject on non-2xx instead of returning { error }
})
```


## 🏭 ERP integrations
For the `/api/erp/v1/...` and `/api/v1/erp/...` endpoints, use the namespaced
ERP client instead of the raw generated functions. It groups all 40+ ERP
operations into resources (`companies`, `employees`, `tickets`, ...), returns
response bodies directly, and throws an `ErpApiError` on non-2xx responses.

> Requires a dedicated API token bound to an external API role of `ERP`,
> `CENTRON`, or `SYSTEMHAUS_ONE` — a normal user login token will NOT work.
> The token already includes the literal `Bearer ` prefix, send it verbatim.

### Configure the ERP client
```ts
import { createErpClient } from 'tanss-api'

const erp = createErpClient({
  baseUrl: 'https://tanssserver.example.com',
  token: process.env.TANSS_ERP_TOKEN!,
})
```

Unlike the shared `client` singleton, each ERP client owns an isolated
instance, so auth from other API areas can't leak into ERP requests.
Rotate the token later with `erp.setToken(nextToken)`.

### Make requests
```ts
import { createErpClient, ErpApiError } from 'tanss-api'

const erp = createErpClient({
  baseUrl: 'https://tanssserver.example.com',
  token: process.env.TANSS_ERP_TOKEN!,
})

try {
  // GET /api/erp/v1/companies/{id}
  const company = await erp.companies.get(42)
  console.log(company.content)

  // Find a customer by its external ERP customer number
  const matches = await erp.companies.searchByDisplayId('C-10042')

  // Map ticket states/types before creating tickets via the sync
  const statuses = await erp.tickets.statuses()
  const types = await erp.tickets.types()

  // POST /api/erp/v1/tickets
  const ticket = await erp.tickets.create({
    // ... TicketSaveWritable fields
  })
} catch (error) {
  if (error instanceof ErpApiError) {
    console.error(error.message, error.status, error.body)
  } else {
    throw error
  }
}
```

Available resources: `companies`, `employees`, `departments`, `categories`,
`types`, `tickets`, `customers` (incl. `invoices`), `accountingTypes`,
`checklists`, `catalog` (`projects`, `stocks`), and `offers` (ERP selections).

> `erp.offers` (`/api/v1/offers/erpSelections*`) is the exception: those routes
> authenticate with a normal user session token, not the ERP-role token. Pass
> a user token to `createErpClient` when using that resource.


## 📜 License
TANSS API and specification are licensed under a proprietary license by [HUCK IT GmbH][huck-imprint].


<!-- links -->
[ci-badge]: https://github.com/serkonda7/tanss-api/actions/workflows/ci.yml/badge.svg
[ci-status]: https://github.com/serkonda7/tanss-api/actions/workflows/ci.yml
[npm-badge]: https://nodei.co/npm/tanss-api.png?style=shields&data=v&color=blue
[npm-date-badge]: https://nodei.co/npm/tanss-api.png?style=shields&data=u,d&color=blue
[npm-link]: https://www.npmjs.com/package/tanss-api
[huck-imprint]: https://www.tanss.de/en/imprint
