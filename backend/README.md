# Invoice Parser

Parse credit card invoices and generate some metrics from it.
Currently, it only works with Sicredi invoices.

For now, it exposes an endpoint `/upload` that uploads the invoice, parse the expenses
and returns a json version of the expenses.

## Tools

- NodeJS;
- Typescript;
- Expresso
