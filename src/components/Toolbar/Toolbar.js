import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

import classes from './Toolbar.css'

const toolbar = props => {
    return (
        <div className={classes.Toolbar}>
            <button><FontAwesomeIcon icon={faPlus}/><span>Add</span></button>
            <button><FontAwesomeIcon icon={faEdit}/><span>Edit</span></button>
            <button><FontAwesomeIcon icon={faTrashAlt}/><span>Remove</span></button>
        </div>
    )
};

export default toolbar;
