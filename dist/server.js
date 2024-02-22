"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const uuid_1 = require("uuid");
const errHandle_1 = __importDefault(require("./errHandle"));
const type_1 = require("./type");
const todos = [];
const requestListener = (req, res) => {
    var _a, _b;
    const headers = {
        'Access-Control-Allow-Methods': 'PATCH , GET, POST, OPTIONS, DELETE',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Content-Type': 'application/json',
    };
    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });
    if (req.url === type_1.Path.Home && req.method === type_1.Method.GET) {
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            status: 'success',
            data: [],
        }));
        res.end();
    }
    else if (req.url === '/todos' && req.method === type_1.Method.GET) {
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            status: 'success',
            data: todos,
        }));
        res.end();
    }
    else if (req.url === '/todos' && req.method === type_1.Method.POST) {
        req.on('end', () => {
            try {
                const { title } = JSON.parse(body);
                if (!title)
                    throw new Error();
                const todo = {
                    id: (0, uuid_1.v4)(),
                    title,
                };
                todos.push(todo);
                res.writeHead(200, headers);
                res.write(JSON.stringify({
                    status: 'success',
                    data: todos,
                }));
                res.end();
            }
            catch (error) {
                (0, errHandle_1.default)(res);
            }
        });
    }
    else if (req.method === type_1.Method.OPTIONS) {
        res.writeHead(200, headers);
        res.end();
    }
    else if (req.url === '/todos' && req.method === type_1.Method.DELETE) {
        todos.length = 0;
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            status: 'success',
            data: todos,
        }));
        res.end();
    }
    else if (((_a = req.url) === null || _a === void 0 ? void 0 : _a.startsWith('/todos/')) && req.method === type_1.Method.DELETE) {
        const id = req.url.split('/').pop();
        const index = todos.findIndex((todo) => todo.id === id);
        if (index !== -1) {
            todos.splice(index, 1);
            res.writeHead(200, headers);
            res.write(JSON.stringify({
                status: 'success',
                data: todos,
            }));
        }
        else {
            (0, errHandle_1.default)(res);
        }
        res.end();
    }
    else if (((_b = req.url) === null || _b === void 0 ? void 0 : _b.startsWith('/todos/')) && req.method === type_1.Method.PATCH) {
        req.on('end', () => {
            var _a;
            try {
                const { title } = JSON.parse(body);
                const id = (_a = req.url) === null || _a === void 0 ? void 0 : _a.split('/').pop();
                console.log(title, id);
                const index = todos.findIndex((todo) => todo.id === id);
                if (!title && index === -1)
                    throw new Error();
                todos[index].title = title;
                res.writeHead(200, headers);
                res.write(JSON.stringify({
                    status: 'success',
                    data: todos,
                }));
                res.end();
            }
            catch (_b) {
                (0, errHandle_1.default)(res);
            }
        });
    }
    else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            status: 'false',
            message: '無此網站路由',
        }));
        res.end();
    }
};
const server = http.createServer(requestListener);
server.listen(8080);
