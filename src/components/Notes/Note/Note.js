import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStickyNote } from '@fortawesome/free-solid-svg-icons'


const note = props => {
    return (
        <div>
            <FontAwesomeIcon icon={faStickyNote}/>
            <div>Note Name</div>
        </div>
    )
};

export default note;
