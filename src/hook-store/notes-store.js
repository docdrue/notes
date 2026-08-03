import { initStore } from './store';

let nextNoteId = 1;

const actions = {
    ADD_NOTE: (curState) => {
        const newNote = { id: nextNoteId, name: `Note ${nextNoteId}` };
        nextNoteId += 1;
        return { notes: [...(curState.notes || []), newNote] };
    },
};

const configureNotesStore = () => {
    initStore(actions, { notes: [] });
};

export default configureNotesStore;
