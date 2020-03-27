// @ts-ignore
const ctx: Worker = self as any;

// Respond to message from parent thread
ctx.addEventListener('message', (e) => {
    if (!e) {
        return;
    }

    // @ts-ignore
    postMessage('TEST!!');
});
