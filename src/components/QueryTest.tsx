import { useDeleteTokenMutation, useGetTokensQuery } from "../../data/tokenApi";

export const QueryTest = () => {
  const { data, isLoading, error, isError } = useGetTokensQuery();
  const [
    deleteToken,
    { isError: deleteFailed, isLoading: isDeleting, error: deleteError },
  ] = useDeleteTokenMutation();

  return (
    <div>
      {isError ? (
        <span>Loading data failed with error{JSON.stringify(error)}</span>
      ) : deleteFailed ? (
        <span>Delete failed with error: {JSON.stringify(deleteError)}</span>
      ) : isLoading || isDeleting ? (
        <span>Loading...</span>
      ) : isDeleting ? (
        <span>Deleting...</span>
      ) : (
        <>
          <span>{JSON.stringify(data)}</span>
          <button
            onClick={async () => {
              if (data && data.length > 0) await deleteToken(data[0].id);
            }}
          >
            Delete first
          </button>
        </>
      )}
    </div>
  );
};
