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


## 📜 License
TANSS API and specification are licensed under a proprietary license by [HUCK IT GmbH][huck-imprint].


<!-- links -->
[ci-badge]: https://github.com/serkonda7/tanss-api/actions/workflows/ci.yml/badge.svg
[ci-status]: https://github.com/serkonda7/tanss-api/actions/workflows/ci.yml
[npm-badge]: https://nodei.co/npm/tanss-api.png?style=shields&data=v&color=blue
[npm-date-badge]: https://nodei.co/npm/tanss-api.png?style=shields&data=u,d&color=blue
[npm-link]: https://www.npmjs.com/package/tanss-api
[huck-imprint]: https://www.tanss.de/en/imprint
