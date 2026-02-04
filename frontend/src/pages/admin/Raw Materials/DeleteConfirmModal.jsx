export default function DeleteConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl space-y-4">
        <h3 className="text-lg font-bold">Delete Raw Material?</h3>
        <p>This action cannot be undone.</p>

        <div className="flex justify-end gap-2">
          <button onClick={onCancel}>Cancel</button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
