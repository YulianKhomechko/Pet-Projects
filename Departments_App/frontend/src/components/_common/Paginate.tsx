import ReactPaginate from 'react-paginate';
import { useLocation, useSearchParams } from 'react-router-dom';

export default function Paginate({ pageCount }: { pageCount: number }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const { search } = useLocation();

    const handlePageClick = ({ selected }: { selected: number }) => {
        setSearchParams({ ...searchParams, page: String(selected + 1) });
    };

    if (pageCount < 2) {
        return <></>;
    }

    return (
        <ReactPaginate
            forcePage={
                new URLSearchParams(search).get('page') ? Number(new URLSearchParams(search).get('page')!) - 1 : 0
            }
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="<"
            renderOnZeroPageCount={undefined}
            className="flex justify-center items-center gap-4"
            pageClassName="text-3xl"
            activeClassName="text-blue-500"
            previousClassName="text-2xl"
            nextClassName="text-2xl"
            disabledClassName="text-gray-300"
        />
    );
}
