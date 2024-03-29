"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errHandle = (res) => {
    const headers = {
        'Access-Control-Allow-Methods': 'PATCH , GET, POST, OPTIONS, DELETE',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Content-Type': 'application/json',
    };
    res.writeHead(400, headers);
    res.write(JSON.stringify({
        status: 'false',
        message: '欄位未填寫正確，或無此 todo id',
    }));
    res.end();
};
exports.default = errHandle;
