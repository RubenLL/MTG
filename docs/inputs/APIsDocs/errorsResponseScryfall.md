# Error Objects

An **Error object** represents a failure to find information or understand the input you provided to the API.  
Error objects are always transmitted with the appropriate **4XX** or **5XX** HTTP status code.

---

## 🧩 Properties

| Property     | Type    | Nullable | Details                                                                                                                                                                                                                                                           |
| ------------ | ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **status**   | Integer |          | An integer HTTP status code for this error.                                                                                                                                                                                                                       |
| **code**     | String  |          | A computer-friendly string representing the appropriate HTTP status code.                                                                                                                                                                                         |
| **details**  | String  |          | A human-readable string explaining the error.                                                                                                                                                                                                                     |
| **type**     | String  | ✅       | A computer-friendly string that provides additional context for the main error.<br><br>For example, an endpoint may generate HTTP 404 errors for different kinds of input. This field provides a label for the specific kind of 404 failure, such as `ambiguous`. |
| **warnings** | Array   | ✅       | If your input also generated non-failure warnings, they will be provided as human-readable strings in this array.                                                                                                                                                 |

---

## 📘 Example Request

Get an API error with warnings:

```http
GET https://api.scryfall.com/cards/search?q=is%3Aslick+cmc%3Ecmc
```

## Example Error Response

```json
HTTP 400 error
Content-Type: application/json; charset=utf-8

{
  "object": "error",
  "code": "bad_request",
  "status": 400,
  "warnings": [
    "Invalid expression “is:slick” was ignored. Checking if cards are “slick” is not supported",
    "Invalid expression “cmc>cmc” was ignored. The sides of your comparison must be different."
  ],
  "details": "All of your terms were ignored."
}
```

## HTTPCodes

| HTTP Code | Description           |
| --------- | --------------------- |
| 200       | OK                    |
| 400       | Bad Request           |
| 401       | Unauthorized          |
| 403       | Forbidden             |
| 404       | Not Found             |
| 429       | Too Many Requests     |
| 500       | Internal Server Error |
| 502       | Bad Gateway           |
| 503       | Service Unavailable   |
| 504       | Gateway Timeout       |
