class test {
    static func(username, id, login) {
        if (username === 'jr' && id === 2222 && login === '1r2') return true;
        else throw 'WTF';
    }
}

function errorHandler(foo, params) {
    try {
        const a = foo(params);
        return a;
    } catch (error) {
        console.log(error);
        return false;
    }
}


const user = errorHandler(test.func, {username: 'jr', id: 2222, login: '1r2'});
if (user === false) console.log('BAD');
else console.log(user);

const user2 = errorHandler(test.func, 2);
if (user2 === false) console.log('BAD');
else console.log(user2);