import { useEffect, useReducer } from 'react';

const initialTask = {
    started: false,
    pending: true,
    error: null,
    result: null,
    start: null,
    abort: null,
};

const reducer = (task, action) => {
    switch (action.type) {
        case 'init':
            return initialTask;
        case 'ready':
            return {
                ...task,
                start: action.start,
                abort: action.abort,
            };
        case 'start':
            return {
                ...task,
                started: true,
            };
        case 'result':
            return {
                ...task,
                pending: false,
                result: action.result,
            };
        case 'error':
            return {
                ...task,
                pending: false,
                error: action.error,
            };
        default:
            throw new Error(`unexpected action type: ${action.type}`);
    }
};

const useAsyncTask = (func, deps) => {
    const [state, dispatch] = useReducer(reducer, initialTask);
    useEffect(() => {
        let dispatchSafe = action => dispatch(action);
        let abortController = null;
        const start = async () => {
            if (abortController) return;
            abortController = new AbortController();
            dispatchSafe({ type: 'start' });
            try {
                const result = await func(abortController);
                dispatchSafe({ type: 'result', result });
            } catch (e) {
                dispatchSafe({ type: 'error', error: e });
            }
        };
        const abort = () => {
            if (abortController) {
                abortController.abort();
            }
        };
        dispatch({ type: 'ready', start, abort });
        const cleanup = () => {
            dispatchSafe = () => null; // avoid to dispatch after stopped
            dispatch({ type: 'init' });
        };
        return cleanup;
    }, deps);
    return state;
};

const useAsyncRun = (asyncTask) => {
    const start = asyncTask && asyncTask.start;
    const abort = asyncTask && asyncTask.abort;
    useEffect(() => {
        if (start) start();
        const cleanup = () => {
            if (abort) abort();
        };
        return cleanup;
    }, [start]);
};

const defaultInit = {};
const defaultReadBody = body => body.json();

const useAsyncTaskFetch = (
    input,
    init = defaultInit,
    readBody = defaultReadBody,
) => useAsyncTask(
    async (abortController) => {
        const response = await fetch(input, {
            signal: abortController.signal,
            ...init,
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const body = await readBody(response);
        return body;
    },
    [input, init, readBody],
);

export const useFetch = (...args) => {
    const asyncTask = useAsyncTaskFetch(...args);
    useAsyncRun(asyncTask);
    return asyncTask;
};
