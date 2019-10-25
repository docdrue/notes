import { useEffect } from 'react';
import { initStore } from "./store";

const configureStore = () => {
    const foldersList = [];
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const result = await fetch(
    //             'http://localhost:3001/directories',
    //         );
    //         // setData(result.data);
    //     };
    //     fetchData();
    // }, []);
    // fetch('http://localhost:3001/directories')
    //     .then(res => {
    //         return res.json();
    //     })
    //     .then(resData => {
    //         resData.map(item => {
    //             foldersList.push(item)
    //         });
    //
    //     });
    // const actions = {
    //     GET_FOLDERS: (curState) => {
    //         return {folders: foldersList}
    //     },
    //     ADD_FOLDER: (curState, parentId) => {
    //         return { folders: curState.folders}
    //     }
    // };
    // initStore(actions, {folders: foldersList})
};

export default configureStore;
