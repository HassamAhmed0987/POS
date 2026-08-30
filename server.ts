import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const DB_FILE = path.join(process.cwd(), "db.json");

interface DBData {
  products: any[];
  categories: any[];
  customers: any[];
  orders: any[];
  orderItems: any[];
  settings: Record<string, any>;
}

function loadDB(): DBData {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading db.json:", err);
  }
  return {
    products: [],
    categories: [],
    customers: [],
    orders: [],
    orderItems: [],
    settings: {},
  };
}

let dbCache: DBData = loadDB();

function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbCache, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving db.json:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper for generic collection routing
  const collections = ["products", "categories", "customers", "orders", "orderItems"] as const;

  // Mount collection routes for both root and /api prefixes
  const registerCollectionRoutes = (prefix: string) => {
    collections.forEach((col) => {
      const basePath = `${prefix}/${col}`;

      // GET all / filter
      app.get(basePath, (req: Request, res: Response) => {
        let items = [...(dbCache[col] || [])];
        const query = req.query;

        // Filtering by query fields
        Object.keys(query).forEach((key) => {
          const val = query[key];
          if (key === "q" && typeof val === "string") {
            const searchLower = val.toLowerCase();
            items = items.filter((item) =>
              Object.values(item).some(
                (field) => typeof field === "string" && field.toLowerCase().includes(searchLower)
              )
            );
          } else if (key === "_sort") {
            const sortField = val as string;
            const sortOrder = query._order === "asc" ? 1 : -1;
            items.sort((a, b) => {
              if (a[sortField] < b[sortField]) return -1 * sortOrder;
              if (a[sortField] > b[sortField]) return 1 * sortOrder;
              return 0;
            });
          } else if (!key.startsWith("_")) {
            items = items.filter((item) => String(item[key]) === String(val));
          }
        });

        res.json(items);
      });

      // GET by id
      app.get(`${basePath}/:id`, (req: Request, res: Response) => {
        const { id } = req.params;
        const item = (dbCache[col] || []).find((i) => String(i.id) === String(id));
        if (!item) {
          return res.status(404).json({ error: `${col} item with id ${id} not found` });
        }
        res.json(item);
      });

      // POST create
      app.post(basePath, (req: Request, res: Response) => {
        const newItem = req.body;
        if (!newItem.id) {
          const prefixChar = col === "products" ? "P" : col === "categories" ? "C" : col === "customers" ? "CU" : col === "orders" ? "ORD" : "OI";
          newItem.id = `${prefixChar}${Date.now()}`;
        }
        if (!newItem.createdAt) {
          newItem.createdAt = new Date().toISOString();
        }
        if (!dbCache[col]) {
          dbCache[col] = [];
        }
        dbCache[col].push(newItem);
        saveDB();
        res.status(201).json(newItem);
      });

      // PUT / PATCH update
      const updateHandler = (req: Request, res: Response) => {
        const { id } = req.params;
        const index = (dbCache[col] || []).findIndex((i) => String(i.id) === String(id));
        if (index === -1) {
          return res.status(404).json({ error: `Not found` });
        }
        dbCache[col][index] = { ...dbCache[col][index], ...req.body };
        saveDB();
        res.json(dbCache[col][index]);
      };

      app.put(`${basePath}/:id`, updateHandler);
      app.patch(`${basePath}/:id`, updateHandler);

      // DELETE
      app.delete(`${basePath}/:id`, (req: Request, res: Response) => {
        const { id } = req.params;
        const initialLength = (dbCache[col] || []).length;
        dbCache[col] = (dbCache[col] || []).filter((i) => String(i.id) !== String(id));
        if (dbCache[col].length === initialLength) {
          return res.status(404).json({ error: `Not found` });
        }
        // If an order is deleted, also cascade delete its orderItems
        if (col === "orders") {
          dbCache.orderItems = (dbCache.orderItems || []).filter((oi) => String(oi.orderId) !== String(id));
        }
        saveDB();
        res.status(200).json({ success: true, id });
      });
    });

    // Settings routes
    const settingsPath = `${prefix}/settings`;
    app.get(settingsPath, (req: Request, res: Response) => {
      res.json(dbCache.settings || {});
    });

    const updateSettings = (req: Request, res: Response) => {
      dbCache.settings = { ...(dbCache.settings || {}), ...req.body };
      saveDB();
      res.json(dbCache.settings);
    };

    app.put(settingsPath, updateSettings);
    app.patch(settingsPath, updateSettings);
  };

  // Register both /api/* and root collection paths (e.g., /products and /api/products)
  registerCollectionRoutes("/api");
  registerCollectionRoutes("");

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
