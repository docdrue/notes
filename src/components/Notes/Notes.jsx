
import { useStore } from '../../hook-store/store';
import Note from './Note/Note'

const notes = () => {
    const NotesList = () => {
        const [state] = useStore();
        const notesList = state.notes || [];

        if (notesList.length === 0) return <div>No notes yet</div>;

        return notesList.map(note => (
            <Note key={note.id} name={note.name} />
        ));
    };

    return <NotesList />;
};

export default notes;
