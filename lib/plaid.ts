import {Configuration, PlaidApi, PlaidEnvironments}from 'plaid'

const configuration=new Configuration({
    basePath:PlaidEnvironments.sandbox,
    baseOptions: {
        // Plaid expects the client id and secret to be included in headers.
        // Put them under `headers` so the OpenAPI client sends them correctly.
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET,
        },
    }
})

export const plaidClient=new PlaidApi(configuration);