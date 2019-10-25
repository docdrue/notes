import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons'
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons'

const folder = props => {
    return (
        <div>
            <FontAwesomeIcon icon={faFolder}/>
            <span>{props.name}</span>
        </div>
    )
};

export default folder;
