import * as http from 'http';
import { v4 as uuidv4 } from 'uuid';
import errHandle from './errHandle';
import { Todo, Path, Method } from './type';

const todos: Array<Todo> = [];

const requestListener: http.RequestListener = (req, res) => {
  console.log('connected');
  const headers = {
    'Access-Control-Allow-Methods': 'PATCH , GET, POST, OPTIONS, DELETE',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Content-Type': 'application/json',
  };

  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  if (req.url === Path.Home && req.method === Method.GET) {
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        data: [],
      })
    );
    res.end();
  } else if (req.url === '/todos' && req.method === Method.GET) {
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        data: todos,
      })
    );
    res.end();
  } else if (req.url === '/todos' && req.method === Method.POST) {
    req.on('end', () => {
      try {
        const { title } = JSON.parse(body);
        if (!title) throw new Error();
        const todo: Todo = {
          id: uuidv4(),
          title,
        };
        todos.push(todo);
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: 'success',
            data: todos,
          })
        );
        res.end();
      } catch (error) {
        errHandle(res);
      }
    });
  } else if (req.method === Method.OPTIONS) {
    res.writeHead(200, headers);
    res.end();
  } else if (req.url === '/todos' && req.method === Method.DELETE) {
    todos.length = 0;
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        data: todos,
      })
    );
    res.end();
  } else if (req.url?.startsWith('/todos/') && req.method === Method.DELETE) {
    const id = req.url.split('/').pop();
    const index = todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      todos.splice(index, 1);
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: 'success',
          data: todos,
        })
      );
    } else {
      errHandle(res);
    }
    res.end();
  } else if (req.url?.startsWith('/todos/') && req.method === Method.PATCH) {
    req.on('end', () => {
      try {
        const { title } = JSON.parse(body);
        const id = req.url?.split('/').pop();
        console.log(title, id);
        const index = todos.findIndex((todo) => todo.id === id);
        if (!title && index === -1) throw new Error();
        todos[index].title = title;
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: 'success',
            data: todos,
          })
        );
        res.end();
      } catch {
        errHandle(res);
      }
    });
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: 'false',
        message: '無此網站路由',
      })
    );
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(8080);
