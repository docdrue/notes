
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStickyNote } from '@fortawesome/free-solid-svg-icons'


const note = () => {
    return (
        <div>
            <FontAwesomeIcon icon={faStickyNote}/>
            <div>Note Name</div>
        </div>
    )
};

export default note;
