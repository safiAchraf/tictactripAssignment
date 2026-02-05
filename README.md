# Text Justify API

API REST for text justification (80 chars per line).

## Setup

```bash
npm install
npm run dev
```

## Tests

```bash
npm test
```

## Usage

### Get Token

```bash
curl -X POST http://localhost:3000/api/token \
  -H "Content-Type: application/json" \
  -d '{"email": "foo@bar.com"}'
```

### Justify Text

```bash
curl -X POST http://localhost:3000/api/justify \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: text/plain" \
  -d "Your text here..."
```

## Endpoints

| Method | Endpoint       | Description    |
| ------ | -------------- | -------------- |
| POST   | `/api/token`   | Get auth token |
| POST   | `/api/justify` | Justify text   |

## Limits

- Line length: 80 chars
- Rate limit: 80,000 words/day per token
- Error 402 when limit exceeded
