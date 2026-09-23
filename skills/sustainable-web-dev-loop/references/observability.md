# Observability

Absorbed from mizchi's `opentelemetry`, `otel-node`, and `cloudflare-workers-otel-utels`.

## Pick the signal first

| Signal | Answers | Cost |
|---|---|---|
| Metrics | how often, how fast (dashboards, alerts) | low |
| Logs | what happened (errors, audit) | medium |
| Traces | why it was slow or failed, across services | high |

Do not use traces where metrics suffice.

## Span and attribute design

- Name spans `<verb> <noun>` or `<system>.<operation>`. Never put IDs or values in span names or metric labels;
  they are cardinality keys. Put them in attributes, and normalize routes (`/orders/:id`, unmatched → one bucket).
- Use OpenTelemetry semantic-convention attribute names (`http.*`, `db.*`, `rpc.*`) so backends understand them.
- On error call both `span.recordException(err)` and `span.setStatus({ code: SpanStatusCode.ERROR })`;
  `recordException` alone leaves the span marked successful.
- Always end spans (callback form with `finally { span.end() }`). Use `BatchSpanProcessor` in production.

## Propagation and sampling

- Extract W3C `traceparent` on incoming requests before starting the server span, and inject it on every
  outgoing call. Missing either splits one request into orphan root traces.
- Default sampler: `ParentBased(root: TraceIdRatioBased(r))`, which respects the upstream decision. Use
  collector tail sampling when every error trace must be kept.

## Node.js setup

- Initialize the SDK before the app: `node --import ./otel.js server.js`. With SDK 2.x, build the resource with
  `resourceFromAttributes({ [ATTR_SERVICE_NAME]: … })` (`@opentelemetry/resources`,
  `@opentelemetry/semantic-conventions`); the older `new Resource(...)` / `SEMRESATTRS_*` names are gone.
- Add only the `@opentelemetry/instrumentation-*` packages you need.
- **Bundling pitfall:** auto-instrumentation patches modules at load time. When esbuild, Vite, or SWC bundles an
  instrumented library into an ESM output, nothing gets patched and **no spans are produced, with no error**.
  Fixes: keep instrumented libraries external to the bundle, emit CJS, run unbundled, or create spans manually
  in middleware (for Hono, check `@hono/otel` first).
- To confirm spans leave the process, temporarily add the collector's `debug` exporter.

## Edge runtimes and error tracking

On runtimes without Node hooks (e.g. Cloudflare Workers), instrument at the fetch boundary by wrapping the
handler. Make each wrapper a no-op unless its env vars are set, and log slow database queries as structured
warnings even without an OTLP backend, so the cheapest signal exists from the first deploy. Send one error event
per 5xx or thrown exception to the error tracker.

Details and a runnable Workers runtime: [cloudflare-workers-otel-utels](https://github.com/mizchi/skills/blob/a3f2f1bac20fc500c2688ffe6ca4ce048d0cfedc/cloudflare-workers-otel-utels/SKILL.md),
[opentelemetry](https://github.com/mizchi/skills/blob/a3f2f1bac20fc500c2688ffe6ca4ce048d0cfedc/opentelemetry/SKILL.md).
