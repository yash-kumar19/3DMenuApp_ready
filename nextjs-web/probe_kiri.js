
const https = require('https');

const KIRI_KEY = 'kiri_8ZIwKafog7q4JYEOdHEVSxvEGEMeRzjL2fWv3dOa9eI';
const TASK_ID = 'c0391cfb59f0f5ef15a';

function check(url) {
    return new Promise((resolve) => {
        const options = {
            headers: { 'Authorization': `Bearer ${KIRI_KEY}` }
        };

        console.log(`\nChecking: ${url}`);
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(`Status: ${res.statusCode}`);
                console.log(`Body: ${data.substring(0, 200)}...`); // First 200 chars
                resolve();
            });
        }).on('error', (e) => {
            console.error(`Error: ${e.message}`);
            resolve();
        });
    });
}

async function run() {
    // 1. Try without 'open'
    await check(`https://api.kiriengine.app/api/v1/task/${TASK_ID}`);

    // 2. Try 'photo/group' without 'open'
    await check(`https://api.kiriengine.app/api/v1/photo/group/${TASK_ID}`);

    // 3. Try 'cloud/task' (common in some APIs)
    await check(`https://api.kiriengine.app/api/v1/cloud/task/${TASK_ID}`);

    // 4. Try just /task (no v1)
    await check(`https://api.kiriengine.app/api/task/${TASK_ID}`);
}

run();
