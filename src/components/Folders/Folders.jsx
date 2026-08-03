import { useFetch } from "../../hook-store/fetch-hook";

import Folder from '../Folders/Folder/Folder';
//import { useStore } from "../../hook-store/store";

const folders = () => {
    const url = 'http://localhost:3001/directories';

    console.log('render folders')

    const FoldersList = () => {
        const { pending, result } = useFetch(url);
        if (pending) return <div>Loading...</div>;
        if (!result) return null;
        return result.map(item => (
            <Folder key={item.id} name={item.name}/>
        ));
    };

    return (
            <div>
                <FoldersList />
            </div>
        )

};

export default folders;
