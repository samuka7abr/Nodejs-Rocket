import { Database } from '../database/db.js';
import { parse } from 'url';
import { Readable } from 'stream';

const db = new Database();

export const routes = [
  {
    method: 'POST',
    path: '/tasks',
    handler: async (req, res) => {
      const body = await getBody(req);
      const { title, description } = body;

      if (!title || !description) {
        return res.writeHead(400).end('title and description are required');
      }

      const task = db.insert({ title, description });
      res.writeHead(201).end(JSON.stringify(task));
    },
  },

  {
    method: 'GET',
    path: '/tasks',
    handler: (req, res) => {
      const { query } = parse(req.url, true);
      const tasks = db.select(query);
      res.writeHead(200).end(JSON.stringify(tasks));
    },
  },

  {
    method: 'PUT',
    path: '/tasks',
    handler: async (req, res) => {
      const id = req.url.split('/')[2];
      const task = db.select().find((t) => t.id === id);
      if (!task) return res.writeHead(404).end('Task not found');

      const body = await getBody(req);
      const { title, description } = body;
      if (!title && !description)
        return res.writeHead(400).end('title or description is required');

      const updated = db.update(id, { title, description });
      res.writeHead(204).end();
    },
  },

  {
    method: 'DELETE',
    path: '/tasks',
    handler: (req, res) => {
      const id = req.url.split('/')[2];
      const success = db.delete(id);
      if (!success) return res.writeHead(404).end('Task not found');

      res.writeHead(204).end();
    },
  },

  {
    method: 'PATCH',
    path: '/tasks',
    handler: (req, res) => {
      const id = req.url.split('/')[2];
      const task = db.toggleComplete(id);
      if (!task) return res.writeHead(404).end('Task not found');

      res.writeHead(204).end();
    },
  },

  {
    method: 'POST',
    path: '/tasks/import',
    handler: async (req, res) => {
      const buffers = [];

      for await (const chunk of req) {
        buffers.push(chunk);
      }

      const content = Buffer.concat(buffers).toString();
      const lines = content.split('\n').slice(1);

      for (const line of lines) {
        const [title, description] = line.split(',');
        if (!title || !description) continue;

        db.insert({ title: title.trim(), description: description.trim() });
      }

      res.writeHead(201).end();
    },
  },
];

async function getBody(req) {
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  return JSON.parse(Buffer.concat(buffers).toString());
}
