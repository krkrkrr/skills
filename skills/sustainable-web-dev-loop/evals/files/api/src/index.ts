import { serve } from "@hono/node-server";
import { Hono } from "hono";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const app = new Hono();

app.get("/orders/:id", async (c) => {
  const { rows } = await pool.query("SELECT * FROM orders WHERE id = $1", [c.req.param("id")]);
  return c.json(rows[0] ?? null);
});

serve({ fetch: app.fetch, port: 8080 });
