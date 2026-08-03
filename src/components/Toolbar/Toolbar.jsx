import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

import { useStore } from '../../hook-store/store';

import classes from './Toolbar.module.css'

const toolbar = () => {
    const ToolbarButtons = () => {
        const [, dispatch] = useStore();

        const addNoteHandler = () => dispatch('ADD_NOTE');

        return (
            <div className={classes.Toolbar}>
                <button onClick={addNoteHandler}><FontAwesomeIcon icon={faPlus}/><span>Add</span></button>
                <button><FontAwesomeIcon icon={faEdit}/><span>Edit</span></button>
                <button><FontAwesomeIcon icon={faTrashAlt}/><span>Remove</span></button>
            </div>
        );
    };

    return <ToolbarButtons />;
};

export default toolbar;
