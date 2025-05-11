module.exports = {

"[project]/src/lib/api-client.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "apiClient": (()=>apiClient)
});
class ApiClient {
    async fetch(endpoint, options = {}) {
        const { method = "GET", body, headers = {} } = options;
        const defaultHeaders = {
            "Content-Type": "application/json",
            ...headers
        };
        const response = await fetch(endpoint, {
            method,
            body: JSON.stringify(body),
            headers: defaultHeaders
        });
        console.log(response);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    }
    async getProducts() {
        return this.fetch("/api/products");
    }
    async getProduct(id) {
        return this.fetch("/api/products/" + id, {
            method: "POST"
        });
    }
}
const apiClient = new ApiClient();
}}),
"[project]/src/app/page.tsx [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const e = new Error(`Could not parse module '[project]/src/app/page.tsx'

Unexpected token `div`. Expected jsx identifier`);
e.code = 'MODULE_UNPARSEABLE';
throw e;}}),

};

//# sourceMappingURL=src_a297d033._.js.map