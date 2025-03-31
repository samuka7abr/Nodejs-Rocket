import http from 'http';

const users = []

const server = http.createServer((req, res) =>{
    const { method, url } = req;

    if(method === 'GET' && url === '/users'){
        return res
        .setHeader('Content-type', 'application/json')
        .end(JSON.stringify(users))
    }

    if(method === 'POST' && url === '/users'){
        users.push({
            id: 1,
            name: 'samuel',
            email: 'samuel@example.com'
        })
        return res.end('criação de usuário');
    }

    return res.end('hello world')
})

const PORT = 3333;
server.listen(PORT);
console.log(`Server is running on port 3333`)